const BASE_W = 412;
const BASE_H = 892;

// Hàm convert px sang tỉ lệ tự động
export const wpA = (px) => `${(px / BASE_W) * 100}%`;
export const hpA = (px) => `${(px / BASE_H) * 100}%`;


// Các hàm vị trí tính theo % dựa trên khung Figma
export const leftA = (x) => `${(x / BASE_W) * 100}%`;
export const topA = (y) => `${(y / BASE_H) * 100}%`;
export const rightA = (x, w) => `${((BASE_W - (x + w)) / BASE_W) * 100}%`;
export const bottomA = (y, h) => `${((BASE_H - (y + h)) / BASE_H) * 100}%`;