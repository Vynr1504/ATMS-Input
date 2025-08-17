// src/API.routes/getProfessorTimetable.js
import axios from "axios";

const BASE_URL =  "https://att-stu.manit.ac.in";

/**
 * Fetches professor's timetable.
 * If no day is provided, returns today's timetable.
 *
 * @param {string | number | null} [day=null] - Optional day (0-6 or "Monday" etc.)
 * @returns {Promise<Object>} - Timetable data
 */
const getProfessorTimetable = async (day = null) => {
  const token = localStorage.getItem("user_token");
  if (!token) {
    throw new Error("JWT token not found. Please log in.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/api/timetable/timeTable`, {
      headers: {
        authorization: token,
      },
      params: day ? { day } : {},
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching professor timetable:", error.response?.data || error.message);
    throw new Error("Failed to fetch professor timetable");
  }
};

export default getProfessorTimetable;
