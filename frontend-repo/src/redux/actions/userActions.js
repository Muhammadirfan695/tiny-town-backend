import { updateProfileApi } from '../api/userApi';
import { loginRequest, loginSuccess, loginFailure } from '../reducers/authSlice';

// === THIS IS THE LINE TO FIX ===

// Change this incorrect line:
// import { SuccessToast, ErrorToast } from '@/components/common/AlertToast';

// To this correct line:
import { SuccessToast, ErrorToast } from '@/assets/AlertToast';

// ===============================


export const updateProfileAction = (userData, token) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const response = await updateProfileApi(userData, token);
    
    const updatedUser = response.data.data.data;
    
    dispatch(loginSuccess(updatedUser));
    localStorage.setItem('lunchfinder_user', JSON.stringify(updatedUser));
    
    SuccessToast("Profile updated successfully!");

  } catch (error) {
    const message = error.response?.data?.message || "Failed to update profile.";
    dispatch(loginFailure(message));
    ErrorToast(message);
  }
};