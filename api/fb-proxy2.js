const TROLL_HTML = `<script>window.location.replace("https://youtu.be/jCLZ_aK06JI?si=SUdEj7pYiLjSWKcp&t=27");</script>`;

// Fungsi Enkripsi Sederhana (Caesar Cipher Shift +5)
// Menggeser setiap karakter JSON agar tidak bisa dibaca / di-parse
function encrypt(text) {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) + 5);
  }
  return result;
}

export default async function handler(req, res) {
  const secret = process.env.FIREBASE_SECRET;
  const urlBase = "https://anticheat-laser-a31d2-default-rtdb.asia-southeast1.firebasedatabase.app";

  // Tetap izinkan dari Roblox, tapi yang didapat adalah Teks Sandi (Encrypted)
  const ua = req.headers["user-agent"] || "";
  if (!ua.toLowerCase().includes("roblox")) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(403).send(TROLL_HTML);
  }

  if (!secret) {
    return res.status(500).json({ error: "Missing Firebase secret" });
  }

  const path = req.query.path || req.body?.path;
  if (!path) {
    return res.status(400).json({ error: "Missing path parameter" });
  }

  const method = req.method.toUpperCase();
  if (method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed. Only GET is allowed for this proxy." });
  }

  const firebaseUrl = `${urlBase}${path}.json?auth=${encodeURIComponent(secret)}`;

  try {
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(firebaseUrl, options);
    const data = await response.json();
    
    // ENKRIPSI JSON SEBELUM DIKIRIM KE ROBLOX
    const jsonString = JSON.stringify(data);
    const encryptedData = encrypt(jsonString);

    // Kirim sebagai Plain Text, BUKAN JSON! 
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).send(encryptedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
