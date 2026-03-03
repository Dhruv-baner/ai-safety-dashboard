import { useState } from "react"

const NAV_ITEMS = [
  { id: "frontier", label: "Frontier Watch" },
  { id: "regulation", label: "Regulation Radar" },
  { id: "research", label: "Research Feed" },
]

export default function App() {
  const [active, setActive] = useState("frontier")

  return (
    <div className="min-h-screen text-gray-100 font-mono" style={{backgroundColor: '#030712'}}>
      {/* Header */}
      <header className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-widest text-white uppercase">
            AI Safety Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Tracking capability trajectories & global regulation
          </p>
        </div>
        <nav className="flex gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`px-4 py-2 text-sm tracking-wide transition-colors ${
                active === item.id
                  ? "bg-red-900 text-red-100 border border-red-700"
                  : "text-gray-400 hover:text-white border border-transparent hover:border-gray-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Main content */}
      <main className="px-8 py-8">
        {active === "frontier" && (
          <div className="text-gray-400 text-sm">
            — Frontier Watch coming soon —
          </div>
        )}
        {active === "regulation" && (
          <div className="text-gray-400 text-sm">
            — Regulation Radar coming soon —
          </div>
        )}
        {active === "research" && (
          <div className="text-gray-400 text-sm">
            — Research Feed coming soon —
          </div>
        )}
      </main>
    </div>
  )
}