# Sử dụng image Node.js 20
FROM node:20

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Cài đặt Expo CLI toàn cục (nếu cần)
RUN npm install -g expo-cli

# Sao chép toàn bộ mã nguồn
COPY . .

# Lệnh khởi động (dùng npx expo start thay vì npm start để chạy Expo)
CMD ["npm", "start"]