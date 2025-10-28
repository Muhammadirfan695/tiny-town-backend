import {
    getAllUsersApi,
    createUserApi,
    deleteUserApi,
    updateUserApi, 
    getUserByIdApi 
} from '../api/adminApi';
import {
    getUsersRequest,
    getUsersSuccess,
    getUsersFailure,
    removeUser
} from '../reducers/userSlice';
import { loginRequest, loginFailure } from '../reducers/authSlice';
import { SuccessToast, ErrorToast } from '@/assets/AlertToast';

export const getAllUsersAction = (token, page) => async (dispatch) => {
  try {
    dispatch(getUsersRequest());
    const response = await getAllUsersApi(token, page);
    dispatch(getUsersSuccess(response.data.data));
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch users.";
    dispatch(getUsersFailure(message));
    ErrorToast(message);
  }
};

export const createUserAction = (userData, token, router) => async (dispatch) => {
    try {
        dispatch(loginRequest());
          const response = await createUserApi(userData, token);
    
    console.log("USER CREATION RESPONSE:", response.data);
        dispatch(loginFailure(null));
        SuccessToast("User created successfully!");
        router.push('/dashboard/users');
    } catch (error) {
        const message = error.response?.data?.message || "Failed to create user.";
        dispatch(loginFailure(message));
        ErrorToast(message);
    }
};

export const deleteUserAction = (userId, token) => async (dispatch) => {
    try {
        await deleteUserApi(userId, token);
        dispatch(removeUser(userId));
        SuccessToast("User deleted successfully.");
    } catch (error) {
        const message = error.response?.data?.message || "Failed to delete user.";
        ErrorToast(message);
    }
};

export const getUserByIdAction = (userId, token) => async (dispatch) => {
    try {
        dispatch(getUsersRequest());
        const response = await getUserByIdApi(userId, token);
        dispatch(getUsersFailure(null)); 
        return response.data.data.data; 
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch user details.";
        dispatch(getUsersFailure(message));
        ErrorToast(message);
        return null;
    }
};

export const updateUserAction = (userId, userData, token, router) => async (dispatch) => {
    try {
        dispatch(loginRequest());
        await updateUserApi(userId, userData, token);
        dispatch(loginFailure(null));
        SuccessToast("User updated successfully!");
        router.push('/dashboard/users');
    } catch (error) {
        const message = error.response?.data?.message || "Failed to update user.";
        dispatch(loginFailure(message));
        ErrorToast(message);
    }
};