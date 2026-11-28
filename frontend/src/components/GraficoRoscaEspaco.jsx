import React, { useState } from "react";

// Cores temáticas para cada dimensão de espaço (RN02)
const CORES_DIMENSAO = {
  Pequeno: "#10281E", // Escuro predominante (≤ 100 m²)
  Médio: "#264A38", // Verde médio floresta (101 a 200 m²)
  Medio: "#264A38",
  Grande: "#688B77", // Verde sálvia/acinzentado (> 200 m²)
  "Não Definido": "#D6CEBE", // Areia/bege suave (sem delimitação / PDI)
  "Nao Definido": "#D6CEBE",
};

const NOMES_PADRAO_DIMENSAO = [
  { chave: "Pequeno", rotulo: "Pequeno", subtitulo: "≤ 100 m²" },
  { chave: "Médio", rotulo: "Médio", subtitulo: "101 a 200 m²" },
  { chave: "Grande", rotulo: "Grande", subtitulo: "> 200 m²" },
  { chave: "Não Definido", rotulo: "Não definido", subtitulo: "Sem delimitação" },
];

export default function GraficoRoscaEspaco({
  espacos = [],
  categorias = [],
  minutosTotais = 0,
  unidade = "ambos", // "minutos" | "percentual" | "ambos"
  onToggleUnidade,
}) {
  const [itemHover, setItemHover] = useState(null);

  // Usa categorias (todas as 4) ou espacos
  const fonteDados = categorias.length > 0 ? categorias : espacos;

  const totalMinutosCalculado =
    minutosTotais > 0
      ? minutosTotais
      : fonteDados.reduce((acc, item) => acc + (item.minutos || 0), 0);

  // Mapeia as 4 categorias garantindo a ordem canônica do protótipo
  const fatias = NOMES_PADRAO_DIMENSAO.map((padrao) => {
    const itemEncontrado = fonteDados.find(
      (it) =>
        (it.dimensao_espaco || it.nome || it.rotulo || "")
          .toLowerCase()
          .replace(/[^a-z]/g, "") ===
        padrao.chave.toLowerCase().replace(/[^a-z]/g, "")
    );

    const minutos = itemEncontrado ? itemEncontrado.minutos || 0 : 0;
    const perc =
      itemEncontrado?.percentual_tempo !== undefined
        ? itemEncontrado.percentual_tempo
        : totalMinutosCalculado > 0
        ? (minutos / totalMinutosCalculado) * 100
        : 0;

    return {
      id: padrao.chave,
      rotulo: padrao.rotulo,
      subtitulo: itemEncontrado?.faixa_area || padrao.subtitulo,
      minutos,
      percentual: perc,
      cor: CORES_DIMENSAO[padrao.chave] || "#8A8D80",
      execucoes: itemEncontrado?.execucoes || 0,
      areaMedia: itemEncontrado?.area_media_por_jogador ?? null,
    };
  });

  const temDados = totalMinutosCalculado > 0 && fatias.some((f) => f.minutos > 0);

  // Geometria da Rosca SVG
  const cx = 135;
  const cy = 135;
  const rExterno = 88;
  const rInterno = 54;

  let anguloAcumulado = -Math.PI / 2; // Início no topo (12h)

  const arcos = fatias
    .filter((fatia) => fatia.minutos > 0)
    .map((fatia) => {
      const anguloFatia = (fatia.percentual / 100) * 2 * Math.PI;
      const anguloInicio = anguloAcumulado;
      const anguloFim = anguloAcumulado + anguloFatia;
      anguloAcumulado = anguloFim;

      const anguloMedio = (anguloInicio + anguloFim) / 2;

      const x1 = cx + rExterno * Math.cos(anguloInicio);
      const y1 = cy + rExterno * Math.sin(anguloInicio);
      const x2 = cx + rExterno * Math.cos(anguloFim);
      const y2 = cy + rExterno * Math.sin(anguloFim);

      const x3 = cx + rInterno * Math.cos(anguloFim);
      const y3 = cy + rInterno * Math.sin(anguloFim);
      const x4 = cx + rInterno * Math.cos(anguloInicio);
      const y4 = cy + rInterno * Math.sin(anguloInicio);

      const largeArc = anguloFatia > Math.PI ? 1 : 0;

      const d = `
        M ${x1} ${y1}
        A ${rExterno} ${rExterno} 0 ${largeArc} 1 ${x2} ${y2}
        L ${x3} ${y3}
        A ${rInterno} ${rInterno} 0 ${largeArc} 0 ${x4} ${y4}
        Z
      `;

      return {
        ...fatia,
        d,
        anguloMedio,
      };
    });

  const formatarValorLegenda = (fatia) => {
    if (unidade === "percentual") {
      return `${fatia.percentual.toFixed(1).replace(".", ",")}%`;
    }
    if (unidade === "minutos") {
      return `${fatia.minutos} min`;
    }
    // Formato padrão fiel ao protótipo: "111 min (19,9%)"
    return `${fatia.minutos} min (${fatia.percentual.toFixed(1).replace(".", ",")}%)`;
  };

  return (
    <div className="fb-card flex h-full flex-col justify-between rounded-2xl border border-[#E4DFD2] bg-white p-5 shadow-2xs">
      {/* Cabeçalho do Card */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8A8D80]">
            Espaço do Treino
          </span>
          <h3 className="font-display text-base font-bold text-[#10281E]">
            Tempo por dimensão do espaço
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Seletor de Unidade [ Min | % ] conforme protótipo */}
          {onToggleUnidade && (
            <div className="inline-flex rounded-lg border border-[#E4DFD2] bg-[#F5F2EA]/60 p-0.5 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => onToggleUnidade("minutos")}
                className={`rounded-md px-2.5 py-1 font-semibold transition ${
                  unidade === "minutos"
                    ? "bg-[#10281E] text-white shadow-xs"
                    : "text-[#8A8D80] hover:text-[#10281E]"
                }`}
              >
                Min
              </button>
              <button
                type="button"
                onClick={() => onToggleUnidade("percentual")}
                className={`rounded-md px-2.5 py-1 font-semibold transition ${
                  unidade === "percentual"
                    ? "bg-[#10281E] text-white shadow-xs"
                    : "text-[#8A8D80] hover:text-[#10281E]"
                }`}
              >
                %
              </button>
            </div>
          )}

          {temDados && (
            <span className="hidden font-mono text-xs font-medium text-[#10281E] sm:inline-block">
              {totalMinutosCalculado} min líquidos
            </span>
          )}
        </div>
      </div>

      {/* Conteúdo: Gráfico ou Estado Vazio */}
      {!temDados ? (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-dashed border-[#E4DFD2]">
            <span className="font-mono text-xs text-[#8A8D80]">0 min</span>
          </div>
          <p className="mt-3 text-xs text-[#8A8D80]">
            Nenhum dado de espaço registrado para os filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-between gap-6 py-2 md:flex-row md:items-center">
          {/* Donut Chart SVG */}
          <div className="relative flex shrink-0 items-center justify-center">
            <svg
              width="270"
              height="270"
              viewBox="0 0 270 270"
              className="overflow-visible select-none"
            >
              <g>
                {arcos.map((arco) => {
                  const isHovered = itemHover?.id === arco.id;
                  return (
                    <path
                      key={arco.id}
                      d={arco.d}
                      fill={arco.cor}
                      className="cursor-pointer transition-all duration-200"
                      style={{
                        transformOrigin: `${cx}px ${cy}px`,
                        transform: isHovered ? "scale(1.04)" : "scale(1)",
                        opacity: itemHover && !isHovered ? 0.55 : 1,
                      }}
                      onMouseEnter={() => setItemHover(arco)}
                      onMouseLeave={() => setItemHover(null)}
                    >
                      <title>{`${arco.rotulo}: ${arco.minutos} min (${arco.percentual.toFixed(1)}%) - ${arco.subtitulo}`}</title>
                    </path>
                  );
                })}
              </g>

              {/* Centro da Rosca: valor em destaque */}
              <text
                x={cx}
                y={cy - 4}
                textAnchor="middle"
                className="font-mono text-xl font-bold fill-[#10281E]"
              >
                {itemHover
                  ? unidade === "percentual"
                    ? `${itemHover.percentual.toFixed(1)}%`
                    : `${itemHover.minutos}m`
                  : `${totalMinutosCalculado}m`}
              </text>
              <text
                x={cx}
                y={cy + 15}
                textAnchor="middle"
                className="font-mono text-[11px] font-medium fill-[#8A8D80]"
              >
                {itemHover ? itemHover.rotulo : "tempo líquido"}
              </text>
            </svg>
          </div>

          {/* Legenda Lateral (conforme protótipo de baixa fidelidade) */}
          <div className="flex w-full flex-col gap-2.5 sm:max-w-[280px]">
            {fatias.map((fatia) => {
              const isHovered = itemHover?.id === fatia.id;
              const valorFormatado = formatarValorLegenda(fatia);

              return (
                <div
                  key={fatia.id}
                  onMouseEnter={() => setItemHover(fatia)}
                  onMouseLeave={() => setItemHover(null)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl p-2 transition ${
                    isHovered ? "bg-[#F5F2EA]" : "hover:bg-[#F5F2EA]/60"
                  }`}
                  title={`${fatia.rotulo} (${fatia.subtitulo}): ${fatia.minutos} min${
                    fatia.areaMedia ? ` · Área média: ${fatia.areaMedia} m²/jog` : ""
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {/* Quadrado de cor conforme protótipo */}
                    <span
                      className="h-3.5 w-3.5 shrink-0 rounded-xs"
                      style={{ backgroundColor: fatia.cor }}
                    />
                    <div className="flex flex-col">
                      <span className="truncate text-xs font-semibold text-[#10281E]">
                        {fatia.rotulo}
                      </span>
                      <span className="text-[10px] text-[#8A8D80]">
                        {fatia.subtitulo}
                      </span>
                    </div>
                  </div>

                  <span className="ml-3 shrink-0 font-mono text-xs font-medium text-[#10281E]">
                    {valorFormatado}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
