import React from "react";

function formatarDataExibicao(isoDate) {
  if (!isoDate) return "—";
  const partes = String(isoDate).split("-");
  if (partes.length !== 3) return isoDate;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export default function SessaoCard({ sessao, onEditSessao }) {
  return (
    <article className="fb-card overflow-hidden border-[#E4DFD2] bg-[#FFFFFF] transition-all">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-[#10281E] px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wide text-[#C6E96B]">
                {sessao.codigo}
              </span>

              <span className="rounded-full bg-[#C6E96B]/50 px-2.5 py-0.5 font-mono text-[11px] font-medium text-[#10281E]">
                {sessao.mes}
              </span>
            </div>

            <h2 className="font-display text-lg font-bold tracking-tight text-[#10281E] sm:text-xl">
              {sessao.nome}
            </h2>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-left sm:text-right">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-[#8A8D80]">
                DATA DA SESSÃO
              </span>
              <span className="mt-0.5 block font-mono text-xs font-semibold text-[#10281E]">
                {formatarDataExibicao(sessao.data)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onEditSessao(sessao)}
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
      </div>
    </article>
  );
}
