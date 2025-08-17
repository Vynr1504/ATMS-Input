import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import ScheduleSkeleton from "../components/ScheduleSkeleton";
import getProfessorTimetable from "../API.routes/timetable.api";

// Move constant outside component to avoid recreation
const DAYS_MAP = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const getDayNumber = (dayStr) => DAYS_MAP[dayStr] ?? null;

export default function Schedule() {
  const today = useMemo(() => dayjs(), []); // Memoize today's date
  const savedDate = localStorage.getItem("selectedDate");
  
  // Memoize initial date calculation
  const initialDate = useMemo(() => {
    if (!savedDate) return today;
    const saved = dayjs(savedDate);
    return saved.isAfter(today, 'day') ? today : saved;
  }, [savedDate, today]);

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [scheduleData, setScheduleData] = useState([]);

  const formattedDate = useMemo(() => selectedDate.format("DD/MM/YYYY"), [selectedDate]);
  const isoDate = useMemo(() => selectedDate.toISOString(), [selectedDate]);
  const dayNumber = useMemo(() => getDayNumber(selectedDate.format("dddd")), [selectedDate]);

  // Memoize localStorage update to prevent unnecessary calls
  const updateSelectedDate = useCallback((newDate) => {
    setSelectedDate(newDate);
    localStorage.setItem("selectedDate", newDate.toISOString());
  }, []);

  // Debounced data fetching
  useEffect(() => {
    const fetchData = async () => {
      if (dayNumber === null) return;
      
      try {
        setLoading(true);
        const result = await getProfessorTimetable(dayNumber);
        setScheduleData(result?.TimeTable || []);
      } catch (err) {
        console.error("Failed to fetch schedule:", err);
        setScheduleData([]);
      } finally {
        setLoading(false);
      }
    };

    // Add small delay to prevent rapid API calls when date changes quickly
    const timeoutId = setTimeout(fetchData, 100);
    return () => clearTimeout(timeoutId);
  }, [dayNumber]);

  return (
    <div className="p-6 bg-[#f0fafd] min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold text-blue-700">Schedule</h2>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={selectedDate}
              onChange={updateSelectedDate}
              format="DD/MM/YYYY"
              maxDate={today}
              slotProps={{
                textField: {
                  size: "small",
                  className: "bg-white rounded border",
                },
              }}
            />
          </LocalizationProvider>
        </div>

        <div className="text-gray-600 mb-6 font-medium">
          Selected Date: <span className="text-black">{formattedDate}</span>
        </div>

        <div className="relative min-h-[120px]">
          {loading ? (
            <ScheduleSkeleton />
          ) : scheduleData.length > 0 ? (
            scheduleData.map((item, index) => (
              <Link
                to={`/myclass/${item.subject.subjectCode}`}
                state={{
                  subject: item.subject.subjectName,
                  subjectCode: item.subject.subjectCode,
                  section: item.section,
                  branch: item.branch,
                  date: formattedDate,
                  batch: item.batch,
                  isElective: item.isElective,
                  dateTime: isoDate,
                }}
                onClick={()=> localStorage.setItem("Class_Data", JSON.stringify(item))}
                key={index}
                className="block border rounded-lg p-4 mb-3 hover:bg-blue-50 transition-all"
              >
                <h3 className="font-bold text-lg text-blue-800">
                  {item.subject.subjectName}
                </h3>
                <p className="text-sm text-gray-700">
                  Code: {item.subject.subjectCode}
                </p>
                <p className="text-sm text-gray-700">
                  Section: {item.section} | Location: {item.location}
                </p>
                <p className="text-xs text-gray-500 mt-1">Time: {item.timing}</p>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-center mt-6">
              No classes scheduled for this day.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
