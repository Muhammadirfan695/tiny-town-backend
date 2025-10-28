import {
  loginUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  requestMagicLinkApi,
  loginWithTokenApi,
  changePasswordApi,
} from "../api/authApi";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
} from "../reducers/authSlice";

import { SuccessToast, ErrorToast } from "../../assets/AlertToast";

export const loginAction = (credentials, router) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    const response = await loginUserApi(credentials);
    const userData = response.data.data.user;

    if (!userData || !userData.token) {
      ErrorToast("Invalid response from server.");
      throw new Error("Invalid response from server");
    }

    dispatch(loginSuccess(userData));
    localStorage.setItem("lunchfinder_user", JSON.stringify(userData));

    SuccessToast("Login Successful! Redirecting...");

    setTimeout(() => {
      // router.push('/');
      router.push("/dashboard");
    }, 1500);
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Invalid credentials or server error.";
    dispatch(loginFailure(errorMessage));

    ErrorToast(errorMessage);

    console.error("Login failed:", errorMessage);
  }
};

export const forgotPasswordAction = (email, router) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    await forgotPasswordApi({ email });
    dispatch(loginFailure(null));

    SuccessToast("OTP has been sent to your email!");

    router.push("/reset-password");
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to send OTP.";
    dispatch(loginFailure(errorMessage));
    ErrorToast(errorMessage);
  }
};

export const resetPasswordAction = (data, router) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    await resetPasswordApi(data);
    dispatch(loginFailure(null));

    SuccessToast("Password has been reset successfully!");

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to reset password.";
    dispatch(loginFailure(errorMessage));
    ErrorToast(errorMessage);
  }
};

export const requestMagicLinkAction = (email) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    await requestMagicLinkApi(email); 
    dispatch(loginFailure(null));

    SuccessToast("Magic Link sent! Please check your email.");
    return { success: true };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to send Magic Link.";
    dispatch(loginFailure(errorMessage));
    ErrorToast(errorMessage);
    return { success: false };
  }
};
export const loginWithTokenAction = (token, router) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const response = await loginWithTokenApi(token);
    const userData = response.data.data.user;

    if (!userData || !userData.token) {
      throw new Error("Invalid response from server");
    }

    dispatch(loginSuccess(userData));
    localStorage.setItem("lunchfinder_user", JSON.stringify(userData));

    SuccessToast("Logged in successfully via Magic Link!");

    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Invalid or expired Magic Link.";
    dispatch(loginFailure(errorMessage));
    ErrorToast(errorMessage);

    // Agar link ghalat hai to user ko wapas login page par bhej dein
    router.push("/login");
  }
};

export const logoutAction = (router) => (dispatch) => {
  dispatch(logout());

  SuccessToast("You have been logged out successfully.");

  router.push("/login");
};
export const changePasswordAction =
  (passwordData, token, router) => async (dispatch) => {
    console.log("Inside changePasswordAction, about to call API."); // <-- ADD THIS
    try {
      dispatch(loginRequest());

      const response = await changePasswordApi(passwordData, token);

      console.log("API call successful, response:", response); // <-- ADD THIS

      dispatch(loginFailure(null));
      SuccessToast("Password changed successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("API call FAILED inside action:", error); // <-- ADD THIS
      const message =
        error.response?.data?.message || "Failed to change password.";
      dispatch(loginFailure(message));
      ErrorToast(message);
    }
  };
