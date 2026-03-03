import { useState, useEffect } from "react"
import { SEED_PAPERS, TAG_COLORS } from "../data/researchSeeds"
import type { Paper, TagType } from "../data/researchSeeds"

const TAGS: TagType[] = [
  "Alignment", "Interpretability", "Governance & Policy", "Capabilities", "Existential Risk"
]

// Keyword → tag mapping for live arXiv papers
function inferTag(title: string, abstract: string): TagType {
  const text = (title + " " + abstract).toLowerCase()
  if (text.match(/existential|extinction|superintelligen|x-risk|agi risk|catastrophic risk/)) return "Existential Risk"
  if (text.match(/governance|policy|regulation|legislation|law|government|oversight/)) return "Governance & Policy"
  if (text.match(/interpret|explain|mechanistic|circuit|feature|neuron|activat/)) return "Interpretability"
  if (text.match(/align|reward|rlhf|constitutional|harmless|helpful|honest|value learning/)) return "Alignment"
  return "Capabilities"
}

const SEARCH_QUERIES = [
  "AI safety alignment",
  "AI existential risk superintelligence",
  "mechanistic interpretability language model",
  "AI governance regulation policy",
  "deceptive alignment mesa-optimizer",
  "RLHF reinforcement learning human feedback",
]

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

async function fetchArxivQuery(query: string): Promise<Paper[]> {
  const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&max_results=12&sortBy=submittedDate&sortOrder=descending`
  const res = await fetch(url)
  if (!res.ok) return []
  const text = await res.text()
  const parser = new DOMParser()
  const xml = parser.parseFromString(text, "application/xml")
  const entries = Array.from(xml.querySelectorAll("entry"))
  return entries
    .filter(e => e.querySelector("summary")?.textContent?.trim())
    .map(e => {
      const id = e.querySelector("id")?.textContent?.trim() ?? ""
      const arxivId = id.split("/abs/")[1] ?? id
      const title = e.querySelector("title")?.textContent?.trim() ?? ""
      const abstract = e.querySelector("summary")?.textContent?.trim() ?? ""
      const published = e.querySelector("published")?.textContent?.slice(0, 10) ?? ""
      const authors = Array.from(e.querySelectorAll("author name"))
        .slice(0, 3)
        .map(a => a.textContent?.trim() ?? "")
      return {
        id: `live-${arxivId}`,
        title,
        authors,
        date: published,
        abstract,
        tag: inferTag(title, abstract),
        citations: 0,
        url: `https://arxiv.org/abs/${arxivId}`,
        source: "live" as const,
      }
    })
}

async function fetchLivePapers(): Promise<Paper[]> {
  const all: Paper[] = []
  const seen = new Set<string>()
  for (const query of SEARCH_QUERIES) {
    try {
      const papers = await fetchArxivQuery(query)
      for (const p of papers) {
        if (!seen.has(p.id)) {
          seen.add(p.id)
          all.push(p)
        }
      }
    } catch (_) {}
    await sleep(500)
  }
  return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Stat helpers
function getTagCounts(papers: Paper[]) {
  return TAGS.map(tag => ({
    tag,
    count: papers.filter(p => p.tag === tag).length,
  }))
}

function getMostCited(papers: Paper[]) {
  return [...papers].sort((a, b) => b.citations - a.citations)[0]
}

export default function ResearchFeed() {
  const [papers, setPapers] = useState<Paper[]>(SEED_PAPERS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeTag, setActiveTag] = useState<TagType | "All">("All")
  const [search, setSearch] = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetchLivePapers()
      .then(live => setPapers([...SEED_PAPERS, ...live]))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const filtered = papers.filter(p => {
    const matchTag = activeTag === "All" || p.tag === activeTag
    const matchSearch = search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.abstract.toLowerCase().includes(search.toLowerCase())
    return matchTag && matchSearch
  })

  const tagCounts = getTagCounts(papers)
  const mostCited = getMostCited(papers)
  const liveCount = papers.filter(p => p.source === "live").length

  return (
    <div style={{ fontFamily: "Courier New, monospace" }}>

      {/* Stat blocks */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1rem", marginBottom: "2rem"
      }}>
        {[
          { label: "Total Papers", value: papers.length, sub: `${liveCount} live from Semantic Scholar`, delta: `${SEED_PAPERS.length} curated seeds` },
          { label: "Most Active Topic", value: tagCounts.sort((a,b) => b.count - a.count)[0].tag, sub: `${tagCounts.sort((a,b) => b.count - a.count)[0].count} papers`, delta: "By category count" },
          { label: "Most Cited", value: `${mostCited?.citations?.toLocaleString()} citations`, sub: mostCited?.title?.slice(0, 40) + "...", delta: mostCited?.authors?.[0] },
          { label: "Status", value: loading ? "Loading..." : error ? "Seeds only" : "Live", sub: loading ? "Fetching Semantic Scholar" : error ? "API unavailable" : "Semantic Scholar connected", delta: loading ? "Please wait" : error ? "Showing curated papers" : "Updated now" },
        ].map((s, i) => (
          <div key={i} style={{
            background: "#0f172a", border: "1px solid #1e3a5f",
            padding: "1.25rem", borderLeft: "3px solid #7c3aed"
          }}>
            <div style={{ color: "#6b7280", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
            <div style={{ color: "#f1f5f9", fontSize: "1.1rem", fontWeight: 700, margin: "0.4rem 0" }}>{s.value}</div>
            <div style={{ color: "#94a3b8", fontSize: "0.7rem" }}>{s.sub}</div>
            <div style={{ color: "#a78bfa", fontSize: "0.7rem", marginTop: "0.3rem" }}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Main layout: feed + sidebar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1.5rem", alignItems: "start" }}>

        {/* Left: feed */}
        <div>
          {/* Filter bar */}
          <div style={{
            background: "#0f172a", border: "1px solid #1e293b",
            padding: "1rem 1.25rem", marginBottom: "1rem",
            display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center"
          }}>
            <input
              type="text"
              placeholder="Search papers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                background: "#0a0f1a", border: "1px solid #374151",
                color: "#f1f5f9", padding: "0.35rem 0.75rem",
                fontSize: "0.75rem", fontFamily: "Courier New",
                outline: "none", marginRight: "0.5rem", width: 180,
              }}
            />
            {["All", ...TAGS].map(tag => (
              <button key={tag} onClick={() => setActiveTag(tag as TagType | "All")}
                style={{
                  padding: "0.3rem 0.75rem", fontSize: "0.7rem",
                  fontFamily: "Courier New", cursor: "pointer",
                  border: "1px solid",
                  borderColor: activeTag === tag
                    ? (tag === "All" ? "#7c3aed" : TAG_COLORS[tag as TagType].border)
                    : "#374151",
                  background: activeTag === tag
                    ? (tag === "All" ? "#2d1b4e" : TAG_COLORS[tag as TagType].bg)
                    : "transparent",
                  color: activeTag === tag
                    ? (tag === "All" ? "#c4b5fd" : TAG_COLORS[tag as TagType].text)
                    : "#9ca3af",
                }}>
                {tag}
              </button>
            ))}
          </div>

          {/* Paper cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {filtered.length === 0 && (
              <div style={{ color: "#4b5563", fontSize: "0.8rem", padding: "2rem", textAlign: "center" }}>
                No papers found for this filter.
              </div>
            )}
            {filtered.map(p => {
              const isExpanded = expanded === p.id
              const colors = TAG_COLORS[p.tag]
              return (
                <div key={p.id}
                  onClick={() => setExpanded(isExpanded ? null : p.id)}
                  style={{
                    background: "#0f172a", border: "1px solid",
                    borderColor: isExpanded ? colors.border : "#1e293b",
                    padding: "1rem 1.25rem", cursor: "pointer",
                    transition: "border-color 0.15s",
                  }}
                >
                  {/* Card header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                    <div style={{ flex: 1 }}>
                      {/* Tag + source badge */}
                      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
                        <span style={{
                          fontSize: "0.65rem", padding: "0.15rem 0.5rem",
                          background: colors.bg, color: colors.text,
                          border: `1px solid ${colors.border}`, borderRadius: 2,
                        }}>
                          {p.tag}
                        </span>
                        {p.source === "live" && (
                          <span style={{
                            fontSize: "0.6rem", padding: "0.15rem 0.4rem",
                            background: "#0f2942", color: "#60a5fa",
                            border: "1px solid #1d4ed8", borderRadius: 2,
                          }}>
                            LIVE
                          </span>
                        )}
                        {p.source === "seed" && (
                          <span style={{
                            fontSize: "0.6rem", padding: "0.15rem 0.4rem",
                            background: "#1a1a1a", color: "#6b7280",
                            border: "1px solid #374151", borderRadius: 2,
                          }}>
                            CURATED
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <div style={{ color: "#f1f5f9", fontSize: "0.85rem", fontWeight: 600, lineHeight: 1.4 }}>
                        {p.title}
                      </div>

                      {/* Abstract preview */}
                      {!isExpanded && (
                        <div style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: "0.4rem", lineHeight: 1.5 }}>
                          {p.abstract.slice(0, 120)}...
                        </div>
                      )}

                      {/* Expanded content */}
                      {isExpanded && (
                        <div style={{ marginTop: "0.75rem" }}>
                          <div style={{ color: "#94a3b8", fontSize: "0.75rem", lineHeight: 1.6, marginBottom: "0.75rem" }}>
                            {p.abstract}
                          </div>
                          <div style={{ color: "#6b7280", fontSize: "0.7rem", marginBottom: "0.5rem" }}>
                            {p.authors.join(", ")}
                          </div>
                          <a href={p.url} target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{ color: "#818cf8", fontSize: "0.75rem", textDecoration: "none" }}>
                            → View paper ↗
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Right: date + citations */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ color: "#4b5563", fontSize: "0.7rem" }}>{p.date.slice(0, 7)}</div>
                      <div style={{ color: "#f59e0b", fontSize: "0.85rem", fontWeight: 700, marginTop: 4 }}>
                        {p.citations.toLocaleString()}
                      </div>
                      <div style={{ color: "#4b5563", fontSize: "0.6rem" }}>citations</div>
                      <div style={{ color: "#4b5563", fontSize: "0.65rem", marginTop: 6 }}>
                        {isExpanded ? "▲ collapse" : "▼ expand"}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Category breakdown */}
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "1.25rem" }}>
            <div style={{ color: "#6b7280", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
              Category Breakdown
            </div>
            {tagCounts.sort((a, b) => b.count - a.count).map(({ tag, count }) => {
              const colors = TAG_COLORS[tag]
              const pct = Math.round((count / papers.length) * 100)
              return (
                <div key={tag} style={{ marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                    <span style={{ color: colors.text, fontSize: "0.72rem" }}>{tag}</span>
                    <span style={{ color: "#6b7280", fontSize: "0.72rem" }}>{count} · {pct}%</span>
                  </div>
                  <div style={{ height: 4, background: "#1e293b", borderRadius: 2 }}>
                    <div style={{
                      height: "100%", width: `${pct}%`,
                      background: colors.border, borderRadius: 2,
                      transition: "width 0.4s ease"
                    }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Most cited paper */}
          {mostCited && (
            <div style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "1.25rem" }}>
              <div style={{ color: "#6b7280", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
                Most Cited
              </div>
              <div style={{ color: "#f1f5f9", fontSize: "0.8rem", fontWeight: 600, lineHeight: 1.4, marginBottom: "0.5rem" }}>
                {mostCited.title}
              </div>
              <div style={{ color: "#f59e0b", fontSize: "1.2rem", fontWeight: 700 }}>
                {mostCited.citations.toLocaleString()}
              </div>
              <div style={{ color: "#4b5563", fontSize: "0.65rem" }}>citations</div>
              <a href={mostCited.url} target="_blank" rel="noopener noreferrer"
                style={{ color: "#818cf8", fontSize: "0.7rem", textDecoration: "none", display: "block", marginTop: "0.5rem" }}>
                → View paper ↗
              </a>
            </div>
          )}

          {/* Data source note */}
          <div style={{ background: "#0a0f1a", border: "1px solid #1e293b", padding: "1rem" }}>
            <div style={{ color: "#4b5563", fontSize: "0.65rem", lineHeight: 1.6 }}>
              Live papers via Semantic Scholar API. Curated seeds manually selected for relevance to AI existential risk. Tag assignment via keyword inference.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}