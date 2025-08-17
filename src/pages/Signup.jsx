import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import React from "react";
import logo from '../assets/logo2.png';
import { IoMdPerson } from "react-icons/io";
import { FaLock } from "react-icons/fa6";
import Loader from '../components/Loader';

const Signup = ({ setIsAuthenticated }) => {


  const [loading , setLoading]=useState(false);


  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e) => {
    
    e.preventDefault();
    if (email && password) {
      setLoading(true);
      setTimeout(() => {
        setIsAuthenticated(true);
        navigate('/dashboard');
      }, 2000); // Delay for 2 seconds (2000 ms)
    } else {
      alert('Please enter valid credentials');
    }
  };

  return loading ? <Loader /> :   (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'black' }}
    >
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-3xl">
        {/* Left Panel */}
        <div className="bg-[#1e3a8a] text-white flex flex-col justify-center items-center md:w-2/5 w-full p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-2">MANIT BHOPAL</h2>
          <p className="text-sm text-center">Madhya Pradesh, India - 462003</p>
          <img src={logo} alt="MANIT Logo"  className="w-44 h-44 mt-6 border rounded-full" />
        </div>

        {/* Right Panel (Form) */}
        <div className="w-full md:w-3/5 p-6 md:p-8 bg-white">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Sign Up Panel</h3>
          <p className="text-sm text-gray-600 mb-6 text-center">Create your account</p>
          <form className="space-y-4" onSubmit={handleSignup}>
            {/* Email Field */}
            <div className="flex items-center border rounded px-3 py-2">
              <IoMdPerson className="text-gray-500 mr-2 text-xl" />
              <input
                type="email"
                placeholder="Email"
                className="w-full focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="flex items-center border rounded px-3 py-2">
              <FaLock className="text-gray-500 mr-2 text-xl" />
              <input
                type="password"
                placeholder="Password"
                className="w-full focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Sign Up
            </button>
          </form>

          {/* Switch to Login */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
