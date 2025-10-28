import axios from 'axios';


export const getApiConfig = (token = null, isAdmin = false) => {
  const headers = {
    'x-api-key': isAdmin 
      ? process.env.NEXT_PUBLIC_X_API_ADMIN_KEY 
      : process.env.NEXT_PUBLIC_X_API_KEY,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return { headers };
};