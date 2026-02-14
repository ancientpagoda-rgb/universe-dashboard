import { useEffect, useState } from "react";
import KpiRow from "./components/KpiRow";
import BarChart from "./components/BarChart";
import type { UniverseData } from "./types";

export default function App() {
  const [data, setData] = useState<UniverseData | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/universe.json`)
      .then((r) => r.json())
      .then(setData);
  }, []);

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif", maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ margin: "0 0 6px" }}>Universe Dashboard</h1>
      <div style={{ color: "#555", marginBottom: 14 }}>
        Static astronomy dashboard • data refreshed daily • sources linked
      </div>

      <div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
        Updated: {data?.updatedAt ? new Date(data.updatedAt).toLocaleString() : "…"}
      </div>

      {data ? (
        <>
          <KpiRow data={data} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
            <section style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
              <h2 style={{ margin: "0 0 8px", fontSize: 16 }}>Exoplanet discoveries by year</h2>
              <BarChart
                height={260}
                data={data.exoplanets.byYear.map((d) => ({ label: String(d.year), value: d.count }))}
              />
              <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
                Source: <a href={data.exoplanets.sourceUrl} target="_blank" rel="noreferrer">NASA Exoplanet Archive</a>
              </div>
            </section>

            <section style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
              <h2 style={{ margin: "0 0 8px", fontSize: 16 }}>Discovery methods (top)</h2>
              <BarChart
                height={260}
                data={data.exoplanets.byMethod.slice(0, 10).map((d) => ({ label: d.method, value: d.count }))}
              />
              <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
                Source: <a href={data.exoplanets.sourceUrl} target="_blank" rel="noreferrer">NASA Exoplanet Archive</a>
              </div>
            </section>
          </div>

          <section style={{ border: "1px solid #eee", borderRadius: 12, padding: 12, marginTop: 14 }}>
            <h2 style={{ margin: "0 0 8px", fontSize: 16 }}>Key reference facts</h2>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {data.facts.map((f) => (
                <li key={f.id} style={{ marginBottom: 6 }}>
                  <b>{f.label}:</b> {f.value} {f.unit ?? ""}{" "}
                  <span style={{ color: "#666" }}>
                    (<a href={f.sourceUrl} target="_blank" rel="noreferrer">source</a>)
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : (
        <div>Loading…</div>
      )}
    </div>
  );
}
