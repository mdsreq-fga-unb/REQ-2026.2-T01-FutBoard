import React from "react";

export default function Sidebar({
  activeNav = "macrociclos",
  onSelectNav,
  mobileOpen = false,
  onCloseMobile,
  totalMacrociclos = 0,
  totalMicrociclos = 0,
}) {
  const navContent = (
    <div className="flex h-full flex-col justify-between px-4 py-6 select-none">
      <div>
        {/* Brand Header */}
        <div className="mb-8 flex items-center justify-between px-1.5">
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C6E96B] font-display text-sm font-bold text-[#10281E] shadow-sm"
              aria-hidden="true"
            >
              F
            </div>
            <span className="font-display text-[19px] font-bold tracking-tight text-[#FFFFFF]">
              FutBoard
            </span>
          </div>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="rounded-lg p-1.5 text-[#E4DFD2]/80 transition hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Fechar menu lateral"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Section: PLANEJAMENTO */}
        <div className="mb-6">
          <p className="mb-2.5 px-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#8A8D80]">
            PLANEJAMENTO
          </p>

          <nav className="space-y-1" aria-label="Menu de Planejamento">
            {/* Macrociclos */}
            <button
              type="button"
              onClick={() => {
                if (onSelectNav) onSelectNav("macrociclos");
                if (onCloseMobile) onCloseMobile();
              }}
              className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition ${
                activeNav === "macrociclos"
                  ? "bg-white/[0.11] text-[#FFFFFF] shadow-inner ring-1 ring-white/[0.08]"
                  : "text-[#E4DFD2]/80 hover:bg-white/[0.06] hover:text-[#FFFFFF]"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <svg
                  className="h-4 w-4 shrink-0 text-[#E4DFD2]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2.5" />
                  <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
                  <circle cx="8.5" cy="14.5" r="1" fill="currentColor" />
                  <circle cx="12" cy="14.5" r="1" fill="currentColor" />
                  <circle cx="15.5" cy="14.5" r="1" fill="currentColor" />
                </svg>
                <span>Macrociclos</span>
              </span>

              <span className="flex items-center gap-1.5">
                {totalMacrociclos > 0 && (
                  <span className="hidden rounded-md bg-[#10281E]/60 px-1.5 py-0.5 font-mono text-[10px] text-[#C6E96B] group-hover:inline-block">
                    {totalMacrociclos}
                  </span>
                )}
                <svg
                  className="h-3.5 w-3.5 text-[#C6E96B] transition-transform group-hover:translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                </svg>
              </span>
            </button>

            {/* Microciclos */}
            <button
              type="button"
              onClick={() => {
                if (onSelectNav) onSelectNav("microciclos");
                if (onCloseMobile) onCloseMobile();
              }}
              className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition ${
                activeNav === "microciclos"
                  ? "bg-white/[0.11] text-[#FFFFFF] shadow-inner ring-1 ring-white/[0.08]"
                  : "text-[#E4DFD2]/80 hover:bg-white/[0.06] hover:text-[#FFFFFF]"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <svg
                  className="h-4 w-4 shrink-0 text-[#E4DFD2]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2.5" />
                  <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 14h8M8 17h5" />
                </svg>
                <span>Microciclos</span>
              </span>

              <span className="flex items-center gap-1.5">
                {totalMicrociclos > 0 && (
                  <span className="hidden rounded-md bg-[#10281E]/60 px-1.5 py-0.5 font-mono text-[10px] text-[#C6E96B] group-hover:inline-block">
                    {totalMicrociclos}
                  </span>
                )}
                <svg
                  className="h-3.5 w-3.5 text-[#C6E96B] transition-transform group-hover:translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                </svg>
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* Discrete Club Context Footer */}
      <div className="border-t border-white/[0.08] pt-4 px-1.5">
        <div className="flex items-center gap-2.5">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-[#FFFFFF]">Canaã Esporte Clube</p>
            <p className="truncate font-mono text-[10px] text-[#8A8D80]">Comissão Técnica • Sub-17</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fb-sidebar hidden w-[228px] shrink-0 lg:block">{navContent}</aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-[#10281E]/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="fb-sidebar relative z-10 flex w-[250px] max-w-[80vw] flex-col shadow-2xl">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
