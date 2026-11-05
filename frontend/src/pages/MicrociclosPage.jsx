import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import KpiCard from "../components/KpiCard.jsx";
import MicrocicloCard from "../components/MicrocicloCard.jsx";
import MicrocicloModal from "../components/MicrocicloModal.jsx";
import api from "../services/api.js";

const DADOS_DEMO_PDF = [
  {
    id: 1,
    nome: "Microciclo 01",
    data_inicio: "2026-10-18",
    data_termino: "2026-10-24",
    mesociclo: 1,
  },
  {
    id: 2,
    nome: "Microciclo 02",
    data_inicio: "2026-10-25",
    data_termino: "2026-10-31",
    mesociclo: 1,
  },
  {
    id: 3,
    nome: "Microciclo 03",
    data_inicio: "2026-11-01",
    data_termino: "2026-11-07",
    mesociclo: 1,
  },
];

const MESOS_DEMO_PDF = [
  {
    id: 1,
    nome: "Mesociclo 01 - Preparação Física",
    data_inicio: "2026-10-01",
    data_termino: "2026-11-30",
  },
];

function obterStatusPorDatas(dataInicio, dataTermino) {
  const hoje = new Date().toISOString().slice(0, 10);
  if (hoje < dataInicio) return "planejado";
  if (hoje > dataTermino) return "concluido";
  return "em_andamento";
}

export default function MicrociclosPage({ onSelectNav }) {
  const [microciclos, setMicrociclos] = useState([]);
  const [mesociclos, setMesociclos] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Controle do Modal de Cadastro (US07) e Edição (US08)
  const [modalOpen, setModalOpen] = useState(false);
  const [microEditando, setMicroEditando] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const dispararToast = (mensagem) => {
    setToastMsg(mensagem);
    window.clearTimeout(window.__fbToastTimer);
    window.__fbToastTimer = window.setTimeout(() => {
      setToastMsg("");
    }, 3500);
  };

  const formatarMicrociclo = (microciclo) => ({
    ...microciclo,
    dataInicio: microciclo.data_inicio || microciclo.dataInicio,
    dataTermino: microciclo.data_termino || microciclo.dataTermino,
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [respMicro, respMeso] = await Promise.all([
          api.get("/ciclos/microciclos/"),
          api.get("/ciclos/mesociclos/").catch(() => ({ data: [] })),
        ]);

        if (Array.isArray(respMicro.data) && respMicro.data.length > 0) {
          setMicrociclos(respMicro.data.map(formatarMicrociclo));
        } else {
          // Se a lista do backend estiver vazia, exibe dados modelo do PDF para visualização
          setMicrociclos(DADOS_DEMO_PDF.map(formatarMicrociclo));
        }

        if (Array.isArray(respMeso.data) && respMeso.data.length > 0) {
          setMesociclos(respMeso.data);
        } else {
          setMesociclos(MESOS_DEMO_PDF);
        }
      } catch {
        // Fallback para visualização com os dados fiéis da página 1 do PDF
        setMicrociclos(DADOS_DEMO_PDF.map(formatarMicrociclo));
        setMesociclos(MESOS_DEMO_PDF);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  const mesoMap = useMemo(() => {
    const map = new Map();
    mesociclos.forEach((m) => map.set(m.id, m));
    return map;
  }, [mesociclos]);

  const listaProcessada = useMemo(() => {
    return microciclos.map((item) => ({
      ...item,
      status: obterStatusPorDatas(item.dataInicio, item.dataTermino),
      mesocicloNome: mesoMap.get(item.mesociclo)?.nome || "",
    }));
  }, [microciclos, mesoMap]);

  const totalMicrociclos = listaProcessada.length;
  const emAndamento = listaProcessada.filter(
    (m) => m.status === "em_andamento",
  ).length;
  const planejados = listaProcessada.filter(
    (m) => m.status === "planejado",
  ).length;

  const abrirModalCadastro = () => {
    setMicroEditando(null);
    setModalOpen(true);
  };

  const abrirModalEdicao = (microciclo) => {
    setMicroEditando(microciclo);
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setMicroEditando(null);
  };

  const salvarMicrociclo = async (dados) => {
    try {
      if (microEditando) {
        // US08 - Editar microciclo
        const payload = {
          nome: dados.nome,
          data_inicio: dados.dataInicio,
          data_termino: dados.dataTermino,
        };

        let dadosAtualizados = null;
        try {
          const resposta = await api.patch(
            `/ciclos/microciclos/${microEditando.id}/`,
            payload,
          );
          dadosAtualizados = formatarMicrociclo(resposta.data);
        } catch (apiErr) {
          // Se for erro de validação da API (ex: 400), repassa
          if (apiErr.response?.data) {
            throw apiErr;
          }
          // Caso a API não esteja rodando, atualiza no estado local
          dadosAtualizados = {
            ...microEditando,
            nome: dados.nome,
            dataInicio: dados.dataInicio,
            dataTermino: dados.dataTermino,
          };
        }

        setMicrociclos((prev) =>
          prev.map((item) =>
            item.id === microEditando.id ? dadosAtualizados : item,
          ),
        );
        dispararToast("Alterações salvas");
      } else {
        // US07 - Criar microciclo
        const payload = {
          nome: dados.nome,
          data_inicio: dados.dataInicio,
          data_termino: dados.dataTermino,
          mesociclo: dados.mesociclo || (mesociclos[0] ? mesociclos[0].id : 1),
        };

        let novoItem = null;
        try {
          const resposta = await api.post("/ciclos/microciclos/", payload);
          novoItem = formatarMicrociclo(resposta.data);
        } catch (apiErr) {
          if (apiErr.response?.data) {
            throw apiErr;
          }
          novoItem = {
            id: Date.now(),
            nome: dados.nome,
            dataInicio: dados.dataInicio,
            dataTermino: dados.dataTermino,
            mesociclo: payload.mesociclo,
          };
        }

        setMicrociclos((prev) => [novoItem, ...prev]);
        dispararToast("Microciclo criado");
      }

      setModalOpen(false);
      setMicroEditando(null);
    } catch (erro) {
      const dadosErro = erro.response?.data;
      const mensagem =
        dadosErro?.data_termino?.[0] ||
        dadosErro?.data_inicio?.[0] ||
        dadosErro?.mesociclo?.[0] ||
        dadosErro?.detail ||
        erro.message ||
        "Não foi possível salvar o microciclo.";
      throw new Error(mensagem);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EA] text-[#10281E] lg:flex-row">
      {/* Menu Lateral */}
      <Sidebar
        activeNav="microciclos"
        onSelectNav={onSelectNav}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        totalMicrociclos={totalMicrociclos}
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
          <span>+ Novo microciclo</span>
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
            <span className="text-[#8A8D80]/70">&gt;</span>
            <span className="text-[#8A8D80]">MICROCICLOS</span>
          </nav>

          {/* Cabeçalho */}
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-[#10281E] sm:text-[36px]">
                Microciclos
              </h1>
              <p className="mt-1 text-xs text-[#8A8D80]">
                Crie um microciclo correspondente a um mesociclo.
              </p>
            </div>

            <button
              type="button"
              onClick={abrirModalCadastro}
              className="fb-btn-primary inline-flex items-center justify-center gap-2.5 self-start px-6 py-3 text-sm font-medium shadow-xs sm:self-auto"
            >
              <svg
                className="h-4 w-4 text-[#FFFFFF]"
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
              <span>Novo microciclo</span>
            </button>
          </div>

          {/* Indicadores */}
          <section
            aria-label="Indicadores de Microciclos"
            className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            <KpiCard
              label="TOTAL DE MICROCICLOS"
              value={totalMicrociclos < 10 ? `0${totalMicrociclos}` : totalMicrociclos}
            />

            <KpiCard
              label="EM ANDAMENTO"
              value={emAndamento < 10 ? `0${emAndamento}` : emAndamento}
            />

            <KpiCard
              label="PLANEJADOS"
              value={planejados < 10 ? `0${planejados}` : planejados}
            />
          </section>

          {/* Listagem de Microciclos */}
          <section aria-label="Lista de Microciclos" className="space-y-4">
            {carregando ? (
              <p className="text-sm text-[#8A8D80]">Carregando microciclos...</p>
            ) : listaProcessada.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#E4DFD2] bg-white/40 p-8 text-center text-sm text-[#8A8D80]">
                Nenhum microciclo cadastrado até o momento. Clique em "+ Novo microciclo" para começar.
              </div>
            ) : (
              listaProcessada.map((micro) => (
                <MicrocicloCard
                  key={micro.id}
                  microciclo={micro}
                  onEditMicrociclo={abrirModalEdicao}
                />
              ))
            )}
          </section>
        </div>
      </main>

      {/* Feedback Visual / Toast conforme PDF */}
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

      {/* Modal de Cadastro e Edição */}
      <MicrocicloModal
        key={microEditando ? `edit-${microEditando.id}` : `new-${modalOpen}`}
        isOpen={modalOpen}
        initialData={microEditando}
        mesociclos={mesociclos}
        onClose={fecharModal}
        onSave={salvarMicrociclo}
      />
    </div>
  );
}
