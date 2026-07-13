import React, { useState } from "react";
import { ScopeSelector, ModalOverlay, ConfirmDeleteModal } from "./UI";
import { PART_OPTIONS, PART_CATEGORY } from "../utils/constants";
import { fetchWithProxy, detectPartFromAssetType, catIcon, partCategory } from "../utils/helpers";

const BODY_PART_OPTIONS = [
  { value: "Head", label: "Head" },
  { value: "Torso", label: "Torso" },
  { value: "LeftArm", label: "LeftArm" },
  { value: "RightArm", label: "RightArm" },
  { value: "LeftLeg", label: "LeftLeg" },
  { value: "RightLeg", label: "RightLeg" },
  { value: "FullBody", label: "Full Body" },
];

const CAT_FILTERS = [
  { id: "body", label: "🦴 Body" },
];

// ── Part Selector ─────────────────────────────────────────
function PartSelector({ value, onChange, onlyBody = false }) {
  const options = onlyBody ? BODY_PART_OPTIONS : PART_OPTIONS;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, maxHeight: 200, overflowY: "auto", marginBottom: 10 }}>
      {options.map((opt, i) => {
        if (opt.group) {
          return (
            <div key={i} style={{ width: "100%", fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 2, margin: "6px 0 3px", paddingBottom: 3, borderBottom: "1px solid #1a1a1a" }}>
              {opt.group}
            </div>
          );
        }
        const sel = value === opt.value;
        return (
          <button key={opt.value} type="button"
            style={{ fontFamily: "var(--mono)", fontSize: 9, padding: "4px 8px", border: `1px solid ${sel ? "var(--accent5)" : "var(--border)"}`, background: sel ? "var(--accent5)" : "transparent", color: sel ? "#000" : "var(--muted)", cursor: "pointer", textTransform: "uppercase", letterSpacing: 0.5 }}
            onClick={() => onChange(opt.value)}>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Avatar Modal (Add / Edit) ─────────────────────────────
function AvatarModal({ show, onClose, onSave, scope, allGames, editRow, onlyBody = false }) {
  const [rows, setRows] = useState([{ id: "", note: "", part: onlyBody ? "Head" : "Any", name: "", status: null, fetching: false }]);

  React.useEffect(() => {
    if (!show) return;
    if (editRow) {
      setRows([{ id: editRow.id, note: editRow.data?.note || "", part: editRow.data?.part || (onlyBody ? "Head" : "Any"), name: editRow.data?.name || "", status: null, fetching: false }]);
    } else {
      setRows([{ id: "", note: "", part: onlyBody ? "Head" : "Any", name: "", status: null, fetching: false }]);
    }
  }, [show, editRow, onlyBody]);

  const update = (i, patch) => setRows((r) => r.map((row, j) => j === i ? { ...row, ...patch } : row));

  const fetchInfo = async (i) => {
    const itemId = rows[i].id.trim();
    if (!itemId) return;
    update(i, { fetching: true, status: "Fetching from Roblox Catalog..." });
    const detail = await fetchWithProxy(`https://catalog.roblox.com/v1/catalog/items/${itemId}/details?itemType=Asset`);
    if (!detail?.name) {
      update(i, { fetching: false, status: "⚠ Item tidak terdeteksi — pilih Part manual" });
    } else {
      const detected = detectPartFromAssetType(detail.assetType);
      update(i, { fetching: false, part: detected.part, name: detail.name, note: rows[i].note || detail.name, status: `✅ ${detail.name} | ${detected.label} | AssetType: ${detail.assetType}` });
    }
  };

  const addRow = () => setRows((r) => [...r, { id: "", note: "", part: onlyBody ? "Head" : "Any", name: "", status: null, fetching: false }]);
  const removeRow = (i) => setRows((r) => r.filter((_, j) => j !== i));

  const handleSave = () => {
    const valid = rows.filter((r) => r.id.trim());
    if (!valid.length) return;
    onSave(valid, editRow?.id || null);
  };

  const scopeLabel = scope === "global" ? "🌍 Global" : `🎮 ${allGames[scope]?.name || scope}`;

  return (
    <ModalOverlay show={show} onClose={onClose}>
      <div className="modal blue" style={{ width: "min(560px,100%)", maxHeight: "90vh", overflowY: "auto" }}>
        <div className="modal-title">{editRow ? "✏️ Edit Avatar Item" : "👕 Add Banned Avatar Item"}</div>
        <div className="modal-sub">
          Adding to: <span style={{ color: "var(--accent3)" }}>{scopeLabel}</span><br />
          <span style={{ color: "var(--muted)", fontSize: 10 }}>Klik 🔍 untuk auto-detect tipe item dari Roblox Catalog</span>
        </div>

        {rows.map((row, i) => (
          <div key={i} style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: 12, marginBottom: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 28px", gap: 6, alignItems: "center", marginBottom: 8 }}>
              <input className="modal-input" placeholder="Item ID" style={{ margin: 0 }}
                value={row.id} onChange={(e) => update(i, { id: e.target.value })} />
              <button className="btn blue" style={{ padding: "6px 12px", fontSize: 11 }}
                onClick={() => fetchInfo(i)} disabled={row.fetching}>
                {row.fetching ? "..." : "🔍 Auto"}
              </button>
              {i === 0
                ? <span style={{ color: "var(--muted)", textAlign: "center" }}>—</span>
                : <span style={{ cursor: "pointer", color: "var(--muted)", textAlign: "center", fontSize: 16 }}
                    onClick={() => removeRow(i)}
                    onMouseOver={(e) => (e.target.style.color = "var(--accent2)")}
                    onMouseOut={(e)  => (e.target.style.color = "var(--muted)")}>✕</span>}
            </div>

            {row.status && (
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: row.status.startsWith("✅") ? "var(--accent)" : "var(--accent3)", marginBottom: 8 }}>
                {row.status}
              </div>
            )}

            <div className="modal-label">Body Part</div>
            <PartSelector value={row.part} onChange={(v) => update(i, { part: v })} onlyBody={onlyBody} />

            <input className="modal-input" placeholder="Note (opsional)" style={{ margin: 0 }}
              value={row.note} onChange={(e) => update(i, { note: e.target.value })} />
          </div>
        ))}

        {!editRow && (
          <button onClick={addRow}
            style={{ background: "transparent", border: "1px dashed #333", color: "var(--muted)", fontFamily: "var(--mono)", fontSize: 11, padding: 7, width: "100%", cursor: "pointer", marginBottom: 16 }}
            onMouseOver={(e) => { e.target.style.borderColor = "var(--accent5)"; e.target.style.color = "var(--accent5)"; }}
            onMouseOut={(e)  => { e.target.style.borderColor = "#333";           e.target.style.color = "var(--muted)"; }}>
            + Tambah Baris
          </button>
        )}

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>CANCEL</button>
          <button className="btn blue" onClick={handleSave}>{editRow ? "SAVE" : "ADD SEMUA"}</button>
        </div>
      </div>
    </ModalOverlay>
  );
}

// ── Avatars Tab ───────────────────────────────────────────
export default function AvatarsTab({ allAvatars, allGames, saveAvatar, deleteAvatar, toggleAvatarExclude, showToast, onlyBody = false }) {
  const [scope,        setScope]        = useState("global");
  const [search,       setSearch]       = useState("");
  const [catFilter,    setCatFilter]    = useState(onlyBody ? "body" : "all");
  const [showModal,    setShowModal]    = useState(false);
  const [editRow,      setEditRow]      = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selected,     setSelected]     = useState([]);

  const isGlobal = scope === "global";

  const itemIds = isGlobal
    ? Object.keys(allAvatars.global || {})
    : [...new Set([...Object.keys(allAvatars.global || {}), ...Object.keys(allAvatars.per_game?.[scope] || {})])];

  const filtered = itemIds.filter((id) => {
    const data = allAvatars.global?.[id] || allAvatars.per_game?.[scope]?.[id];
    if (onlyBody) {
      const cat = PART_CATEGORY[data?.part || "Any"] || "accessory";
      if (cat !== "body") return false;
    } else if (catFilter !== "all") {
      const cat = PART_CATEGORY[data?.part || "Any"] || "accessory";
      if (cat !== catFilter) return false;
    }
    if (!search) return true;
    const q = search.toLowerCase();
    return id.includes(q) || (data?.note || "").toLowerCase().includes(q) || (data?.part || "").toLowerCase().includes(q);
  });

  const toggleSel = (id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const clearSel  = () => setSelected([]);

  const handleSave = async (rows, oldId) => {
    let added = 0, updated = 0, skipped = 0;
    for (const row of rows) {
      const existing = isGlobal ? allAvatars.global[row.id] : allAvatars.per_game?.[scope]?.[row.id];
      if (existing && !oldId) { skipped++; continue; }
      const entry = { part: row.part, note: row.note || row.name, added_at: existing?.added_at || Math.floor(Date.now() / 1000) };
      await saveAvatar(scope, row.id, entry, oldId !== row.id ? oldId : null);
      oldId ? updated++ : added++;
    }
    setShowModal(false);
    showToast(`✅ ${[added && `${added} added`, updated && `${updated} updated`, skipped && `${skipped} skipped`].filter(Boolean).join(", ")}!`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteAvatar(deleteTarget.scope, deleteTarget.id);
    setDeleteTarget(null);
    showToast(`🗑️ Item ${deleteTarget.id} removed`);
  };

  const bulkAction = async (action, targetScope) => {
    if (!selected.length) return;
    
    if (action === "move") {
      if (!confirm(`Move ${selected.length} avatar(s) to ${targetScope === "global" ? "Global" : allGames[targetScope]?.name || targetScope}?`)) return;
      let moved = 0;
      for (const id of selected) {
        const data = isGlobal ? allAvatars.global?.[id] : allAvatars.per_game?.[scope]?.[id];
        if (!data) continue;
        await saveAvatar(targetScope, id, data);
        await deleteAvatar(scope, id);
        moved++;
      }
      clearSel();
      showToast(`✅ Moved ${moved} avatar(s) to ${targetScope === "global" ? "Global" : allGames[targetScope]?.name || targetScope}!`);
      return;
    }

    if (!confirm(`${action.toUpperCase()} ${selected.length} avatar(s)?`)) return;
    for (const id of selected) {
      if (action === "delete")  await deleteAvatar(scope, id);
      else if (action === "disable" && !isGlobal) await toggleAvatarExclude(scope, id, true);
      else if (action === "enable"  && !isGlobal) await toggleAvatarExclude(scope, id, false);
    }
    clearSel();
    showToast(`✅ ${action} ${selected.length} avatar(s)!`);
  };

  return (
    <div id="section-avatars">
      <div className="toolbar">
        <div className="toolbar-title">{onlyBody ? "BANNED BODY ITEMS" : "BANNED AVATAR ITEMS"}</div>
        <div className="toolbar-right">
          <button className="btn blue" onClick={() => { setEditRow(null); setShowModal(true); }}>+ ADD</button>
        </div>
      </div>

      {!onlyBody && (
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)" }}>Filter:</span>
          {CAT_FILTERS.map((f) => (
            <button key={f.id} className="btn sm"
              style={{ borderColor: catFilter === f.id ? "var(--accent5)" : "var(--border)", color: catFilter === f.id ? "var(--accent5)" : "var(--text)" }}
              onClick={() => setCatFilter(f.id)}>{f.label}</button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)" }}>View / Add to:</span>
        <ScopeSelector value={scope} onChange={setScope} allGames={allGames} accentVar="--accent5" />
        {selected.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent3)" }}>{selected.length} selected</span>
            {!isGlobal && <button className="btn sm" style={{ color: "var(--accent2)" }} onClick={() => bulkAction("disable")}>🚫 Disable</button>}
            {!isGlobal && <button className="btn sm" style={{ color: "var(--accent)" }}  onClick={() => bulkAction("enable")}>✅ Enable</button>}
            <button className="btn sm" style={{ color: "var(--accent2)" }} onClick={() => bulkAction("delete")}>🗑️ Delete</button>
            <select
              className="modal-select"
              style={{ margin: 0, width: "auto", fontSize: 10, padding: "4px 8px", minHeight: 24 }}
              value=""
              onChange={(e) => {
                if (e.target.value) bulkAction("move", e.target.value);
              }}
            >
              <option value="" disabled>➡️ Move to...</option>
              {scope !== "global" && <option value="global">🌍 Global</option>}
              {Object.entries(allGames).map(([id, g]) => (
                scope !== id ? <option key={id} value={id}>🎮 {g.name || id}</option> : null
              ))}
            </select>
            <button className="btn sm" onClick={clearSel}>✕ Clear</button>
          </div>
        )}
      </div>

      <input placeholder={onlyBody ? "🔍 Search body item ID or note..." : "🔍 Search item ID or note..."} value={search} onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "var(--mono)", fontSize: 12, padding: "10px 16px", outline: "none", marginBottom: 16 }}
        onFocus={(e) => (e.target.style.borderColor = "var(--accent5)")}
        onBlur={(e)  => (e.target.style.borderColor = "var(--border)")} />

      <div className="table-wrap" style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: 32 }}>
                <input type="checkbox" style={{ cursor: "pointer", accentColor: "var(--accent5)" }}
                  onChange={(e) => e.target.checked ? setSelected(filtered) : clearSel()} />
              </th>
              <th>Item ID</th><th>Part / Type</th><th>Category</th><th>Note</th><th>Added</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {!filtered.length
              ? <tr><td colSpan={8}><div className="state-msg"><span className="big">🦴</span>{onlyBody ? "No banned body items" : `No banned items${catFilter !== "all" ? " in this category" : ""}`}</div></td></tr>
              : filtered.map((id) => {
                  const gData  = allAvatars.global?.[id];
                  const pgData = allAvatars.per_game?.[scope]?.[id];
                  const excluded = !isGlobal && !!allAvatars.excluded?.[scope]?.[id];
                  const data   = gData || pgData;
                  const part   = data?.part || "Any";
                  const cat    = PART_CATEGORY[part] || "accessory";
                  const note   = data?.note || "—";
                  const added  = data?.added_at ? new Date(data.added_at * 1000).toLocaleDateString() : "—";

                  let statusEl;
                  if (isGlobal)      statusEl = <span className="badge active">GLOBAL</span>;
                  else if (excluded) statusEl = <span className="badge disabled">EXCLUDED</span>;
                  else if (gData)    statusEl = <span className="badge global">GLOBAL</span>;
                  else if (pgData)   statusEl = <span className="badge blue">PER-GAME</span>;
                  else               statusEl = <span className="badge" style={{ color: "#333", borderColor: "#222" }}>—</span>;

                  return (
                    <tr key={id}>
                      <td>
                        <input type="checkbox" checked={selected.includes(id)} onChange={() => toggleSel(id)}
                          style={{ cursor: "pointer", accentColor: "var(--accent5)" }} />
                      </td>
                      <td>
                        <span style={{ color: "var(--accent5)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 11 }}
                          onClick={() => navigator.clipboard.writeText(id)}>{id}</span>
                      </td>
                      <td><span className={`badge part-${cat}`} style={{ fontSize: 9 }}>{catIcon(cat)}{part}</span></td>
                      <td><span className={`badge part-${cat}`} style={{ fontSize: 9 }}>{catIcon(cat)}{cat.toUpperCase()}</span></td>
                      <td style={{ color: "var(--muted)", fontSize: 11, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={note}>{note}</td>
                      <td style={{ color: "var(--muted)", fontSize: 11 }}>{added}</td>
                      <td>{statusEl}</td>
                      <td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button className="toggle-btn edit"
                            onClick={() => { setEditRow({ id, data: gData || pgData }); setShowModal(true); }}>EDIT</button>
                          {!isGlobal && gData && !excluded && (
                            <button className="toggle-btn" style={{ color: "var(--accent3)", borderColor: "rgba(255,170,0,0.3)", fontSize: 9, padding: "4px 6px" }}
                              onClick={() => { toggleAvatarExclude(scope, id, true); showToast("🚫 Item excluded"); }}>EXCL</button>
                          )}
                          {!isGlobal && excluded && (
                            <button className="toggle-btn" style={{ color: "var(--accent)", borderColor: "rgba(0,255,136,0.3)", fontSize: 9, padding: "4px 6px" }}
                              onClick={() => { toggleAvatarExclude(scope, id, false); showToast("✅ Item re-enabled"); }}>RE-EN</button>
                          )}
                          <button className="toggle-btn del"
                            onClick={() => setDeleteTarget({ id, scope: isGlobal ? "global" : scope })}>DEL</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      <AvatarModal show={showModal} onClose={() => setShowModal(false)} onSave={handleSave}
        scope={scope} allGames={allGames} editRow={editRow} onlyBody={onlyBody} />

      <ConfirmDeleteModal
        show={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="🗑️ Remove Avatar Item"
        message={`Hapus item ID <strong style="color:var(--accent2)">${deleteTarget?.id}</strong>?`}
      />
    </div>
  );
}