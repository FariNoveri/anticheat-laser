const TROLL_HTML = `<script>window.location.replace("https://youtu.be/jCLZ_aK06JI?si=SUdEj7pYiLjSWKcp&t=27");</script>`;

// Fungsi Enkripsi Sederhana (ROT47)
// Mengacak teks JSON secara aman tanpa merusak struktur UTF-8 (Emoji)
function encrypt(text) {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    let code = text.charCodeAt(i);
    if (code >= 33 && code <= 126) {
      result += String.fromCharCode(33 + ((code - 33 + 47) % 94));
    } else {
      result += text.charAt(i);
    }
  }
  return result;
}

exports.handler = async function(event, context) {
  const secret = process.env.FIREBASE_SECRET;
  const urlBase = "https://anticheat-laser-a31d2-default-rtdb.asia-southeast1.firebasedatabase.app";

  // Tetap izinkan dari Roblox, tapi yang didapat adalah Teks Sandi (Encrypted)
  const ua = event.headers["user-agent"] || "";
  if (!ua.toLowerCase().includes("roblox")) {
    return {
      statusCode: 403,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: TROLL_HTML
    };
  }

  if (!secret) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing Firebase secret" })
    };
  }

  let path = event.queryStringParameters.path;
  if (!path && event.body) {
    try {
      const parsedBody = JSON.parse(event.body);
      path = parsedBody.path;
    } catch (e) {}
  }

  if (!path) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing path parameter" })
    };
  }

  const method = event.httpMethod.toUpperCase();
  if (method !== "GET") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed. Only GET is allowed for this proxy." })
    };
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
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      body: encryptedData
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message })
    };
  }
};
