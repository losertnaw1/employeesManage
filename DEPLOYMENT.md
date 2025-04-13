# Hướng dẫn triển khai chi tiết

## 1. Chuẩn bị

### Yêu cầu

- Node.js 18 trở lên
- npm hoặc yarn
- Tài khoản Firebase
- Tài khoản MongoDB Atlas (hoặc MongoDB khác)

### Cài đặt Firebase CLI

```bash
npm install -g firebase-tools
```

## 2. Cấu hình Firebase

### Đăng nhập vào Firebase

```bash
firebase login
```

### Tạo dự án Firebase

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo dự án mới
3. Ghi nhớ ID dự án

### Khởi tạo Firebase trong dự án

```bash
firebase init
```

Chọn các tùy chọn sau:
- Hosting
- Functions
- Chọn dự án Firebase của bạn
- Sử dụng JavaScript cho Functions
- Sử dụng ESLint
- Cài đặt dependencies ngay

### Cấu hình Firebase

Chạy script cấu hình:

```bash
node setup-firebase-config.js
```

Nhập các thông tin cần thiết:
- MongoDB URI
- Access Token Secret
- Refresh Token Secret
- Cấu hình email (cho chức năng đặt lại mật khẩu)
- Frontend URL

## 3. Build và triển khai

### Build frontend

```bash
cd funa-EmpMan-Fe
npm run build
```

### Cài đặt dependencies cho backend

```bash
cd functions
npm install
```

### Triển khai lên Firebase

```bash
firebase deploy
```

Hoặc sử dụng script tự động:

```bash
node deploy.js
```

## 4. Sau khi triển khai

### Tạo admin mặc định

Sau khi triển khai, truy cập URL sau để tạo admin mặc định:

```
https://employeesmanage-a807d.web.app/createAdmin
```

Thông tin đăng nhập mặc định:
- Username: admin
- Password: admin123

### Kiểm tra ứng dụng

Truy cập URL của ứng dụng:

```
https://employeesmanage-a807d.web.app
```

## 5. Xử lý sự cố

### Lỗi kết nối MongoDB

Kiểm tra:
- MongoDB URI có chính xác không
- IP của Firebase Functions có được thêm vào whitelist của MongoDB Atlas không

### Lỗi CORS

Kiểm tra:
- Cấu hình CORS trong `functions/index.js`
- Frontend URL có đúng không

### Lỗi đăng nhập

Kiểm tra:
- Admin mặc định đã được tạo chưa
- Access Token Secret và Refresh Token Secret có đúng không

### Lỗi tải lên/tải xuống CV

Kiểm tra:
- Thư mục `uploads/cvs` có tồn tại không
- Quyền truy cập vào thư mục `uploads`

## 6. Cập nhật ứng dụng

### Cập nhật frontend

```bash
cd funa-EmpMan-Fe
npm run build
firebase deploy --only hosting
```

### Cập nhật backend

```bash
firebase deploy --only functions
```

### Cập nhật cả hai

```bash
node deploy.js
```
