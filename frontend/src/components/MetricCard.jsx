export default function MetricCard({ label, value }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-medium text-slate-500">{label}</h2>
      <p className="mt-3 text-3xl font-semibold text-futboard-800">{value}</p>
    </article>
  );
}
