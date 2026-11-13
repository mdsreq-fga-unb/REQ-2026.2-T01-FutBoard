import React from "react";

export default function ComportamentoCard({
  comportamento,
  destacado = false,
  onEditComportamento,
}) {
  return (
    <article
      className="fb-card overflow-hidden transition-all"
      // Destaque do item recém-salvo (o .fb-card define o fundo branco no SCSS)
      style={
        destacado
          ? {
              backgroundColor: "rgba(198, 233, 107, 0.18)",
              borderColor: "rgba(14, 58, 41, 0.3)",
            }
          : undefined
      }
    >
      <div className="flex items-center gap-4 px-5 py-4 sm:px-6">
        {/* Barra lateral */}
        <span
          aria-hidden="true"
          className={`h-9 w-[3px] shrink-0 rounded-full ${
            destacado ? "bg-[#0E3A29]" : "bg-[#8A8D80]/50"
          }`}
        />

        <div className="min-w-0 flex-1">
          <h2 className="break-words font-display text-lg font-bold tracking-tight text-[#10281E]">
            {comportamento.nome}
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#8A8D80]">
            COMPORTAMENTO TÁTICO
          </span>
        </div>

        <button
          type="button"
          onClick={() => onEditComportamento(comportamento)}
          className="shrink-0 rounded-full p-2 text-[#0E3A29] transition hover:bg-[#F5F2EA]"
          aria-label={`Editar comportamento ${comportamento.nome}`}
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
              d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
            />
          </svg>
        </button>
      </div>
    </article>
  );
}
