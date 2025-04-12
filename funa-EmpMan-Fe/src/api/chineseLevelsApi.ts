import { api } from './index';

const CHINESE_LEVELS_URL = '/chinese-levels';

export const fetchChineseLevels = async () => {
  const response = await api.get(CHINESE_LEVELS_URL);
  return response.data;
};

export const createChineseLevel = async (level: { name: string; code: string }) => {
  const response = await api.post(CHINESE_LEVELS_URL, level);
  return response.data;
};
