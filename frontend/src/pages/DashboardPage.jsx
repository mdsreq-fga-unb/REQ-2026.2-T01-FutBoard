import MetricCard from "../components/MetricCard.jsx";

const metrics = [
  { label: "Sessões planejadas", value: "—" },
  { label: "Minutos de treino", value: "—" },
  { label: "Atividades cadastradas", value: "—" },
];

export default function DashboardPage() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-futboard-700">
          FutBoard
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Dashboard do treinador
        </h1>
        <p className="mt-2 text-slate-600">
          Planejamento e acompanhamento dos treinos da equipe.
        </p>
      </header>

      <section
        aria-label="Indicadores de treino"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <h2 className="font-semibold text-slate-800">Bem-vindo ao FutBoard</h2>
        <p className="mt-2 text-sm text-slate-600">
          Os indicadores serão preenchidos quando os dados de treino forem
          cadastrados.
        </p>
      </section>
    </main>
  );
}
