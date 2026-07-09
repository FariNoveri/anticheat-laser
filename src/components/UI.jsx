import React from "react";
import { pmDesc } from "../utils/constants";
import { formatExpiry, isExpired } from "../utils/helpers";

// ── Toggle Switch ────────────────────────────────────────
export function Switch({ checked, onChange }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div className="switch-track" />
      <div className="switch-thumb" />
    </label>
  );
}

// ── Badge ────────────────────────────────────────────────
export function Badge({ cls, children, style = {} }) {
  return <span className={`badge ${cls}`} style={style}>{children}</span>;
}

export function ModeBadge({ mode, type }) {
  const m = (mode || "kick").toLowerCase();
  const disableLabel = type === "anim" ? "🔄 REFRESH" : "👕 NAKED";
  const labels = { kick: "🚫 KICK", respawn: "♻ RESPAWN", disable: disableLabel };
  return <Badge cls={`mode-${m}`}>{labels[m] || m.toUpperCase()}</Badge>;
}

export function ExpiryBadge({ expiry }) {
  if (expiry === 0) return <Badge cls="active" style={{ fontSize: 9 }}>∞ PERM</Badge>;
  if (isExpired(expiry)) return <Badge cls="disabled" style={{ fontSize: 9 }}>EXPIRED</Badge>;
  return (
    <span className="badge" style={{ fontSize: 9, color: "var(--accent3)", borderColor: "var(--accent3)" }}>
      {formatExpiry(expiry)}
    </span>
  );
}

// ── Punishment Mode Grid ─────────────────────────────────
export function PunishModeGrid({ type, value, onChange }) {
  const modes = ["kick", "respawn", "disable"];

  const labels = {
    kick:    { icon: "🚫 KICK",     sub: "keluarkan" },
    respawn: { icon: "♻ RESPAWN",  sub: "kill+respawn" },
    disable: type === "anim" 
      ? { icon: "🔄 REFRESH", sub: "LoadCharacter" } 
      : { icon: "👕 NAKED", sub: "hapus baju" },
  };

  return (
    <>
      <div className="punish-mode-grid">
        {modes.map((m) => (
          <button
            key={m}
            type="button"
            className={`punish-mode-btn${value === m ? ` sel-${m}` : ""}`}
            onClick={() => onChange(m)}
          >
            {labels[m].icon}
            <br />
            <span style={{ fontSize: 9, opacity: 0.7 }}>{labels[m].sub}</span>
          </button>
        ))}
      </div>
      <div className="punish-mode-desc">{pmDesc(type)[value] || ""}</div>
    </>
  );
} 

// ── Modal Overlay ────────────────────────────────────────
export function ModalOverlay({ show, onClose, children, variant = "" }) {
  if (!show) return null;
  return (
    <div className="modal-overlay show" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {children}
    </div>
  );
}

// ── Confirm Delete Modal ─────────────────────────────────
export function ConfirmDeleteModal({ show, onClose, onConfirm, title, message }) {
  return (
    <ModalOverlay show={show} onClose={onClose}>
      <div className="modal danger">
        <div className="modal-title">{title}</div>
        <div className="modal-sub" dangerouslySetInnerHTML={{ __html: message }} />
        <div className="modal-actions">
          <button className="btn" onClick={onClose}>CANCEL</button>
          <button className="btn danger" onClick={onConfirm}
            style={{ borderColor: "var(--accent2)", background: "rgba(255,60,60,0.1)" }}>DELETE</button>
        </div>
      </div>
    </ModalOverlay>
  );
}

// ── Toast ────────────────────────────────────────────────
export function Toast({ toast }) {
  return (
    <div id="toast" className={toast.show ? `show ${toast.type}` : ""}>
      {toast.msg}
    </div>
  );
}

// ── Scope Selector (game dropdown) ───────────────────────
export function ScopeSelector({ value, onChange, allGames, accentVar = "--accent4" }) {
  const options = [
    { value: "global", label: "🌍 Global (semua game)" },
    ...Object.entries(allGames).map(([id, g]) => ({ value: id, label: `🎮 ${g.name || id}` })),
  ];
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)",
        fontFamily: "var(--mono)", fontSize: 11, padding: "7px 10px", outline: "none",
        minWidth: 200, transition: "border-color 0.15s",
      }}
      onFocus={(e) => (e.target.style.borderColor = `var(${accentVar})`)}
      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// ── Tag Input ────────────────────────────────────────────
export function TagInput({ tags, onAdd, onRemove, inputRef, placeholder = "e.g. 12345678" }) {
  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = e.target.value.trim();
      if (val && !isNaN(val)) { onAdd(val); e.target.value = ""; }
    }
  };
  return (
    <div className="tag-input-wrap" onClick={() => inputRef?.current?.focus()}>
      {tags.map((id, i) => (
        <span key={id} className="tag-item">
          {id}
          <span className="tag-remove" onClick={() => onRemove(i)}>×</span>
        </span>
      ))}
      <input
        ref={inputRef}
        className="tag-input"
        placeholder={placeholder}
        type="number"
        onKeyDown={handleKey}
      />
    </div>
  );
}

// ── Empty / Loading state ────────────────────────────────
export function EmptyState({ icon, text }) {
  return (
    <tr>
      <td colSpan={12}>
        <div className="state-msg">
          <span className="big">{icon}</span>{text}
        </div>
      </td>
    </tr>
  );
}