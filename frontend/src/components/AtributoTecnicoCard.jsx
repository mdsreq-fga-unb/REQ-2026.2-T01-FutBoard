import React from "react";

export default function AtributoTecnicoCard({ atributo, destacado = false }) {
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
            {atributo.nome}
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#8A8D80]">
            ATRIBUTO TÉCNICO
          </span>
        </div>
      </div>
    </article>
  );
}
