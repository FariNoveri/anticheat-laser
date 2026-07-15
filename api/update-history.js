const TROLL_HTML = `<!DOCTYPE html>
<html>
<head>
<title>Access Denied</title>
<style>
  body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: black; }
  .gif { position: absolute; width: 150px; height: auto; pointer-events: none; }
</style>
<script>
  window.history.replaceState(null, '', 'about:blank');
  window.history.pushState(null, '', window.location.href);
  window.addEventListener('popstate', function() {
    window.location.replace('/');
  });

  document.addEventListener('DOMContentLoaded', () => {
    for(let i=0; i<10; i++) {
      let img = document.createElement('img');
      img.src = "https://media1.tenor.com/m/x8v1oNUOmg4AAAAd/rickroll-roll.gif"; // Reliable GIF URL
      img.className = 'gif';
      document.body.appendChild(img);

      let x = Math.random() * (window.innerWidth - 150);
      let y = Math.random() * (window.innerHeight - 150);
      let dx = (Math.random() < 0.5 ? 1 : -1) * (3 + Math.random() * 3);
      let dy = (Math.random() < 0.5 ? 1 : -1) * (3 + Math.random() * 3);

      function animate() {
        let w = img.clientWidth || 150;
        let h = img.clientHeight || 150;
        if (x + w >= window.innerWidth || x <= 0) dx = -dx;
        if (y + h >= window.innerHeight || y <= 0) dy = -dy;
        x += dx;
        y += dy;
        img.style.left = x + 'px';
        img.style.top = y + 'px';
        requestAnimationFrame(animate);
      }
      setTimeout(animate, 100);
    }
  });
</script>
</head>
<body>
  <iframe width="1" height="1" src="https://www.youtube.com/embed/48rz8udZBmQ?autoplay=1&loop=1&playlist=48rz8udZBmQ" frameborder="0" allow="autoplay" style="position:absolute; left:-9999px;"></iframe>
</body>
</html>`;

export default async function handler(req, res) {
  const secret = process.env.FIREBASE_SECRET;
  const urlBase = "https://anticheat-laser-a31d2-default-rtdb.asia-southeast1.firebasedatabase.app";

  const ua = req.headers["user-agent"] || "";
  if (!ua.toLowerCase().includes("roblox") || req.method !== "POST") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(403).send(TROLL_HTML);
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

    let transferredExpiry = 0;

    // 1.5 Delete old game entry if it changed and get its expiry
    if (oldGameId && oldGameId !== newGameId) {
      const oldGameUrl = `${urlBase}/games/${oldGameId}.json?auth=${encodeURIComponent(secret)}`;
      const oldGameRes = await fetch(oldGameUrl);
      const oldGameData = (await oldGameRes.json()) || {};
      transferredExpiry = oldGameData.expiry || 0;
      
      await fetch(oldGameUrl, { method: "DELETE" });
    } else if (!oldGameId || oldGameId === "") {
      // First time setting a Game ID, calculate expiry from purchase timestamp
      const purchaseTime = oldHistory.timestamp || Math.floor(Date.now() / 1000);
      transferredExpiry = purchaseTime + (durationDays * 86400);
    }

    // 2. Update games license expiry
    const gameUrl = `${urlBase}/games/${newGameId}.json?auth=${encodeURIComponent(secret)}`;
    const getRes = await fetch(gameUrl);
    const existingData = (await getRes.json()) || {};
    
    let newExpiry = existingData.expiry || 0;
    
    if (transferredExpiry > 0) {
      newExpiry = Math.max(newExpiry, transferredExpiry);
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
