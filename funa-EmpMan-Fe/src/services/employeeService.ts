import apiService from './apiService';
import { Employee } from '../types/employee';

// Employee services
export const employeeService = {
  // Get all employees
  getAllEmployees: async (): Promise<Employee[]> => {
    try {
      console.log('Fetching all employees...');
      const response = await apiService.get('/employees');
      console.log('Employees response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  // Get employee by ID
  getEmployeeById: async (id: string): Promise<Employee> => {
    const response = await apiService.get(`/employees/${id}`);
    return response.data;
  },

  // Create employee
  createEmployee: async (employee: any): Promise<Employee> => {
    const response = await apiService.post('/employees', employee);
    return response.data;
  },

  // Update employee
  updateEmployee: async (id: string, employee: any): Promise<Employee> => {
    const response = await apiService.put(`/employees/${id}`, employee);
    return response.data;
  },

  // Delete employee
  deleteEmployee: async (id: string): Promise<void> => {
    await apiService.delete(`/employees/${id}`);
  },

  // Upload CV
  uploadCV: async (id: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('cv', file);

    const response = await apiService.post(`/employees/${id}/upload-cv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Download CV
  downloadCV: async (id: string): Promise<Blob> => {
    const response = await apiService.get(`/employees/${id}/download-cv`, {
      responseType: 'blob',
    });

    return response.data;
  },

  // Search employees
  searchEmployees: async (field: string, term: string): Promise<Employee[]> => {
    const response = await apiService.get('/employees/search', {
      params: { field, term },
    });

    return response.data;
  },
};

export default employeeService;
