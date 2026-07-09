import React, { useState, useRef, useEffect } from "react";
import { Switch, PunishModeGrid, ModeBadge, ModalOverlay, TagInput, Badge } from "./UI";
import { fetchGameName, formatExpiry, isExpired, getExpiryFromForm, slugify } from "../utils/helpers";

// ── Game Modal ────────────────────────────────────────────
export function GameModal({ show, onClose, onSave, editingGame, editingGameId }) {
  const [name, setName] = useState("");
  const [tags, setTags] = useState([]);
  const [anticheat, setAnticheat] = useState(true);
  const [animblock, setAnimblock] = useState(true);
  const [pmAvatar, setPmAvatar] = useState("global");
  const [pmAnim, setPmAnim] = useState("global");
  const [duration, setDuration] = useState("0");
  const [customExpiry, setCustomExpiry] = useState("");
  const [kmAvatar, setKmAvatar] = useState("");
  const [kmAnim, setKmAnim] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [wNotifAvatar, setWNA] = useState(true);
  const [wNotifAnim, setWNN] = useState(true);
  const [wReasonAvatar, setWRA] = useState("");
  const [wReasonAnim, setWRN] = useState("");
  const [wTitleAvatar, setWTA] = useState("");
  const [wColorAvatar, setWCA] = useState("");
  const [wTitleAnim, setWTN] = useState("");
  const [wColorAnim, setWCN] = useState("");
  const [wFooter, setWF] = useState("");
  const [expiryPreview, setExpiryPreview] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!show) return;
    if (editingGame) {
      const g = editingGame;
      setName(g.name || "");
      setTags((g.place_ids || []).map(String));
      setAnticheat(g.anticheat?.enabled !== false);
      setAnimblock(g.animation_blocker?.enabled !== false);
      setPmAvatar(g.punishment_mode_avatar || "global");
      setPmAnim(g.punishment_mode_anim || "global");
      setKmAvatar(g.kick_message_avatar || "");
      setKmAnim(g.kick_message_anim || "");
      setWebhookUrl(g.webhook_url || "");
      setWNA(g.webhook_notify_avatar !== false);
      setWNN(g.webhook_notify_anim !== false);
      setWRA(g.webhook_reason_avatar || "");
      setWRN(g.webhook_reason_anim || "");
      setWTA(g.webhook_title_avatar || "");
      setWCA(g.webhook_color_avatar || "");
      setWTN(g.webhook_title_anim || "");
      setWCN(g.webhook_color_anim || "");
      setWF(g.webhook_footer || "");
      const exp = g.expiry || 0;
      setDuration(exp === 0 ? "0" : "custom");
      setCustomExpiry(exp > 0 ? new Date(exp * 1000).toISOString().slice(0, 16) : "");
    } else {
      setName(""); setTags([]); setAnticheat(true); setAnimblock(true);
      setPmAvatar("global");
      setPmAnim("global");
      setDuration("0"); setCustomExpiry("");
      setKmAvatar(""); setKmAnim(""); setWebhookUrl("");
      setWNA(true); setWNN(true); setWRA(""); setWRN("");
      setWTA(""); setWCA(""); setWTN(""); setWCN(""); setWF("");
    }
  }, [show, editingGame]);

  useEffect(() => {
    if (duration === "0" || duration === "") { setExpiryPreview(""); return; }
    if (duration === "custom") {
      if (customExpiry) setExpiryPreview(`⏱ Expired: ${new Date(customExpiry).toLocaleString("id-ID")}`);
      return;
    }
    const exp = new Date(Date.now() + parseInt(duration) * 1000);
    setExpiryPreview(`⏱ Expired: ${exp.toLocaleString("id-ID")}`);
  }, [duration, customExpiry]);

  const handleAddTag = async (val) => {
    setTags((t) => [...t, val]);
    if (!name) {
      setName("Fetching...");
      const found = await fetchGameName(val);
      setName(found || "");
    }
  };

  const handleSave = () => {
    if (!name.trim() || !tags.length) return;
    const gameId = editingGameId || slugify(name);
    const expiry = getExpiryFromForm(duration, customExpiry);
    const data = {
      name, place_ids: tags.map(Number), expiry,
      anticheat: { enabled: anticheat },
      animation_blocker: { enabled: animblock },
      punishment_mode_avatar: pmAvatar,
      punishment_mode_anim: pmAnim,
      webhook_notify_avatar: wNotifAvatar,
      webhook_notify_anim: wNotifAnim,
      ...(kmAvatar && { kick_message_avatar: kmAvatar }),
      ...(kmAnim && { kick_message_anim: kmAnim }),
      ...(webhookUrl && { webhook_url: webhookUrl }),
      ...(wReasonAvatar && { webhook_reason_avatar: wReasonAvatar }),
      ...(wReasonAnim && { webhook_reason_anim: wReasonAnim }),
      ...(wTitleAvatar && { webhook_title_avatar: wTitleAvatar }),
      ...(wColorAvatar && { webhook_color_avatar: wColorAvatar }),
      ...(wTitleAnim && { webhook_title_anim: wTitleAnim }),
      ...(wColorAnim && { webhook_color_anim: wColorAnim }),
      ...(wFooter && { webhook_footer: wFooter }),
    };
    onSave(gameId, data);
  };

  return (
    <ModalOverlay show={show} onClose={onClose}>
      <div className="modal" style={{ width: "min(600px,100%)", maxHeight: "90vh", overflowY: "auto" }}>
        <div className="modal-title">{editingGame ? `✏️ Edit — ${editingGame.name}` : "+ Add Game"}</div>
        <div className="modal-sub">Register game. Script otomatis detect dari PlaceId.</div>

        <label className="modal-label">Game Name</label>
        <input className="modal-input" placeholder="Atlas Club Main" value={name} onChange={(e) => setName(e.target.value)} />

        <label className="modal-label">Place IDs <span style={{ color: "var(--muted)" }}>(press Enter to add)</span></label>
        <TagInput tags={tags} onAdd={handleAddTag} onRemove={(i) => setTags((t) => t.filter((_, j) => j !== i))} inputRef={inputRef} />

        <label className="modal-label">Durasi Aktif</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          <select className="modal-select" style={{ margin: 0 }} value={duration} onChange={(e) => setDuration(e.target.value)}>
            <option value="0">∞ Permanen</option>
            <option value="604800">7 Hari</option>
            <option value="1209600">14 Hari</option>
            <option value="2592000">30 Hari</option>
            <option value="7776000">90 Hari</option>
            <option value="custom">Custom tanggal...</option>
          </select>
          {duration === "custom" && (
            <input type="datetime-local" value={customExpiry} onChange={(e) => setCustomExpiry(e.target.value)}
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "var(--mono)", fontSize: 12, padding: "10px 14px", outline: "none" }} />
          )}
        </div>
        {expiryPreview && <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent3)", marginBottom: 16 }}>{expiryPreview}</div>}

        <label className="modal-label">Anticheat (Avatar)</label>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Switch checked={anticheat} onChange={setAnticheat} />
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>Enable avatar anticheat</span>
        </div>

        <label className="modal-label">Animation Blocker</label>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Switch checked={animblock} onChange={setAnimblock} />
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>Enable animation blocker</span>
        </div>

        <label className="modal-label">⚔ Punishment — Avatar Detection</label>
        <PunishModeGrid type="avatar" value={pmAvatar} onChange={setPmAvatar} allowGlobal={true} />

        <label className="modal-label" style={{ marginTop: 8 }}>⚔ Punishment — Animation Detection</label>
        <PunishModeGrid type="anim" value={pmAnim} onChange={setPmAnim} allowGlobal={true} />

        {/* Webhook Override */}
        <div className="webhook-block">
          <span className="webhook-label">🔔 Discord Webhook Override (per game)</span>
          <label className="modal-label">Webhook URL <span style={{ color: "var(--muted)" }}>(kosong = pakai global)</span></label>
          <input className="modal-input" style={{ marginBottom: 10 }} placeholder="Default: Menggunakan URL Global"
            value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div>
              <label className="modal-label">Notif Avatar</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Switch checked={wNotifAvatar} onChange={setWNA} />
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)" }}>kirim notif avatar</span>
              </div>
            </div>
            <div>
              <label className="modal-label">Notif Anim</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Switch checked={wNotifAnim} onChange={setWNN} />
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)" }}>kirim notif anim</span>
              </div>
            </div>
          </div>
          <label className="modal-label">Custom Reason Avatar</label>
          <input className="modal-input" style={{ marginBottom: 10 }} placeholder="Default: Penggunaan avatar item yang dilarang"
            value={wReasonAvatar} onChange={(e) => setWRA(e.target.value)} />
          <label className="modal-label">Custom Reason Anim</label>
          <input className="modal-input" style={{ marginBottom: 10 }} placeholder="Default: Penggunaan animasi yang dilarang"
            value={wReasonAnim} onChange={(e) => setWRN(e.target.value)} />

          <label className="modal-label">Custom Title Avatar</label>
          <input className="modal-input" style={{ marginBottom: 10 }} placeholder="Default: 🚨 Player — Banned Avatar Item"
            value={wTitleAvatar} onChange={(e) => setWTA(e.target.value)} />
          <label className="modal-label">Custom Color Avatar</label>
          <input className="modal-input" style={{ marginBottom: 10 }} placeholder="Default: #e74c3c (Merah)"
            value={wColorAvatar} onChange={(e) => setWCA(e.target.value)} />

          <label className="modal-label">Custom Title Anim</label>
          <input className="modal-input" style={{ marginBottom: 10 }} placeholder="Default: 🚨 Player — Banned Animation"
            value={wTitleAnim} onChange={(e) => setWTN(e.target.value)} />
          <label className="modal-label">Custom Color Anim</label>
          <input className="modal-input" style={{ marginBottom: 10 }} placeholder="Default: #ff8e10 (Oranye)"
            value={wColorAnim} onChange={(e) => setWCN(e.target.value)} />

          <label className="modal-label">Custom Footer</label>
          <input className="modal-input" style={{ marginBottom: 0 }} placeholder="Default: LASER Anti-Cheat"
            value={wFooter} onChange={(e) => setWF(e.target.value)} />
        </div>

        <label className="modal-label" style={{ marginTop: 16 }}>Custom Kick Message — Avatar</label>
        <input className="modal-input" placeholder="Kosong = pakai pesan global" value={kmAvatar} onChange={(e) => setKmAvatar(e.target.value)} />
        <label className="modal-label">Custom Kick Message — Anim</label>
        <input className="modal-input" placeholder="Kosong = pakai pesan global" value={kmAnim} onChange={(e) => setKmAnim(e.target.value)} />

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>CANCEL</button>
          <button className="btn primary" onClick={handleSave}>{editingGame ? "UPDATE" : "SAVE GAME"}</button>
        </div>
      </div>
    </ModalOverlay>
  );
}

// ── Games Tab ─────────────────────────────────────────────
export default function GamesTab({ allGames, toggleGame, loadAll, onAdd, onEdit, onDelete }) {
  const [search, setSearch] = useState("");

  const games = Object.entries(allGames).filter(([id, g]) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (g.name || id).toLowerCase().includes(q) ||
      (g.place_ids || []).some((p) => String(p).includes(q));
  });

  return (
    <div id="section-games">
      <div className="toolbar">
        <div className="toolbar-title">GAME LIST</div>
        <div className="toolbar-right">
          <button className="btn primary" onClick={onAdd}>+ ADD GAME</button>
          <button className="btn" onClick={loadAll}>↺ REFRESH</button>
        </div>
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
        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
      />

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Game Name</th><th>Expiry</th><th>Place IDs</th>
              <th>Anticheat</th><th>Anim Blocker</th>
              <th>Avatar Mode</th><th>Anim Mode</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!games.length
              ? <tr><td colSpan={8}><div className="state-msg"><span className="big">🎮</span>No games yet</div></td></tr>
              : games.map(([id, g]) => {
                const exp = g.expiry || 0;
                const expired = isExpired(exp);
                const acOn = g.anticheat?.enabled !== false;
                const abOn = g.animation_blocker?.enabled !== false;
                return (
                  <tr key={id} style={{ opacity: expired ? 0.5 : 1 }}>
                    <td style={{ fontWeight: 700 }}>{g.name || id}</td>
                    <td>
                      {exp === 0
                        ? <Badge cls="active" style={{ fontSize: 9 }}>∞ PERM</Badge>
                        : expired
                          ? <Badge cls="disabled" style={{ fontSize: 9 }}>EXPIRED</Badge>
                          : <span className="badge" style={{ fontSize: 9, color: "var(--accent3)", borderColor: "var(--accent3)" }}>{formatExpiry(exp)}</span>}
                    </td>
                    <td>{(g.place_ids || []).map((p) => <span key={p} className="placeid-tag">{p}</span>)}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Switch checked={acOn} onChange={(v) => toggleGame(id, "anticheat", v)} />
                        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: acOn ? "var(--accent)" : "var(--accent2)" }}>
                          {acOn ? "ON" : "OFF"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Switch checked={abOn} onChange={(v) => toggleGame(id, "animation_blocker", v)} />
                        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: abOn ? "var(--accent4)" : "var(--accent2)" }}>
                          {abOn ? "ON" : "OFF"}
                        </span>
                      </div>
                    </td>
                    <td><ModeBadge mode={g.punishment_mode_avatar} type="avatar" /></td>
                    <td><ModeBadge mode={g.punishment_mode_anim} type="anim" /></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="toggle-btn edit" onClick={() => onEdit(id)}>EDIT</button>
                        <button className="toggle-btn del" onClick={() => onDelete(id)}>DEL</button>
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