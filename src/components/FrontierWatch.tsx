import { useState } from "react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer
} from "recharts"
import { MODELS, THRESHOLDS, ACCELERATION_STATS } from "../data/benchmarks"
import BenchmarkHeatmap from "./BenchmarkHeatmap"
import ThresholdProjection from "./ThresholdProjection"

type BenchmarkKey = "gpqa" | "mmlu" | "humaneval" | "swebench"

const BENCHMARK_META: Record<BenchmarkKey, {
  label: string; description: string; humanLine: number; dangerLine: number; humanLabel: string
}> = {
  gpqa:      { label: "GPQA Diamond",  description: "PhD-level science reasoning",  humanLine: THRESHOLDS.gpqa.humanExpert,        dangerLine: THRESHOLDS.gpqa.dangerous,      humanLabel: "PhD Expert Baseline" },
  mmlu:      { label: "MMLU",          description: "57-subject knowledge test",    humanLine: THRESHOLDS.mmlu.humanExpert,        dangerLine: THRESHOLDS.mmlu.dangerous,      humanLabel: "Human Expert Baseline" },
  humaneval: { label: "HumanEval",     description: "Python coding tasks",          humanLine: THRESHOLDS.humaneval.humanBaseline, dangerLine: THRESHOLDS.humaneval.dangerous,  humanLabel: "Human Baseline" },
  swebench:  { label: "SWE-bench",     description: "Real GitHub bug fixing",       humanLine: THRESHOLDS.swebench.seniorDev,      dangerLine: THRESHOLDS.swebench.dangerous,  humanLabel: "Senior Dev Baseline" },
}

function buildChartData(benchmark: BenchmarkKey) {
  return MODELS
    .filter(m => m.scores[benchmark] !== undefined)
    .sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime())
    .map(m => ({
      name: m.name,
      date: m.releaseDate.slice(0, 7),
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
  const [activeBenchmark, setActiveBenchmark] = useState<BenchmarkKey>("gpqa")
  const meta = BENCHMARK_META[activeBenchmark]
  const chartData = buildChartData(activeBenchmark)

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>

      <style>{`
        .fw-stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .fw-chart-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          gap: 1rem;
        }
        .fw-bench-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .fw-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        @media (max-width: 768px) {
          .fw-stat-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .fw-chart-header {
            flex-direction: column;
          }
          .fw-bench-buttons {
            justify-content: flex-start;
          }
        }
        @media (max-width: 480px) {
          .fw-stat-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Stat blocks */}
      <div className="fw-stat-grid">
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
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "1.5rem", marginBottom: "2rem" }}>
        <div className="fw-chart-header">
          <div>
            <h2 style={{ color: "#f1f5f9", fontSize: "0.95rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Capability Trajectory: {meta.label}
            </h2>
            <p style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: "0.25rem" }}>
              {meta.description} · Scores by model release date
            </p>
          </div>
          <div className="fw-bench-buttons">
            {(Object.keys(BENCHMARK_META) as BenchmarkKey[]).map(b => (
              <button
                key={b}
                onClick={() => setActiveBenchmark(b)}
                style={{
                  padding: "0.35rem 0.85rem",
                  fontSize: "0.7rem",
                  fontFamily: "Courier New",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: activeBenchmark === b ? "#dc2626" : "#374151",
                  background: activeBenchmark === b ? "#7f1d1d" : "transparent",
                  color: activeBenchmark === b ? "#fee2e2" : "#9ca3af",
                  transition: "all 0.15s",
                }}
              >
                {BENCHMARK_META[b].label}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#4b5563"
              tick={{ fill: "#6b7280", fontSize: 11, fontFamily: "Courier New" }} />
            <YAxis domain={[20, 100]} stroke="#4b5563"
              tick={{ fill: "#6b7280", fontSize: 11, fontFamily: "Courier New" }}
              tickFormatter={(v: number) => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={meta.humanLine} stroke="#f59e0b" strokeDasharray="6 3" label={{
              value: `${meta.humanLabel}: ${meta.humanLine}%`, fill: "#f59e0b",
              fontSize: 10, fontFamily: "Courier New", position: "insideTopLeft"
            }} />
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

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1rem" }}>
          {chartData.map(d => (
            <span key={d.name} style={{ fontSize: "0.7rem", color: "#9ca3af", display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: d.color }} />
              {d.name}
            </span>
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <BenchmarkHeatmap />

      {/* Model table */}
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "1.5rem", marginBottom: "2rem" }}>
        <h2 style={{ color: "#f1f5f9", fontSize: "0.95rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
          Model Comparison: All Benchmarks
        </h2>
        <div className="fw-table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", minWidth: 600 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e293b" }}>
                {["Model", "Org", "Released", "GPQA ◆", "MMLU", "HumanEval", "SWE-bench"].map(h => (
                  <th key={h} style={{
                    color: "#6b7280", textAlign: "left", padding: "0.5rem 0.75rem",
                    fontWeight: 400, textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "0.08em"
                  }}>
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
                    const isAboveDanger = score !== undefined && score >= THRESHOLDS[b].dangerous
                    const isAboveHuman = score !== undefined && score >= (
                      b === "gpqa" ? THRESHOLDS.gpqa.humanExpert :
                      b === "swebench" ? THRESHOLDS.swebench.seniorDev :
                      THRESHOLDS.mmlu.humanExpert
                    )
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
        </div>
        <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          <span style={{ fontSize: "0.7rem", color: "#ef4444" }}>■ Above danger threshold</span>
          <span style={{ fontSize: "0.7rem", color: "#f59e0b" }}>■ Above human expert</span>
          <span style={{ fontSize: "0.7rem", color: "#d1d5db" }}>■ Below human expert</span>
        </div>
      </div>

      {/* Threshold Projection */}
      <ThresholdProjection />

    </div>
  )
}