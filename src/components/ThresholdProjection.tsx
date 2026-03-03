import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer
} from "recharts"
import { MODELS, THRESHOLDS } from "../data/benchmarks"

// --- Linear regression on GPQA scores over time ---
function linearRegression(points: { x: number; y: number }[]) {
  const n = points.length
  const sumX = points.reduce((s, p) => s + p.x, 0)
  const sumY = points.reduce((s, p) => s + p.y, 0)
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0)
  const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0)
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  return { slope, intercept }
}

function monthsSinceEpoch(dateStr: string) {
  const d = new Date(dateStr)
  return d.getFullYear() * 12 + d.getMonth()
}

function monthToLabel(months: number) {
  const year = Math.floor(months / 12)
  const month = months % 12
  return `${year}-${String(month + 1).padStart(2, "0")}`
}

// Build historical GPQA data points
const gpqaModels = MODELS
  .filter(m => m.scores.gpqa !== undefined)
  .sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime())

const regressionPoints = gpqaModels.map(m => ({
  x: monthsSinceEpoch(m.releaseDate),
  y: m.scores.gpqa!,
}))

const { slope, intercept } = linearRegression(regressionPoints)

// Find when projection hits danger threshold
const dangerThreshold = THRESHOLDS.gpqa.dangerous
const thresholdMonth = Math.ceil((dangerThreshold - intercept) / slope)
const thresholdLabel = monthToLabel(thresholdMonth)
const thresholdYear = Math.floor(thresholdMonth / 12)
const thresholdMonthNum = thresholdMonth % 12
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const thresholdReadable = `${MONTH_NAMES[thresholdMonthNum]} ${thresholdYear}`

// Build chart data: historical + projected
const lastHistoricalMonth = regressionPoints[regressionPoints.length - 1].x
const projectionEndMonth = thresholdMonth + 3

const chartData: { date: string; actual?: number; projected?: number }[] = []

// Historical points
gpqaModels.forEach(m => {
  chartData.push({
    date: m.releaseDate.slice(0, 7),
    actual: m.scores.gpqa,
  })
})

// Projected points (every 2 months from last historical to threshold+3)
for (let m = lastHistoricalMonth + 2; m <= projectionEndMonth; m += 2) {
  const projScore = Math.min(slope * m + intercept, 100)
  chartData.push({
    date: monthToLabel(m),
    projected: Math.round(projScore * 10) / 10,
  })
}

chartData.sort((a, b) => a.date.localeCompare(b.date))

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const actual = payload.find((p: any) => p.dataKey === "actual")
  const projected = payload.find((p: any) => p.dataKey === "projected")
  return (
    <div style={{
      background: "#111827", border: "1px solid #374151",
      padding: "10px 14px", fontSize: "0.8rem", fontFamily: "Courier New"
    }}>
      <div style={{ color: "#9ca3af", marginBottom: 4 }}>{label}</div>
      {actual && <div style={{ color: "#60a5fa" }}>Actual: {actual.value}%</div>}
      {projected && <div style={{ color: "#f87171" }}>Projected: {projected.value}%</div>}
    </div>
  )
}

export default function ThresholdProjection() {
  return (
    <div style={{
      background: "#0f172a", border: "1px solid #1e293b",
      padding: "1.5rem", marginBottom: "2rem"
    }}>

      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{
          color: "#f1f5f9", fontSize: "0.95rem", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.1em"
        }}>
          Time-to-Threshold Projection
        </h2>
        <p style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: "0.25rem" }}>
          Linear extrapolation of GPQA Diamond trajectory · Based on {gpqaModels.length} frontier model releases
        </p>
      </div>

      {/* Big callout */}
      <div style={{
        background: "#1a0a0a", border: "1px solid #7f1d1d",
        borderLeft: "4px solid #dc2626",
        padding: "1.25rem 1.5rem", marginBottom: "1.75rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "1rem"
      }}>
        <div>
          <div style={{ color: "#6b7280", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Projected threshold breach — GPQA Diamond {dangerThreshold}%
          </div>
          <div style={{ color: "#f87171", fontSize: "2rem", fontWeight: 700, margin: "0.3rem 0", letterSpacing: "0.05em" }}>
            {thresholdReadable}
          </div>
          <div style={{ color: "#9ca3af", fontSize: "0.78rem" }}>
            At current trajectory, frontier models will surpass the {dangerThreshold}% danger threshold —
            exceeding the best human experts by a significant margin.
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#6b7280", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Monthly rate of improvement</div>
          <div style={{ color: "#fbbf24", fontSize: "1.4rem", fontWeight: 700 }}>
            +{(slope).toFixed(2)}% <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>/ month</span>
          </div>
          <div style={{ color: "#6b7280", fontSize: "0.7rem", marginTop: 4 }}>
            Human expert baseline: {THRESHOLDS.gpqa.humanExpert}% · Already exceeded
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="date" stroke="#4b5563"
            tick={{ fill: "#6b7280", fontSize: 10, fontFamily: "Courier New" }}
            interval={2} />
          <YAxis domain={[20, 100]} stroke="#4b5563"
            tick={{ fill: "#6b7280", fontSize: 11, fontFamily: "Courier New" }}
            tickFormatter={(v: number) => `${v}%`} />
          <Tooltip content={<CustomTooltip />} />

          {/* Human expert line */}
          <ReferenceLine y={THRESHOLDS.gpqa.humanExpert} stroke="#f59e0b" strokeDasharray="6 3"
            label={{ value: `Human Expert: ${THRESHOLDS.gpqa.humanExpert}%`, fill: "#f59e0b", fontSize: 10, fontFamily: "Courier New", position: "insideTopLeft" }} />

          {/* Danger threshold */}
          <ReferenceLine y={dangerThreshold} stroke="#dc2626" strokeDasharray="4 2"
            label={{ value: `Danger Threshold: ${dangerThreshold}%`, fill: "#dc2626", fontSize: 10, fontFamily: "Courier New", position: "insideTopLeft" }} />

          {/* Projected breach date */}
          <ReferenceLine x={thresholdLabel} stroke="#dc2626" strokeDasharray="4 2"
            label={{ value: thresholdReadable, fill: "#f87171", fontSize: 10, fontFamily: "Courier New", position: "insideTopRight" }} />

          {/* Actual scores */}
          <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2}
            dot={{ fill: "#3b82f6", r: 4, stroke: "#0f172a", strokeWidth: 2 }}
            name="Actual" connectNulls={false} />

          {/* Projected scores */}
          <Line type="monotone" dataKey="projected" stroke="#ef4444" strokeWidth={2}
            strokeDasharray="6 3"
            dot={{ fill: "#ef4444", r: 3, stroke: "#0f172a", strokeWidth: 2 }}
            name="Projected" connectNulls={false} />
        </LineChart>
      </ResponsiveContainer>

      {/* Chart legend */}
      <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.75rem" }}>
        <span style={{ fontSize: "0.7rem", color: "#9ca3af", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ display: "inline-block", width: 16, height: 2, background: "#3b82f6" }} />
          Actual benchmark scores
        </span>
        <span style={{ fontSize: "0.7rem", color: "#9ca3af", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ display: "inline-block", width: 16, height: 2, background: "#ef4444", borderTop: "2px dashed #ef4444" }} />
          Projected trajectory (linear regression)
        </span>
        <span style={{ fontSize: "0.7rem", color: "#4b5563", marginLeft: "auto" }}>
          Note: Linear extrapolation only · Real progress may accelerate or plateau
        </span>
      </div>
    </div>
  )
}