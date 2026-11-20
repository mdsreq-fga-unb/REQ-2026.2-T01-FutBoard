import React, { useEffect, useMemo, useState } from "react";
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

const ATIVIDADES_BIBLIOTECA_MOCK = [
  {
    id: 101,
    codigo: "JR1",
    nome: "Transição e Finalização Rápida",
    tipologia: "Jogo Setorial",
    sigla_tipologia: "JR",
    tipo_ssp: "Dirigido",
    comprimento: 30,
    largura: 25,
    numero_jogadores: 8,
    area_por_jogador: 93.75,
    dimensao_espaco: "Pequeno",
    momentos_jogo: ["Ataque"],
    fases_jogo: ["Criação", "Finalização"],
    comportamentos: ["CoordLinDef"],
    atributos_tecnicos: ["DomOrient"],
  },
  {
    id: 102,
    codigo: "JS3",
    nome: "Critica",
    tipologia: "Jogo Setorial",
    sigla_tipologia: "JS",
    tipo_ssp: "Especial",
    comprimento: 28,
    largura: 24,
    numero_jogadores: 6,
    area_por_jogador: 112,
    dimensao_espaco: "Médio",
    momentos_jogo: ["Ataque"],
    fases_jogo: ["Criação"],
    comportamentos: [],
    atributos_tecnicos: [],
  },
  {
    id: 103,
    codigo: "JS2",
    nome: "Cri",
    tipologia: "Jogo Condicionante",
    sigla_tipologia: "JC",
    tipo_ssp: "Competitivo",
    comprimento: 40,
    largura: 30,
    numero_jogadores: 10,
    area_por_jogador: 120,
    dimensao_espaco: "Médio",
    momentos_jogo: ["Ataque"],
    fases_jogo: ["Finalização"],
    comportamentos: [],
    atributos_tecnicos: [],
  },
  {
    id: 104,
    codigo: "JS1",
    nome: "JS | Cri / Fin",
    tipologia: "Jogo Setorial",
    sigla_tipologia: "JS",
    tipo_ssp: "Dirigido",
    comprimento: 24,
    largura: 25,
    numero_jogadores: 6,
    area_por_jogador: 100,
    dimensao_espaco: "Pequeno",
    momentos_jogo: ["Ataque"],
    fases_jogo: ["Criação"],
    comportamentos: [],
    atributos_tecnicos: [],
  },
];

function montarSubtituloAtividade(atividade) {
  const sigla =
    atividade.sigla_tipologia ||
    TIPOLOGIAS_SIGLAS[atividade.tipologia] ||
    atividade.tipologia ||
    "ATV";

  const fasesOuMomentos =
    atividade.fases_jogo?.length > 0
      ? atividade.fases_jogo.join(" / ")
      : atividade.momentos_jogo?.length > 0
        ? atividade.momentos_jogo.join(" / ")
        : atividade.tipologia || atividade.tipo_ssp || "";

  return fasesOuMomentos ? `${sigla} · ${fasesOuMomentos}` : sigla;
}

export default function SelecionarAtividadeBibliotecaModal({
  isOpen,
  atividadesJaIncluidas = [],
  onClose,
  onConfirm,
}) {
  const [atividadesBiblioteca, setAtividadesBiblioteca] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [busca, setBusca] = useState("");
  const [idsSelecionados, setIdsSelecionados] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    setBusca("");
    setIdsSelecionados([]);

    const buscarAtividades = async () => {
      setCarregando(true);
      try {
        const resposta = await api.get("/treinos/biblioteca/");
        if (Array.isArray(resposta.data) && resposta.data.length > 0) {
          setAtividadesBiblioteca(resposta.data);
        } else {
          setAtividadesBiblioteca(ATIVIDADES_BIBLIOTECA_MOCK);
        }
      } catch {
        setAtividadesBiblioteca(ATIVIDADES_BIBLIOTECA_MOCK);
      } finally {
        setCarregando(false);
      }
    };

    buscarAtividades();
  }, [isOpen]);

  const codigosJaIncluidos = useMemo(() => {
    return new Set(
      atividadesJaIncluidas
        .map((a) => (a.codigo || "").trim().toUpperCase())
        .filter(Boolean),
    );
  }, [atividadesJaIncluidas]);

  const jaEstaNaSessao = (atividade) => {
    const cod = (atividade.codigo || "").trim().toUpperCase();
    if (cod && codigosJaIncluidos.has(cod)) return true;
    return atividadesJaIncluidas.some(
      (a) => a.bibliotecaId && a.bibliotecaId === atividade.id,
    );
  };

  const atividadesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return atividadesBiblioteca;

    return atividadesBiblioteca.filter((atv) => {
      const codigo = (atv.codigo || "").toLowerCase();
      const nome = (atv.nome || "").toLowerCase();
      const tipologia = (atv.tipologia || "").toLowerCase();
      const tipoSsp = (atv.tipo_ssp || "").toLowerCase();
      const fases = (atv.fases_jogo || []).join(" ").toLowerCase();
      const momentos = (atv.momentos_jogo || []).join(" ").toLowerCase();

      return (
        codigo.includes(termo) ||
        nome.includes(termo) ||
        tipologia.includes(termo) ||
        tipoSsp.includes(termo) ||
        fases.includes(termo) ||
        momentos.includes(termo)
      );
    });
  }, [atividadesBiblioteca, busca]);

  const toggleSelecao = (atividade) => {
    if (jaEstaNaSessao(atividade)) return;

    setIdsSelecionados((prev) =>
      prev.includes(atividade.id)
        ? prev.filter((id) => id !== atividade.id)
        : [...prev, atividade.id],
    );
  };

  const handleConfirmar = () => {
    if (idsSelecionados.length === 0) return;

    const atividadesEscolhidas = atividadesBiblioteca.filter((atv) =>
      idsSelecionados.includes(atv.id),
    );

    onConfirm(atividadesEscolhidas);
  };

  if (!isOpen) return null;

  const totalSelecionadas = idsSelecionados.length;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-selecionar-biblioteca-titulo"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#10281E]/65 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Container do Modal */}
      <div className="relative z-10 flex max-h-[88vh] w-full max-w-[540px] flex-col overflow-hidden rounded-2xl border border-[#E4DFD2] bg-[#FFFFFF] shadow-2xl">
        {/* Cabeçalho */}
        <div className="flex shrink-0 items-start justify-between border-b border-[#E4DFD2]/60 px-6 pt-5 pb-4">
          <div>
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[#8A8D80]">
              PLANEJAMENTO · SESSÃO
            </span>
            <h2
              id="modal-selecionar-biblioteca-titulo"
              className="mt-0.5 font-display text-xl font-bold text-[#10281E]"
            >
              Atividades da biblioteca
            </h2>
            <p className="mt-1 text-xs text-[#6E7266]">
              Selecione as atividades que entram nesta sessão.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#8A8D80] transition hover:bg-[#F5F2EA] hover:text-[#10281E]"
            aria-label="Fechar modal"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Corpo com Pesquisa e Lista de Atividades */}
        <div className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
          {/* Campo de Pesquisa */}
          {atividadesBiblioteca.length > 0 && (
            <div className="relative">
              <input
                type="search"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Pesquisar atividade por código, nome ou fase..."
                aria-label="Pesquisar atividade na biblioteca"
                className="w-full rounded-xl border border-[#E4DFD2] bg-[#FAF9F5] py-2 pr-3.5 pl-9 text-xs text-[#10281E] placeholder-[#8A8D80] outline-none transition focus:border-[#0E3A29] focus:bg-[#FFFFFF]"
              />
              <svg
                className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#8A8D80]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35"
                />
              </svg>
            </div>
          )}

          {carregando ? (
            <p className="py-6 text-center text-xs text-[#8A8D80]">
              Carregando atividades da biblioteca...
            </p>
          ) : atividadesFiltradas.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E4DFD2] bg-[#FAF9F5] px-4 py-8 text-center">
              <p className="text-xs font-medium text-[#10281E]">
                Nenhuma atividade encontrada.
              </p>
              <p className="mt-1 text-[11px] text-[#8A8D80]">
                Tente buscar por outro termo ou cadastre uma nova atividade.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {atividadesFiltradas.map((atv) => {
                const selecionada = idsSelecionados.includes(atv.id);
                const jaIncluida = jaEstaNaSessao(atv);
                const subtitulo = montarSubtituloAtividade(atv);

                return (
                  <button
                    key={atv.id}
                    type="button"
                    disabled={jaIncluida}
                    onClick={() => toggleSelecao(atv)}
                    aria-pressed={selecionada}
                    className={`fb-library-select-item flex w-full items-center justify-between gap-3 px-4 py-3 text-left ${
                      jaIncluida
                        ? "fb-library-select-item--disabled"
                        : selecionada
                          ? "fb-library-select-item--selected"
                          : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-sm font-semibold text-[#10281E]">
                          {atv.codigo ? `${atv.codigo.toLowerCase()} · ` : ""}
                          {atv.nome}
                        </span>

                        {jaIncluida && (
                          <span className="rounded-full bg-[#E4DFD2] px-2 py-0.5 font-mono text-[10px] font-medium text-[#10281E]">
                            Já na sessão
                          </span>
                        )}
                      </div>

                      <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-wider text-[#6E7266]">
                        {subtitulo}
                      </span>
                    </div>

                    {/* Indicador circular de seleção à direita */}
                    {selecionada || jaIncluida ? (
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#10281E] text-white">
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                    ) : (
                      <span className="h-6 w-6 shrink-0 rounded-full bg-[#E8E4D9]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="flex shrink-0 items-center justify-end gap-4 border-t border-[#E4DFD2]/70 bg-[#FAF9F5] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1.5 text-xs font-medium text-[#10281E] transition hover:opacity-75"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirmar}
            disabled={totalSelecionadas === 0}
            className={`rounded-full px-5 py-2.5 text-xs font-medium text-[#FFFFFF] transition ${
              totalSelecionadas > 0
                ? "bg-[#0E3A29] hover:bg-[#10281E] cursor-pointer"
                : "bg-[#93A39B] cursor-not-allowed opacity-75"
            }`}
          >
            {totalSelecionadas > 0
              ? `Adicionar ${totalSelecionadas} à sessão`
              : "Adicionar à sessão"}
          </button>
        </div>
      </div>
    </div>
  );
}
