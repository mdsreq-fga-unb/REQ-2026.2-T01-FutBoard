/**
 * Motor de geração e download do relatório PDF individual de sessão de treino (US25).
 *
 * Renderiza páginas A4 em alta definição (1240 x 1754 px / 150 DPI) respeitando a identidade
 * visual do FutBoard e o protótipo do relatório, distribuindo automaticamente o conteúdo
 * em múltiplas páginas para evitar cortes ou separação entre títulos e gráficos.
 * Empacota as páginas em um documento binário padrão %PDF-1.4 compatível com todos os leitores PDF.
 */

const PAGE_W = 1240;
const PAGE_H = 1754;
const MARGIN_X = 68;
const CONTENT_W = PAGE_W - MARGIN_X * 2;
const CONTENT_BOTTOM_LIMIT = PAGE_H - 92;

const CORES = {
  fundoPagina: "#F4ECEA", // Tom suave do protótipo (Image 2) harmonizado com a identidade FutBoard
  fundoCard: "#FFFFFF",
  fundoDestaque: "#F5F2EA",
  verdeEscuro: "#10281E",
  verdeFloresta: "#0E3A29",
  verdeLima: "#C6E96B",
  cinzaOliva: "#8A8D80",
  bordaBege: "#E4DFD2",
  barraPadrao: "#D9D6CB",
  barraDestaque: "#0E3A29",
  barraSecundaria: "#264A38",
};

/**
 * Desenha um retângulo com cantos arredondados no contexto 2D do Canvas.
 */
function desenharRetanguloArredondado(ctx, x, y, w, h, r, { fill, stroke, lineWidth = 1.5 } = {}) {
  const raio = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + raio, y);
  ctx.arcTo(x + w, y, x + w, y + h, raio);
  ctx.arcTo(x + w, y + h, x, y + h, raio);
  ctx.arcTo(x, y + h, x, y, raio);
  ctx.arcTo(x, y, x + w, y, raio);
  ctx.closePath();

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

/**
 * Trunca texto caso ultrapasse a largura máxima em pixels no canvas.
 */
function truncarTextoCanvas(ctx, texto, maxWidth) {
  const str = String(texto ?? "");
  if (!str) return "";
  if (ctx.measureText(str).width <= maxWidth) return str;

  let truncado = str;
  while (truncado.length > 1 && ctx.measureText(`${truncado}...`).width > maxWidth) {
    truncado = truncado.slice(0, -1);
  }
  return `${truncado}...`;
}

/**
 * Formata o valor exibido na barra do gráfico (minutos e/ou execuções).
 */
function formatarValorItemGrafico(item, unidade = "min") {
  const min = Number(item?.minutos) || 0;
  const exec = Number(item?.execucoes) || 0;
  if (unidade === "min" && min > 0) {
    return `${min} min`;
  }
  if (min > 0) {
    return `${min} min`;
  }
  return `${exec} ${exec === 1 ? "atv." : "atvs."}`;
}

/**
 * Desenha um card de gráfico individual no canvas (Suporta modo vertical e modo barras horizontais).
 */
function desenharCardGraficoCanvas(ctx, x, y, w, h, dadosGrafico, { tipo = "horizontal", indice = 1 } = {}) {
  // Card base
  desenharRetanguloArredondado(ctx, x, y, w, h, 18, {
    fill: CORES.fundoCard,
    stroke: CORES.bordaBege,
    lineWidth: 1.5,
  });

  const padX = 24;
  const padY = 22;

  // Número e título do gráfico
  ctx.save();
  ctx.fillStyle = CORES.cinzaOliva;
  ctx.font = '700 13px "JetBrains Mono", monospace';
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  const tituloUpper = `${indice}. ${String(dadosGrafico?.titulo || "Gráfico").toUpperCase()}`;
  ctx.fillText(truncarTextoCanvas(ctx, tituloUpper, w - 150), x + padX, y + padY);

  // Resumo de total à direita do cabeçalho
  const itens = Array.isArray(dadosGrafico?.itens) ? dadosGrafico.itens.slice(0, 7) : [];
  if (itens.length > 0) {
    const totalTexto =
      dadosGrafico.totalMinutos > 0
        ? `${dadosGrafico.totalMinutos} min`
        : `${dadosGrafico.totalExecucoes || itens.length} reg.`;
    ctx.fillStyle = CORES.verdeEscuro;
    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.textAlign = "right";
    ctx.fillText(totalTexto, x + w - padX, y + padY);
  }

  // Subtítulo descritivo
  if (dadosGrafico?.subtitulo) {
    ctx.fillStyle = CORES.cinzaOliva;
    ctx.font = '400 12px "Inter", sans-serif';
    ctx.textAlign = "left";
    ctx.fillText(
      truncarTextoCanvas(ctx, dadosGrafico.subtitulo, w - padX * 2),
      x + padX,
      y + padY + 20
    );
  }

  // Linha divisória sutil
  ctx.strokeStyle = CORES.bordaBege;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + padX, y + 66);
  ctx.lineTo(x + w - padX, y + 66);
  ctx.stroke();

  // Estado vazio quando não houver dados na sessão para este gráfico
  if (!itens.length || dadosGrafico?.estadoVazio) {
    const centerX = x + w / 2;
    const centerY = y + 66 + (h - 66) / 2;

    desenharRetanguloArredondado(ctx, centerX - 28, centerY - 42, 56, 44, 12, {
      fill: CORES.fundoDestaque,
      stroke: CORES.bordaBege,
      lineWidth: 1,
    });

    // Ícone de barras no estado vazio
    ctx.fillStyle = CORES.barraPadrao;
    ctx.fillRect(centerX - 16, centerY - 26, 8, 16);
    ctx.fillRect(centerX - 4, centerY - 32, 8, 22);
    ctx.fillRect(centerX + 8, centerY - 20, 8, 10);

    ctx.fillStyle = CORES.cinzaOliva;
    ctx.font = '500 14px "Inter", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const msg = dadosGrafico?.mensagemVazio || "Sem registros nesta sessão.";
    ctx.fillText(truncarTextoCanvas(ctx, msg, w - 48), centerX, centerY + 22);
    ctx.restore();
    return;
  }

  const areaTop = y + 82;
  const areaHeight = h - 104;

  // Modo Barras Verticais (conforme gráfico de colunas do protótipo Image 2)
  if (tipo === "vertical") {
    const axisLeft = x + padX + 36;
    const axisRight = x + w - padX - 10;
    const axisTop = areaTop + 14;
    const axisBottom = areaTop + areaHeight - 52;
    const chartW = axisRight - axisLeft;
    const chartH = Math.max(80, axisBottom - axisTop);

    const maxVal = Math.max(
      1,
      ...itens.map((it) => Number(it.valorPrincipal ?? it.minutos ?? it.execucoes ?? 1))
    );

    // Linhas de grade horizontais
    const ticks = 4;
    for (let t = 0; t <= ticks; t++) {
      const val = Math.round((maxVal / ticks) * t);
      const yLine = axisBottom - (t / ticks) * chartH;

      ctx.strokeStyle = CORES.bordaBege;
      ctx.lineWidth = 1;
      ctx.setLineDash(t === 0 ? [] : [4, 4]);
      ctx.beginPath();
      ctx.moveTo(axisLeft, yLine);
      ctx.lineTo(axisRight, yLine);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.fillStyle = CORES.cinzaOliva;
      ctx.font = '500 11px "JetBrains Mono", monospace';
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(
        dadosGrafico.unidade === "min" ? `${val}m` : `${val}`,
        axisLeft - 8,
        yLine
      );
    }

    const slotW = chartW / itens.length;
    const barW = Math.min(44, Math.max(18, slotW * 0.56));

    itens.forEach((item, i) => {
      const val = Number(item.valorPrincipal ?? item.minutos ?? item.execucoes ?? 0);
      const barH = maxVal > 0 ? Math.max(6, (val / maxVal) * chartH) : 6;
      const barX = axisLeft + i * slotW + (slotW - barW) / 2;
      const barY = axisBottom - barH;

      desenharRetanguloArredondado(ctx, barX, barY, barW, barH, 4, {
        fill: i === 0 ? CORES.verdeFloresta : CORES.barraPadrao,
        stroke: CORES.verdeEscuro,
        lineWidth: 1,
      });

      // Valor acima da barra
      ctx.fillStyle = CORES.verdeEscuro;
      ctx.font = '700 11px "JetBrains Mono", monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(
        formatarValorItemGrafico(item, dadosGrafico.unidade),
        barX + barW / 2,
        barY - 5
      );

      // Rótulo no eixo X
      const rotulo = item.codigo || item.rotuloCurto || item.nome;
      ctx.fillStyle = CORES.verdeEscuro;
      ctx.font = '600 11px "Inter", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(
        truncarTextoCanvas(ctx, rotulo, slotW - 4),
        barX + barW / 2,
        axisBottom + 10
      );

      if (item.nome && item.codigo && item.nome !== item.codigo) {
        const subNome = item.nome.replace(new RegExp(`^${item.codigo}\\s*\\|\\s*`, "i"), "");
        ctx.fillStyle = CORES.cinzaOliva;
        ctx.font = '400 10px "Inter", sans-serif';
        ctx.fillText(
          truncarTextoCanvas(ctx, subNome, slotW - 2),
          barX + barW / 2,
          axisBottom + 25
        );
      }
    });

    ctx.restore();
    return;
  }

  // Modo Barras Horizontais (padrão institucional para Fases, Momentos, Atributos, Espaços e Comportamentos)
  const labelWidth = 148;
  const valueRightSpace = 68;
  const barStartX = x + padX + labelWidth;
  const maxBarW = Math.max(80, w - padX * 2 - labelWidth - valueRightSpace);
  const chartBottom = areaTop + areaHeight - 20;
  const usableH = Math.max(80, chartBottom - areaTop);

  const maxVal = Math.max(
    1,
    ...itens.map((it) => Number(it.valorPrincipal ?? it.minutos ?? it.execucoes ?? 1))
  );

  // Eixo vertical de origem das barras
  ctx.strokeStyle = CORES.verdeEscuro;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(barStartX, areaTop);
  ctx.lineTo(barStartX, chartBottom);
  ctx.stroke();

  const rowH = usableH / Math.max(itens.length, 3);
  const barH = Math.min(26, Math.max(14, rowH * 0.58));

  itens.forEach((item, i) => {
    const val = Number(item.valorPrincipal ?? item.minutos ?? item.execucoes ?? 0);
    const barW = maxVal > 0 ? Math.max(8, (val / maxVal) * maxBarW) : 8;
    const rowCenterY = areaTop + i * rowH + rowH / 2;
    const barY = rowCenterY - barH / 2;

    // Rótulo à esquerda do eixo Y
    ctx.fillStyle = CORES.verdeEscuro;
    ctx.font = '600 13px "Inter", sans-serif';
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(
      truncarTextoCanvas(ctx, item.nome, labelWidth - 12),
      barStartX - 10,
      rowCenterY
    );

    // Barra horizontal proporcional ao valor
    desenharRetanguloArredondado(ctx, barStartX, barY, barW, barH, 4, {
      fill: i === 0 ? CORES.barraPadrao : CORES.barraPadrao,
      stroke: CORES.verdeEscuro,
      lineWidth: 1.2,
    });

    // Destaque lateral verde escuro na base da barra
    ctx.fillStyle = CORES.verdeFloresta;
    ctx.fillRect(barStartX, barY, Math.min(5, barW), barH);

    // Valor à direita da barra (ex: "15 min")
    ctx.fillStyle = CORES.verdeEscuro;
    ctx.font = '700 13px "JetBrains Mono", monospace';
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(
      formatarValorItemGrafico(item, dadosGrafico.unidade),
      barStartX + barW + 10,
      rowCenterY
    );
  });

  ctx.restore();
}

/**
 * Cria um novo canvas de página A4 com o fundo institucional e cabeçalho.
 */
function criarPaginaCanvas(dadosRelatorio, ehPrimeiraPagina = false) {
  const canvas = document.createElement("canvas");
  canvas.width = PAGE_W;
  canvas.height = PAGE_H;
  const ctx = canvas.getContext("2d");

  // Fundo principal da folha (seguindo o tom suave do protótipo Image 2)
  ctx.fillStyle = CORES.fundoPagina;
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);

  // Moldura interna sutil
  desenharRetanguloArredondado(ctx, 32, 32, PAGE_W - 64, PAGE_H - 64, 24, {
    fill: "#FAF6F5",
    stroke: CORES.bordaBege,
    lineWidth: 2,
  });

  // Faixa superior verde institucional FutBoard
  desenharRetanguloArredondado(ctx, 32, 32, PAGE_W - 64, 16, 12, {
    fill: CORES.verdeFloresta,
  });

  let cursorY = 76;

  if (ehPrimeiraPagina) {
    // Título centralizado conforme protótipo ("Relatório da sessão de treino")
    ctx.fillStyle = CORES.verdeEscuro;
    ctx.font = '700 34px "Bricolage Grotesque", "Inter", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("Relatório da sessão de treino", PAGE_W / 2, cursorY);

    cursorY += 46;

    // Subtítulo com código e nome da sessão
    ctx.fillStyle = CORES.cinzaOliva;
    ctx.font = '600 14px "JetBrains Mono", monospace';
    ctx.textAlign = "center";
    const subtituloSessao = `${dadosRelatorio.sessao.codigo} · ${dadosRelatorio.sessao.nome} · Data: ${dadosRelatorio.sessao.dataFormatada}`;
    ctx.fillText(subtituloSessao, PAGE_W / 2, cursorY);

    cursorY += 34;
  } else {
    // Cabeçalho compacto para páginas adicionais
    ctx.fillStyle = CORES.verdeEscuro;
    ctx.font = '700 20px "Bricolage Grotesque", "Inter", sans-serif';
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(
      `Relatório da sessão de treino — ${dadosRelatorio.sessao.nome} (${dadosRelatorio.sessao.codigo})`,
      MARGIN_X,
      cursorY
    );

    ctx.fillStyle = CORES.cinzaOliva;
    ctx.font = '500 13px "JetBrains Mono", monospace';
    ctx.textAlign = "right";
    ctx.fillText(
      `Data: ${dadosRelatorio.sessao.dataFormatada}`,
      PAGE_W - MARGIN_X,
      cursorY + 4
    );

    cursorY += 36;
    ctx.strokeStyle = CORES.bordaBege;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(MARGIN_X, cursorY);
    ctx.lineTo(PAGE_W - MARGIN_X, cursorY);
    ctx.stroke();
    cursorY += 24;
  }

  return { canvas, ctx, cursorY };
}

/**
 * Desenha o rodapé institucional em todas as páginas geradas.
 */
function desenharRodapePaginas(paginas, dadosRelatorio) {
  const totalPaginas = paginas.length;
  paginas.forEach(({ ctx }, idx) => {
    const footerY = PAGE_H - 64;

    ctx.strokeStyle = CORES.bordaBege;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(MARGIN_X, footerY - 14);
    ctx.lineTo(PAGE_W - MARGIN_X, footerY - 14);
    ctx.stroke();

    ctx.fillStyle = CORES.cinzaOliva;
    ctx.font = '500 12px "JetBrains Mono", monospace';
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(
      `FutBoard · Relatório Individual de Sessão · Gerado em ${dadosRelatorio.geradoEm}`,
      MARGIN_X,
      footerY + 4
    );

    ctx.textAlign = "right";
    ctx.fillText(
      `Página ${idx + 1} de ${totalPaginas}`,
      PAGE_W - MARGIN_X,
      footerY + 4
    );
  });
}

/**
 * Renderiza o relatório completo em uma lista de páginas Canvas A4.
 */
function renderizarPaginasRelatorioCanvas(dadosRelatorio) {
  const paginas = [];
  let paginaAtual = criarPaginaCanvas(dadosRelatorio, true);
  paginas.push(paginaAtual);

  const garantirEspacoVertical = (alturaNecessaria) => {
    if (paginaAtual.cursorY + alturaNecessaria > CONTENT_BOTTOM_LIMIT) {
      paginaAtual = criarPaginaCanvas(dadosRelatorio, false);
      paginas.push(paginaAtual);
    }
  };

  // =========================================================================
  // 1. BLOCO DE HIERARQUIA DE PERIODIZAÇÃO (Macrociclo -> Mesociclo -> Microciclo -> Sessão)
  // =========================================================================
  const { macrociclo, mesociclo, microciclo } = dadosRelatorio.periodizacao;
  const { sessao } = dadosRelatorio;

  const alturaCardHierarquia = 196;
  garantirEspacoVertical(alturaCardHierarquia + 20);

  const { ctx } = paginaAtual;
  const cardX = MARGIN_X;
  const cardY = paginaAtual.cursorY;

  desenharRetanguloArredondado(ctx, cardX, cardY, CONTENT_W, alturaCardHierarquia, 18, {
    fill: CORES.fundoCard,
    stroke: CORES.bordaBege,
    lineWidth: 1.5,
  });

  // Barra lateral verde de destaque da hierarquia
  desenharRetanguloArredondado(ctx, cardX, cardY, 8, alturaCardHierarquia, 4, {
    fill: CORES.verdeFloresta,
  });

  const textLeft = cardX + 28;
  let lineY = cardY + 22;

  // Macrociclo Pai
  ctx.fillStyle = CORES.verdeEscuro;
  ctx.font = '700 17px "Inter", sans-serif';
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  const textoMacro = `Macrociclo: ${macrociclo.nome}`;
  ctx.fillText(truncarTextoCanvas(ctx, textoMacro, 620), textLeft, lineY);

  ctx.fillStyle = CORES.cinzaOliva;
  ctx.font = '500 14px "JetBrains Mono", monospace';
  ctx.textAlign = "right";
  ctx.fillText(
    `Início: ${macrociclo.dataInicioFormatada}  ·  Término: ${macrociclo.dataTerminoFormatada}`,
    cardX + CONTENT_W - 24,
    lineY + 2
  );

  lineY += 40;

  // Mesociclo Pai
  ctx.fillStyle = CORES.verdeEscuro;
  ctx.font = '700 17px "Inter", sans-serif';
  ctx.textAlign = "left";
  const textoMeso = `Mesociclo: ${mesociclo.nome}`;
  ctx.fillText(truncarTextoCanvas(ctx, textoMeso, 620), textLeft, lineY);

  ctx.fillStyle = CORES.cinzaOliva;
  ctx.font = '500 14px "JetBrains Mono", monospace';
  ctx.textAlign = "right";
  ctx.fillText(
    `Início: ${mesociclo.dataInicioFormatada}  ·  Término: ${mesociclo.dataTerminoFormatada}`,
    cardX + CONTENT_W - 24,
    lineY + 2
  );

  lineY += 40;

  // Microciclo Pai
  ctx.fillStyle = CORES.verdeEscuro;
  ctx.font = '700 17px "Inter", sans-serif';
  ctx.textAlign = "left";
  const textoMicro = `Microciclo: ${microciclo.nome} (Semana de ${microciclo.dataInicioFormatada} a ${microciclo.dataTerminoFormatada})`;
  ctx.fillText(truncarTextoCanvas(ctx, textoMicro, 660), textLeft, lineY);

  ctx.fillStyle = CORES.cinzaOliva;
  ctx.font = '500 14px "JetBrains Mono", monospace';
  ctx.textAlign = "right";
  ctx.fillText(
    `Início: ${microciclo.dataInicioFormatada}  ·  Término: ${microciclo.dataTerminoFormatada}`,
    cardX + CONTENT_W - 24,
    lineY + 2
  );

  lineY += 34;

  // Linha divisória interna para a Sessão Selecionada
  ctx.strokeStyle = CORES.bordaBege;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(textLeft, lineY);
  ctx.lineTo(cardX + CONTENT_W - 24, lineY);
  ctx.stroke();

  lineY += 16;

  // Dados da Sessão Selecionada
  ctx.fillStyle = CORES.verdeFloresta;
  ctx.font = '700 16px "Inter", sans-serif';
  ctx.textAlign = "left";
  ctx.fillText(
    `Sessão: ${sessao.nome} (${sessao.codigo})`,
    textLeft,
    lineY
  );

  ctx.fillStyle = CORES.verdeEscuro;
  ctx.font = '600 14px "JetBrains Mono", monospace';
  ctx.textAlign = "right";
  ctx.fillText(
    `Data: ${sessao.dataFormatada}  ·  Mês: ${sessao.mes}  ·  Atividades: ${sessao.totalAtividades}  ·  Tempo líquido: ${sessao.tempoLiquido} min`,
    cardX + CONTENT_W - 24,
    lineY + 1
  );

  paginaAtual.cursorY += alturaCardHierarquia + 22;

  // =========================================================================
  // 2. RESUMO DAS ATIVIDADES DA SESSÃO (Barras horizontais de resumo do protótipo Image 2)
  // =========================================================================
  const listaAtividades = Array.isArray(sessao.atividades) ? sessao.atividades : [];
  const maxAtividadesResumoPorBloco = Math.max(1, listaAtividades.length);
  const alturaLinhaAtividade = 38;
  const alturaCabecalhoResumo = 46;

  if (listaAtividades.length === 0) {
    const alturaVazio = 78;
    garantirEspacoVertical(alturaVazio + 20);
    desenharRetanguloArredondado(
      paginaAtual.ctx,
      MARGIN_X,
      paginaAtual.cursorY,
      CONTENT_W,
      alturaVazio,
      16,
      {
        fill: CORES.fundoCard,
        stroke: CORES.bordaBege,
        lineWidth: 1.5,
      }
    );
    paginaAtual.ctx.fillStyle = CORES.cinzaOliva;
    paginaAtual.ctx.font = '500 15px "Inter", sans-serif';
    paginaAtual.ctx.textAlign = "center";
    paginaAtual.ctx.textBaseline = "middle";
    paginaAtual.ctx.fillText(
      "Nenhuma atividade cadastrada nesta sessão de treino.",
      PAGE_W / 2,
      paginaAtual.cursorY + alturaVazio / 2
    );
    paginaAtual.cursorY += alturaVazio + 22;
  } else {
    // Exibe as linhas de resumo das atividades (paginando automaticamente caso haja muitas atividades)
    const atividadesExibidas = listaAtividades.slice(0, maxAtividadesResumoPorBloco);
    garantirEspacoVertical(alturaCabecalhoResumo + Math.min(3, atividadesExibidas.length) * alturaLinhaAtividade + 24);

    paginaAtual.ctx.fillStyle = CORES.cinzaOliva;
    paginaAtual.ctx.font = '700 13px "JetBrains Mono", monospace';
    paginaAtual.ctx.textAlign = "left";
    paginaAtual.ctx.textBaseline = "top";
    paginaAtual.ctx.fillText(
      `ATIVIDADES REALIZADAS NA SESSÃO (${atividadesExibidas.length})`,
      MARGIN_X + 4,
      paginaAtual.cursorY
    );
    paginaAtual.cursorY += 24;

    atividadesExibidas.forEach((atv, idx) => {
      garantirEspacoVertical(alturaLinhaAtividade + 10);
      const c = paginaAtual.ctx;
      const rowY = paginaAtual.cursorY;

      desenharRetanguloArredondado(
        c,
        MARGIN_X,
        rowY,
        CONTENT_W,
        32,
        10,
        {
          fill: idx % 2 === 0 ? "#E6DFDD" : "#EFE9E7",
          stroke: CORES.bordaBege,
          lineWidth: 1,
        }
      );

      c.fillStyle = CORES.verdeEscuro;
      c.font = '700 13px "JetBrains Mono", monospace';
      c.textAlign = "left";
      c.textBaseline = "middle";
      const prefixo = `#${atv.ordem || idx + 1}  ${atv.codigo ? `[${atv.codigo}]` : ""}`;
      c.fillText(prefixo, MARGIN_X + 16, rowY + 16);

      c.font = '600 14px "Inter", sans-serif';
      c.fillText(
        truncarTextoCanvas(c, `${atv.nome} · ${atv.tipologia} (${atv.tipoSsp})`, 580),
        MARGIN_X + 135,
        rowY + 16
      );

      c.fillStyle = CORES.verdeFloresta;
      c.font = '700 13px "JetBrains Mono", monospace';
      c.textAlign = "right";
      const infoDireita = `${atv.tempo > 0 ? `${atv.tempo} min` : "Tempo n/d"}  ·  Espaço: ${atv.dimensaoEspaco}`;
      c.fillText(infoDireita, MARGIN_X + CONTENT_W - 16, rowY + 16);

      paginaAtual.cursorY += alturaLinhaAtividade;
    });

    paginaAtual.cursorY += 14;
  }

  // =========================================================================
  // 3. OS 6 GRÁFICOS DA SESSÃO DE TREINO (Em pares lado a lado, sem cortes)
  // =========================================================================
  const { graficos } = dadosRelatorio;
  const paresGraficos = [
    [
      { dados: graficos.atividades, tipo: "vertical", indice: 1 },
      { dados: graficos.momentosJogo, tipo: "horizontal", indice: 2 },
    ],
    [
      { dados: graficos.fasesJogo, tipo: "horizontal", indice: 3 },
      { dados: graficos.atributosTecnicos, tipo: "horizontal", indice: 4 },
    ],
    [
      { dados: graficos.espacosTreino, tipo: "vertical", indice: 5 },
      { dados: graficos.comportamentosTreino, tipo: "horizontal", indice: 6 },
    ],
  ];

  const gapCol = 24;
  const cardW = (CONTENT_W - gapCol) / 2;
  const cardH = 330;

  paresGraficos.forEach((par) => {
    // Evita que os gráficos sejam cortados no fim da página
    garantirEspacoVertical(cardH + 22);

    const yRow = paginaAtual.cursorY;
    const c = paginaAtual.ctx;

    par.forEach((itemGrafico, colIdx) => {
      const xCol = MARGIN_X + colIdx * (cardW + gapCol);
      desenharCardGraficoCanvas(c, xCol, yRow, cardW, cardH, itemGrafico.dados, {
        tipo: itemGrafico.tipo,
        indice: itemGrafico.indice,
      });
    });

    paginaAtual.cursorY += cardH + 22;
  });

  desenharRodapePaginas(paginas, dadosRelatorio);
  return paginas.map((p) => p.canvas);
}

/**
 * Converte um dataURL JPEG em Uint8Array de bytes binários.
 */
function dataUrlParaUint8Array(dataUrl) {
  const base64 = dataUrl.split(",")[1] || "";
  const stringBinaria = window.atob(base64);
  const len = stringBinaria.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = stringBinaria.charCodeAt(i);
  }
  return bytes;
}

/**
 * Monta um arquivo binário %PDF-1.4 válido a partir de uma lista de páginas Canvas A4.
 */
function construirBlobPdfDeCanvases(canvases = []) {
  const encoder = new TextEncoder();
  const partes = [];
  let offsetAtual = 0;

  const adicionarTexto = (str) => {
    const bytes = encoder.encode(str);
    partes.push(bytes);
    offsetAtual += bytes.length;
  };

  const adicionarBytes = (bytes) => {
    partes.push(bytes);
    offsetAtual += bytes.length;
  };

  // Cabeçalho padrão PDF 1.4
  adicionarTexto("%PDF-1.4\n");
  adicionarBytes(new Uint8Array([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a]));

  // IDs dos objetos PDF:
  // 1: Catalog
  // 2: Pages
  // Para cada página i:
  //   pageObjId = 3 + i * 3
  //   contentObjId = 4 + i * 3
  //   imageObjId = 5 + i * 3
  const numPaginas = canvases.length;
  const totalObjetos = 2 + numPaginas * 3;
  const offsets = new Array(totalObjetos + 1).fill(0);

  // Obj 1: Catalog
  offsets[1] = offsetAtual;
  adicionarTexto("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  // Obj 2: Pages
  const kidsRefs = canvases
    .map((_, i) => `${3 + i * 3} 0 R`)
    .join(" ");
  offsets[2] = offsetAtual;
  adicionarTexto(
    `2 0 obj\n<< /Type /Pages /Kids [ ${kidsRefs} ] /Count ${numPaginas} >>\nendobj\n`
  );

  // Objetos de cada página (A4 em pontos PDF: 595.28 x 841.89)
  const pdfPageW = "595.28";
  const pdfPageH = "841.89";

  canvases.forEach((canvas, i) => {
    const pageObjId = 3 + i * 3;
    const contentObjId = 4 + i * 3;
    const imageObjId = 5 + i * 3;

    const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.94);
    const jpegBytes = dataUrlParaUint8Array(jpegDataUrl);

    // Page Object
    offsets[pageObjId] = offsetAtual;
    adicionarTexto(
      `${pageObjId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pdfPageW} ${pdfPageH}] /Resources << /XObject << /Im${i} ${imageObjId} 0 R >> >> /Contents ${contentObjId} 0 R >>\nendobj\n`
    );

    // Content Stream que posiciona a página A4 sem distorção
    const comandoStream = `q\n${pdfPageW} 0 0 ${pdfPageH} 0 0 cm\n/Im${i} Do\nQ\n`;
    const comandoBytes = encoder.encode(comandoStream);
    offsets[contentObjId] = offsetAtual;
    adicionarTexto(
      `${contentObjId} 0 obj\n<< /Length ${comandoBytes.length} >>\nstream\n`
    );
    adicionarBytes(comandoBytes);
    adicionarTexto("\nendstream\nendobj\n");

    // Image XObject (/DCTDecode JPEG)
    offsets[imageObjId] = offsetAtual;
    adicionarTexto(
      `${imageObjId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`
    );
    adicionarBytes(jpegBytes);
    adicionarTexto("\nendstream\nendobj\n");
  });

  // Tabela Cross-Reference (xref)
  const xrefOffset = offsetAtual;
  adicionarTexto(`xref\n0 ${totalObjetos + 1}\n`);
  adicionarTexto("0000000000 65535 f \n");
  for (let objId = 1; objId <= totalObjetos; objId++) {
    const offsetStr = String(offsets[objId]).padStart(10, "0");
    adicionarTexto(`${offsetStr} 00000 n \n`);
  }

  // Trailer
  adicionarTexto(
    `trailer\n<< /Size ${totalObjetos + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`
  );

  return new Blob(partes, { type: "application/pdf" });
}

/**
 * Gera o arquivo PDF da sessão selecionada e inicia o download no navegador.
 */
export function gerarEBaixarPdfSessao(dadosRelatorio) {
  if (!dadosRelatorio || !dadosRelatorio.sessao) {
    throw new Error("Dados do relatório ausentes para geração do PDF.");
  }

  const canvases = renderizarPaginasRelatorioCanvas(dadosRelatorio);
  const pdfBlob = construirBlobPdfDeCanvases(canvases);
  const nomeArquivo = dadosRelatorio.nomeArquivo || "relatorio_sessao_1.pdf";

  const blobUrl = URL.createObjectURL(pdfBlob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 5000);

  return {
    nomeArquivo,
    totalPaginas: canvases.length,
  };
}
