export default async function handler(req, res) {
  const secret = process.env.FIREBASE_SECRET;
  const urlBase = "https://anticheat-laser-a31d2-default-rtdb.asia-southeast1.firebasedatabase.app";

  const ua = req.headers["user-agent"] || "";
  if (!ua.toLowerCase().includes("roblox") || req.method !== "POST") {
    return res.status(403).send("Forbidden");
  }

  const { entryId, newGameId, newGameName, durationDays, token, buyerName } = req.body || {};
  
  if (token !== "LASER_SECURE_PAYMENT_9921") {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (!entryId || !newGameId) {
    return res.status(400).json({ error: "Missing entryId or newGameId" });
  }

  try {
    const historyUrl = `${urlBase}/purchase_history/${entryId}.json?auth=${encodeURIComponent(secret)}`;
    
    // Fetch old history first to get the old game ID
    const oldHistoryRes = await fetch(historyUrl);
    const oldHistory = (await oldHistoryRes.json()) || {};
    const oldGameId = oldHistory.gameId;

    // 1. Update purchase_history entry
    await fetch(historyUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId: newGameId,
        gameName: newGameName || `Game ${newGameId}`
      })
    });

    // 1.5 Delete old game entry if it changed
    if (oldGameId && oldGameId !== newGameId) {
      const oldGameUrl = `${urlBase}/games/${oldGameId}.json?auth=${encodeURIComponent(secret)}`;
      await fetch(oldGameUrl, { method: "DELETE" });
    }

    // 2. Update games license expiry
    const gameUrl = `${urlBase}/games/${newGameId}.json?auth=${encodeURIComponent(secret)}`;
    const getRes = await fetch(gameUrl);
    const existingData = (await getRes.json()) || {};
    
    const currentExpiry = existingData.expiry || 0;
    const now = Math.floor(Date.now() / 1000);
    let newExpiry = now + (durationDays * 86400);
    
    if (currentExpiry > now) {
      newExpiry = currentExpiry + (durationDays * 86400);
    }

    const updatedData = {
      ...existingData,
      name: newGameName || existingData.name || `Game ${newGameId}`,
      place_ids: existingData.place_ids || [parseInt(newGameId)],
      expiry: newExpiry,
    };

    await fetch(gameUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
