
import axios from 'axios';
import { APP_SETTINGS } from '../../../config';
import { getApiConfig } from '../../../src/utils/apiUtils'; 

export const loginUserApi = (credentials) => {
  return axios.post(APP_SETTINGS.API_PATH.AUTH.login, credentials, getApiConfig());
};

export const forgotPasswordApi = (email) => {
  return axios.post(APP_SETTINGS.API_PATH.AUTH.forgotPassword, { email }, getApiConfig());
};

export const resetPasswordApi = (data) => {
  return axios.post(APP_SETTINGS.API_PATH.AUTH.resetPassword, data, getApiConfig());
};

export const requestMagicLinkApi = (email) => {
  return axios.post(APP_SETTINGS.API_PATH.AUTH.requestMagicLink, { email }, getApiConfig());
};

export const loginWithTokenApi = (token) => {
  return axios.post(APP_SETTINGS.API_PATH.AUTH.loginWithMagicLink, { token }, getApiConfig());
};

export const changePasswordApi = (passwordData, token) => {
  return axios.post(APP_SETTINGS.API_PATH.AUTH.changePassword, passwordData, getApiConfig(token));
};