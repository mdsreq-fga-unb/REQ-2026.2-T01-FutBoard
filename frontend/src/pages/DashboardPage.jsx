import React, { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import GraficoRoscaAtividades from "../components/GraficoRoscaAtividades.jsx";
import GraficoBarrasAtividades from "../components/GraficoBarrasAtividades.jsx";
import api from "../services/api.js";

const ESTADO_VAZIO_PADRAO = {
  numero_sessoes: 0,
  minutos_totais: 0,
  minutos_por_sessao: 0.0,
  numero_execucoes: 0,
  minutos_por_execucao: 0.0,
  atividades_distintas: 0,
  variabilidade: 0.0,
  estado_vazio: true,
  mensagem: "Nenhum treino registrado neste período.",
};

const ESTADO_VAZIO_ATIVIDADES = {
  total_atividades_distintas: 0,
  total_registros: 0,
  minutos_totais_atividades: 0,
  minutos_totais_liquidos: 0,
  atividades: [],
  por_tipologia: [],
  por_tipo_ssp: [],
  execucoes: [],
  estado_vazio: true,
  mensagem: "Nenhuma atividade encontrada para os filtros aplicados.",
};

const MESES = [
  { valor: "1", label: "Janeiro" },
  { valor: "2", label: "Fevereiro" },
  { valor: "3", label: "Março" },
  { valor: "4", label: "Abril" },
  { valor: "5", label: "Maio" },
  { valor: "6", label: "Junho" },
  { valor: "7", label: "Julho" },
  { valor: "8", label: "Agosto" },
  { valor: "9", label: "Setembro" },
  { valor: "10", label: "Outubro" },
  { valor: "11", label: "Novembro" },
  { valor: "12", label: "Dezembro" },
];

/**
 * Calcula os indicadores de treino dinamicamente aplicando as regras de negócio:
 * - RN03: Simultaneidade e contagem de tempo líquido.
 * - RN06: Variabilidade (%) = (Atividades distintas ÷ Total de execuções) × 100.
 * - RN07: Estabilidade em caso de ausência de dados no período filtrado.
 */
function calcularIndicadoresLocais(todasSessoes, { microciclo, mes }) {
  let sessoesFiltradas = todasSessoes;

  if (microciclo) {
    sessoesFiltradas = sessoesFiltradas.filter(
      (s) => String(s.microcicloId ?? s.microciclo) === String(microciclo)
    );
  }

  if (mes) {
    sessoesFiltradas = sessoesFiltradas.filter((s) => {
      if (s.mes && String(s.mes) === String(mes)) return true;
      if (s.data) {
        const partes = String(s.data).split("-");
        if (partes.length >= 2) {
          const mesNum = parseInt(partes[1], 10);
          return String(mesNum) === String(mes);
        }
      }
      return false;
    });
  }

  const numeroSessoes = sessoesFiltradas.length;
  if (numeroSessoes === 0) {
    return ESTADO_VAZIO_PADRAO;
  }

  let minutosTotais = 0;
  let numeroExecucoes = 0;
  const chavesAtividades = new Set();

  for (const sessao of sessoesFiltradas) {
    const temposPorOrdem = {};
    const atividades = Array.isArray(sessao.atividades) ? sessao.atividades : [];

    for (const atv of atividades) {
      const ordem = atv.ordem !== undefined && atv.ordem !== null ? atv.ordem : 1;
      const tempo = Number(atv.tempo) || 0;

      if (!(ordem in temposPorOrdem) || tempo > temposPorOrdem[ordem]) {
        temposPorOrdem[ordem] = tempo;
      }

      const chave =
        atv.codigo ||
        atv.nome ||
        atv.atividade_ssp ||
        atv.atividade_biblioteca ||
        atv.id;
      if (chave) chavesAtividades.add(String(chave).trim().toLowerCase());
    }

    const somaTemposSessao = Object.values(temposPorOrdem).reduce((acc, t) => acc + t, 0);
    minutosTotais += somaTemposSessao;
    numeroExecucoes += Object.keys(temposPorOrdem).length;
  }

  const atividadesDistintas = chavesAtividades.size;
  const variabilidade =
    numeroExecucoes > 0
      ? Number(((atividadesDistintas / numeroExecucoes) * 100).toFixed(1))
      : 0.0;
  const minutosPorSessao =
    numeroSessoes > 0 ? Number((minutosTotais / numeroSessoes).toFixed(1)) : 0.0;
  const minutosPorExecucao =
    numeroExecucoes > 0 ? Number((minutosTotais / numeroExecucoes).toFixed(1)) : 0.0;

  return {
    numero_sessoes: numeroSessoes,
    minutos_totais: minutosTotais,
    numero_execucoes: numeroExecucoes,
    atividades_distintas: atividadesDistintas,
    variabilidade,
    minutos_por_sessao: minutosPorSessao,
    minutos_por_execucao: minutosPorExecucao,
    estado_vazio: false,
    mensagem: null,
  };
}

/**
 * Consolida as informações de atividades do treino para os gráficos (US24 / RF24).
 */
function calcularInformacoesAtividadesLocais(todasSessoes, { microciclo, mes }) {
  let sessoesFiltradas = todasSessoes;

  if (microciclo) {
    sessoesFiltradas = sessoesFiltradas.filter(
      (s) => String(s.microcicloId ?? s.microciclo) === String(microciclo)
    );
  }

  if (mes) {
    sessoesFiltradas = sessoesFiltradas.filter((s) => {
      if (s.mes && String(s.mes) === String(mes)) return true;
      if (s.data) {
        const partes = String(s.data).split("-");
        if (partes.length >= 2) {
          const mesNum = parseInt(partes[1], 10);
          return String(mesNum) === String(mes);
        }
      }
      return false;
    });
  }

  if (sessoesFiltradas.length === 0) {
    return ESTADO_VAZIO_ATIVIDADES;
  }

  const agrupado = {};
  let totalMinutos = 0;

  for (const sessao of sessoesFiltradas) {
    const atividades = Array.isArray(sessao.atividades) ? sessao.atividades : [];
    for (const atv of atividades) {
      const codigo = (atv.codigo || "").trim();
      const nome = (atv.nome || "").trim();
      const chave = codigo || nome || atv.id;
      if (!chave) continue;

      const tempo = Number(atv.tempo) || 0;
      totalMinutos += tempo;

      if (!agrupado[chave]) {
        agrupado[chave] = {
          codigo: codigo,
          nome: nome,
          atividade_ssp:
            atv.atividade_ssp ||
            (atv.sigla_tipologia ? `${atv.sigla_tipologia} | ${nome}` : nome || chave),
          tipologia: atv.tipologia || "",
          sigla_tipologia: atv.sigla_tipologia || "",
          tipo_ssp: atv.tipo_ssp || "",
          minutos: 0,
          execucoes: 0,
        };
      }
      agrupado[chave].minutos += tempo;
      agrupado[chave].execucoes += 1;
    }
  }

  const listaAtividades = Object.values(agrupado).map((item) => ({
    ...item,
    percentual_tempo:
      totalMinutos > 0 ? Number(((item.minutos / totalMinutos) * 100).toFixed(2)) : 0,
  }));

  if (listaAtividades.length === 0) {
    return ESTADO_VAZIO_ATIVIDADES;
  }

  return {
    total_atividades_distintas: listaAtividades.length,
    total_registros: listaAtividades.reduce((acc, a) => acc + a.execucoes, 0),
    minutos_totais_atividades: totalMinutos,
    minutos_totais_liquidos: totalMinutos,
    atividades: listaAtividades,
    estado_vazio: false,
    mensagem: null,
  };
}

export default function DashboardPage({ onSelectNav }) {
  const [indicadores, setIndicadores] = useState(ESTADO_VAZIO_PADRAO);
  const [dadosAtividades, setDadosAtividades] = useState(ESTADO_VAZIO_ATIVIDADES);
  const [carregando, setCarregando] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filtros de periodização (US22 / US24)
  const [macrociclos, setMacrociclos] = useState([]);
  const [mesociclos, setMesociclos] = useState([]);
  const [microciclos, setMicrociclos] = useState([]);

  const [filtroMacro, setFiltroMacro] = useState("");
  const [filtroMeso, setFiltroMeso] = useState("");
  const [filtroMicro, setFiltroMicro] = useState("");
  const [filtroMes, setFiltroMes] = useState("");

  // Carrega opções de ciclos para os filtros
  useEffect(() => {
    let montado = true;
    const carregarCiclos = async () => {
      try {
        const [respMacro, respMeso, respMicro] = await Promise.all([
          api.get("/ciclos/macrociclos/").catch(() => ({ data: [] })),
          api.get("/ciclos/mesociclos/").catch(() => ({ data: [] })),
          api.get("/ciclos/microciclos/").catch(() => ({ data: [] })),
        ]);

        if (montado) {
          const macros =
            Array.isArray(respMacro.data) && respMacro.data.length > 0
              ? respMacro.data
              : [{ id: 1, nome: "Temporada 2026" }];
          const mesos =
            Array.isArray(respMeso.data) && respMeso.data.length > 0
              ? respMeso.data
              : [{ id: 1, nome: "Mesociclo 01 - Preparação Física", macrociclo: 1 }];
          const micros =
            Array.isArray(respMicro.data) && respMicro.data.length > 0
              ? respMicro.data
              : [
                  { id: 1, nome: "Microciclo 01", mesociclo: 1 },
                  { id: 2, nome: "Microciclo 02", mesociclo: 1 },
                  { id: 3, nome: "Microciclo 03", mesociclo: 1 },
                ];

          setMacrociclos(macros);
          setMesociclos(mesos);
          setMicrociclos(micros);
        }
      } catch (err) {
        console.warn("Não foi possível carregar os ciclos para filtros:", err);
      }
    };

    carregarCiclos();
    return () => {
      montado = false;
    };
  }, []);

  // Mesociclos filtrados pelo Macrociclo selecionado
  const mesociclosFiltrados = useMemo(() => {
    if (!filtroMacro) return mesociclos;
    return mesociclos.filter((m) => String(m.macrociclo) === String(filtroMacro));
  }, [mesociclos, filtroMacro]);

  // Microciclos filtrados pelo Mesociclo selecionado
  const microciclosFiltrados = useMemo(() => {
    if (!filtroMeso) return microciclos;
    return microciclos.filter((m) => String(m.mesociclo) === String(filtroMeso));
  }, [microciclos, filtroMeso]);

  // Busca indicadores gerais (US22) e gráficos de atividades (US24)
  const buscarIndicadores = useCallback(async () => {
    setCarregando(true);
    let dadosIndicadoresApi = null;
    let dadosAtividadesApi = null;

    const params = {};
    if (filtroMacro) params.macrociclo = filtroMacro;
    if (filtroMeso) params.mesociclo = filtroMeso;
    if (filtroMicro) params.microciclo = filtroMicro;
    if (filtroMes) params.mes = filtroMes;

    try {
      const [respInd, respAtv] = await Promise.all([
        api.get("/treinos/indicadores/", { params }).catch(() => null),
        api.get("/treinos/atividades-treino/", { params }).catch(() => null),
      ]);

      if (respInd?.data && typeof respInd.data.numero_sessoes === "number") {
        dadosIndicadoresApi = respInd.data;
      }
      if (respAtv?.data && Array.isArray(respAtv.data.atividades)) {
        dadosAtividadesApi = respAtv.data;
      }
    } catch {
      // Backend offline no ambiente local
    } finally {
      setCarregando(false);
    }

    // Atualiza indicadores (API ou cálculo local)
    if (dadosIndicadoresApi) {
      setIndicadores(dadosIndicadoresApi);
    } else {
      try {
        const salvas = localStorage.getItem("futboard_sessoes");
        const todasSessoes = salvas ? JSON.parse(salvas) : [];
        const calculados = calcularIndicadoresLocais(todasSessoes, {
          macrociclo: filtroMacro,
          mesociclo: filtroMeso,
          microciclo: filtroMicro,
          mes: filtroMes,
        });
        setIndicadores(calculados);
      } catch {
        setIndicadores(ESTADO_VAZIO_PADRAO);
      }
    }

    // Atualiza gráficos de atividades da US24 (API ou cálculo local)
    if (dadosAtividadesApi) {
      setDadosAtividades(dadosAtividadesApi);
    } else {
      try {
        const salvas = localStorage.getItem("futboard_sessoes");
        const todasSessoes = salvas ? JSON.parse(salvas) : [];
        const atvCalculadas = calcularInformacoesAtividadesLocais(todasSessoes, {
          macrociclo: filtroMacro,
          mesociclo: filtroMeso,
          microciclo: filtroMicro,
          mes: filtroMes,
        });
        setDadosAtividades(atvCalculadas);
      } catch {
        setDadosAtividades(ESTADO_VAZIO_ATIVIDADES);
      }
    }
  }, [filtroMacro, filtroMeso, filtroMicro, filtroMes]);

  // Atualiza indicadores e gráficos ao mudar os filtros ou ao carregar a tela
  useEffect(() => {
    buscarIndicadores();
  }, [buscarIndicadores]);

  // Limpa todos os filtros ativos mantendo a tela estável
  const limparFiltros = () => {
    setFiltroMacro("");
    setFiltroMeso("");
    setFiltroMicro("");
    setFiltroMes("");
  };

  const temFiltroAtivo = Boolean(filtroMacro || filtroMeso || filtroMicro || filtroMes);

  // Formatação de números
  const formatarNumero = (num) => {
    if (num === null || num === undefined) return "0";
    return Number(num).toLocaleString("pt-BR", {
      minimumFractionDigits: Number.isInteger(num) ? 0 : 1,
      maximumFractionDigits: 1,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EA] text-[#10281E] lg:flex-row">
      {/* Menu Lateral */}
      <Sidebar
        activeNav="dashboard"
        onSelectNav={onSelectNav}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        totalSessoes={indicadores.numero_sessoes}
      />

      {/* Barra Superior Mobile */}
      <header className="flex items-center justify-between border-b border-white/10 bg-[#0E3A29] px-4 py-3.5 text-white lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg p-1.5 text-[#E4DFD2] transition hover:bg-white/10"
            aria-label="Abrir menu de navegação"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C6E96B] font-display text-xs font-bold text-[#10281E]">
              F
            </div>
            <span className="font-display text-base font-bold tracking-tight">
              FutBoard
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={buscarIndicadores}
          disabled={carregando}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#C6E96B] px-3 py-1.5 text-xs font-semibold text-[#10281E] transition hover:bg-[#b8dd5d]"
        >
          <svg
            className={`h-3.5 w-3.5 ${carregando ? "animate-spin" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Atualizar</span>
        </button>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-x-hidden px-5 py-7 sm:px-8 md:px-10 md:py-9">
        <div className="mx-auto max-w-[1300px]">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-2 flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#8A8D80]"
          >
            <span>Planejamento</span>
            <span className="text-[#8A8D80]/70">/</span>
            <span className="text-[#10281E] font-semibold">Dashboard</span>
          </nav>

          {/* Cabeçalho da Página */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-[#10281E] sm:text-[36px]">
                Gráficos
              </h1>
              <p className="mt-1 text-sm text-[#8A8D80]">
                Indicadores gerais de volume, rotatividade e variabilidade de treinos da equipe técnica.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Botão de atualização rápida (RNF04) */}
              <button
                type="button"
                onClick={buscarIndicadores}
                disabled={carregando}
                className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-[#E4DFD2] bg-white px-3.5 py-2 text-xs font-semibold text-[#10281E] shadow-2xs transition hover:bg-[#F5F2EA] active:scale-95"
                title="Recalcular e atualizar indicadores (RNF04)"
              >
                <svg
                  className={`h-4 w-4 text-[#0E3A29] ${carregando ? "animate-spin" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>{carregando ? "Atualizando..." : "Atualizar dados"}</span>
              </button>
            </div>
          </div>

          {/* Grid dos 7 Indicadores (US22) */}
          <section aria-label="Indicadores de Treino" className="mb-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
              {/* 1. Qtd Sessões */}
              <div className="fb-card flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-[#E4DFD2] bg-white p-4 text-center shadow-2xs transition hover:border-[#0E3A29]/30">
                <span className="font-mono text-3xl font-bold tracking-tight text-[#10281E] sm:text-4xl">
                  {indicadores.numero_sessoes}
                </span>
                <span className="mt-3 text-xs font-medium text-[#10281E] sm:text-[13px]">
                  Qtd Sessões
                </span>
              </div>

              {/* 2. Tempo Total */}
              <div
                className="fb-card flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-[#E4DFD2] bg-white p-4 text-center shadow-2xs transition hover:border-[#0E3A29]/30"
                title="Tempo líquido: atividades com a mesma ordem contam uma única vez"
              >
                <span className="font-mono text-3xl font-bold tracking-tight text-[#10281E] sm:text-4xl">
                  {indicadores.minutos_totais}
                </span>
                <span className="mt-3 text-xs font-medium text-[#10281E] sm:text-[13px]">
                  Tempo Total
                </span>
              </div>

              {/* 3. Min/Sessão */}
              <div className="fb-card flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-[#E4DFD2] bg-white p-4 text-center shadow-2xs transition hover:border-[#0E3A29]/30">
                <span className="font-mono text-3xl font-bold tracking-tight text-[#10281E] sm:text-4xl">
                  {formatarNumero(indicadores.minutos_por_sessao)}
                </span>
                <span className="mt-3 text-xs font-medium text-[#10281E] sm:text-[13px]">
                  Min/Sessão
                </span>
              </div>

              {/* 4. Execuções */}
              <div
                className="fb-card flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-[#E4DFD2] bg-white p-4 text-center shadow-2xs transition hover:border-[#0E3A29]/30"
                title="Total de execuções contabilizadas por par de Sessão e Ordem"
              >
                <span className="font-mono text-3xl font-bold tracking-tight text-[#10281E] sm:text-4xl">
                  {indicadores.numero_execucoes}
                </span>
                <span className="mt-3 text-xs font-medium text-[#10281E] sm:text-[13px]">
                  Execuções
                </span>
              </div>

              {/* 5. Min/Execução */}
              <div className="fb-card flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-[#E4DFD2] bg-white p-4 text-center shadow-2xs transition hover:border-[#0E3A29]/30">
                <span className="font-mono text-3xl font-bold tracking-tight text-[#10281E] sm:text-4xl">
                  {formatarNumero(indicadores.minutos_por_execucao)}
                </span>
                <span className="mt-3 text-xs font-medium text-[#10281E] sm:text-[13px]">
                  Min/Execução
                </span>
              </div>

              {/* 6. Atividades */}
              <div
                className="fb-card flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-[#E4DFD2] bg-white p-4 text-center shadow-2xs transition hover:border-[#0E3A29]/30"
                title="Número de atividades e exercícios distintos no período"
              >
                <span className="font-mono text-3xl font-bold tracking-tight text-[#10281E] sm:text-4xl">
                  {indicadores.atividades_distintas}
                </span>
                <span className="mt-3 text-xs font-medium text-[#10281E] sm:text-[13px]">
                  Atividades
                </span>
              </div>

              {/* 7. Variabilidade */}
              <div
                className="fb-card flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-[#E4DFD2] bg-white p-4 text-center shadow-2xs transition hover:border-[#0E3A29]/30"
                title="Variabilidade = (Atividades Distintas ÷ Execuções) × 100"
              >
                <span className="font-mono text-3xl font-bold tracking-tight text-[#10281E] sm:text-4xl">
                  {formatarNumero(indicadores.variabilidade)}%
                </span>
                <span className="mt-3 text-xs font-medium text-[#10281E] sm:text-[13px]">
                  Variabilidade
                </span>
              </div>
            </div>
          </section>

          {/* Barra de Filtros de Periodização (Conforme Protótipo) */}
          <section
            aria-label="Filtros de Periodização"
            className="mb-6 rounded-2xl border border-[#E4DFD2] bg-white p-4 shadow-2xs"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8A8D80]">
                Filtros de Treino
              </span>

              {temFiltroAtivo && (
                <button
                  type="button"
                  onClick={limparFiltros}
                  className="font-mono text-[11px] font-semibold text-[#0E3A29] hover:underline"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
              {/* Macrociclo */}
              <div>
                <label className="block text-[11px] font-medium text-[#8A8D80] mb-1">
                  Macrociclo
                </label>
                <select
                  value={filtroMacro}
                  onChange={(e) => {
                    setFiltroMacro(e.target.value);
                    setFiltroMeso("");
                    setFiltroMicro("");
                  }}
                  className="w-full rounded-xl border border-[#E4DFD2] bg-[#F5F2EA]/40 px-3 py-2 text-xs font-medium text-[#10281E] focus:border-[#0E3A29] focus:outline-none"
                >
                  <option value="">Selecionar macrociclo</option>
                  {macrociclos.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mesociclo */}
              <div>
                <label className="block text-[11px] font-medium text-[#8A8D80] mb-1">
                  Mesociclo
                </label>
                <select
                  value={filtroMeso}
                  onChange={(e) => {
                    setFiltroMeso(e.target.value);
                    setFiltroMicro("");
                  }}
                  className="w-full rounded-xl border border-[#E4DFD2] bg-[#F5F2EA]/40 px-3 py-2 text-xs font-medium text-[#10281E] focus:border-[#0E3A29] focus:outline-none"
                >
                  <option value="">Selecionar mesociclo</option>
                  {mesociclosFiltrados.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Microciclo */}
              <div>
                <label className="block text-[11px] font-medium text-[#8A8D80] mb-1">
                  Microciclo
                </label>
                <select
                  value={filtroMicro}
                  onChange={(e) => setFiltroMicro(e.target.value)}
                  className="w-full rounded-xl border border-[#E4DFD2] bg-[#F5F2EA]/40 px-3 py-2 text-xs font-medium text-[#10281E] focus:border-[#0E3A29] focus:outline-none"
                >
                  <option value="">Selecionar microciclo</option>
                  {microciclosFiltrados.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mês */}
              <div>
                <label className="block text-[11px] font-medium text-[#8A8D80] mb-1">
                  Mês
                </label>
                <select
                  value={filtroMes}
                  onChange={(e) => setFiltroMes(e.target.value)}
                  className="w-full rounded-xl border border-[#E4DFD2] bg-[#F5F2EA]/40 px-3 py-2 text-xs font-medium text-[#10281E] focus:border-[#0E3A29] focus:outline-none"
                >
                  <option value="">Todos os meses</option>
                  {MESES.map((mes) => (
                    <option key={mes.valor} value={mes.valor}>
                      {mes.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Gráficos de Atividades do Treino (US24 / RF24 - Conforme Protótipo) */}
          <section aria-label="Gráficos de Atividades do Treino" className="mb-6">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Gráfico 1: Rosca / Donut (Volume de Tempo por Atividade) */}
              <GraficoRoscaAtividades
                atividades={dadosAtividades.atividades}
                minutosTotais={dadosAtividades.minutos_totais_atividades}
              />

              {/* Gráfico 2: Barras Verticais (Qtd Execuções por Atividade) */}
              <GraficoBarrasAtividades
                atividades={dadosAtividades.atividades}
              />
            </div>
          </section>

          {/* Tratamento e Estabilidade em Consultas com Resultado Vazio (RN07) */}
          {(indicadores.estado_vazio || dadosAtividades.estado_vazio) && (
            <section
              aria-label="Aviso de período sem dados"
              className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#E4DFD2] bg-white p-6 shadow-2xs sm:flex-row sm:items-center"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F5F2EA] text-[#0E3A29]">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-display text-base font-bold text-[#10281E]">
                  {dadosAtividades.mensagem ||
                    indicadores.mensagem ||
                    "Nenhum treino registrado neste período."}
                </h3>
                <p className="mt-0.5 text-xs text-[#8A8D80]">
                  Tente selecionar outro macrociclo, mesociclo, microciclo ou mês para visualizar os indicadores e gráficos.
                </p>
              </div>
              {temFiltroAtivo && (
                <button
                  type="button"
                  onClick={limparFiltros}
                  className="self-start rounded-xl bg-[#0E3A29] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#10281E] sm:self-center"
                >
                  Ver todos os treinos
                </button>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
