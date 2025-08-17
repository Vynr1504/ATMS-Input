import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import React from "react";
import { IoMdPerson } from "react-icons/io";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa6";
import Loader from '../components/Loader';
import { userLogin } from '../API.routes/userLogin.api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ setIsAuthenticated, setUser }) => {
  const [loading, setLoading] = useState(true);
  const [employeeCode, setEmployeeCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCredentials = JSON.parse(localStorage.getItem("saved_credentials"));
    if (savedCredentials?.employeeCode && savedCredentials?.password) {
      userLogin(savedCredentials.employeeCode, savedCredentials.password)
        .then((token) => {
          localStorage.setItem("user_token", token);
          setUser(savedCredentials);
          setIsAuthenticated(true);
          setTimeout(() => navigate('/dashboard'), 1000);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!employeeCode || !password) {
      toast.warn("Please enter both Employee Code and Password");
      return;
    }

    setLoading(true);

    try {
      const token = await userLogin(employeeCode, password);
      localStorage.setItem("user_token", token);
      localStorage.setItem("saved_credentials", JSON.stringify({ employeeCode, password }));
      setUser({ employeeCode, password });
      setIsAuthenticated(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      if (error?.message === 'Invalid credentials') {
        toast.error('Employee Code or Password is incorrect!');
      } else {
        toast.error('Login Failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return loading ? (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Loader />
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-3xl">

        <div className="bg-[#1e3a8a] text-white flex flex-col justify-center items-center md:w-2/5 w-full p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-2">MANIT BHOPAL</h2>
          <p className="text-sm text-center">Madhya Pradesh, India - 462003</p>
          <img src={"/logo2.png"} alt="MANIT Logo" className="w-44 h-44 mt-6" />
        </div>

        <div className="w-full md:w-3/5 p-6 md:p-8 bg-white">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Login Panel</h3>
          <p className="text-sm text-gray-600 mb-6 text-center">Sign in to your account</p>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="flex items-center border rounded px-3 py-2">
              <IoMdPerson className="text-gray-500 mr-2 text-xl" />
              <input
                type="text"
                placeholder="Employee Code"
                className="w-full focus:outline-none"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
              />
            </div>

            <div className="flex items-center border rounded px-3 py-2">
              <FaLock className="text-gray-500 mr-2 text-xl" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div onClick={togglePasswordVisibility} className="cursor-pointer pl-2">
                {showPassword ? <FaEyeSlash className="text-gray-500 text-xl" /> : <FaEye className="text-gray-500 text-xl" />}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
          </p>
          <p className="mt-2 text-center text-sm text-gray-600">
            Forgot Password?{" "}
            <Link to="/change-password" className="text-blue-500 hover:underline">Reset Here</Link>
          </p>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Login;
