export interface User {
    id: string;
    name: string;
    role: 'admin' | 'user'; // Chỉ có 2 loại quyền
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
  }
  
  export interface LoginPayload {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
  }
  