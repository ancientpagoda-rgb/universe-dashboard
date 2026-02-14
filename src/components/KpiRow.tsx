import type { UniverseData } from "../types";

function Kpi({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) {
  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
      <div style={{ fontSize: 12, color: "#666" }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 750, marginTop: 6 }}>{value}</div>
      {subtitle ? <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{subtitle}</div> : null}
    </div>
  );
}

export default function KpiRow({ data }: { data: UniverseData }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
      <Kpi title="Confirmed exoplanets" value={data.exoplanets.totalConfirmed.toLocaleString()} subtitle="NASA Exoplanet Archive" />
      <Kpi title="Host stars" value={data.exoplanets.totalHosts.toLocaleString()} subtitle="Planetary systems" />
      <Kpi title="Age of the universe" value={data.facts.find((f) => f.id === "age_universe")?.value ?? "—"} subtitle="Reference" />
      <Kpi title="Distance: Earth → Sun" value={data.facts.find((f) => f.id === "au")?.value ?? "—"} subtitle="1 AU" />
    </div>
  );
}
