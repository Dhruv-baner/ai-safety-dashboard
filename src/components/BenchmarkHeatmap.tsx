import { MODELS, THRESHOLDS } from "../data/benchmarks"

type BenchmarkKey = "gpqa" | "mmlu" | "humaneval" | "swebench"

const BENCHMARKS: { key: BenchmarkKey; label: string; description: string }[] = [
  { key: "gpqa",      label: "GPQA ◆",     description: "PhD-level reasoning" },
  { key: "mmlu",      label: "MMLU",        description: "Broad knowledge" },
  { key: "humaneval", label: "HumanEval",   description: "Python coding" },
  { key: "swebench",  label: "SWE-bench",   description: "Real bug fixing" },
]

// Score → colour: green (safe) to red (dangerous)
function scoreToColor(score: number, benchmark: BenchmarkKey): string {
  const danger = THRESHOLDS[benchmark].dangerous
  const human = benchmark === "swebench"
    ? THRESHOLDS.swebench.seniorDev
    : benchmark === "gpqa"
    ? THRESHOLDS.gpqa.humanExpert
    : THRESHOLDS.mmlu.humanExpert

  if (score >= danger)  return "#7f1d1d"   // deep red — above danger
  if (score >= human)   return "#92400e"   // amber — above human expert
  if (score >= human * 0.85) return "#1e3a5f" // blue — approaching human
  return "#0f2942"                          // dark — well below
}

function textColor(score: number, benchmark: BenchmarkKey): string {
  const danger = THRESHOLDS[benchmark].dangerous
  const human = benchmark === "swebench"
    ? THRESHOLDS.swebench.seniorDev
    : benchmark === "gpqa"
    ? THRESHOLDS.gpqa.humanExpert
    : THRESHOLDS.mmlu.humanExpert

  if (score >= danger) return "#fca5a5"
  if (score >= human)  return "#fcd34d"
  return "#93c5fd"
}

const SORTED_MODELS = [...MODELS].sort(
  (a, b) => (b.scores.gpqa ?? 0) - (a.scores.gpqa ?? 0)
)

export default function BenchmarkHeatmap() {
  return (
    <div style={{
      background: "#0f172a", border: "1px solid #1e293b",
      padding: "1.5rem", marginBottom: "2rem"
    }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{
          color: "#f1f5f9", fontSize: "0.95rem", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.1em"
        }}>
          Capability Heatmap
        </h2>
        <p style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: "0.25rem" }}>
          Score proximity to danger thresholds · Sorted by GPQA performance
        </p>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "3px", fontSize: "0.78rem" }}>
          <thead>
            <tr>
              {/* Model column header */}
              <th style={{
                width: 160, textAlign: "left", padding: "0.5rem 0.75rem",
                color: "#6b7280", fontWeight: 400, textTransform: "uppercase",
                fontSize: "0.65rem", letterSpacing: "0.08em"
              }}>
                Model
              </th>
              {BENCHMARKS.map(b => (
                <th key={b.key} style={{
                  textAlign: "center", padding: "0.5rem 1rem",
                  color: "#6b7280", fontWeight: 400, textTransform: "uppercase",
                  fontSize: "0.65rem", letterSpacing: "0.08em"
                }}>
                  <div>{b.label}</div>
                  <div style={{ color: "#4b5563", fontSize: "0.6rem", fontWeight: 300, marginTop: 2 }}>
                    {b.description}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SORTED_MODELS.map(m => (
              <tr key={m.id}>
                {/* Model name cell */}
                <td style={{ padding: "0.4rem 0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: m.color, flexShrink: 0,
                      display: "inline-block"
                    }} />
                    <div>
                      <div style={{ color: "#f1f5f9", fontSize: "0.78rem", fontWeight: 600 }}>
                        {m.name}
                      </div>
                      <div style={{ color: "#4b5563", fontSize: "0.65rem" }}>
                        {m.org} · {m.releaseDate.slice(0, 7)}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Score cells */}
                {BENCHMARKS.map(b => {
                  const score = m.scores[b.key]
                  const danger = THRESHOLDS[b.key].dangerous
                  return (
                    <td key={b.key} style={{
                      textAlign: "center",
                      padding: "0.6rem 1rem",
                      background: score !== undefined ? scoreToColor(score, b.key) : "#0a0f1a",
                      borderRadius: 4,
                      position: "relative",
                    }}>
                      {score !== undefined ? (
                        <>
                          <div style={{
                            color: textColor(score, b.key),
                            fontWeight: 700, fontSize: "0.85rem"
                          }}>
                            {score}%
                          </div>
                          {/* Progress bar toward danger threshold */}
                          <div style={{
                            height: 2, background: "#1e293b",
                            borderRadius: 1, marginTop: 4, overflow: "hidden"
                          }}>
                            <div style={{
                              height: "100%",
                              width: `${Math.min((score / danger) * 100, 100)}%`,
                              background: score >= danger ? "#ef4444" : score >= danger * 0.85 ? "#f59e0b" : "#3b82f6",
                              borderRadius: 1,
                              transition: "width 0.3s ease"
                            }} />
                          </div>
                        </>
                      ) : (
                        <span style={{ color: "#374151" }}>—</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{
        display: "flex", gap: "1.5rem", marginTop: "1rem",
        paddingTop: "1rem", borderTop: "1px solid #1e293b"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, background: "#7f1d1d", borderRadius: 2 }} />
          <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>Above danger threshold</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, background: "#92400e", borderRadius: 2 }} />
          <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>Above human expert</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, background: "#1e3a5f", borderRadius: 2 }} />
          <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>Approaching human</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, background: "#0f2942", borderRadius: 2 }} />
          <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>Below human</span>
        </div>
        <div style={{ marginLeft: "auto", fontSize: "0.7rem", color: "#4b5563" }}>
          ▬ bar shows % progress toward danger threshold
        </div>
      </div>
    </div>
  )
}