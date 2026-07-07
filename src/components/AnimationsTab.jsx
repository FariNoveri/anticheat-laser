import React, { useState } from "react";
import { ScopeSelector, ModalOverlay, ConfirmDeleteModal } from "./UI";
import { fetchWithProxy } from "../utils/helpers";

// ── Anim Modal (Add / Edit) ───────────────────────────────
function AnimModal({ show, onClose, onSave, scope, allGames, editRow }) {
  const [rows, setRows] = useState([{ id: "", note: "", name: "", storeUrl: "", status: null, fetching: false }]);

  React.useEffect(() => {
    if (!show) return;
    if (editRow) {
      setRows([{ id: editRow.id, note: editRow.data?.note || "", name: editRow.data?.name || "",
        storeUrl: editRow.data?.store_url || "", status: editRow.data?.name ? `✅ ${editRow.data.name}` : null, fetching: false }]);
    } else {
      setRows([{ id: "", note: "", name: "", storeUrl: "", status: null, fetching: false }]);
    }
  }, [show, editRow]);

  const update = (i, patch) => setRows((r) => r.map((row, j) => j === i ? { ...row, ...patch } : row));

  const fetchInfo = async (i) => {
    const animId = rows[i].id.trim();
    if (!animId) return;
    update(i, { fetching: true, status: "Fetching..." });
    const data = await fetchWithProxy(`https://catalog.roblox.com/v1/catalog/items/${animId}/details?itemType=Asset`);
    if (!data?.name) {
      update(i, { fetching: false, status: "⚠ Tidak terdeteksi" });
    } else {
      const slug = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const url  = `https://create.roblox.com/store/asset/${animId}/${slug}`;
      update(i, { fetching: false, name: data.name, storeUrl: url, note: rows[i].note || data.name, status: `✅ ${data.name}` });
    }
  };

  const addRow = () => setRows((r) => [...r, { id: "", note: "", name: "", storeUrl: "", status: null, fetching: false }]);
  const removeRow = (i) => setRows((r) => r.filter((_, j) => j !== i));

  const handleSave = () => {
    const valid = rows.filter((r) => r.id.trim());
    if (!valid.length) return;
    onSave(valid, editRow?.id || null);
  };

  const scopeLabel = scope === "global" ? "🌍 Global" : `🎮 ${allGames[scope]?.name || scope}`;

  return (
    <ModalOverlay show={show} onClose={onClose}>
      <div className="modal purple">
        <div className="modal-title">{editRow ? "✏️ Edit Animation" : "🎭 Add Banned Animation"}</div>
        <div className="modal-sub">Adding to: <span style={{ color: "var(--accent3)" }}>{scopeLabel}</span></div>

        {rows.map((row, i) => (
          <div key={i} style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "10px 12px", marginBottom: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 28px", gap: 6, alignItems: "center", marginBottom: 6 }}>
              <input className="modal-input" placeholder="Animation ID" style={{ margin: 0 }}
                value={row.id} onChange={(e) => update(i, { id: e.target.value })} />
              <button className="btn sm" style={{ borderColor: "rgba(170,68,255,0.4)", color: "var(--accent4)" }}
                onClick={() => fetchInfo(i)} disabled={row.fetching}>
                {row.fetching ? "..." : "🔍"}
              </button>
              {i === 0
                ? <span style={{ color: "var(--muted)", textAlign: "center" }}>—</span>
                : <span style={{ cursor: "pointer", color: "var(--muted)", textAlign: "center", fontSize: 16 }}
                    onClick={() => removeRow(i)}
                    onMouseOver={(e) => (e.target.style.color = "var(--accent2)")}
                    onMouseOut={(e)  => (e.target.style.color = "var(--muted)")}>✕</span>}
            </div>
            {row.status && (
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: row.status.startsWith("✅") ? "var(--accent4)" : "var(--accent3)", marginBottom: 6 }}>
                {row.status}
              </div>
            )}
            <input className="modal-input" placeholder="Note (opsional)" style={{ margin: 0 }}
              value={row.note} onChange={(e) => update(i, { note: e.target.value })} />
          </div>
        ))}

        {!editRow && (
          <button onClick={addRow}
            style={{ background: "transparent", border: "1px dashed #333", color: "var(--muted)", fontFamily: "var(--mono)", fontSize: 11, padding: 7, width: "100%", cursor: "pointer", marginBottom: 16 }}
            onMouseOver={(e) => { e.target.style.borderColor = "var(--accent4)"; e.target.style.color = "var(--accent4)"; }}
            onMouseOut={(e) =>  { e.target.style.borderColor = "#333";           e.target.style.color = "var(--muted)"; }}>
            + Tambah Baris
          </button>
        )}

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>CANCEL</button>
          <button className="btn purple" onClick={handleSave}>{editRow ? "SAVE" : "ADD SEMUA"}</button>
        </div>
      </div>
    </ModalOverlay>
  );
}

// ── Animations Tab ────────────────────────────────────────
export default function AnimationsTab({ allAnims, allGames, saveAnim, deleteAnim, toggleAnimExclude, showToast }) {
  const [scope,      setScope]      = useState("global");
  const [search,     setSearch]     = useState("");
  const [showModal,  setShowModal]  = useState(false);
  const [editRow,    setEditRow]    = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selected,   setSelected]   = useState([]);

  const isGlobal = scope === "global";

  const animIds = isGlobal
    ? Object.keys(allAnims.global || {})
    : [...new Set([...Object.keys(allAnims.global || {}), ...Object.keys(allAnims.per_game?.[scope] || {})])];

  const filtered = animIds.filter((id) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return id.includes(q) || (allAnims.global?.[id]?.note || "").toLowerCase().includes(q);
  });

  const toggleSel = (id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const clearSel  = () => setSelected([]);

  const handleSave = async (rows, oldId) => {
    let added = 0, updated = 0, skipped = 0;
    for (const row of rows) {
      const existing = isGlobal ? allAnims.global[row.id] : allAnims.per_game?.[scope]?.[row.id];
      if (existing && !oldId) { skipped++; continue; }
      const entry = { note: row.note, added_at: existing?.added_at || Math.floor(Date.now() / 1000), ...(row.name && { name: row.name }), ...(row.storeUrl && { store_url: row.storeUrl }) };
      await saveAnim(scope, row.id, entry, oldId !== row.id ? oldId : null);
      oldId ? updated++ : added++;
    }
    setShowModal(false);
    showToast(`✅ ${[added && `${added} added`, updated && `${updated} updated`, skipped && `${skipped} skipped`].filter(Boolean).join(", ")}!`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteAnim(deleteTarget.scope, deleteTarget.id);
    setDeleteTarget(null);
    showToast(`🗑️ Anim ${deleteTarget.id} removed`);
  };

  const bulkAction = async (action) => {
    if (!selected.length || !confirm(`${action.toUpperCase()} ${selected.length} animation(s)?`)) return;
    for (const id of selected) {
      if (action === "delete")  await deleteAnim(scope, id);
      else if (action === "disable" && !isGlobal) await toggleAnimExclude(scope, id, true);
      else if (action === "enable"  && !isGlobal) await toggleAnimExclude(scope, id, false);
    }
    clearSel();
    showToast(`✅ ${action} ${selected.length} animation(s)!`);
  };

  return (
    <div id="section-animations">
      <div className="toolbar">
        <div className="toolbar-title">BANNED ANIMATIONS</div>
        <div className="toolbar-right">
          <button className="btn purple" onClick={() => { setEditRow(null); setShowModal(true); }}>+ ADD</button>
          <button className="btn" onClick={() => {}}>↺</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)" }}>View / Add to:</span>
        <ScopeSelector value={scope} onChange={setScope} allGames={allGames} accentVar="--accent4" />
        {selected.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent3)" }}>{selected.length} selected</span>
            {!isGlobal && <button className="btn sm" style={{ color: "var(--accent2)" }} onClick={() => bulkAction("disable")}>🚫 Disable</button>}
            {!isGlobal && <button className="btn sm" style={{ color: "var(--accent)" }}  onClick={() => bulkAction("enable")}>✅ Enable</button>}
            <button className="btn sm" style={{ color: "var(--accent2)" }} onClick={() => bulkAction("delete")}>🗑️ Delete</button>
            <button className="btn sm" onClick={clearSel}>✕ Clear</button>
          </div>
        )}
      </div>

      <input placeholder="🔍 Search animation ID or note..." value={search} onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "var(--mono)", fontSize: 12, padding: "10px 16px", outline: "none", marginBottom: 16 }}
        onFocus={(e) => (e.target.style.borderColor = "var(--accent4)")}
        onBlur={(e)  => (e.target.style.borderColor = "var(--border)")} />

      <div className="table-wrap" style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: 32 }}>
                <input type="checkbox" style={{ cursor: "pointer", accentColor: "var(--accent4)" }}
                  onChange={(e) => e.target.checked ? setSelected(filtered) : clearSel()} />
              </th>
              <th>Animation ID</th><th>Note</th><th>Added</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {!filtered.length
              ? <tr><td colSpan={6}><div className="state-msg"><span className="big">🎭</span>No banned animations</div></td></tr>
              : filtered.map((id) => {
                  const gData  = allAnims.global?.[id];
                  const pgData = allAnims.per_game?.[scope]?.[id];
                  const excluded = !isGlobal && !!allAnims.excluded?.[scope]?.[id];
                  const data   = gData || pgData;
                  const added  = data?.added_at ? new Date(data.added_at * 1000).toLocaleDateString() : "—";
                  const note   = data?.note || "—";

                  let statusEl;
                  if (isGlobal)          statusEl = <span className="badge active">GLOBAL</span>;
                  else if (excluded)     statusEl = <span className="badge disabled">EXCLUDED</span>;
                  else if (gData)        statusEl = <span className="badge global">GLOBAL</span>;
                  else if (pgData)       statusEl = <span className="badge purple">PER-GAME</span>;
                  else                   statusEl = <span className="badge" style={{ color: "#333", borderColor: "#222" }}>—</span>;

                  return (
                    <tr key={id}>
                      <td>
                        <input type="checkbox" className="anim-check" checked={selected.includes(id)} onChange={() => toggleSel(id)}
                          style={{ cursor: "pointer", accentColor: "var(--accent4)" }} />
                      </td>
                      <td>
                        <span style={{ color: "var(--accent4)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 11 }}
                          onClick={() => navigator.clipboard.writeText(id)}>{id}</span>
                      </td>
                      <td><span style={{ color: "var(--muted)", fontSize: 11 }}>{note}</span></td>
                      <td style={{ color: "var(--muted)", fontSize: 11 }}>{added}</td>
                      <td>{statusEl}</td>
                      <td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button className="toggle-btn edit"
                            onClick={() => { setEditRow({ id, data: gData || pgData }); setShowModal(true); }}>EDIT</button>
                          {!isGlobal && gData && !excluded && (
                            <button className="toggle-btn" style={{ color: "var(--accent3)", borderColor: "rgba(255,170,0,0.3)", fontSize: 9, padding: "4px 6px" }}
                              onClick={() => { toggleAnimExclude(scope, id, true); showToast("🚫 Anim excluded"); }}>
                              EXCL
                            </button>
                          )}
                          {!isGlobal && excluded && (
                            <button className="toggle-btn" style={{ color: "var(--accent)", borderColor: "rgba(0,255,136,0.3)", fontSize: 9, padding: "4px 6px" }}
                              onClick={() => { toggleAnimExclude(scope, id, false); showToast("✅ Anim re-enabled"); }}>
                              RE-EN
                            </button>
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

      <AnimModal show={showModal} onClose={() => setShowModal(false)} onSave={handleSave}
        scope={scope} allGames={allGames} editRow={editRow} />

      <ConfirmDeleteModal
        show={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="🗑️ Remove Animation"
        message={`Hapus animation ID <strong style="color:var(--accent2)">${deleteTarget?.id}</strong>?`}
      />
    </div>
  );
}