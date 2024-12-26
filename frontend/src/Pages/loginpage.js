import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './css/loginpage.css';
import { useAuth } from '../context/AuthContext';

const Login = ({ setIsAdmin, setLoggedInEmail }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userNickname, setUserNickname] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    if (location.state?.from === '/photobooth') {
      
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!id || !password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('/api/auth/login', {
        id,
        password
      });

      if (response.data.success) {
        setIsAdmin(response.data.isAdmin);
        localStorage.setItem('isAdmin', response.data.isAdmin);
        
        setLoggedInEmail(id);
        localStorage.setItem('userEmail', id);

        login(response.data.nickname);
        setIsLoggedIn(true);
        setUserNickname(response.data.nickname);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '로그인 중 오류가 발생했습니다.';
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        alert(`${userNickname}님 안녕하세요.`);
        navigate(location.state?.from || '/');
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, userNickname, navigate, location.state]);

  return (
    <div className="login-container">
      <h2 className="login-title">로그인</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="login-input-group">
          <label className="login-label">아이디:</label>
          <input
            className="login-input"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="아이디를 입력하세요"
            required
          />
        </div>
        <div className="login-input-group">
          <label className="login-label">비밀번호:</label>
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>
        {error && <p className="login-error">{error}</p>}
        <button className="login-button" type="submit">
          로그인
        </button>
      </form>
    </div>
  );
};

export default Login;