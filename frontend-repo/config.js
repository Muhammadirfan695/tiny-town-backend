
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const APP_SETTINGS = {
  BASE_URL: baseUrl,

  API_PATH: {
    AUTH: {
      login: `${baseUrl}/auth/login`,
      forgotPassword: `${baseUrl}/auth/forgot-password`,
      resetPassword: `${baseUrl}/auth/reset-password`,
      requestMagicLink: `${baseUrl}/auth/magic-link`,
      loginWithMagicLink: `${baseUrl}/auth/magic-login`,
      changePassword: `${baseUrl}/auth/change-password`, 
    },
    USER: {
      profile: `${baseUrl}/user/profile`, 
    },
    ADMIN: {
      users: `${baseUrl}/admin/users`, 
      userById: (userId) => `${baseUrl}/admin/user/${userId}`, 
      updateUser: `${baseUrl}/admin/user`, 
    },
  },
};