import React, { useState } from "react";

export default function GraficoBarrasAtividades({ atividades = [] }) {
  const [itemHover, setItemHover] = useState(null);

  // Ordena por execuções decrescente (ou como vier da consulta)
  const itens = [...atividades].sort((a, b) => {
    if (b.execucoes !== a.execucoes) return b.execucoes - a.execucoes;
    return (b.minutos || 0) - (a.minutos || 0);
  });

  // Limita até 12 atividades para visualização nítida no gráfico de barras
  const itensExibidos = itens.slice(0, 12);

  const maxExecucoes = Math.max(
    2,
    ...itensExibidos.map((item) => item.execucoes || 0)
  );

  // Dimensões do gráfico SVG
  const svgWidth = 460;
  const svgHeight = 270;
  const marginTop = 30;
  const marginBottom = 90; // Espaço para rótulos inclinados em -45°
  const marginLeft = 48; // Espaço para o eixo Y e título
  const marginRight = 20;

  const chartWidth = svgWidth - marginLeft - marginRight;
  const chartHeight = svgHeight - marginTop - marginBottom;

  const barSlotWidth =
    itensExibidos.length > 0 ? chartWidth / itensExibidos.length : 40;
  const barWidth = Math.min(26, barSlotWidth * 0.65);

  // Ticks do eixo Y (0, 1, 2... até max)
  const yTicks = [];
  const passo = maxExecucoes <= 5 ? 1 : Math.ceil(maxExecucoes / 5);
  for (let val = 0; val <= maxExecucoes; val += passo) {
    yTicks.push(val);
  }
  if (!yTicks.includes(maxExecucoes)) {
    yTicks.push(maxExecucoes);
  }

  return (
    <div className="fb-card flex h-full flex-col justify-between rounded-2xl border border-[#E4DFD2] bg-white p-5 shadow-2xs">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8A8D80]">
          Qtd Execuções por Atividade
        </span>
        {itensExibidos.length > 0 && (
          <span className="font-mono text-xs font-medium text-[#10281E]">
            {itensExibidos.reduce((acc, atv) => acc + (atv.execucoes || 0), 0)}{" "}
            execuções
          </span>
        )}
      </div>

      {itensExibidos.length === 0 ? (
        <div className="flex h-56 flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5F2EA] text-[#8A8D80]">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="3" y="12" width="4" height="8" rx="1" />
              <rect x="10" y="8" width="4" height="12" rx="1" />
              <rect x="17" y="4" width="4" height="16" rx="1" />
            </svg>
          </div>
          <p className="mt-3 text-xs text-[#8A8D80]">
            Nenhuma atividade registrada no período.
          </p>
        </div>
      ) : (
        <div className="relative flex w-full justify-center overflow-x-auto select-none">
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="max-h-[280px] w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Título rotacionado do Eixo Y (conforme protótipo) */}
            <text
              transform={`rotate(-90)`}
              x={-(marginTop + chartHeight / 2)}
              y={14}
              textAnchor="middle"
              className="font-mono text-[10px] font-semibold uppercase tracking-wider fill-[#8A8D80]"
            >
              Qtd Execuções por Atividade
            </text>

            {/* Linhas de Grade e Valores do Eixo Y */}
            {yTicks.map((val) => {
              const yPos =
                marginTop + chartHeight - (val / maxExecucoes) * chartHeight;
              return (
                <g key={val}>
                  <line
                    x1={marginLeft}
                    y1={yPos}
                    x2={marginLeft + chartWidth}
                    y2={yPos}
                    stroke="#E4DFD2"
                    strokeDasharray={val === 0 ? "0" : "3 3"}
                    strokeWidth="1"
                  />
                  <text
                    x={marginLeft - 8}
                    y={yPos + 3.5}
                    textAnchor="end"
                    className="font-mono text-[10px] fill-[#8A8D80]"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Barras e Rótulos do Eixo X */}
            {itensExibidos.map((item, index) => {
              const barHeight =
                maxExecucoes > 0
                  ? ((item.execucoes || 0) / maxExecucoes) * chartHeight
                  : 0;
              const xSlot = marginLeft + index * barSlotWidth;
              const xBar = xSlot + (barSlotWidth - barWidth) / 2;
              const yBar = marginTop + chartHeight - barHeight;

              const isHovered = itemHover?.id === (item.codigo || item.nome || index);
              const rotuloExibicao =
                item.atividade_ssp || item.nome || `Atividade ${index + 1}`;

              return (
                <g
                  key={item.codigo || item.nome || index}
                  className="cursor-pointer"
                  onMouseEnter={() =>
                    setItemHover({
                      id: item.codigo || item.nome || index,
                      nome: rotuloExibicao,
                      execucoes: item.execucoes,
                      minutos: item.minutos,
                    })
                  }
                  onMouseLeave={() => setItemHover(null)}
                >
                  {/* Barra Vertical */}
                  <rect
                    x={xBar}
                    y={yBar}
                    width={barWidth}
                    height={Math.max(2, barHeight)}
                    rx={3}
                    ry={3}
                    fill={isHovered ? "#0E3A29" : "#D9D6CB"}
                    className="transition-colors duration-150"
                  />

                  {/* Número de execuções sobre a barra */}
                  {item.execucoes > 0 && (
                    <text
                      x={xBar + barWidth / 2}
                      y={yBar - 5}
                      textAnchor="middle"
                      className={`font-mono text-[10px] font-bold ${
                        isHovered ? "fill-[#0E3A29]" : "fill-[#8A8D80]"
                      }`}
                    >
                      {item.execucoes}
                    </text>
                  )}

                  {/* Rótulo da Atividade no Eixo X (Inclinado em -45° conforme protótipo) */}
                  <g
                    transform={`translate(${xBar + barWidth / 2}, ${
                      marginTop + chartHeight + 10
                    })`}
                  >
                    <text
                      transform="rotate(-45)"
                      textAnchor="end"
                      x={0}
                      y={0}
                      className={`font-sans text-[10px] transition-colors ${
                        isHovered
                          ? "font-bold fill-[#10281E]"
                          : "font-medium fill-[#8A8D80]"
                      }`}
                    >
                      {rotuloExibicao.length > 18
                        ? `${rotuloExibicao.slice(0, 16)}...`
                        : rotuloExibicao}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
}
