
import axios from 'axios';
import { APP_SETTINGS } from '../../../config'; 
import { getApiConfig } from '../../../src/utils/apiUtils';

export const updateProfileApi = (userData, token) => {
  return axios.patch(APP_SETTINGS.API_PATH.USER.profile, userData, getApiConfig(token));
};