import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { get, set } from 'lodash';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  responseType: 'json',
  timeout: 60000,
});

axiosInstance.interceptors.request.use(function (config) {
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    throw error;
  },
);
export const axiosPayOS = () => axiosInstance;
