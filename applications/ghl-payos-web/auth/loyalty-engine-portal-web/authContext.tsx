import { Spin } from 'antd';
import { publicPageLoyaltyEngineList } from 'constants';
import router, { useRouter } from 'next/router';
import React, { createContext, useEffect, useState } from 'react';
import { verifyTokenMerchant } from './loyaltyEngineAuth';

type UserType = {
  email: string;
  accessToken: string;
};

type AuthUserContextType = {
  authUser: UserType | null;
  loading: boolean;
};

export const LoyaltyEngineAuthUserContext = createContext<AuthUserContextType>({
  authUser: null,
  loading: true,
});

interface ProviderProps {
  children: React.ReactNode;
}

export const LoyaltyEngineAuthUserProvider: React.FC<ProviderProps> = ({ children }) => {
  const auth = useProvideAuth();
  const { loading, authUser } = auth;
  const router = useRouter();
  let checkAuthUser: any = authUser;
  if (typeof window !== 'undefined') checkAuthUser = authUser || localStorage.getItem('user');
  const showContent = (checkAuthUser || publicPageLoyaltyEngineList.indexOf(router.pathname) !== -1) && !loading;
  return (
    <LoyaltyEngineAuthUserContext.Provider value={auth}>
      {showContent ? (
        children
      ) : (
        <div className='show-in-center'>
          <Spin />
        </div>
      )}
    </LoyaltyEngineAuthUserContext.Provider>
  );
};

export function useProvideAuth() {
  const [authUser, setAuthUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const authStateChanged = async (user: any) => {
    setLoading(true);
    if (!user) {
      setAuthUser(null);
      setLoading(false);
      if (publicPageLoyaltyEngineList.indexOf(router.pathname) == -1) router.replace('/login');
      return;
    }
    await verifyTokenMerchant()
      .then(() => {
        user = JSON.parse(user);
        setAuthUser(user);
      })
      .catch(() => {
        localStorage.clear();
        router.replace('/login');
      });
    setLoading(false);
  };

  useEffect(() => {
    authStateChanged(localStorage.getItem('user'));
  }, []);

  return {
    authUser,
    loading,
  };
}

export const logOut = async () => {
  router.push('/login');
  localStorage.clear();
  return;
};
