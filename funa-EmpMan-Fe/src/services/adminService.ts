import api from './authService';
import { Admin, AdminCreateRequest, AdminUpdateRequest } from '../types/admin';

// Admin services
export const adminService = {
  // Get all admins
  getAllAdmins: async (): Promise<Admin[]> => {
    const response = await api.get('/admins');
    return response.data;
  },
  
  // Get admin by ID
  getAdminById: async (id: string): Promise<Admin> => {
    const response = await api.get(`/admins/${id}`);
    return response.data;
  },
  
  // Create admin
  createAdmin: async (adminData: AdminCreateRequest): Promise<Admin> => {
    const response = await api.post('/admins', adminData);
    return response.data;
  },
  
  // Update admin
  updateAdmin: async (id: string, adminData: AdminUpdateRequest): Promise<Admin> => {
    const response = await api.put(`/admins/${id}`, adminData);
    return response.data;
  },
  
  // Delete admin
  deleteAdmin: async (id: string): Promise<void> => {
    await api.delete(`/admins/${id}`);
  }
};
