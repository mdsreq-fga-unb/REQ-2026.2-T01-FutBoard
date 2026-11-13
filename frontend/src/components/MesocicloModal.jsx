import React, { useState } from "react";

function formatarDataExibicao(isoDate) {
  if (!isoDate) return "—";
  const partes = String(isoDate).split("-");
  if (partes.length !== 3) return isoDate;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export default function MesocicloModal({
  isOpen,
  initialData = null,
  macrociclos = [],
  onClose,
  onSave,
}) {
  const isEditing = Boolean(initialData);

  const [nome, setNome] = useState(initialData?.nome || "");
  const [dataInicio, setDataInicio] = useState(initialData?.dataInicio || "");
  const [dataTermino, setDataTermino] = useState(
    initialData?.dataTermino || "",
  );
  // US04: no cadastro, só macrociclos ativos (que ainda não terminaram) podem ser pais
  const hoje = new Date().toISOString().slice(0, 10);
  const macrociclosAtivos = macrociclos.filter(
    (macro) => macro.data_termino >= hoje,
  );
  const opcoesMacrociclo = isEditing ? macrociclos : macrociclosAtivos;

  const [macrocicloId, setMacrocicloId] = useState(
    initialData?.macrociclo ||
      (macrociclosAtivos.length > 0 ? macrociclosAtivos[0].id : ""),
  );
  const [erro, setErro] = useState("");

  if (!isOpen) return null;

  const macroSelecionado = opcoesMacrociclo.find(
    (macro) => macro.id === Number(macrocicloId),
  );
  const semMacrociclos = !isEditing && macrociclosAtivos.length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (!isEditing && !macrocicloId) {
      setErro("Selecione o macrociclo ao qual o mesociclo pertence.");
      return;
    }

    if (!nome.trim() || !dataInicio || !dataTermino) {
      setErro(
        "Preencha todos os campos obrigatórios (Nome, Data de início e Data de fim).",
      );
      return;
    }

    if (dataTermino < dataInicio) {
      setErro("A data de fim deve ser igual ou posterior à data de início.");
      return;
    }

    if (macroSelecionado) {
      if (dataInicio < macroSelecionado.data_inicio) {
        setErro("O mesociclo não pode começar antes do macrociclo.");
        return;
      }
      if (dataTermino > macroSelecionado.data_termino) {
        setErro("O mesociclo não pode terminar depois do macrociclo.");
        return;
      }
    }

    try {
      await onSave({
        nome: nome.trim(),
        dataInicio,
        dataTermino,
        macrociclo: Number(macrocicloId),
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
      aria-labelledby="modal-mesociclo-titulo"
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
              {isEditing ? "PLANEJAMENTO · EDIÇÃO" : "PLANEJAMENTO · NOVO"}
            </span>
            <h2
              id="modal-mesociclo-titulo"
              className="font-display text-xl font-bold text-[#10281E]"
            >
              {isEditing ? "Editar mesociclo" : "Criar mesociclo"}
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

          {/* Sem macrociclo cadastrado não é possível vincular o mesociclo */}
          {semMacrociclos && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700"
            >
              Não há macrociclo ativo. Cadastre um macrociclo antes de criar um mesociclo.
            </div>
          )}

          {/* Macrociclo vinculado (não pode ser alterado na edição) */}
          {isEditing ? (
            <div>
              <span className="mb-1.5 block text-xs font-medium text-[#10281E]">
                Macrociclo vinculado
              </span>
              <p className="rounded-xl border border-[#E4DFD2] bg-[#F5F2EA] px-3.5 py-2.5 text-sm text-[#8A8D80]">
                {macroSelecionado?.nome || "—"}
              </p>
            </div>
          ) : (
            !semMacrociclos && (
              <div>
                <label
                  htmlFor="mesociclo-macrociclo"
                  className="mb-1.5 block text-xs font-medium text-[#10281E]"
                >
                  Macrociclo vinculado <span className="span">*</span>
                </label>
                <select
                  id="mesociclo-macrociclo"
                  value={macrocicloId}
                  onChange={(e) => {
                    setMacrocicloId(e.target.value);
                    setErro("");
                  }}
                  className="w-full rounded-xl border border-[#E4DFD2] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#10281E] outline-none transition focus:border-[#0E3A29] focus:ring-2 focus:ring-[#C6E96B]/50"
                >
                  {macrociclosAtivos.map((macro) => (
                    <option key={macro.id} value={macro.id}>
                      {macro.nome}
                    </option>
                  ))}
                </select>
              </div>
            )
          )}

          {macroSelecionado && (
            <p className="-mt-2 text-[11px] text-[#8A8D80]">
              Período do macrociclo:{" "}
              {formatarDataExibicao(macroSelecionado.data_inicio)} a{" "}
              {formatarDataExibicao(macroSelecionado.data_termino)}
            </p>
          )}

          <div>
            <label
              htmlFor="mesociclo-nome"
              className="mb-1.5 block text-xs font-medium text-[#10281E]"
            >
              Nome do mesociclo <span className="span">*</span>
            </label>
            <input
              id="mesociclo-nome"
              type="text"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                setErro("");
              }}
              placeholder="Ex.: Mesociclo 04"
              className="w-full rounded-xl border border-[#E4DFD2] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#10281E] outline-none transition focus:border-[#0E3A29] focus:ring-2 focus:ring-[#C6E96B]/50"
            />
            <p className="mt-1.5 text-[11px] text-[#8A8D80]">
              Use o nome que o clube já fala em campo.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="mesociclo-data-inicio"
                className="mb-1.5 block text-xs font-medium text-[#10281E]"
              >
                Data de início <span className="span">*</span>
              </label>
              <input
                id="mesociclo-data-inicio"
                type="date"
                value={dataInicio}
                min={macroSelecionado?.data_inicio}
                max={macroSelecionado?.data_termino}
                onChange={(e) => {
                  setDataInicio(e.target.value);
                  setErro("");
                }}
                className="w-full rounded-xl border border-[#E4DFD2] bg-[#FFFFFF] px-3 py-2.5 font-mono text-xs text-[#10281E] outline-none transition focus:border-[#0E3A29] focus:ring-2 focus:ring-[#C6E96B]/50"
              />
            </div>

            <div>
              <label
                htmlFor="mesociclo-data-termino"
                className="mb-1.5 block text-xs font-medium text-[#10281E]"
              >
                Data de fim <span className="span">*</span>
              </label>
              <input
                id="mesociclo-data-termino"
                type="date"
                value={dataTermino}
                min={dataInicio || macroSelecionado?.data_inicio}
                max={macroSelecionado?.data_termino}
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
              disabled={semMacrociclos}
              className="fb-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>{isEditing ? "Salvar alterações" : "Criar mesociclo"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
