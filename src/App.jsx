import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import { useToast } from "./hooks/useToast";
import { useStore } from "./hooks/useStore";

import LoginScreen from "./components/LoginScreen";
import Header from "./components/Header";
import { Toast } from "./components/UI";
import { ForcePushBar, GlobalControls } from "./components/OverviewTab";
import GamesTab, { GameModal } from "./components/GamesTab";
import AnimationsTab from "./components/AnimationsTab";
import AvatarsTab from "./components/AvatarsTab";
import AnnounceTab from "./components/AnnounceTab";
import { ConfirmDeleteModal } from "./components/UI";

export default function App() {
  const [user, setUser] = useState(undefined);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [status, setStatus] = useState({ text: "CONNECTING...", cls: "yellow" });
  const [gameModal, setGameModal] = useState(false);
  const [editingGameId, setEditingGameId] = useState(null);
  const [deleteGameId, setDeleteGameId] = useState(null);

  const { toast, showToast } = useToast();
  const store = useStore(showToast);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      if (u) loadData();
    });
  }, []);

  const loadData = async () => {
    setStatus({ text: "FETCHING...", cls: "yellow" });
    const ok = await store.loadAll();
    setStatus(ok ? { text: "CONNECTED", cls: "" } : { text: "ERROR", cls: "red" });
  };

  const handleSaveGame = async (gameId, data) => {
    try {
      await store.saveGame(gameId, data);
      setGameModal(false);
      setEditingGameId(null);
      showToast(`✅ ${data.name} ${editingGameId ? "updated" : "added"}!`);
    } catch (e) {
      showToast("Failed: " + e.message, "error");
    }
  };

  const handleToggleGame = async (id, feature, val) => {
    try {
      await store.toggleGame(id, feature, val);
      showToast(`${store.allGames[id]?.name || id}: ${feature} ${val ? "✅" : "❌"}`);
    } catch (e) {
      showToast("Failed: " + e.message, "error");
    }
  };

  const handleDeleteGame = async () => {
    try {
      await store.deleteGame(deleteGameId);
      setDeleteGameId(null);
      showToast(`🗑️ ${deleteGameId} deleted`);
    } catch (e) {
      showToast("Failed: " + e.message, "error");
    }
  };

  const openEditGame = (id) => { setEditingGameId(id); setGameModal(true); };
  const openAddGame = () => { setEditingGameId(null); setGameModal(true); };
  const switchTab = (tab) => setActiveTab(tab);

  if (user === undefined) return null;
  if (!user) return <LoginScreen />;

  return (
    <>
      <Header
        statusText={status.text}
        statusCls={status.cls}
        activeTab={activeTab}
        onSwitchTab={switchTab}
      />

      <main>
        <div className="container">
          {activeTab === "dashboard" && (
            <>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>📊 Dashboard</div>
                <div style={{ color: "var(--muted)", fontSize: 12 }}>Realtime push, global controls, dan webhook settings.</div>
              </div>
              <ForcePushBar onPush={async () => {
                try { await store.touchUpdatedAt(); showToast("⚡ Config dipush! Server Roblox akan update dalam ~2 detik"); }
                catch (e) { showToast("Failed: " + e.message, "error"); }
              }} />
              <GlobalControls setGlobal={store.setGlobal} saveGlobalMsg={store.saveGlobalMsg} showToast={showToast} />
            </>
          )}

          {activeTab === "games" && (
            <GamesTab
              allGames={store.allGames}
              toggleGame={handleToggleGame}
              loadAll={loadData}
              onAdd={openAddGame}
              onEdit={openEditGame}
              onDelete={(id) => setDeleteGameId(id)}
            />
          )}

          {activeTab === "emotes" && (
            <AnimationsTab
              allAnims={store.allAnims}
              allGames={store.allGames}
              saveAnim={store.saveAnim}
              deleteAnim={store.deleteAnim}
              toggleAnimExclude={store.toggleAnimExclude}
              showToast={showToast}
            />
          )}

          {activeTab === "body" && (
            <AvatarsTab
              onlyBody
              allAvatars={store.allAvatars}
              allGames={store.allGames}
              saveAvatar={store.saveAvatar}
              deleteAvatar={store.deleteAvatar}
              toggleAvatarExclude={store.toggleAvatarExclude}
              showToast={showToast}
            />
          )}

          {activeTab === "announce" && (
            <AnnounceTab
              allGames={store.allGames}
              showToast={showToast}
            />
          )}
        </div>
      </main>

      <GameModal
        show={gameModal}
        onClose={() => { setGameModal(false); setEditingGameId(null); }}
        onSave={handleSaveGame}
        editingGame={editingGameId ? store.allGames[editingGameId] : null}
        editingGameId={editingGameId}
      />

      <ConfirmDeleteModal
        show={!!deleteGameId}
        onClose={() => setDeleteGameId(null)}
        onConfirm={handleDeleteGame}
        title="🗑️ Delete Game"
        message={`Delete <strong style="color:var(--accent2)">${store.allGames[deleteGameId]?.name || deleteGameId}</strong>? Cannot be undone.`}
      />

      <Toast toast={toast} />
    </>
  );
}