import React, { useEffect, useMemo, useRef, useState } from "react";

const TIPOLOGIAS = [
  { valor: "Confrontos", sigla: "CF" },
  { valor: "Jogo Condicionante", sigla: "JC" },
  { valor: "Jogo de Posse", sigla: "JP" },
  { valor: "Rondo", sigla: "RD" },
  { valor: "Jogo Setorial", sigla: "JS" },
  { valor: "Situacional", sigla: "SIT" },
  { valor: "Dinâmica de Passe", sigla: "DP" },
  { valor: "Dinâmica de Finalização", sigla: "DF" },
  { valor: "Dinâmica ProtDef", sigla: "DPD" },
  { valor: "Coletivo Direcionado", sigla: "CD" },
  { valor: "Jogo de Bola Parada", sigla: "JBP" },
];

const TIPOS_SSP = ["Especial", "Dirigido", "Competitivo"];

// Opções com nomes amigáveis conforme o print do usuário
const MOMENTOS_JOGO_OPCOES = [
  "Ataque",
  "Defesa",
  "Transição Ofensiva",
  "Transição Defensiva",
  "Bola Parada",
];

const FASES_JOGO_OPCOES = [
  "Criação",
  "Finalização",
  "Construção",
  "1ª Construção",
  "2ª Construção",
  "Transição Ofensiva",
  "Transição Defensiva",
];

// Compatibilidade transparente com o backend Django
const MAPA_MOMENTOS_API = {
  "Transição Ofensiva": "Trans Of",
  "Transição Defensiva": "Trans Def",
};

const MAPA_FASES_API = {
  Construção: "1ª Construção",
  "Transição Ofensiva": "Criação",
  "Transição Defensiva": "Finalização",
};

const MAPA_MOMENTOS_REVERSO = {
  "Trans Of": "Transição Ofensiva",
  "Trans Def": "Transição Defensiva",
};

export default function AtividadeSessaoModal({
  isOpen,
  initialData = null,
  onClose,
  onSave,
}) {
  const isEditing = Boolean(initialData);

  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [ordem, setOrdem] = useState("");

  const [tipoSsp, setTipoSsp] = useState("");
  const [tipologia, setTipologia] = useState("");
  const [tempo, setTempo] = useState("");
  const [numeroJogadores, setNumeroJogadores] = useState("");

  const [comprimento, setComprimento] = useState("");
  const [largura, setLargura] = useState("");

  const [momentosJogo, setMomentosJogo] = useState([]);
  const [fasesJogo, setFasesJogo] = useState([]);
  const [comportamentos, setComportamentos] = useState([]);
  const [atributosTecnicos, setAtributosTecnicos] = useState([]);

  // Controle do dropdown aberto ('momentos' | 'fases' | 'comportamentos' | 'atributos' | null)
  const [abertoDropdown, setAbertoDropdown] = useState(null);
  const [inputComportamento, setInputComportamento] = useState("");
  const [inputAtributo, setInputAtributo] = useState("");

  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const containerRef = useRef(null);

  const resetForm = () => {
    setCodigo("");
    setNome("");
    setOrdem("");
    setTipoSsp("");
    setTipologia("");
    setTempo("");
    setNumeroJogadores("");
    setComprimento("");
    setLargura("");
    setMomentosJogo([]);
    setFasesJogo([]);
    setComportamentos([]);
    setAtributosTecnicos([]);
    setAbertoDropdown(null);
    setInputComportamento("");
    setInputAtributo("");
    setErro("");
    setSalvando(false);
  };

  // Preenche o formulário no modo edição ou reseta no modo criação
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setCodigo(initialData.codigo || "");
        setNome(initialData.nome || "");
        setOrdem(initialData.ordem != null ? String(initialData.ordem) : "");
        setTipoSsp(initialData.tipo_ssp || "");
        setTipologia(initialData.tipologia || "");
        setTempo(initialData.tempo != null ? String(initialData.tempo) : "");
        setNumeroJogadores(
          initialData.numero_jogadores != null
            ? String(initialData.numero_jogadores)
            : "",
        );
        setComprimento(
          initialData.comprimento != null
            ? String(initialData.comprimento)
            : "",
        );
        setLargura(
          initialData.largura != null ? String(initialData.largura) : "",
        );
        setMomentosJogo(
          (initialData.momentos_jogo || []).map(
            (m) => MAPA_MOMENTOS_REVERSO[m] || m,
          ),
        );
        setFasesJogo(initialData.fases_jogo || []);
        setComportamentos(initialData.comportamentos || []);
        setAtributosTecnicos(initialData.atributos_tecnicos || []);
        setAbertoDropdown(null);
        setInputComportamento("");
        setInputAtributo("");
        setErro("");
        setSalvando(false);
      } else {
        resetForm();
      }
    }
  }, [isOpen, initialData]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickFora = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setAbertoDropdown(null);
      }
    };
    if (abertoDropdown) {
      document.addEventListener("mousedown", handleClickFora);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickFora);
    };
  }, [abertoDropdown]);

  // Cálculo de Área e Dimensão em tempo real (RN01 e RN02)
  const espacoCalculado = useMemo(() => {
    const c = parseFloat(comprimento);
    const l = parseFloat(largura);
    const j = parseInt(numeroJogadores, 10);

    if (c > 0 && l > 0 && j > 0) {
      const area = (c * l) / j;
      let dimensao = "Grande";
      if (area <= 100) {
        dimensao = "Pequeno";
      } else if (area <= 200) {
        dimensao = "Médio";
      }
      return `${Math.round(area)} m² / ${dimensao}`;
    }

    return "—";
  }, [comprimento, largura, numeroJogadores]);

  // Ao alterar a tipologia, sugere a sigla no código caso esteja vazio
  const handleTipologiaChange = (novaTipologia) => {
    setTipologia(novaTipologia);
    setErro("");
    const item = TIPOLOGIAS.find((t) => t.valor === novaTipologia);
    if (item && (!codigo || TIPOLOGIAS.some((t) => codigo.startsWith(t.sigla)))) {
      setCodigo(`${item.sigla}1`);
    }
  };

  const toggleItemLista = (lista, setLista, item) => {
    if (lista.includes(item)) {
      setLista(lista.filter((i) => i !== item));
    } else {
      setLista([...lista, item]);
    }
  };

  const adicionarItemTexto = (lista, setLista, valor, setInput) => {
    const texto = valor.trim();
    if (texto && !lista.includes(texto)) {
      setLista([...lista, texto]);
      setInput("");
    }
  };

  // Validação em tempo real para habilitar o botão "Criar atividade" e deixá-lo verdinho
  const camposObrigatoriosPreenchidos = useMemo(() => {
    if (!nome.trim() || !tipoSsp || !tipologia || !codigo.trim()) {
      return false;
    }

    const c = comprimento !== "" ? parseFloat(comprimento) : null;
    const l = largura !== "" ? parseFloat(largura) : null;
    const j = numeroJogadores !== "" ? parseInt(numeroJogadores, 10) : null;

    const algumPreenchido = c !== null || l !== null || j !== null;
    const todosPreenchidos = c !== null && l !== null && j !== null;

    if (algumPreenchido && !todosPreenchidos) {
      return false;
    }

    if (
      todosPreenchidos &&
      (isNaN(c) || isNaN(l) || isNaN(j) || c <= 0 || l <= 0 || j <= 0)
    ) {
      return false;
    }

    return true;
  }, [nome, tipoSsp, tipologia, codigo, comprimento, largura, numeroJogadores]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (!nome.trim()) {
      setErro("O campo Nome da Atividade (SSP) é obrigatório.");
      return;
    }

    if (!codigo.trim()) {
      setErro("O campo Código da Atividade é obrigatório.");
      return;
    }

    if (!tipoSsp) {
      setErro("Selecione o Tipo SSP.");
      return;
    }

    if (!tipologia) {
      setErro("Selecione a Tipologia da atividade SSP.");
      return;
    }

    const c = comprimento ? parseFloat(comprimento) : null;
    const l = largura ? parseFloat(largura) : null;
    const j = numeroJogadores ? parseInt(numeroJogadores, 10) : null;

    const algumPreenchido = c !== null || l !== null || j !== null;
    const todosPreenchidos = c !== null && l !== null && j !== null;

    if (algumPreenchido && !todosPreenchidos) {
      setErro(
        "Para calcular a área e dimensão, preencha Comprimento, Largura e Nº de jogadores.",
      );
      return;
    }

    if (todosPreenchidos && (c <= 0 || l <= 0 || j <= 0)) {
      setErro("Comprimento, largura e número de jogadores devem ser maiores que zero.");
      return;
    }

    const itemTipologia = TIPOLOGIAS.find((t) => t.valor === tipologia);
    const sigla = itemTipologia?.sigla || tipologia.slice(0, 2).toUpperCase();
    const areaPorJogador = todosPreenchidos ? (c * l) / j : null;
    let dimensaoEspaco = "Não Definido";
    if (areaPorJogador !== null) {
      if (areaPorJogador <= 100) dimensaoEspaco = "Pequeno";
      else if (areaPorJogador <= 200) dimensaoEspaco = "Médio";
      else dimensaoEspaco = "Grande";
    }

    const payload = {
      codigo: codigo.trim() || undefined,
      nome: nome.trim(),
      tipologia,
      sigla_tipologia: sigla,
      tipo_ssp: tipoSsp,
      ordem: ordem ? parseInt(ordem, 10) : null,
      tempo: tempo ? parseInt(tempo, 10) : null,
      comprimento: c,
      largura: l,
      numero_jogadores: j,
      area_por_jogador: areaPorJogador,
      dimensao_espaco: dimensaoEspaco,
      momentos_jogo: momentosJogo.map((m) => MAPA_MOMENTOS_API[m] || m),
      fases_jogo: fasesJogo.map((f) => MAPA_FASES_API[f] || f),
      comportamentos,
      atributos_tecnicos: atributosTecnicos,
    };

    try {
      setSalvando(true);
      await onSave(payload);
      resetForm();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-atividade-sessao-titulo"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#10281E]/60 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Container Principal do Modal com altura máxima e scrollbar no corpo */}
      <div className="relative z-10 my-auto flex max-h-[85vh] w-full max-w-4xl flex-col rounded-2xl border border-[#E4DFD2] bg-[#FFFFFF] shadow-2xl">
        {/* Cabeçalho Fixo */}
        <div className="flex shrink-0 items-start justify-between border-b border-[#E4DFD2]/50 px-7 pt-5 pb-3">
          <div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#8A8D80]">
              {isEditing ? "BIBLIOTECA · EDIÇÃO" : "BIBLIOTECA · NOVA"}
            </span>
            <h2
              id="modal-atividade-sessao-titulo"
              className="mt-0.5 font-display text-2xl font-bold tracking-tight text-[#10281E]"
            >
              {isEditing ? "Editar atividade" : "Nova atividade"}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1.5 text-[#8A8D80] transition hover:bg-[#F5F2EA] hover:text-[#10281E]"
            aria-label="Fechar modal"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Formulário com scroll vertical no corpo do modal (fiel ao print) */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 overflow-y-auto px-7 py-5"
          noValidate
        >
          {erro && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700"
            >
              {erro}
            </div>
          )}

          {/* LINHA 1 */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-4">
            <div>
              <label
                htmlFor="campo-codigo"
                className="mb-1 block text-xs font-medium text-[#10281E]"
              >
                Código da Atividade <span className="text-red-500">*</span>
              </label>
              <input
                id="campo-codigo"
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="JS2"
                className="w-full rounded-xl border border-[#E4DFD2] bg-[#FFFFFF] px-3.5 py-2.5 font-mono text-xs text-[#10281E] outline-none transition focus:border-[#0E3A29] focus:ring-1 focus:ring-[#0E3A29]"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="campo-nome"
                className="mb-1 block text-xs font-medium text-[#10281E]"
              >
                Nome da Atividade (SSP) <span className="text-red-500">*</span>
              </label>
              <input
                id="campo-nome"
                type="text"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  setErro("");
                }}
                placeholder="JS | Cri / Fin"
                className="w-full rounded-xl border border-[#E4DFD2] bg-[#FFFFFF] px-3.5 py-2.5 text-xs text-[#10281E] outline-none transition focus:border-[#0E3A29] focus:ring-1 focus:ring-[#0E3A29]"
              />
            </div>

            <div>
              <label
                htmlFor="campo-ordem"
                className="mb-1 block text-xs font-medium text-[#10281E]"
              >
                Ordem
              </label>
              <input
                id="campo-ordem"
                type="number"
                min="1"
                value={ordem}
                onChange={(e) => setOrdem(e.target.value)}
                placeholder="1"
                className="w-full rounded-xl border border-[#E4DFD2] bg-[#FFFFFF] px-3.5 py-2.5 font-mono text-xs text-[#10281E] outline-none transition focus:border-[#0E3A29] focus:ring-1 focus:ring-[#0E3A29]"
              />
            </div>
          </div>

          {/* LINHA 2 */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-4">
            <div>
              <label
                htmlFor="campo-tipo-ssp"
                className="mb-1 block text-xs font-medium text-[#10281E]"
              >
                Tipo SSP <span className="text-red-500">*</span>
              </label>
              <select
                id="campo-tipo-ssp"
                value={tipoSsp}
                onChange={(e) => {
                  setTipoSsp(e.target.value);
                  setErro("");
                }}
                className="w-full rounded-xl border border-[#E4DFD2] bg-[#FFFFFF] px-3.5 py-2.5 text-xs text-[#10281E] outline-none transition focus:border-[#0E3A29] focus:ring-1 focus:ring-[#0E3A29]"
              >
                <option value="">Selecione</option>
                {TIPOS_SSP.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="campo-tipologia"
                className="mb-1 block text-xs font-medium text-[#10281E]"
              >
                Tipologia da atividade SSP <span className="text-red-500">*</span>
              </label>
              <select
                id="campo-tipologia"
                value={tipologia}
                onChange={(e) => handleTipologiaChange(e.target.value)}
                className="w-full rounded-xl border border-[#E4DFD2] bg-[#FFFFFF] px-3.5 py-2.5 text-xs text-[#10281E] outline-none transition focus:border-[#0E3A29] focus:ring-1 focus:ring-[#0E3A29]"
              >
                <option value="">Selecione</option>
                {TIPOLOGIAS.map((t) => (
                  <option key={t.valor} value={t.valor}>
                    {t.valor} ({t.sigla})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="campo-tempo"
                className="mb-1 block text-xs font-medium text-[#10281E]"
              >
                Tempo(Min)
              </label>
              <input
                id="campo-tempo"
                type="number"
                min="1"
                value={tempo}
                onChange={(e) => setTempo(e.target.value)}
                placeholder="60"
                className="w-full rounded-xl border border-[#E4DFD2] bg-[#FFFFFF] px-3.5 py-2.5 font-mono text-xs text-[#10281E] outline-none transition focus:border-[#0E3A29] focus:ring-1 focus:ring-[#0E3A29]"
              />
            </div>

            <div>
              <label
                htmlFor="campo-jogadores"
                className="mb-1 block text-xs font-medium text-[#10281E]"
              >
                Nº de jogadores
              </label>
              <input
                id="campo-jogadores"
                type="number"
                min="1"
                value={numeroJogadores}
                onChange={(e) => {
                  setNumeroJogadores(e.target.value);
                  setErro("");
                }}
                placeholder="6"
                className="w-full rounded-xl border border-[#E4DFD2] bg-[#FFFFFF] px-3.5 py-2.5 font-mono text-xs text-[#10281E] outline-none transition focus:border-[#0E3A29] focus:ring-1 focus:ring-[#0E3A29]"
              />
            </div>
          </div>

          {/* LINHA 3 */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-4">
            <div>
              <label
                htmlFor="campo-comprimento"
                className="mb-1 block text-xs font-medium text-[#10281E]"
              >
                Comprimento (m)
              </label>
              <input
                id="campo-comprimento"
                type="number"
                step="0.1"
                min="1"
                value={comprimento}
                onChange={(e) => {
                  setComprimento(e.target.value);
                  setErro("");
                }}
                placeholder="24"
                className="w-full rounded-xl border border-[#E4DFD2] bg-[#FFFFFF] px-3.5 py-2.5 font-mono text-xs text-[#10281E] outline-none transition focus:border-[#0E3A29] focus:ring-1 focus:ring-[#0E3A29]"
              />
            </div>

            <div>
              <label
                htmlFor="campo-largura"
                className="mb-1 block text-xs font-medium text-[#10281E]"
              >
                Largura (m)
              </label>
              <input
                id="campo-largura"
                type="number"
                step="0.1"
                min="1"
                value={largura}
                onChange={(e) => {
                  setLargura(e.target.value);
                  setErro("");
                }}
                placeholder="25"
                className="w-full rounded-xl border border-[#E4DFD2] bg-[#FFFFFF] px-3.5 py-2.5 font-mono text-xs text-[#10281E] outline-none transition focus:border-[#0E3A29] focus:ring-1 focus:ring-[#0E3A29]"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                id="rotulo-area-dimensao"
                className="mb-1 block text-xs font-medium text-[#10281E]"
              >
                Área / Dimensão
              </label>
              <div
                aria-labelledby="rotulo-area-dimensao"
                className="flex h-[41px] items-center rounded-xl bg-[#EBE7DF] px-3.5 font-mono text-xs font-medium text-[#7A7D70]"
              >
                {espacoCalculado}
              </div>
            </div>
          </div>

          {/* LINHA 4: Dropdowns abrindo para BAIXO com Scrollbar interna (conforme o print do usuário) */}
          <div
            ref={containerRef}
            className="relative grid grid-cols-1 gap-3.5 sm:grid-cols-4"
          >
            {/* Momento do Jogo */}
            <div className="relative">
              <label
                id="rotulo-momento-jogo"
                className="mb-1 block text-xs font-medium text-[#10281E]"
              >
                Momento do Jogo
              </label>
              <div
                aria-labelledby="rotulo-momento-jogo"
                onClick={() =>
                  setAbertoDropdown(
                    abertoDropdown === "momentos" ? null : "momentos",
                  )
                }
                className="flex min-h-[41px] cursor-pointer items-center justify-between rounded-xl border border-[#E4DFD2] bg-[#FFFFFF] px-3 py-1.5 transition hover:border-[#0E3A29]"
              >
                <div className="flex flex-wrap gap-1 overflow-hidden truncate">
                  {momentosJogo.length === 0 ? (
                    <span className="text-xs text-[#8A8D80]">
                      Nenhum selecionado
                    </span>
                  ) : (
                    momentosJogo.map((m) => (
                      <span
                        key={m}
                        className="rounded-md bg-[#0E3A29]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#0E3A29]"
                      >
                        {m}
                      </span>
                    ))
                  )}
                </div>
                <button
                  type="button"
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E4DFD2]/70 text-xs font-bold text-[#10281E] transition hover:bg-[#C6E96B]"
                  aria-label="Selecionar momentos do jogo"
                >
                  +
                </button>
              </div>

              {/* Dropdown abaixo com scroll (Fiel ao print) */}
              {abertoDropdown === "momentos" && (
                <div className="absolute top-full left-0 z-30 mt-1.5 w-full min-w-[210px] overflow-hidden rounded-xl border border-[#E4DFD2] bg-white shadow-xl">
                  <div className="max-h-40 overflow-y-auto py-1">
                    {MOMENTOS_JOGO_OPCOES.map((opcao) => {
                      const selecionado = momentosJogo.includes(opcao);
                      return (
                        <div
                          key={opcao}
                          onClick={() =>
                            toggleItemLista(
                              momentosJogo,
                              setMomentosJogo,
                              opcao,
                            )
                          }
                          className={`flex cursor-pointer items-center justify-between px-3.5 py-2 text-xs transition ${
                            selecionado
                              ? "bg-[#0E3A29]/10 font-semibold text-[#0E3A29]"
                              : "text-[#10281E] hover:bg-[#F5F2EA]"
                          }`}
                        >
                          <span>{opcao}</span>
                          {selecionado && (
                            <span className="text-xs font-bold text-[#0E3A29]">
                              ✓
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Fases do Jogo */}
            <div className="relative">
              <label
                id="rotulo-fases-jogo"
                className="mb-1 block text-xs font-medium text-[#10281E]"
              >
                Fases do Jogo
              </label>
              <div
                aria-labelledby="rotulo-fases-jogo"
                onClick={() =>
                  setAbertoDropdown(abertoDropdown === "fases" ? null : "fases")
                }
                className="flex min-h-[41px] cursor-pointer items-center justify-between rounded-xl border border-[#E4DFD2] bg-[#FFFFFF] px-3 py-1.5 transition hover:border-[#0E3A29]"
              >
                <div className="flex flex-wrap gap-1 overflow-hidden truncate">
                  {fasesJogo.length === 0 ? (
                    <span className="text-xs text-[#8A8D80]">
                      Nenhum selecionado
                    </span>
                  ) : (
                    fasesJogo.map((f) => (
                      <span
                        key={f}
                        className="rounded-md bg-[#E4DFD2] px-1.5 py-0.5 text-[10px] font-medium text-[#10281E]"
                      >
                        {f}
                      </span>
                    ))
                  )}
                </div>
                <button
                  type="button"
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E4DFD2]/70 text-xs font-bold text-[#10281E] transition hover:bg-[#C6E96B]"
                  aria-label="Selecionar fases do jogo"
                >
                  +
                </button>
              </div>

              {/* Dropdown abaixo com scroll (Fiel ao print) */}
              {abertoDropdown === "fases" && (
                <div className="absolute top-full left-0 z-30 mt-1.5 w-full min-w-[210px] overflow-hidden rounded-xl border border-[#E4DFD2] bg-white shadow-xl">
                  <div className="max-h-40 overflow-y-auto py-1">
                    {FASES_JOGO_OPCOES.map((opcao) => {
                      const selecionado = fasesJogo.includes(opcao);
                      return (
                        <div
                          key={opcao}
                          onClick={() =>
                            toggleItemLista(fasesJogo, setFasesJogo, opcao)
                          }
                          className={`flex cursor-pointer items-center justify-between px-3.5 py-2 text-xs transition ${
                            selecionado
                              ? "bg-[#0E3A29]/10 font-semibold text-[#0E3A29]"
                              : "text-[#10281E] hover:bg-[#F5F2EA]"
                          }`}
                        >
                          <span>{opcao}</span>
                          {selecionado && (
                            <span className="text-xs font-bold text-[#0E3A29]">
                              ✓
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Princípios Táticos */}
            <div className="relative">
              <label
                id="rotulo-principios-taticos"
                className="mb-1 block text-xs font-medium text-[#10281E]"
              >
                Princípios Táticos
              </label>
              <div
                aria-labelledby="rotulo-principios-taticos"
                onClick={() =>
                  setAbertoDropdown(
                    abertoDropdown === "comportamentos"
                      ? null
                      : "comportamentos",
                  )
                }
                className="flex min-h-[41px] cursor-pointer items-center justify-between rounded-xl border border-[#E4DFD2] bg-[#FFFFFF] px-3 py-1.5 transition hover:border-[#0E3A29]"
              >
                <div className="flex flex-wrap gap-1 overflow-hidden truncate">
                  {comportamentos.length === 0 ? (
                    <span className="text-xs text-[#8A8D80]">
                      Nenhum selecionado
                    </span>
                  ) : (
                    comportamentos.map((c) => (
                      <span
                        key={c}
                        className="rounded-md border border-[#E4DFD2] bg-[#F5F2EA] px-1.5 py-0.5 text-[10px] font-mono text-[#10281E]"
                      >
                        {c}
                      </span>
                    ))
                  )}
                </div>
                <button
                  type="button"
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E4DFD2]/70 text-xs font-bold text-[#10281E] transition hover:bg-[#C6E96B]"
                  aria-label="Adicionar princípio tático"
                >
                  +
                </button>
              </div>

              {/* Dropdown com scroll */}
              {abertoDropdown === "comportamentos" && (
                <div className="absolute top-full left-0 z-30 mt-1.5 w-full min-w-[240px] rounded-xl border border-[#E4DFD2] bg-white p-3 shadow-xl">
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={inputComportamento}
                      onChange={(e) => setInputComportamento(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          adicionarItemTexto(
                            comportamentos,
                            setComportamentos,
                            inputComportamento,
                            setInputComportamento,
                          );
                        }
                      }}
                      placeholder="Ex.: CoordLinDef"
                      className="w-full rounded-lg border border-[#E4DFD2] px-2.5 py-1 text-xs text-[#10281E] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        adicionarItemTexto(
                          comportamentos,
                          setComportamentos,
                          inputComportamento,
                          setInputComportamento,
                        )
                      }
                      className="rounded-lg bg-[#0E3A29] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#10281E]"
                    >
                      Ok
                    </button>
                  </div>

                  <div className="mt-2.5 max-h-32 overflow-y-auto space-y-1">
                    {comportamentos.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded bg-[#E4DFD2]/50 px-2 py-1 text-xs text-[#10281E]"
                      >
                        <span className="font-mono text-[11px]">{item}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setComportamentos(
                              comportamentos.filter((_, i) => i !== idx),
                            )
                          }
                          className="text-red-500 hover:font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Atributos Técnicos */}
            <div className="relative">
              <label
                id="rotulo-atributos-tecnicos"
                className="mb-1 block text-xs font-medium text-[#10281E]"
              >
                Atributos Técnicos
              </label>
              <div
                aria-labelledby="rotulo-atributos-tecnicos"
                onClick={() =>
                  setAbertoDropdown(
                    abertoDropdown === "atributos" ? null : "atributos",
                  )
                }
                className="flex min-h-[41px] cursor-pointer items-center justify-between rounded-xl border border-[#E4DFD2] bg-[#FFFFFF] px-3 py-1.5 transition hover:border-[#0E3A29]"
              >
                <div className="flex flex-wrap gap-1 overflow-hidden truncate">
                  {atributosTecnicos.length === 0 ? (
                    <span className="text-xs text-[#8A8D80]">
                      Nenhum selecionado
                    </span>
                  ) : (
                    atributosTecnicos.map((a) => (
                      <span
                        key={a}
                        className="rounded-md border border-[#C6E96B]/80 bg-[#C6E96B]/30 px-1.5 py-0.5 text-[10px] font-mono text-[#0E3A29]"
                      >
                        {a}
                      </span>
                    ))
                  )}
                </div>
                <button
                  type="button"
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E4DFD2]/70 text-xs font-bold text-[#10281E] transition hover:bg-[#C6E96B]"
                  aria-label="Adicionar atributo técnico"
                >
                  +
                </button>
              </div>

              {/* Dropdown com scroll */}
              {abertoDropdown === "atributos" && (
                <div className="absolute top-full right-0 z-30 mt-1.5 w-full min-w-[240px] rounded-xl border border-[#E4DFD2] bg-white p-3 shadow-xl">
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={inputAtributo}
                      onChange={(e) => setInputAtributo(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          adicionarItemTexto(
                            atributosTecnicos,
                            setAtributosTecnicos,
                            inputAtributo,
                            setInputAtributo,
                          );
                        }
                      }}
                      placeholder="Ex.: DomOrient"
                      className="w-full rounded-lg border border-[#E4DFD2] px-2.5 py-1 text-xs text-[#10281E] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        adicionarItemTexto(
                          atributosTecnicos,
                          setAtributosTecnicos,
                          inputAtributo,
                          setInputAtributo,
                        )
                      }
                      className="rounded-lg bg-[#0E3A29] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#10281E]"
                    >
                      Ok
                    </button>
                  </div>

                  <div className="mt-2.5 max-h-32 overflow-y-auto space-y-1">
                    {atributosTecnicos.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded bg-[#C6E96B]/30 px-2 py-1 text-xs text-[#0E3A29]"
                      >
                        <span className="font-mono text-[11px]">{item}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setAtributosTecnicos(
                              atributosTecnicos.filter((_, i) => i !== idx),
                            )
                          }
                          className="text-red-500 hover:font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Rodapé Fixo */}
        <div className="flex shrink-0 items-center justify-end gap-4 border-t border-[#E4DFD2]/60 bg-[#FAF7F0]/60 px-7 py-4 rounded-b-2xl">
          <button
            type="button"
            onClick={handleClose}
            disabled={salvando}
            className="text-xs font-medium text-[#8A8D80] transition hover:text-[#10281E]"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!camposObrigatoriosPreenchidos || salvando}
            className={`inline-flex items-center justify-center rounded-full px-6 py-2.5 text-xs font-semibold shadow-xs transition-all ${
              camposObrigatoriosPreenchidos && !salvando
                ? "bg-[#0E3A29] text-white hover:bg-[#10281E] hover:shadow-md cursor-pointer active:translate-y-0.5"
                : "bg-[#D8D4CA] text-[#8A8D80] cursor-not-allowed opacity-70"
            }`}
          >
            <span>
              {salvando
                ? "Salvando..."
                : isEditing
                  ? "Salvar alterações"
                  : "Criar atividade"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
