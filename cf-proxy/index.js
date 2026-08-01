const TROLL_HTML = `<script>window.location.replace("https://youtu.be/jCLZ_aK06JI?si=SUdEj7pYiLjSWKcp&t=27");</script>`;

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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.searchParams.get("path");
    
    const ua = request.headers.get("User-Agent") || "";
    if (!ua.toLowerCase().includes("roblox")) {
      return new Response(TROLL_HTML, {
        status: 403,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    if (!env.FIREBASE_SECRET) {
      return new Response(JSON.stringify({ error: "Missing Firebase secret" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!path) {
      return new Response(JSON.stringify({ error: "Missing path parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (request.method !== "GET") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" }
      });
    }

    const urlBase = "https://anticheat-laser-a31d2-default-rtdb.asia-southeast1.firebasedatabase.app";
    const firebaseUrl = `${urlBase}${path}.json?auth=${encodeURIComponent(env.FIREBASE_SECRET)}`;

    try {
      const response = await fetch(firebaseUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const data = await response.json();
      
      const jsonString = JSON.stringify(data);
      const encryptedData = encrypt(jsonString);

      return new Response(encryptedData, {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
