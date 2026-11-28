import api from "./api.js";

/**
 * Mapeamento de códigos curtos de Momento de Jogo para nomes amigáveis de exibição.
 */
const MAPA_MOMENTOS_EXIBICAO = {
  "Trans Def": "Transição Defensiva",
  "Trans Of": "Transição Ofensiva",
  "Transição Defensiva": "Transição Defensiva",
  "Transição Ofensiva": "Transição Ofensiva",
  Ataque: "Ataque",
  Defesa: "Defesa",
  "Bola Parada": "Bola Parada",
  "Bola parada": "Bola Parada",
};

const MESES_ANO = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

/**
 * Dados temporários de referência para validação visual opcional (Seção 6).
 * Só são utilizados se a flag `futboard_usar_mock_relatorio === "true"` estiver ativa no localStorage
 * e a sessão selecionada não possuir atividades cadastradas.
 */
const MOCK_ATIVIDADES_VALIDACAO_RELATORIO = [
  {
    id: "mock-atv-1",
    ordem: 1,
    codigo: "RD1",
    nome: "Rondo de Pressão",
    atividade_ssp: "RD | Rondo de Pressão",
    tipologia: "Rondo",
    sigla_tipologia: "RD",
    tipo_ssp: "Especial",
    tempo: 15,
    comprimento: 20,
    largura: 20,
    numero_jogadores: 8,
    area_por_jogador: 50,
    dimensao_espaco: "Pequeno",
    momentos_jogo: ["Ataque", "Transição Defensiva"],
    fases_jogo: ["1ª Construção", "Criação"],
    atributos_tecnicos: ["Passe Curto", "Domínio Orientado"],
    comportamentos: ["Pressão Pós-Perda", "Apoio Curto"],
  },
  {
    id: "mock-atv-2",
    ordem: 2,
    codigo: "JS1",
    nome: "Jogo Setorial Cri / Fin",
    atividade_ssp: "JS | Cri / Fin",
    tipologia: "Jogo Setorial",
    sigla_tipologia: "JS",
    tipo_ssp: "Dirigido",
    tempo: 25,
    comprimento: 45,
    largura: 35,
    numero_jogadores: 10,
    area_por_jogador: 157.5,
    dimensao_espaco: "Médio",
    momentos_jogo: ["Ataque", "Transição Ofensiva"],
    fases_jogo: ["2ª Construção", "Criação", "Finalização"],
    atributos_tecnicos: ["Finalização", "Passe Vertical"],
    comportamentos: ["Infiltração", "Amplitude Ofensiva"],
  },
  {
    id: "mock-atv-3",
    ordem: 3,
    codigo: "CF1",
    nome: "Confronto Coletivo",
    atividade_ssp: "CF | Confronto Coletivo",
    tipologia: "Confrontos",
    sigla_tipologia: "CF",
    tipo_ssp: "Competitivo",
    tempo: 20,
    comprimento: 70,
    largura: 50,
    numero_jogadores: 14,
    area_por_jogador: 250,
    dimensao_espaco: "Grande",
    momentos_jogo: ["Defesa", "Bola Parada"],
    fases_jogo: ["Bola Parada", "Finalização"],
    atributos_tecnicos: ["Cabeceio", "Desarme"],
    comportamentos: ["Compactação Defensiva", "CoordLinDef"],
  },
];

/**
 * Formata uma data ISO (YYYY-MM-DD) para DD/MM/YYYY.
 * Retorna "Não informado" caso a data não esteja disponível.
 */
export function formatarDataRelatorio(isoDate, fallback = "Não informado") {
  if (!isoDate) return fallback;
  const texto = String(isoDate).trim();
  if (!texto) return fallback;
  const partes = texto.slice(0, 10).split("-");
  if (partes.length !== 3) return texto;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

/**
 * Obtém o nome do mês a partir do campo `mes` da sessão ou da data ISO.
 */
function resolverMesSessao(sessao) {
  if (sessao?.mes && String(sessao.mes).trim()) {
    const mesBruto = String(sessao.mes).trim();
    if (/^\d+$/.test(mesBruto)) {
      const idx = parseInt(mesBruto, 10) - 1;
      if (idx >= 0 && idx < 12) return MESES_ANO[idx];
    }
    return mesBruto;
  }
  if (sessao?.data) {
    const partes = String(sessao.data).slice(0, 10).split("-");
    if (partes.length === 3) {
      const idx = parseInt(partes[1], 10) - 1;
      if (idx >= 0 && idx < 12) return MESES_ANO[idx];
    }
  }
  return "Não informado";
}

/**
 * Calcula a dimensão do espaço de treino a partir dos dados da atividade (RN01 e RN02).
 */
function resolverDimensaoEspacoAtividade(atv) {
  const dimensaoSalva = String(atv?.dimensao_espaco || "").trim();
  if (
    dimensaoSalva === "Pequeno" ||
    dimensaoSalva === "Médio" ||
    dimensaoSalva === "Grande"
  ) {
    return dimensaoSalva;
  }

  const c = Number(atv?.comprimento);
  const l = Number(atv?.largura);
  const j = Number(atv?.numero_jogadores);

  if (Number.isFinite(c) && Number.isFinite(l) && Number.isFinite(j) && c > 0 && l > 0 && j > 0) {
    const area = (c * l) / j;
    if (area <= 100) return "Pequeno";
    if (area <= 200) return "Médio";
    return "Grande";
  }

  return "Não Definido";
}

/**
 * Resolve a hierarquia de periodização: Macrociclo -> Mesociclo -> Microciclo -> Sessão.
 * Respeita estritamente os relacionamentos por ID existentes sem misturar outros ciclos
 * e sem inventar dados quando alguma informação não estiver disponível.
 */
export function resolverHierarquiaPeriodizacao(
  sessao,
  { microciclos = [], mesociclos = [], macrociclos = [] } = {}
) {
  const microIdBruto = sessao?.microcicloId ?? sessao?.microciclo ?? null;
  const microId =
    microIdBruto !== null && microIdBruto !== undefined && microIdBruto !== ""
      ? Number(microIdBruto)
      : null;

  // 1. Localiza o Microciclo pai exclusivamente pelo ID vinculado à sessão
  const microEncontrado =
    microId !== null && Number.isFinite(microId)
      ? microciclos.find((m) => Number(m?.id) === microId) || null
      : null;

  const microNome =
    microEncontrado?.nome ||
    sessao?.microcicloNome ||
    sessao?.microciclo_nome ||
    "Não informado";
  const microInicio =
    microEncontrado?.data_inicio ||
    microEncontrado?.dataInicio ||
    sessao?.microcicloDataInicio ||
    null;
  const microTermino =
    microEncontrado?.data_termino ||
    microEncontrado?.dataTermino ||
    sessao?.microcicloDataTermino ||
    null;

  const microInicioFmt = formatarDataRelatorio(microInicio);
  const microTerminoFmt = formatarDataRelatorio(microTermino);
  const microPeriodoFmt =
    microInicio && microTermino
      ? `${microInicioFmt} a ${microTerminoFmt}`
      : sessao?.microcicloPeriodo || "Período não informado";

  // 2. Localiza o Mesociclo pai a partir do relacionamento do Microciclo encontrado
  const mesoIdBruto =
    microEncontrado?.mesociclo ??
    microEncontrado?.mesociclo_id ??
    microEncontrado?.mesocicloId ??
    sessao?.mesocicloId ??
    sessao?.mesociclo ??
    null;
  const mesoId =
    mesoIdBruto !== null && mesoIdBruto !== undefined && mesoIdBruto !== ""
      ? Number(mesoIdBruto)
      : null;

  const mesoEncontrado =
    mesoId !== null && Number.isFinite(mesoId)
      ? mesociclos.find((m) => Number(m?.id) === mesoId) || null
      : null;

  const mesoNome =
    mesoEncontrado?.nome ||
    microEncontrado?.mesocicloNome ||
    microEncontrado?.mesociclo_nome ||
    sessao?.mesocicloNome ||
    "Não informado";
  const mesoInicio =
    mesoEncontrado?.data_inicio ||
    mesoEncontrado?.dataInicio ||
    microEncontrado?.mesocicloDataInicio ||
    null;
  const mesoTermino =
    mesoEncontrado?.data_termino ||
    mesoEncontrado?.dataTermino ||
    microEncontrado?.mesocicloDataTermino ||
    null;

  const mesoInicioFmt = formatarDataRelatorio(mesoInicio);
  const mesoTerminoFmt = formatarDataRelatorio(mesoTermino);
  const mesoPeriodoFmt =
    mesoInicio && mesoTermino
      ? `${mesoInicioFmt} a ${mesoTerminoFmt}`
      : "Período não informado";

  // 3. Localiza o Macrociclo pai a partir do relacionamento do Mesociclo encontrado
  const macroIdBruto =
    mesoEncontrado?.macrociclo ??
    mesoEncontrado?.macrociclo_id ??
    mesoEncontrado?.macrocicloId ??
    microEncontrado?.macrociclo ??
    microEncontrado?.macrocicloId ??
    sessao?.macrocicloId ??
    sessao?.macrociclo ??
    null;
  const macroId =
    macroIdBruto !== null && macroIdBruto !== undefined && macroIdBruto !== ""
      ? Number(macroIdBruto)
      : null;

  const macroEncontrado =
    macroId !== null && Number.isFinite(macroId)
      ? macrociclos.find((m) => Number(m?.id) === macroId) || null
      : null;

  const macroNome =
    macroEncontrado?.nome ||
    mesoEncontrado?.macrocicloNome ||
    microEncontrado?.macrocicloNome ||
    microEncontrado?.macrociclo_nome ||
    sessao?.macrocicloNome ||
    "Não informado";
  const macroCodigo = macroEncontrado?.codigo || null;
  const macroInicio =
    macroEncontrado?.data_inicio ||
    macroEncontrado?.dataInicio ||
    microEncontrado?.macrocicloDataInicio ||
    null;
  const macroTermino =
    macroEncontrado?.data_termino ||
    macroEncontrado?.dataTermino ||
    microEncontrado?.macrocicloDataTermino ||
    null;

  const macroInicioFmt = formatarDataRelatorio(macroInicio);
  const macroTerminoFmt = formatarDataRelatorio(macroTermino);
  const macroPeriodoFmt =
    macroInicio && macroTermino
      ? `${macroInicioFmt} a ${macroTerminoFmt}`
      : "Período não informado";

  return {
    macrociclo: {
      id: macroEncontrado?.id ?? macroId,
      codigo: macroCodigo,
      nome: macroNome,
      dataInicio: macroInicio,
      dataTermino: macroTermino,
      dataInicioFormatada: macroInicioFmt,
      dataTerminoFormatada: macroTerminoFmt,
      periodoFormatado: macroPeriodoFmt,
      disponivel: macroNome !== "Não informado",
    },
    mesociclo: {
      id: mesoEncontrado?.id ?? mesoId,
      nome: mesoNome,
      dataInicio: mesoInicio,
      dataTermino: mesoTermino,
      dataInicioFormatada: mesoInicioFmt,
      dataTerminoFormatada: mesoTerminoFmt,
      periodoFormatado: mesoPeriodoFmt,
      disponivel: mesoNome !== "Não informado",
    },
    microciclo: {
      id: microEncontrado?.id ?? microId,
      nome: microNome,
      dataInicio: microInicio,
      dataTermino: microTermino,
      dataInicioFormatada: microInicioFmt,
      dataTerminoFormatada: microTerminoFmt,
      periodoFormatado: microPeriodoFmt,
      disponivel: microNome !== "Não informado",
    },
  };
}

/**
 * 1. Gráfico de Atividades da Sessão
 * Consolida exclusivamente as atividades realizadas na sessão selecionada.
 */
export function agruparAtividadesSessao(atividades = []) {
  const agrupado = {};
  let totalMinutos = 0;
  let totalExecucoes = 0;

  for (const [idx, atv] of atividades.entries()) {
    if (!atv || typeof atv !== "object") continue;

    const codigo = String(atv.codigo || "").trim().toUpperCase();
    const nome = String(atv.nome || atv.atividade_ssp || "").trim();
    const rotuloBase =
      atv.atividade_ssp ||
      (codigo && nome ? `${codigo} | ${nome}` : nome || codigo || `Atividade ${idx + 1}`);
    const chave = (codigo || nome || `atv-${idx}`).toLowerCase();

    const tempo = Math.max(0, Number(atv.tempo ?? atv.minutos ?? 0) || 0);
    totalMinutos += tempo;
    totalExecucoes += 1;

    if (!agrupado[chave]) {
      agrupado[chave] = {
        id: `atv-${chave}`,
        codigo,
        nome: rotuloBase,
        tipologia: String(atv.tipologia || "").trim(),
        tipoSsp: String(atv.tipo_ssp || "").trim(),
        minutos: 0,
        execucoes: 0,
      };
    }

    agrupado[chave].minutos += tempo;
    agrupado[chave].execucoes += 1;
  }

  const itens = Object.values(agrupado)
    .map((item) => ({
      ...item,
      valorPrincipal: totalMinutos > 0 ? item.minutos : item.execucoes,
      percentual:
        totalMinutos > 0
          ? Number(((item.minutos / totalMinutos) * 100).toFixed(1))
          : totalExecucoes > 0
            ? Number(((item.execucoes / totalExecucoes) * 100).toFixed(1))
            : 0,
    }))
    .sort((a, b) => {
      if (b.minutos !== a.minutos) return b.minutos - a.minutos;
      if (b.execucoes !== a.execucoes) return b.execucoes - a.execucoes;
      return a.nome.localeCompare(b.nome, "pt-BR");
    });

  return {
    titulo: "Atividades da Sessão",
    subtitulo: "Tempo e execuções por atividade realizada na sessão",
    unidade: totalMinutos > 0 ? "min" : "exec",
    totalMinutos,
    totalExecucoes,
    itens,
    estadoVazio: itens.length === 0,
    mensagemVazio: "Nenhuma atividade registrada nesta sessão.",
  };
}

/**
 * Função genérica para agrupar listas de atributos/categorias associadas às atividades da sessão
 * (Momentos de Jogo, Fases de Jogo, Atributos Técnicos, Comportamentos de Treino).
 */
function agruparListaCaracteristicaSessao(
  atividades = [],
  campoAtividade,
  {
    titulo,
    subtitulo,
    mensagemVazio,
    normalizarNome = (n) => n,
    somenteComTempo = false,
  }
) {
  const agrupado = {};
  let totalMinutos = 0;
  let totalExecucoes = 0;

  for (const atv of atividades) {
    if (!atv || typeof atv !== "object") continue;

    const lista = Array.isArray(atv[campoAtividade]) ? atv[campoAtividade] : [];
    if (lista.length === 0) continue;

    const tempoAtividade = Math.max(0, Number(atv.tempo ?? atv.minutos ?? 0) || 0);

    for (const itemBruto of lista) {
      let nomeOriginal = "";
      let minutosItem = tempoAtividade;

      if (itemBruto && typeof itemBruto === "object") {
        nomeOriginal = String(
          itemBruto.nome ||
            itemBruto.rotulo ||
            itemBruto.fase_jogo ||
            itemBruto.momento_jogo ||
            itemBruto.codigo ||
            ""
        ).trim();
        if (itemBruto.minutos !== undefined || itemBruto.tempo !== undefined) {
          minutosItem = Math.max(
            0,
            Number(itemBruto.minutos ?? itemBruto.tempo ?? 0) || 0
          );
        }
      } else {
        nomeOriginal = String(itemBruto || "").trim();
      }

      if (!nomeOriginal) continue;
      if (somenteComTempo && minutosItem <= 0 && tempoAtividade <= 0) {
        // Ainda contabiliza a fase com o tempo disponível ou ocorrência caso a atividade não tenha tempo preenchido
      }

      const nomeExibicao = normalizarNome(nomeOriginal);
      const chave = nomeExibicao.toLowerCase();

      if (!agrupado[chave]) {
        agrupado[chave] = {
          id: `${campoAtividade}-${chave.replace(/\s+/g, "-")}`,
          codigo: nomeOriginal,
          nome: nomeExibicao,
          minutos: 0,
          execucoes: 0,
        };
      }

      agrupado[chave].minutos += minutosItem;
      agrupado[chave].execucoes += 1;
      totalMinutos += minutosItem;
      totalExecucoes += 1;
    }
  }

  const itens = Object.values(agrupado)
    .map((item) => ({
      ...item,
      valorPrincipal: totalMinutos > 0 ? item.minutos : item.execucoes,
      percentual:
        totalMinutos > 0
          ? Number(((item.minutos / totalMinutos) * 100).toFixed(1))
          : totalExecucoes > 0
            ? Number(((item.execucoes / totalExecucoes) * 100).toFixed(1))
            : 0,
    }))
    .sort((a, b) => {
      if (b.minutos !== a.minutos) return b.minutos - a.minutos;
      if (b.execucoes !== a.execucoes) return b.execucoes - a.execucoes;
      return a.nome.localeCompare(b.nome, "pt-BR");
    });

  return {
    titulo,
    subtitulo,
    unidade: totalMinutos > 0 ? "min" : "exec",
    totalMinutos,
    totalExecucoes,
    itens,
    estadoVazio: itens.length === 0,
    mensagemVazio,
  };
}

/**
 * 2. Gráfico de Momento de Jogo da Sessão
 */
export function agruparMomentosJogoSessao(atividades = []) {
  return agruparListaCaracteristicaSessao(atividades, "momentos_jogo", {
    titulo: "Momento de Jogo",
    subtitulo: "Tempo dedicado a cada momento de jogo na sessão",
    mensagemVazio: "Nenhum momento de jogo registrado nesta sessão.",
    normalizarNome: (nome) => MAPA_MOMENTOS_EXIBICAO[nome] || nome,
  });
}

/**
 * 3. Gráfico de Fases de Jogo da Sessão
 */
export function agruparFasesJogoSessao(atividades = []) {
  return agruparListaCaracteristicaSessao(atividades, "fases_jogo", {
    titulo: "Fases de Jogo",
    subtitulo: "Tempo em minutos dedicado a cada fase de jogo na sessão",
    mensagemVazio: "Nenhuma fase de jogo registrada nesta sessão.",
    somenteComTempo: true,
  });
}

/**
 * 4. Gráfico de Atributo Técnico da Sessão
 */
export function agruparAtributosTecnicosSessao(atividades = []) {
  return agruparListaCaracteristicaSessao(atividades, "atributos_tecnicos", {
    titulo: "Atributo Técnico",
    subtitulo: "Atributos técnicos trabalhados nas atividades da sessão",
    mensagemVazio: "Nenhum atributo técnico registrado nesta sessão.",
  });
}

/**
 * 5. Gráfico de Espaço de Treino da Sessão
 */
export function agruparEspacosTreinoSessao(atividades = []) {
  const agrupado = {};
  let totalMinutos = 0;
  let totalExecucoes = 0;

  for (const atv of atividades) {
    if (!atv || typeof atv !== "object") continue;

    const dimensao = resolverDimensaoEspacoAtividade(atv);
    if (!dimensao || dimensao === "Não Definido") continue;

    const tempo = Math.max(0, Number(atv.tempo ?? atv.minutos ?? 0) || 0);
    const areaJogador = Number(atv.area_por_jogador);
    const chave = dimensao.toLowerCase();

    if (!agrupado[chave]) {
      agrupado[chave] = {
        id: `espaco-${chave}`,
        codigo: dimensao.slice(0, 3).toUpperCase(),
        nome: `Espaço ${dimensao}`,
        dimensao,
        minutos: 0,
        execucoes: 0,
        somaArea: 0,
        contagemArea: 0,
      };
    }

    agrupado[chave].minutos += tempo;
    agrupado[chave].execucoes += 1;
    if (Number.isFinite(areaJogador) && areaJogador > 0) {
      agrupado[chave].somaArea += areaJogador;
      agrupado[chave].contagemArea += 1;
    }

    totalMinutos += tempo;
    totalExecucoes += 1;
  }

  const itens = Object.values(agrupado)
    .map((item) => {
      const mediaArea =
        item.contagemArea > 0
          ? Math.round(item.somaArea / item.contagemArea)
          : null;
      return {
        id: item.id,
        codigo: item.codigo,
        nome: mediaArea ? `${item.nome} (~${mediaArea}m²/jog)` : item.nome,
        rotuloCurto: item.dimensao,
        minutos: item.minutos,
        execucoes: item.execucoes,
        mediaAreaPorJogador: mediaArea,
        valorPrincipal: totalMinutos > 0 ? item.minutos : item.execucoes,
        percentual:
          totalMinutos > 0
            ? Number(((item.minutos / totalMinutos) * 100).toFixed(1))
            : totalExecucoes > 0
              ? Number(((item.execucoes / totalExecucoes) * 100).toFixed(1))
              : 0,
      };
    })
    .sort((a, b) => {
      if (b.minutos !== a.minutos) return b.minutos - a.minutos;
      return b.execucoes - a.execucoes;
    });

  return {
    titulo: "Espaço de Treino",
    subtitulo: "Dimensões de espaço utilizadas nas atividades da sessão",
    unidade: totalMinutos > 0 ? "min" : "exec",
    totalMinutos,
    totalExecucoes,
    itens,
    estadoVazio: itens.length === 0,
    mensagemVazio: "Nenhum espaço de treino dimensionado nesta sessão.",
  };
}

/**
 * 6. Gráfico de Comportamento de Treino da Sessão
 */
export function agruparComportamentosTreinoSessao(atividades = []) {
  return agruparListaCaracteristicaSessao(atividades, "comportamentos", {
    titulo: "Comportamento de Treino",
    subtitulo: "Comportamentos e princípios táticos trabalhados na sessão",
    mensagemVazio: "Nenhum comportamento de treino registrado nesta sessão.",
  });
}

/**
 * Calcula o tempo líquido (RN03: atividades de mesma ordem contam pelo maior tempo)
 * e o tempo total bruto das atividades da sessão.
 */
function calcularMetricasTempoSessao(atividades = []) {
  const temposPorOrdem = {};
  let tempoTotalBruto = 0;

  for (const [idx, atv] of atividades.entries()) {
    const tempo = Math.max(0, Number(atv?.tempo ?? atv?.minutos ?? 0) || 0);
    tempoTotalBruto += tempo;

    const ordem =
      atv?.ordem !== undefined && atv?.ordem !== null && atv?.ordem !== ""
        ? String(atv.ordem)
        : `seq-${idx + 1}`;
    if (!(ordem in temposPorOrdem) || tempo > temposPorOrdem[ordem]) {
      temposPorOrdem[ordem] = tempo;
    }
  }

  const tempoLiquido = Object.values(temposPorOrdem).reduce(
    (acc, t) => acc + t,
    0
  );

  return {
    tempoTotalBruto,
    tempoLiquido,
    numeroExecucoes: Object.keys(temposPorOrdem).length,
  };
}

/**
 * Gera o nome padronizado do arquivo PDF identificando a sessão selecionada.
 * Exemplo: `relatorio_sessao_1.pdf`
 */
export function gerarNomeArquivoPdfSessao(sessao) {
  const identificadorBruto =
    sessao?.id ?? sessao?.sequencia ?? sessao?.codigo ?? sessao?.nome ?? "1";
  const identificadorLimpo = String(identificadorBruto)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return `relatorio_sessao_${identificadorLimpo || "1"}.pdf`;
}

/**
 * [US25] Consulta os dados consolidados e gráficos do relatório da sessão diretamente da API backend.
 */
export async function buscarDadosRelatorioSessaoApi(sessaoId) {
  if (!sessaoId) return null;
  const resp = await api.get(`/treinos/sessoes/${sessaoId}/relatorio/`);
  return resp?.data || null;
}

/**
 * [PONTO DE INTEGRAÇÃO COM O BACKEND]
 * Obtém e estrutura todos os dados necessários para o relatório PDF individual de uma sessão.
 *
 * - Busca dinamicamente os dados consolidados no backend (/treinos/sessoes/<id>/relatorio/).
 * - Mantém fallback local completo caso o endpoint esteja indisponível.
 * - Consolida exclusivamente os dados da sessão selecionada (sem misturar outras sessões).
 */
export async function montarDadosRelatorioSessao(
  sessao,
  {
    microciclos = [],
    mesociclos = [],
    macrociclos = [],
    dadosRelatorioApi = null,
  } = {}
) {
  if (!sessao || typeof sessao !== "object") {
    throw new Error("Sessão inválida para geração do relatório.");
  }

  let listaMicros = Array.isArray(microciclos) ? [...microciclos] : [];
  let listaMesos = Array.isArray(mesociclos) ? [...mesociclos] : [];
  let listaMacros = Array.isArray(macrociclos) ? [...macrociclos] : [];
  let atividadesSessao = Array.isArray(sessao.atividades)
    ? [...sessao.atividades]
    : [];

  let dadosRelatorioApiAtual = dadosRelatorioApi;
  if (!dadosRelatorioApiAtual && sessao?.id) {
    try {
      const retornoApi = await buscarDadosRelatorioSessaoApi(sessao.id);
      if (retornoApi) {
        dadosRelatorioApiAtual = retornoApi;
        if (
          Array.isArray(retornoApi.sessao?.atividades) &&
          retornoApi.sessao.atividades.length > 0 &&
          atividadesSessao.length === 0
        ) {
          atividadesSessao = retornoApi.sessao.atividades;
        }
      }
    } catch {
      // Segue com o fallback local
    }
  }

  // Caso as atividades da sessão ou os ciclos superiores ainda não estejam carregados em memória,
  // tenta consultar os endpoints existentes do backend de forma transparente.
  const precisaBuscarAtividades =
    atividadesSessao.length === 0 && sessao.id !== undefined && sessao.id !== null;
  const precisaBuscarCiclos =
    !dadosRelatorioApiAtual?.periodizacao &&
    (listaMesos.length === 0 || listaMacros.length === 0 || listaMicros.length === 0);

  if (precisaBuscarAtividades || precisaBuscarCiclos) {
    try {
      const requisicoes = [];

      if (precisaBuscarAtividades) {
        requisicoes.push(
          api
            .get("/treinos/atividades-sessao/", { params: { sessao: sessao.id } })
            .then((r) => {
              if (Array.isArray(r?.data) && r.data.length > 0) {
                // Filtra estritamente pela sessão selecionada por segurança
                atividadesSessao = r.data.filter(
                  (a) => String(a.sessao ?? a.sessao_id ?? sessao.id) === String(sessao.id)
                );
              }
            })
            .catch(() => {})
        );
      }

      if (listaMicros.length === 0) {
        requisicoes.push(
          api
            .get("/ciclos/microciclos/")
            .then((r) => {
              if (Array.isArray(r?.data) && r.data.length > 0) {
                listaMicros = r.data;
              }
            })
            .catch(() => {})
        );
      }

      if (listaMesos.length === 0) {
        requisicoes.push(
          api
            .get("/ciclos/mesociclos/")
            .then((r) => {
              if (Array.isArray(r?.data) && r.data.length > 0) {
                listaMesos = r.data;
              }
            })
            .catch(() => {})
        );
      }

      if (listaMacros.length === 0) {
        requisicoes.push(
          api
            .get("/ciclos/macrociclos/")
            .then((r) => {
              if (Array.isArray(r?.data) && r.data.length > 0) {
                listaMacros = r.data;
              }
            })
            .catch(() => {})
        );
      }

      await Promise.all(requisicoes);
    } catch {
      // Segue com os dados já disponíveis no estado local
    }
  }

  // Também verifica o localStorage da sessão específica caso atividadesSessao ainda esteja vazia
  if (atividadesSessao.length === 0) {
    try {
      const salvas = localStorage.getItem("futboard_sessoes");
      if (salvas) {
        const listaSalva = JSON.parse(salvas);
        const sessaoSalva = Array.isArray(listaSalva)
          ? listaSalva.find((s) => String(s?.id) === String(sessao.id))
          : null;
        if (Array.isArray(sessaoSalva?.atividades) && sessaoSalva.atividades.length > 0) {
          atividadesSessao = sessaoSalva.atividades;
        }
      }
    } catch {
      // Ignora erro de leitura do localStorage
    }
  }

  // Flag opcional de validação visual (desativada por padrão para não exibir dados fictícios em sessões reais)
  let usandoMockValidacao = false;
  try {
    if (
      atividadesSessao.length === 0 &&
      localStorage.getItem("futboard_usar_mock_relatorio") === "true"
    ) {
      atividadesSessao = MOCK_ATIVIDADES_VALIDACAO_RELATORIO;
      usandoMockValidacao = true;
    }
  } catch {
    usandoMockValidacao = false;
  }

  // Ordena as atividades da sessão por ordem crescente
  const atividadesOrdenadas = [...atividadesSessao].sort((a, b) => {
    const ordemA = Number(a?.ordem) || 999;
    const ordemB = Number(b?.ordem) || 999;
    return ordemA - ordemB;
  });

  const periodizacao =
    dadosRelatorioApiAtual?.periodizacao?.macrociclo &&
    dadosRelatorioApiAtual?.periodizacao?.mesociclo &&
    dadosRelatorioApiAtual?.periodizacao?.microciclo
      ? {
          macrociclo: {
            ...dadosRelatorioApiAtual.periodizacao.macrociclo,
            dataInicioFormatada: formatarDataRelatorio(
              dadosRelatorioApiAtual.periodizacao.macrociclo.data_inicio ||
                dadosRelatorioApiAtual.periodizacao.macrociclo.dataInicio
            ),
            dataTerminoFormatada: formatarDataRelatorio(
              dadosRelatorioApiAtual.periodizacao.macrociclo.data_termino ||
                dadosRelatorioApiAtual.periodizacao.macrociclo.dataTermino
            ),
            periodoFormatado:
              (dadosRelatorioApiAtual.periodizacao.macrociclo.data_inicio ||
                dadosRelatorioApiAtual.periodizacao.macrociclo.dataInicio) &&
              (dadosRelatorioApiAtual.periodizacao.macrociclo.data_termino ||
                dadosRelatorioApiAtual.periodizacao.macrociclo.dataTermino)
                ? `${formatarDataRelatorio(
                    dadosRelatorioApiAtual.periodizacao.macrociclo.data_inicio ||
                      dadosRelatorioApiAtual.periodizacao.macrociclo.dataInicio
                  )} a ${formatarDataRelatorio(
                    dadosRelatorioApiAtual.periodizacao.macrociclo.data_termino ||
                      dadosRelatorioApiAtual.periodizacao.macrociclo.dataTermino
                  )}`
                : "Período não informado",
            disponivel: Boolean(dadosRelatorioApiAtual.periodizacao.macrociclo.nome),
          },
          mesociclo: {
            ...dadosRelatorioApiAtual.periodizacao.mesociclo,
            dataInicioFormatada: formatarDataRelatorio(
              dadosRelatorioApiAtual.periodizacao.mesociclo.data_inicio ||
                dadosRelatorioApiAtual.periodizacao.mesociclo.dataInicio
            ),
            dataTerminoFormatada: formatarDataRelatorio(
              dadosRelatorioApiAtual.periodizacao.mesociclo.data_termino ||
                dadosRelatorioApiAtual.periodizacao.mesociclo.dataTermino
            ),
            periodoFormatado:
              (dadosRelatorioApiAtual.periodizacao.mesociclo.data_inicio ||
                dadosRelatorioApiAtual.periodizacao.mesociclo.dataInicio) &&
              (dadosRelatorioApiAtual.periodizacao.mesociclo.data_termino ||
                dadosRelatorioApiAtual.periodizacao.mesociclo.dataTermino)
                ? `${formatarDataRelatorio(
                    dadosRelatorioApiAtual.periodizacao.mesociclo.data_inicio ||
                      dadosRelatorioApiAtual.periodizacao.mesociclo.dataInicio
                  )} a ${formatarDataRelatorio(
                    dadosRelatorioApiAtual.periodizacao.mesociclo.data_termino ||
                      dadosRelatorioApiAtual.periodizacao.mesociclo.dataTermino
                  )}`
                : "Período não informado",
            disponivel: Boolean(dadosRelatorioApiAtual.periodizacao.mesociclo.nome),
          },
          microciclo: {
            ...dadosRelatorioApiAtual.periodizacao.microciclo,
            dataInicioFormatada: formatarDataRelatorio(
              dadosRelatorioApiAtual.periodizacao.microciclo.data_inicio ||
                dadosRelatorioApiAtual.periodizacao.microciclo.dataInicio
            ),
            dataTerminoFormatada: formatarDataRelatorio(
              dadosRelatorioApiAtual.periodizacao.microciclo.data_termino ||
                dadosRelatorioApiAtual.periodizacao.microciclo.dataTermino
            ),
            periodoFormatado:
              (dadosRelatorioApiAtual.periodizacao.microciclo.data_inicio ||
                dadosRelatorioApiAtual.periodizacao.microciclo.dataInicio) &&
              (dadosRelatorioApiAtual.periodizacao.microciclo.data_termino ||
                dadosRelatorioApiAtual.periodizacao.microciclo.dataTermino)
                ? `${formatarDataRelatorio(
                    dadosRelatorioApiAtual.periodizacao.microciclo.data_inicio ||
                      dadosRelatorioApiAtual.periodizacao.microciclo.dataInicio
                  )} a ${formatarDataRelatorio(
                    dadosRelatorioApiAtual.periodizacao.microciclo.data_termino ||
                      dadosRelatorioApiAtual.periodizacao.microciclo.dataTermino
                  )}`
                : "Período não informado",
            disponivel: Boolean(dadosRelatorioApiAtual.periodizacao.microciclo.nome),
          },
        }
      : resolverHierarquiaPeriodizacao(sessao, {
          microciclos: listaMicros,
          mesociclos: listaMesos,
          macrociclos: listaMacros,
        });

  const metricasTempo = calcularMetricasTempoSessao(atividadesOrdenadas);
  const codigoSessao =
    sessao.codigo ||
    (sessao.sequencia
      ? `SES-${sessao.sequencia < 10 ? `0${sessao.sequencia}` : sessao.sequencia}`
      : `SES-${sessao.id ?? "01"}`);

  const agora = new Date();
  const dataHoraGeracao = `${agora.toLocaleDateString("pt-BR")} às ${agora
    .toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;

  const graficosApi = dadosRelatorioApiAtual?.graficos;
  const graficos = graficosApi
    ? {
        atividades: graficosApi.atividades,
        momentosJogo: graficosApi.momentosJogo || graficosApi.momentos_jogo,
        fasesJogo: graficosApi.fasesJogo || graficosApi.fases_jogo,
        atributosTecnicos: graficosApi.atributosTecnicos || graficosApi.atributos_tecnicos,
        espacosTreino: graficosApi.espacosTreino || graficosApi.espacos_treino,
        comportamentosTreino: graficosApi.comportamentosTreino || graficosApi.comportamentos_treino,
      }
    : {
        atividades: agruparAtividadesSessao(atividadesOrdenadas),
        momentosJogo: agruparMomentosJogoSessao(atividadesOrdenadas),
        fasesJogo: agruparFasesJogoSessao(atividadesOrdenadas),
        atributosTecnicos: agruparAtributosTecnicosSessao(atividadesOrdenadas),
        espacosTreino: agruparEspacosTreinoSessao(atividadesOrdenadas),
        comportamentosTreino: agruparComportamentosTreinoSessao(atividadesOrdenadas),
      };

  return {
    nomeArquivo: gerarNomeArquivoPdfSessao(sessao),
    geradoEm: dataHoraGeracao,
    usandoMockValidacao,
    sessao: {
      id: sessao.id,
      codigo: codigoSessao,
      sequencia: sessao.sequencia ?? null,
      nome: sessao.nome || `Sessão ${sessao.id ?? ""}`.trim(),
      data: sessao.data || null,
      dataFormatada: formatarDataRelatorio(sessao.data),
      mes: resolverMesSessao(sessao),
      totalAtividades: atividadesOrdenadas.length,
      numeroExecucoes: metricasTempo.numeroExecucoes,
      tempoTotalBruto: metricasTempo.tempoTotalBruto,
      tempoLiquido: metricasTempo.tempoLiquido,
      atividades: atividadesOrdenadas.map((atv, idx) => ({
        id: atv.id ?? `atv-${idx}`,
        ordem: atv.ordem ?? idx + 1,
        codigo: String(atv.codigo || "").trim().toUpperCase(),
        nome: String(atv.nome || atv.atividade_ssp || `Atividade ${idx + 1}`).trim(),
        atividadeSsp:
          atv.atividade_ssp ||
          (atv.sigla_tipologia && atv.nome
            ? `${atv.sigla_tipologia} | ${atv.nome}`
            : atv.nome || `Atividade ${idx + 1}`),
        tipologia: String(atv.tipologia || "Não informada").trim(),
        siglaTipologia: String(atv.sigla_tipologia || "").trim(),
        tipoSsp: String(atv.tipo_ssp || "Não informado").trim(),
        tempo: Math.max(0, Number(atv.tempo ?? atv.minutos ?? 0) || 0),
        dimensaoEspaco: resolverDimensaoEspacoAtividade(atv),
        areaPorJogador:
          atv.area_por_jogador !== null && atv.area_por_jogador !== undefined
            ? Math.round(Number(atv.area_por_jogador))
            : null,
        momentosJogo: Array.isArray(atv.momentos_jogo) ? atv.momentos_jogo : [],
        fasesJogo: Array.isArray(atv.fases_jogo) ? atv.fases_jogo : [],
        atributosTecnicos: Array.isArray(atv.atributos_tecnicos)
          ? atv.atributos_tecnicos
          : [],
        comportamentos: Array.isArray(atv.comportamentos) ? atv.comportamentos : [],
      })),
    },
    periodizacao,
    graficos,
  };
}
