import useSWR from 'swr';
import { axiosLoyaltyEngine } from 'utils/axios';

export function useGetClient() {
  const fetch = () => axiosLoyaltyEngine().get('clients');

  const { data, error, mutate } = useSWR(`get-client`, fetch, {
    revalidateOnFocus: true,
  });
  return {
    data,
    loading: !error && !data,
    error,
    mutate,
  };
}
