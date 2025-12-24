export const mockUser = {
  name: 'NT118',
  avatar: require('../../../assets/images/welcome/Logo_welcome.svg'),
  followers: 111,
  following: 111,
};

export const mockOrdersTabs = [
  { icon: 'bag-handle-outline', label: 'Đơn hàng mua', color: '#FF6B9D' },
  { icon: 'star-outline', label: 'Đang giao', color: '#FF6B9D' },
  { icon: 'time-outline', label: 'Lịch sử', color: '#FF6B9D' },
];

export const mockUtilities = [
  { icon: 'settings', label: 'Cài đặt' },
  { icon: 'format-list-bulleted', label: 'Danh sách yêu thích' },
  { icon: 'emoji-transportation', label: 'Giao hàng' },
  { icon: 'payment', label: 'Thanh toán' },
  { icon: 'security', label: 'Bảo mật' },
  { icon: 'contact-support', label: 'Hỗ trợ' },
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
