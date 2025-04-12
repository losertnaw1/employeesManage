import { api } from './index';

const SKILLS_URL = '/skills';

export const fetchSkills = async () => {
  const response = await api.get(SKILLS_URL);
  return response.data;
};

export const createSkill = async (skill: { name: string }) => {
  const response = await api.post(SKILLS_URL, skill);
  return response.data;
};
