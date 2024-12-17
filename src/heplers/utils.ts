import CryptoJS from "crypto-js";
import { MessagesType } from "@/model/message";
import { ENCRYPTION_KEY } from "@/services/const";

export const encryptMessage = (message: MessagesType): string => {
  const jsonString = JSON.stringify(message);
  const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
  return encrypted;
};

export const decryptMessage = (encryptedMessage: string): MessagesType => {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, ENCRYPTION_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
};

export const encryptValue = (value: string) => {
  const encrypted = CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
  return encrypted;
};

export const decryptValue = (value: string) => {
  const bytes = CryptoJS.AES.decrypt(value, ENCRYPTION_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
};

export const decryptObject = (encryptedMessage: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, ENCRYPTION_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
};
