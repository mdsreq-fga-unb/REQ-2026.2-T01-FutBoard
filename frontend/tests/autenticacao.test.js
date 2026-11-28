import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { AxiosError } from "axios";
import api, { apiPublica } from "../src/services/api.js";

const rotas = {
  cadastro: "/usuarios/cadastro/",
  login: "/usuarios/login/",
  refresh: "/usuarios/token/refresh/",
  logout: "/usuarios/logout/",
  me: "/usuarios/me/",
};
const usuario = { id: 1, nome_completo: "Pessoa Teste", situacao: "APROVADA" };
const tokens = { access: "primeiro-access", refresh: "primeiro-refresh" };
const renovados = { access: "segundo-access", refresh: "segundo-refresh" };
const chave = "futboard.refresh";
let armazenamento;
let versao = 0;

beforeEach(() => {
  armazenamento = new Map();
  globalThis.window = {
    sessionStorage: {
      getItem: (nome) => armazenamento.get(nome),
      setItem: (nome, valor) => armazenamento.set(nome, valor),
      removeItem: (nome) => armazenamento.delete(nome),
    },
  };
  api.interceptors.request.clear();
  api.interceptors.response.clear();
});

function importarAutenticacao() {
  versao += 1;
  return import(`../src/services/autenticacao.js?teste=${versao}`);
}

function responder(config, status, data) {
  const resposta = { config, status, data, headers: {} };
  if (status >= 400) throw new AxiosError(`HTTP ${status}`, undefined, config, undefined, resposta);
  return resposta;
}

function simularAPI(adaptador) {
  const tratar = async (config) => {
    const { url, headers, data } = config;
    const [status, corpo] = await adaptador(url, headers.get("Authorization"), data && JSON.parse(data));
    return responder(config, status, corpo);
  };
  api.defaults.adapter = tratar;
  apiPublica.defaults.adapter = tratar;
}

test("cadastro usa o contrato completo e deixa a conta pendente", async () => {
  const autenticacao = await importarAutenticacao();
  const cadastro = {
    nome_completo: "Pessoa Teste", email: "pessoa@example.com", senha: "SenhaForte#1",
    confirmacao_senha: "SenhaForte#1",
  };
  simularAPI((url, bearer, corpo) => {
    assert.equal(url, rotas.cadastro);
    assert.equal(bearer, undefined);
    assert.deepEqual(corpo, cadastro);
    return [201, { situacao: "PENDENTE" }];
  });

  assert.deepEqual(await autenticacao.criarConta(cadastro), { situacao: "PENDENTE" });
  assert.equal(armazenamento.has(chave), false);
});

test("ao recarregar, usa o refresh salvo e confirma o acesso por /me/", async () => {
  armazenamento.set(chave, tokens.refresh);
  const autenticacao = await importarAutenticacao();
  const chamadas = [];
  simularAPI((url, bearer, corpo) => {
    chamadas.push(url);
    if (url === rotas.refresh) {
      assert.deepEqual(corpo, { refresh: tokens.refresh });
      return [200, renovados];
    }
    assert.equal(bearer, `Bearer ${renovados.access}`);
    return [200, usuario];
  });

  assert.deepEqual(await autenticacao.verificarAutenticacao(), usuario);
  assert.deepEqual(chamadas, [rotas.refresh, rotas.me]);
  assert.equal(armazenamento.get(chave), renovados.refresh);
});

test("refresh rejeitado ao carregar remove a autenticação local", async () => {
  armazenamento.set(chave, "anterior");
  const autenticacao = await importarAutenticacao();
  const avisos = [];
  autenticacao.observarFimDaAutenticacao((aviso) => avisos.push(aviso));
  simularAPI((url) => {
    assert.equal(url, rotas.refresh);
    return [401, {}];
  });

  await assert.rejects(autenticacao.verificarAutenticacao(), { status: 401 });
  assert.equal(armazenamento.has(chave), false);
  assert.match(avisos[0], /sessão expirou/i);
  assert.equal(await autenticacao.verificarAutenticacao(), null);
});

test("respostas 401 simultâneas e atrasadas compartilham uma renovação", async () => {
  const autenticacao = await importarAutenticacao();
  const refreshIniciado = Promise.withResolvers();
  const liberarRefresh = Promise.withResolvers();
  const liberarRespostaAtrasada = Promise.withResolvers();
  let renovacoes = 0;
  simularAPI(async (url, bearer) => {
    if (url === rotas.login) return [200, { ...tokens, usuario }];
    if (url === rotas.refresh) {
      renovacoes += 1;
      refreshIniciado.resolve();
      await liberarRefresh.promise;
      return [200, renovados];
    }
    if (bearer === `Bearer ${renovados.access}`) return [200, []];
    if (url.endsWith("/lenta/")) await liberarRespostaAtrasada.promise;
    return [401, {}];
  });

  assert.deepEqual(await autenticacao.entrar({}), usuario);
  const primeira = api.get("/ciclos/macrociclos/");
  const segunda = api.get("/treinos/sessoes/");
  const atrasada = api.get("/treinos/lenta/");
  await refreshIniciado.promise;
  liberarRefresh.resolve();
  await Promise.all([primeira, segunda]);
  liberarRespostaAtrasada.resolve();
  await atrasada;

  assert.equal(renovacoes, 1);
  assert.equal(armazenamento.get(chave), renovados.refresh);
});

test("apenas o 403 de perda de autorização encerra o acesso", async () => {
  const autenticacao = await importarAutenticacao();
  const avisos = [];
  autenticacao.observarFimDaAutenticacao((aviso) => avisos.push(aviso));
  simularAPI((url) => {
    if (url === rotas.login) return [200, { ...tokens, usuario }];
    if (url === rotas.me) return [403, { codigo: "acesso_revogado", erro: "Acesso revogado." }];
    assert.notEqual(url, rotas.refresh);
    return [403, { detail: "Operação proibida." }];
  });

  await autenticacao.entrar({});
  await assert.rejects(api.get("/treinos/sessoes/"), { status: 403 });
  assert.equal(armazenamento.get(chave), tokens.refresh);
  await assert.rejects(autenticacao.verificarAutenticacao(), { status: 403 });
  assert.equal(armazenamento.has(chave), false);
  assert.deepEqual(avisos, ["Acesso revogado."]);
});

test("conta desativada pelo Admin encerra o acesso sem tentar renovar", async () => {
  const autenticacao = await importarAutenticacao();
  const avisos = [];
  autenticacao.observarFimDaAutenticacao((aviso) => avisos.push(aviso));
  simularAPI((url) => {
    if (url === rotas.login) return [200, { ...tokens, usuario }];
    assert.equal(url, rotas.me);
    return [401, { code: "user_inactive" }];
  });

  await autenticacao.entrar({});
  await assert.rejects(autenticacao.verificarAutenticacao(), { status: 401 });
  assert.equal(armazenamento.has(chave), false);
  assert.match(avisos[0], /conta está inativa/i);
});

test("logout aguarda a rotação em curso e revoga o refresh mais recente", async () => {
  const autenticacao = await importarAutenticacao();
  const refreshIniciado = Promise.withResolvers();
  const liberarRefresh = Promise.withResolvers();
  const revogados = [];
  simularAPI(async (url, bearer, corpo) => {
    if (url === rotas.login) return [200, { ...tokens, usuario }];
    if (url === rotas.refresh) {
      refreshIniciado.resolve();
      await liberarRefresh.promise;
      return [200, renovados];
    }
    if (url === rotas.logout) {
      assert.equal(bearer, undefined);
      revogados.push(corpo.refresh);
      return [200, {}];
    }
    assert.equal(bearer, `Bearer ${tokens.access}`);
    return [401, {}];
  });

  await autenticacao.entrar({});
  const pedido = assert.rejects(api.get(rotas.me), { status: 401 });
  await refreshIniciado.promise;
  const saida = autenticacao.sair();
  liberarRefresh.resolve();
  await Promise.all([pedido, saida]);

  assert.deepEqual(revogados, [renovados.refresh]);
  assert.equal(armazenamento.has(chave), false);
  assert.equal(await autenticacao.verificarAutenticacao(), null);
});
