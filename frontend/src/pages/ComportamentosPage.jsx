import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import ComportamentoCard from "../components/ComportamentoCard.jsx";
import ComportamentoModal from "../components/ComportamentoModal.jsx";
import api from "../services/api.js";

export default function ComportamentosPage({ onSelectNav }) {
  const [comportamentos, setComportamentos] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Controle do Modal de Cadastro (US10) e Edição (US11)
  const [modalOpen, setModalOpen] = useState(false);
  const [comportamentoEditando, setComportamentoEditando] = useState(null);
  const [idsDestacados, setIdsDestacados] = useState([]);
  const [toastMsg, setToastMsg] = useState("");

  const dispararToast = (mensagem) => {
    setToastMsg(mensagem);
    window.clearTimeout(window.__fbToastTimer);
    window.__fbToastTimer = window.setTimeout(() => {
      setToastMsg("");
    }, 3500);
  };

  useEffect(() => {
    const carregarComportamentos = async () => {
      try {
        const resposta = await api.get("/treinos/comportamentos/");
        setComportamentos(resposta.data);
      } catch {
        dispararToast("Não foi possível carregar os comportamentos táticos.");
      } finally {
        setCarregando(false);
      }
    };

    carregarComportamentos();
  }, []);

  const ordenarPorNome = (lista) =>
    [...lista].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  const abrirModalCadastro = () => {
    setComportamentoEditando(null);
    setModalOpen(true);
  };

  const abrirModalEdicao = (comportamento) => {
    setComportamentoEditando(comportamento);
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setComportamentoEditando(null);
  };

  const extrairMensagemErro = (erro, mensagemPadrao) =>
    erro.response?.data?.nome?.[0] || erro.response?.data?.detail || mensagemPadrao;

  const salvarComportamento = async (nomes) => {
    if (comportamentoEditando) {
      // US11 - Editar comportamento tático
      try {
        const resposta = await api.patch(
          `/treinos/comportamentos/${comportamentoEditando.id}/`,
          { nome: nomes[0] },
        );
        setComportamentos((prev) =>
          ordenarPorNome(
            prev.map((item) =>
              item.id === comportamentoEditando.id ? resposta.data : item,
            ),
          ),
        );
        setIdsDestacados([resposta.data.id]);
        dispararToast("Comportamento tático atualizado com sucesso.");
        fecharModal();
        return [];
      } catch (erro) {
        throw new Error(
          extrairMensagemErro(erro, "Não foi possível salvar o comportamento tático."),
        );
      }
    }

    // US10 - Cadastrar um ou mais comportamentos táticos
    const criados = [];
    const falhas = [];

    for (const nome of nomes) {
      try {
        const resposta = await api.post("/treinos/comportamentos/", { nome });
        criados.push(resposta.data);
      } catch (erro) {
        if (!erro.response) {
          throw new Error("Não foi possível salvar o comportamento tático.");
        }
        falhas.push({
          nome,
          mensagem: extrairMensagemErro(erro, "Não foi possível salvar este nome."),
        });
      }
    }

    if (criados.length > 0) {
      setComportamentos((prev) => ordenarPorNome([...prev, ...criados]));
      setIdsDestacados(criados.map((item) => item.id));
      dispararToast(
        criados.length === 1
          ? "Comportamento tático cadastrado com sucesso."
          : `${criados.length} comportamentos táticos cadastrados com sucesso.`,
      );
    }

    if (falhas.length === 0) {
      fecharModal();
    }

    return falhas;
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EA] text-[#10281E] lg:flex-row">
      {/* Menu Lateral */}
      <Sidebar
        activeNav="comportamentos"
        onSelectNav={onSelectNav}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        totalComportamentos={comportamentos.length}
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
          <span>+ Novo comportamento</span>
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
            <span>BIBLIOTECA</span>
            <span className="text-[#8A8D80]/70">/</span>
            <span className="text-[#8A8D80]">COMPORTAMENTOS TÁTICOS</span>
          </nav>

          {/* Cabeçalho */}
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-[#10281E] sm:text-[36px]">
                Comportamentos táticos
              </h1>
              <p className="mt-1 text-xs text-[#8A8D80]">
                Cadastre os comportamentos (ex.: ofensivo, defensivo) para vinculá-los às atividades.
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
              <span>Novo comportamento</span>
            </button>
          </div>

          {/* Listagem de Comportamentos Táticos */}
          <section aria-label="Lista de Comportamentos Táticos" className="space-y-3">
            {!carregando && comportamentos.length > 0 && (
              <div className="flex items-center justify-between font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#8A8D80]">
                <span>COMPORTAMENTOS · {comportamentos.length}</span>
                <span className="hidden normal-case tracking-normal sm:inline">
                  Clique no ícone para editar
                </span>
              </div>
            )}

            {carregando ? (
              <p className="text-sm text-[#8A8D80]">Carregando comportamentos táticos...</p>
            ) : comportamentos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#E4DFD2] bg-white/40 p-8 text-center text-sm text-[#8A8D80]">
                Nenhum comportamento tático cadastrado até o momento. Clique em "+ Novo comportamento" para começar.
              </div>
            ) : (
              comportamentos.map((comportamento) => (
                <ComportamentoCard
                  key={comportamento.id}
                  comportamento={comportamento}
                  destacado={idsDestacados.includes(comportamento.id)}
                  onEditComportamento={abrirModalEdicao}
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
      <ComportamentoModal
        key={
          comportamentoEditando
            ? `edit-${comportamentoEditando.id}`
            : `new-${modalOpen}`
        }
        isOpen={modalOpen}
        initialData={comportamentoEditando}
        onClose={fecharModal}
        onSave={salvarComportamento}
      />
    </div>
  );
}
