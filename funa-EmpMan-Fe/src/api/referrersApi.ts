import { api } from './index';

const REFERRERS_URL = '/referrers';

export const fetchReferrers = async () => {
  const response = await api.get(REFERRERS_URL);
  return response.data;
};

export const createReferrer = async (referrer: { name: string; contact?: string }) => {
  const response = await api.post(REFERRERS_URL, referrer);
  return response.data;
};
