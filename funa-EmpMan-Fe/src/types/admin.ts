export interface Admin {
  _id: string;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'superadmin' | 'editor';
  status: 'active' | 'inactive' | 'suspended';
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  refreshToken: string;
  admin: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export interface AdminCreateRequest {
  username: string;
  email: string;
  password: string;
  full_name: string;
  role?: 'admin' | 'superadmin' | 'editor';
}

export interface AdminUpdateRequest {
  email?: string;
  full_name?: string;
  role?: 'admin' | 'superadmin' | 'editor';
  status?: 'active' | 'inactive' | 'suspended';
  password?: string;
}

export interface PasswordResetRequest {
  identifier: string; // Username or email
}

export interface ResetPasswordRequest {
  token: string;
  username: string;
  newPassword: string;
}
