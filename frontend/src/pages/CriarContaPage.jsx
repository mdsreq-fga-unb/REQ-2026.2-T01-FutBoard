import React, { useState } from "react";
import AutenticacaoLayout from "../components/AutenticacaoLayout.jsx";
import CampoAutenticacao from "../components/CampoAutenticacao.jsx";
import {
  criarConta,
  entrar,
  obterMensagemErro,
} from "../services/autenticacao.js";

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TAMANHO_MINIMO_SENHA = 8;

export default function CriarContaPage({ onSelectNav, onAutenticado }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [errosCampos, setErrosCampos] = useState({});
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const alterarCampo = (campo, setter) => (valor) => {
    setter(valor);
    setErrosCampos((prev) => ({ ...prev, [campo]: "" }));
    setErro("");
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!email.trim()) novosErros.email = "Informe o e-mail.";
    else if (!EMAIL_VALIDO.test(email.trim()))
      novosErros.email = "Informe um e-mail válido.";

    if (!senha) novosErros.senha = "Informe uma senha.";
    else if (senha.length < TAMANHO_MINIMO_SENHA)
      novosErros.senha = `A senha deve ter pelo menos ${TAMANHO_MINIMO_SENHA} caracteres.`;
    else if (/^\d+$/.test(senha))
      novosErros.senha = "A senha não pode conter apenas números.";

    if (!confirmacaoSenha) novosErros.confirmacaoSenha = "Repita a senha.";
    else if (senha && senha !== confirmacaoSenha)
      novosErros.confirmacaoSenha = "As senhas não são iguais.";

    return novosErros;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    const novosErros = validarFormulario();
    setErrosCampos(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    const emailNormalizado = email.trim().toLowerCase();

    setEnviando(true);
    try {
      await criarConta({ nome: nome.trim(), email: emailNormalizado, senha });
    } catch (error) {
      const mensagemEmail = error.response?.data?.email?.[0];
      if (mensagemEmail) {
        // US27 - Cenário 2: e-mail já cadastrado
        setErrosCampos({ email: mensagemEmail });
      } else {
        setErro(obterMensagemErro(error, "Não foi possível criar a conta."));
      }
      setEnviando(false);
      return;
    }

    // Conta criada: entra no sistema com as mesmas credenciais
    try {
      await entrar({ email: emailNormalizado, senha });
      if (onAutenticado) onAutenticado();
    } catch {
      if (onSelectNav) onSelectNav("login");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AutenticacaoLayout titulo="Criar conta">
      {/* Formulário de Cadastro */}
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
          id="conta-nome"
          label="Nome"
          autoComplete="name"
          value={nome}
          onChange={alterarCampo("nome", setNome)}
          placeholder="Nome completo"
          erro={errosCampos.nome}
        />

        <CampoAutenticacao
          id="conta-email"
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
          id="conta-senha"
          label="Senha"
          type="password"
          autoComplete="new-password"
          obrigatorio
          value={senha}
          onChange={alterarCampo("senha", setSenha)}
          placeholder="Digite sua senha"
          erro={errosCampos.senha}
        />

        <CampoAutenticacao
          id="conta-confirmacao-senha"
          label="Confirmar senha"
          type="password"
          autoComplete="new-password"
          obrigatorio
          value={confirmacaoSenha}
          onChange={alterarCampo("confirmacaoSenha", setConfirmacaoSenha)}
          placeholder="Digite sua senha"
          erro={errosCampos.confirmacaoSenha}
        />

        <button
          type="submit"
          disabled={enviando}
          className="fb-btn-primary inline-flex w-full items-center justify-center gap-2 px-5 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span>{enviando ? "Enviando..." : "Enviar"}</span>
        </button>

        <p className="text-center text-xs text-[#8A8D80]">
          Já tem uma conta?{" "}
          <button
            type="button"
            onClick={() => onSelectNav && onSelectNav("login")}
            className="font-semibold text-[#0E3A29] underline underline-offset-2"
          >
            Entrar
          </button>
        </p>
      </form>
    </AutenticacaoLayout>
  );
}
