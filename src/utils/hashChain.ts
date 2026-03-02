import CryptoJS from 'crypto-js';

export const generateHash = (previousHash: string, currentData: any): string => {
  const dataString = JSON.stringify(currentData, Object.keys(currentData).sort());
  const chainString = previousHash + dataString;
  return CryptoJS.SHA256(chainString).toString();
};

export const verifyHash = (previousHash: string, currentData: any, storedHash: string): boolean => {
  const calculatedHash = generateHash(previousHash, currentData);
  return calculatedHash === storedHash;
};