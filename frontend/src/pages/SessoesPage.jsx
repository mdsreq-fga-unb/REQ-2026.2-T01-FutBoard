import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import SessaoCard from "../components/SessaoCard.jsx";
import SessaoModal from "../components/SessaoModal.jsx";
import RelatorioSessaoModal from "../components/RelatorioSessaoModal.jsx";
import api from "../services/api.js";
import { montarDadosRelatorioSessao } from "../services/relatorioSessaoService.js";
import { gerarEBaixarPdfSessao } from "../services/geradorPdfSessao.js";

const MACROCICLOS_DEMO_PDF = [
  {
    id: 1,
    codigo: "MC-01",
    nome: "Temporada 2026",
    data_inicio: "2026-01-01",
    data_termino: "2026-12-31",
  },
];

const MESOCICLOS_DEMO_PDF = [
  {
    id: 1,
    nome: "Mesociclo 01 - Preparação Física",
    data_inicio: "2026-10-01",
    data_termino: "2026-11-30",
    macrociclo: 1,
  },
];

const MICROCICLOS_DEMO_PDF = [
  {
    id: 1,
    nome: "Microciclo 01",
    data_inicio: "2026-10-18",
    data_termino: "2026-10-24",
    mesociclo: 1,
    mesocicloNome: "Mesociclo 01 - Preparação Física",
    mesocicloDataInicio: "2026-10-01",
    mesocicloDataTermino: "2026-11-30",
    macrociclo: 1,
    macrocicloNome: "Temporada 2026",
    macrocicloDataInicio: "2026-01-01",
    macrocicloDataTermino: "2026-12-31",
  },
  {
    id: 2,
    nome: "Microciclo 02",
    data_inicio: "2026-10-25",
    data_termino: "2026-10-31",
    mesociclo: 1,
    mesocicloNome: "Mesociclo 01 - Preparação Física",
    mesocicloDataInicio: "2026-10-01",
    mesocicloDataTermino: "2026-11-30",
    macrociclo: 1,
    macrocicloNome: "Temporada 2026",
    macrocicloDataInicio: "2026-01-01",
    macrocicloDataTermino: "2026-12-31",
  },
  {
    id: 3,
    nome: "Microciclo 03",
    data_inicio: "2026-11-01",
    data_termino: "2026-11-07",
    mesociclo: 1,
    mesocicloNome: "Mesociclo 01 - Preparação Física",
    mesocicloDataInicio: "2026-10-01",
    mesocicloDataTermino: "2026-11-30",
    macrociclo: 1,
    macrocicloNome: "Temporada 2026",
    macrocicloDataInicio: "2026-01-01",
    macrocicloDataTermino: "2026-12-31",
  },
];

export default function SessoesPage({ onSelectNav }) {
  const [sessoes, setSessoes] = useState(() => {
    try {
      const salvas = localStorage.getItem("futboard_sessoes");
      return salvas ? JSON.parse(salvas) : [];
    } catch {
      return [];
    }
  });
  const [microciclos, setMicrociclos] = useState(MICROCICLOS_DEMO_PDF);
  const [mesociclos, setMesociclos] = useState(MESOCICLOS_DEMO_PDF);
  const [macrociclos, setMacrociclos] = useState(MACROCICLOS_DEMO_PDF);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Controle do Modal de Cadastro e Edição
  const [modalOpen, setModalOpen] = useState(false);
  const [sessaoEditando, setSessaoEditando] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  // Controle de Geração e Visualização de Relatório PDF Individual por Sessão (US25)
  const [gerandoPdfId, setGerandoPdfId] = useState(null);
  const [relatorioAtivo, setRelatorioAtivo] = useState(null);

  // Busca sessões da API caso esteja ativa
  useEffect(() => {
    const carregarSessoesApi = async () => {
      try {
        const [resp, respAtv] = await Promise.all([
          api.get("/treinos/sessoes/"),
          api.get("/treinos/atividades-sessao/").catch(() => ({ data: [] })),
        ]);

        if (Array.isArray(resp.data) && resp.data.length > 0) {
          let sessoesLocais = [];
          try {
            const salvas = localStorage.getItem("futboard_sessoes");
            sessoesLocais = salvas ? JSON.parse(salvas) : [];
          } catch {
            sessoesLocais = [];
          }

          const mapaAtividadesApi = new Map();
          if (Array.isArray(respAtv?.data)) {
            respAtv.data.forEach((atv) => {
              const idSessao = Number(atv.sessao ?? atv.sessao_id);
              if (!Number.isFinite(idSessao)) return;
              if (!mapaAtividadesApi.has(idSessao)) {
                mapaAtividadesApi.set(idSessao, []);
              }
              mapaAtividadesApi.get(idSessao).push(atv);
            });
          }

          const sessoesMescladas = resp.data.map((s) => {
            const localCorrespondente = sessoesLocais.find(
              (loc) => String(loc?.id) === String(s.id)
            );
            const atvsApi = mapaAtividadesApi.get(Number(s.id)) || [];
            const atividadesFinais =
              Array.isArray(s.atividades) && s.atividades.length > 0
                ? s.atividades
                : atvsApi.length > 0
                  ? atvsApi
                  : localCorrespondente?.atividades || [];

            return {
              ...localCorrespondente,
              ...s,
              codigo:
                s.codigo ||
                localCorrespondente?.codigo ||
                `SES-${Number(s.sequencia || s.id) < 10 ? `0${s.sequencia || s.id}` : s.sequencia || s.id}`,
              atividades: atividadesFinais,
            };
          });

          setSessoes(sessoesMescladas);
          try {
            localStorage.setItem(
              "futboard_sessoes",
              JSON.stringify(sessoesMescladas)
            );
          } catch (errLocal) {
            console.warn(
              "Não foi possível salvar sessões no localStorage:",
              errLocal
            );
          }
        }
      } catch (errApi) {
        console.warn("API de sessões offline, utilizando dados locais:", errApi);
      }
    };
    carregarSessoesApi();
  }, []);

  useEffect(() => {
    const carregarMicrociclos = async () => {
      try {
        const [respMicro, respMeso, respMacro] = await Promise.all([
          api.get("/ciclos/microciclos/"),
          api.get("/ciclos/mesociclos/").catch(() => ({ data: [] })),
          api.get("/ciclos/macrociclos/").catch(() => ({ data: [] })),
        ]);

        if (Array.isArray(respMeso.data) && respMeso.data.length > 0) {
          setMesociclos(respMeso.data);
        }
        if (Array.isArray(respMacro.data) && respMacro.data.length > 0) {
          setMacrociclos(respMacro.data);
        }

        if (Array.isArray(respMicro.data) && respMicro.data.length > 0) {
          const mesoMap = new Map();
          if (Array.isArray(respMeso.data)) {
            respMeso.data.forEach((meso) => mesoMap.set(Number(meso.id), meso));
          }

          const macroMap = new Map();
          if (Array.isArray(respMacro.data)) {
            respMacro.data.forEach((macro) =>
              macroMap.set(Number(macro.id), macro)
            );
          }

          const formatados = respMicro.data.map((micro) => {
            const mesoAssociado = mesoMap.get(Number(micro.mesociclo));
            const macroAssociado = mesoAssociado
              ? macroMap.get(Number(mesoAssociado.macrociclo))
              : null;

            return {
              ...micro,
              dataInicio: micro.data_inicio || micro.dataInicio,
              dataTermino: micro.data_termino || micro.dataTermino,
              mesocicloNome: mesoAssociado?.nome || "",
              mesocicloDataInicio:
                mesoAssociado?.data_inicio || mesoAssociado?.dataInicio || null,
              mesocicloDataTermino:
                mesoAssociado?.data_termino ||
                mesoAssociado?.dataTermino ||
                null,
              macrociclo: mesoAssociado?.macrociclo ?? null,
              macrocicloNome: macroAssociado?.nome || "",
              macrocicloDataInicio:
                macroAssociado?.data_inicio ||
                macroAssociado?.dataInicio ||
                null,
              macrocicloDataTermino:
                macroAssociado?.data_termino ||
                macroAssociado?.dataTermino ||
                null,
            };
          });

          setMicrociclos(formatados);
        }
      } catch {
        // Mantém os microciclos de demonstração caso a API não esteja ativa
      }
    };

    carregarMicrociclos();
  }, []);

  const microcicloMap = useMemo(() => {
    const map = new Map();
    microciclos.forEach((item) => map.set(Number(item.id), item));
    return map;
  }, [microciclos]);

  const dispararToast = (mensagem) => {
    setToastMsg(mensagem);
    window.clearTimeout(window.__fbToastTimer);
    window.__fbToastTimer = window.setTimeout(() => {
      setToastMsg("");
    }, 3500);
  };

  const abrirModalCadastro = () => {
    setSessaoEditando(null);
    setModalOpen(true);
  };

  const abrirModalEdicao = (sessao) => {
    setSessaoEditando(sessao);
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setSessaoEditando(null);
  };

  const salvarSessao = (dados) => {
    let novasSessoes = [];
    if (sessaoEditando) {
      novasSessoes = sessoes.map((item) =>
        item.id === sessaoEditando.id ? { ...item, ...dados } : item,
      );
      dispararToast("Sessão atualizada com sucesso.");
    } else {
      const proximoId =
        sessoes.length > 0 ? Math.max(...sessoes.map((s) => s.id)) + 1 : 1;
      const codigo = `SES-${proximoId < 10 ? `0${proximoId}` : proximoId}`;
      novasSessoes = [
        ...sessoes,
        {
          id: proximoId,
          codigo,
          ...dados,
        },
      ];
      dispararToast("Sessão cadastrada com sucesso.");
    }

    setSessoes(novasSessoes);
    try {
      localStorage.setItem("futboard_sessoes", JSON.stringify(novasSessoes));
    } catch (errLocal) {
      console.warn("Não foi possível persistir no localStorage:", errLocal);
    }

    api.post("/treinos/sessoes/", dados).catch(() => {});

    setModalOpen(false);
    setSessaoEditando(null);
  };

  /**
   * Gera e baixa o relatório PDF referente exclusivamente à sessão selecionada (US25).
   * Também abre a visualização estruturada do relatório na tela conforme o protótipo.
   */
  const handleGerarRelatorioPdf = async (sessaoSelecionada) => {
    if (!sessaoSelecionada || gerandoPdfId !== null) return;

    try {
      setGerandoPdfId(sessaoSelecionada.id);
      const dadosRelatorio = await montarDadosRelatorioSessao(
        sessaoSelecionada,
        {
          microciclos,
          mesociclos,
          macrociclos,
        }
      );

      gerarEBaixarPdfSessao(dadosRelatorio);
      setRelatorioAtivo(dadosRelatorio);
      dispararToast(`Relatório ${dadosRelatorio.nomeArquivo} gerado com sucesso.`);
    } catch (erro) {
      console.error("Erro ao gerar relatório PDF da sessão:", erro);
      dispararToast("Não foi possível gerar o relatório PDF da sessão.");
    } finally {
      setGerandoPdfId(null);
    }
  };

  const handleDownloadPdfRelatorio = (dadosRelatorio) => {
    if (!dadosRelatorio) return;
    try {
      gerarEBaixarPdfSessao(dadosRelatorio);
      dispararToast(`Download de ${dadosRelatorio.nomeArquivo} iniciado.`);
    } catch (erro) {
      console.error("Erro ao baixar PDF:", erro);
      dispararToast("Não foi possível baixar o arquivo PDF.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EA] text-[#10281E] lg:flex-row">
      {/* Menu Lateral */}
      <Sidebar
        activeNav="sessoes"
        onSelectNav={onSelectNav}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        totalSessoes={sessoes.length}
        totalMicrociclos={microciclos.length}
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
          onClick={abrirModalCadastro}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#C6E96B] px-3.5 py-1.5 text-xs font-semibold text-[#10281E]"
        >
          <span>+ Nova sessão</span>
        </button>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-x-hidden px-5 py-7 sm:px-8 md:px-10 md:py-9">
        <div className="mx-auto max-w-[1220px]">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-2 flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#8A8D80]"
          >
            <span>PLANEJAMENTO</span>
            <span className="text-[#8A8D80]/70">/</span>
            <span className="text-[#8A8D80]">SESSÕES</span>
          </nav>

          {/* Cabeçalho */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-[#10281E] sm:text-[36px]">
                Sessões
              </h1>
              <p className="mt-1 text-sm text-[#8A8D80]">
                Sessões de treino cadastradas em cada microciclo.
              </p>
            </div>

            <button
              type="button"
              onClick={abrirModalCadastro}
              className="fb-btn-primary inline-flex items-center justify-center gap-2.5 self-start px-5 py-2.5 text-xs font-medium shadow-xs sm:self-auto"
            >
              <svg
                className="h-3.5 w-3.5 text-[#FFFFFF]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 5v14M5 12h14"
                />
              </svg>
              <span>Nova sessão</span>
            </button>
          </div>

          {/* Contador da seção */}
          <div className="mb-3">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#8A8D80]">
              SESSÕES · {sessoes.length}
            </span>
          </div>

          {/* Estado Vazio ou Listagem de Sessões */}
          {sessoes.length === 0 ? (
            <section
              aria-label="Nenhuma sessão cadastrada"
              className="fb-card rounded-2xl border border-[#E4DFD2] bg-[#FFFFFF] px-6 py-5"
            >
              <h2 className="text-sm font-bold text-[#10281E]">
                Nenhuma sessão cadastrada
              </h2>
              <p className="mt-1 text-xs text-[#8A8D80]">
                As sessões são criadas dentro de um microciclo.
              </p>
            </section>
          ) : (
            <section aria-label="Lista de Sessões" className="space-y-3.5">
              {sessoes.map((sessao) => {
                const microId = sessao.microcicloId ?? sessao.microciclo;
                const microObj =
                  microId !== undefined && microId !== null && microId !== ""
                    ? microcicloMap.get(Number(microId))
                    : null;

                return (
                  <SessaoCard
                    key={sessao.id}
                    sessao={sessao}
                    microcicloNome={
                      microObj?.nome || sessao.microcicloNome || ""
                    }
                    onEditSessao={abrirModalEdicao}
                    onGerarRelatorioPdf={handleGerarRelatorioPdf}
                    gerandoPdf={gerandoPdfId === sessao.id}
                  />
                );
              })}
            </section>
          )}
        </div>
      </main>

      {/* Feedback Visual */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border border-[#C6E96B]/40 bg-[#10281E] px-4 py-3 text-xs font-medium text-[#FFFFFF] shadow-xl"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C6E96B] text-[#10281E]">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Modal de Cadastro e Edição de Sessão */}
      <SessaoModal
        key={sessaoEditando ? `edit-${sessaoEditando.id}` : `new-${modalOpen}`}
        isOpen={modalOpen}
        initialData={sessaoEditando}
        microciclos={microciclos}
        onClose={fecharModal}
        onSave={salvarSessao}
      />

      {/* Modal de Visualização e Download do Relatório PDF da Sessão (US25) */}
      <RelatorioSessaoModal
        isOpen={Boolean(relatorioAtivo)}
        dadosRelatorio={relatorioAtivo}
        onClose={() => setRelatorioAtivo(null)}
        onDownloadPdf={handleDownloadPdfRelatorio}
      />
    </div>
  );
}
