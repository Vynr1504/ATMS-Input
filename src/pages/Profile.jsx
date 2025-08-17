import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Profile({ setIsAuthenticated }) {
  // ✅ Load and parse user data
  const savedDataRaw = localStorage.getItem("user_Data");
  const savedData = savedDataRaw ? JSON.parse(savedDataRaw) : null;

  const user = {
    name: savedData?.name || "N/A",
    employeeId: savedData?.employeeCode || "N/A",
    mobile: savedData?.mobile || "Not Provided", // Mobile is not in your object, so optional
    department: savedData?.department || "N/A",
  };

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("saved_credentials");
    localStorage.removeItem("user_Data");
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg flex flex-col md:flex-row items-center md:items-start p-6 gap-8 max-w-4xl w-full">
        
        {/* Left Section */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 text-black">
              <FaUserCircle size={80} />
            </div>
            <div>
              <p className="text-lg font-semibold">Name - {user.name}</p>
              <p className="text-md">Employee ID - {user.employeeId}</p>
              <p className="text-md">Department - {user.department}</p>
              <p className="text-md">Mobile No. - {user.mobile}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 mt-4 w-full">
            <Link
              to="/detailedprofile"
              className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded shadow-md text-center"
            >
              View Profile
            </Link>
            <button className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded shadow-md text-center">
              History
            </button>
            <Link
              to="/change-password"
              className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded shadow-md text-center"
            >
              Change Password
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-400 hover:bg-red-500 text-white px-6 py-2 text-center rounded shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
