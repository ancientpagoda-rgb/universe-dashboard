import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_PATH = path.resolve(__dirname, "../public/data/universe.json");

async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`fetch failed: ${r.status} ${url}`);
  return r.json();
}

const TAP_BASE = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync";
const sourceUrl = "https://exoplanetarchive.ipac.caltech.edu";

function tapUrl(query) {
  const u = new URL(TAP_BASE);
  u.searchParams.set("query", query);
  u.searchParams.set("format", "json");
  return u.toString();
}

async function main() {
  const updatedAt = new Date().toISOString();

  // Totals
  const totalQ = "select count(*) as n from ps where default_flag=1";
  const hostQ = "select count(distinct hostname) as n from ps where default_flag=1";
  const byYearQ = "select disc_year as year, count(*) as count from ps where default_flag=1 group by disc_year order by disc_year";
  const byMethodQ = "select discoverymethod as method, count(*) as count from ps where default_flag=1 group by discoverymethod order by count desc";

  const [totalRows, hostRows, byYearRows, byMethodRows] = await Promise.all([
    fetchJson(tapUrl(totalQ)),
    fetchJson(tapUrl(hostQ)),
    fetchJson(tapUrl(byYearQ)),
    fetchJson(tapUrl(byMethodQ)),
  ]);

  const totalConfirmed = Number(totalRows?.[0]?.n ?? 0);
  const totalHosts = Number(hostRows?.[0]?.n ?? 0);

  const byYear = (byYearRows ?? [])
    .filter((r) => r.year !== null)
    .map((r) => ({ year: Number(r.year), count: Number(r.count) }))
    .filter((r) => Number.isFinite(r.year) && Number.isFinite(r.count));

  const byMethod = (byMethodRows ?? [])
    .filter((r) => r.method)
    .map((r) => ({ method: String(r.method), count: Number(r.count) }))
    .filter((r) => Number.isFinite(r.count));

  // Curated facts (public, stable references). Keep as strings to preserve uncertainty formatting.
  const facts = [
    {
      id: "age_universe",
      label: "Age of the universe",
      value: "13.8 billion",
      unit: "years",
      sourceUrl: "https://map.gsfc.nasa.gov/universe/uni_age.html",
    },
    {
      id: "au",
      label: "Astronomical Unit (mean Earth–Sun distance)",
      value: "149,597,870",
      unit: "km",
      sourceUrl: "https://ssd.jpl.nasa.gov/astro_par.html",
    },
    {
      id: "c",
      label: "Speed of light (c)",
      value: "299,792,458",
      unit: "m/s",
      sourceUrl: "https://physics.nist.gov/cgi-bin/cuu/Value?c",
    },
    {
      id: "milkyway_diameter",
      label: "Milky Way diameter (approx.)",
      value: "~100,000",
      unit: "light-years",
      sourceUrl: "https://www.nasa.gov/solar-system/the-milky-way-galaxy/",
    },
  ];

  const payload = {
    updatedAt,
    exoplanets: {
      totalConfirmed,
      totalHosts,
      sourceUrl,
      byYear,
      byMethod,
    },
    facts,
  };

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(payload, null, 2));
  console.log("wrote", OUT_PATH);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
