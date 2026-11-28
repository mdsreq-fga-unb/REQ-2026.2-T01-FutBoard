import api, { apiPublica } from "./api.js";

const ROTA_CADASTRO = "/usuarios/cadastro/";
const ROTA_LOGIN = "/usuarios/login/";
const ROTA_REFRESH = "/usuarios/token/refresh/";
const ROTA_LOGOUT = "/usuarios/logout/";
const ROTA_ME = "/usuarios/me/";
const CHAVE_REFRESH = "futboard.refresh";
const AVISO_CONTA_INATIVA = "Sua conta está inativa. Consulte o administrador.";

function lerRefresh() {
  try {
    return window.sessionStorage.getItem(CHAVE_REFRESH);
  } catch {
    return null;
  }
}

let access = null;
let refresh = lerRefresh();
let renovacao = null;
let encerramento = null;
let geracao = 0;
const ouvintes = new Set();

function persistirRefresh(token) {
  try {
    if (token) window.sessionStorage.setItem(CHAVE_REFRESH, token);
    else window.sessionStorage.removeItem(CHAVE_REFRESH);
  } catch {
    // O fluxo também funciona enquanto a página estiver aberta sem armazenamento.
  }
}

function guardarTokens(dados) {
  if (!dados.access || !dados.refresh) {
    throw new Error("A API não retornou o par de tokens.");
  }
  access = dados.access;
  refresh = dados.refresh;
  persistirRefresh(refresh);
}

function limparAutenticacao(mensagem = "") {
  geracao += 1;
  access = null;
  refresh = null;
  persistirRefresh(null);
  ouvintes.forEach((ouvinte) => ouvinte(mensagem));
}

function renovar() {
  if (!renovacao) {
    const geracaoInicial = geracao;
    renovacao = apiPublica.post(ROTA_REFRESH, { refresh })
      .then(({ data }) => {
        if (geracaoInicial === geracao) guardarTokens(data);
      })
      .catch((erro) => {
        const { status, data } = erro.response ?? {};
        if (geracaoInicial === geracao && [400, 401, 403].includes(status)) {
          let mensagem = "Sua sessão expirou. Entre novamente.";
          if (data?.code === "user_inactive") mensagem = AVISO_CONTA_INATIVA;
          if (status === 403) mensagem = obterMensagemErro(erro, "Sua conta não está autorizada.");
          limparAutenticacao(mensagem);
        }
        throw erro;
      })
      .finally(() => {
        renovacao = null;
      });
  }
  return renovacao;
}

api.interceptors.request.use((config) => {
  config.geracaoAutenticacao = geracao;
  config.accessEnviado = encerramento ? null : access;
  if (config.accessEnviado) {
    config.headers.set("Authorization", `Bearer ${config.accessEnviado}`);
  } else {
    config.headers.delete("Authorization");
  }
  return config;
}, undefined, { synchronous: true });

api.interceptors.response.use(undefined, async (erro) => {
  const config = erro.config;
  if (!config || config.geracaoAutenticacao !== geracao || encerramento) throw erro;

  const { status, data } = erro.response ?? {};
  if (status === 403 && data?.codigo === "acesso_revogado") {
    limparAutenticacao(obterMensagemErro(erro, "Sua conta não está autorizada."));
  }
  if (status === 401 && data?.code === "user_inactive") {
    limparAutenticacao(AVISO_CONTA_INATIVA);
  }

  if (status !== 401 || !refresh) throw erro;
  if (config.repetidaAposRenovacao) {
    limparAutenticacao("Sua sessão expirou. Entre novamente.");
    throw erro;
  }

  const geracaoInicial = geracao;
  if (renovacao || !access || config.accessEnviado === access) await renovar();
  if (geracaoInicial !== geracao || encerramento || !access) throw erro;

  config.repetidaAposRenovacao = true;
  return api.request(config);
});

export function observarFimDaAutenticacao(ouvinte) {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

export async function verificarAutenticacao() {
  if (!refresh) return null;
  if (!access) await renovar();
  if (!access || encerramento) return null;
  const { data } = await api.get(ROTA_ME);
  return data;
}

export async function criarConta({ nome_completo, email, senha, confirmacao_senha }) {
  const { data } = await apiPublica.post(ROTA_CADASTRO, {
    nome_completo, email, senha, confirmacao_senha,
  });
  return data;
}

export async function entrar({ email, senha }) {
  const { data } = await apiPublica.post(ROTA_LOGIN, { email, senha });
  // Finaliza uma renovação antiga antes de instalar a nova autenticação.
  if (renovacao) await renovacao.catch(() => {});
  geracao += 1;
  guardarTokens(data);
  return data.usuario;
}

async function encerrarAutenticacao() {
  try {
    if (renovacao) await renovacao.catch(() => {});
    if (refresh) await apiPublica.post(ROTA_LOGOUT, { refresh });
  } catch (erro) {
    if (erro.response?.status !== 401) throw erro;
  } finally {
    limparAutenticacao();
  }
}

export function sair() {
  if (!encerramento) {
    encerramento = encerrarAutenticacao().finally(() => {
      encerramento = null;
    });
  }
  return encerramento;
}

export function obterMensagemErro(erro, mensagemPadrao) {
  if (!erro.response) {
    return erro.isAxiosError ? "Não foi possível conectar ao servidor. Tente novamente." : mensagemPadrao;
  }
  if (erro.response.status === 404) return "O serviço solicitado não está disponível.";

  const dados = erro.response.data ?? {};
  const campos = ["email", "senha", "nome_completo", "confirmacao_senha", "non_field_errors"];
  for (const campo of campos) {
    const mensagem = dados[campo]?.[0];
    if (mensagem) return mensagem;
  }
  return dados.erro || dados.detail || mensagemPadrao;
}
