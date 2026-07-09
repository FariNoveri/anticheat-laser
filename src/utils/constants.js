export const pmDesc = (type) => ({
  kick:    "Player akan di-kick dari server saat terdeteksi.",
  respawn: "Player di-kill dan respawn, tidak di-kick.",
  disable: type === "anim" 
    ? "Karakter player di-refresh (LoadCharacter) secara instan."
    : "Semua pakaian, aksesoris, dan mesh pada avatar akan dihapus (Naked).",
});

// ASSET_TYPE_MAP removed — only body-part controls are supported now.

export const PART_OPTIONS = [
  { group: "🦴 Body Parts" },
  { value: "Head",      label: "Head" },
  { value: "Torso",     label: "Torso" },
  { value: "LeftArm",   label: "Left Arm" },
  { value: "RightArm",  label: "Right Arm" },
  { value: "LeftLeg",   label: "Left Leg" },
  { value: "RightLeg",  label: "Right Leg" },
  { value: "FullBody",  label: "Full Body" },
];

export const PART_CATEGORY = {
  Head: "body",
  Torso: "body",
  LeftArm: "body",
  RightArm: "body",
  LeftLeg: "body",
  RightLeg: "body",
  FullBody: "body",
};