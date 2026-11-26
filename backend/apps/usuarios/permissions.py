from django.contrib.auth import SESSION_KEY, logout
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission

from .models import PerfilAcesso

MENSAGENS_SITUACAO = {
    PerfilAcesso.Situacao.PENDENTE: "Seu cadastro ainda está aguardando aprovação do treinador.",
    PerfilAcesso.Situacao.RECUSADA: "Sua solicitação de acesso não foi aprovada.",
    PerfilAcesso.Situacao.REVOGADA: "Seu acesso ao FutBoard foi revogado.",
}


def motivo_acesso_negado(usuario):
    perfil = getattr(usuario, "perfil_acesso", None)
    if perfil is not None and perfil.situacao != PerfilAcesso.Situacao.APROVADA:
        return MENSAGENS_SITUACAO.get(perfil.situacao, "Sua conta não está autorizada.")
    if not usuario.is_active:
        return "Sua conta está desativada."
    if perfil is None and not usuario.is_superuser:
        return "Sua conta não está autorizada."
    return None


class IsAuthenticatedAndApproved(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            if SESSION_KEY in request.session:
                logout(request)
                raise PermissionDenied({
                    "erro": "Sua conta não está autorizada.", "codigo": "acesso_revogado"
                })
            return False

        motivo = motivo_acesso_negado(request.user)
        if motivo:
            logout(request)
            raise PermissionDenied({"erro": motivo, "codigo": "acesso_revogado"})
        return True
