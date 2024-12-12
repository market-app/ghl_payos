import { notification } from 'antd';
import { getUserAccessToken } from 'auth/loyalty-engine-portal-web/loyaltyEngineAuth';
import axios from 'axios';
import { CLIENT_AUTH, LOYALTY_ENGINE_PORTAL_API_ENDPOINT } from 'constants/loyalty-engine-portal-web';
import get from 'lodash/get';
import router from 'next/router';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CONSUMER_API_URL + LOYALTY_ENGINE_PORTAL_API_ENDPOINT,
  responseType: 'json',
  timeout: 60000,
});

axiosInstance.interceptors.request.use(function (config) {
  let endpoint = config?.url || '';

  if (!endpoint.includes(`${LOYALTY_ENGINE_PORTAL_API_ENDPOINT}/authentication`)) {
    const token = getUserAccessToken();
    config.headers!['Authorization'] = token ? `Bearer ${token}` : '';
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (get(error, 'response.status') == 401) {
      const url = new URL(error.config?.url || '', error.config.baseURL);
      const endpoint = url.pathname;

      if (!endpoint.includes(CLIENT_AUTH.LOGIN)) {
        notification.destroy();
        notification.error({
          message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.',
          placement: 'topRight',
        });
        localStorage.clear();
        router.replace('/login');
      }
    }
    throw error;
  },
);
export const axiosLoyaltyEngine = () => axiosInstance;
