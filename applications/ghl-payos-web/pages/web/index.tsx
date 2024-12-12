import { Spin } from 'antd';
import { LoyaltyEngineAuthUserContext } from 'auth/loyalty-engine-portal-web/authContext';
import { verifyTokenMerchant } from 'auth/loyalty-engine-portal-web/loyaltyEngineAuth';
import { REDIRECT_ROUTER } from 'constants';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext } from 'react';

const Home: NextPage = () => {
  const router = useRouter();
  const { authUser } = useContext(LoyaltyEngineAuthUserContext);

  if (authUser) {
    verifyTokenMerchant()
      .then(() => {
        router.push(REDIRECT_ROUTER);
      })
      .catch(() => {
        router.push('/login');
      });
  } else {
    router.push('/login');
  }
  
  return (
    <div className='show-in-center'>
      <Spin />
    </div>
  );
};
export default Home;
