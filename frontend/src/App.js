import './App.css'; 
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import HeaderNavi from './components/Header/HeaderNavi';
import Body from './components/Main/body1';
import Footer from './components/Footer/Footer';
import Login from './Pages/loginpage';
import Calendar from "react-calendar";
import Signup from './Pages/signinpage';
import Bake from './Pages/bake';
import Settings from './Pages/settings';
import NoticePage from './Pages/NoticePage';
import "react-calendar/dist/Calendar.css";
import { AuthProvider } from './context/AuthContext';
import NoticeList from './components/Notice/NoticeList';
import NoticeForm from './components/Notice/NoticeForm';
import PhotoBoothPage from './Pages/PhotoBoothPage';



const AppContent = () => {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState('');

  useEffect(() => {
    const adminStatus = sessionStorage.getItem('isAdmin') === 'true';
    const savedEmail = sessionStorage.getItem('userEmail');
    setIsAdmin(adminStatus);
    if (savedEmail) {
      setLoggedInEmail(savedEmail);
    }

    const handleBeforeUnload = () => {
      sessionStorage.clear();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const hideComponentsOnPaths = ["/login", "/signin", "/calendar", "/bake", "/signup","/notice","/photobooth"];

  return (
    <div className="container">
      <Header isAdmin={isAdmin} loggedInEmail={loggedInEmail} setLoggedInEmail={setLoggedInEmail} setIsAdmin={setIsAdmin} />
      <div className="content">
        <Routes>
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/bake" element={<Bake />} />
          <Route path="/photobooth" element={<PhotoBoothPage />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/notice/create" element={<NoticeForm />} />
          <Route path="/login" element={<Login setIsAdmin={setIsAdmin} setLoggedInEmail={setLoggedInEmail} />} />
          {isAdmin ? (
            <Route path="/settings" element={<Settings />} />
          ) : (
            <Route path="/settings" element={<Navigate to="/" />} />
          )}
          <Route path="/notices" element={<NoticeList />} />
          <Route path="/notices/create" element={<NoticeForm />} />
          <Route path="/photobooth" element={<PhotoBoothPage />} />
        </Routes>

        {!hideComponentsOnPaths.includes(location.pathname) && location.pathname !== '/settings' && (
          <>
            <HeaderNavi isAdmin={isAdmin} />
            <Body isAdmin={isAdmin} loggedInEmail={loggedInEmail} />
            <Footer />
          </>
        )}
      </div>
    </div>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;