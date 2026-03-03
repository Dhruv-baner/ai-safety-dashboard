// All benchmark scores sourced from official technical reports,
// Artificial Analysis, LXT AI (Feb 2026), and Stanford AI Index 2025.
// GPQA Diamond: PhD-level science reasoning. Human expert baseline: 69.7%
// SWE-bench Verified: Real GitHub bug fixes. Senior dev baseline: ~80%
// HumanEval: Python coding tasks. Human baseline: ~75%
// MMLU: 57-subject knowledge test. Expert human: ~89%

export interface Model {
  id: string
  name: string
  org: string
  releaseDate: string      // ISO date
  color: string
  scores: {
    mmlu?: number          // % (0-100)
    gpqa?: number          // % GPQA Diamond
    humaneval?: number     // % HumanEval
    swebench?: number      // % SWE-bench Verified
    hle?: number           // % Humanity's Last Exam
  }
}

export const MODELS: Model[] = [
  {
    id: "gpt35",
    name: "GPT-3.5",
    org: "OpenAI",
    releaseDate: "2022-11-30",
    color: "#10b981",
    scores: { mmlu: 70.0, gpqa: 28.0, humaneval: 48.1 },
  },
  {
    id: "gpt4",
    name: "GPT-4",
    org: "OpenAI",
    releaseDate: "2023-03-14",
    color: "#34d399",
    scores: { mmlu: 86.4, gpqa: 39.0, humaneval: 67.0, swebench: 1.7 },
  },
  {
    id: "claude3opus",
    name: "Claude 3 Opus",
    org: "Anthropic",
    releaseDate: "2024-03-04",
    color: "#f97316",
    scores: { mmlu: 86.8, gpqa: 60.1, humaneval: 84.9, swebench: 4.4 },
  },
  {
    id: "gpt4o",
    name: "GPT-4o",
    org: "OpenAI",
    releaseDate: "2024-05-13",
    color: "#6ee7b7",
    scores: { mmlu: 88.7, gpqa: 53.6, humaneval: 90.2, swebench: 33.0 },
  },
  {
    id: "gemini15pro",
    name: "Gemini 1.5 Pro",
    org: "Google",
    releaseDate: "2024-02-15",
    color: "#4ade80",
    scores: { mmlu: 85.9, gpqa: 46.2, humaneval: 84.1, swebench: 12.0 },
  },
  {
    id: "claude35sonnet",
    name: "Claude 3.5 Sonnet",
    org: "Anthropic",
    releaseDate: "2024-06-20",
    color: "#fb923c",
    scores: { mmlu: 88.3, gpqa: 59.4, humaneval: 92.0, swebench: 49.0 },
  },
  {
    id: "gemini3pro",
    name: "Gemini 3 Pro",
    org: "Google",
    releaseDate: "2025-03-12",
    color: "#86efac",
    scores: { mmlu: 89.8, gpqa: 91.9, humaneval: 97.2, swebench: 80.6, hle: 41.0 },
  },
  {
    id: "grok4",
    name: "Grok 4",
    org: "xAI",
    releaseDate: "2025-07-10",
    color: "#e879f9",
    scores: { mmlu: 87.0, gpqa: 88.0, humaneval: 98.0, swebench: 76.0, hle: 24.0 },
  },
  {
    id: "gpt52",
    name: "GPT-5.2",
    org: "OpenAI",
    releaseDate: "2025-09-01",
    color: "#a3e635",
    scores: { mmlu: 94.2, gpqa: 93.2, humaneval: 96.8, swebench: 74.9, hle: 36.0 },
  },
  {
    id: "claudeopus46",
    name: "Claude Opus 4.6",
    org: "Anthropic",
    releaseDate: "2025-10-01",
    color: "#ff6b35",
    scores: { mmlu: 91.3, gpqa: 91.3, humaneval: 96.0, swebench: 80.8, hle: 53.1 },
  },
  {
    id: "gemini31pro",
    name: "Gemini 3.1 Pro",
    org: "Google",
    releaseDate: "2026-01-15",
    color: "#bbf7d0",
    scores: { mmlu: 89.8, gpqa: 94.3, humaneval: 97.5, swebench: 80.6, hle: 41.0 },
  },
]

// Threshold lines — what ControlAI/safety researchers consider danger markers
export const THRESHOLDS = {
  gpqa: {
    humanExpert: 69.7,      // PhD-level human expert baseline
    dangerous: 90.0,        // Exceeds best human experts
  },
  swebench: {
    seniorDev: 80.0,        // Senior developer baseline
    dangerous: 85.0,
  },
  humaneval: {
    humanBaseline: 75.0,
    dangerous: 95.0,
  },
  mmlu: {
    humanExpert: 89.0,
    dangerous: 95.0,
  },
}

// Stat block data for the header row
export const ACCELERATION_STATS = [
  {
    label: "GPQA Diamond",
    value: "39% → 94%",
    sub: "GPT-4 (2023) to Gemini 3.1 (2026)",
    delta: "+141% in 26 months",
  },
  {
    label: "SWE-bench",
    value: "1.7% → 80.8%",
    sub: "GPT-4 (2023) to Claude Opus 4.6 (2025)",
    delta: "+47x in 24 months",
  },
  {
    label: "Human Expert Threshold",
    value: "Crossed",
    sub: "GPQA Diamond expert baseline: 69.7%",
    delta: "All frontier models now exceed it",
  },
  {
    label: "Time to Next Threshold",
    value: "~2026–2027",
    sub: "At current GPQA trajectory",
    delta: "Projected 95%+ saturation",
  },
]