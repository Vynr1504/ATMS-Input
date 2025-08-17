import axios from "axios";

const BASE_URL =  "https://att-stu.manit.ac.in/api" ;

/**
 * Logs in a user using employee code and password.
 * @param {string} employeeCode - The user's employee code.
 * @param {string} password - The user's password.
 * @returns {Promise<string>} - JWT token if successful.
 * @throws {Error} - If login fails.
 */
export const userLogin = async (employeeCode, password) => {
    console.log(BASE_URL)
  try {
    const response = await axios.post(
      `${BASE_URL}/user/signIn`,
      {
        employeeCode,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }

    );

    const jwtToken = response?.data?.authorization;
    console.log(response.data)
    localStorage.setItem("user_Data", JSON.stringify(response.data));

    if (!jwtToken) {
      throw new Error("Token not found in response");
    }

    localStorage.setItem("user_token", jwtToken);
    console.log(`jwt ${jwtToken}`)
    return jwtToken;
  } catch (error) {
    console.error("User login failed:", error.response?.data || error.message);
    throw new Error("Login failed: " + (error.response?.data?.message || "Invalid credentials"));
  }
};
