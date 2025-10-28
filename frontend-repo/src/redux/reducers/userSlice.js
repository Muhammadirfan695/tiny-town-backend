import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  loading: false,
  error: null,
  // === ADD THESE NEW PROPERTIES FOR PAGINATION ===
  currentPage: 1,
  totalPages: 1,
  totalUsers: 0,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    getUsersRequest: (state) => {
      state.loading = true;
    },
    getUsersSuccess: (state, action) => {
      state.loading = false;
      // The payload will now be an object with users and pagination info
      state.users = action.payload.data;
      state.currentPage = action.payload.page;
      state.totalPages = action.payload.totalPages;
      state.totalUsers = action.payload.total;
    },
    getUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    removeUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
      state.totalUsers -= 1; // Decrement total users on delete
    },
  },
});

export const { getUsersRequest, getUsersSuccess, getUsersFailure, removeUser } = userSlice.actions;
export default userSlice.reducer;