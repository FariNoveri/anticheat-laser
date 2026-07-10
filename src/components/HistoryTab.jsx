import React, { useState, useEffect } from "react";
import { ref, onValue, set, remove, push } from "firebase/database";
import { db } from "../firebase/config";
import { EmptyState, Modal, ConfirmDeleteModal } from "./UI";

export default function HistoryTab() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const historyRef = ref(db, "purchase_history");
    const unsub = onValue(historyRef, (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        // Convert object to array and sort by timestamp descending
        const arr = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => b.timestamp - a.timestamp);
        setHistory(arr);
      } else {
        setHistory([]);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    buyerName: "",
    gameName: "",
    gameId: "",
    durationDays: 3
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ buyerName: "", gameName: "", gameId: "", durationDays: 3 });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      buyerName: item.buyerName || "",
      gameName: item.gameName || "",
      gameId: item.gameId || "",
      durationDays: item.durationDays || 0
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      durationDays: parseInt(formData.durationDays, 10) || 0
    };

    if (editingItem) {
      await set(ref(db, `purchase_history/${editingItem.id}`), {
        ...editingItem,
        ...dataToSave
      });
    } else {
      dataToSave.timestamp = Math.floor(Date.now() / 1000);
      const newRef = push(ref(db, "purchase_history"));
      await set(newRef, dataToSave);
    }
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await remove(ref(db, `purchase_history/${deleteId}`));
      setDeleteId(null);
    }
  };

  return (
    <div className="history-tab">
      <div className="toolbar" style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="toolbar-title">🧾 TRANSAKSI / PURCHASE HISTORY</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>
            Data sinkronisasi otomatis dari Roblox (MarketplaceService)
          </div>
        </div>
        <button className="btn primary" onClick={handleOpenAdd}>
          + TAMBAH TRANSAKSI
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: 140 }}>📅 TANGGAL (WIB)</th>
              <th style={{ width: 150 }}>👤 PEMBELI</th>
              <th>🎮 NAMA GAME</th>
              <th style={{ width: 120 }}>📦 DURASI</th>
              <th style={{ width: 150 }}>🔑 GAME ID</th>
              <th style={{ width: 100 }}>⚙️ AKSI</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <EmptyState icon="⏳" text="Memuat riwayat transaksi..." />
            ) : history.length === 0 ? (
              <EmptyState icon="📂" text="Belum ada transaksi sama sekali." />
            ) : (
              history.map((item) => {
                const date = new Date(item.timestamp * 1000);
                // format date like 15-Aug-2026 14:00
                const dateStr = date.toLocaleString("id-ID", { 
                  day: "2-digit", month: "short", year: "numeric", 
                  hour: "2-digit", minute: "2-digit"
                });

                return (
                  <tr key={item.id}>
                    <td style={{ color: "var(--muted)" }}>{dateStr}</td>
                    <td style={{ fontWeight: 600, color: "var(--accent)" }}>{item.buyerName || "Unknown"}</td>
                    <td>{item.gameName}</td>
                    <td><span className="badge mode-respawn">+{item.durationDays} Hari</span></td>
                    <td style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)" }}>{item.gameId}</td>
                    <td>
                      <div className="actions" style={{ display: "flex", gap: "6px" }}>
                        <button className="btn sm outline" onClick={() => handleOpenEdit(item)}>Edit</button>
                        <button className="btn sm danger" onClick={() => setDeleteId(item.id)}>Del</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal show={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? "✏️ Edit Transaksi" : "➕ Tambah Transaksi"}>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column" }}>
          <label className="modal-label">Nama Pembeli / Player</label>
          <input className="modal-input" type="text" value={formData.buyerName} onChange={e => setFormData({ ...formData, buyerName: e.target.value })} placeholder="CahayaLuna" required />
          
          <label className="modal-label">Nama Game</label>
          <input className="modal-input" type="text" value={formData.gameName} onChange={e => setFormData({ ...formData, gameName: e.target.value })} placeholder="RP Nusantara" required />
          
          <label className="modal-label">Game ID (Place ID)</label>
          <input className="modal-input" type="number" value={formData.gameId} onChange={e => setFormData({ ...formData, gameId: e.target.value })} placeholder="123456789" required />
          
          <label className="modal-label">Durasi (Hari)</label>
          <input className="modal-input" type="number" value={formData.durationDays} onChange={e => setFormData({ ...formData, durationDays: e.target.value })} required />
          
          <div className="modal-actions" style={{ marginTop: 24 }}>
            <button type="button" className="btn" onClick={() => setModalOpen(false)}>CANCEL</button>
            <button type="submit" className="btn primary">SAVE</button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal
        show={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="🗑️ Hapus Transaksi"
        message="Yakin ingin menghapus riwayat transaksi ini? Data tidak dapat dikembalikan."
      />
    </div>
  );
}
