import { api } from './index';

const LOCATIONS_URL = '/locations';

export const fetchLocations = async () => {
  const response = await api.get(LOCATIONS_URL);
  return response.data;
};

export const createLocation = async (location: { name: string; code: string }) => {
  const response = await api.post(LOCATIONS_URL, location);
  return response.data;
};
