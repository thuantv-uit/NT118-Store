export const mockUser = {
  name: 'NT118',
  avatar: 'https://via.placeholder.com/60?text=HM',
  followers: 111,
  following: 111,
};

export const mockOrdersTabs = [
  { icon: 'bag-handle-outline', label: 'Đơn hàng bán', color: '#FF6B9D' },
  { icon: 'star-outline', label: 'Đang giao', color: '#FF6B9D' },
  { icon: 'time-outline', label: 'Lịch sử', color: '#FF6B9D' },
];

export const mockUtilities = [
  { icon: 'document-text-outline', label: 'Cài đặt' },
  { icon: 'card-outline', label: 'Chính sách' },
  { icon: 'help-circle-outline', label: 'Trở chuyển' },
  { icon: 'swap-horizontal-outline', label: 'Với sinh' },
  { icon: 'people-outline', label: 'Bảo mật' },
  { icon: 'chatbubble-outline', label: 'Hỗ trợ' },
  // Chỉ dùng 6, bỏ 2 cuối
];

export const mockExpenses = [
  {
    title: 'Tổng chi',
    value: '1.234.567đ',
    trend: '+1.234.567đ',
    color: '#FF6B9D',
    icon: 'trending-up',
  },
  {
    title: 'Tổng đơn hàng',
    value: '15 đơn hàng',
    trend: '+2 đơn hàng',
    color: '#4CAF50',
    icon: 'trending-up',
  },
  {
    title: 'Top danh mục',
    value: 'Đồ ăn',
    trend: 'Áo nữ',
    color: '#FF9800',
    icon: 'pie-chart',
  },
  {
    title: 'Chi tiêu tháng',
    value: '500.000đ',
    trend: '-100.000đ',
    color: '#F44336',
    icon: 'trending-down',
  },
];