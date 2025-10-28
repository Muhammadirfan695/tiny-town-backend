
import axios from 'axios';
import { APP_SETTINGS } from '../../../config'; 
import { getApiConfig } from '../../../src/utils/apiUtils'; 

export const getAllUsersApi = (token, page = 1) => {
  const url = `${APP_SETTINGS.API_PATH.ADMIN.users}?page=${page}&limit=10`;
  return axios.get(url, getApiConfig(token, true));
};

export const createUserApi = (userData, token) => {
  return axios.post(APP_SETTINGS.API_PATH.ADMIN.users, userData, getApiConfig(token, true));
};

export const deleteUserApi = (userId, token) => {
  const url = APP_SETTINGS.API_PATH.ADMIN.userById(userId);
  return axios.delete(url, getApiConfig(token, true));
};

export const getUserByIdApi = (userId, token) => {
  const url = APP_SETTINGS.API_PATH.ADMIN.userById(userId);
  return axios.get(url, getApiConfig(token, true));
};

export const updateUserApi = (userId, userData, token) => {
  const dataWithId = {
    id: userId,
    ...userData,
  };
  const url = APP_SETTINGS.API_PATH.ADMIN.updateUser;
  return axios.patch(url, dataWithId, getApiConfig(token, true));
};