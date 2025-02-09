import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { get, set } from 'lodash';
import { Repository } from 'typeorm';
import { HistoryRequestsEntity } from '../entities/payos/histoty-request.entity';

/**
 * create a new instance
 * @param instance axios instance
 */
export function createAxiosInstance(
  config: AxiosRequestConfig,
  log: Repository<HistoryRequestsEntity>,
  locationId?: string,
): AxiosInstance {
  let logId;
  const instance = axios.create(config);
  instance.interceptors.request.use(async function (config) {
    Object.keys(axios.defaults.headers.common).forEach((key) => {
      set(config, `headers.${key}`, axios.defaults.headers.common[key]);
    });
    const createLog = await log.save({
      appName: 'ghl_payos',
      method: config.method,
      url: config.url,
      request: {
        body: config.data,
        query: config.params,
      },
      createdAt: new Date(),
      createdBy: 'system',
      locationId,
    });
    logId = createLog.id;

    return config;
  });
  instance.interceptors.response.use(
    async (response) => {
      if (logId) {
        await log.update(
          {
            id: logId,
          },
          {
            response: get(response, 'data', response),
          },
        );
      }
      return response;
    },
    async (error) => {
      if (logId) {
        await log.update(
          {
            id: logId,
          },
          {
            error: get(error, 'response.data', error),
          },
        );
      }
      throw error;
    },
  );
  return instance;
}

export const ghlApi = ({
  log,
  locationId,
}: {
  log: Repository<HistoryRequestsEntity>;
  locationId?: string;
}): AxiosInstance => {
  const ghlApiConfig: AxiosRequestConfig = {
    baseURL: process.env.GHL_HOST,
    timeout: 60000,
  };

  const instance = createAxiosInstance(ghlApiConfig, log, locationId);
  return instance;
};

export const brevoApi = ({
  log,
  locationId,
}: {
  log: Repository<HistoryRequestsEntity>;
  locationId?: string;
}): AxiosInstance => {
  const brevoApiConfig: AxiosRequestConfig = {
    baseURL: process.env.BREVO_HOST,
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY || '',
    },
    timeout: 60000,
  };

  const instance = createAxiosInstance(brevoApiConfig, log, locationId);
  return instance;
};
