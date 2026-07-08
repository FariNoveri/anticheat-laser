import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/config";
import { Switch, ModeBadge, PunishModeGrid, Badge } from "./UI";
import { formatExpiry, isExpired } from "../utils/helpers";

// ── Force Push Bar ────────────────────────────────────────
export function ForcePushBar({ onPush }) {
  const [pushing, setPushing]       = useState(false);
  const [lastPush, setLastPush]     = useState("Belum pernah push sesi ini");

  const handlePush = async () => {
    setPushing(true);
    await onPush();
    const t = new Date();
    const hms = `${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}:${String(t.getSeconds()).padStart(2,"0")}`;
    setLastPush(`Last push: ${hms}`);
    setPushing(false);
  };

  return (
    <div className="force-push-bar">
      <div className="force-push-info">
        <span>⚡ Manual Push</span>
        <small>Tekan SET NOW untuk langsung apply perubahan ke semua server Roblox. Pengecekan otomatis dilakukan setiap 24 jam.</small>
        <div className="last-push">{lastPush}</div>
      </div>
      <button
        className={`set-btn${pushing ? " pushing" : ""}`}
        onClick={handlePush}
        disabled={pushing}
      >
        {pushing ? "⏳ PUSHING..." : "⚡ SET NOW"}
      </button>
    </div>
  );
}

// ── Global Controls Card ──────────────────────────────────
export function GlobalControls({ setGlobal, saveGlobalMsg, showToast }) {
  const [acOn,   setAcOn]   = useState(true);
  const [abOn,   setAbOn]   = useState(true);
  const [pmAvatar, setPmAvatar] = useState("kick");
  const [pmAnim,   setPmAnim]   = useState("kick");
  const [kickMsgAvatar, setKickMsgAvatar] = useState("");
  const [kickMsgAnim,   setKickMsgAnim]   = useState("");
  const [webhookUrl,    setWebhookUrl]    = useState("");
  const [webhookNotifAvatar, setWNA] = useState(true);
  const [webhookNotifAnim,   setWNN] = useState(true);
  const [webhookReasonAvatar, setWRA] = useState("");
  const [webhookReasonAnim,   setWRN] = useState("");
  const [webhookTitleAvatar, setWTA] = useState("");
  const [webhookColorAvatar, setWCA] = useState("");
  const [webhookTitleAnim,   setWTN] = useState("");
  const [webhookColorAnim,   setWCN] = useState("");
  const [webhookFooter,      setWF]  = useState("");

  useEffect(() => {
    return onValue(ref(db, "global"), (snap) => {
      const d = snap.val() || {};
      setAcOn(d.anticheat !== false);
      setAbOn(d.animation_blocker !== false);
      setPmAvatar(d.punishment_mode_avatar || "kick");
      setPmAnim(d.punishment_mode_anim     || "kick");
      if (d.kick_message_avatar)   setKickMsgAvatar(d.kick_message_avatar);
      if (d.kick_message_anim)     setKickMsgAnim(d.kick_message_anim);
      if (d.webhook_url)           setWebhookUrl(d.webhook_url);
      setWNA(d.webhook_notify_avatar !== false);
      setWNN(d.webhook_notify_anim   !== false);
      if (d.webhook_reason_avatar) setWRA(d.webhook_reason_avatar);
      if (d.webhook_reason_anim)   setWRN(d.webhook_reason_anim);
      if (d.webhook_title_avatar)  setWTA(d.webhook_title_avatar);
      if (d.webhook_color_avatar)  setWCA(d.webhook_color_avatar);
      if (d.webhook_title_anim)    setWTN(d.webhook_title_anim);
      if (d.webhook_color_anim)    setWCN(d.webhook_color_anim);
      if (d.webhook_footer)        setWF(d.webhook_footer);
    });
  }, []);

  const handleGlobal = async (key, val) => {
    try { await setGlobal(key, val); showToast(`${key} ${val ? "ENABLED ✅" : "DISABLED ❌"}`); }
    catch (e) { showToast("Failed: " + e.message, "error"); }
  };

  const handleMsg = async (key, val) => {
    try { await saveGlobalMsg(key, val); showToast("✅ Saved!"); }
    catch (e) { showToast("Failed: " + e.message, "error"); }
  };

  const globalToggleRow = (name, desc, checked, onToggle, color = null) => (
    <div className="global-toggle-row">
      <div>
        <div className="global-toggle-name" style={color ? { color } : {}}>{name}</div>
        <div className="global-toggle-desc">{desc}</div>
      </div>
      <Switch checked={checked} onChange={onToggle} />
    </div>
  );

  const msgRow = (label, placeholder, val, setVal, key, btnStyle = {}) => (
    <div style={{ marginBottom: 12 }}>
      <label className="modal-label">{label}</label>
      <div style={{ display: "flex", gap: 8 }}>
        <input className="modal-input" style={{ margin: 0, flex: 1 }}
          placeholder={placeholder} value={val} onChange={(e) => setVal(e.target.value)} />
        <button className="btn primary" style={btnStyle}
          onClick={() => handleMsg(key, val)}>SAVE</button>
      </div>
    </div>
  );

  return (
    <>
      {/* Global Toggles */}
      <div className="global-section">
        <div className="global-header">
          <div className="global-title">⚡ Global Controls</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)" }}>Affects all registered games</div>
        </div>
        <div className="global-body">
          {globalToggleRow("Anticheat System",
            "Avatar banned item check (body, clothing, accessories) — globally",
            acOn, (v) => { setAcOn(v); handleGlobal("anticheat", v); })}
          {globalToggleRow("Animation Blocker",
            "Banned animation check — globally",
            abOn, (v) => { setAbOn(v); handleGlobal("animation_blocker", v); }, "var(--accent4)")}

          <div className="global-toggle-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
            <div>
              <div className="global-toggle-name" style={{ color: "var(--accent5)" }}>⚔ Global Punishment — Avatar Detection</div>
              <div className="global-toggle-desc">Aksi saat avatar banned item terdeteksi (global default)</div>
            </div>
            <PunishModeGrid type="avatar" value={pmAvatar} onChange={async (m) => {
              setPmAvatar(m); await setGlobal("punishment_mode_avatar", m);
              showToast(`⚔ Global avatar mode: ${m.toUpperCase()} ✅`);
            }} />
          </div>

          <div className="global-toggle-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
            <div>
              <div className="global-toggle-name" style={{ color: "var(--accent4)" }}>⚔ Global Punishment — Animation Detection</div>
              <div className="global-toggle-desc">Aksi saat banned animation terdeteksi (global default)</div>
            </div>
            <PunishModeGrid type="anim" value={pmAnim} onChange={async (m) => {
              setPmAnim(m); await setGlobal("punishment_mode_anim", m);
              showToast(`⚔ Global anim mode: ${m.toUpperCase()} ✅`);
            }} />
          </div>
        </div>
      </div>

      {/* Kick Messages */}
      <div className="global-section" style={{ marginBottom: 32 }}>
        <div className="global-header">
          <div className="global-title">💬 Kick Messages</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)" }}>Overrideable per game</div>
        </div>
        <div className="global-body">
          {msgRow("Default Kick Message — Avatar", "[AC] Avatar dilarang terdeteksi!", kickMsgAvatar, setKickMsgAvatar, "kick_message_avatar")}
          {msgRow("Default Kick Message — Animation", "[AC] Animasi dilarang terdeteksi!", kickMsgAnim, setKickMsgAnim, "kick_message_anim")}
        </div>
      </div>

      {/* Discord Webhook */}
      <div className="global-section" style={{ marginBottom: 32 }}>
        <div className="global-header">
          <div className="global-title" style={{ color: "#5865F2" }}>🔔 Discord Webhook</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)" }}>Global notif settings</div>
        </div>
        <div className="global-body">
          <label className="modal-label">Webhook URL</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input className="modal-input" style={{ margin: 0, flex: 1 }}
              placeholder="https://discord.com/api/webhooks/..."
              value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} />
            <button className="btn" style={{ borderColor: "#5865F2", color: "#5865F2" }}
              onClick={() => handleMsg("webhook_url", webhookUrl)}>SAVE</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label className="modal-label">Notif — Avatar Detect</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Switch checked={webhookNotifAvatar} onChange={(v) => { setWNA(v); handleGlobal("webhook_notify_avatar", v); }} />
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>Kirim notif avatar</span>
              </div>
            </div>
            <div>
              <label className="modal-label">Notif — Anim Detect</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Switch checked={webhookNotifAnim} onChange={(v) => { setWNN(v); handleGlobal("webhook_notify_anim", v); }} />
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>Kirim notif anim</span>
              </div>
            </div>
          </div>

          {msgRow("Custom Reason — Avatar Notif", "Penggunaan avatar item yang dilarang", webhookReasonAvatar, setWRA, "webhook_reason_avatar",
            { borderColor: "#5865F2", color: "#5865F2" })}
          {msgRow("Custom Title — Avatar Notif", "🚨 Player — Banned Avatar Item", webhookTitleAvatar, setWTA, "webhook_title_avatar",
            { borderColor: "#5865F2", color: "#5865F2" })}
          {msgRow("Custom Color (Hex) — Avatar Notif", "e.g. #ff0000", webhookColorAvatar, setWCA, "webhook_color_avatar",
            { borderColor: "#5865F2", color: "#5865F2" })}

          {msgRow("Custom Reason — Anim Notif", "Penggunaan animasi yang dilarang", webhookReasonAnim, setWRN, "webhook_reason_anim",
            { borderColor: "#5865F2", color: "#5865F2" })}
          {msgRow("Custom Title — Anim Notif", "🚨 Player — Banned Animation", webhookTitleAnim, setWTN, "webhook_title_anim",
            { borderColor: "#5865F2", color: "#5865F2" })}
          {msgRow("Custom Color (Hex) — Anim Notif", "e.g. #ffaa00", webhookColorAnim, setWCN, "webhook_color_anim",
            { borderColor: "#5865F2", color: "#5865F2" })}

          {msgRow("Custom Footer — Notif", "Atlas Club Anti-Cheat", webhookFooter, setWF, "webhook_footer",
            { borderColor: "#5865F2", color: "#5865F2" })}
        </div>
      </div>
    </>
  );
}

// ── Overview Tab ─────────────────────────────────────────
export default function OverviewTab({ allGames, toggleGame, loadAll, showToast, onEdit, onDelete }) {
  const [search, setSearch] = useState("");

  const games = Object.entries(allGames).filter(([id, g]) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (g.name || id).toLowerCase().includes(q) ||
      (g.place_ids || []).some((p) => String(p).includes(q));
  });

  const total   = Object.keys(allGames).length;
  const enabled = Object.values(allGames).filter((g) => g.anticheat?.enabled !== false).length;

  return (
    <div id="section-overview">
      <div className="stats-row">
        <div className="stat-card"><div className="stat-label">Total Games</div><div className="stat-value">{total}</div></div>
        <div className="stat-card"><div className="stat-label">AC Enabled</div><div className="stat-value">{enabled}</div></div>
        <div className="stat-card"><div className="stat-label">AC Disabled</div><div className="stat-value red">{total - enabled}</div></div>
      </div>

      <div className="toolbar">
        <div className="toolbar-title">GAME STATUS</div>
        <button className="btn" onClick={loadAll}>↺ REFRESH</button>
      </div>

      <input
        placeholder="🔍 Search game name or place ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%", background: "var(--surface)", border: "1px solid var(--border)",
          color: "var(--text)", fontFamily: "var(--mono)", fontSize: 12,
          padding: "10px 16px", outline: "none", marginBottom: 16,
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
        onBlur={(e)  => (e.target.style.borderColor = "var(--border)")}
      />

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Game Name</th><th>Expiry</th><th>Anticheat</th><th>Anim Blocker</th>
              <th>Avatar Mode</th><th>Anim Mode</th><th>Place IDs</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!games.length
              ? <tr><td colSpan={8}><div className="state-msg"><span className="big">◎</span>{search ? "No results" : "No games yet"}</div></td></tr>
              : games.map(([id, g]) => {
                  const exp     = g.expiry || 0;
                  const expired = isExpired(exp);
                  return (
                    <tr key={id} style={{ opacity: expired ? 0.5 : 1 }}>
                      <td><div style={{ fontWeight: 700 }}>{g.name || id}</div></td>
                      <td>
                        {exp === 0
                          ? <Badge cls="active" style={{ fontSize: 9 }}>∞ PERM</Badge>
                          : expired
                            ? <Badge cls="disabled" style={{ fontSize: 9 }}>EXPIRED</Badge>
                            : <span className="badge" style={{ fontSize: 9, color: "var(--accent3)", borderColor: "var(--accent3)" }}>{formatExpiry(exp)}</span>}
                      </td>
                      <td>
                        <Switch checked={g.anticheat?.enabled !== false}
                          onChange={(v) => toggleGame(id, "anticheat", v)} />
                      </td>
                      <td>
                        <Switch checked={g.animation_blocker?.enabled !== false}
                          onChange={(v) => toggleGame(id, "animation_blocker", v)} />
                      </td>
                      <td><ModeBadge mode={g.punishment_mode_avatar} /></td>
                      <td><ModeBadge mode={g.punishment_mode_anim} /></td>
                      <td>
                        {(g.place_ids || []).map((p) => (
                          <span key={p} className="placeid-tag">{p}</span>
                        ))}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="toggle-btn edit" onClick={() => onEdit(id)}>EDIT</button>
                          <button className="toggle-btn del"  onClick={() => onDelete(id)}>DEL</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}