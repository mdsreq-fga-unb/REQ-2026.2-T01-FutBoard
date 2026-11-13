import api from "./api.js";

// Rotas provisórias da API de usuários (CP05).
// O backend de US27 e US28 ainda não existe: ajustar quando os endpoints forem definidos.
export const ROTA_CRIAR_CONTA = "/usuarios/cadastro/";
export const ROTA_LOGIN = "/usuarios/login/";

const CHAVE_TOKEN = "futboard.token";

function lerToken() {
  try {
    return window.localStorage.getItem(CHAVE_TOKEN);
  } catch {
    return null;
  }
}

// Restaura a sessão salva ao carregar a aplicação
const tokenSalvo = lerToken();
if (tokenSalvo) {
  api.defaults.headers.common.Authorization = `Bearer ${tokenSalvo}`;
}

export function estaAutenticado() {
  return Boolean(lerToken());
}

// US27 - Criar conta de acesso
export async function criarConta({ nome, email, senha }) {
  const resposta = await api.post(ROTA_CRIAR_CONTA, { nome, email, senha });
  return resposta.data;
}

// US28 - Fazer login com e-mail e senha
export async function entrar({ email, senha }) {
  const resposta = await api.post(ROTA_LOGIN, { email, senha });
  const token = resposta.data?.token || resposta.data?.access;

  if (token) {
    salvarToken(token);
  }

  return resposta.data;
}

export function salvarToken(token) {
  try {
    window.localStorage.setItem(CHAVE_TOKEN, token);
  } catch {
    // Armazenamento indisponível: a sessão vale só enquanto a página estiver aberta
  }
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function sair() {
  try {
    window.localStorage.removeItem(CHAVE_TOKEN);
  } catch {
    // Nada a remover
  }
  delete api.defaults.headers.common.Authorization;
}

// Traduz o erro da API para uma mensagem em português
export function obterMensagemErro(erro, mensagemPadrao) {
  if (!erro.response) {
    return "Não foi possível conectar ao servidor. Tente novamente.";
  }

  if (erro.response.status === 404) {
    return "O serviço de autenticação ainda não está disponível.";
  }

  const dados = erro.response.data || {};
  return (
    dados.email?.[0] ||
    dados.senha?.[0] ||
    dados.nome?.[0] ||
    dados.non_field_errors?.[0] ||
    dados.detail ||
    mensagemPadrao
  );
}
