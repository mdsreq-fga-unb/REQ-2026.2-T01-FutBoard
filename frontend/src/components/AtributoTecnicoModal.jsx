import React, { useState } from "react";

const normalizarNome = (nome) => nome.trim().split(/\s+/).join(" ");

export default function AtributoTecnicoModal({ isOpen, onClose, onSave }) {
  // Cenário 2 (US32): é possível informar vários atributos técnicos de uma vez
  const [nomes, setNomes] = useState([""]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    const novosErros = {};
    const vistos = new Map();

    nomes.forEach((nome, indice) => {
      const nomeNormalizado = normalizarNome(nome);
      if (!nomeNormalizado) {
        // Cenário 1: o primeiro nome é obrigatório; campos extras vazios são ignorados
        if (indice === 0) {
          novosErros[indice] = "O nome do atributo técnico é obrigatório.";
        }
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
      const errosApi = await onSave(nomes.map(normalizarNome).filter(Boolean));

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
      aria-labelledby="modal-atributo-tecnico-titulo"
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
              BIBLIOTECA · NOVO
            </span>
            <h2
              id="modal-atributo-tecnico-titulo"
              className="font-display text-xl font-bold text-[#10281E]"
            >
              Novo atributo técnico
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
                htmlFor={`atributo-tecnico-nome-${indice}`}
                className="mb-1.5 block text-xs font-medium text-[#10281E]"
              >
                Nome {indice === 0 && <span className="span">*</span>}
              </label>
              <div>
                <input
                  id={`atributo-tecnico-nome-${indice}`}
                  type="text"
                  value={nome}
                  maxLength={200}
                  onChange={(e) => alterarNome(indice, e.target.value)}
                  placeholder={indice === 0 ? "Ex.: Cabeceio frontal" : "Ex.: Cruzamento"}
                  aria-invalid={Boolean(errosCampos[indice])}
                  aria-describedby={
                    errosCampos[indice]
                      ? `atributo-tecnico-erro-${indice}`
                      : undefined
                  }
                  className={`w-full rounded-xl border bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#10281E] outline-none transition focus:border-[#0E3A29] focus:ring-2 focus:ring-[#C6E96B]/50 ${
                    errosCampos[indice] ? "border-red-200" : "border-[#E4DFD2]"
                  }`}
                />
              </div>
              {errosCampos[indice] && (
                <p
                  id={`atributo-tecnico-erro-${indice}`}
                  role="alert"
                  className="mt-1.5 text-[11px] font-medium text-red-700"
                >
                  {errosCampos[indice]}
                </p>
              )}
            </div>
          ))}

          {/* Adicionar outro nome (botão "+" do protótipo) */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={adicionarCampo}
              className="fb-btn-primary inline-flex h-8 w-10 items-center justify-center"
              aria-label="Adicionar outro atributo técnico"
              title="Adicionar outro atributo técnico"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
              </svg>
            </button>
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
              <span>Criar atributos</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
