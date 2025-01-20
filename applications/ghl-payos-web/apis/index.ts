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

export const getPaymentGatewayKeys = (payload: string) => {
  return axiosPayOS()('/api/payos/apps/payment-gateway', {
    method: 'get',
    headers: {
      'x-sso-payload': payload,
    },
  });
};

export const createPaymentLink = (body: Record<string, any>) => {
  return axiosPayOS()('api/payos/apps/payment-link', {
    method: 'post',
    data: body,
  });
};

export const getActiveSubscription = (payload: string) => {
  return axiosPayOS()('/api/payos/subscriptions', {
    method: 'get',
    headers: {
      'x-sso-payload': payload,
    },
  });
};

export const buyPlanByLocation = (payload: string) => {
  return axiosPayOS()('/api/payos/plans', {
    method: 'post',
    data: {
      redirectUri: `${window.location.href}/payment-success`,
      // TODO: add data planId
    },
    headers: {
      'x-sso-payload': payload,
    },
  });
};

export const getPlans = (payload: string) => {
  return axiosPayOS()('/api/payos/plans', {
    method: 'get',
    headers: {
      'x-sso-payload': payload,
    },
  });
};
