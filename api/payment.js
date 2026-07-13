export default async function handler(req, res) {
  const secret = process.env.FIREBASE_SECRET;
  const urlBase = "https://anticheat-laser-a31d2-default-rtdb.asia-southeast1.firebasedatabase.app";

  // Hanya izinkan request dari Roblox (POST method)
  const ua = req.headers["user-agent"] || "";
  if (!ua.toLowerCase().includes("roblox") || req.method !== "POST") {
    // Troll dummy bypassers by redirecting them to youtube
    res.writeHead(302, { Location: 'https://www.youtube.com/watch?v=SCaAetNzXIc' });
    return res.end();
  }

  const { gameId, gameName, durationDays, token, buyerName } = req.body || {};
  
  // Security token
  if (token !== "LASER_SECURE_PAYMENT_9921") {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (!gameId || !durationDays) {
    return res.status(400).json({ error: "Missing gameId or durationDays" });
  }

  if (!secret) {
    return res.status(500).json({ error: "Missing Firebase secret" });
  }

  const firebaseUrl = `${urlBase}/games/${gameId}.json?auth=${encodeURIComponent(secret)}`;

  try {
    // 1. Ambil data game yang sudah ada (jika ada) supaya tidak tertimpa
    const getRes = await fetch(firebaseUrl);
    const existingData = await getRes.json() || {};

    // 2. Hitung waktu kedaluwarsa baru (dari saat ini + hari)
    const currentExpiry = existingData.expiry || 0;
    const now = Math.floor(Date.now() / 1000);
    
    let newExpiry = now + (durationDays * 86400);
    
    // Jika game sudah punya lisensi aktif, tambahkan waktunya
    if (currentExpiry > now) {
      newExpiry = currentExpiry + (durationDays * 86400);
    }

    // 3. Gabungkan data baru dengan data lama
    const updatedData = {
      ...existingData,
      name: gameName || existingData.name || `Game ${gameId}`,
      place_ids: existingData.place_ids || [parseInt(gameId)],
      expiry: newExpiry,
    };

    // 4. Simpan kembali ke Firebase
    const putRes = await fetch(firebaseUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    });
    // 5. Catat riwayat pembelian
    const historyUrl = `${urlBase}/purchase_history.json?auth=${encodeURIComponent(secret)}`;
    await fetch(historyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        buyerName: buyerName || "Unknown",
        gameId,
        gameName: updatedData.name,
        durationDays,
        timestamp: now
      })
    });

    const result = await putRes.json();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
