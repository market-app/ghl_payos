import { get } from 'lodash';
import { useState, useEffect } from 'react';

export function usePayload() {
  const [payload, setPayload] = useState('');

  const handleMessage = async ({ data }: MessageEvent) => {
    if (data.message !== 'REQUEST_USER_DATA_RESPONSE') {
      return;
    }

    window.removeEventListener('message', handleMessage);
    const encryptKey = get(data, 'payload');
    setPayload(encryptKey);
  };
  useEffect(() => {
    window.parent.postMessage({ message: 'REQUEST_USER_DATA' }, '*');

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return payload;
}
