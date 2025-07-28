import { IPayOSPaymentGatewayKey } from 'types';
import { axiosPayOS } from 'utils/axios';

export const getInfoApp = (payload: string) => {
  return axiosPayOS()('/api/payos/apps', {
    method: 'get',
    headers: {
      'x-sso-payload': payload,
    },
  });
};

export const updateInfoApp = (payload: string, email: string) => {
  return axiosPayOS()('/api/payos/apps', {
    method: 'post',
    headers: {
      'x-sso-payload': payload,
    },
    data: {
      email,
    },
  });
};

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
    timeout: 60000,
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

export const getPlans = (payload: string) => {
  return axiosPayOS()('/api/payos/plans', {
    method: 'get',
    headers: {
      'x-sso-payload': payload,
    },
  });
};

export const buyPlanByLocation = (payload: string, planId: number) => {
  return axiosPayOS()('/api/payos/plans', {
    method: 'post',
    data: {
      redirectUri: `${window.location.origin}/payment-success`,
      planId,
    },
    headers: {
      'x-sso-payload': payload,
    },
  });
};
