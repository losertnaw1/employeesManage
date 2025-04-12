const vi = {
    translation: {
        // Common
        welcome: "Chào mừng",
        loading: "Đang tải...",
        error: "Đã xảy ra lỗi",
        save: "Lưu",
        cancel: "Hủy",
        edit: "Sửa",
        delete: "Xóa",
        confirm: "Xác nhận",
        search: "Tìm kiếm",
        noData: "Không có dữ liệu",
        actions: "Thao tác",
        submit: "Gửi",
        back: "Quay lại",

        // Auth
        login: "Đăng nhập",
        username: "Tên đăng nhập",
        password: "Mật khẩu",
        show: "Hiện",
        hide: "Ẩn",
        loggingIn: "Đang đăng nhập...",
        loginSubtitle: "Nhập thông tin đăng nhập để truy cập hệ thống",
        superadmin: "Quản trị viên cấp cao",
        admin: "Quản trị viên",
        editor: "Biên tập viên",
        unauthorized: "Từ chối truy cập",
        unauthorizedMessage: "Bạn không có quyền truy cập trang này.",
        forgotPassword: "Quên mật khẩu?",
        forgotPasswordSubtitle: "Nhập tên đăng nhập hoặc email để đặt lại mật khẩu",
        usernameOrEmail: "Tên đăng nhập hoặc Email",
        sendResetLink: "Gửi liên kết đặt lại",
        sending: "Đang gửi...",
        backToLogin: "Quay lại đăng nhập",
        checkYourEmail: "Kiểm tra email của bạn",
        resetLinkSent: "Nếu tài khoản của bạn tồn tại, một liên kết đặt lại mật khẩu đã được gửi đến email của bạn.",
        resetPassword: "Đặt lại mật khẩu",
        resetPasswordSubtitle: "Nhập mật khẩu mới của bạn",
        newPassword: "Mật khẩu mới",
        confirmPassword: "Xác nhận mật khẩu",
        resetting: "Đang đặt lại...",
        passwordResetSuccess: "Đặt lại mật khẩu thành công",
        redirectingToLogin: "Bạn sẽ được chuyển hướng đến trang đăng nhập trong vài giây.",
        invalidResetLink: "Liên kết đặt lại mật khẩu không hợp lệ",
        passwordTooShort: "Mật khẩu phải có ít nhất 8 ký tự",
        passwordsDoNotMatch: "Mật khẩu không khớp",
        resetError: "Đã xảy ra lỗi khi đặt lại mật khẩu của bạn",
        identifierRequired: "Vui lòng nhập tên đăng nhập hoặc email của bạn",
        resetRequestError: "Đã xảy ra lỗi khi xử lý yêu cầu của bạn",

        // User Menu
        userMenu: "Menu người dùng",
        profile: "Hồ sơ cá nhân",
        changePassword: "Đổi mật khẩu",
        logout: "Đăng xuất",

        // Profile
        profileInformation: "Thông tin cá nhân",
        editProfile: "Chỉnh sửa hồ sơ",
        cancel: "Hủy",
        fullName: "Họ và tên",
        email: "Email",
        role: "Vai trò",
        saveChanges: "Lưu thay đổi",
        accountSettings: "Cài đặt tài khoản",

        // Change Password
        currentPassword: "Mật khẩu hiện tại",
        currentPasswordRequired: "Mật khẩu hiện tại là bắt buộc",
        newPasswordRequired: "Mật khẩu mới là bắt buộc",
        changing: "Đang thay đổi...",
        passwordChanged: "Đổi mật khẩu thành công",
        redirectingToProfile: "Bạn sẽ được chuyển hướng đến trang hồ sơ cá nhân trong vài giây.",
        changePasswordError: "Đã xảy ra lỗi khi đổi mật khẩu của bạn",

        // Languages
        languages: {
            vietnamese: "Tiếng Việt",
            english: "Tiếng Anh",
            chinese: "Tiếng Trung"
        },

        // App Title
        appTitle: "Hệ thống quản lý nhân sự",

        // Navigation
        dashboard: "Trang chủ",
        employees: "Nhân viên",
        search: "Tìm kiếm",
        attendance: "Chấm công",
        salary: "Lương",
        leaves: "Nghỉ phép",
        notifications: "Thông báo",
        profile: "Hồ sơ",
        settings: "Cài đặt",
        logout: "Đăng xuất",

        // Dashboard
        totalEmployees: "Tổng số nhân viên",
        attendanceRate: "Tỷ lệ chuyên cần",
        newHires: "Nhân viên mới",
        pendingLeaves: "Đơn nghỉ phép chờ duyệt",
        recentActivities: "Hoạt động gần đây",

        // Employee Management
        manage: "Quản lý nhân viên",
        addEmployee: "Thêm nhân viên mới",
        editEmployee: "Sửa thông tin nhân viên",
        deleteEmployee: "Xóa nhân viên",
        deleteConfirm: "Bạn có chắc muốn xóa nhân viên này?",
        uploadCV: "Tải CV lên",
        downloadCV: "Tải CV về",
        noCV: "Chưa có CV",
        cvAfterCreate: "Bạn có thể tải CV lên sau khi tạo nhân viên",
        uploadSuccess: "Tải CV lên thành công",
        downloadError: "Lỗi khi tải CV về",
        invalidFileType: "Định dạng file không hợp lệ. Vui lòng tải lên file PDF hoặc Word",
        fileTooLarge: "File quá lớn. Kích thước tối đa là 5MB",
        uploadError: "Lỗi khi tải CV lên. Vui lòng thử lại",
        skip: "Bỏ qua",
        uploading: "Đang tải lên...",
        deleteSuccess: "Xóa nhân viên thành công",
        deleteError: "Lỗi khi xóa nhân viên",
        addSuccess: "Thêm nhân viên mới thành công",
        updateSuccess: "Cập nhật nhân viên thành công",
        saveError: "Lỗi khi lưu thông tin nhân viên",

        // Search
        searchEmployees: "Tìm kiếm nhân viên",
        searchPlaceholder: "Nhập từ khóa tìm kiếm...",
        searching: "Đang tìm kiếm...",
        search: "Tìm kiếm",
        searchResults: "Kết quả tìm kiếm",
        noSearchResults: "Không tìm thấy nhân viên nào phù hợp với tiêu chí tìm kiếm",
        viewDetails: "Xem chi tiết",
        fetchError: "Lỗi khi tải dữ liệu",
        searchError: "Lỗi khi tìm kiếm nhân viên",
        showFilters: "Hiển thị bộ lọc",
        hideFilters: "Ẩn bộ lọc",
        filterResults: "Lọc kết quả",
        all: "Tất cả",
        filtered: "Đã lọc",
        resetFilters: "Xóa bộ lọc",
        enterSkills: "Nhập kỹ năng...",
        highSchool: "Trung học phổ thông",
        college: "Cao đẳng",
        bachelor: "Đại học",
        master: "Thạc sĩ",
        phd: "Tiến sĩ",

        // Employee Fields
        fullNameVi: "Tên Tiếng Việt",
        fullNameCn: "Tên Tiếng Trung",
        phoneNumber: "Số điện thoại",
        mainWorkLocation: "Địa điểm làm việc",
        chineseLevel: "Trình độ Tiếng Trung",
        educationLevel: "Trình độ học vấn",
        projectManager: "Quản lý dự án",
        rank: "Cấp bậc",
        skills: "Kỹ năng",
        previousProjects: "Dự án đã tham gia",
        referrer: "Người giới thiệu",
        notes: "Ghi chú",

        // Locations
        hanoi: "Hà Nội",
        hochiminh: "Hồ Chí Minh",
        danang: "Đà Nẵng",

        // Education Levels
        highSchool: "THPT",
        college: "Cao đẳng",
        university: "Đại học",
        master: "Thạc sĩ",
        phd: "Tiến sĩ",

        // Ranks
        intern: "Thực tập sinh",
        junior: "Nhân viên",
        senior: "Nhân viên cao cấp",
        lead: "Trưởng nhóm",
        manager: "Quản lý",

        // Auth
        login: "Đăng nhập",
        username: "Tên đăng nhập",
        password: "Mật khẩu",
        forgotPassword: "Quên mật khẩu?",
        loginError: "Tên đăng nhập hoặc mật khẩu không đúng",

        // Profile
        profileInfo: "Thông tin cá nhân",
        editProfile: "Chỉnh sửa hồ sơ",
        accountSettings: "Cài đặt tài khoản",
        changePassword: "Đổi mật khẩu",
        email: "Email",
        fullName: "Họ và tên",
        role: "Vai trò"
    }
};

export default vi;