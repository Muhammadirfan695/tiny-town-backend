
import axios from 'axios';

export const getApiConfig = (token = null, isAdmin = false) => {
  const headers = {};

  if (isAdmin) {
    headers['x-api-admin-key'] = process.env.NEXT_PUBLIC_X_API_ADMIN_KEY;
  } else {
    headers['x-api-key'] = process.env.NEXT_PUBLIC_X_API_KEY;
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return { headers };
};