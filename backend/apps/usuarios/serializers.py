from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.db.models import Q
from rest_framework import serializers
from rest_framework.exceptions import APIException
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.serializers import TokenBlacklistSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from rest_framework_simplejwt.tokens import RefreshToken

from .models import PerfilAcesso
from .permissions import exigir_acesso


class CampoTexto(serializers.CharField):
    def to_internal_value(self, data):
        if not isinstance(data, str):
            self.fail("invalid")
        return super().to_internal_value(data)


class CampoNomeCompleto(CampoTexto):
    def to_internal_value(self, data):
        return " ".join(super().to_internal_value(data).split())


class CampoEmailNormalizado(serializers.EmailField):
    def to_internal_value(self, data):
        email = super().to_internal_value(data)
        return get_user_model().normalize_username(email).lower()


class CadastroSerializer(serializers.Serializer):
    """Valida os dados e realiza a criação de contas no FutBoard."""

    nome_completo = CampoNomeCompleto(max_length=150)

    email = CampoEmailNormalizado(max_length=150)

    senha = CampoTexto(
        write_only=True,
        trim_whitespace=False,
        style={"input_type": "password"},
    )

    confirmacao_senha = CampoTexto(
        write_only=True,
        trim_whitespace=False,
        style={"input_type": "password"},
    )

    @staticmethod
    def email_em_uso(email):
        return get_user_model().objects.filter(
            Q(username__iexact=email) | Q(email__iexact=email)
        ).exists()

    def validate_email(self, email):
        if self.email_em_uso(email):
            raise serializers.ValidationError("Este e-mail já está cadastrado.")
        return email

    def validate(self, attrs):
        senha = attrs["senha"]
        confirmacao = attrs["confirmacao_senha"]

        if senha != confirmacao:
            raise serializers.ValidationError({
                "confirmacao_senha": "As senhas não coincidem."
            })

        primeiro_nome, _, sobrenome = attrs["nome_completo"].partition(" ")
        usuario = get_user_model()(
            username=attrs["email"],
            email=attrs["email"],
            first_name=primeiro_nome,
            last_name=sobrenome,
        )

        try:
            validate_password(senha, user=usuario)

        except ValidationError as erro:
            raise serializers.ValidationError({
                "senha": erro.messages
            }) from erro

        return attrs

    def create(self, validated_data):
        User = get_user_model()

        nome = validated_data["nome_completo"]
        email = validated_data["email"]
        senha = validated_data["senha"]

        primeiro_nome, _, sobrenome = nome.partition(" ")

        try:
            with transaction.atomic():
                usuario = User.objects.create_user(
                    username=email,
                    email=email,
                    password=senha,
                    first_name=primeiro_nome,
                    last_name=sobrenome,
                    is_active=False,
                )

                PerfilAcesso.objects.create(
                    usuario=usuario,
                    nome_completo=nome,
                    situacao=PerfilAcesso.Situacao.PENDENTE,
                )

        except IntegrityError as erro:
            if self.email_em_uso(email):
                raise serializers.ValidationError({
                    "email": "Este e-mail já está cadastrado."
                }) from erro
            raise APIException("Não foi possível concluir o cadastro.") from erro

        return usuario


class LoginSerializer(serializers.Serializer):
    email = CampoEmailNormalizado(max_length=254)
    senha = CampoTexto(write_only=True, trim_whitespace=False, style={"input_type": "password"})


def bloquear_refresh(token):
    refresh = RefreshToken(token)
    # Serializa renovação e logout do mesmo refresh antes de conferir a blacklist novamente.
    try:
        OutstandingToken.objects.select_for_update().get(jti=refresh[api_settings.JTI_CLAIM])
    except OutstandingToken.DoesNotExist as erro:
        raise TokenError("Token de renovação inválido.") from erro
    return refresh


class RenovarTokenSerializer(TokenRefreshSerializer):
    @transaction.atomic
    def validate(self, attrs):
        refresh = bloquear_refresh(attrs["refresh"])
        exigir_acesso(JWTAuthentication().get_user(refresh))
        return super().validate(attrs)


class LogoutSerializer(TokenBlacklistSerializer):
    @transaction.atomic
    def validate(self, attrs):
        bloquear_refresh(attrs["refresh"])
        return super().validate(attrs)


def dados_usuario(usuario):
    perfil = getattr(usuario, "perfil_acesso", None)
    nome = perfil.nome_completo if perfil else usuario.get_full_name() or usuario.get_username()
    return {
        "id": usuario.pk,
        "nome_completo": nome,
        "email": usuario.email,
        "situacao": perfil.situacao if perfil else PerfilAcesso.Situacao.APROVADA,
        "administrador": usuario.is_superuser,
    }
