// const BASE_W = 412;
// const BASE_H = 892;

// // Hàm convert px sang tỉ lệ tự động
// export const wpA = (px) => `${(px / BASE_W) * 100}%`;
// export const hpA = (px) => `${(px / BASE_H) * 100}%`;


// // Các hàm vị trí tính theo % dựa trên khung Figma
// export const leftA = (x) => `${(x / BASE_W) * 100}%`;
// export const topA = (y) => `${(y / BASE_H) * 100}%`;
// export const rightA = (x, w) => `${((BASE_W - (x + w)) / BASE_W) * 100}%`;
// export const bottomA = (y, h) => `${((BASE_H - (y + h)) / BASE_H) * 100}%`;
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const BASE_W = 412;
const BASE_H = 892;

export const wpA = (px) => wp((px / BASE_W) * 100);
export const hpA = (px) => hp((px / BASE_H) * 100);
export const leftA = (x) => wp((x / BASE_W) * 100);
export const topA = (y) => hp((y / BASE_H) * 100);
export const rightA = (x, w) => wp(((BASE_W - (x + w)) / BASE_W) * 100);
export const bottomA = (y, h) => hp(((BASE_H - (y + h)) / BASE_H) * 100);
