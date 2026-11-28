from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

from .permissions import motivo_acesso_negado


class ContaSemAcesso(Exception):
    """Credenciais válidas de uma conta sem autorização para entrar."""


class EmailBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None):
        if email is None or password is None:
            return None

        Usuario = get_user_model()
        try:
            usuario = Usuario.objects.get(email__iexact=email)
        except (Usuario.DoesNotExist, Usuario.MultipleObjectsReturned):
            # Assim como o ModelBackend, executa um hash também se não houver usuário.
            Usuario().set_password(password)
            return None

        if not usuario.check_password(password):
            return None

        motivo = motivo_acesso_negado(usuario)
        if motivo:
            raise ContaSemAcesso(motivo)
        return usuario
