export const pmDesc = {
  kick:    "Player akan di-kick dari server saat terdeteksi.",
  respawn: "Player di-kill dan respawn, tidak di-kick.",
  disable: "Animasi langsung dihentikan. Player tidak di-kick maupun di-respawn.",
};

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