import axios from "axios";

const BASE_URL =  "https://att-stu.manit.ac.in/api";

/**
 * Fetch the student list for attendance.
 * @param {object} params - { branch, section, batch, isElective, subjectId, subjectCode, dateTime, temp }
 * @returns {Promise<object>} - Student list data
 */
export const getAttendance = async ({
  branch,
  section,
  batch,
  isElective,
  subjectId,
  subjectCode = "",
  dateTime = "",
  temp = "",
}) => {
  
  try {
    const token = localStorage.getItem("user_token");
    if (!token) throw new Error("Admin not logged in. Token not found.");

    // Normalize section A/B to 1/2
    if (section === "A") section = "1";
    else if (section === "B") section = "2";

    // Ensure values are strings (especially for boolean & date)
    const queryParams = new URLSearchParams({
      branch,
      section,
      batch,
      isElective: String(isElective), // "true" or "false"
      subjectId,
      subjectCode,
      dateTime,
      temp,
    }).toString();

    const response = await axios.get(`${BASE_URL}/student/getStudentList?${queryParams}`, {
      headers: {
        authorization: token,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Student List:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching student list:", error.response?.data || error.message);
    
    // Check if the error response contains "Already Filled" message
    if (error.response?.data?.message === "Already Filled") {
      throw new Error("Already Filled");
    }
    
    throw new Error(error.response?.data?.message || "Failed to fetch student list");
  }
};
















/**
 * Submit attendance data.
 * @param {string} token - User auth token
 * @param {object} payload - Attendance payload
 */
export const setAttendance = async (token, payload) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/attendance/setAttendance`,
      payload,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("set attendance");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error submitting attendance:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error submitting attendance");
  }
};










// /**
//  * Set attendance for a specific class.
//  * @param {string} token - JWT token
//  * @param {object} data - Attendance payload
//  * @returns {Promise<string>} - Success response
//  */
// export const setAttendance = async (token, data) => {
//   try {
//     const response = await axios.post(
//       `${BASE_URL}/api/attendance/setAttendance`,
//       data,
//       {
//         headers: {
//           Authorization: token,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error setting attendance:", error.response?.data || error.message);
//     throw error;
//   }
// };
