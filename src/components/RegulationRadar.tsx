import { useState } from "react"
import {
  ComposableMap, Geographies, Geography, ZoomableGroup
} from "react-simple-maps"
import {
  COUNTRIES, STANCE_COLORS, getRegulationStats,
  type Country, type Stance
} from "../data/regulationData"

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

const NUMERIC_TO_ISO2: Record<string, string> = {
  "276": "DE", "250": "FR", "380": "IT", "724": "ES", "528": "NL",
  "616": "PL", "752": "SE", "208": "DK", "056": "BE", "040": "AT",
  "372": "IE", "246": "FI", "620": "PT", "642": "RO", "300": "GR",
  "203": "CZ", "348": "HU", "703": "SK", "100": "BG", "191": "HR",
  "578": "NO", "352": "IS", "826": "GB", "756": "CH", "792": "TR",
  "804": "UA", "643": "RU", "688": "RS",
  "840": "US", "124": "CA", "076": "BR", "032": "AR", "484": "MX",
  "152": "CL", "170": "CO", "604": "PE",
  "156": "CN", "392": "JP", "410": "KR", "702": "SG", "356": "IN",
  "784": "AE", "682": "SA", "376": "IL", "634": "QA", "400": "JO",
  "398": "KZ", "860": "UZ", "050": "BD", "144": "LK", "524": "NP",
  "496": "MN", "104": "MM", "116": "KH", "418": "LA", "096": "BN",
  "031": "AZ", "268": "GE", "051": "AM",
  "704": "VN", "360": "ID", "764": "TH", "458": "MY",
  "158": "TW", "608": "PH", "586": "PK",
  "036": "AU", "554": "NZ",
  "404": "KE", "566": "NG", "710": "ZA", "818": "EG", "504": "MA",
  "012": "DZ", "788": "TN", "288": "GH", "231": "ET", "686": "SN",
  "646": "RW", "480": "MU", "204": "BJ", "120": "CM", "384": "CI",
  "894": "ZM", "834": "TZ", "800": "UG", "716": "ZW", "516": "NA",
  "072": "BW", "024": "AO", "508": "MZ", "180": "CD", "729": "SD",
  "478": "MR", "466": "ML", "266": "GA", "430": "LR", "694": "SL",
  "706": "SO",
}

const G20_ISO2 = new Set([
  "AR","AU","BR","CA","CN","FR","DE","IN","ID","IT",
  "JP","MX","RU","SA","ZA","KR","TR","GB","US","EU",
  // EU represented by key members
  "DE","FR","IT","ES","NL"
])

const REGION_FILTERS = ["All", "G20", "Europe", "Americas", "Asia", "Africa", "Middle East", "Oceania"] as const
type RegionFilter = typeof REGION_FILTERS[number]

function getCountryByISO2(iso2: string): Country | undefined {
  return COUNTRIES.find(c => c.iso2 === iso2)
}

const FEATURE_COLUMNS = [
  { key: "hasHorizontalLaw",     label: "Horizontal AI Law",       short: "AI Law" },
  { key: "hasFrontierRegs",      label: "Frontier Model Rules",     short: "Frontier" },
  { key: "hasComputeThresholds", label: "Compute Thresholds",       short: "Compute" },
  { key: "hasMandatoryEvals",    label: "Mandatory Safety Evals",   short: "Evals" },
  { key: "hasAISafetyInstitute", label: "AI Safety Institute",      short: "AISI" },
] as const

const DIP_COLORS: Record<string, string> = {
  Yes: "#166534", Partial: "#b45309", No: "#7f1d1d",
}

const AISI_COUNTRIES = COUNTRIES.filter(c => c.hasAISafetyInstitute)

const S: Record<string, React.CSSProperties> = {
  label: { fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" },
  value: { fontFamily: "Inter, sans-serif", fontSize: "1.8rem", fontWeight: 800, color: "#f1f5f9", margin: "0.3rem 0" },
  sub:   { fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: "#94a3b8" },
  card:  { background: "#0f172a", border: "1px solid #1e293b", padding: "1.25rem" },
  h2:    { fontFamily: "Inter, sans-serif", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#f1f5f9" },
  mono:  { fontFamily: "JetBrains Mono, Courier New, monospace" },
}

export default function RegulationRadar() {
  const [tooltip, setTooltip] = useState<{ country: Country; x: number; y: number } | null>(null)
  const [selected, setSelected] = useState<Country | null>(null)
  const [activeStance, setActiveStance] = useState<Stance | "All">("All")
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("G20")
  const [methodologyOpen, setMethodologyOpen] = useState(false)
  const stats = getRegulationStats()

  const tableCountries = COUNTRIES.filter(c => {
    if (regionFilter === "G20") return G20_ISO2.has(c.iso2)
    if (regionFilter === "All") return true
    return c.region === regionFilter
  }).sort((a, b) => {
    const order: Stance[] = ["restrictive", "moderate", "permissive", "minimal", "none"]
    return order.indexOf(a.stance) - order.indexOf(b.stance)
  })

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>

      {/* Stat blocks */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Countries Tracked", value: stats.total, sub: "Verified as of March 2026", color: "#7c3aed" },
          { label: "With Binding AI Law", value: stats.withHorizontalLaw, sub: `${Math.round(stats.withHorizontalLaw / stats.total * 100)}% of tracked — mostly EU AI Act`, color: "#166534" },
          { label: "AI Safety Institutes", value: stats.withAISI, sub: "Government-backed bodies", color: "#1d4ed8" },
          { label: "DIP Aligned (Full/Partial)", value: stats.dipPartialOrYes, sub: `${stats.stanceCounts.permissive + stats.stanceCounts.minimal + stats.stanceCounts.none} countries permissive, minimal or no policy`, color: "#dc2626" },
        ].map((s, i) => (
          <div key={i} style={{ ...S.card, borderLeft: `3px solid ${s.color}` }}>
            <div style={S.label}>{s.label}</div>
            <div style={{ ...S.value, color: "#f1f5f9" }}>{s.value}</div>
            <div style={S.sub}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Map + detail */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem", alignItems: "start", marginBottom: "2rem" }}>
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div>
              <h2 style={S.h2}>Global AI Regulatory Stance</h2>
              <p style={{ ...S.sub, marginTop: "0.2rem" }}>Click a country for details · Scroll to zoom</p>
            </div>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {(["All", "restrictive", "moderate", "permissive", "minimal", "none"] as const).map(f => (
                <button key={f} onClick={() => setActiveStance(f)} style={{
                  padding: "0.25rem 0.6rem", fontSize: "0.65rem",
                  fontFamily: "Inter, sans-serif", fontWeight: 500, cursor: "pointer",
                  border: "1px solid",
                  borderColor: activeStance === f ? "#f1f5f9" : "#374151",
                  background: activeStance === f ? (f === "All" ? "#374151" : STANCE_COLORS[f]?.fill) : "transparent",
                  color: activeStance === f ? "#f1f5f9" : "#6b7280",
                }}>
                  {f === "All" ? "All" : STANCE_COLORS[f].label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <ComposableMap projectionConfig={{ scale: 140, center: [10, 10] }} style={{ width: "100%", height: "auto", background: "#030712" }}>
              <ZoomableGroup>
                <Geographies geography={GEO_URL}>
                  {({ geographies }: { geographies: any[] }) =>
                    geographies.map((geo: any) => {
                      const numericId = String(geo.id).padStart(3, "0")
                      const iso2 = NUMERIC_TO_ISO2[numericId]
                      const country = iso2 ? getCountryByISO2(iso2) : undefined
                      const isFiltered = activeStance !== "All" && country?.stance !== activeStance
                      const fill = country && !isFiltered ? STANCE_COLORS[country.stance].fill : "#111827"
                      return (
                        <Geography key={geo.rsmKey} geography={geo} fill={fill}
                          stroke="#0f172a" strokeWidth={0.3}
                          style={{
                            default: { outline: "none", cursor: country ? "pointer" : "default" },
                            hover: { outline: "none", fill: country ? "#475569" : fill, cursor: country ? "pointer" : "default" },
                            pressed: { outline: "none" },
                          }}
                          onMouseEnter={(e: any) => { if (country) setTooltip({ country, x: e.clientX, y: e.clientY }) }}
                          onMouseMove={(e: any) => { if (country) setTooltip({ country, x: e.clientX, y: e.clientY }) }}
                          onMouseLeave={() => setTooltip(null)}
                          onClick={() => { if (country) setSelected(selected?.iso2 === iso2 ? null : country) }}
                        />
                      )
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
            {tooltip && (
              <div style={{
                position: "fixed", left: tooltip.x + 12, top: tooltip.y - 10,
                background: "#111827", border: "1px solid #374151",
                padding: "8px 12px", fontSize: "0.75rem",
                fontFamily: "Inter, sans-serif", pointerEvents: "none", zIndex: 1000,
              }}>
                <div style={{ color: "#f1f5f9", fontWeight: 700 }}>{tooltip.country.name}</div>
                <div style={{ color: "#94a3b8", marginTop: 2, fontSize: "0.68rem" }}>{STANCE_COLORS[tooltip.country.stance].label}</div>
                <div style={{ color: "#6b7280", fontSize: "0.62rem", marginTop: 2 }}>Click for details</div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: "1.25rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
            {Object.entries(STANCE_COLORS).map(([stance, { fill, label }]) => (
              <div key={stance} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, background: fill, borderRadius: 2, flexShrink: 0 }} />
                <span style={{ fontSize: "0.68rem", color: "#9ca3af", fontFamily: "Inter, sans-serif" }}>{label}</span>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, background: "#111827", borderRadius: 2 }} />
              <span style={{ fontSize: "0.68rem", color: "#4b5563", fontFamily: "Inter, sans-serif" }}>No data</span>
            </div>
          </div>
        </div>

        {/* Detail panel */}
        <div style={S.card}>
          {selected ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div>
                  <div style={{ color: "#f1f5f9", fontSize: "1rem", fontWeight: 700, fontFamily: "Inter, sans-serif" }}>{selected.name}</div>
                  <div style={{ color: "#6b7280", fontSize: "0.7rem" }}>{selected.region}</div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "1rem" }}>✕</button>
              </div>
              <div style={{ background: STANCE_COLORS[selected.stance].fill, padding: "0.3rem 0.7rem", display: "inline-block", fontSize: "0.7rem", marginBottom: "1rem", color: "#f1f5f9", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                {STANCE_COLORS[selected.stance].label.toUpperCase()}
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ ...S.label, marginBottom: "0.5rem" }}>Regulatory Features</div>
                {FEATURE_COLUMNS.map(col => {
                  const val = selected[col.key as keyof Country] as boolean
                  return (
                    <div key={col.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.35rem 0", borderBottom: "1px solid #1e293b" }}>
                      <span style={{ color: "#94a3b8", fontSize: "0.7rem", fontFamily: "Inter, sans-serif" }}>{col.label}</span>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: val ? "#86efac" : "#ef4444" }}>{val ? "✓ Yes" : "✗ No"}</span>
                    </div>
                  )
                })}
              </div>
              <div style={{ marginBottom: "0.75rem" }}>
                <div style={{ ...S.label, marginBottom: "0.3rem" }}>DIP Alignment</div>
                <div style={{ background: DIP_COLORS[selected.dipAlignment], padding: "0.25rem 0.6rem", display: "inline-block", fontSize: "0.7rem", color: "#f1f5f9", fontWeight: 600 }}>
                  {selected.dipAlignment}
                </div>
              </div>
              <div style={{ marginBottom: "0.75rem" }}>
                <div style={{ ...S.label, marginBottom: "0.3rem" }}>Key Legislation</div>
                <div style={{ color: "#c4b5fd", fontSize: "0.72rem", lineHeight: 1.5, fontFamily: "Inter, sans-serif" }}>{selected.keyLegislation}</div>
              </div>
              <div style={{ background: "#111827", padding: "0.75rem", border: "1px solid #1e293b", borderLeft: "3px solid #374151" }}>
                <div style={{ ...S.label, marginBottom: "0.3rem" }}>Status (March 2026)</div>
                <div style={{ color: "#94a3b8", fontSize: "0.72rem", lineHeight: 1.6, fontFamily: "Inter, sans-serif" }}>{selected.statusNote}</div>
              </div>
            </>
          ) : (
            <div>
              <div style={{ ...S.h2, marginBottom: "0.75rem" }}>Country Detail</div>
              <div style={{ color: "#4b5563", fontSize: "0.75rem", lineHeight: 1.6 }}>Click any country on the map to see its full regulatory profile and alignment with ControlAI's Direct Institutional Plan.</div>
              <div style={{ marginTop: "1.25rem" }}>
                <div style={{ ...S.label, marginBottom: "0.75rem" }}>Stance Breakdown</div>
                {Object.entries(STANCE_COLORS).map(([stance, { fill, label }]) => {
                  const count = COUNTRIES.filter(c => c.stance === stance).length
                  const pct = Math.round(count / COUNTRIES.length * 100)
                  return (
                    <div key={stance} style={{ marginBottom: "0.6rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                        <span style={{ color: "#94a3b8", fontSize: "0.7rem", fontFamily: "Inter, sans-serif" }}>{label}</span>
                        <span style={{ color: "#6b7280", fontSize: "0.7rem", fontFamily: "JetBrains Mono, monospace" }}>{count} · {pct}%</span>
                      </div>
                      <div style={{ height: 3, background: "#1e293b", borderRadius: 2 }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: fill, borderRadius: 2 }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Methodology (expandable) */}
      <div style={{ ...S.card, marginBottom: "2rem" }}>
        <button onClick={() => setMethodologyOpen(!methodologyOpen)} style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ ...S.h2 }}>How Countries Were Classified</span>
          <span style={{ color: "#6b7280", fontSize: "0.8rem", fontFamily: "Inter, sans-serif" }}>{methodologyOpen ? "▲ Collapse" : "▼ Expand"}</span>
        </button>
        {methodologyOpen && (
          <div style={{ marginTop: "1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <div style={{ ...S.label, marginBottom: "0.75rem" }}>Stance Classification</div>
              {[
                { stance: "restrictive", desc: "A binding, horizontal AI law is in force covering multiple sectors — primarily EU member states under the EU AI Act (2024/1689)." },
                { stance: "moderate",    desc: "Active regulatory engagement with some binding rules in place, or a comprehensive law passed but not yet fully enforced (e.g. South Korea AI Basic Act, Vietnam AI Law)." },
                { stance: "permissive",  desc: "Government policy explicitly prioritises AI innovation over safety regulation. Voluntary frameworks only, or active rollback of existing safety measures (e.g. USA under Trump EO Dec 2025, Japan AI Promotion Act)." },
                { stance: "minimal",     desc: "Published national AI strategy or soft-law guidelines, but no binding AI-specific regulation. Includes most developing nations with active AI ambitions." },
                { stance: "none",        desc: "No national AI strategy or policy of substance. AI governance is either absent or in very early drafting stages." },
              ].map(({ stance, desc }) => (
                <div key={stance} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem", alignItems: "flex-start" }}>
                  <div style={{ width: 10, height: 10, background: STANCE_COLORS[stance as Stance].fill, borderRadius: 2, flexShrink: 0, marginTop: 3 }} />
                  <div>
                    <span style={{ color: "#f1f5f9", fontSize: "0.72rem", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>{STANCE_COLORS[stance as Stance].label}: </span>
                    <span style={{ color: "#94a3b8", fontSize: "0.72rem", lineHeight: 1.6, fontFamily: "Inter, sans-serif" }}>{desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ ...S.label, marginBottom: "0.75rem" }}>DIP Alignment Score</div>
              <div style={{ color: "#94a3b8", fontSize: "0.72rem", lineHeight: 1.7, fontFamily: "Inter, sans-serif", marginBottom: "1rem" }}>
                DIP alignment reflects proximity to ControlAI's <strong style={{ color: "#f1f5f9" }}>Direct Institutional Plan</strong> — specifically: banning deliberate development of artificial superintelligence, prohibiting dangerous capability precursors, requiring mandatory pre-deployment safety evaluations, and building toward an international treaty.
              </div>
              {[
                { level: "Yes",     color: "#166534", desc: "Country has passed or proposed legislation directly aligned with ControlAI's policy asks." },
                { level: "Partial", color: "#b45309", desc: "Country has meaningful safety regulation but stops short of frontier model bans or compute thresholds." },
                { level: "No",      color: "#7f1d1d", desc: "No meaningful alignment. Either pro-acceleration stance, no regulation, or regulation focused only on content rather than existential risk." },
              ].map(({ level, color, desc }) => (
                <div key={level} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.6rem", alignItems: "flex-start" }}>
                  <div style={{ background: color, padding: "0.1rem 0.5rem", fontSize: "0.65rem", color: "#f1f5f9", fontWeight: 600, flexShrink: 0, fontFamily: "Inter, sans-serif" }}>{level}</div>
                  <span style={{ color: "#94a3b8", fontSize: "0.72rem", lineHeight: 1.5, fontFamily: "Inter, sans-serif" }}>{desc}</span>
                </div>
              ))}
              <div style={{ marginTop: "1rem", padding: "0.75rem", background: "#111827", border: "1px solid #1e293b", borderLeft: "3px solid #374151" }}>
                <div style={{ ...S.label, marginBottom: "0.3rem" }}>Sources</div>
                <div style={{ color: "#6b7280", fontSize: "0.68rem", lineHeight: 1.6, fontFamily: "Inter, sans-serif" }}>
                  EU AI Act official timeline · White & Case Global AI Regulatory Tracker · IAPP Global AI Law Tracker · Wikipedia AI Safety Institutes · Asia Law Portal 2026 · AU Continental AI Strategy · Future of Privacy Forum Africa AI Report · ISEAS Southeast Asia AI Governance 2026 · Stanford AI Index 2025 · International AI Safety Report 2026
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AISI Showcase */}
      <div style={{ ...S.card, marginBottom: "2rem" }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <h2 style={S.h2}>AI Safety Institute Network</h2>
          <p style={{ ...S.sub, marginTop: "0.25rem" }}>Government-backed institutes for frontier AI evaluation · {AISI_COUNTRIES.length} countries tracked</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
          {AISI_COUNTRIES.map(c => (
            <div key={c.iso2} style={{
              background: "#111827", border: "1px solid #1e293b",
              padding: "1rem", borderLeft: "3px solid #1d4ed8",
              cursor: "pointer",
            }} onClick={() => setSelected(c)}>
              <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "0.85rem", fontFamily: "Inter, sans-serif", marginBottom: "0.25rem" }}>{c.name}</div>
              <div style={{ color: "#6b7280", fontSize: "0.68rem", marginBottom: "0.5rem" }}>{c.region}</div>
              <div style={{
                background: STANCE_COLORS[c.stance].fill,
                padding: "0.15rem 0.5rem", display: "inline-block",
                fontSize: "0.62rem", color: "#f1f5f9", fontWeight: 600, fontFamily: "Inter, sans-serif"
              }}>
                {STANCE_COLORS[c.stance].label}
              </div>
              <div style={{ color: "#60a5fa", fontSize: "0.65rem", marginTop: "0.4rem", lineHeight: 1.5, fontFamily: "Inter, sans-serif" }}>
                {c.statusNote.split('.')[0]}.
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "1rem", padding: "0.75rem", background: "#0a0f1a", border: "1px solid #1e293b" }}>
          <div style={{ color: "#6b7280", fontSize: "0.68rem", lineHeight: 1.6, fontFamily: "Inter, sans-serif" }}>
            The international AISI network (now renamed International Network for Advanced AI Measurement, Evaluation and Science) includes institutes from Australia, Canada, EU, France, Japan, Kenya, South Korea, Singapore, UK, and US. India announced its own institute in January 2025. Note: the US AISI was renamed CAISI in June 2025 with a changed mission under the Trump administration.
          </div>
        </div>
      </div>

      {/* Country matrix */}
      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={S.h2}>Full Country Matrix</h2>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {REGION_FILTERS.map(f => (
              <button key={f} onClick={() => setRegionFilter(f)} style={{
                padding: "0.25rem 0.7rem", fontSize: "0.68rem",
                fontFamily: "Inter, sans-serif", fontWeight: 500, cursor: "pointer",
                border: "1px solid",
                borderColor: regionFilter === f ? "#f1f5f9" : "#374151",
                background: regionFilter === f ? "#1e293b" : "transparent",
                color: regionFilter === f ? "#f1f5f9" : "#6b7280",
              }}>{f}</button>
            ))}
          </div>
        </div>
        <div style={{ color: "#4b5563", fontSize: "0.68rem", marginBottom: "0.75rem", fontFamily: "Inter, sans-serif" }}>
          Showing {tableCountries.length} countries · {regionFilter === "G20" ? "G20 members (default)" : regionFilter}
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e293b" }}>
                {["Country", "Region", "Stance", ...FEATURE_COLUMNS.map(f => f.short), "DIP"].map(h => (
                  <th key={h} style={{ color: "#6b7280", textAlign: "left", padding: "0.5rem 0.75rem", fontWeight: 600, textTransform: "uppercase", fontSize: "0.6rem", letterSpacing: "0.08em", whiteSpace: "nowrap", fontFamily: "Inter, sans-serif" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableCountries.map((c, i) => (
                <tr key={c.iso2} onClick={() => setSelected(selected?.iso2 === c.iso2 ? null : c)}
                  style={{ borderBottom: "1px solid #0f172a", background: selected?.iso2 === c.iso2 ? "#1e293b" : i % 2 === 0 ? "#111827" : "transparent", cursor: "pointer" }}>
                  <td style={{ padding: "0.5rem 0.75rem", color: "#f1f5f9", fontWeight: 600, whiteSpace: "nowrap", fontFamily: "Inter, sans-serif" }}>{c.name}</td>
                  <td style={{ padding: "0.5rem 0.75rem", color: "#6b7280", whiteSpace: "nowrap", fontFamily: "Inter, sans-serif" }}>{c.region}</td>
                  <td style={{ padding: "0.5rem 0.75rem" }}>
                    <span style={{ background: STANCE_COLORS[c.stance].fill, color: "#f1f5f9", padding: "0.1rem 0.4rem", fontSize: "0.62rem", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                      {STANCE_COLORS[c.stance].label}
                    </span>
                  </td>
                  {FEATURE_COLUMNS.map(col => (
                    <td key={col.key} style={{ padding: "0.5rem 0.75rem", textAlign: "center" }}>
                      <span style={{ color: c[col.key as keyof Country] ? "#86efac" : "#374151", fontSize: "0.85rem" }}>
                        {c[col.key as keyof Country] ? "✓" : "✗"}
                      </span>
                    </td>
                  ))}
                  <td style={{ padding: "0.5rem 0.75rem" }}>
                    <span style={{ background: DIP_COLORS[c.dipAlignment], color: "#f1f5f9", padding: "0.1rem 0.4rem", fontSize: "0.62rem", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                      {c.dipAlignment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}