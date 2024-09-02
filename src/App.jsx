import { useState, useEffect } from 'react';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import 'react-toastify/dist/ReactToastify.css';
import Header from './pages/Header';
import SignupList from './pages/SignupList';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Adduser from './pages/Adduser';
import StudentList from './pages/StudentList';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [userData, setUserData] = useState(null); // Store user data
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    // Store the authentication status in localStorage when it changes
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);
  
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  return (
    <Router>
      <Header setIsAuthenticated={setIsAuthenticated} onSearch={handleSearch} userData={userData} />
      <Routes>
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} setUserData={setUserData} />}
        />
        <Route path="/Adduser" element={<Adduser setIsAuthenticated={setIsAuthenticated} />} />

        {/* Protect the Student List route */}
        <Route
          path="/Student-list"
          element={
            isAuthenticated ? (
              <StudentList setIsAuthenticated={setIsAuthenticated} setUserImage={setUserImage} searchQuery={searchQuery} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="/" element={<Signup />} />
        
        <Route
          path="/signup-list"
          element={isAuthenticated ? <SignupList /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
