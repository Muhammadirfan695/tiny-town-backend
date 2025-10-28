import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import userReducer from './reducers/userSlice'; // Nayi slice ko import karein

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer, // Nayi slice ko yahan add karein
  },
});