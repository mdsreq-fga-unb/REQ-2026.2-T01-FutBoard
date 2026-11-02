import React from "react";

const STATUS_STYLES = {
  em_andamento: {
    label: "Em andamento",
    badgeBg: "bg-[#C6E96B]",
    badgeText: "text-[#10281E]",
    dotColor: "bg-[#0E3A29]",
  },
  planejado: {
    label: "Planejado",
    badgeBg: "bg-[#0E3A29]/10",
    badgeText: "text-[#0E3A29]",
    dotColor: "bg-[#8A8D80]",
  },
  concluido: {
    label: "Concluído",
    badgeBg: "bg-[#E4DFD2]",
    badgeText: "text-[#10281E]",
    dotColor: "bg-[#10281E]",
  },
};

function formatarDataExibicao(isoDate) {
  if (!isoDate) return "—";
  const partes = String(isoDate).split("-");
  if (partes.length !== 3) return isoDate;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export default function MacrocicloCard({ macrociclo, onEditMacrociclo }) {
  const estiloStatus =
    STATUS_STYLES[macrociclo.status] || STATUS_STYLES.planejado;

  return (
    <article
      className={`fb-card overflow-hidden transition-all ${
        macrociclo.status === "em_andamento"
          ? "border-[#0E3A29]/30 shadow-xs"
          : "border-[#E4DFD2]"
      }`}
    >
      {macrociclo.status === "em_andamento" && (
        <div className="h-1 w-full bg-gradient-to-r from-[#0E3A29] via-[#0E3A29] to-[#C6E96B]" />
      )}

      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-[#10281E] px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wide text-[#C6E96B]">
                {macrociclo.codigo}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${estiloStatus.badgeBg} ${estiloStatus.badgeText}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${estiloStatus.dotColor}`}
                />
                {estiloStatus.label}
              </span>
            </div>

            <h2 className="font-display text-xl font-bold tracking-tight text-[#10281E] sm:text-[22px]">
              {macrociclo.nome}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onEditMacrociclo(macrociclo)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E4DFD2] bg-white px-4 py-2 text-xs font-medium text-[#10281E] transition hover:border-[#0E3A29] hover:bg-[#F5F2EA]"
            >
              <svg
                className="h-3.5 w-3.5 text-[#0E3A29]"
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
              <span>Editar</span>
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-[#F5F2EAB2]/80 bg-[#F5F2EAB2]/70 p-3.5 sm:grid-cols-3">
          <div>
            <span className="block font-sans text-[10px] uppercase tracking-wider text-[#8A8D80]">
              DATA DE INÍCIO
            </span>
            <span className="mt-0.5 block font-sans text-xs font-semibold text-[#10281E]">
              {formatarDataExibicao(macrociclo.dataInicio)}
            </span>
          </div>

          <div>
            <span className="block font-sans text-[10px] uppercase tracking-wider text-[#8A8D80]">
              DATA DE TÉRMINO
            </span>
            <span className="mt-0.5 block font-sans text-xs font-semibold text-[#10281E]">
              {formatarDataExibicao(macrociclo.dataTermino)}
            </span>
          </div>

          <div>
            <span className="block font-sans text-[10px] uppercase tracking-wider text-[#8A8D80]">
              SEMANAS PLANEJADAS
            </span>
            <span className="mt-0.5 block font-sans text-xs font-semibold text-[#0E3A29]">
              {macrociclo.semanas}{" "}
              {macrociclo.semanas === 1 ? "semana" : "semanas"}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
