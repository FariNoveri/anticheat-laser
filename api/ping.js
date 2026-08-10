export default async function handler(req, res) {
  const method = req.method.toUpperCase();
  if (method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  try {
    const start = Date.now();
    
    const response = await fetch(url, {
      method: "GET",
      // Spoof Roblox user agent so the anti-cheat proxy allows it
      headers: { "User-Agent": "Roblox/WinInet" },
      // Fast timeout
      signal: AbortSignal.timeout(5000),
      cache: "no-store"
    });

    const latency = Date.now() - start;

    if (response.ok) {
      return res.status(200).json({ status: "ok", latency });
    } else {
      return res.status(200).json({ status: "error", code: response.status });
    }
  } catch (error) {
    return res.status(200).json({ status: "error", code: 'DOWN' });
  }
}
