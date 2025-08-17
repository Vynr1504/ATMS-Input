import axios from "axios";

const BASE_URL =  "https://att-stu.manit.ac.in/api";


/**
 * Changes a user's password.
 * @param {string} oldPassword - Current password.
 * @param {string} newPassword - New password.
 * @param {string} confirmNewPassword - Confirm new password.
 * @returns {Promise<string>} - Success message.
 * @throws {Error} - If change fails.
 */

export const changeUserPassword = async (oldPassword, newPassword, confirmNewPassword) => {
  console.log(BASE_URL);
  try {
    const token = localStorage.getItem("user_token"); // Make sure it's stored from login

    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await axios.put(
      `${BASE_URL}/user/changePassword`,
      {
        oldPassword,
        newPassword,
        confirmNewPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      }
    );

    return response.data?.message || "Password changed successfully";
  } catch (error) {
    console.error("Change password failed:", error.response?.data || error.message);
    throw new Error("Failed to change password: " + (error.response?.data?.message || error.message));
  }
};

