import { get, isEmpty, isNil } from 'lodash';
import { axiosLoyaltyEngine } from 'utils/axios';

export const create = (payload: any) => {
  return axiosLoyaltyEngine().post('programs', payload);
};

export const patch = (id: any, payload: any) => {
  return axiosLoyaltyEngine()(`programs/${id}`, {
    method: 'patch',
    data: payload,
  });
};

export const searchGifts = async (searchKey: any, additionSearch: any, page: any) => {
  const searchQuery = {
    ...(searchKey.match('^\\d+$') ? { id: searchKey } : { title: searchKey }),
    limit: 10,
  };

  const filterQuery = {
    ...searchQuery,
    skip: Number(!isNil(page) ? page * 10 : 0),
  };
  const res = await axiosLoyaltyEngine()(`programs/reward/urgifts/list`, { params: filterQuery });
  return !isEmpty(res.data)
    ? res.data.map((item: any) => ({
        label: `${item.id} - ${item.title}`,
        value: item.id,
        data: {
          id: item.id,
          amount: item.price,
          quantityAllowedForSale: item.quantity,
          title: item.title,
          brandName: item.brand_name,
        },
      }))
    : null;
};

export const searchGiftSets = async (searchKey: any, additionSearch: any, page: any) => {
  const searchQuery = {
    ...(searchKey.match('^\\d+$') ? { id: searchKey } : { title: searchKey }),
    limit: 10,
  };

  const filterQuery = {
    ...searchQuery,
    skip: Number(!isNil(page) ? page * 10 : 0),
  };
  const res = await axiosLoyaltyEngine()(`programs/reward/urgifts`, { params: filterQuery });

  return !isEmpty(res.data)
    ? res.data.map((item: any) => ({
        label: `${item.id} - ${item.name}`,
        value: item.id,
        data: {
          id: item.id,
          name: item.name,
        },
      }))
    : null;
};

