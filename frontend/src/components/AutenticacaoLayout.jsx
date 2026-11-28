import React from "react";

export default function AutenticacaoLayout({ titulo, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F2EA] px-4 py-10 text-[#10281E]">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-[#E4DFD2] bg-[#FFFFFF] p-6 shadow-xl sm:p-7">
          {/* Marca */}
          <div className="mb-4 flex items-center gap-2.5">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C6E96B] font-display text-xs font-bold text-[#10281E]"
              aria-hidden="true"
            >
              F
            </div>
            <span className="font-display text-base font-bold tracking-tight text-[#10281E]">
              FutBoard
            </span>
          </div>

          <h1 className="mb-5 font-display text-2xl font-bold tracking-tight text-[#10281E]">
            {titulo}
          </h1>

          {children}
        </div>

        {/* Contexto do Clube */}
        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-[#8A8D80]">
          CANAÃ EC · Sub-17 · 2026
        </p>
      </div>
    </div>
  );
}
