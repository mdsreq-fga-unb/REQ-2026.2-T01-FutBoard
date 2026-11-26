"""Views da API de usuários do FutBoard."""

from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_GET
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PerfilAcesso
from .serializers import CadastroSerializer


@require_GET
@never_cache
def csrf_token(request):
    """Emite o cookie e o token para o cadastro público."""
    return JsonResponse({"csrfToken": get_token(request)})


@method_decorator(csrf_protect, name="dispatch")
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
