const BLOCKED_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>403 — Akses Ditolak</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #07070d;
      font-family: 'Inter', 'Segoe UI', sans-serif;
      color: #fff;
    }
    .card {
      text-align: center;
      padding: 52px 60px;
      background: #0f0f18;
      border: 1px solid #ff3b3b22;
      border-radius: 20px;
      box-shadow: 0 0 80px #ff1a1a12, 0 2px 40px #00000088;
      max-width: 440px;
      width: 90%;
    }
    .icon { font-size: 52px; margin-bottom: 18px; }
    h1 {
      font-size: 20px;
      font-weight: 700;
      color: #ff4d4d;
      margin-bottom: 10px;
      letter-spacing: 0.3px;
    }
    .desc {
      font-size: 13px;
      color: #555;
      line-height: 1.8;
      margin-bottom: 28px;
    }
    .badge {
      display: inline-block;
      padding: 6px 20px;
      background: #ff1a1a12;
      border: 1px solid #ff3b3b33;
      border-radius: 999px;
      font-size: 11px;
      color: #ff6b6b;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 32px;
    }
    .divider {
      width: 40px;
      height: 1px;
      background: #ffffff10;
      margin: 0 auto 24px;
    }
    .owner {
      font-size: 12px;
      color: #333;
    }
    .owner a {
      color: #6b6bff;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }
    .owner a:hover { color: #9b9bff; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🔒</div>
    <h1>Akses Tidak Diizinkan</h1>
    <p class="desc">
      Endpoint ini bersifat privat dan hanya dapat<br/>
      diakses oleh sistem internal yang berwenang.<br/>
      Percobaan akses tidak sah telah dicatat.
    </p>
    <div class="badge">403 Forbidden</div>
    <div class="divider"></div>
    <div class="owner">
      Sistem milik <a href="https://instagram.com/fariinoveri" target="_blank">@fariinoveri</a><br/>LASER Anti-Cheat
    </div>
  </div>
</body>
</html>`;

export default async function handler(req, res) {
  const secret = process.env.FIREBASE_SECRET;
  const urlBase = "https://anticheat-laser-a31d2-default-rtdb.asia-southeast1.firebasedatabase.app";

  // Hanya izinkan request dari Roblox HttpService
  const ua = req.headers["user-agent"] || "";
  if (!ua.toLowerCase().includes("roblox")) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(403).send(BLOCKED_HTML);
  }

  if (!secret) {
    return res.status(500).json({ error: "Missing Firebase secret" });
  }

  const path = req.query.path || req.body?.path;
  if (!path) {
    return res.status(400).json({ error: "Missing path parameter" });
  }

  const method = req.method.toUpperCase();
  const firebaseUrl = `${urlBase}${path}.json?auth=${encodeURIComponent(secret)}`;

  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };

    if (method === "POST" || method === "PUT" || method === "PATCH") {
      options.body = JSON.stringify(req.body?.data || {});
    }

    const response = await fetch(firebaseUrl, options);
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
