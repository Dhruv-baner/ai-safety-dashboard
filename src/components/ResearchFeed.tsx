import React, { useState, useMemo } from "react"
import { PAPERS, SPOTLIGHT_ITEMS, TAG_COLORS, type TagType } from "../data/researchSeeds"

const TAGS = Object.keys(TAG_COLORS) as TagType[]
type SortMode = "citations" | "date" | "recent"
type TabMode = "all" | "recent" | "spotlight"

const SPOTLIGHT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Declaration: { bg: "#2d1b4e", text: "#c4b5fd", border: "#7c3aed" },
  Report:      { bg: "#1e3a5f", text: "#93c5fd", border: "#1d4ed8" },
  Summit:      { bg: "#1a2e1a", text: "#86efac", border: "#16a34a" },
  Law:         { bg: "#2d0f0f", text: "#fca5a5", border: "#dc2626" },
  Framework:   { bg: "#2d1a00", text: "#fdba74", border: "#ea580c" },
}

const S: Record<string, React.CSSProperties> = {
  label:  { fontFamily: "Inter, sans-serif", fontSize: "0.68rem", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" },
  card:   { background: "#0f172a", border: "1px solid #1e293b", padding: "1.25rem" },
  h2:     { fontFamily: "Inter, sans-serif", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#f1f5f9" },
  number: { fontFamily: "JetBrains Mono, Courier New, monospace" },
}

export default function ResearchFeed() {
  
  const [activeTag, setActiveTag] = useState<TagType | "All">("All")
  const [search, setSearch] = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)
  const [sort, setSort] = useState<SortMode>("date")
  const [tab, setTab] = useState<TabMode>("all")

  const recentPapers = PAPERS.filter(p => p.isRecent)

  const filtered = useMemo(() => {
    let list = tab === "recent" ? recentPapers : PAPERS
    if (activeTag !== "All") list = list.filter(p => p.tag === activeTag)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.abstract.toLowerCase().includes(q) ||
        p.authors.join(" ").toLowerCase().includes(q)
      )
    }
    return [...list].sort((a, b) =>
      sort === "citations" ? b.citations - a.citations :
      sort === "date" ? b.date.localeCompare(a.date) :
      (b.isRecent ? 1 : 0) - (a.isRecent ? 1 : 0) || b.date.localeCompare(a.date)
    )
  }, [activeTag, search, sort, tab, recentPapers])

  const tagCounts = useMemo(() => TAGS.map(tag => ({
    tag, count: PAPERS.filter(p => p.tag === tag).length,
  })), [])

  const mostCited = useMemo(() => [...PAPERS].sort((a, b) => b.citations - a.citations)[0], [])

  const totalCitations = useMemo(() =>
    PAPERS.reduce((s, p) => s + p.citations, 0), [])

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>

      {/* Description */}
      <div style={{ marginBottom: "2rem", borderLeft: "3px solid #7c3aed", paddingLeft: "1rem" }}>
        <div style={{ color: "#c4b5fd", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>
          Research Feed on AI Safety
        </div>
        <p style={{ color: "#94a3b8", fontSize: "0.82rem", lineHeight: 1.7, margin: 0 }}>
          A comprehensive and meticulously curated corpus of foundattional and frontier literature on AI Safety
        </p>
      </div>

      {/* Stat blocks */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Curated Papers",  value: PAPERS.length,                  sub: "Verified, AI safety relevant",    delta: `${recentPapers.length} from 2025–2026`,  color: "#7c3aed" },
          { label: "Total Citations", value: totalCitations.toLocaleString(), sub: "Across all papers",               delta: "Google Scholar, Jan 2026",              color: "#1d4ed8" },
          { label: "Most Cited",      value: mostCited.citations.toLocaleString(), sub: mostCited.title.slice(0, 35) + "…", delta: mostCited.authors[0],             color: "#f59e0b" },
          { label: "Spotlight Events",value: SPOTLIGHT_ITEMS.length,         sub: "Declarations, reports, summits",  delta: "Verified primary sources",              color: "#dc2626" },
        ].map((s, i) => (
          <div key={i} style={{ ...S.card, borderLeft: `3px solid ${s.color}` }}>
            <div style={S.label}>{s.label}</div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "1.8rem", fontWeight: 700, color: "#f1f5f9", margin: "0.3rem 0" }}>{s.value}</div>
            <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{s.sub}</div>
            <div style={{ fontSize: "0.7rem", color: s.color, marginTop: "0.25rem" }}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Main layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1.5rem", alignItems: "start" }}>

        {/* Left: tabs + feed */}
        <div>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: "0", marginBottom: "1rem", borderBottom: "1px solid #1e293b" }}>
            {([
              { id: "all",       label: `All Papers (${PAPERS.length})` },
              { id: "recent",    label: `Recent 2025–26 (${recentPapers.length})` },
              { id: "spotlight", label: `Spotlight Events (${SPOTLIGHT_ITEMS.length})` },
            ] as { id: TabMode; label: string }[]).map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "0.6rem 1.25rem", fontSize: "0.78rem",
                fontFamily: "Inter, sans-serif", fontWeight: tab === t.id ? 700 : 400,
                background: "none", cursor: "pointer",
                border: "none", borderBottom: tab === t.id ? "2px solid #dc2626" : "2px solid transparent",
                color: tab === t.id ? "#f1f5f9" : "#6b7280",
                marginBottom: -1,
              }}>{t.label}</button>
            ))}
          </div>

          {/* Spotlight tab */}
          {tab === "spotlight" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {SPOTLIGHT_ITEMS.map(item => {
                const colors = SPOTLIGHT_COLORS[item.type] || SPOTLIGHT_COLORS.Framework
                const isExp = expanded === item.id
                return (
                  <div key={item.id} onClick={() => setExpanded(isExp ? null : item.id)}
                    style={{ ...S.card, cursor: "pointer", borderLeft: `3px solid ${colors.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.4rem", alignItems: "center" }}>
                          <span style={{ fontSize: "0.62rem", padding: "0.15rem 0.5rem", background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
                            {item.type.toUpperCase()}
                          </span>
                          <span style={{ fontSize: "0.62rem", color: "#4b5563", fontFamily: "JetBrains Mono, monospace" }}>{item.date}</span>
                        </div>
                        <div style={{ color: "#f1f5f9", fontSize: "0.88rem", fontWeight: 700, lineHeight: 1.4 }}>{item.title}</div>
                        {!isExp && <div style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: "0.3rem", lineHeight: 1.5 }}>{item.summary.slice(0, 140)}…</div>}
                        {isExp && (
                          <div style={{ marginTop: "0.75rem" }}>
                            <div style={{ color: "#94a3b8", fontSize: "0.78rem", lineHeight: 1.7 }}>{item.summary}</div>
                            {item.signatories && (
                              <div style={{ marginTop: "0.5rem", fontSize: "0.72rem", color: "#7c3aed" }}>
                                <span style={{ color: "#6b7280" }}>Signatories: </span>{item.signatories}
                              </div>
                            )}
                            <a href={item.url} target="_blank" rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              style={{ display: "inline-block", marginTop: "0.5rem", color: "#818cf8", fontSize: "0.75rem", textDecoration: "none" }}>
                              → View source ↗
                            </a>
                          </div>
                        )}
                      </div>
                      <span style={{ color: "#4b5563", fontSize: "0.65rem" }}>{isExp ? "▲" : "▼"}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Papers tabs (all / recent) */}
          {tab !== "spotlight" && (
            <>
              {/* Filter + sort bar */}
              <div style={{ ...S.card, padding: "0.875rem 1.25rem", marginBottom: "0.75rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                <input type="text" placeholder="Search title, abstract, author…"
                  value={search} onChange={e => setSearch(e.target.value)}
                  style={{
                    background: "#0a0f1a", border: "1px solid #374151", color: "#f1f5f9",
                    padding: "0.3rem 0.75rem", fontSize: "0.75rem", fontFamily: "Inter, sans-serif",
                    outline: "none", width: "min(210px, 100%)",
                  }} />
                <div style={{ display: "flex", gap: "0.3rem", marginLeft: "0.25rem" }}>
                  {["citations", "date"].map(s => (
                    <button key={s} onClick={() => setSort(s as SortMode)} style={{
                      padding: "0.25rem 0.6rem", fontSize: "0.65rem", fontFamily: "Inter, sans-serif",
                      fontWeight: 500, cursor: "pointer", border: "1px solid",
                      borderColor: sort === s ? "#f1f5f9" : "#374151",
                      background: sort === s ? "#1e293b" : "transparent",
                      color: sort === s ? "#f1f5f9" : "#6b7280",
                    }}>Sort: {s}</button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                  {["All", ...TAGS].map(t => (
                    <button key={t} onClick={() => setActiveTag(t as TagType | "All")} style={{
                      padding: "0.25rem 0.6rem", fontSize: "0.65rem", fontFamily: "Inter, sans-serif",
                      fontWeight: 500, cursor: "pointer", border: "1px solid",
                      borderColor: activeTag === t ? (t === "All" ? "#f1f5f9" : TAG_COLORS[t as TagType]?.border) : "#374151",
                      background: activeTag === t ? (t === "All" ? "#1e293b" : TAG_COLORS[t as TagType]?.bg) : "transparent",
                      color: activeTag === t ? (t === "All" ? "#f1f5f9" : TAG_COLORS[t as TagType]?.text) : "#6b7280",
                    }}>{t}</button>
                  ))}
                </div>
              </div>

              <div style={{ color: "#4b5563", fontSize: "0.68rem", marginBottom: "0.5rem", fontFamily: "Inter, sans-serif" }}>
                {filtered.length} papers · sorted by {sort}
              </div>

              {/* Paper cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {filtered.map(p => {
                  const isExp = expanded === p.id
                  const colors = TAG_COLORS[p.tag]
                  return (
                    <div key={p.id} onClick={() => setExpanded(isExp ? null : p.id)}
                      style={{
                        ...S.card, cursor: "pointer",
                        borderColor: isExp ? colors.border : "#1e293b",
                        transition: "border-color 0.15s",
                      }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.4rem", alignItems: "center", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "0.62rem", padding: "0.12rem 0.45rem", background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
                              {p.tag}
                            </span>
                            {p.isRecent && (
                              <span style={{ fontSize: "0.6rem", padding: "0.1rem 0.4rem", background: "#2d0f0f", color: "#fca5a5", border: "1px solid #dc2626" }}>
                                2025–26
                              </span>
                            )}
                          </div>
                          <div style={{ color: "#f1f5f9", fontSize: "0.84rem", fontWeight: 600, lineHeight: 1.4 }}>{p.title}</div>
                          {!isExp && <div style={{ color: "#6b7280", fontSize: "0.73rem", marginTop: "0.3rem", lineHeight: 1.5 }}>{p.abstract.slice(0, 130)}…</div>}
                          {isExp && (
                            <div style={{ marginTop: "0.6rem" }}>
                              <div style={{ color: "#94a3b8", fontSize: "0.75rem", lineHeight: 1.7 }}>{p.abstract}</div>
                              <div style={{ color: "#6b7280", fontSize: "0.68rem", marginTop: "0.5rem" }}>{p.authors.join(", ")}</div>
                              <a href={p.url} target="_blank" rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                style={{ display: "inline-block", marginTop: "0.4rem", color: "#818cf8", fontSize: "0.73rem", textDecoration: "none" }}>
                                → View paper ↗
                              </a>
                            </div>
                          )}
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ color: "#4b5563", fontSize: "0.65rem", fontFamily: "JetBrains Mono, monospace" }}>{p.date.slice(0, 7)}</div>
                          <div style={{ color: "#f59e0b", fontSize: "0.88rem", fontWeight: 700, marginTop: 3, fontFamily: "JetBrains Mono, monospace" }}>
                            {p.citations >= 1000 ? `${(p.citations / 1000).toFixed(1)}k` : p.citations}
                          </div>
                          <div style={{ color: "#4b5563", fontSize: "0.58rem" }}>citations</div>
                          <div style={{ color: "#374151", fontSize: "0.6rem", marginTop: 5 }}>{isExp ? "▲" : "▼"}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {filtered.length === 0 && (
                  <div style={{ color: "#4b5563", fontSize: "0.8rem", padding: "2rem", textAlign: "center" }}>No papers match this filter.</div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Spotlight preview */}
          <div style={S.card}>
            <div style={{ ...S.label, marginBottom: "0.875rem" }}>Latest Spotlight</div>
            {SPOTLIGHT_ITEMS.slice(-3).reverse().map(item => {
              const colors = SPOTLIGHT_COLORS[item.type] || SPOTLIGHT_COLORS.Framework
              return (
                <div key={item.id} style={{ marginBottom: "0.65rem", paddingBottom: "0.65rem", borderBottom: "1px solid #1e293b", cursor: "pointer" }}
                  onClick={() => setTab("spotlight")}>
                  <div style={{ fontSize: "0.6rem", padding: "0.1rem 0.4rem", background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, display: "inline-block", marginBottom: "0.3rem" }}>
                    {item.type}
                  </div>
                  <div style={{ color: "#f1f5f9", fontSize: "0.72rem", fontWeight: 600, lineHeight: 1.4 }}>
                    {item.title.slice(0, 55)}{item.title.length > 55 ? "…" : ""}
                  </div>
                  <div style={{ color: "#4b5563", fontSize: "0.62rem", fontFamily: "JetBrains Mono, monospace", marginTop: 2 }}>{item.date}</div>
                </div>
              )
            })}
            <button onClick={() => setTab("spotlight")} style={{
              marginTop: "0.25rem", background: "none", border: "1px solid #374151",
              color: "#6b7280", fontSize: "0.68rem", fontFamily: "Inter, sans-serif",
              padding: "0.3rem 0.75rem", cursor: "pointer", width: "100%",
            }}>
              View all {SPOTLIGHT_ITEMS.length} spotlight events →
            </button>
          </div>

          {/* Category breakdown */}
          <div style={S.card}>
            <div style={{ ...S.label, marginBottom: "0.875rem" }}>Category Breakdown</div>
            {tagCounts.sort((a, b) => b.count - a.count).map(({ tag, count }) => {
              const colors = TAG_COLORS[tag]
              const pct = Math.round((count / PAPERS.length) * 100)
              return (
                <div key={tag} style={{ marginBottom: "0.65rem", cursor: "pointer" }}
                  onClick={() => setActiveTag(activeTag === tag ? "All" : tag)}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                    <span style={{ color: colors.text, fontSize: "0.7rem", fontFamily: "Inter, sans-serif" }}>{tag}</span>
                    <span style={{ color: "#6b7280", fontSize: "0.68rem", fontFamily: "JetBrains Mono, monospace" }}>{count} · {pct}%</span>
                  </div>
                  <div style={{ height: 3, background: "#1e293b", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: colors.border, borderRadius: 2, transition: "width 0.3s" }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Citation leaders */}
          <div style={S.card}>
            <div style={{ ...S.label, marginBottom: "0.875rem" }}>Most Cited Papers</div>
            {[...PAPERS].sort((a, b) => b.citations - a.citations).slice(0, 5).map((p, i) => (
              <div key={p.id} style={{ marginBottom: "0.75rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                <div style={{ color: "#374151", fontSize: "0.7rem", fontFamily: "JetBrains Mono, monospace", minWidth: 16, paddingTop: 2 }}>
                  {i + 1}.
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#f1f5f9", fontSize: "0.72rem", fontWeight: 600, lineHeight: 1.4, cursor: "pointer" }}
                    onClick={() => setExpanded(p.id)}>
                    {p.title.slice(0, 55)}{p.title.length > 55 ? "…" : ""}
                  </div>
                  <div style={{ color: "#f59e0b", fontSize: "0.7rem", fontFamily: "JetBrains Mono, monospace", marginTop: 2 }}>
                    {p.citations >= 1000 ? `${(p.citations / 1000).toFixed(0)}k` : p.citations} citations
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent highlights */}
          <div style={S.card}>
            <div style={{ ...S.label, marginBottom: "0.875rem" }}>Latest 2025–26 Papers</div>
            {[...recentPapers].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map(p => (
              <div key={p.id} style={{ marginBottom: "0.65rem", paddingBottom: "0.65rem", borderBottom: "1px solid #1e293b", cursor: "pointer" }}
                onClick={() => { setTab("recent"); setExpanded(p.id) }}>
                <div style={{ color: "#f1f5f9", fontSize: "0.72rem", fontWeight: 600, lineHeight: 1.4 }}>
                  {p.title.slice(0, 52)}{p.title.length > 52 ? "…" : ""}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.2rem", alignItems: "center" }}>
                  <span style={{ fontSize: "0.6rem", padding: "0.1rem 0.35rem", background: TAG_COLORS[p.tag].bg, color: TAG_COLORS[p.tag].text, border: `1px solid ${TAG_COLORS[p.tag].border}` }}>
                    {p.tag}
                  </span>
                  <span style={{ color: "#4b5563", fontSize: "0.62rem", fontFamily: "JetBrains Mono, monospace" }}>{p.date.slice(0, 7)}</span>
                </div>
              </div>
            ))}
            <button onClick={() => setTab("recent")} style={{
              marginTop: "0.25rem", background: "none", border: "1px solid #374151",
              color: "#6b7280", fontSize: "0.68rem", fontFamily: "Inter, sans-serif",
              padding: "0.3rem 0.75rem", cursor: "pointer", width: "100%",
            }}>
              View all {recentPapers.length} recent papers →
            </button>
          </div>

          {/* Spotlight preview */}
          <div style={S.card}>
            <div style={{ ...S.label, marginBottom: "0.875rem" }}>Latest Spotlight</div>
            {SPOTLIGHT_ITEMS.slice(-3).reverse().map(item => {
              const colors = SPOTLIGHT_COLORS[item.type] || SPOTLIGHT_COLORS.Framework
              return (
                <div key={item.id} style={{ marginBottom: "0.65rem", paddingBottom: "0.65rem", borderBottom: "1px solid #1e293b", cursor: "pointer" }}
                  onClick={() => setTab("spotlight")}>
                  <div style={{ fontSize: "0.6rem", padding: "0.1rem 0.4rem", background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, display: "inline-block", marginBottom: "0.3rem" }}>
                    {item.type}
                  </div>
                  <div style={{ color: "#f1f5f9", fontSize: "0.72rem", fontWeight: 600, lineHeight: 1.4 }}>
                    {item.title.slice(0, 55)}{item.title.length > 55 ? "…" : ""}
                  </div>
                  <div style={{ color: "#4b5563", fontSize: "0.62rem", fontFamily: "JetBrains Mono, monospace", marginTop: 2 }}>{item.date}</div>
                </div>
              )
            })}
            <button onClick={() => setTab("spotlight")} style={{
              marginTop: "0.25rem", background: "none", border: "1px solid #374151",
              color: "#6b7280", fontSize: "0.68rem", fontFamily: "Inter, sans-serif",
              padding: "0.3rem 0.75rem", cursor: "pointer", width: "100%",
            }}>
              View all {SPOTLIGHT_ITEMS.length} spotlight events →
            </button>
          </div>

          {/* Data note */}
          <div style={{ background: "#0a0f1a", border: "1px solid #1e293b", padding: "0.875rem" }}>
            <div style={{ color: "#4b5563", fontSize: "0.65rem", lineHeight: 1.7, fontFamily: "Inter, sans-serif" }}>
              All papers manually curated for AI safety relevance. Citations from Google Scholar, January 2026. Spotlight events sourced from primary documents and official government publications.
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}