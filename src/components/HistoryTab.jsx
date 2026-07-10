import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/config";
import { EmptyState } from "./UI";

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

  return (
    <div className="history-tab">
      <div className="toolbar" style={{ marginBottom: 24 }}>
        <div className="toolbar-title">🧾 TRANSAKSI / PURCHASE HISTORY</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>
          Data sinkronisasi otomatis dari Roblox (MarketplaceService)
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: 140 }}>📅 TANGGAL (WIB)</th>
              <th style={{ width: 150 }}>👤 PEMBELI</th>
              <th>🎮 NAMA GAME</th>
              <th style={{ width: 120 }}>📦 DURASI</th>
              <th style={{ width: 200 }}>🔑 GAME ID</th>
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
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
