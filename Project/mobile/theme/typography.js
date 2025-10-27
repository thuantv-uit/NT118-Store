// theme/typography.js
// Typography system — semantic + numeric (title1, body1, label1...)
// Fonts: Baloo2, Athiti, Bellota, Mali, Bellota Text, Borel

export const typography = {
  // ===== DISPLAY (hero / splash) =====
  display1: {
    fontFamily: "Borel-Regular",
    fontSize: 48,
    lineHeight: Math.round(48 * 1.2),
    // fontWeight: "400",
  },
  display2: {
    fontFamily: "Borel-Regular",
    fontSize: 36,
    lineHeight: Math.round(36 * 1.25),
    // fontWeight: "400",
  },

  // ===== TITLES (page / section headings) =====
  title1: {
    fontFamily: "Baloo2-Bold",
    fontSize: 28,
    lineHeight: Math.round(28 * 1.25),
    // fontWeight: "700",
  },
  title2: {
    fontFamily: "Baloo2-SemiBold",
    fontSize: 24,
    lineHeight: Math.round(24 * 1.25),
    // fontWeight: "600",
  },
  title3: {
    fontFamily: "Baloo2-Regular",
    fontSize: 20,
    lineHeight: Math.round(20 * 1.25),
    // fontWeight: "500",
  },

  // ===== HEADLINES (section / card headers) =====
  headline1: {
    fontFamily: "Athiti-SemiBold",
    fontSize: 18,
    lineHeight: Math.round(18 * 1.3),
    // fontWeight: "600",
  },
  headline2: {
    fontFamily: "Athiti-Regular",
    fontSize: 16,
    lineHeight: Math.round(16 * 1.3),
    // fontWeight: "400",
  },
  headline3: {
    fontFamily: "Athiti-Medium",
    fontSize: 15,
    lineHeight: Math.round(15 * 1.3),
    // fontWeight: "300",
  },

  // ===== BODY (main content text) =====
  body1: {
    fontFamily: "Bellota-Bold",
    fontSize: 16,
    lineHeight: Math.round(16 * 1.4),
    // fontWeight: "700",
  },
  body2: {
    fontFamily: "Bellota-Regular",
    fontSize: 15,
    lineHeight: Math.round(15 * 1.4),
    // fontWeight: "400",
  },
  body3: {
    fontFamily: "Bellota-Light",
    fontSize: 14,
    lineHeight: Math.round(14 * 1.4),
    // fontWeight: "300",
  },

  // ===== LABELS / BUTTONS =====
  label1: {
    fontFamily: "Mali-SemiBold",
    fontSize: 18,
    lineHeight: Math.round(18 * 1.25),
    // fontWeight: "600",
    letterSpacing: 0.2,
  },
  label2: {
    fontFamily: "Mali-SemiBold",
    fontSize: 16,
    lineHeight: Math.round(16 * 1.25),
    // fontWeight: "600",
    letterSpacing: 0.2,
  },
  label3: {
    fontFamily: "Mali-SemiBold",
    fontSize: 14,
    lineHeight: Math.round(14 * 1.25),
    // fontWeight: "600",
    letterSpacing: 0.3,
  },

  // ===== CAPTIONS =====
  caption2:{
    fontFamily: "BellotaText-Regular",
    fontSize: 13,
    lineHeight: Math.round(13 * 1.3),
    fontWeight: "400",
  },
  caption3: {
    fontFamily: "BellotaText-Light",
    fontSize: 13,
    lineHeight: Math.round(13 * 1.3),
    // fontWeight: "300",
  },
  caption1: {
    fontFamily: "BellotaText-Bold",
    fontSize: 13,
    lineHeight: Math.round(13 * 1.3),
    // fontWeight: "300",
  },

  // ===== DECORATIVE =====
  handwritten1: {
    fontFamily: "Borel-Regular",
    fontSize: 24,
    lineHeight: Math.round(24 * 2.4),
    // fontWeight: "400",
    textAlign: "center",
  },
  handwritten2: {
    fontFamily: "Borel-Regular",
    fontSize: 20,
    lineHeight: Math.round(20 * 2.2),
    // fontWeight: "400",
  },
};
