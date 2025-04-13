# Hướng dẫn triển khai backend lên Render

Render là một dịch vụ hosting hiện đại, dễ sử dụng và có gói miễn phí. Dưới đây là các bước để triển khai backend lên Render:

## 1. Tạo tài khoản Render

1. Truy cập [Render.com](https://render.com/) và đăng ký tài khoản mới nếu bạn chưa có.
2. Đăng nhập vào tài khoản Render của bạn.

## 2. Kết nối với GitHub

1. Trong Dashboard của Render, nhấp vào "New" > "Web Service".
2. Kết nối với GitHub repository của bạn.
3. Nếu bạn chưa kết nối GitHub với Render, hãy làm theo các bước để cấp quyền truy cập.
4. Tìm và chọn repository của bạn.

## 3. Cấu hình Web Service

1. Đặt tên cho service, ví dụ: "employee-management-api".
2. Chọn nhánh để triển khai, thường là "main" hoặc "master".
3. Chọn Runtime: "Node".
4. **Quan trọng**: Để Root Directory trống (sử dụng thư mục gốc của repository).
5. Đặt Build Command: `npm run install-backend`.
6. Đặt Start Command: `npm start`.
7. Chọn gói Free.

## 4. Cấu hình biến môi trường

Thêm các biến môi trường sau:

- `MONGO_URI`: mongodb+srv://trphuong1305:zwHoIEJ1Yh1iP6Ok@cluster0-funa.ai2tq.mongodb.net/funa?retryWrites=true&w=majority
- `PORT`: 5000
- `ACCESS_TOKEN_SECRET`: access_token_secret_key_for_employee_management_system
- `REFRESH_TOKEN_SECRET`: refresh_token_secret_key_for_employee_management_system
- `CLIENT_URL`: https://employeesmanage-a807d.web.app

## 5. Triển khai

1. Nhấp vào "Create Web Service" để bắt đầu quá trình triển khai.
2. Render sẽ tự động build và triển khai ứng dụng của bạn.
3. Quá trình này có thể mất vài phút.

## 6. Lấy URL của API

1. Sau khi triển khai thành công, Render sẽ cung cấp cho bạn một URL, ví dụ: `https://employee-management-api.onrender.com`.
2. Đây là URL của API của bạn.

## 7. Cập nhật API URL trong frontend

1. Mở file `funa-EmpMan-Fe/.env.production`.
2. Cập nhật `VITE_API_URL` với URL của API mới:
   ```
   VITE_API_URL=https://employee-management-api.onrender.com/api
   ```

## 8. Rebuild và redeploy frontend

1. Build lại frontend:
   ```bash
   cd funa-EmpMan-Fe
   npm run build
   ```

2. Triển khai lại frontend lên Firebase Hosting:
   ```bash
   firebase deploy --only hosting
   ```

## 9. Kiểm tra ứng dụng

1. Truy cập frontend tại: `https://employeesmanage-a807d.web.app`.
2. Đăng nhập và kiểm tra xem ứng dụng có hoạt động bình thường không.

## Lưu ý

- Dịch vụ miễn phí của Render sẽ tự động ngủ sau 15 phút không hoạt động. Lần đầu tiên truy cập sau khi ngủ có thể mất vài giây để khởi động lại.
- Nếu bạn gặp vấn đề với CORS, hãy đảm bảo rằng bạn đã cấu hình CORS trong backend để chấp nhận yêu cầu từ frontend của bạn.
