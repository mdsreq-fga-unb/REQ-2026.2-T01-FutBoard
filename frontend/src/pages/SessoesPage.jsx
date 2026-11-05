import React, { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import SessaoCard from "../components/SessaoCard.jsx";
import SessaoModal from "../components/SessaoModal.jsx";

export default function SessoesPage({ onSelectNav }) {
  const [sessoes, setSessoes] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Controle do Modal de Cadastro e Edição
  const [modalOpen, setModalOpen] = useState(false);
  const [sessaoEditando, setSessaoEditando] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

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
    if (sessaoEditando) {
      setSessoes((prev) =>
        prev.map((item) =>
          item.id === sessaoEditando.id ? { ...item, ...dados } : item,
        ),
      );
      dispararToast("Sessão atualizada com sucesso.");
    } else {
      const proximoId =
        sessoes.length > 0 ? Math.max(...sessoes.map((s) => s.id)) + 1 : 1;
      const codigo = `SES-${proximoId < 10 ? `0${proximoId}` : proximoId}`;
      setSessoes((prev) => [
        ...prev,
        {
          id: proximoId,
          codigo,
          ...dados,
        },
      ]);
      dispararToast("Sessão cadastrada com sucesso.");
    }

    setModalOpen(false);
    setSessaoEditando(null);
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
              {sessoes.map((sessao) => (
                <SessaoCard
                  key={sessao.id}
                  sessao={sessao}
                  onEditSessao={abrirModalEdicao}
                />
              ))}
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
        onClose={fecharModal}
        onSave={salvarSessao}
      />
    </div>
  );
}
