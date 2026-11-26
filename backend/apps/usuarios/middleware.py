from django.contrib.sessions.middleware import SessionMiddleware


class SessaoPorAtividadeMiddleware(SessionMiddleware):
    """Renova o prazo da sessão após uma resposta bem-sucedida ao usuário autenticado."""

    def process_response(self, request, response):
        if (
            200 <= response.status_code < 400
            and request.session.session_key
            and getattr(getattr(request, "user", None), "is_authenticated", False)
        ):
            request.session.modified = True
        return super().process_response(request, response)
