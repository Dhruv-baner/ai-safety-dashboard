import type { VercelRequest, VercelResponse } from "@vercel/node"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const query = req.query.q as string
  if (!query) return res.status(400).json({ error: "Missing query param q" })

  const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&max_results=12&sortBy=submittedDate&sortOrder=descending`

  try {
    const response = await fetch(url)
    const text = await response.text()
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Content-Type", "application/xml")
    res.status(200).send(text)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from arXiv" })
  }
}