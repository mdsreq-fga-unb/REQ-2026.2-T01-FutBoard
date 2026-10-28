"""Roteamento raiz de URLs da API do FutBoard."""
from django.contrib import admin
from django.db import connections
from django.db.utils import OperationalError
from django.urls import include, path
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def api_root(request):
    """Ponto de entrada informativo da API RESTful do FutBoard."""
    return Response(
        {
            "name": "FutBoard API",
            "message": "API FutBoard disponível.",
            "endpoints": {
                "health": "/api/health/",
                "ciclos": "/api/ciclos/",
                "treinos": "/api/treinos/",
                "usuarios": "/api/usuarios/",
            },
        }
    )


@api_view(["GET"])
def health_check(request):
    """Verifica a disponibilidade da API e a conectividade com o banco de dados."""
    db_status = "connected"
    http_status = status.HTTP_200_OK
    try:
        connections["default"].ensure_connection()
    except OperationalError:
        db_status = "unreachable"
        http_status = status.HTTP_503_SERVICE_UNAVAILABLE

    return Response(
        {
            "status": "healthy" if http_status == status.HTTP_200_OK else "unhealthy",
            "database": db_status,
        },
        status=http_status,
    )


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api_root, name="api-root"),
    path("api/health/", health_check, name="api-health"),
    path("api/ciclos/", include("apps.ciclos.urls")),
    path("api/treinos/", include("apps.treinos.urls")),
    path("api/usuarios/", include("apps.usuarios.urls")),
]
