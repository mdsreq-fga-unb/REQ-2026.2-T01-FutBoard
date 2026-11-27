import React, { useState } from "react";

// Paleta de cores inspirada no tema e tons do FutBoard
const CORES_PALETA = [
  "#10281E", // Escuro predominante
  "#0E3A29", // Verde floresta principal
  "#264A38", // Verde médio
  "#446B56", // Verde musgo
  "#688B77", // Verde acinzentado
  "#8A8D80", // Cinza médio
  "#B2B4A8", // Cinza claro
  "#C6E96B", // Verde limão de destaque
  "#5C6052", // Neutro escuro
  "#9BA08F", // Sálvia
];

export default function GraficoRoscaAtividades({
  atividades = [],
  minutosTotais = 0,
  unidadeTempo = "minutos",
  minutosReferencia = 0,
}) {
  const [itemHover, setItemHover] = useState(null);

  // Ordena por minutos decrescente
  const itensOrdenados = [...atividades].sort((a, b) => b.minutos - a.minutos);

  // Considera os itens principais para o gráfico e agrupa excedentes se houver muitos
  const MAX_FATIAS = 7;
  const fatiasPrincipais = itensOrdenados.slice(0, MAX_FATIAS);
  const excedentes = itensOrdenados.slice(MAX_FATIAS);

  const totalMinutosCalculado =
    minutosTotais > 0
      ? minutosTotais
      : itensOrdenados.reduce((acc, atv) => acc + (atv.minutos || 0), 0);

  // Base do tempo relativo (US26 / RN03): tempo líquido do período, se informado
  const referenciaPercentual =
    minutosReferencia > 0 ? minutosReferencia : totalMinutosCalculado;
  const exibirPercentual = unidadeTempo === "percentual";

  const calcularPercentual = (minutos) =>
    referenciaPercentual > 0 ? ((minutos || 0) / referenciaPercentual) * 100 : 0;

  const formatarPercentual = (minutos) =>
    `${calcularPercentual(minutos).toLocaleString("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    })}%`;

  // Monta lista de fatias com percentuais e ângulos
  const fatias = [];
  if (totalMinutosCalculado > 0) {
    fatiasPrincipais.forEach((item, index) => {
      const perc = (item.minutos / totalMinutosCalculado) * 100;
      fatias.push({
        id: item.codigo || item.nome || index,
        rotulo: item.atividade_ssp || item.nome || `Atividade ${index + 1}`,
        minutos: item.minutos,
        percentual: perc,
        cor: CORES_PALETA[index % CORES_PALETA.length],
      });
    });

    if (excedentes.length > 0) {
      const somaMin = excedentes.reduce((acc, atv) => acc + (atv.minutos || 0), 0);
      const perc = (somaMin / totalMinutosCalculado) * 100;
      fatias.push({
        id: "outros",
        rotulo: `Outras (${excedentes.length})`,
        minutos: somaMin,
        percentual: perc,
        cor: "#D9D6CB",
      });
    }
  }

  // Geometria da Rosca SVG
  const cx = 135;
  const cy = 135;
  const rExterno = 88;
  const rInterno = 54;

  let anguloAcumulado = -Math.PI / 2; // Começa no topo (12h)

  const arcos = fatias.map((fatia) => {
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

    // Posição para indicador/linha de chamada externa
    const rCallout = rExterno + 14;
    const calloutX = cx + rCallout * Math.cos(anguloMedio);
    const calloutY = cy + rCallout * Math.sin(anguloMedio);

    return {
      ...fatia,
      d,
      anguloMedio,
      calloutX,
      calloutY,
    };
  });

  return (
    <div className="fb-card flex h-full flex-col justify-between rounded-2xl border border-[#E4DFD2] bg-white p-5 shadow-2xs">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8A8D80]">
          Volume de Tempo por Atividade
        </span>
        {totalMinutosCalculado > 0 && (
          <span className="font-mono text-xs font-medium text-[#10281E]">
            {exibirPercentual
              ? `100% = ${referenciaPercentual} min`
              : `${totalMinutosCalculado} min totais`}
          </span>
        )}
      </div>

      {fatias.length === 0 ? (
        <div className="flex h-56 flex-col items-center justify-center text-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-dashed border-[#E4DFD2]">
            <span className="font-mono text-xs text-[#8A8D80]">0 min</span>
          </div>
          <p className="mt-3 text-xs text-[#8A8D80]">
            Nenhuma atividade registrada no período.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row sm:items-center">
          {/* Gráfico Donut em SVG */}
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
                        opacity: itemHover && !isHovered ? 0.6 : 1,
                      }}
                      onMouseEnter={() => setItemHover(arco)}
                      onMouseLeave={() => setItemHover(null)}
                    >
                      <title>{`${arco.rotulo}: ${arco.minutos} min (${formatarPercentual(arco.minutos)})`}</title>
                    </path>
                  );
                })}
              </g>

              {/* Rótulo central com tempo total ou item selecionado */}
              <text
                x={cx}
                y={cy - 4}
                textAnchor="middle"
                className="font-mono text-lg font-bold fill-[#10281E]"
              >
                {exibirPercentual
                  ? itemHover
                    ? formatarPercentual(itemHover.minutos)
                    : "100%"
                  : `${itemHover ? itemHover.minutos : totalMinutosCalculado}m`}
              </text>
              <text
                x={cx}
                y={cy + 14}
                textAnchor="middle"
                className="font-mono text-[10px] font-medium fill-[#8A8D80]"
              >
                {itemHover
                  ? exibirPercentual
                    ? `${itemHover.minutos} min`
                    : formatarPercentual(itemHover.minutos)
                  : `${fatias.length} atividades`}
              </text>
            </svg>
          </div>

          {/* Legenda Lateral com Código, Nome, Minutos e % */}
          <div className="flex w-full flex-col gap-2 sm:max-w-[210px]">
            {fatias.map((fatia) => {
              const isHovered = itemHover?.id === fatia.id;
              return (
                <div
                  key={fatia.id}
                  onMouseEnter={() => setItemHover(fatia)}
                  onMouseLeave={() => setItemHover(null)}
                  className={`flex cursor-pointer items-center justify-between rounded-lg px-2 py-1 transition ${
                    isHovered ? "bg-[#F5F2EA]" : "hover:bg-[#F5F2EA]/60"
                  }`}
                  title={`${fatia.rotulo} - ${fatia.minutos} min`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: fatia.cor }}
                    />
                    <span className="truncate text-xs font-medium text-[#10281E]">
                      {fatia.rotulo}
                    </span>
                  </div>

                  <span className="ml-2 shrink-0 font-mono text-[11px] text-[#8A8D80]">
                    {exibirPercentual
                      ? formatarPercentual(fatia.minutos)
                      : `${fatia.minutos} (${formatarPercentual(fatia.minutos)})`}
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
