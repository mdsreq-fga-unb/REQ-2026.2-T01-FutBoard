import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import KpiCard from "../components/KpiCard.jsx";
import MesocicloCard from "../components/MesocicloCard.jsx";
import MesocicloModal from "../components/MesocicloModal.jsx";
import api from "../services/api.js";

function calcularSemanas(dataInicio, dataTermino) {
  if (!dataInicio || !dataTermino) return 0;
  const inicio = new Date(`${dataInicio}T00:00:00`);
  const fim = new Date(`${dataTermino}T00:00:00`);
  const diffDias = Math.floor((fim - inicio) / (1000 * 60 * 60 * 24)) + 1;
  if (Number.isNaN(diffDias) || diffDias <= 0) return 1;
  return Math.max(1, Math.ceil(diffDias / 7));
}

function obterStatusPorDatas(dataInicio, dataTermino) {
  const hoje = new Date().toISOString().slice(0, 10);
  if (hoje < dataInicio) return "planejado";
  if (hoje > dataTermino) return "concluido";
  return "em_andamento";
}

function formatarDoisDigitos(valor) {
  return valor < 10 ? `0${valor}` : valor;
}

export default function MesociclosPage({ onSelectNav }) {
  const [mesociclos, setMesociclos] = useState([]);
  const [macrociclos, setMacrociclos] = useState([]);
  const [microciclos, setMicrociclos] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Controle do Modal de Cadastro (US04) e Edição (US05)
  const [modalOpen, setModalOpen] = useState(false);
  const [mesoEditando, setMesoEditando] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const dispararToast = (mensagem) => {
    setToastMsg(mensagem);
    window.clearTimeout(window.__fbToastTimer);
    window.__fbToastTimer = window.setTimeout(() => {
      setToastMsg("");
    }, 3500);
  };

  const formatarMesociclo = (mesociclo) => ({
    ...mesociclo,
    dataInicio: mesociclo.data_inicio,
    dataTermino: mesociclo.data_termino,
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [respMeso, respMacro, respMicro] = await Promise.all([
          api.get("/ciclos/mesociclos/"),
          api.get("/ciclos/macrociclos/"),
          api.get("/ciclos/microciclos/").catch(() => ({ data: [] })),
        ]);
        setMesociclos(respMeso.data.map(formatarMesociclo));
        setMacrociclos(respMacro.data);
        setMicrociclos(respMicro.data);
      } catch {
        dispararToast("Não foi possível carregar os mesociclos.");
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  const macroMap = useMemo(() => {
    const map = new Map();
    macrociclos.forEach((m) => map.set(m.id, m));
    return map;
  }, [macrociclos]);

  const listaProcessada = useMemo(() => {
    return mesociclos.map((item) => ({
      ...item,
      semanas: calcularSemanas(item.dataInicio, item.dataTermino),
      status: obterStatusPorDatas(item.dataInicio, item.dataTermino),
      macrocicloNome: macroMap.get(item.macrociclo)?.nome || "",
      totalMicrociclos: microciclos.filter((micro) => micro.mesociclo === item.id)
        .length,
    }));
  }, [mesociclos, macroMap, microciclos]);

  const resumo = useMemo(() => {
    const totalMesociclos = listaProcessada.length;
    const emAndamento = listaProcessada.filter(
      (m) => m.status === "em_andamento",
    ).length;
    const semanasPlanejadas = listaProcessada.reduce(
      (acc, m) => acc + m.semanas,
      0,
    );

    return {
      totalMesociclos,
      emAndamento,
      semanasPlanejadas,
    };
  }, [listaProcessada]);

  const abrirModalCadastro = () => {
    setMesoEditando(null);
    setModalOpen(true);
  };

  const abrirModalEdicao = (mesociclo) => {
    setMesoEditando(mesociclo);
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setMesoEditando(null);
  };

  const salvarMesociclo = async (dados) => {
    const payload = {
      nome: dados.nome,
      data_inicio: dados.dataInicio,
      data_termino: dados.dataTermino,
    };

    try {
      if (mesoEditando) {
        // US05 - Editar mesociclo (o macrociclo vinculado não é alterado)
        const resposta = await api.patch(
          `/ciclos/mesociclos/${mesoEditando.id}/`,
          payload,
        );
        setMesociclos((prev) =>
          prev.map((item) =>
            item.id === mesoEditando.id
              ? formatarMesociclo(resposta.data)
              : item,
          ),
        );
        dispararToast("Mesociclo atualizado com sucesso.");
      } else {
        // US04 - Cadastrar mesociclo vinculado a um macrociclo
        const resposta = await api.post("/ciclos/mesociclos/", {
          ...payload,
          macrociclo: dados.macrociclo,
        });
        setMesociclos((prev) => [formatarMesociclo(resposta.data), ...prev]);
        dispararToast("Mesociclo cadastrado com sucesso.");
      }

      setModalOpen(false);
      setMesoEditando(null);
    } catch (erro) {
      const dadosErro = erro.response?.data;
      const mensagem =
        dadosErro?.macrociclo?.[0] ||
        dadosErro?.nome?.[0] ||
        dadosErro?.data_inicio?.[0] ||
        dadosErro?.data_termino?.[0] ||
        dadosErro?.non_field_errors?.[0] ||
        dadosErro?.detail ||
        "Não foi possível salvar o mesociclo.";
      throw new Error(mensagem);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EA] text-[#10281E] lg:flex-row">
      {/* Menu Lateral */}
      <Sidebar
        activeNav="mesociclos"
        onSelectNav={onSelectNav}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        totalMesociclos={resumo.totalMesociclos}
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
          <span>+ Novo mesociclo</span>
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
            <span className="text-[#8A8D80]">MESOCICLOS</span>
          </nav>

          {/* Cabeçalho */}
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-[#10281E] sm:text-[36px]">
                Mesociclos
              </h1>
              <p className="mt-1 text-xs text-[#8A8D80]">
                Cada mesociclo abrange diversos microciclos.
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
              <span>Novo mesociclo</span>
            </button>
          </div>

          {/* 3 Cards de Indicadores */}
          <section
            aria-label="Indicadores de Mesociclos"
            className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            <KpiCard label="MESOCICLOS" value={formatarDoisDigitos(resumo.totalMesociclos)} />

            <KpiCard
              label="EM ANDAMENTO"
              value={formatarDoisDigitos(resumo.emAndamento)}
            />

            <KpiCard
              label="SEMANAS PLANEJADAS"
              value={resumo.semanasPlanejadas}
            />
          </section>

          {/* Listagem de Mesociclos */}
          <section aria-label="Lista de Mesociclos" className="space-y-3">
            {!carregando && listaProcessada.length > 0 && (
              <div className="flex items-center justify-between font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#8A8D80]">
                <span>MESOCICLOS · {listaProcessada.length}</span>
                <span className="hidden normal-case tracking-normal sm:inline">
                  Clique em um registro para editar
                </span>
              </div>
            )}

            {carregando ? (
              <p className="text-sm text-[#8A8D80]">Carregando mesociclos...</p>
            ) : listaProcessada.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#E4DFD2] bg-white/40 p-8 text-center text-sm text-[#8A8D80]">
                Nenhum mesociclo cadastrado até o momento. Clique em "+ Novo mesociclo" para começar.
              </div>
            ) : (
              listaProcessada.map((meso) => (
                <MesocicloCard
                  key={meso.id}
                  mesociclo={meso}
                  onEditMesociclo={abrirModalEdicao}
                />
              ))
            )}
          </section>
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

      {/* Modal de Cadastro e Edição */}
      <MesocicloModal
        key={mesoEditando ? `edit-${mesoEditando.id}` : `new-${modalOpen}`}
        isOpen={modalOpen}
        initialData={mesoEditando}
        macrociclos={macrociclos}
        onClose={fecharModal}
        onSave={salvarMesociclo}
      />
    </div>
  );
}
