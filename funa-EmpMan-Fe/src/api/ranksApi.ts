import { api } from './index';

const RANKS_URL = '/ranks';

export const fetchRanks = async () => {
  const response = await api.get(RANKS_URL);
  return response.data;
};

export const createRank = async (rank: { name: string; code: string }) => {
  const response = await api.post(RANKS_URL, rank);
  return response.data;
};
