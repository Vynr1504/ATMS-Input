import { Link } from "react-router-dom";
import { FaHome, FaUser, FaPenFancy } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-blue-900 text-white flex items-center justify-between p-4">
      {/* Left: Logo and Brand */}
      <div className="flex items-center gap-2">
        <img src="/logo2.png" alt="MANIT Logo" className="w-8 h-8 rounded-full" />
        <span className="font-bold text-xl">MANIT Bhopal</span>
      </div>

      {/* Right: Links - hidden on mobile */}
      <div className="hidden sm:flex gap-6">
        <Link to="/schedule" className="flex items-center gap-2 hover:text-blue-300">
          <FaHome /> Home
        </Link>
        <Link to="/profile" className="flex items-center gap-2 hover:text-blue-300">
          <FaUser /> Profile
        </Link>
        <a href="#" className="flex items-center gap-2 hover:text-blue-300">
          <FaPenFancy /> MANIT
        </a>
      </div>
    </nav>
  );
}
