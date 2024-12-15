import CryptoJS from 'crypto-js';

export const formatKeysToEncrypt = ({
  apiKey,
  checksumKey,
  clientId,
}: {
  apiKey: string;
  clientId: string;
  checksumKey: string;
}): string => `${apiKey}:${clientId}:${checksumKey}`;

export const formatKeysToDecrypt = (str: string): Record<string, any> => {
  const [apiKey, clientId, checksumKey] = str.split(':');
  return {
    apiKey,
    clientId,
    checksumKey,
  };
};
// Mã hóa 3 key thành 1 key duy nhất
export const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, process.env.MASTER_KEY || '').toString();
};

// Giải mã để lấy lại 3 key ban đầu
export const decrypt = (encryptedText: string): string => {
  const bytes = CryptoJS.AES.decrypt(
    encryptedText,
    process.env.MASTER_KEY || '',
  );
  return bytes.toString(CryptoJS.enc.Utf8);
};
