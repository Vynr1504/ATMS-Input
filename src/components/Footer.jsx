import React from "react";
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaLinkedin, FaGlobe } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="hidden sm:block bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          
          {/* Left Section: Contact and Collaborators */}
          <div className="flex flex-col md:flex-row gap-8 text-base">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-blue-100 mb-3">Contact Us</h3>
              <div className="space-y-1 text-blue-200">
                <p>Email: info@manit.ac.in</p>
                <p>Phone: +91-755-4051000</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-blue-100 mb-3">Collaborators</h3>
              <div className="bg-blue-600/30 backdrop-blur-sm rounded-lg p-3 border border-blue-400/20">
                <p className="font-medium text-blue-100">V. Yogananda Reddy</p>
                <p className="text-sm text-blue-300">MANIT Bhopal '26</p>
              </div>
            </div>
          </div>

          {/* Right Section: Social Media */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-blue-100">Follow MANIT Bhopal</h3>
            <div className="flex gap-4">
              {/* Official MANIT Website */}
              <a 
                href="https://www.manit.ac.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600/40 hover:bg-blue-500/60 p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                aria-label="MANIT Official Website"
              >
                <FaGlobe className="text-2xl group-hover:text-blue-200" />
              </a>
              
              {/* Facebook */}
              <a 
                href="https://www.facebook.com/MANIT.Bhopal" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600/40 hover:bg-blue-500/60 p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                aria-label="MANIT Facebook"
              >
                <FaFacebook className="text-2xl group-hover:text-blue-200" />
              </a>
              
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/manit_bhopal" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600/40 hover:bg-blue-500/60 p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                aria-label="MANIT Instagram"
              >
                <FaInstagram className="text-2xl group-hover:text-blue-200" />
              </a>
              
              {/* YouTube */}
              <a 
                href="https://www.youtube.com/c/MANITBhopal" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600/40 hover:bg-blue-500/60 p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                aria-label="MANIT YouTube"
              >
                <FaYoutube className="text-2xl group-hover:text-blue-200" />
              </a>
              
              {/* Twitter */}
              <a 
                href="https://twitter.com/MANIT_Bhopal" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600/40 hover:bg-blue-500/60 p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                aria-label="MANIT Twitter"
              >
                <FaTwitter className="text-2xl group-hover:text-blue-200" />
              </a>
              
              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/school/manit-bhopal" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600/40 hover:bg-blue-500/60 p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                aria-label="MANIT LinkedIn"
              >
                <FaLinkedin className="text-2xl group-hover:text-blue-200" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Section: Copyright and Institute Info */}
        <div className="border-t border-blue-400/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-blue-300">
            <div className="text-center md:text-left">
              <p className="font-medium text-blue-200 mb-1">
                Maulana Azad National Institute of Technology, Bhopal
              </p>
              <p>Link Road No. 3, Bhopal - 462003, Madhya Pradesh, India</p>
            </div>
            <div className="text-center md:text-right">
              <p>&copy; {new Date().getFullYear()} MANIT Bhopal. All rights reserved.</p>
              <p className="text-xs mt-1">An Institute of National Importance</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}