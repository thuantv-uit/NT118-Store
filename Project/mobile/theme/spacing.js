// Khoảng cách / Padding / Margin chuẩn
// theme/spacing.js

// Quy ước scale 8px → giúp đồng nhất bố cục toàn app
export const spacing = {
  xxs: 2,    // Rất nhỏ: dùng cho icon spacing nhỏ
  xs: 4,     // Nhỏ: spacing giữa icon & text
  s: 8,      // Mặc định nhỏ: padding nhỏ, gap nhỏ
  m: 12,     // Trung bình: spacing giữa nhóm item
  l: 16,     // Lớn: khoảng cách giữa các block
  xl: 24,    // Rất lớn: padding của container
  xxl: 32,   // Cực lớn: margin ngoài màn hình
  huge: 48,  // Dùng cho section hoặc hero layout
};

// Gợi ý cách dùng:
// style={{ padding: spacing.m, marginBottom: spacing.l }}


// // spacing.js
// export const layoutSpacing = {
//   screenPadding: spacing.xl,
//   sectionGap: spacing.l,
//   elementGap: spacing.s,
// };
//cach dung paddingHorizontal: layoutSpacing.screenPadding
