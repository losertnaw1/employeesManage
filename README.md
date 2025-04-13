# Employee Management System

Hệ thống quản lý nhân viên với frontend React và backend Node.js, triển khai trên Firebase.

## Cấu trúc dự án

- `funa-EmpMan-Fe`: Frontend React + Vite
- `funa-empMan-api`: Backend Node.js + Express
- `functions`: Backend cho Firebase Functions
- `firebase.json`: Cấu hình Firebase Hosting và Functions

## Yêu cầu

- Node.js 18 trở lên
- Firebase CLI: `npm install -g firebase-tools`
- Tài khoản Firebase
- MongoDB Atlas (hoặc MongoDB khác)

## Triển khai

### 1. Triển khai frontend lên Firebase Hosting

#### 1.1. Cài đặt Firebase CLI

```bash
npm install -g firebase-tools
```

#### 1.2. Đăng nhập vào Firebase

```bash
firebase login
```

#### 1.3. Khởi tạo dự án Firebase (nếu chưa có)

```bash
firebase init
```

Chọn các tùy chọn sau:
- Hosting
- Chọn dự án Firebase của bạn
- Chọn thư mục public: `funa-EmpMan-Fe/dist`
- Cấu hình ứng dụng single-page: Yes

#### 1.4. Build và triển khai frontend

```bash
node deploy-frontend.js
```

Script này sẽ:
- Cài đặt dependencies cho frontend
- Build frontend
- Triển khai frontend lên Firebase Hosting

### 2. Triển khai backend lên Render

Render là một dịch vụ hosting hiện đại, dễ sử dụng và có gói miễn phí. Xem hướng dẫn chi tiết trong file `RENDER_DEPLOYMENT.md`.

#### 2.1. Tạo tài khoản Render

1. Truy cập [Render.com](https://render.com/) và đăng ký tài khoản mới.
2. Đăng nhập vào tài khoản Render của bạn.

#### 2.2. Tạo Web Service mới

1. Trong Dashboard của Render, nhấp vào "New" > "Web Service".
2. Kết nối với GitHub repository của bạn.
3. Cấu hình Web Service với các thông số sau:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Thêm các biến môi trường từ file `.env`

#### 2.3. Cập nhật API URL trong frontend

1. Sau khi triển khai backend thành công, lấy URL của API từ Render.
2. Cập nhật file `funa-EmpMan-Fe/.env.production` với URL của API mới.
3. Build lại và triển khai lại frontend.

### 3. Tạo admin mặc định

Sau khi triển khai backend, bạn cần tạo admin mặc định bằng cách gọi API:

```
POST https://your-render-api.onrender.com/api/auth/create-default-admin
```

Thông tin đăng nhập mặc định:
- Username: admin
- Password: admin123

## Phát triển cục bộ

### Frontend

```bash
cd funa-EmpMan-Fe
npm run dev
```

### Backend

```bash
cd funa-empMan-api
npm run dev
```

## Cấu trúc API

### Auth

- `POST /api/auth/login`: Đăng nhập
- `POST /api/auth/refresh`: Làm mới token
- `POST /api/auth/logout`: Đăng xuất
- `GET /api/auth/me`: Lấy thông tin admin hiện tại
- `POST /api/auth/forgot-password`: Yêu cầu đặt lại mật khẩu
- `POST /api/auth/reset-password`: Đặt lại mật khẩu

### Employees

- `GET /api/employees`: Lấy danh sách nhân viên
- `POST /api/employees`: Tạo nhân viên mới
- `GET /api/employees/:id`: Lấy thông tin nhân viên
- `PUT /api/employees/:id`: Cập nhật nhân viên
- `DELETE /api/employees/:id`: Xóa nhân viên
- `POST /api/employees/:id/upload-cv`: Tải lên CV
- `GET /api/employees/:id/download-cv`: Tải xuống CV
- `GET /api/employees/:id/cv-info`: Lấy thông tin CV
- `GET /api/employees/search`: Tìm kiếm nhân viên

### Admins

- `GET /api/admins`: Lấy danh sách admin
- `POST /api/admins`: Tạo admin mới
- `GET /api/admins/:id`: Lấy thông tin admin
- `PUT /api/admins/:id`: Cập nhật admin
- `DELETE /api/admins/:id`: Xóa admin
