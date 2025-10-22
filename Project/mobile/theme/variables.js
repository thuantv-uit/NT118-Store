// Các biến chung khác (opacity, transition, v.v.)
//Đây là nơi gom các biến logic / giá trị toàn cục, giúp app dễ tùy chỉnh theme & responsive.

// theme/variables.js

export const variables = {
  // Tỷ lệ khung hình app (cho responsive)
  screenBaseWidth: 412,   // kích thước frame Figma bạn đang design
  screenBaseHeight: 892,

  // Animation
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
    easing: {
      standard: "ease-in-out",
      decel: "cubic-bezier(0.05, 0.7, 0.1, 1)",
      accel: "cubic-bezier(0.4, 0, 0.6, 1)",
    },
  },

  // Border width mặc định
  borderWidth: {
    thin: 1,
    medium: 2,
    thick: 3,
  },

  // Opacity levels
  opacity: {
    disabled: 0.4,
    pressed: 0.7,
    overlay: 0.15,
  },

  // Z-index token
  zIndex: {
    base: 1,
    dropdown: 10,
    modal: 100,
    overlay: 1000,
  },
};
