const BASE_W = 412;
const BASE_H = 892;

export const wpA = (px) => wp((px / BASE_W) * 100);
export const hpA = (px) => hp((px / BASE_H) * 100);
export const leftA = (x) => wp((x / BASE_W) * 100);
export const topA = (y) => hp((y / BASE_H) * 100);
export const rightA = (x, w) => wp(((BASE_W - (x + w)) / BASE_W) * 100);
export const bottomA = (y, h) => hp(((BASE_H - (y + h)) / BASE_H) * 100);