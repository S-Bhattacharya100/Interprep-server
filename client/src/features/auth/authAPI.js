import axiosInstance from "../../utils/axiosInstance";

export const registerUser = (userData) => {
    return axiosInstance.post("auth/register", userData);
}
export const resendVerification = (emailData) => {
    return axiosInstance.post("auth/resend-verification", emailData);
}
export const loginUser = (credentials) => {
    return axiosInstance.post("auth/login", credentials);
}
export const verifyEmail = (token) => {
    return axiosInstance.get(`auth/verify-email?token=${token}`);
}
export const forgotPassword = (email) => {
    return axiosInstance.post("auth/forgot-password", {email});
}
export const resetPassword = (token, newPassword) => {
    return axiosInstance.post("auth/reset-password", {
        token, 
        newPassword
    });
}
export const refreshToken = (refreshTokenData) => {
    return axiosInstance.post("auth/refresh", refreshTokenData);
}
export const logoutUser = (refreshTokenData) => {
    return axiosInstance.post("auth/logout", refreshTokenData);
}
export const getCurrentUser = () => {
    return axiosInstance.get("auth/me");
};
