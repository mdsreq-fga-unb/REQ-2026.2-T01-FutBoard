import React, { useState } from "react";

/**
 * Componente de gráfico SVG reutilizável para os 6 gráficos do relatório da sessão de treino.
 * Segue a identidade visual de GraficoBarrasAtividades.jsx e o protótipo da US25.
 */
function GraficoRelatorioCard({ dadosGrafico, tipo = "horizontal", indice = 1 }) {
  const [hoverId, setHoverId] = useState(null);

  const itens = Array.isArray(dadosGrafico?.itens)
    ? dadosGrafico.itens.slice(0, 8)
    : [];
  const unidade = dadosGrafico?.unidade || "min";
  const maxValor = Math.max(
    1,
    ...itens.map((it) => Number(it.valorPrincipal ?? it.minutos ?? it.execucoes ?? 1))
  );

  const formatarValor = (item) => {
    const min = Number(item?.minutos) || 0;
    const exec = Number(item?.execucoes) || 0;
    if (min > 0) return `${min} min`;
    return `${exec} ${exec === 1 ? "atv." : "atvs."}`;
  };

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-[#E4DFD2] bg-white p-4 shadow-2xs">
      {/* Cabeçalho do Gráfico */}
      <div className="mb-2.5 border-b border-[#E4DFD2]/70 pb-2">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#8A8D80]">
            {indice}. {dadosGrafico?.titulo}
          </span>
          {!dadosGrafico?.estadoVazio && itens.length > 0 && (
            <span className="font-mono text-[11px] font-semibold text-[#10281E]">
              {dadosGrafico.totalMinutos > 0
                ? `${dadosGrafico.totalMinutos} min`
                : `${dadosGrafico.totalExecucoes} reg.`}
            </span>
          )}
        </div>
        {dadosGrafico?.subtitulo && (
          <p className="mt-0.5 text-[11px] text-[#8A8D80]">
            {dadosGrafico.subtitulo}
          </p>
        )}
      </div>

      {/* Corpo do Gráfico ou Estado Vazio */}
      {dadosGrafico?.estadoVazio || itens.length === 0 ? (
        <div className="flex h-44 flex-col items-center justify-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F2EA] text-[#8A8D80]">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="4" y="12" width="3.5" height="7" rx="1" />
              <rect x="10.25" y="8" width="3.5" height="11" rx="1" />
              <rect x="16.5" y="4" width="3.5" height="15" rx="1" />
            </svg>
          </div>
          <p className="mt-2.5 px-3 text-xs text-[#8A8D80]">
            {dadosGrafico?.mensagemVazio || "Sem dados registrados nesta sessão."}
          </p>
        </div>
      ) : tipo === "vertical" ? (
        /* Modo Barras Verticais (conforme colunas do protótipo Image 2) */
        <div className="relative flex w-full justify-center overflow-x-auto select-none">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 420 220"
            className="max-h-[210px] w-full"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={dadosGrafico?.titulo}
          >
            {/* Linhas de Grade Horizontais */}
            {[0, 0.25, 0.5, 0.75, 1].map((fator, idx) => {
              const yPos = 165 - fator * 135;
              const val = Math.round(fator * maxValor);
              return (
                <g key={idx}>
                  <line
                    x1={42}
                    y1={yPos}
                    x2={402}
                    y2={yPos}
                    stroke="#E4DFD2"
                    strokeDasharray={idx === 0 ? "0" : "3 3"}
                    strokeWidth="1"
                  />
                  <text
                    x={36}
                    y={yPos + 3.5}
                    textAnchor="end"
                    className="font-mono text-[9px] fill-[#8A8D80]"
                  >
                    {unidade === "min" ? `${val}m` : val}
                  </text>
                </g>
              );
            })}

            {/* Colunas Verticais */}
            {itens.map((item, idx) => {
              const slotW = 360 / itens.length;
              const barW = Math.min(34, Math.max(16, slotW * 0.56));
              const val = Number(
                item.valorPrincipal ?? item.minutos ?? item.execucoes ?? 0
              );
              const barH = Math.max(4, (val / maxValor) * 135);
              const xBar = 42 + idx * slotW + (slotW - barW) / 2;
              const yBar = 165 - barH;
              const isHover = hoverId === item.id;
              const rotulo = item.codigo || item.rotuloCurto || item.nome;

              return (
                <g
                  key={item.id || idx}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverId(item.id)}
                  onMouseLeave={() => setHoverId(null)}
                >
                  <title>{`${item.nome}: ${formatarValor(item)}`}</title>
                  <rect
                    x={xBar}
                    y={yBar}
                    width={barW}
                    height={barH}
                    rx={3}
                    ry={3}
                    fill={isHover || idx === 0 ? "#0E3A29" : "#D9D6CB"}
                    className="transition-colors duration-150"
                  />
                  <text
                    x={xBar + barW / 2}
                    y={yBar - 5}
                    textAnchor="middle"
                    className="font-mono text-[9px] font-bold fill-[#10281E]"
                  >
                    {formatarValor(item)}
                  </text>
                  <text
                    x={xBar + barW / 2}
                    y={182}
                    textAnchor="middle"
                    className="font-sans text-[10px] font-semibold fill-[#10281E]"
                  >
                    {String(rotulo).length > 10
                      ? `${String(rotulo).slice(0, 9)}…`
                      : rotulo}
                  </text>
                  {item.nome && item.nome !== rotulo && (
                    <text
                      x={xBar + barW / 2}
                      y={196}
                      textAnchor="middle"
                      className="font-sans text-[9px] fill-[#8A8D80]"
                    >
                      {String(item.nome).length > 12
                        ? `${String(item.nome).slice(0, 11)}…`
                        : item.nome}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      ) : (
        /* Modo Barras Horizontais */
        <div className="relative flex w-full justify-center overflow-x-auto select-none">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 420 220"
            className="max-h-[210px] w-full"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={dadosGrafico?.titulo}
          >
            {/* Eixo vertical */}
            <line
              x1={124}
              y1={14}
              x2={124}
              y2={198}
              stroke="#10281E"
              strokeWidth="1.2"
            />

            {itens.map((item, idx) => {
              const rowH = 184 / Math.max(itens.length, 3);
              const barH = Math.min(22, Math.max(12, rowH * 0.58));
              const yCenter = 14 + idx * rowH + rowH / 2;
              const yBar = yCenter - barH / 2;
              const val = Number(
                item.valorPrincipal ?? item.minutos ?? item.execucoes ?? 0
              );
              const barW = Math.max(6, (val / maxValor) * 224);
              const isHover = hoverId === item.id;

              return (
                <g
                  key={item.id || idx}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverId(item.id)}
                  onMouseLeave={() => setHoverId(null)}
                >
                  <title>{`${item.nome}: ${formatarValor(item)}`}</title>
                  <text
                    x={116}
                    y={yCenter + 3.5}
                    textAnchor="end"
                    className={`font-sans text-[10.5px] ${
                      isHover
                        ? "font-bold fill-[#10281E]"
                        : "font-medium fill-[#10281E]"
                    }`}
                  >
                    {String(item.nome).length > 17
                      ? `${String(item.nome).slice(0, 16)}…`
                      : item.nome}
                  </text>

                  <rect
                    x={124}
                    y={yBar}
                    width={barW}
                    height={barH}
                    rx={3}
                    ry={3}
                    fill={isHover ? "#0E3A29" : "#D9D6CB"}
                    stroke="#10281E"
                    strokeWidth="0.9"
                    className="transition-colors duration-150"
                  />

                  <text
                    x={124 + barW + 8}
                    y={yCenter + 3.5}
                    textAnchor="start"
                    className="font-mono text-[10px] font-bold fill-[#10281E]"
                  >
                    {formatarValor(item)}
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

/**
 * Modal de visualização e download do Relatório Individual da Sessão de Treino (US25).
 * Reproduz o layout do protótipo em anexo (folha centralizada com hierarquia Macro -> Meso -> Micro -> Sessão,
 * resumo das atividades, os 6 gráficos da sessão e botão de download do PDF).
 */
export default function RelatorioSessaoModal({
  isOpen,
  dadosRelatorio,
  onClose,
  onDownloadPdf,
}) {
  if (!isOpen || !dadosRelatorio) return null;

  const { sessao, periodizacao, graficos } = dadosRelatorio;
  const { macrociclo, mesociclo, microciclo } = periodizacao;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-relatorio-sessao-modal"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#10281E]/65 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Folha do Relatório seguindo o protótipo da US25 */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-[920px] flex-col overflow-hidden rounded-2xl border border-[#E4DFD2] bg-[#EFE5E3] shadow-2xl">
        {/* Barra Superior de Ações */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E4DFD2] bg-[#FAF6F5] px-5 py-3.5 sm:px-7">
          <div className="flex items-center gap-2.5">
            <span className="rounded-md bg-[#10281E] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#C6E96B]">
              {sessao.codigo}
            </span>
            <span className="font-mono text-[11px] font-medium text-[#8A8D80]">
              {dadosRelatorio.nomeArquivo}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onDownloadPdf(dadosRelatorio)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0E3A29] px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#10281E]"
              title="Baixar arquivo PDF novamente"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
                />
              </svg>
              <span>Baixar PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#8A8D80] transition hover:bg-[#E4DFD2]/60 hover:text-[#10281E]"
              aria-label="Fechar visualização do relatório"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Conteúdo Rolável do Relatório */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-9 sm:py-8">
          {/* Título Centralizado conforme Protótipo */}
          <header className="mb-6 text-center">
            <h2
              id="titulo-relatorio-sessao-modal"
              className="font-display text-2xl font-bold tracking-tight text-[#10281E] sm:text-3xl"
            >
              Relatório da sessão de treino
            </h2>
            <p className="mt-1 font-mono text-xs text-[#8A8D80]">
              {sessao.nome} · Data: {sessao.dataFormatada} · Mês: {sessao.mes}
            </p>
          </header>

          {/* Hierarquia de Periodização (Macrociclo -> Mesociclo -> Microciclo -> Sessão) */}
          <section
            aria-label="Hierarquia de Periodização da Sessão"
            className="mb-6 rounded-2xl border border-[#E4DFD2] bg-white/90 p-5 shadow-2xs"
          >
            <div className="space-y-2.5 text-sm text-[#10281E]">
              <div className="flex flex-col justify-between gap-1 border-b border-[#E4DFD2]/60 pb-2 sm:flex-row sm:items-center">
                <div>
                  <span className="font-bold">Macrociclo: </span>
                  <span className="font-semibold">{macrociclo.nome}</span>
                </div>
                <span className="font-mono text-xs text-[#8A8D80]">
                  Início: {macrociclo.dataInicioFormatada} · Término:{" "}
                  {macrociclo.dataTerminoFormatada}
                </span>
              </div>

              <div className="flex flex-col justify-between gap-1 border-b border-[#E4DFD2]/60 pb-2 sm:flex-row sm:items-center">
                <div>
                  <span className="font-bold">Mesociclo: </span>
                  <span className="font-semibold">{mesociclo.nome}</span>
                </div>
                <span className="font-mono text-xs text-[#8A8D80]">
                  Início: {mesociclo.dataInicioFormatada} · Término:{" "}
                  {mesociclo.dataTerminoFormatada}
                </span>
              </div>

              <div className="flex flex-col justify-between gap-1 border-b border-[#E4DFD2]/60 pb-2 sm:flex-row sm:items-center">
                <div>
                  <span className="font-bold">Microciclo: </span>
                  <span className="font-semibold">
                    {microciclo.nome}{" "}
                    {microciclo.dataInicio && microciclo.dataTermino
                      ? `(Semana de ${microciclo.dataInicioFormatada} a ${microciclo.dataTerminoFormatada})`
                      : ""}
                  </span>
                </div>
                <span className="font-mono text-xs text-[#8A8D80]">
                  Início: {microciclo.dataInicioFormatada} · Término:{" "}
                  {microciclo.dataTerminoFormatada}
                </span>
              </div>

              <div className="flex flex-col justify-between gap-1 pt-0.5 sm:flex-row sm:items-center">
                <div>
                  <span className="font-bold text-[#0E3A29]">Sessão: </span>
                  <span className="font-semibold">
                    {sessao.nome} ({sessao.codigo})
                  </span>
                </div>
                <span className="font-mono text-xs font-semibold text-[#10281E]">
                  Data: {sessao.dataFormatada} · {sessao.totalAtividades}{" "}
                  {sessao.totalAtividades === 1 ? "atividade" : "atividades"} ·{" "}
                  {sessao.tempoLiquido} min líquidos
                </span>
              </div>
            </div>
          </section>

          {/* Linhas de Resumo das Atividades da Sessão (conforme barras horizontais do protótipo Image 2) */}
          <section
            aria-label="Atividades da Sessão"
            className="mb-6 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#8A8D80]">
                Atividades realizadas na sessão · {sessao.atividades.length}
              </span>
            </div>

            {sessao.atividades.length === 0 ? (
              <div className="rounded-xl border border-[#E4DFD2] bg-white/75 px-4 py-3 text-xs text-[#8A8D80]">
                Nenhuma atividade registrada nesta sessão.
              </div>
            ) : (
              <div className="space-y-2">
                {sessao.atividades.map((atv, idx) => (
                  <div
                    key={atv.id || idx}
                    className="flex flex-col justify-between gap-1.5 rounded-xl border border-[#D8CECC] bg-[#DDD3D1]/70 px-4 py-2.5 text-xs text-[#10281E] sm:flex-row sm:items-center"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-[#0E3A29]">
                        #{atv.ordem || idx + 1}
                      </span>
                      {atv.codigo && (
                        <span className="rounded bg-[#0E3A29] px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                          {atv.codigo}
                        </span>
                      )}
                      <span className="font-semibold">{atv.nome}</span>
                      <span className="text-[#8A8D80]">
                        · {atv.tipologia} ({atv.tipoSsp})
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-[11px] font-semibold text-[#10281E]">
                      <span>
                        {atv.tempo > 0 ? `${atv.tempo} min` : "Tempo n/d"}
                      </span>
                      <span className="text-[#8A8D80]">|</span>
                      <span>Espaço: {atv.dimensaoEspaco}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Grid com os 6 Gráficos da Sessão */}
          <section aria-label="Gráficos da Sessão de Treino">
            <div className="mb-3">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#8A8D80]">
                Gráficos da Sessão Selecionada
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* 1. Gráfico de Atividades */}
              <GraficoRelatorioCard
                dadosGrafico={graficos.atividades}
                tipo="vertical"
                indice={1}
              />

              {/* 2. Gráfico de Momento de Jogo */}
              <GraficoRelatorioCard
                dadosGrafico={graficos.momentosJogo}
                tipo="horizontal"
                indice={2}
              />

              {/* 3. Gráfico de Fases de Jogo */}
              <GraficoRelatorioCard
                dadosGrafico={graficos.fasesJogo}
                tipo="horizontal"
                indice={3}
              />

              {/* 4. Gráfico de Atributo Técnico */}
              <GraficoRelatorioCard
                dadosGrafico={graficos.atributosTecnicos}
                tipo="horizontal"
                indice={4}
              />

              {/* 5. Gráfico de Espaço de Treino */}
              <GraficoRelatorioCard
                dadosGrafico={graficos.espacosTreino}
                tipo="vertical"
                indice={5}
              />

              {/* 6. Gráfico de Comportamento de Treino */}
              <GraficoRelatorioCard
                dadosGrafico={graficos.comportamentosTreino}
                tipo="horizontal"
                indice={6}
              />
            </div>
          </section>

          {/* Botão Inferior de Download com Ícone de Seta (Fiel ao Protótipo Image 2) */}
          <div className="mt-7 flex flex-col items-center justify-center gap-1.5">
            <button
              type="button"
              onClick={() => onDownloadPdf(dadosRelatorio)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#10281E]/20 bg-white text-[#10281E] shadow-md transition hover:scale-105 hover:bg-[#0E3A29] hover:text-white"
              aria-label={`Baixar PDF ${dadosRelatorio.nomeArquivo}`}
              title={`Baixar ${dadosRelatorio.nomeArquivo}`}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v15m0 0l-5-5m5 5l5-5"
                />
              </svg>
            </button>
            <span className="font-mono text-[11px] font-medium text-[#8A8D80]">
              Baixar {dadosRelatorio.nomeArquivo}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
