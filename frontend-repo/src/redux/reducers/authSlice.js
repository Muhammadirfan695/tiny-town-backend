import { createSlice } from '@reduxjs/toolkit';

// Yeh function page load hone par localStorage se check karega ke user login hai ya nahi
const getInitialState = () => {
  // Yeh check zaroori hai taake code server par crash na ho
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('lunchfinder_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Agar user ka data localStorage mein hai, to usko Redux state mein daal do
        return {
          user: user,
          isAuthenticated: true,
          loading: false,
          error: null,
        };
      } catch (e) {
        // Agar data mein koi masla hai, to localStorage ko saaf kar do
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem('lunchfinder_user');
      }
    }
  }

  // Default state (agar user login nahi hai ya server par code chal raha hai)
  return {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };
};

const authSlice = createSlice({
  name: 'auth',
  // Shuruaati state ab getInitialState function se aayegi
  initialState: getInitialState(),
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // Logout karne par localStorage se user ka data zaroor hatayein
      if (typeof window !== 'undefined') {
        localStorage.removeItem('lunchfinder_user');
      }
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;