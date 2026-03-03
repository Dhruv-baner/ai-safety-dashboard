import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer
} from "recharts"
import { MODELS, THRESHOLDS, ACCELERATION_STATS } from "../data/benchmarks"

type BenchmarkKey = "gpqa" | "mmlu" | "humaneval" | "swebench"

const BENCHMARK_META: Record<BenchmarkKey, { label: string; description: string; humanLine: number; dangerLine: number }> = {
  gpqa:      { label: "GPQA Diamond",    description: "PhD-level science reasoning", humanLine: THRESHOLDS.gpqa.humanExpert,      dangerLine: THRESHOLDS.gpqa.dangerous },
  mmlu:      { label: "MMLU",            description: "57-subject knowledge",         humanLine: THRESHOLDS.mmlu.humanExpert,      dangerLine: THRESHOLDS.mmlu.dangerous },
  humaneval: { label: "HumanEval",       description: "Python coding tasks",          humanLine: THRESHOLDS.humaneval.humanBaseline, dangerLine: THRESHOLDS.humaneval.dangerous },
  swebench:  { label: "SWE-bench",       description: "Real GitHub bug fixing",       humanLine: THRESHOLDS.swebench.seniorDev,    dangerLine: THRESHOLDS.swebench.dangerous },
}

// Build chart data — one point per model sorted by release date
function buildChartData(benchmark: BenchmarkKey) {
  return MODELS
    .filter(m => m.scores[benchmark] !== undefined)
    .sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime())
    .map(m => ({
      name: m.name,
      date: m.releaseDate.slice(0, 7), // "YYYY-MM"
      score: m.scores[benchmark],
      org: m.org,
      color: m.color,
    }))
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: "#111827", border: "1px solid #374151",
      padding: "10px 14px", fontSize: "0.8rem", fontFamily: "Courier New"
    }}>
      <div style={{ color: "#f9fafb", fontWeight: 700 }}>{d.name}</div>
      <div style={{ color: "#9ca3af" }}>{d.org} · {d.date}</div>
      <div style={{ color: "#f87171", marginTop: 4 }}>Score: {d.score}%</div>
    </div>
  )
}

export default function FrontierWatch() {
  const activeBenchmark: BenchmarkKey = "gpqa"
  const meta = BENCHMARK_META[activeBenchmark]
  const chartData = buildChartData(activeBenchmark)

  return (
    <div style={{ fontFamily: "Courier New, monospace" }}>

      {/* Stat blocks */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1rem", marginBottom: "2rem"
      }}>
        {ACCELERATION_STATS.map((s, i) => (
          <div key={i} style={{
            background: "#0f172a", border: "1px solid #1e3a5f",
            padding: "1.25rem", borderLeft: "3px solid #dc2626"
          }}>
            <div style={{ color: "#6b7280", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {s.label}
            </div>
            <div style={{ color: "#f1f5f9", fontSize: "1.4rem", fontWeight: 700, margin: "0.4rem 0" }}>
              {s.value}
            </div>
            <div style={{ color: "#94a3b8", fontSize: "0.7rem" }}>{s.sub}</div>
            <div style={{ color: "#ef4444", fontSize: "0.7rem", marginTop: "0.3rem" }}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Main chart */}
      <div style={{
        background: "#0f172a", border: "1px solid #1e293b", padding: "1.5rem", marginBottom: "2rem"
      }}>
        <div style={{ marginBottom: "1rem" }}>
          <h2 style={{ color: "#f1f5f9", fontSize: "0.95rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Capability Trajectory — {meta.label}
          </h2>
          <p style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: "0.25rem" }}>
            {meta.description} · Scores by model release date
          </p>
        </div>

        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#4b5563" tick={{ fill: "#6b7280", fontSize: 11, fontFamily: "Courier New" }} />
            <YAxis domain={[20, 100]} stroke="#4b5563" tick={{ fill: "#6b7280", fontSize: 11, fontFamily: "Courier New" }}
              tickFormatter={(v: number) => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />

            {/* Human expert threshold */}
            <ReferenceLine y={meta.humanLine} stroke="#f59e0b" strokeDasharray="6 3" label={{
              value: `Human Expert: ${meta.humanLine}%`, fill: "#f59e0b",
              fontSize: 10, fontFamily: "Courier New", position: "insideTopLeft"
            }} />

            {/* Danger threshold */}
            <ReferenceLine y={meta.dangerLine} stroke="#dc2626" strokeDasharray="4 2" label={{
              value: `Danger Threshold: ${meta.dangerLine}%`, fill: "#dc2626",
              fontSize: 10, fontFamily: "Courier New", position: "insideTopLeft"
            }} />

            <Line
              type="monotone" dataKey="score"
              stroke="#ef4444" strokeWidth={2}
              dot={(props: any) => {
                const { cx, cy, payload } = props
                return (
                  <circle key={payload.name} cx={cx} cy={cy} r={5}
                    fill={payload.color} stroke="#0f172a" strokeWidth={2} />
                )
              }}
              activeDot={{ r: 7, fill: "#ef4444" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Model table */}
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "1.5rem" }}>
        <h2 style={{ color: "#f1f5f9", fontSize: "0.95rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
          Model Comparison — All Benchmarks
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e293b" }}>
              {["Model", "Org", "Released", "GPQA ◆", "MMLU", "HumanEval", "SWE-bench"].map(h => (
                <th key={h} style={{ color: "#6b7280", textAlign: "left", padding: "0.5rem 0.75rem", fontWeight: 400, textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "0.08em" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...MODELS].sort((a, b) => (b.scores.gpqa ?? 0) - (a.scores.gpqa ?? 0)).map((m, i) => (
              <tr key={m.id} style={{ borderBottom: "1px solid #0f172a", background: i % 2 === 0 ? "#111827" : "transparent" }}>
                <td style={{ padding: "0.6rem 0.75rem", color: "#f1f5f9", fontWeight: 600 }}>
                  <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: m.color, marginRight: 8 }} />
                  {m.name}
                </td>
                <td style={{ padding: "0.6rem 0.75rem", color: "#9ca3af" }}>{m.org}</td>
                <td style={{ padding: "0.6rem 0.75rem", color: "#9ca3af" }}>{m.releaseDate.slice(0, 7)}</td>
                {(["gpqa", "mmlu", "humaneval", "swebench"] as BenchmarkKey[]).map(b => {
                  const score = m.scores[b]
                  const threshold = THRESHOLDS[b].dangerous
                  const isAboveDanger = score !== undefined && score >= threshold
                  const isAboveHuman = score !== undefined && score >= (b === "gpqa" ? THRESHOLDS.gpqa.humanExpert : THRESHOLDS.mmlu.humanExpert)
                  return (
                    <td key={b} style={{
                      padding: "0.6rem 0.75rem",
                      color: isAboveDanger ? "#ef4444" : isAboveHuman ? "#f59e0b" : "#d1d5db",
                      fontWeight: isAboveDanger ? 700 : 400
                    }}>
                      {score !== undefined ? `${score}%` : "—"}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: "0.75rem", display: "flex", gap: "1.5rem" }}>
          <span style={{ fontSize: "0.7rem", color: "#ef4444" }}>■ Above danger threshold</span>
          <span style={{ fontSize: "0.7rem", color: "#f59e0b" }}>■ Above human expert</span>
          <span style={{ fontSize: "0.7rem", color: "#d1d5db" }}>■ Below human expert</span>
        </div>
      </div>
    </div>
  )
}