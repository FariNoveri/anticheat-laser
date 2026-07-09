import React, { useState } from "react";
import { ref, set } from "firebase/database";
import { db } from "../firebase/config";

export default function AnnounceTab({ allGames, showToast }) {
  const [targetType, setTargetType] = useState("global"); // global, selected, single
  const [selectedGames, setSelectedGames] = useState([]);
  const [singleGameId, setSingleGameId] = useState("");
  const [message, setMessage] = useState("AntiCheat Updated dalam 24 jam");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSend = async () => {
    if (!message.trim()) return showToast("Message is required!", "error");
    const payload = { text: message.trim(), timestamp: Date.now() };

    try {
      if (targetType === "global") {
        await set(ref(db, "/global/announcement"), payload);
        showToast("📢 Global announcement sent!");
      } else if (targetType === "single") {
        if (!singleGameId) return showToast("Select a game!", "error");
        await set(ref(db, `/games/${singleGameId}/announcement`), payload);
        showToast("📢 Announcement sent to selected game!");
      } else if (targetType === "selected") {
        if (selectedGames.length === 0) return showToast("Select at least one game!", "error");
        for (const gid of selectedGames) {
          await set(ref(db, `/games/${gid}/announcement`), payload);
        }
        showToast(`📢 Announcement sent to ${selectedGames.length} games!`);
      }
      setMessage("");
    } catch (e) {
      showToast("Failed to send: " + e.message, "error");
    }
  };

  const handleCancel = async () => {
    try {
      if (targetType === "global") {
        await set(ref(db, "/global/announcement"), null);
        showToast("🚫 Global announcement cancelled!");
      } else if (targetType === "single") {
        if (!singleGameId) return showToast("Select a game!", "error");
        await set(ref(db, `/games/${singleGameId}/announcement`), null);
        showToast("🚫 Announcement cancelled for selected game!");
      } else if (targetType === "selected") {
        if (selectedGames.length === 0) return showToast("Select at least one game!", "error");
        for (const gid of selectedGames) {
          await set(ref(db, `/games/${gid}/announcement`), null);
        }
        showToast(`🚫 Announcement cancelled for ${selectedGames.length} games!`);
      }
    } catch (e) {
      showToast("Failed to cancel: " + e.message, "error");
    }
  };

  const toggleSelected = (gid) => {
    setSelectedGames(prev => prev.includes(gid) ? prev.filter(id => id !== gid) : [...prev, gid]);
  };

  return (
    <div id="section-announce">
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>📢 Announcements</div>
        <div style={{ color: "var(--muted)", fontSize: 12 }}>Kirim pesan pengumuman real-time ke dalam game (Full-screen + Blur HD Admin Style).</div>
      </div>

      <div className="card" style={{ padding: "20px 24px" }}>
        <div style={{ marginBottom: 20, padding: 15, backgroundColor: "rgba(255, 165, 0, 0.1)", borderLeft: "4px solid orange", borderRadius: 4 }}>
          <p style={{ margin: 0, color: "orange", fontSize: "14px" }}>
            <strong>⚠️ Catatan Penting:</strong> Fitur pengumuman hanya akan diterima oleh game yang telah memasang file <code>Announcement.lua</code> di dalam folder Modules. Jika pengguna tidak memasukkannya, pengumuman tidak akan muncul.
          </p>
        </div>

        <h3 style={{ marginBottom: 16, fontSize: 16 }}>Broadcast Message</h3>
        <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
          <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <input type="radio" checked={targetType === "global"} onChange={() => setTargetType("global")} />
            Global (All Games)
          </label>
          <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <input type="radio" checked={targetType === "single"} onChange={() => setTargetType("single")} />
            Per Game (Single)
          </label>
          <label style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <input type="radio" checked={targetType === "selected"} onChange={() => setTargetType("selected")} />
            Beberapa Game (Multiple)
          </label>
        </div>

        {targetType === "single" && (
          <div style={{ marginBottom: 20 }}>
            <select
              value={singleGameId}
              onChange={(e) => setSingleGameId(e.target.value)}
              className="modal-input"
              style={{ width: "100%", maxWidth: 300 }}
            >
              <option value="">-- Pilih Game --</option>
              {Object.entries(allGames)
                .filter(([id, g]) => (g.name || id).toLowerCase().includes(searchQuery.toLowerCase()) || id.includes(searchQuery))
                .map(([id, g]) => (
                <option key={id} value={id}>{g.name || id} ({id})</option>
              ))}
            </select>
          </div>
        )}

        {targetType === "selected" && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>Pilih game yang akan dikirim:</div>
            <div style={{ marginBottom: 10 }}>
              <input
                type="text"
                className="modal-input"
                placeholder="🔍 Cari game (nama / ID)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "100%", maxWidth: 300, padding: "8px 12px", fontSize: 12 }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8, maxHeight: 200, overflowY: "auto", background: "rgba(0,0,0,0.2)", padding: 12, borderRadius: 6, border: "1px solid var(--border)" }}>
              {Object.entries(allGames)
                .filter(([id, g]) => (g.name || id).toLowerCase().includes(searchQuery.toLowerCase()) || id.includes(searchQuery))
                .map(([id, g]) => (
                <label key={id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={selectedGames.includes(id)}
                    onChange={() => toggleSelected(id)}
                  />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.name || id}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <textarea
            className="modal-input"
            placeholder="Ketik pengumuman di sini..."
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: "100%", resize: "vertical", fontFamily: "var(--mono)", fontSize: 13 }}
          />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn primary" onClick={handleSend} style={{ flex: 1, padding: "12px 16px" }}>
            KIRIM PENGUMUMAN
          </button>
          <button className="btn" onClick={handleCancel} style={{ flex: 1, borderColor: "var(--red)", color: "var(--red)", padding: "12px 16px" }}>
            CANCEL / HAPUS PENGUMUMAN
          </button>
        </div>
      </div>
    </div>
  );
}
