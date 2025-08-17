import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changeUserPassword } from '../API.routes/changeUserPassword.api';
import { FaLock } from 'react-icons/fa6';
import Loader from '../components/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangeUserPassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast.warn('⚠️ Please fill in all fields');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('❌ New password and confirm password do not match');
      return;
    }

    setLoading(true);
    try {
      const msg = await changeUserPassword(oldPassword, newPassword, confirmNewPassword);
      toast.success(msg || '✅ Password changed successfully!', {
        autoClose: 2000,
      });

      // Clear inputs
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

      // Redirect after toast closes
      setTimeout(() => {
        navigate('/schedule');
      }, 2100);
    } catch (err) {
      toast.error(err.message || '❌ Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Change Password</h2>

        <form onSubmit={handleChangePassword} className="space-y-4">
          {/* Old Password */}
          <div className="flex items-center border rounded px-3 py-2">
            <FaLock className="text-gray-500 mr-2 text-xl" />
            <input
              type="password"
              placeholder="Old Password"
              className="w-full focus:outline-none"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          {/* New Password */}
          <div className="flex items-center border rounded px-3 py-2">
            <FaLock className="text-gray-500 mr-2 text-xl" />
            <input
              type="password"
              placeholder="New Password"
              className="w-full focus:outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          {/* Confirm New Password */}
          <div className="flex items-center border rounded px-3 py-2">
            <FaLock className="text-gray-500 mr-2 text-xl" />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full focus:outline-none"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Change Password
          </button>
        </form>
      </div>

      {/* Toast Container */}
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

export default ChangeUserPassword;
