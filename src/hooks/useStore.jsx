import { useState, useCallback } from "react";
import { ref, get, set, remove, onValue } from "firebase/database";
import { db } from "../firebase/config";

export function useStore(showToast) {
  const [allGames,   setAllGames]   = useState({});
  const [allAnims,   setAllAnims]   = useState({ global: {}, per_game: {}, excluded: {} });
  const [allAvatars, setAllAvatars] = useState({ global: {}, per_game: {}, excluded: {} });

  // ── helpers ─────────────────────────────────────────────
  async function touchUpdatedAt() {
    const ts = Math.floor(Date.now() / 1000);
    await set(ref(db, "global/updated_at"), ts);
    return ts;
  }

  const autoPush = useCallback(async () => {
    try { await touchUpdatedAt(); } catch { /* silent */ }
  }, []);

  // ── load all ─────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    try {
      const [gSnap, aSnap, avSnap] = await Promise.all([
        get(ref(db, "games")),
        get(ref(db, "banned_animations")),
        get(ref(db, "banned_avatars")),
      ]);
      const games    = gSnap.val()  || {};
      const rawAnims = aSnap.val()  || {};
      const rawAvs   = avSnap.val() || {};
      setAllGames(games);
      setAllAnims({
        global:   rawAnims.global   || {},
        per_game: rawAnims.per_game || {},
        excluded: rawAnims.excluded || {},
      });
      setAllAvatars({
        global:   rawAvs.global   || {},
        per_game: rawAvs.per_game || {},
        excluded: rawAvs.excluded || {},
      });
      return true;
    } catch (e) {
      showToast("Failed: " + e.message, "error");
      return false;
    }
  }, [showToast]);

  // ── games ────────────────────────────────────────────────
  const saveGame = useCallback(async (gameId, data) => {
    await set(ref(db, `games/${gameId}`), data);
    setAllGames((prev) => ({ ...prev, [gameId]: data }));
    await autoPush();
  }, [autoPush]);

  const deleteGame = useCallback(async (gameId) => {
    await remove(ref(db, `games/${gameId}`));
    setAllGames((prev) => { const n = { ...prev }; delete n[gameId]; return n; });
    await autoPush();
  }, [autoPush]);

  const toggleGame = useCallback(async (gameId, feature, val) => {
    await set(ref(db, `games/${gameId}/${feature}/enabled`), val);
    setAllGames((prev) => ({
      ...prev,
      [gameId]: { ...prev[gameId], [feature]: { enabled: val } },
    }));
    await autoPush();
  }, [autoPush]);

  // ── global ───────────────────────────────────────────────
  const setGlobal = useCallback(async (key, val) => {
    await set(ref(db, `global/${key}`), val);
    await autoPush();
  }, [autoPush]);

  const saveGlobalMsg = useCallback(async (key, val) => {
    await set(ref(db, `global/${key}`), val);
    await autoPush();
  }, [autoPush]);

  // ── animations ───────────────────────────────────────────
  const saveAnim = useCallback(async (scope, id, entry, oldId = null) => {
    const isGlobal = scope === "global";
    const path = isGlobal
      ? `banned_animations/global/${id}`
      : `banned_animations/per_game/${scope}/${id}`;
    await set(ref(db, path), entry);
    setAllAnims((prev) => {
      const next = structuredClone(prev);
      if (isGlobal) next.global[id] = entry;
      else {
        next.per_game = next.per_game || {};
        next.per_game[scope] = next.per_game[scope] || {};
        next.per_game[scope][id] = entry;
      }
      if (oldId && oldId !== id) {
        if (isGlobal) delete next.global[oldId];
        else if (next.per_game?.[scope]) delete next.per_game[scope][oldId];
      }
      return next;
    });
    await autoPush();
  }, [autoPush]);

  const deleteAnim = useCallback(async (scope, id) => {
    const isGlobal = scope === "global";
    await remove(ref(db, isGlobal
      ? `banned_animations/global/${id}`
      : `banned_animations/per_game/${scope}/${id}`));
    setAllAnims((prev) => {
      const next = structuredClone(prev);
      if (isGlobal) delete next.global[id];
      else if (next.per_game?.[scope]) delete next.per_game[scope][id];
      return next;
    });
    await autoPush();
  }, [autoPush]);

  const toggleAnimExclude = useCallback(async (scope, id, exclude) => {
    const path = `banned_animations/excluded/${scope}/${id}`;
    if (exclude) {
      await set(ref(db, path), true);
      setAllAnims((prev) => {
        const next = structuredClone(prev);
        next.excluded = next.excluded || {};
        next.excluded[scope] = next.excluded[scope] || {};
        next.excluded[scope][id] = true;
        return next;
      });
    } else {
      await remove(ref(db, path));
      setAllAnims((prev) => {
        const next = structuredClone(prev);
        if (next.excluded?.[scope]) delete next.excluded[scope][id];
        return next;
      });
    }
    await autoPush();
  }, [autoPush]);

  // ── avatars ──────────────────────────────────────────────
  const saveAvatar = useCallback(async (scope, id, entry, oldId = null) => {
    const isGlobal = scope === "global";
    const path = isGlobal
      ? `banned_avatars/global/${id}`
      : `banned_avatars/per_game/${scope}/${id}`;
    await set(ref(db, path), entry);
    setAllAvatars((prev) => {
      const next = structuredClone(prev);
      if (isGlobal) next.global[id] = entry;
      else {
        next.per_game = next.per_game || {};
        next.per_game[scope] = next.per_game[scope] || {};
        next.per_game[scope][id] = entry;
      }
      if (oldId && oldId !== id) {
        if (isGlobal) delete next.global[oldId];
        else if (next.per_game?.[scope]) delete next.per_game[scope][oldId];
      }
      return next;
    });
    await autoPush();
  }, [autoPush]);

  const deleteAvatar = useCallback(async (scope, id) => {
    const isGlobal = scope === "global";
    await remove(ref(db, isGlobal
      ? `banned_avatars/global/${id}`
      : `banned_avatars/per_game/${scope}/${id}`));
    setAllAvatars((prev) => {
      const next = structuredClone(prev);
      if (isGlobal) delete next.global[id];
      else if (next.per_game?.[scope]) delete next.per_game[scope][id];
      return next;
    });
    await autoPush();
  }, [autoPush]);

  const toggleAvatarExclude = useCallback(async (scope, id, exclude) => {
    const path = `banned_avatars/excluded/${scope}/${id}`;
    if (exclude) {
      await set(ref(db, path), true);
      setAllAvatars((prev) => {
        const next = structuredClone(prev);
        next.excluded = next.excluded || {};
        next.excluded[scope] = next.excluded[scope] || {};
        next.excluded[scope][id] = true;
        return next;
      });
    } else {
      await remove(ref(db, path));
      setAllAvatars((prev) => {
        const next = structuredClone(prev);
        if (next.excluded?.[scope]) delete next.excluded[scope][id];
        return next;
      });
    }
    await autoPush();
  }, [autoPush]);

  return {
    allGames, allAnims, allAvatars,
    loadAll,
    saveGame, deleteGame, toggleGame,
    setGlobal, saveGlobalMsg,
    saveAnim, deleteAnim, toggleAnimExclude,
    saveAvatar, deleteAvatar, toggleAvatarExclude,
    touchUpdatedAt,
  };
}