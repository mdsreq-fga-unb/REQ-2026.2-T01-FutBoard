import React, { useState } from "react";
import AtividadeSessaoModal from "./AtividadeSessaoModal.jsx";

const MESES_ANO = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const SSP_BADGE_STYLES = {
  Especial: "bg-[#C6E96B] text-[#10281E]",
  Dirigido: "bg-[#0E3A29]/15 text-[#0E3A29]",
  Competitivo: "bg-[#10281E] text-[#FFFFFF]",
};

export default function SessaoModal({
  isOpen,
  initialData = null,
  onClose,
  onSave,
}) {
  const isEditing = Boolean(initialData);

  const [nome, setNome] = useState(initialData?.nome || "");
  const [data, setData] = useState(initialData?.data || "");
  const [mes, setMes] = useState(initialData?.mes || "");
  const [atividades, setAtividades] = useState(initialData?.atividades || []);
  const [modalAtividadeOpen, setModalAtividadeOpen] = useState(false);
  const [erro, setErro] = useState("");

  if (!isOpen) return null;

  const camposPreenchidos = Boolean(nome.trim() && data && mes);

  const handleAdicionarAtividade = async (dadosAtividade) => {
    const codigoNormalizado = (dadosAtividade.codigo || "").trim().toUpperCase();

    const duplicada = atividades.some(
      (atv) =>
        atv.codigo &&
        codigoNormalizado &&
        atv.codigo.toUpperCase() === codigoNormalizado,
    );

    if (duplicada) {
      throw new Error(
        `A atividade com código "${codigoNormalizado}" já foi adicionada a esta sessão.`,
      );
    }

    const novaAtividade = {
      id: Date.now() + Math.random(),
      codigo: codigoNormalizado,
      nome: dadosAtividade.nome,
      atividade_ssp: dadosAtividade.nome,
      tipologia: dadosAtividade.tipologia,
      sigla_tipologia: dadosAtividade.sigla_tipologia,
      tipo_ssp: dadosAtividade.tipo_ssp,
      ordem: dadosAtividade.ordem || atividades.length + 1,
      tempo: dadosAtividade.tempo,
      comprimento: dadosAtividade.comprimento,
      largura: dadosAtividade.largura,
      numero_jogadores: dadosAtividade.numero_jogadores,
      area_por_jogador: dadosAtividade.area_por_jogador,
      dimensao_espaco: dadosAtividade.dimensao_espaco,
      momentos_jogo: dadosAtividade.momentos_jogo || [],
      fases_jogo: dadosAtividade.fases_jogo || [],
      comportamentos: dadosAtividade.comportamentos || [],
      atributos_tecnicos: dadosAtividade.atributos_tecnicos || [],
    };

    setAtividades((prev) => [...prev, novaAtividade]);
    setModalAtividadeOpen(false);
  };

  const handleRemoverAtividade = (idAtividade) => {
    setAtividades((prev) => prev.filter((atv) => atv.id !== idAtividade));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro("");

    if (!nome.trim() || !data || !mes) {
      setErro("Preencha todos os campos obrigatórios (Nome, Data e Mês).");
      return;
    }

    onSave({
      nome: nome.trim(),
      data,
      mes,
      atividades,
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-sessao-titulo"
      >
        <div
          className="fixed inset-0 bg-[#10281E]/65 backdrop-blur-xs"
          onClick={onClose}
        />

        <div className="relative z-10 flex max-h-[90vh] w-full max-w-[540px] flex-col overflow-hidden rounded-2xl border border-[#E4DFD2] bg-[#FFFFFF] shadow-2xl">
          {/* Cabeçalho do Modal */}
          <div className="flex shrink-0 items-start justify-between px-6 pt-5 pb-2">
            <div>
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[#8A8D80]">
                PLANEJAMENTO · SESSÃO
              </span>
              <h2
                id="modal-sessao-titulo"
                className="mt-0.5 font-display text-xl font-bold text-[#10281E]"
              >
                {isEditing ? "Editar sessão" : "Nova sessão"}
              </h2>
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

          {/* Corpo do Formulário */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col overflow-hidden"
            noValidate
          >
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
              {erro && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700"
                >
                  {erro}
                </div>
              )}

              {/* Campo Nome */}
              <div>
                <label
                  htmlFor="sessao-nome"
                  className="mb-1.5 block text-xs font-medium text-[#10281E]"
                >
                  Nome *
                </label>
                <input
                  id="sessao-nome"
                  type="text"
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value);
                    setErro("");
                  }}
                  placeholder="Sessão 1"
                  className="w-full rounded-xl border border-[#0E3A29]/60 bg-[#FAF9F5] px-3.5 py-2.5 text-sm text-[#10281E] placeholder-[#8A8D80] outline-none transition focus:border-[#0E3A29] focus:bg-[#FFFFFF]"
                />
              </div>

              {/* Linha Data e Mês */}
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="sessao-data"
                    className="mb-1.5 block text-xs font-medium text-[#10281E]"
                  >
                    Data *
                  </label>
                  <input
                    id="sessao-data"
                    type="date"
                    value={data}
                    onChange={(e) => {
                      setData(e.target.value);
                      setErro("");
                    }}
                    className="w-full rounded-xl border border-[#E4DFD2] bg-[#FAF9F5] px-3.5 py-2.5 text-sm text-[#10281E] outline-none transition focus:border-[#0E3A29] focus:bg-[#FFFFFF]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sessao-mes"
                    className="mb-1.5 block text-xs font-medium text-[#10281E]"
                  >
                    Mês *
                  </label>
                  <select
                    id="sessao-mes"
                    value={mes}
                    onChange={(e) => {
                      setMes(e.target.value);
                      setErro("");
                    }}
                    className="w-full rounded-xl border border-[#E4DFD2] bg-[#FAF9F5] px-3.5 py-2.5 text-sm text-[#10281E] outline-none transition focus:border-[#0E3A29] focus:bg-[#FFFFFF]"
                  >
                    <option value="">Selecione o mês</option>
                    {MESES_ANO.map((nomeMes) => (
                      <option key={nomeMes} value={nomeMes}>
                        {nomeMes}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Botões de atividades da sessão */}
              <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setModalAtividadeOpen(true)}
                  className="w-full rounded-full border border-[#E4DFD2] bg-[#FAF9F5] px-4 py-2.5 text-xs font-medium text-[#10281E] transition hover:border-[#0E3A29]/40 hover:bg-[#F5F2EA]"
                >
                  + Cadastrar atividade na sessão
                </button>

                <button
                  type="button"
                  className="w-full rounded-full border border-[#E4DFD2] bg-[#FAF9F5] px-4 py-2.5 text-xs font-medium text-[#10281E] transition hover:bg-[#F5F2EA]"
                >
                  + Adicionar atividade da biblioteca
                </button>
              </div>

              {/* Lista de atividades cadastradas/incluídas na sessão */}
              {atividades.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A8D80]">
                      ATIVIDADES INCLUÍDAS NA SESSÃO · {atividades.length}
                    </span>
                  </div>

                  <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
                    {atividades.map((atv, index) => {
                      const badgeSsp =
                        SSP_BADGE_STYLES[atv.tipo_ssp] ||
                        "bg-[#E4DFD2] text-[#10281E]";

                      return (
                        <div
                          key={atv.id || `${atv.codigo}-${index}`}
                          className="fb-session-activity-item flex items-center justify-between gap-3 px-3.5 py-2.5"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span
                                className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#C6E96B] text-[10px] font-bold text-[#10281E]"
                                title="Atividade incluída na sessão"
                              >
                                ✓
                              </span>

                              {atv.ordem && (
                                <span className="font-mono text-[10px] font-semibold text-[#8A8D80]">
                                  #{atv.ordem}
                                </span>
                              )}

                              {atv.codigo && (
                                <span className="rounded-full bg-[#0E3A29] px-2 py-0.5 font-mono text-[10px] font-bold text-[#FFFFFF]">
                                  {atv.codigo}
                                </span>
                              )}

                              <span
                                className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold ${badgeSsp}`}
                              >
                                {atv.tipo_ssp}
                              </span>

                              <span className="rounded-full bg-[#0E3A29]/10 px-2 py-0.5 text-[10px] font-medium text-[#0E3A29]">
                                {atv.tipologia}
                              </span>

                              {atv.tempo && (
                                <span className="font-mono text-[10px] font-medium text-[#8A8D80]">
                                  · {atv.tempo} min
                                </span>
                              )}
                            </div>

                            <p className="mt-1 truncate text-xs font-semibold text-[#10281E]">
                              {atv.nome}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoverAtividade(atv.id)}
                            className="rounded-lg p-1 text-[#8A8D80] transition hover:bg-red-50 hover:text-red-600"
                            aria-label={`Remover atividade ${atv.nome}`}
                            title="Remover atividade da sessão"
                          >
                            <svg
                              className="h-3.5 w-3.5"
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
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé do Modal */}
            <div className="mt-2 flex shrink-0 items-center justify-end gap-4 border-t border-[#E4DFD2] bg-[#FAF9F5] px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="px-2 py-1.5 text-xs font-medium text-[#10281E] transition hover:opacity-75"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className={`rounded-full px-5 py-2.5 text-xs font-medium text-[#FFFFFF] transition ${
                  camposPreenchidos
                    ? "bg-[#0E3A29] hover:bg-[#10281E]"
                    : "bg-[#93A39B] hover:bg-[#0E3A29]"
                }`}
              >
                {isEditing ? "Salvar alterações" : "Criar sessão"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de Cadastro de Atividade na Sessão sobreposto ao Modal de Sessão */}
      <AtividadeSessaoModal
        isOpen={modalAtividadeOpen}
        onClose={() => setModalAtividadeOpen(false)}
        onSave={handleAdicionarAtividade}
      />
    </>
  );
}
