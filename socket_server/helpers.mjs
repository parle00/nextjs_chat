import CryptoJS from "crypto-js";

export const encryptValue = (value) => {
  const encrypted = CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
  return encrypted;
};

export const decryptValue = (value) => {
  const bytes = CryptoJS.AES.decrypt(value, ENCRYPTION_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
};
