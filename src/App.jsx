import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
  const [User, setUser] = useState({ employeeCode: '' });
  const [Subject, setSubject] = useState({
    _id: '',
    subjectCode: '',
    subjectName: '',
    department: '',
    isElective: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for authentication on page load/refresh
  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('user');
    const savedSubject = localStorage.getItem('subject');
    
    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
      if (savedSubject) {
        setSubject(JSON.parse(savedSubject));
      }
    }
    setIsLoading(false);
  }, []);
  
  // Update localStorage when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('isAuthenticated', 'true');
      // Only store employeeCode, never store password
      const userDataToStore = { employeeCode: User.employeeCode };
      localStorage.setItem('user', JSON.stringify(userDataToStore));
      localStorage.setItem('subject', JSON.stringify(Subject));
    } else {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      localStorage.removeItem('subject');
    }
  }, [isAuthenticated, User, Subject]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

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
