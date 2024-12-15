import { IPayOSPaymentGatewayKey } from 'types';
import { axiosPayOS } from 'utils/axios';

export const updatePaymentGatewayKeys = (keys: IPayOSPaymentGatewayKey, payload: string) => {
  return axiosPayOS()('/api/payos/apps/payment-gateway', {
    data: keys,
    method: 'patch',
    headers: {
      'x-sso-payload': payload,
    },
  });
};
