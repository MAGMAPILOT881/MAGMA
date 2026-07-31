export default async function handler(req, res) {
  const s = String(req.query.symbol || "").replace(/[^A-Z_^.]/gi, "");
  if (!s) return res.status(400).json({ error: "missing symbol" });
  try {
    const r = await fetch(
      "https://cdn.cboe.com/api/global/delayed_quotes/options/" + s + ".json",
      { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" } }
    );
    if (!r.ok) return res.status(r.status).json({ error: "cboe " + r.status });
    const j = await r.json();
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
    return res.status(200).json(j);
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
 
