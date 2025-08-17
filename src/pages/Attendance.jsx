import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import { getAttendance, setAttendance } from "../API.routes/attendance.api";
import { toast } from "react-toastify";

const Attendance = () => {
  // Memoize parsed class data to avoid re-parsing on every render
  const parsedClassData = useMemo(() => {
    const classDataRaw = localStorage.getItem("Class_Data");
    return classDataRaw ? JSON.parse(classDataRaw) : {};
  }, []);

  // Extract all data in one go and memoize
  const classInfo = useMemo(() => ({
    subjectName: parsedClassData?.subject?.subjectName,
    subjectId: parsedClassData?.subject?._id,
    subjectCode: parsedClassData?.subject?.subjectCode,
    isElective: parsedClassData?.subject?.isElective,
    branch: parsedClassData?.branch,
    section: parsedClassData?.section,
    batch: parsedClassData?.session,
  }), [parsedClassData]);

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [presentList, setPresentList] = useState([]);
  const [allPresent, setAllPresent] = useState(true);
  const [view, setView] = useState("attendees");

  const [attendanceCount, setAttendanceCount] = useState(() => {
    const saved = localStorage.getItem("attendance_count");
    return saved ? Number(saved) : 1;
  });

  const [remark, setRemark] = useState("Regular class");

  const navigate = useNavigate();
  const location = useLocation();

  // Memoize date calculations
  const dateInfo = useMemo(() => {
    const formatDateStr = (date) =>
      `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;

    const locationDate = location.state?.date;
    const dateParts = locationDate?.split("/") || [];
    const rawDate = dateParts.length === 3 ? new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`) : new Date();
    const todayDateStr = formatDateStr(rawDate);
    const dateTime = rawDate.toISOString();

    return { locationDate, rawDate, todayDateStr, dateTime };
  }, [location.state?.date]);

  const attendanceKey = useMemo(() => 
    `${classInfo.subjectId}_${dateInfo.todayDateStr}_attendance`,
    [classInfo.subjectId, dateInfo.todayDateStr]
  );
  const [message, setmessage] = useState("");
  const [attendanceAlreadyTaken, setAttendanceAlreadyTaken] = useState(false);

  // Memoized utility function to avoid recreation
  const isAlreadyFilledMessage = useCallback((msg) => {
    return typeof msg === "string" && msg.trim().toLowerCase() === "already filled";
  }, []);

  // Memoized toggle functions
  const toggleAttendance = useCallback((index) => {
    setPresentList((prev) => {
      const newList = prev.includes(index) 
        ? prev.filter((i) => i !== index) 
        : [...prev, index];
      setAllPresent(newList.length === students.length);
      return newList;
    });
  }, [students.length]);

  const toggleAll = useCallback(() => {
    setAllPresent((prev) => {
      const newState = !prev;
      setPresentList(newState ? students.map((_, i) => i) : []);
      return newState;
    });
  }, [students.length]);

  useEffect(() => {
    const attendanceTakenKey = `attendance_taken_${classInfo.subjectId}_${classInfo.branch}_${classInfo.section}_${classInfo.batch}_${dateInfo.todayDateStr}`;
    
    if (localStorage.getItem(attendanceTakenKey) === "true") {
      setAttendanceAlreadyTaken(true);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      if (!classInfo.subjectId) {
        toast.error("No subject ID found. Redirecting to schedule...");
        setTimeout(() => navigate("/schedule"), 2000);
        return;
      }

      try {
        setLoading(true);

        const payload = {
          branch: classInfo.branch,
          section: classInfo.section,
          batch: classInfo.batch,
          isElective: classInfo.isElective,
          subjectId: classInfo.subjectId,
          subjectCode: classInfo.subjectCode,
          dateTime: dateInfo.dateTime,
          count: 1,
        };

        const data = await getAttendance(payload);
        
        // Check if attendance is already filled
        if (isAlreadyFilledMessage(data.message)) {
          setmessage(data.message);
          setAttendanceAlreadyTaken(true);
          return;
        }
        
        setmessage(data.message);
        const allStudents = Array.isArray(data) ? data : (data.students || []);
        setStudents(allStudents);

        const savedAttendance = localStorage.getItem(attendanceKey);
        if (savedAttendance) {
          const savedIndexes = JSON.parse(savedAttendance);
          setPresentList(savedIndexes);
          setAllPresent(savedIndexes.length === allStudents.length);
        } else {
          const allIndexes = allStudents.map((_, i) => i);
          setPresentList(allIndexes);
          setAllPresent(true);
        }
      } catch (err) {
        console.error("❌ API error:", err.message);
        
        // Check if the error response contains "Already Filled" message
        if (isAlreadyFilledMessage(err.message)) {
          setmessage(err.message);
          setAttendanceAlreadyTaken(true);
          return;
        }
        
        toast.error("Failed to load attendance data.");
        setTimeout(() => navigate("/schedule"), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classInfo, dateInfo, attendanceKey, navigate, isAlreadyFilledMessage]);

  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem(attendanceKey, JSON.stringify(presentList));
    }
  }, [presentList, students, attendanceKey]);

  // Handle the roll numbers input directly
  const handleRollNumbersInput = (inputString, currentView) => {
    if (!students.length) return;
    
    // If input is empty, handle according to the current view
    if (!inputString || inputString.trim() === '') {
      if (currentView === "absentees") {
        // In absentees view, empty field means everyone is present
        const allIndices = students.map((_, i) => i);
        setPresentList(allIndices);
        setAllPresent(true);
      } else if (currentView === "attendees" && students.length > 0) {
        // In attendees view, we will keep everyone present as the default behavior
        const allIndices = students.map((_, i) => i);
        setPresentList(allIndices);
        setAllPresent(true);
      }
      return;
    }
    
    // Parse the comma-separated values
    const inputDigits = inputString
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0 && /^\d+$/.test(item));  // Keep only numeric entries
    
    if (inputDigits.length === 0) return; // No valid entries found
    
    // Find all students that match the entered digits
    const matchingIndices = [];
    inputDigits.forEach(digits => {
      // If digits are less than 2 characters, pad with leading zeros
      const paddedDigits = digits.padStart(2, '0').slice(-2);
      
      // Find students whose roll numbers end with these digits
      students.forEach((student, index) => {
        if (!student || !student.scholarNumber) return;
        
        const scholarNumber = student.scholarNumber.toString();
        const lastTwoDigits = scholarNumber.slice(-2).padStart(2, '0');
        
        if (lastTwoDigits === paddedDigits) {
          matchingIndices.push(index);
        }
      });
    });
    
    // Update the attendance based on the view
    if (currentView === "attendees") {
      // In attendees view, the explicitly listed students are present
      setPresentList(matchingIndices);
      setAllPresent(matchingIndices.length === students.length);
    } else {
      // In absentees view, mark everyone present EXCEPT those listed as absent
      const allStudentIndices = students.map((_, i) => i);
      const presentStudentIndices = allStudentIndices.filter(
        index => !matchingIndices.includes(index)
      );
      
      setPresentList(presentStudentIndices);
      setAllPresent(presentStudentIndices.length === students.length);
    }
  };

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("user_token");

      if (!token) {
        toast.warning("Session expired. Please login again.", {
          autoClose: 2000,
          pauseOnHover: false,
        });
        setTimeout(() => navigate("/login"), 2200);
        return;
      }

      // Optimize attendance array creation
      const presentSet = new Set(presentList);
      const attendanceArray = students.map((student, i) => ({
        "Scholar No.": student.scholarNumber,
        "Name of Student": student.StudentName || "Unnamed",
        isPresent: presentSet.has(i) ? "1" : "0",
      }));

      const formattedDate = `${dateInfo.rawDate.getFullYear()}-${String(dateInfo.rawDate.getMonth() + 1).padStart(2, "0")}-${String(dateInfo.rawDate.getDate()).padStart(2, "0")}`;

      const payload = {
        subjectId: classInfo.subjectId,
        subjectCode: classInfo.subjectCode,
        section: classInfo.section,
        branch: classInfo.branch,
        count: attendanceCount,
        dateTime: dateInfo.rawDate.toISOString(),
        remark,
        data: {
          date: formattedDate,
          attendance: attendanceArray,
        },
      };

      const response = await setAttendance(token, payload);
      localStorage.removeItem(attendanceKey);

      const attendanceTakenKey = `attendance_taken_${classInfo.subjectId}_${classInfo.branch}_${classInfo.section}_${classInfo.batch}_${dateInfo.todayDateStr}`;

      if (response && response.message === "success") {
        localStorage.setItem(attendanceTakenKey, "true");
        setTimeout(() => {
          setAttendanceAlreadyTaken(true);
        }, 2200);
      } else if (isAlreadyFilledMessage(response?.message)) {
        setmessage("Already Filled");
        setAttendanceAlreadyTaken(true);
      } else {
        toast.error("Failed to submit attendance.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit attendance.");
    } finally {
      setLoading(false);
    }
  }, [students, presentList, attendanceCount, remark, classInfo, dateInfo, attendanceKey, navigate, isAlreadyFilledMessage]);

  // Memoized navigation handler
  const handleBackToSchedule = useCallback(() => {
    if (dateInfo.locationDate) {
      // Convert DD/MM/YYYY back to ISO string for localStorage
      const dateParts = dateInfo.locationDate.split("/");
      if (dateParts.length === 3) {
        const isoDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`).toISOString();
        localStorage.setItem("selectedDate", isoDate);
      }
    }
    navigate("/schedule");
  }, [dateInfo.locationDate, navigate]);

  // Optimized attendees and absentees calculations
  const { attendees, absentees } = useMemo(() => {
    if (!students.length) return { attendees: "", absentees: "" };
    
    const presentSet = new Set(presentList);
    const presentNumbers = [];
    const absentNumbers = [];
    
    students.forEach((student, i) => {
      if (!student?.scholarNumber) return;
      
      const numStr = student.scholarNumber.toString();
      const lastTwoDigits = numStr.slice(-2).padStart(2, '0');
      
      if (presentSet.has(i)) {
        presentNumbers.push(lastTwoDigits);
      } else {
        absentNumbers.push(lastTwoDigits);
      }
    });
    
    // Sort numerically
    const sortNumerically = (a, b) => parseInt(a) - parseInt(b);
    presentNumbers.sort(sortNumerically);
    absentNumbers.sort(sortNumerically);
    
    return {
      attendees: presentNumbers.join(", "),
      absentees: absentNumbers.join(", ")
    };
  }, [students, presentList]);
  
  // Find a student index by the last two digits of their scholar number
  const findStudentByLastDigits = (lastDigits) => {
    // Convert input to string and ensure it's exactly 2 digits
    const searchDigits = lastDigits.toString().padStart(2, '0');
    
    // Find all matching students
    const matchingIndices = students.map((student, index) => {
      if (!student || !student.scholarNumber) return null;
      
      const scholarNumber = student.scholarNumber.toString();
      // Get the last two digits, regardless of scholar number length
      const lastTwoDigits = scholarNumber.slice(-2).padStart(2, '0');
      
      // Return the index if the last two digits match
      return lastTwoDigits === searchDigits ? index : null;
    }).filter(index => index !== null);
    
    return matchingIndices;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <Loader />
      </div>
    );
  }

  if (attendanceAlreadyTaken || isAlreadyFilledMessage(message)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-6">
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-4">
            ✅ Attendance Already Taken
            {/* <span title="You have submitted the attendance already" className="ml-2 text-blue-500 cursor-pointer inline-flex items-center">
              <FaInfoCircle />
            </span> */}
          </h2>
          <p className="text-gray-700 text-base sm:text-md">
            Attendance for this class has already been filled. You cannot submit attendance again for the same session.
          </p>
          <div className="mt-6">
            <button
              onClick={handleBackToSchedule}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Schedule
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-4 sm:p-6 flex justify-center mb-12 md:m-0">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl w-full max-w-5xl space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 text-center mb-4">
          Attendance for {classInfo.subjectName} - {dateInfo.todayDateStr}
        </h2>

        <div className="flex justify-center items-center bg-blue-100 px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-sm mb-4">
          <button
            onClick={toggleAll}
            className="text-base sm:text-lg font-semibold text-blue-700 bg-white px-4 py-1.5 sm:px-6 sm:py-2 rounded shadow hover:bg-blue-200 transition"
          >
            {allPresent ? "Mark All Absent" : "Mark All Present"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-blue-100 text-blue-700 text-left">
                <th className="py-2 px-4 border-b">Roll No</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b text-center">Present</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index} className="hover:bg-blue-50">
                  <td className="py-2 px-4 border-b">{student.scholarNumber}</td>
                  <td className="py-2 px-4 border-b">{student.StudentName || "Unnamed"}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <input
                      type="checkbox"
                      checked={presentList.includes(index)}
                      onChange={() => toggleAttendance(index)}
                      className="w-5 h-5"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-md flex flex-col items-center space-y-4">
          <div className="flex flex-col items-center text-sm w-full sm:w-auto mb-2">
            <label htmlFor="remark" className="font-semibold text-gray-700 mb-1">Remark:</label>
            <input
              id="remark"
              type="text"
              value={remark}
              onChange={e => setRemark(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 w-full sm:w-64 md:w-72 lg:w-80 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter remark (e.g. Regular class)"
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setView("absentees");
                // Force re-render of the input field when switching views
                setTimeout(() => {}, 0);
              }}
              className={`px-4 py-1 rounded border text-sm font-medium ${view === "absentees"
                  ? "bg-red-100 text-red-700 border-red-300"
                  : "bg-white text-gray-700"
                }`}
            >
              Absentees
            </button>
            <button
              onClick={() => {
                setView("attendees");
                // Force re-render of the input field when switching views
                setTimeout(() => {}, 0);
              }}
              className={`px-4 py-1 rounded border text-sm font-medium ${view === "attendees"
                  ? "bg-green-100 text-green-700 border-green-300"
                  : "bg-white text-gray-700"
                }`}
            >
              Attendees
            </button>
          </div>

          <div className="flex flex-col items-center text-sm w-full">
            <label className="font-semibold mb-1 capitalize">
              {view} Roll Nos: 
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {view === "attendees" ? presentList.length : students.length - presentList.length}/{students.length}
              </span>
            </label>
            <div className="flex flex-col items-center w-full max-w-full">
              <div className={`w-full md:w-80 border rounded ${view === "attendees" ? "border-green-300" : "border-red-300"}`}>
                <input
                  type="text"
                  value={view === "attendees" ? attendees : absentees}
                  onChange={(e) => {
                    // This will handle the editing of roll numbers directly in the input field
                    const inputValue = e.target.value.trim();
                    handleRollNumbersInput(inputValue, view);
                  }}
                  onBlur={(e) => {
                    // Process the input when the field loses focus
                    const inputValue = e.target.value.trim();
                    handleRollNumbersInput(inputValue, view);
                  }}
                  placeholder={view === "attendees" ? 
                    "Enter last 2 digits of roll numbers to mark as present" : 
                    "Enter last 2 digits of roll numbers to mark as absent"}
                  className={`px-4 py-2 w-full text-center focus:outline-none focus:ring
                    ${view === "attendees" ? "focus:border-green-300 bg-green-50" : "focus:border-red-300 bg-red-50"}`}
                />
              </div>
              <p className={`text-xs mt-2 font-medium w-full md:w-80 text-center ${view === "attendees" ? "text-green-700" : "text-red-700"}`}>
                {view === "attendees" 
                  ? "Only students with roll numbers entered above will be marked present" 
                  : "Students with roll numbers entered above will be marked absent"}
              </p>
              <p className="text-xs text-gray-500 mt-1 text-center w-full md:w-80">
                Enter last two digits separated by commas (e.g., 01, 05, 12)
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center text-sm w-full sm:w-auto">
            <label
              htmlFor="attendanceCount"
              className="font-semibold text-gray-700 mb-1"
            >
              Number of Attendances to Give:
            </label>
            <select
              id="attendanceCount"
              value={attendanceCount}
              onChange={(e) => {
                const value = Number(e.target.value);
                setAttendanceCount(value);
                localStorage.setItem("attendance_count", value);
              }}
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300 w-full sm:w-auto"
            >
              {[1, 2, 3, 4, 5].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-5 py-2 sm:px-6 rounded-md shadow-md hover:bg-green-600 transition"
          >
            Submit Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
