import React from "react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="hidden sm:flex bg-blue-500 text-white flex-col md:flex-row justify-between items-center p-4">
      {/* Left: Contact Links */}
      <div className="flex gap-4 text-lg">
        <span>Contact</span>
        <span className="uppercase">Collaborators</span>
      </div>

      {/* Right: Social Icons */}
      <div className="flex gap-4 text-2xl mt-2 md:mt-0">
        <FaFacebook />
        <FaInstagram />
        <FaYoutube />
      </div>
    </footer>
  );
}

