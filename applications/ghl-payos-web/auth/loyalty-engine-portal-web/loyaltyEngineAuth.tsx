import { CLIENT_AUTH, LOYALTY_ENGINE, STRATEGY } from 'constants/loyalty-engine-portal-web';
import { get } from 'lodash';
import nProgress from 'nprogress';
import { axiosLoyaltyEngine } from 'utils/axios';

enum LOCAL_STORAGE_KEY {
  USER_JWT = 'user-jwt',
}
export const verifyTokenMerchant = async () => {
  const token = getUserAccessToken();
  if (token) {
    nProgress.start();
    return await axiosLoyaltyEngine()
      .get(CLIENT_AUTH.VERIFY_TOKEN, {
        params: { token: token, isEncode: false, strategy: STRATEGY },
      })
      .then((res: any) => {
        return res.data;
      })
      .catch((err: any) => {
        throw err;
      })
      .finally(() => {
        nProgress.done();
      });
  } else throw new Error('Invalid token');
};

export const logIn = async (email: string, password: string) => {
  return axiosLoyaltyEngine()
    .post(CLIENT_AUTH.LOGIN, {
      username: email,
      password: password,
      client: LOYALTY_ENGINE,
    })
    .then((res) => {
      const formattedUser = {
        email: get(res, 'email'),
        accessToken: get(res, 'access_token', ''),
      };
      localStorage.setItem('user', JSON.stringify(formattedUser));
      setUserAccessToken(formattedUser.accessToken);
    });
};

export function getUserAccessToken() {
  return localStorage.getItem(LOCAL_STORAGE_KEY.USER_JWT);
}

export function setUserAccessToken(token: string) {
  return localStorage.setItem(LOCAL_STORAGE_KEY.USER_JWT, token);
}
