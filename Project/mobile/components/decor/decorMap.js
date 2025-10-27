import { theme } from "@/theme";

export const decorMap = {
  cone1: {
    base: require("@/assets/images/decor/cone1.png"),
    mask: require("@/assets/images/decor/cone1.png"),
    light: require("@/assets/images/decor/back.png"),
    gradientColors: null,
    size: 58,
    opacity: 0.7,
  },
  cone2: {
    base: require("@/assets/images/decor/cone2.png"),
    mask: require("@/assets/images/decor/cone2.png"),
    light: null,
    gradientColors: ["#E79796", "#f2a59aff"],
    size: 80,
    opacity: 0.73,
  },
  cone3: {
    base: require("@/assets/images/decor/cone3.png"),
    mask: require("@/assets/images/decor/cone3.png"),
    light: null,
    gradientColors: ["#d89e9eff", "#ff3b3bff"],
    size: 80,
    opacity: 0.73,
  },
  cone4: {
    base: require("@/assets/images/decor/cone4.png"),
    mask: require("@/assets/images/decor/cone4.png"),
    light: null,
    gradientColors: ["#ffc1c1c7", "#a12d2dff"],
    size: 80,
    opacity: 0.73,
    ...theme.shadows.drop,
  },

//   sphere1: {
//     base: require("@/assets/images/decor/sphere1.png"),
//     mask: require("@/assets/images/decor/sphere_mask.png"),
//     light: require("@/assets/images/decor/light_soft.png"),
//     gradientColors: null,
//     size: 90,
//     opacity: 0.6,
//   },
  // thêm các decor khác ở đây...
};
