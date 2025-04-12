import { api } from './index';

const EDUCATION_LEVELS_URL = '/education-levels';

export const fetchEducationLevels = async () => {
  const response = await api.get(EDUCATION_LEVELS_URL);
  return response.data;
};

export const createEducationLevel = async (level: { name: string; code: string }) => {
  const response = await api.post(EDUCATION_LEVELS_URL, level);
  return response.data;
};
