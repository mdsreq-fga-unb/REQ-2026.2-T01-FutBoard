"""Views da API de usuários do FutBoard."""

from django.contrib.auth import authenticate
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenBlacklistView, TokenRefreshView

from .backends import ContaSemAcesso
from .models import PerfilAcesso
from .serializers import (
    CadastroSerializer,
    LoginSerializer,
    LogoutSerializer,
    RenovarTokenSerializer,
    dados_usuario,
)
from .throttles import LoginThrottle


class CadastroView(APIView):
    """US27: Permite solicitar a criação de uma conta no FutBoard."""

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = CadastroSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(
            {
                "mensagem": (
                    "Cadastro realizado com sucesso. "
                    "Aguarde a aprovação do treinador."
                ),
                "situacao": PerfilAcesso.Situacao.PENDENTE,
            },
            status=status.HTTP_201_CREATED,
        )


@method_decorator(never_cache, name="dispatch")
class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    throttle_classes = [LoginThrottle]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        dados = serializer.validated_data

        try:
            usuario = authenticate(request, email=dados["email"], password=dados["senha"])
        except ContaSemAcesso as erro:
            return Response({"erro": str(erro)}, status=status.HTTP_403_FORBIDDEN)

        if usuario is None:
            return Response(
                {"erro": "E-mail ou senha inválidos."}, status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(usuario)
        return Response({
            "mensagem": "Login realizado com sucesso.",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "usuario": dados_usuario(usuario),
        })


@method_decorator(never_cache, name="dispatch")
class RenovarTokenView(TokenRefreshView):
    serializer_class = RenovarTokenSerializer


@method_decorator(never_cache, name="dispatch")
class LogoutView(TokenBlacklistView):
    serializer_class = LogoutSerializer


@method_decorator(never_cache, name="dispatch")
class MeView(APIView):
    def get(self, request):
        return Response(dados_usuario(request.user))
