import React from "react";

const STATUS_STYLES = {
  em_andamento: {
    label: "Em andamento",
    badge: "bg-[#C6E96B]/40 text-[#0E3A29]",
    barra: "bg-[#0E3A29]",
  },
  planejado: {
    label: "Planejado",
    badge: "bg-[#0E3A29]/10 text-[#0E3A29]",
    barra: "bg-[#8A8D80]/50",
  },
  concluido: {
    label: "Encerrado",
    badge: "bg-[#E4DFD2] text-[#10281E]",
    barra: "bg-[#8A8D80]/50",
  },
};

const MESES = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

function formatarDiaMes(isoDate) {
  if (!isoDate) return "—";
  const partes = String(isoDate).split("-");
  if (partes.length !== 3) return isoDate;
  return `${partes[2]} ${MESES[Number(partes[1]) - 1]}`;
}

function calcularProgresso(dataInicio, dataTermino) {
  const inicio = new Date(`${dataInicio}T00:00:00`);
  const fim = new Date(`${dataTermino}T23:59:59`);
  const total = fim - inicio;
  if (!total || total <= 0) return 0;
  const decorrido = Date.now() - inicio;
  return Math.min(100, Math.max(0, Math.round((decorrido / total) * 100)));
}

export default function MesocicloCard({ mesociclo, onEditMesociclo }) {
  const estiloStatus =
    STATUS_STYLES[mesociclo.status] || STATUS_STYLES.planejado;
  const emAndamento = mesociclo.status === "em_andamento";
  const progresso = emAndamento
    ? calcularProgresso(mesociclo.dataInicio, mesociclo.dataTermino)
    : 0;

  return (
    <button
      type="button"
      onClick={() => onEditMesociclo(mesociclo)}
      aria-label={`Editar ${mesociclo.nome}`}
      className="fb-card block w-full border-[#E4DFD2] bg-[#FFFFFF] px-5 py-4 text-left transition hover:border-[#0E3A29]/40 hover:shadow-xs focus:outline-none focus:ring-2 focus:ring-[#C6E96B]/50 sm:px-6"
    >
      <div className="flex items-stretch gap-4">
        {/* Barra lateral de status */}
        <span
          aria-hidden="true"
          className={`w-[3px] shrink-0 rounded-full ${estiloStatus.barra}`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="font-display text-lg font-bold tracking-tight text-[#10281E]">
              {mesociclo.nome}
            </h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${estiloStatus.badge}`}
            >
              {estiloStatus.label}
            </span>
          </div>

          <p className="mt-1 text-sm text-[#8A8D80]">
            {formatarDiaMes(mesociclo.dataInicio)} –{" "}
            {formatarDiaMes(mesociclo.dataTermino)} · {mesociclo.semanas}{" "}
            {mesociclo.semanas === 1 ? "semana" : "semanas"} ·{" "}
            {mesociclo.totalMicrociclos}{" "}
            {mesociclo.totalMicrociclos === 1 ? "microciclo" : "microciclos"}
          </p>

          {/* Progresso do mesociclo em andamento */}
          {emAndamento && (
            <div className="mt-3 flex items-center gap-3">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#E4DFD2]">
                <div
                  className="h-full rounded-full bg-[#0E3A29]"
                  style={{ width: `${progresso}%` }}
                />
              </div>
              <span className="font-mono text-[10px] text-[#8A8D80]">
                {progresso}%
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
