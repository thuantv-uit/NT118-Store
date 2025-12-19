# NT118-Store

## 📱 E-Commerce Mobile Application
Ứng dụng thương mại điện tử đa vai trò với giao diện hiện đại, hỗ trợ người mua, người bán và shipper.

## ✨ Tính năng chính

### 🤖 Trợ lý AI Shopping Assistant
- 💬 Chat với AI (Gemini/GPT-4) - tư vấn mua sắm thông minh
- 🎯 Hiểu ngữ cảnh đơn hàng & giỏ hàng
- ⚡ Bubble icon floating có thể kéo thả

### 👤 Người mua (Buyer)
- 🏠 Trang chủ với banner carousel & flash sale
- 🔍 Tìm kiếm và lọc sản phẩm theo danh mục
- 🛒 Giỏ hàng với variant (size, color)
- ❤️ Danh sách yêu thích
- 📦 Theo dõi đơn hàng real-time
- 💰 Ví điện tử & lịch sử giao dịch
- 💬 Chat với người bán

### 🏪 Người bán (Seller)
- 📊 Dashboard doanh thu & thống kê
- ➕ Tạo sản phẩm với nhiều variant & hình ảnh
- ✏️ Quản lý & chỉnh sửa sản phẩm
- 📦 Quản lý đơn hàng
- 💬 Chat với khách hàng
- 🎨 Giao diện pink theme hiện đại

### 🚚 Shipper
- 📋 Danh sách đơn hàng cần giao
- 📍 Cập nhật vị trí & trạng thái đơn hàng
- ✅ Xác nhận giao hàng thành công

## 🛠️ Tech Stack

### Frontend (Mobile)
- **Framework**: React Native + Expo Router
- **UI**: React Native components, Expo Linear Gradient
- **Auth**: Clerk Authentication
- **State**: React Hooks
- **API**: Fetch API, Socket.io client
- **Icons**: Ionicons, Vector Icons

### Backend
- **Runtime**: Node.js + Express
- **Database**: PostgreSQL (Neon)
- **Cache**: Redis (Upstash)
- **Image**: Cloudinary
- **AI**: Google Gemini API, OpenAI API
- **Real-time**: Socket.io

## 📚 Hướng dẫn Setup

### 1. Clone Repository
```bash
git clone https://github.com/thuantv-uit/NT118-Store.git
cd NT118-Store
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Tạo file `.env` trong folder `backend/`:
```env
PORT=5001
DATABASE_URL=your_postgres_url
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
API_URL=http://localhost:5001
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
```

Chạy backend:
```bash
npm start
```

### 3. Mobile Setup
```bash
cd mobile
npm install
```

Tạo file `.env` trong folder `mobile/`:
```env
EXPO_PUBLIC_API_URL=http://your-ip:5001/api
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

Chạy app:
```bash
npx expo start
```

### 4. AI Assistant Setup
**📚 Chi tiết:** [QUICK_AI_SETUP.md](./QUICK_AI_SETUP.md)

## 🔄 Git Workflow

### Pull trước khi code
```bash
git pull origin main
```

### Tạo branch cho feature mới
```bash
git checkout -b feature/your-feature-name
```

### Commit và push
```bash
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

### Tạo Pull Request
- Mở PR trên GitHub
- Review code
- Merge vào main sau khi approve

### Sync sau khi merge
```bash
git checkout main
git pull origin main
```

## 📁 Cấu trúc Project

```
NT118-Store/
├── backend/
│   ├── controllers/        # API controllers
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── config/            # Config files
│   └── server.js
├── mobile/
│   ├── app/
│   │   ├── (auth)/        # Đăng nhập/đăng ký
│   │   ├── (home)/        # Trang chủ buyer
│   │   ├── (buyer)/       # Buyer screens
│   │   ├── (seller)/      # Seller screens
│   │   ├── (shipper)/     # Shipper screens
│   │   ├── (chat)/        # Chat screens
│   │   └── (profile)/     # Profile screens
│   ├── components/        # Shared components
│   ├── constants/         # Constants & API config
│   └── assets/           # Images & fonts
└── start-dev.ps1         # Quick start script
```

## 👥 Nhóm Phát Triển
- **Hồ Thị Huỳnh My - 22520897**
- **Trần Thu Ngân - 22520937** 
- **Trần Văn Thuận - 22521448**

## 📄 License
MIT License - UIT NT118 Course Project
