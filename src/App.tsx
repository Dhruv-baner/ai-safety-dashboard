import { useState } from "react"
import FrontierWatch from "./components/FrontierWatch"
import ResearchFeed from "./components/ResearchFeed"
import RegulationRadar from "./components/RegulationRadar"

const NAV_ITEMS = [
  { id: "frontier", label: "Frontier Watch" },
  { id: "regulation", label: "Regulation Radar" },
  { id: "research", label: "Research Feed" },
]

export default function App() {
  const [active, setActive] = useState("frontier")

  return (
    <div>
      <header className="header">
        <div>
          <h1>AI Safety Dashboard</h1>
          <p>Tracking capability trajectories & global regulation</p>
        </div>
        <nav className="nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`nav-btn ${active === item.id ? "active" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="main">
        {active === "frontier" && <FrontierWatch />}
        {active === "regulation" && <RegulationRadar />}
        {active === "research" && <ResearchFeed />}
      </main>
    </div>
  )
}