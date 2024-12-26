import './App.css'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header'; // Header 컴포넌트
import Login from './Pages/loginpage'; // Login 컴포넌트
import Calendar from "react-calendar";
import Signup from './Pages/signinpage'; // 회원가입 페이지 컴포넌트
import "react-calendar/dist/Calendar.css";



const Component = () => {
  return (
    <Router>
      <div className="container">
        <Header />
        <div className="content">
          <Routes>
            {/* /calendar 경로에 CalendarPage 렌더링 */}
            <Route path="/login" element={<Login />} />
            <Route path="/calendar" element={<Calendar />} /> 
            <Route path="/signup" element={<Signup />} /> 
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default Component;