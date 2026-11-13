import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import AtividadeBibliotecaCard from "../components/AtividadeBibliotecaCard.jsx";
import AtividadeBibliotecaModal from "../components/AtividadeBibliotecaModal.jsx";
import api from "../services/api.js";

const TIPOLOGIAS_SIGLAS = {
  Confrontos: "CF",
  "Jogo Condicionante": "JC",
  "Jogo de Posse": "JP",
  Rondo: "RD",
  "Jogo Setorial": "JS",
  Situacional: "SIT",
  "Dinâmica de Passe": "DP",
  "Dinâmica de Finalização": "DF",
  "Dinâmica ProtDef": "DPD",
  "Coletivo Direcionado": "CD",
  "Jogo de Bola Parada": "JBP",
};

export default function BibliotecaPage({ onSelectNav }) {
  const [atividades, setAtividades] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Controle do Modal de Cadastro (US19)
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const dispararToast = (mensagem) => {
    setToastMsg(mensagem);
    window.clearTimeout(window.__fbToastTimer);
    window.__fbToastTimer = window.setTimeout(() => {
      setToastMsg("");
    }, 3500);
  };

  useEffect(() => {
    const carregarAtividades = async () => {
      try {
        const resposta = await api.get("/treinos/biblioteca/");
        if (Array.isArray(resposta.data)) {
          setAtividades(resposta.data);
        }
      } catch {
        // Mantém a lista vazia caso a API não esteja ligada para testar o protótipo de estado vazio
        setAtividades([]);
      } finally {
        setCarregando(false);
      }
    };

    carregarAtividades();
  }, []);

  const abrirModalCadastro = () => {
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
  };

  const salvarAtividade = async (dados) => {
    try {
      let novaAtividade = null;
      try {
        const resposta = await api.post("/treinos/biblioteca/", dados);
        novaAtividade = resposta.data;
      } catch (apiErr) {
        // Se a API retornou erro de validação (ex: 400), repassa para o modal exibir
        if (apiErr.response?.data) {
          throw apiErr;
        }

        // Fallback local caso a API/DB não esteja ligada no momento do teste
        const proximoId =
          atividades.length > 0
            ? Math.max(...atividades.map((a) => a.id || 0)) + 1
            : 1;
        const sigla =
          TIPOLOGIAS_SIGLAS[dados.tipologia] ||
          dados.tipologia.slice(0, 2).toUpperCase();
        const codigo = `${sigla}${proximoId}`;
        const area =
          dados.comprimento && dados.largura && dados.numero_jogadores
            ? (dados.comprimento * dados.largura) / dados.numero_jogadores
            : null;

        let dimensao = "Não Definido";
        if (dados.orientacao === "PDI") {
          dimensao = "Não Definido";
        } else if (area) {
          dimensao = area <= 100 ? "Pequeno" : area <= 200 ? "Médio" : "Grande";
        }

        novaAtividade = {
          id: proximoId,
          codigo,
          nome: dados.nome,
          atividade_ssp: `${sigla} | ${dados.nome}`,
          tipologia: dados.tipologia,
          sigla_tipologia: sigla,
          tipo_ssp: dados.tipo_ssp,
          orientacao: dados.orientacao,
          comprimento: dados.comprimento,
          largura: dados.largura,
          numero_jogadores: dados.numero_jogadores,
          area_por_jogador: area,
          dimensao_espaco: dimensao,
          momentos_jogo: dados.momentos_jogo || [],
          fases_jogo: dados.fases_jogo || [],
          comportamentos: dados.comportamentos || [],
          atributos_tecnicos: dados.atributos_tecnicos || [],
        };
      }

      setAtividades((prev) => [novaAtividade, ...prev]);
      dispararToast("Atividade Criada");
      setModalOpen(false);
    } catch (erro) {
      const dadosErro = erro.response?.data;
      const mensagem =
        dadosErro?.nome?.[0] ||
        dadosErro?.tipologia?.[0] ||
        dadosErro?.tipo_ssp?.[0] ||
        dadosErro?.dimensao_espaco?.[0] ||
        dadosErro?.detail ||
        erro.message ||
        "Não foi possível cadastrar a atividade.";
      throw new Error(mensagem);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F2EA] text-[#10281E] lg:flex-row">
      {/* Menu Lateral */}
      <Sidebar
        activeNav="biblioteca"
        onSelectNav={onSelectNav}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        totalAtividades={atividades.length}
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
          <span>+ Novo</span>
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
          </nav>

          {/* Cabeçalho */}
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-[#10281E] sm:text-[36px]">
                Biblioteca
              </h1>
              <p className="mt-1 text-xs text-[#8A8D80]">
                Banco de atividades com código, dimensões, momentos e princípios táticos.
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
              <span>Novo</span>
            </button>
          </div>

          {/* Estado de Carregamento */}
          {carregando ? (
            <p className="text-sm text-[#8A8D80]">Carregando biblioteca...</p>
          ) : atividades.length === 0 ? (
            /* Estado Vazio (Fiel à Página 1 do PDF) */
            <div className="flex min-h-[380px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#E4DFD2] bg-white/50 px-6 py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#0E3A29]/20 bg-[#F5F2EA]">
                <svg
                  className="h-7 w-7 text-[#0E3A29]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>

              <h2 className="font-display text-lg font-bold text-[#10281E]">
                Nenhuma atividade cadastrada
              </h2>
              <p className="mt-1 max-w-sm text-xs text-[#8A8D80]">
                Cadastre atividades na biblioteca para disponibilizá-las nas sessões de treino.
              </p>

              <button
                type="button"
                onClick={abrirModalCadastro}
                className="fb-btn-primary mt-6 inline-flex items-center gap-2 px-7 py-3 text-sm font-medium shadow-sm transition hover:shadow-md"
              >
                <span>Cadastrar Atividade</span>
              </button>
            </div>
          ) : (
            /* Lista com Atividades Cadastradas (Fiel à Página 2 do PDF) */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#8A8D80]">
                  ATIVIDADES DA BIBLIOTECA · {atividades.length}
                </span>
              </div>

              <section aria-label="Lista de Atividades" className="space-y-4">
                {atividades.map((atv) => (
                  <AtividadeBibliotecaCard key={atv.id} atividade={atv} />
                ))}
              </section>
            </div>
          )}
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

      {/* Modal de Cadastro de Atividade (US19) */}
      {modalOpen && (
        <AtividadeBibliotecaModal
          isOpen={modalOpen}
          onClose={fecharModal}
          onSave={salvarAtividade}
        />
      )}
    </div>
  );
}

