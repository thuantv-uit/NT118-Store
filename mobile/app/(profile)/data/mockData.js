import { colors } from '../../../theme/colors';

export const mockUser = {
  name: 'NT118',
  avatar: 'https://via.placeholder.com/60?text=HM',
  followers: 111,
  following: 111,
};

export const mockOrdersTabs = [
  { icon: 'bag-handle-outline', label: 'Đơn hàng bán', color: colors.notification.dot },
  { icon: 'star-outline', label: 'Đang giao', color: colors.notification.dot },
  { icon: 'time-outline', label: 'Lịch sử', color: colors.notification.dot },
];

export const mockUtilities = [
  { icon: 'settings', label: 'Cài đặt' },
  { icon: 'local-police', label: 'Chính sách' },
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
    color: colors.notification.dot,
    icon: 'trending-up',
  },
  {
    title: 'Tổng đơn hàng',
    value: '15 đơn hàng',
    trend: '+2 đơn hàng',
    color: colors.status.success,
    icon: 'trending-up',
  },
  {
    title: 'Top danh mục',
    value: 'Đồ ăn',
    trend: 'Áo nữ',
    color: colors.status.warning,
    icon: 'pie-chart',
  },
  {
    title: 'Chi tiêu tháng',
    value: '500.000đ',
    trend: '-100.000đ',
    color: colors.status.error,
    icon: 'trending-down',
  },
];