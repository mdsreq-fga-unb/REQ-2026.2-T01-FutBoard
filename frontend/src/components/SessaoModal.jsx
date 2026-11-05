import React, { useState } from "react";

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
  const [erro, setErro] = useState("");

  if (!isOpen) return null;

  const camposPreenchidos = Boolean(nome.trim() && data && mes);

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
    });
  };

  return (
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

      <div className="relative z-10 w-full max-w-[540px] overflow-hidden rounded-2xl border border-[#E4DFD2] bg-[#FFFFFF] shadow-2xl">
        {/* Cabeçalho do Modal */}
        <div className="flex items-start justify-between px-6 pt-5 pb-2">
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
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4 px-6 py-4">
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

            {/* Botões visuais de atividades da sessão */}
            <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
              <button
                type="button"
                className="w-full rounded-full border border-[#E4DFD2] bg-[#FAF9F5] px-4 py-2.5 text-xs font-medium text-[#10281E] transition hover:bg-[#F5F2EA]"
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
          </div>

          {/* Rodapé do Modal */}
          <div className="mt-2 flex items-center justify-end gap-4 border-t border-[#E4DFD2] bg-[#FAF9F5] px-6 py-4">
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
  );
}
