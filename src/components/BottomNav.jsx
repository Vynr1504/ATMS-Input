import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUser } from "react-icons/fa";

export default function BottomNav() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-md flex justify-around items-center py-2 border-t sm:hidden">
      <Link
        to="/schedule"
        className={`flex flex-col items-center ${
          location.pathname === "/schedule" ? "text-black font-semibold" : "text-gray-500"
        }`}
      >
        <FaHome className="w-6 h-6" />
        <span className="text-sm mt-1">Schedule</span>
      </Link>

      <Link
        to="/profile"
        className={`flex flex-col items-center ${
          location.pathname === "/profile" ? "text-black font-semibold" : "text-gray-500"
        }`}
      >
        <FaUser className="w-6 h-6" />
        <span className="text-sm mt-1">Profile</span>
      </Link>
    </div>
  );
}
