import { axiosLoyaltyEngine } from 'utils/axios';

export const updateTierIndex = (tierId: number, newTierIndex: number) => {
  return axiosLoyaltyEngine()(`tiers/${tierId}/index`, {
    method: 'patch',
    data: { newTierIndex },
  });
};

export const createTier = (payload: any) => {
  return axiosLoyaltyEngine()(`tiers`, {
    method: 'post',
    data: payload,
  });
};

export const patch = (id: any, payload: any) => {
  return axiosLoyaltyEngine()(`tiers/${id}`, {
    method: 'patch',
    data: payload,
  });
};
