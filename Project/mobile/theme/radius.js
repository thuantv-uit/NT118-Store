// theme/radius.js
// Quy định bo góc (border radius) cho button, card, input, container, avatar...

export const radius = {
  none: 0,
  xs: 4,     // Bo nhẹ: cho icon button, chip nhỏ
  s: 8,      // Button, input field
  m: 12,     // Card, container
  l: 16,     // Dialog, modal lớn
  xl: 24,    // Banner, sheet, hình tròn lớn
  full: 9999 // Bo tròn tuyệt đối (avatar, circle button)
};

// Gợi ý cách dùng:
// style={{ borderRadius: radius.m }}
// radius.js
// export const componentRadius = {
//   button: radius.s,
//   card: radius.m,
//   dialog: radius.l,
//   avatar: radius.full,
// };

// //cach dung borderRadius: componentRadius.card
