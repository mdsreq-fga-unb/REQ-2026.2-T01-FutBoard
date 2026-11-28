from django.contrib import admin, messages
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone

from .models import PerfilAcesso

Situacao = PerfilAcesso.Situacao


@admin.register(PerfilAcesso)
class PerfilAcessoAdmin(admin.ModelAdmin):
    list_display = ("nome_completo", "email", "situacao", "ativo", "criado_em")
    list_filter = ("situacao", "usuario__is_active")
    search_fields = ("nome_completo", "usuario__email")
    list_select_related = ("usuario",)
    readonly_fields = (
        "usuario",
        "nome_completo",
        "situacao",
        "ativo",
        "criado_em",
        "atualizado_em",
    )
    actions = ("aprovar", "recusar", "revogar")

    @admin.display(description="E-mail", ordering="usuario__email")
    def email(self, perfil):
        return perfil.usuario.email

    @admin.display(boolean=True, description="Conta ativa", ordering="usuario__is_active")
    def ativo(self, perfil):
        return perfil.usuario.is_active

    def has_module_permission(self, request):
        return request.user.is_superuser and super().has_module_permission(request)

    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser and super().has_view_permission(request, obj)

    def has_change_permission(self, request, obj=None):
        # A edição individual é somente leitura. As ações na lista atualizam os dois registros.
        return obj is None and request.user.is_superuser

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    @admin.action(description="Aprovar contas selecionadas", permissions=["change"])
    def aprovar(self, request, queryset):
        self._alterar_situacao(request, queryset, Situacao.APROVADA)

    @admin.action(description="Recusar solicitações pendentes selecionadas", permissions=["change"])
    def recusar(self, request, queryset):
        self._alterar_situacao(request, queryset, Situacao.RECUSADA, origem=Situacao.PENDENTE)

    @admin.action(description="Revogar acessos aprovados selecionados", permissions=["change"])
    def revogar(self, request, queryset):
        self._alterar_situacao(request, queryset, Situacao.REVOGADA, origem=Situacao.APROVADA)

    @transaction.atomic
    def _alterar_situacao(self, request, queryset, destino, *, origem=None):
        selecionados = queryset.exclude(usuario=request.user)
        if origem is not None:
            selecionados = selecionados.filter(situacao=origem)

        perfis = list(
            selecionados.order_by("pk")
            .select_for_update(of=("self",))
            .values_list("pk", "usuario_id")
        )
        if not perfis:
            self.message_user(request, "Nenhum perfil permite essa ação.", messages.WARNING)
            return

        perfis_ids, usuarios_ids = zip(*perfis, strict=True)
        PerfilAcesso.objects.filter(pk__in=perfis_ids).update(
            situacao=destino, atualizado_em=timezone.now()
        )
        get_user_model().objects.filter(pk__in=usuarios_ids).update(
            is_active=destino == Situacao.APROVADA
        )
        self.message_user(
            request, f"{len(perfis)} perfil(is) agora em {destino.label}.", messages.SUCCESS
        )
