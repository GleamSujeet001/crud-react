import { useState, useEffect } from 'react';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/signup';
import 'react-toastify/dist/ReactToastify.css';
import Header from './pages/Header';
import SignupList from './pages/SignupList';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom/dist';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    // Store the authentication status in localStorage when it changes
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  return (
    <Router>
      <Header setIsAuthenticated={setIsAuthenticated} userImage={userImage} />
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/" element={<Signup setUserImage={setUserImage} />} />
        <Route path="/signup-list" element={isAuthenticated ? <SignupList setUserImage={setUserImage} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
