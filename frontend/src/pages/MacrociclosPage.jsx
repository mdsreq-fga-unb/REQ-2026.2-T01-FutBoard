import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import KpiCard from "../components/KpiCard.jsx";
import MacrocicloCard from "../components/MacrocicloCard.jsx";
import MacrocicloModal from "../components/MacrocicloModal.jsx";
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

export default function MacrociclosPage({ onSelectNav }) {
  const [macrociclos, setMacrociclos] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Controle do Modal de Cadastro e Edição
  const [modalOpen, setModalOpen] = useState(false);
  const [macroEditando, setMacroEditando] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const dispararToast = (mensagem) => {
    setToastMsg(mensagem);
    window.clearTimeout(window.__fbToastTimer);
    window.__fbToastTimer = window.setTimeout(() => {
      setToastMsg("");
    }, 3500);
  };

  const formatarMacrociclo = (macrociclo) => ({
    ...macrociclo,
    dataInicio: macrociclo.data_inicio,
    dataTermino: macrociclo.data_termino,
  });

  useEffect(() => {
    const carregarMacrociclos = async () => {
      try {
        const resposta = await api.get("/ciclos/macrociclos/");
        setMacrociclos(resposta.data.map(formatarMacrociclo));
      } catch {
        dispararToast("Não foi possível carregar os macrociclos.");
      } finally {
        setCarregando(false);
      }
    };

    carregarMacrociclos();
  }, []);

  const listaProcessada = useMemo(() => {
    return macrociclos.map((item) => ({
      ...item,
      semanas: calcularSemanas(item.dataInicio, item.dataTermino),
      status: obterStatusPorDatas(item.dataInicio, item.dataTermino),
    }));
  }, [macrociclos]);

  const resumo = useMemo(() => {
    const totalMacrociclos = listaProcessada.length;
    const emAndamento = listaProcessada.filter(
      (m) => m.status === "em_andamento",
    ).length;
    const semanasPlanejadas = listaProcessada.reduce(
      (acc, m) => acc + m.semanas,
      0,
    );

    return {
      totalMacrociclos,
      emAndamento,
      semanasPlanejadas,
    };
  }, [listaProcessada]);

  const abrirModalCadastro = () => {
    setMacroEditando(null);
    setModalOpen(true);
  };

  const abrirModalEdicao = (macrociclo) => {
    setMacroEditando(macrociclo);
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setMacroEditando(null);
  };

  const salvarMacrociclo = async (dados) => {
    const payload = {
      nome: dados.nome,
      data_inicio: dados.dataInicio,
      data_termino: dados.dataTermino,
    };

    try {
      if (macroEditando) {
        const resposta = await api.patch(
          `/ciclos/macrociclos/${macroEditando.id}/`,
          payload,
        );
        setMacrociclos((prev) =>
          prev.map((item) =>
            item.id === macroEditando.id
              ? formatarMacrociclo(resposta.data)
              : item,
          ),
        );
        dispararToast("Macrociclo atualizado com sucesso.");
      } else {
        const resposta = await api.post("/ciclos/macrociclos/", payload);
        setMacrociclos((prev) => [
          formatarMacrociclo(resposta.data),
          ...prev,
        ]);
        dispararToast("Macrociclo cadastrado com sucesso.");
      }

      setModalOpen(false);
      setMacroEditando(null);
    } catch (erro) {
      const mensagem =
        erro.response?.data?.data_termino?.[0] ||
        erro.response?.data?.detail ||
        "Não foi possível salvar o macrociclo.";
      throw new Error(mensagem);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EA] text-[#10281E] lg:flex-row">
      {/* Menu Lateral */}
      <Sidebar
        activeNav="macrociclos"
        onSelectNav={onSelectNav}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        totalMacrociclos={resumo.totalMacrociclos}
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
          <span>+ Novo macrociclo</span>
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
            <span className="text-[#8A8D80]">MACROCICLOS</span>
          </nav>

          {/* Cabeçalho */}
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-display text-3xl font-bold tracking-tight text-[#10281E] sm:text-[36px]">
              Macrociclos
            </h1>

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
              <span>Novo macrociclo</span>
            </button>
          </div>

          {/* 3 Cards de Indicadores */}
          <section
            aria-label="Indicadores de Macrociclos"
            className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            <KpiCard
              label="MACROCICLOS"
              value={resumo.totalMacrociclos}
            />

            <KpiCard
              label="EM ANDAMENTO"
              value={resumo.emAndamento}
            />

            <KpiCard
              label="SEMANAS PLANEJADAS"
              value={resumo.semanasPlanejadas}
            />
          </section>

          {/* Listagem de Macrociclos */}
          <section aria-label="Lista de Macrociclos" className="space-y-4">
            {carregando ? (
              <p className="text-sm text-[#8A8D80]">Carregando macrociclos...</p>
            ) : (
              listaProcessada.map((macro) => (
              <MacrocicloCard
                key={macro.id}
                macrociclo={macro}
                onEditMacrociclo={abrirModalEdicao}
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
      <MacrocicloModal
        key={macroEditando ? `edit-${macroEditando.id}` : `new-${modalOpen}`}
        isOpen={modalOpen}
        initialData={macroEditando}
        onClose={fecharModal}
        onSave={salvarMacrociclo}
      />
    </div>
  );
}
