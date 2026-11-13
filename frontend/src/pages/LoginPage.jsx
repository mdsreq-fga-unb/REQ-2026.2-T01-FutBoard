import React, { useState } from "react";
import AutenticacaoLayout from "../components/AutenticacaoLayout.jsx";
import CampoAutenticacao from "../components/CampoAutenticacao.jsx";
import { entrar, obterMensagemErro } from "../services/autenticacao.js";

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage({ onSelectNav, onAutenticado }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errosCampos, setErrosCampos] = useState({});
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const alterarCampo = (campo, setter) => (valor) => {
    setter(valor);
    setErrosCampos((prev) => ({ ...prev, [campo]: "" }));
    setErro("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    const novosErros = {};
    if (!email.trim()) novosErros.email = "Informe o e-mail.";
    else if (!EMAIL_VALIDO.test(email.trim()))
      novosErros.email = "Informe um e-mail válido.";
    if (!senha) novosErros.senha = "Informe a senha.";

    setErrosCampos(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    setEnviando(true);
    try {
      await entrar({ email: email.trim().toLowerCase(), senha });
      if (onAutenticado) onAutenticado();
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 401) {
        setErro("E-mail ou senha incorretos. Confira os dados e tente novamente.");
      } else {
        setErro(obterMensagemErro(error, "Não foi possível fazer login."));
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AutenticacaoLayout titulo="Entrar">
      {/* Formulário de Login */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {erro && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700"
          >
            {erro}
          </div>
        )}

        <CampoAutenticacao
          id="login-email"
          label="E-mail"
          type="email"
          autoComplete="email"
          obrigatorio
          value={email}
          onChange={alterarCampo("email", setEmail)}
          placeholder="treinador@canaa.com.br"
          erro={errosCampos.email}
        />

        <CampoAutenticacao
          id="login-senha"
          label="Senha"
          type="password"
          autoComplete="current-password"
          obrigatorio
          value={senha}
          onChange={alterarCampo("senha", setSenha)}
          placeholder="Digite sua senha"
          erro={errosCampos.senha}
        />

        <button
          type="submit"
          disabled={enviando}
          className="fb-btn-primary inline-flex w-full items-center justify-center gap-2 px-5 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span>{enviando ? "Entrando..." : "Entrar"}</span>
        </button>

        <p className="text-center text-xs text-[#8A8D80]">
          Não tem uma conta?{" "}
          <button
            type="button"
            onClick={() => onSelectNav && onSelectNav("criar-conta")}
            className="font-semibold text-[#0E3A29] underline underline-offset-2"
          >
            Criar conta
          </button>
        </p>
      </form>
    </AutenticacaoLayout>
  );
}
