import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

const TABS = [
  { id: "dashboard", label: "📊 DASHBOARD" },
  { id: "announce",  label: "📢 ANNOUNCE" },
  { id: "games",     label: "🎮 GAMES" },
  { id: "emotes",    label: "🎭 EMOTE / ANIM" },
  { id: "body",      label: "🦴 BODY" },
];

export default function Header({ statusText, statusCls, activeTab, onSwitchTab }) {
  return (
    <>
      <header>
        <div className="container">
          <div className="header-inner">
            <div className="logo">
              <div className="logo-icon">AL</div>
              <div className="logo-text">Anticheat<span>Laser</span></div>
            </div>
            <div className="header-status">
              <div className={`status-dot ${statusCls}`} />
              <span>{statusText}</span>
              <span style={{ color: "#2a2a2a", margin: "0 6px" }}>|</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "#333" }}>by Fari Noveri</span>
              <button
                onClick={() => signOut(auth)}
                style={{
                  marginLeft: 10, background: "transparent", border: "1px solid #1e1e1e",
                  color: "#333", fontFamily: "var(--mono)", fontSize: 9, padding: "3px 8px",
                  cursor: "pointer", textTransform: "uppercase", letterSpacing: 1,
                }}
                onMouseOver={(e) => { e.target.style.borderColor = "var(--accent2)"; e.target.style.color = "var(--accent2)"; }}
                onMouseOut={(e)  => { e.target.style.borderColor = "#1e1e1e";        e.target.style.color = "#333"; }}
              >
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      </header>

      <div style={{
        background: "rgba(8,8,8,0.95)", position: "sticky", top: 61, zIndex: 99,
        backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)",
      }}>
        <div className="container" style={{ padding: 0 }}>
          <div className="nav-wrap">
            <div className="nav-tabs">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  className={`nav-tab${activeTab === t.id ? " active" : ""}`}
                  onClick={() => onSwitchTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}