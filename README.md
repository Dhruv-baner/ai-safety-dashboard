# AI Safety Dashboard

**[→ Live Demo](https://ai-safety-dashboard-eight.vercel.app/)** · Built for the AI safety community · March 2026

An open-source intelligence dashboard tracking the three dimensions of the AI safety landscape: the **research literature**, **frontier model capabilities**, and **global governance**. Built as a resource for policy researchers, safety advocates, and anyone seeking a structured view of where AI development stands and how the world is responding.

The platform is framed around [ControlAI's Direct Institutional Plan](https://controlai.com/dip): the concrete policy roadmap for preventing ASI development supported by 100+ UK parliamentarians — and uses it as a benchmark for evaluating national regulatory alignment.

---

## What It Does

### 📚 Research Feed

A curated corpus of **272 verified papers and policy documents** spanning the full AI safety literature, by category. Alongside academic papers, the library tracks landmark government policies, international declarations, and think tank reports that define the global response to advanced AI.

- 272 papers across **8 categories**, verified against primary sources (arXiv, government websites, transformer-circuits.pub)
- Full-text search across titles, abstracts, and authors
- Filter by tag, sort by citation count or publication date
- **10 Spotlight Events** tracking major declarations, summits, and laws; 
- Citation data from Google Scholar, January 2026

### 📈 Frontier Watch

A capability trajectory dashboard tracking how frontier AI models have progressed on safety-relevant benchmarks over time, with reference lines marking human expert baselines and danger thresholds.

- Tracks **GPQA Diamond**, **MMLU**, **HumanEval**, and **SWE-bench** across all major frontier models from GPT-4 through to Claude Opus 4.6, GPT-5, Gemini 3 Pro, and Grok 4
- Interactive line chart showing the pace of capability gains since 2022
- Full model comparison table with colour-coded threshold indicators (above danger threshold, above human expert, below human expert)
- Acceleration statistics showing the shrinking gap between human and AI performance across every benchmark

### 🌍 Regulation Radar

An interactive world map of AI regulatory stances across **~80 countries**, with per-country detail panels, a full country matrix, and DIP alignment scoring.

- **Five regulatory stances**: Restrictive → Moderate → Permissive → Minimal → None
- Per-country profiles showing: horizontal AI law, frontier model rules, compute thresholds, mandatory safety evaluations, and AI Safety Institute presence
- **DIP Alignment Score** (Yes / Partial / No) measuring each country's proximity to ControlAI's four core policy asks
- AI Safety Institute network showcase tracking all 11 government-backed frontier evaluation bodies
- Full country matrix with region filters — G20 (default), Europe, Asia, Americas, Africa, Middle East, Oceania

---

## Technical Stack

| Layer | Technology |
|---|---|
| Framework | React + TypeScript |
| Charts | Recharts |
| Maps | react-simple-maps |
| Styling | Inline styles + responsive CSS |
| Deployment | Vercel |
| Data | Hand-curated TypeScript data files |

The project is deliberately built without a backend — all data lives in typed `.ts` files, making it fully auditable, forkable, and straightforward to update as the field evolves.

---

## Repository Structure

```
src/
├── components/
│   ├── ResearchFeed.tsx         # Research library UI
│   ├── FrontierWatch.tsx        # Capability benchmarks UI
│   ├── RegulationRadar.tsx      # World map + country matrix UI
│   ├── BenchmarkHeatmap.tsx     # Cross-model benchmark heatmap
│   └── ThresholdProjection.tsx  # Capability projection chart
├── data/
│   ├── researchSeeds.ts         # 272 papers + 10 spotlight events
│   ├── benchmarks.ts            # Model scores + thresholds
│   └── regulationData.ts        # Country regulatory profiles
```

---

## Data Sources & Methodology

**Research corpus** — Papers verified against arXiv, official government websites, transformer-circuits.pub, and major academic databases. No fabricated entries. Citation counts from Google Scholar, January 2026.

**Benchmark data** — Model scores sourced from official technical reports and system cards. Thresholds set at published human expert baselines (GPQA Diamond: 69.7% PhD expert; SWE-bench: 40% senior developer performance).

**Regulatory classification** — Country stances verified against the EU AI Act official timeline, White & Case Global AI Regulatory Tracker, IAPP Global AI Law Tracker, Asia Law Portal 2026, and the International AI Safety Report 2026. DIP alignment assessed against ControlAI's four core policy asks: banning deliberate ASI development, prohibiting dangerous capability precursors, mandatory pre-deployment safety evaluations, and building toward an international treaty.

---

## Running Locally

```bash
git clone https://github.com/your-username/ai-safety-platform
cd ai-safety-platform
npm install
npm run dev
```

---

## Contributing

The most valuable contributions are **data updates**: new papers, updated regulatory stances, and new model benchmark scores. Each data file is self-contained and thoroughly typed, making additions straightforward without touching any component code.

If you spot an error in a regulatory classification or a missing paper, open an issue or pull request. The goal is for this to remain a reliable, living resource for the safety community.

---

## About

Built by **Dhruv Banerjee** — MSc Data Science, London School of Economics. Developed as part of a portfolio of AI safety and investment intelligence tools.

*Data current as of March 2026. The field moves fast; contributions welcome.*
