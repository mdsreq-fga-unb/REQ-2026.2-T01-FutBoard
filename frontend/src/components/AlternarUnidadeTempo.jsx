import React from "react";

const OPCOES_UNIDADE = [
  { valor: "minutos", rotulo: "Min", descricao: "Tempo absoluto em minutos" },
  { valor: "percentual", rotulo: "%", descricao: "Tempo relativo em porcentagem" },
];

/**
 * Alternador da unidade de tempo dos gráficos do Dashboard (US26 / RF26).
 * Apenas troca a forma de exibição: não dispara nova consulta, então os
 * filtros de periodização permanecem aplicados.
 */
export default function AlternarUnidadeTempo({ valor = "minutos", onChange = () => {} }) {
  return (
    <div
      role="radiogroup"
      aria-label="Unidade de tempo dos gráficos"
      className="inline-flex items-stretch overflow-hidden rounded-xl border border-[#E4DFD2] bg-white"
    >
      {OPCOES_UNIDADE.map((opcao) => {
        const ativo = valor === opcao.valor;
        return (
          <button
            key={opcao.valor}
            type="button"
            role="radio"
            aria-checked={ativo}
            aria-label={opcao.descricao}
            title={opcao.descricao}
            onClick={() => onChange(opcao.valor)}
            className={`min-w-[56px] px-4 py-2 font-mono text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#C6E96B]/50 ${
              ativo
                ? "bg-[#0E3A29] text-white"
                : "text-[#10281E] hover:bg-[#F5F2EA]"
            }`}
          >
            {opcao.rotulo}
          </button>
        );
      })}
    </div>
  );
}
