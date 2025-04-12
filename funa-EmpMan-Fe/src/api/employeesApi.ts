import { api } from './index';
import { Employee } from '../types/employee';

const EMPLOYEES_URL = '/employees';

export const fetchEmployees = async () => {
  const response = await api.get(EMPLOYEES_URL);
  return response.data;
};

export const fetchEmployeeById = async (id: string) => {
  const response = await api.get(`${EMPLOYEES_URL}/${id}`);
  return response.data;
};

export const createEmployee = async (employee: Partial<Employee>) => {
  const response = await api.post(EMPLOYEES_URL, employee);
  return response.data;
};

export const updateEmployee = async (id: string, employee: Partial<Employee>) => {
  const response = await api.put(`${EMPLOYEES_URL}/${id}`, employee);
  return response.data;
};

export const deleteEmployee = async (id: string) => {
  const response = await api.delete(`${EMPLOYEES_URL}/${id}`);
  return response.data;
};

export const uploadEmployeeCV = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append('cv', file);

  const response = await api.post(`${EMPLOYEES_URL}/${id}/upload-cv`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const downloadEmployeeCV = async (id: string) => {
  const response = await api.get(`${EMPLOYEES_URL}/${id}/download-cv`, {
    responseType: 'blob',
  });

  return response.data;
};

export const getEmployeeCVInfo = async (id: string) => {
  const response = await api.get(`${EMPLOYEES_URL}/${id}/cv-info`);
  return response.data;
};
