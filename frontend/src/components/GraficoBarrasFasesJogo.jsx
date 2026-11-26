import React, { useState } from "react";

/**
 * Componente visual de gráfico de barras horizontais das Fases de Jogo no Dashboard.
 * Segue a mesma paleta de cores, tipografia, dimensões e identidade visual de
 * GraficoBarrasAtividades.jsx, GraficoRoscaAtividades.jsx e GraficoBarrasHorizontaisAtividades.jsx.
 *
 * Recebe dinamicamente via props a lista de fases de jogo estruturada como:
 * [
 *   {
 *     id: string | number,
 *     codigo?: string,
 *     nome: string,
 *     minutos: number,
 *     execucoes?: number,
 *   }
 * ]
 */
export default function GraficoBarrasFasesJogo({
  fases = [],
   titulo = "Fases de Jogo",
  estadoVazio = false,
  carregando = false,
  mensagemVazio = "Nenhuma fase de jogo registrada no período.",
}) {
  const [itemHover, setItemHover] = useState(null);

  // Filtra e normaliza itens garantindo tratamento seguro de valores ausentes, inválidos ou <= 0
  const itensNormalizados = estadoVazio
    ? []
    : (Array.isArray(fases) ? fases : [])
        .map((item, index) => {
          if (!item || typeof item !== "object") return null;

          const minutosBrutos = Number(item.minutos ?? item.tempo ?? 0);
          const minutos =
            Number.isFinite(minutosBrutos) && minutosBrutos > 0
              ? Math.round(minutosBrutos * 10) / 10
              : 0;

          const nomeExibicao = String(
            item.nome ||
              item.fase_jogo ||
              item.fase ||
              item.rotulo ||
              item.codigo ||
              ""
          ).trim();

          if (!nomeExibicao || minutos <= 0) return null;

          return {
            id: item.id ?? item.codigo ?? `fase-${nomeExibicao}-${index}`,
            codigo: item.codigo ? String(item.codigo).trim() : "",
            nome: nomeExibicao,
            minutos,
            execucoes: Number(item.execucoes) > 0 ? Number(item.execucoes) : 1,
          };
        })
        .filter(Boolean);

  // Ordena por tempo (minutos) de forma decrescente conforme o protótipo
  const itensOrdenados = [...itensNormalizados].sort((a, b) => {
    if (b.minutos !== a.minutos) return b.minutos - a.minutos;
    return a.nome.localeCompare(b.nome, "pt-BR");
  });

  // Limita até 12 fases para visualização nítida no gráfico de barras
  const itensExibidos = itensOrdenados.slice(0, 12);

  const maxMinutos = Math.max(
    5,
    ...itensExibidos.map((item) => item.minutos || 0)
  );

  const totalMinutos = itensExibidos.reduce(
    (acc, item) => acc + (item.minutos || 0),
    0
  );

  // Dimensões do gráfico SVG (mesma proporção e tamanho dos demais gráficos: 460x270 e max-h-[280px])
  const svgWidth = 460;
  const svgHeight = 270;
  const marginTop = 20;
  const marginBottom = 30;
  const marginLeft = 104; // Espaço para os rótulos das Fases de Jogo no eixo Y
  const marginRight = 54; // Espaço para o tempo em minutos à direita das barras

  const chartWidth = svgWidth - marginLeft - marginRight;
  const chartHeight = svgHeight - marginTop - marginBottom;

  const rowSlotHeight =
    itensExibidos.length > 0 ? chartHeight / itensExibidos.length : 36;
  const barHeight = Math.min(24, rowSlotHeight * 0.62);

  // Ticks do eixo X (0 até maxMinutos) com linhas de grade tracejadas (#E4DFD2)
  const xTicks = [];
  const passo = maxMinutos <= 15 ? 5 : Math.ceil(maxMinutos / 5);
  for (let val = 0; val <= maxMinutos; val += passo) {
    xTicks.push(val);
  }
  if (!xTicks.includes(maxMinutos)) {
    xTicks.push(maxMinutos);
  }

  const formatarMinutos = (valor) => {
    if (!Number.isFinite(valor) || valor <= 0) return "0 min";
    const formatado = Number.isInteger(valor)
      ? String(valor)
      : valor.toLocaleString("pt-BR", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        });
    return `${formatado} min`;
  };

  return (
    <div className="fb-card flex h-full flex-col justify-between rounded-2xl border border-[#E4DFD2] bg-white p-5 shadow-2xs">
      {/* Cabeçalho institucional seguindo o padrão dos demais gráficos do Dashboard */}
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8A8D80]">
          {titulo}
        </span>
        {!carregando && itensExibidos.length > 0 && (
          <span className="font-mono text-xs font-medium text-[#10281E]">
            {formatarMinutos(totalMinutos)} totais
          </span>
        )}
      </div>

      {carregando ? (
        <div className="flex h-56 flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5F2EA] text-[#0E3A29]">
            <svg
              className="h-5 w-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <p className="mt-3 text-xs text-[#8A8D80]">
            Carregando fases de jogo...
          </p>
        </div>
      ) : itensExibidos.length === 0 ? (
        <div className="flex h-56 flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5F2EA] text-[#8A8D80]">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="4" y="5" width="16" height="3.5" rx="1" />
              <rect x="4" y="10.25" width="11" height="3.5" rx="1" />
              <rect x="4" y="15.5" width="7" height="3.5" rx="1" />
            </svg>
          </div>
          <p className="mt-3 text-xs text-[#8A8D80]">{mensagemVazio}</p>
        </div>
      ) : (
        <div className="relative flex w-full justify-center overflow-x-auto select-none">
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="max-h-[280px] w-full"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={titulo}
          >
            {/* Linhas de Grade Verticais e Valores do Eixo X */}
            {xTicks.map((val) => {
              const xPos = marginLeft + (val / maxMinutos) * chartWidth;
              return (
                <g key={val}>
                  <line
                    x1={xPos}
                    y1={marginTop}
                    x2={xPos}
                    y2={marginTop + chartHeight}
                    stroke="#E4DFD2"
                    strokeDasharray={val === 0 ? "0" : "3 3"}
                    strokeWidth="1"
                  />
                  <text
                    x={xPos}
                    y={marginTop + chartHeight + 16}
                    textAnchor="middle"
                    className="font-mono text-[10px] fill-[#8A8D80]"
                  >
                    {val}m
                  </text>
                </g>
              );
            })}

            {/* Barras Horizontais e Rótulos das Fases de Jogo no Eixo Y */}
            {itensExibidos.map((item, index) => {
              const barWidth =
                maxMinutos > 0
                  ? ((item.minutos || 0) / maxMinutos) * chartWidth
                  : 0;
              const ySlot = marginTop + index * rowSlotHeight;
              const yCenter = ySlot + rowSlotHeight / 2;
              const yBar = yCenter - barHeight / 2;

              const isHovered = itemHover?.id === item.id;
              const rotuloExibicao = item.nome;

              return (
                <g
                  key={item.id}
                  className="cursor-pointer"
                  onMouseEnter={() => setItemHover(item)}
                  onMouseLeave={() => setItemHover(null)}
                >
                  <title>{`${rotuloExibicao}: ${formatarMinutos(item.minutos)}`}</title>

                  {/* Rótulo da Fase de Jogo no Eixo Y (esquerda) */}
                  <text
                    x={marginLeft - 12}
                    y={yCenter + 3.5}
                    textAnchor="end"
                    className={`font-sans text-[11px] transition-colors ${
                      isHovered
                        ? "font-bold fill-[#10281E]"
                        : "font-medium fill-[#8A8D80]"
                    }`}
                  >
                    {rotuloExibicao.length > 18
                      ? `${rotuloExibicao.slice(0, 16)}...`
                      : rotuloExibicao}
                  </text>

                  {/* Barra Horizontal proporcional ao tempo em minutos */}
                  <rect
                    x={marginLeft}
                    y={yBar}
                    width={Math.max(4, barWidth)}
                    height={barHeight}
                    rx={3}
                    ry={3}
                    fill={isHovered ? "#0E3A29" : "#D9D6CB"}
                    className="transition-colors duration-150"
                  />

                  {/* Tempo em minutos ao lado direito da barra */}
                  <text
                    x={marginLeft + Math.max(4, barWidth) + 8}
                    y={yCenter + 3.5}
                    textAnchor="start"
                    className={`font-mono text-[10px] font-bold transition-colors ${
                      isHovered ? "fill-[#0E3A29]" : "fill-[#8A8D80]"
                    }`}
                  >
                    {formatarMinutos(item.minutos)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
}
