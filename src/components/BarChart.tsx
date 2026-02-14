import { max } from "d3-array";
import { scaleBand, scaleLinear } from "d3-scale";

export default function BarChart({
  data,
  height,
}: {
  data: Array<{ label: string; value: number }>;
  height: number;
}) {
  const width = 540;
  const padL = 60;
  const padR = 10;
  const padT = 10;
  const padB = 28;

  const innerW = width - padL - padR;
  const innerH = height - padT - padB;

  const x = scaleBand()
    .domain(data.map((d) => d.label))
    .range([0, innerW])
    .padding(0.15);

  const yMax = max(data, (d) => d.value) ?? 1;
  const y = scaleLinear().domain([0, yMax]).nice().range([innerH, 0]);

  // Show fewer x labels when there are lots (like years)
  const showEvery = data.length > 30 ? Math.ceil(data.length / 10) : 1;

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      <g transform={`translate(${padL},${padT})`}>
        {/* y axis ticks */}
        {y.ticks(4).map((t) => (
          <g key={t} transform={`translate(0,${y(t)})`}>
            <line x1={0} x2={innerW} y1={0} y2={0} stroke="#f0f0f0" />
            <text x={-10} y={4} textAnchor="end" fontSize={11} fill="#666">
              {t}
            </text>
          </g>
        ))}

        {/* bars */}
        {data.map((d) => (
          <rect
            key={d.label}
            x={x(d.label)}
            y={y(d.value)}
            width={x.bandwidth()}
            height={innerH - y(d.value)}
            fill="#2171b5"
          />
        ))}

        {/* x labels */}
        {data.map((d, i) => {
          if (i % showEvery !== 0) return null;
          const cx = (x(d.label) ?? 0) + x.bandwidth() / 2;
          return (
            <text
              key={d.label + ":x"}
              x={cx}
              y={innerH + 18}
              textAnchor="middle"
              fontSize={10}
              fill="#666"
            >
              {d.label}
            </text>
          );
        })}
      </g>
    </svg>
  );
}
