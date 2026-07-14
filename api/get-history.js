const TROLL_HTML = `<!DOCTYPE html>
<html>
<head>
<title>Access Denied</title>
<style>
  body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: black; }
  iframe { width: 100vw; height: 100vh; border: none; }
</style>
</head>
<body>
  <iframe src="https://www.youtube.com/embed/SCaAetNzXIc?autoplay=1&controls=0&disablekb=1&fs=1" allow="autoplay; fullscreen"></iframe>
</body>
</html>`;

export default async function handler(req, res) {
  const secret = process.env.FIREBASE_SECRET;
  const urlBase = "https://anticheat-laser-a31d2-default-rtdb.asia-southeast1.firebasedatabase.app";

  // Hanya izinkan request dari Roblox (POST method)
  const ua = req.headers["user-agent"] || "";
  if (!ua.toLowerCase().includes("roblox") || req.method !== "POST") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(403).send(TROLL_HTML);
  }

  const { token, buyerName } = req.body || {};
  
  if (token !== "LASER_SECURE_PAYMENT_9921") {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (!buyerName) {
    return res.status(400).json({ error: "Missing buyerName" });
  }

  if (!secret) {
    return res.status(500).json({ error: "Missing Firebase secret" });
  }

  const historyUrl = `${urlBase}/purchase_history.json?auth=${encodeURIComponent(secret)}`;

  try {
    const getRes = await fetch(historyUrl);
    const historyData = await getRes.json() || {};

    const userHistory = [];
    for (const [key, entry] of Object.entries(historyData)) {
      if (entry.buyerName === buyerName) {
        userHistory.push({
          id: key,
          productName: entry.productName || `License ${entry.durationDays} Hari`,
          price: entry.price || (entry.durationDays === 3 ? 200 : (entry.durationDays === 7 ? 400 : 1000)),
          durationDays: entry.durationDays,
          gameId: entry.gameId || "",
          gameName: entry.gameName || "",
          timestamp: entry.timestamp || 0
        });
      }
    }

    return res.status(200).json({ success: true, data: userHistory });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
