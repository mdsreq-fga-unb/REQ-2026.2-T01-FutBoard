import React, { useState } from "react";

const normalizarNome = (nome) => nome.trim().split(/\s+/).join(" ");

export default function ComportamentoModal({
  isOpen,
  initialData = null,
  onClose,
  onSave,
}) {
  const isEditing = Boolean(initialData);

  // No cadastro (US10) é possível informar vários nomes de uma vez
  const [nomes, setNomes] = useState([initialData?.nome || ""]);
  const [errosCampos, setErrosCampos] = useState({});
  const [erro, setErro] = useState("");

  if (!isOpen) return null;

  const alterarNome = (indice, valor) => {
    setNomes((prev) => prev.map((nome, i) => (i === indice ? valor : nome)));
    setErrosCampos((prev) => ({ ...prev, [indice]: "" }));
    setErro("");
  };

  const adicionarCampo = () => {
    setNomes((prev) => [...prev, ""]);
  };

  const removerCampo = (indice) => {
    setNomes((prev) => prev.filter((_, i) => i !== indice));
    setErrosCampos({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    const novosErros = {};
    const vistos = new Map();

    nomes.forEach((nome, indice) => {
      const nomeNormalizado = normalizarNome(nome);
      if (!nomeNormalizado) {
        novosErros[indice] = "O nome do comportamento é obrigatório.";
        return;
      }
      const chave = nomeNormalizado
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase();
      if (vistos.has(chave)) {
        novosErros[indice] = "Este nome já foi informado acima.";
      }
      vistos.set(chave, indice);
    });

    if (Object.keys(novosErros).length > 0) {
      setErrosCampos(novosErros);
      return;
    }

    try {
      const errosApi = await onSave(nomes.map(normalizarNome));

      // Mantém no formulário apenas os nomes que não puderam ser salvos
      if (errosApi && errosApi.length > 0) {
        setNomes(errosApi.map((item) => item.nome));
        setErrosCampos(
          Object.fromEntries(errosApi.map((item, i) => [i, item.mensagem])),
        );
      }
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-comportamento-titulo"
    >
      <div
        className="fixed inset-0 bg-[#10281E]/65 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#E4DFD2] bg-[#FFFFFF] shadow-2xl">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between border-b border-[#E4DFD2] bg-[#F5F2EA] px-6 py-4">
          <div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#8A8D80]">
              {isEditing ? "BIBLIOTECA · EDIÇÃO" : "BIBLIOTECA · NOVO"}
            </span>
            <h2
              id="modal-comportamento-titulo"
              className="font-display text-xl font-bold text-[#10281E]"
            >
              {isEditing
                ? "Editar comportamento tático"
                : "Novos comportamentos táticos"}
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
        <form
          onSubmit={handleSubmit}
          className="space-y-4 overflow-y-auto p-6"
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

          {nomes.map((nome, indice) => (
            <div key={indice}>
              <label
                htmlFor={`comportamento-nome-${indice}`}
                className="mb-1.5 block text-xs font-medium text-[#10281E]"
              >
                Nome <span className="span">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  id={`comportamento-nome-${indice}`}
                  type="text"
                  value={nome}
                  maxLength={200}
                  onChange={(e) => alterarNome(indice, e.target.value)}
                  placeholder="Ex.: Contenção"
                  aria-invalid={Boolean(errosCampos[indice])}
                  aria-describedby={
                    errosCampos[indice]
                      ? `comportamento-erro-${indice}`
                      : undefined
                  }
                  className={`w-full rounded-xl border bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#10281E] outline-none transition focus:border-[#0E3A29] focus:ring-2 focus:ring-[#C6E96B]/50 ${
                    errosCampos[indice] ? "border-red-200" : "border-[#E4DFD2]"
                  }`}
                />
                {!isEditing && nomes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removerCampo(indice)}
                    className="shrink-0 rounded-full p-2 text-[#8A8D80] transition hover:bg-[#F5F2EA] hover:text-[#10281E]"
                    aria-label={`Remover campo ${indice + 1}`}
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
                )}
              </div>
              {errosCampos[indice] && (
                <p
                  id={`comportamento-erro-${indice}`}
                  role="alert"
                  className="mt-1.5 text-[11px] font-medium text-red-700"
                >
                  {errosCampos[indice]}
                </p>
              )}
            </div>
          ))}

          {/* Adicionar outro nome (somente no cadastro) */}
          {!isEditing && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={adicionarCampo}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E4DFD2] bg-white px-3.5 py-1.5 text-xs font-medium text-[#10281E] transition hover:border-[#0E3A29] hover:bg-[#F5F2EA]"
                aria-label="Adicionar outro comportamento"
              >
                <svg
                  className="h-3.5 w-3.5 text-[#0E3A29]"
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
                <span>Adicionar outro</span>
              </button>
            </div>
          )}

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
              <span>
                {isEditing
                  ? "Salvar alterações"
                  : nomes.length > 1
                    ? "Criar comportamentos"
                    : "Criar comportamento"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
