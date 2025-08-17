import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Schedule from './pages/Schedule';
import Profile from './pages/Profile';
import DetailedProfile from './pages/DetailedProfile';
import Attendance from './pages/Attendance';
import BottomNav from './components/BottomNav';
import ChangeUserPassword from './pages/ChangeUserPassword';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [User, setUser] = useState({ employeeCode: '', password: '' });
  const [Subject, setSubject] = useState({
    _id: '678ce483cd76735183ab8342',
    subjectCode: 'CSE221',
    subjectName: 'Algorithm Design & Analysis',
    department: 'CSE',
    isElective: true,
  });

  return (
    <div className="">
      {isAuthenticated && <Navbar />}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Schedule />
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
              )
            }
          />
          <Route
            path="/signup"
            element={<Signup setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/schedule"
            element={
              isAuthenticated ? (
                <Schedule setSubject={setSubject} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                <Profile setIsAuthenticated={setIsAuthenticated} User={User} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/detailedprofile"
            element={
              isAuthenticated ? <DetailedProfile /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/myclass/:classId"
            element={
              isAuthenticated ? (
                <Attendance Subject={Subject} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/change-password" element={<ChangeUserPassword />} />

          {/* Catch-all inside App-2 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {isAuthenticated && <BottomNav />}
      {isAuthenticated && <Footer />}
    </div>
  );
}

export default App;
