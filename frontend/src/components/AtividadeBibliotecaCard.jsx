import React from "react";

const SSP_BADGE_STYLES = {
  Especial: "bg-[#C6E96B] text-[#10281E]",
  Dirigido: "bg-[#0E3A29]/15 text-[#0E3A29]",
  Competitivo: "bg-[#10281E] text-[#FFFFFF]",
};

const DIMENSAO_STYLES = {
  Pequeno: "text-[#0E3A29] bg-[#C6E96B]/30",
  Médio: "text-[#10281E] bg-[#E4DFD2]",
  Grande: "text-[#0E3A29] bg-[#C6E96B]/60",
  "Não Definido": "text-[#8A8D80] bg-[#E4DFD2]/40",
};

export default function AtividadeBibliotecaCard({ atividade, onEdit }) {
  const badgeSsp =
    SSP_BADGE_STYLES[atividade.tipo_ssp] || "bg-[#E4DFD2] text-[#10281E]";
  const estiloDimensao =
    DIMENSAO_STYLES[atividade.dimensao_espaco] ||
    "text-[#8A8D80] bg-[#E4DFD2]/40";

  const temMedidas =
    Boolean(atividade.comprimento) &&
    Boolean(atividade.largura) &&
    Boolean(atividade.numero_jogadores);

  return (
    <article className="fb-card overflow-hidden border-[#E4DFD2] bg-[#FFFFFF] p-5 transition-all hover:border-[#0E3A29]/30 sm:p-6">
      {/* Topo do Card com Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {atividade.codigo && (
            <span className="rounded-full bg-[#0E3A29] px-2.5 py-0.5 font-mono text-xs font-bold text-[#FFFFFF]">
              {atividade.codigo}
            </span>
          )}

          <span
            className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold ${badgeSsp}`}
          >
            {atividade.tipo_ssp}
          </span>

          <span className="rounded-full bg-[#0E3A29]/10 px-2.5 py-0.5 text-xs font-medium text-[#0E3A29]">
            {atividade.tipologia}
          </span>

          {atividade.orientacao && (
            <span className="rounded-full bg-[#E4DFD2]/70 px-2.5 py-0.5 font-mono text-[11px] font-medium text-[#10281E]">
              {atividade.orientacao}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {atividade.dimensao_espaco && (
            <span
              className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold ${estiloDimensao}`}
            >
              {atividade.dimensao_espaco}
            </span>
          )}

          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(atividade)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E4DFD2] bg-white px-3 py-1 text-xs font-medium text-[#10281E] transition hover:border-[#0E3A29] hover:bg-[#F5F2EA]"
              aria-label="Editar atividade"
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
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
              <span>Editar</span>
            </button>
          )}
        </div>
      </div>

      {/* Título / Nome da Atividade SSP */}
      <h2 className="mt-3 font-display text-xl font-bold tracking-tight text-[#10281E] sm:text-[22px]">
        {atividade.atividade_ssp || atividade.nome}
      </h2>

      {/* Bloco de Espaço e Métricas */}
      <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-[#F5F2EAB2]/80 bg-[#F5F2EAB2]/70 p-3.5 sm:grid-cols-3">
        <div>
          <span className="block font-sans text-[10px] uppercase tracking-wider text-[#8A8D80]">
            ESPAÇO
          </span>
          <span className="mt-0.5 block font-mono text-xs font-semibold text-[#10281E]">
            {temMedidas
              ? `${atividade.comprimento}m × ${atividade.largura}m`
              : "Não delimitado"}
          </span>
        </div>

        <div>
          <span className="block font-sans text-[10px] uppercase tracking-wider text-[#8A8D80]">
            JOGADORES
          </span>
          <span className="mt-0.5 block font-mono text-xs font-semibold text-[#10281E]">
            {atividade.numero_jogadores
              ? `${atividade.numero_jogadores} atletas`
              : "—"}
          </span>
        </div>

        <div>
          <span className="block font-sans text-[10px] uppercase tracking-wider text-[#8A8D80]">
            ÁREA / JOGADOR
          </span>
          <span className="mt-0.5 block font-mono text-xs font-semibold text-[#0E3A29]">
            {atividade.area_por_jogador
              ? `${Number(atividade.area_por_jogador).toFixed(1)} m²/jog`
              : "Não calculada"}
          </span>
        </div>
      </div>

      {/* Tags de Contexto do Jogo (Momentos, Fases, Comportamentos e Atributos) */}
      {(atividade.momentos_jogo?.length > 0 ||
        atividade.fases_jogo?.length > 0 ||
        atividade.comportamentos?.length > 0 ||
        atividade.atributos_tecnicos?.length > 0) && (
        <div className="mt-4 space-y-2 border-t border-[#E4DFD2]/60 pt-3.5">
          {/* Momentos e Fases */}
          {(atividade.momentos_jogo?.length > 0 ||
            atividade.fases_jogo?.length > 0) && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8A8D80]">
                Jogo:
              </span>
              {atividade.momentos_jogo?.map((m) => (
                <span
                  key={m}
                  className="rounded-md bg-[#0E3A29]/10 px-2 py-0.5 text-[11px] font-medium text-[#0E3A29]"
                >
                  {m}
                </span>
              ))}
              {atividade.fases_jogo?.map((f) => (
                <span
                  key={f}
                  className="rounded-md bg-[#E4DFD2]/90 px-2 py-0.5 text-[11px] font-medium text-[#10281E]"
                >
                  {f}
                </span>
              ))}
            </div>
          )}

          {/* Comportamentos e Atributos */}
          {(atividade.comportamentos?.length > 0 ||
            atividade.atributos_tecnicos?.length > 0) && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8A8D80]">
                Tática/Técnica:
              </span>
              {atividade.comportamentos?.map((c) => (
                <span
                  key={c}
                  className="rounded-md border border-[#E4DFD2] bg-white px-2 py-0.5 font-mono text-[11px] text-[#10281E]"
                >
                  {c}
                </span>
              ))}
              {atividade.atributos_tecnicos?.map((a) => (
                <span
                  key={a}
                  className="rounded-md border border-[#C6E96B]/80 bg-[#C6E96B]/20 px-2 py-0.5 font-mono text-[11px] text-[#0E3A29]"
                >
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

