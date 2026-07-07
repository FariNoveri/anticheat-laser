import { PART_CATEGORY } from "./constants";

export function formatExpiry(expiry) {
  if (!expiry || expiry === 0) return "∞ Permanen";
  const now = Math.floor(Date.now() / 1000);
  if (now > expiry) return "⚠ EXPIRED";
  const diff = expiry - now;
  const left = diff < 86400 ? `${Math.floor(diff / 3600)}h` : `${Math.floor(diff / 86400)}d`;
  return `${new Date(expiry * 1000).toLocaleDateString("id-ID")} (${left})`;
}

export function isExpired(expiry) {
  if (!expiry || expiry === 0) return false;
  return Math.floor(Date.now() / 1000) > expiry;
}

export function getExpiryFromForm(duration, customValue) {
  if (duration === "0") return 0;
  if (duration === "custom") return customValue ? Math.floor(new Date(customValue).getTime() / 1000) : 0;
  return Math.floor(Date.now() / 1000) + parseInt(duration);
}

export function partCategory(part) {
  return PART_CATEGORY[part] || "accessory";
}

export function partBadgeClass(part) {
  return `part-${partCategory(part)}`;
}

const catIcons = { body:"🦴", clothing:"👔", accessory:"🎩", hair:"💇", face:"💄", gear:"⚙", layered:"🧥" };
export function catIcon(cat) { return catIcons[cat] || ""; }

export function detectPartFromAssetType(assetType) {
  // Asset type detection removed — return unknown/default mapping.
  return { part: "Any", category: "accessory", label: "❓ Unknown" };
}

const proxies = [
  (url) => `https://api.codetabs.com/v1/proxy?quest=${url}`,
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
];

export async function fetchWithProxy(targetUrl) {
  for (const makeUrl of proxies) {
    try {
      const res = await fetch(makeUrl(targetUrl), { signal: AbortSignal.timeout(5000) });
      if (!res.ok) continue;
      return JSON.parse(await res.text());
    } catch (e) { continue; }
  }
  return null;
}

export async function fetchGameName(placeId) {
  try {
    const uni = await fetchWithProxy(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`);
    const universeId = uni?.universeId;
    if (!universeId) return null;
    const game = await fetchWithProxy(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
    return game?.data?.[0]?.name || null;
  } catch { return null; }
}

export function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
}

export function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
}