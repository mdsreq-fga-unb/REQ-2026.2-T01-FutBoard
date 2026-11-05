import React, { useState } from "react";

export default function MicrocicloModal({
  isOpen,
  initialData = null,
  mesociclos = [],
  defaultMesocicloId = null,
  onClose,
  onSave,
}) {
  const isEditing = Boolean(initialData);

  const [nome, setNome] = useState(initialData?.nome || "");
  const [dataInicio, setDataInicio] = useState(
    initialData?.dataInicio || initialData?.data_inicio || "",
  );
  const [dataTermino, setDataTermino] = useState(
    initialData?.dataTermino || initialData?.data_termino || "",
  );
  const [mesocicloId, setMesocicloId] = useState(
    initialData?.mesociclo ||
      initialData?.mesociclo_id ||
      defaultMesocicloId ||
      (mesociclos.length > 0 ? mesociclos[0].id : ""),
  );
  const [erro, setErro] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (!nome.trim() || !dataInicio || !dataTermino) {
      setErro(
        "Preencha todos os campos obrigatórios (Nome, Data de início e Data de término).",
      );
      return;
    }

    if (!isEditing && !mesocicloId) {
      setErro("Selecione um mesociclo associado.");
      return;
    }

    if (dataTermino < dataInicio) {
      setErro("A data de término deve ser igual ou posterior à data de início.");
      return;
    }

    try {
      await onSave({
        nome: nome.trim(),
        dataInicio,
        dataTermino,
        mesociclo: mesocicloId ? Number(mesocicloId) : undefined,
      });
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-microciclo-titulo"
    >
      <div
        className="fixed inset-0 bg-[#10281E]/65 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-[#E4DFD2] bg-[#FFFFFF] shadow-2xl">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between border-b border-[#E4DFD2] bg-[#F5F2EA] px-6 py-4">
          <div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#8A8D80]">
              PLANEJAMENTO &gt;
            </span>
            <h2
              id="modal-microciclo-titulo"
              className="font-display text-xl font-bold text-[#10281E]"
            >
              {isEditing ? "Editar microciclo" : "Criar Microciclo"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-[#8A8D80] transition hover:bg-[#E4DFD2]/60 hover:text-[#10281E]"
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

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6" noValidate>
          {erro && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700"
            >
              {erro}
            </div>
          )}

          {/* Seletor de Mesociclo (necessário para cadastro no backend) */}
          {!isEditing && mesociclos.length > 0 && (
            <div>
              <label
                htmlFor="microciclo-mesociclo"
                className="mb-1.5 block text-xs font-medium text-[#10281E]"
              >
                Mesociclo vinculado <span className="span">*</span>
              </label>
              <select
                id="microciclo-mesociclo"
                value={mesocicloId}
                onChange={(e) => {
                  setMesocicloId(e.target.value);
                  setErro("");
                }}
                className="w-full rounded-xl border border-[#E4DFD2] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#10281E] outline-none transition focus:border-[#0E3A29] focus:ring-2 focus:ring-[#C6E96B]/50"
              >
                {mesociclos.map((meso) => (
                  <option key={meso.id} value={meso.id}>
                    {meso.nome} ({meso.data_inicio || meso.dataInicio} até{" "}
                    {meso.data_termino || meso.dataTermino})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label
              htmlFor="microciclo-nome"
              className="mb-1.5 block text-xs font-medium text-[#10281E]"
            >
              Nome do microciclo <span className="span">*</span>
            </label>
            <input
              id="microciclo-nome"
              type="text"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                setErro("");
              }}
              placeholder="Ex.: Microciclo 01"
              className="w-full rounded-xl border border-[#E4DFD2] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#10281E] outline-none transition focus:border-[#0E3A29] focus:ring-2 focus:ring-[#C6E96B]/50"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="microciclo-data-inicio"
                className="mb-1.5 block text-xs font-medium text-[#10281E]"
              >
                Data de início <span className="span">*</span>
              </label>
              <input
                id="microciclo-data-inicio"
                type="date"
                value={dataInicio}
                onChange={(e) => {
                  setDataInicio(e.target.value);
                  setErro("");
                }}
                className="w-full rounded-xl border border-[#E4DFD2] bg-[#FFFFFF] px-3 py-2.5 font-mono text-xs text-[#10281E] outline-none transition focus:border-[#0E3A29] focus:ring-2 focus:ring-[#C6E96B]/50"
              />
            </div>

            <div>
              <label
                htmlFor="microciclo-data-termino"
                className="mb-1.5 block text-xs font-medium text-[#10281E]"
              >
                {isEditing ? "Data de término" : "Data de fim"}{" "}
                <span className="span">*</span>
              </label>
              <input
                id="microciclo-data-termino"
                type="date"
                value={dataTermino}
                onChange={(e) => {
                  setDataTermino(e.target.value);
                  setErro("");
                }}
                className="w-full rounded-xl border border-[#E4DFD2] bg-[#FFFFFF] px-3 py-2.5 font-mono text-xs text-[#10281E] outline-none transition focus:border-[#0E3A29] focus:ring-2 focus:ring-[#C6E96B]/50"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-[#E4DFD2] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#E4DFD2] bg-white px-4 py-2 text-xs font-medium text-[#8A8D80] transition hover:bg-[#F5F2EA] hover:text-[#10281E]"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="fb-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium"
            >
              <span>{isEditing ? "Salvar alterações" : "Criar microciclo"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

