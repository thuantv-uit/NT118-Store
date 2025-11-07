// Home 
export const FLASH_IMAGES = [
  require("../../../assets/images/home_seller/flash_sale/Flast sale.png"),
  require("../../../assets/images/home_seller/flash_sale/fl2.png"),
  require("../../../assets/images/home_seller/flash_sale/fl3.png"),
];

export const MESSAGES = [
  {
    id: "1",
    name: "Marvin McKinney",
    username: "@theresa",
    date: "Mar 5",
    message: "Khách yêu cầu xác nhận lịch giao hàng vào cuối tuần.",
  },
  {
    id: "2",
    name: "Courtney Henry",
    username: "@courtney",
    date: "Mar 5",
    message: "Sản phẩm mới nhận được đánh giá 5⭐. Tuyệt vời!",
  },
];

export const NOTIFICATIONS = [
  { id: "n1", title: "Đơn hàng #SN-2301 đã thanh toán", time: "2 phút trước" },
  { id: "n2", title: "Ly gốm A08 đang có 15 người xem", time: "10 phút trước" },
  { id: "n3", title: "Thêm voucher lễ hội để tăng chuyển đổi", time: "1 giờ trước" },
];

// Setting
export const SETTINGS_GROUPS = [
  {
    id: "notifications",
    title: "Thông báo",
    items: [
      { id: "order", label: "Thông báo đơn hàng mới", description: "Nhận thông báo khi có đơn đặt hàng mới." },
      { id: "promotion", label: "Chiến dịch khuyến mãi", description: "Cập nhật gợi ý khuyến mãi và sự kiện quan trọng." },
    ],
  },
  {
    id: "store",
    title: "Cửa hàng",
    items: [
      { id: "maintenance", label: "Chế độ nghỉ", description: "Tạm ẩn cửa hàng khi bạn không thể xử lý đơn." },
      { id: "autoReply", label: "Trả lời tự động", description: "Thiết lập tin nhắn phản hồi nhanh cho khách hàng." },
    ],
  },
];

// Layout
export const HEADER_GRADIENT = ["#CC7861", "#E3ABA1"];

// Seach
export const QUICK_FILTERS = ["Tất cả sản phẩm", "Còn hàng", "Sắp hết", "Đã ẩn"];

export const TOP_KEYWORDS = ["ly gốm a08", "combo quà tết", "lọ hoa artisan", "gốm thủ công"];

export const RECENT_SEARCHES = [
  "Đơn hàng #SN-2301",
  "Sản phẩm: Bình gốm đen tuyền",
  "Khách hàng: @leslie",
];

// Profile
export const INFO_FIELDS = [
  { id: "name", label: "Tên cửa hàng", placeholder: "Siny Shop" },
  { id: "owner", label: "Chủ sở hữu", placeholder: "Theresa Webb" },
  { id: "phone", label: "Số điện thoại", placeholder: "0123 456 789" },
  { id: "email", label: "Email", placeholder: "sinyshop@example.com" },
];

export const ADDRESS_FIELDS = [
  { id: "address", label: "Địa chỉ", placeholder: "123 Nguyễn Trãi, Q.1, TP.HCM" },
  { id: "warehouse", label: "Kho hàng", placeholder: "Kho 1 - Bình Thạnh" },
];

// product-create
export const BASIC_FIELDS = [
  { id: "productName", label: "Tên sản phẩm", placeholder: "Ví dụ: Ly gốm Artisan A08" },
  { id: "category", label: "Danh mục", placeholder: "Đồ gốm / Bộ sưu tập xuân" },
  { id: "price", label: "Giá bán", placeholder: "Nhập giá bán (đ)" },
];

export const INVENTORY_FIELDS = [
  { id: "sku", label: "Mã SKU", placeholder: "Nhập mã kho" },
  { id: "stock", label: "Tồn kho", placeholder: "Số lượng hiện có" },
  { id: "warehouse", label: "Kho xuất hàng", placeholder: "Kho chính - TP.HCM" },
];

// Notifications
export const ALERTS = [
  { id: "a1", type: "Đơn hàng", message: "Đơn hàng #SN-2301 đã được thanh toán thành công.", time: "2 phút trước" },
  { id: "a2", type: "Sản phẩm", message: "Ly gốm A08 đạt 15 người xem trong 10 phút gần đây.", time: "10 phút trước" },
  { id: "a3", type: "Marketing", message: "Thêm mã giảm giá lễ hội để tăng chuyển đổi cuối tuần.", time: "1 giờ trước" },
  { id: "a4", type: "Vận chuyển", message: "Đơn hàng #SN-2281 đang chờ xác nhận đơn vị vận chuyển.", time: "2 giờ trước" },
];

export const REMINDERS = [
  "Đặt lịch livestream với sản phẩm mới.",
  "Kiểm tra tồn kho mặt hàng phổ biến.",
  "Thử nghiệm combo ưu đãi trong tuần này.",
];

// messages
export const FILTERS = ["Tất cả", "Chưa đọc", "Đã xử lý", "Ưu tiên"];

export const CONVERSATIONS = [
  {
    id: "c1",
    name: "Marvin McKinney",
    username: "@theresa",
    time: "5 phút trước",
    snippet: "Khách cần xác nhận lịch giao hàng cuối tuần.",
    unread: 2,
  },
  {
    id: "c2",
    name: "Courtney Henry",
    username: "@courtney",
    time: "12 phút trước",
    snippet: "Đơn hàng #SN-2301 đã được thanh toán thành công.",
    unread: 0,
  },
  {
    id: "c3",
    name: "Leslie Alexander",
    username: "@leslie",
    time: "Hôm qua",
    snippet: "Bạn có thể cập nhật thêm ảnh cho sản phẩm A08 không?",
    unread: 1,
  },
];

// Dashboard
export const STAT_CARDS = [
  { id: "revenue", iconType: MaterialCommunityIcons, icon: "cash-multiple", label: "Doanh thu tháng", value: "124.500.000 đ" },
  { id: "orders", iconType: Ionicons, icon: "cart-outline", label: "Đơn hàng mới", value: "320" },
  { id: "conversion", iconType: MaterialCommunityIcons, icon: "chart-line-stacked", label: "Tỉ lệ chuyển đổi", value: "4,2%" },
  { id: "visits", iconType: Ionicons, icon: "people-outline", label: "Lượt truy cập", value: "12.540" },
];

export const HIGHLIGHTS = [
  { id: "hot", title: "Sản phẩm bán chạy", description: "Ly gốm A08 tăng trưởng 34% so với tuần trước." },
  { id: "campaign", title: "Chiến dịch sắp diễn ra", description: "Flash sale cuối tuần giúp tăng tỷ lệ chuyển đổi." },
];