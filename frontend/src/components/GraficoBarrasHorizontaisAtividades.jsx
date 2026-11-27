import React, { useState } from "react";

/**
 * Componente visual de gráfico de barras horizontais do Dashboard.
 * Segue exatamente a paleta de cores, tipografia e identidade visual de
 * GraficoBarrasAtividades.jsx e GraficoRoscaAtividades.jsx.
 *
 * Recebe dinamicamente via props a lista de itens/atividades estruturada como:
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
export default function GraficoBarrasHorizontaisAtividades({
  atividades = [],
  titulo = "Momento de Jogo no Treino",
  estadoVazio = false,
  mensagemVazio = "Sem atividades com momento de jogo registrado no período.",
  unidadeTempo = "minutos",
  minutosReferencia = 0,
}) {
  const [itemHover, setItemHover] = useState(null);

  // Filtra e normaliza itens garantindo tratamento seguro de valores ausentes, inválidos ou <= 0
  const itensNormalizados = estadoVazio
    ? []
    : (Array.isArray(atividades) ? atividades : [])
        .map((item, index) => {
          if (!item || typeof item !== "object") return null;

          const minutosBrutos = Number(item.minutos ?? item.tempo ?? 0);
          const minutos =
            Number.isFinite(minutosBrutos) && minutosBrutos > 0
              ? Math.round(minutosBrutos * 10) / 10
              : 0;

          const nomeExibicao = String(
            item.nome ||
              item.momento_jogo ||
              item.atividade_ssp ||
              item.rotulo ||
              item.codigo ||
              ""
          ).trim();

          if (!nomeExibicao || minutos <= 0) return null;

          return {
            id: item.id ?? item.codigo ?? `${nomeExibicao}-${index}`,
            codigo: item.codigo ? String(item.codigo).trim() : "",
            nome: nomeExibicao,
            minutos,
            execucoes: Number(item.execucoes) > 0 ? Number(item.execucoes) : 1,
          };
        })
        .filter(Boolean);

  // Ordena por tempo (minutos) de forma decrescente
  const itensOrdenados = [...itensNormalizados].sort((a, b) => {
    if (b.minutos !== a.minutos) return b.minutos - a.minutos;
    return a.nome.localeCompare(b.nome, "pt-BR");
  });

  // Limita até 12 atividades para visualização nítida no gráfico de barras
  const itensExibidos = itensOrdenados.slice(0, 12);

  const totalMinutos = itensExibidos.reduce(
    (acc, item) => acc + (item.minutos || 0),
    0
  );

  // Base do tempo relativo (US26 / RN03): tempo líquido do período, se informado
  const exibirPercentual = unidadeTempo === "percentual";
  const referenciaPercentual = minutosReferencia > 0 ? minutosReferencia : totalMinutos;

  const calcularPercentual = (minutos) =>
    referenciaPercentual > 0 ? ((minutos || 0) / referenciaPercentual) * 100 : 0;

  // No modo percentual o eixo X passa a ser em %, recalculando a escala
  const valorExibido = (item) =>
    exibirPercentual ? calcularPercentual(item.minutos) : item.minutos || 0;

  const maiorValor = Math.max(
    5,
    ...itensExibidos.map((item) => Math.ceil(valorExibido(item)))
  );
  // Em % o eixo fecha na dezena seguinte (ex.: 58,8% → 60%) para ticks redondos
  const maxMinutos = exibirPercentual ? Math.ceil(maiorValor / 10) * 10 : maiorValor;

  // Dimensões do gráfico SVG (mesma proporção e tamanho de GraficoBarrasAtividades: 460x270 e max-h-[280px])
  const svgWidth = 460;
  const svgHeight = 270;
  const marginTop = 20;
  const marginBottom = 30;
  const marginLeft = 104; // Espaço para os rótulos das atividades no eixo Y
  const marginRight = 54; // Espaço para o tempo em minutos à direita das barras

  const chartWidth = svgWidth - marginLeft - marginRight;
  const chartHeight = svgHeight - marginTop - marginBottom;

  const rowSlotHeight =
    itensExibidos.length > 0 ? chartHeight / itensExibidos.length : 36;
  const barHeight = Math.min(24, rowSlotHeight * 0.62);

  // Ticks do eixo X (0 até maxMinutos) com linhas de grade tracejadas (#E4DFD2)
  const xTicks = [];
  const passo =
    maxMinutos <= 15
      ? 5
      : exibirPercentual
        ? Math.ceil(maxMinutos / 50) * 10
        : Math.ceil(maxMinutos / 5);
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

  const formatarPercentual = (valor) => {
    if (!Number.isFinite(valor) || valor <= 0) return "0%";
    return `${valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    })}%`;
  };

  const formatarTempo = (minutos) =>
    exibirPercentual
      ? formatarPercentual(calcularPercentual(minutos))
      : formatarMinutos(minutos);

  return (
    <div className="fb-card flex h-full flex-col justify-between rounded-2xl border border-[#E4DFD2] bg-white p-5 shadow-2xs">
      {/* Cabeçalho idêntico a GraficoBarrasAtividades e GraficoRoscaAtividades */}
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8A8D80]">
          {titulo}
        </span>
        {itensExibidos.length > 0 && (
          <span className="font-mono text-xs font-medium text-[#10281E]">
            {exibirPercentual
              ? `100% = ${formatarMinutos(referenciaPercentual)}`
              : `${formatarMinutos(totalMinutos)} totais`}
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
            {/* Linhas de Grade Verticais e Valores do Eixo X (mesmo padrão de GraficoBarrasAtividades) */}
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
                    {exibirPercentual ? `${val}%` : `${val}m`}
                  </text>
                </g>
              );
            })}

            {/* Barras Horizontais e Rótulos do Eixo Y */}
            {itensExibidos.map((item, index) => {
              const barWidth =
                maxMinutos > 0
                  ? (valorExibido(item) / maxMinutos) * chartWidth
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
                  <title>{`${rotuloExibicao}: ${formatarMinutos(item.minutos)} (${formatarPercentual(calcularPercentual(item.minutos))})`}</title>

                  {/* Rótulo da Atividade no Eixo Y (esquerda) */}
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

                  {/* Barra Horizontal (mesmas cores #D9D6CB e hover #0E3A29 e cantos rx=3 de GraficoBarrasAtividades) */}
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

                  {/* Tempo (minutos ou %) ao lado direito da barra */}
                  <text
                    x={marginLeft + Math.max(4, barWidth) + 8}
                    y={yCenter + 3.5}
                    textAnchor="start"
                    className={`font-mono text-[10px] font-bold transition-colors ${
                      isHovered ? "fill-[#0E3A29]" : "fill-[#8A8D80]"
                    }`}
                  >
                    {formatarTempo(item.minutos)}
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
