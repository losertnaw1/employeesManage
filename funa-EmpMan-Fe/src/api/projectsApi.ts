import { api } from './index';

const PROJECTS_URL = '/projects';

export const fetchProjects = async () => {
  const response = await api.get(PROJECTS_URL);
  return response.data;
};

export const createProject = async (project: { name: string; description?: string }) => {
  const response = await api.post(PROJECTS_URL, project);
  return response.data;
};
