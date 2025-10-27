// Đổ bóng (nếu có)
// Token cho hiệu ứng đổ bóng, dùng cho button, card, dialog, floating action, navigation bar.
// theme/shadows.js

export const shadows = {
    none: {
        shadowColor: "transparent",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    s: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 1,
    },
    m: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
    },
    l: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    xl: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 10,
    },
    drop: {
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 4 },  // X = 0, Y = 4
        shadowOpacity: 0.25,                    // 25%
        shadowRadius: 20,                       // Blur = 20
        elevation: 8,
    },
};