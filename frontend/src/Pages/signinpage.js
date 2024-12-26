import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './css/signinpage.css'

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useState('');
  const [emailcheck, setEmailcheck] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // 이메일 인증 완료 상태
  const [nicknameError, setNicknameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  // 닉네임 유효성 검사 함수 추가
  const validateNickname = (nickname) => {
    const nicknameRegex = /^[a-zA-Z0-9]+$/;
    return nicknameRegex.test(nickname);
  };

  // 비밀번호 유효성 검사 함수 추가
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  // 인증 코드 발송
  const handleVerificationCode = async () => {
    // 이메일 형식 검증을 위한 정규식
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!email || email.trim() === '') {
        alert('이메일을 입력해주세요');
        return;
    }

    if (!emailRegex.test(email)) {
        alert('올바른 이메일 형식이 아닙니다');
        return;
    }

    try {
        const response = await axios.post('/api/auth/send-verification', 
            { email },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.success) {
            alert('인증 코드가 이메일로 발송되었습니다!');
            
            // 버튼 비활성화 및 카운트다운 시작
            setIsButtonDisabled(true);
            setCountdown(20);

            const timer = setInterval(() => {
                setCountdown((prevCount) => {
                    if (prevCount <= 1) {
                        clearInterval(timer);
                        setIsButtonDisabled(false);
                        return 0;
                    }
                    return prevCount - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        } else {
            alert(response.data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.response?.data?.message || '인증 코드 발송에 실패했습니다.');
    }
  };

  // 인증 코드 확인
  const handleVerifyCode = async () => {
    if (!emailcheck) {
      alert('인증 코드를 입력해주세요');
      return;
    }

    try {
      const response = await axios.post('/api/auth/verify-code', {
        email,
        code: emailcheck
      });

      if (response.data.success && response.data.verified) {
        setIsVerified(true);
        alert('이메일 인증이 완료되었습니다.');
        checkFormValidity(); // 인증 완료 폼 유효성 재검사
      } else {
        alert('잘못된 인증 코드입니다.');
      }
    } catch (error) {
      alert('인증 코드 확인 중 오류가 발생했습니다.');
      console.error('Error:', error);
    }
  };

  // checkFormValidity 함수 수정
  const checkFormValidity = useCallback(() => {
    const isValidNickname = validateNickname(id) && id.trim() !== '';
    const isValidPassword = validatePassword(password) && password.trim() !== '';
    const isValidEmail = email.trim() !== '';
    const isEmailVerificationComplete = isVerified;
    const isNicknameVerificationComplete = isNicknameChecked;

    setIsFormValid(
      isValidNickname && 
      isValidPassword && 
      isValidEmail && 
      isEmailVerificationComplete &&
      isNicknameVerificationComplete
    );
  }, [id, password, email, isVerified, isNicknameChecked]);

  // useEffect 수정 - isNicknameChecked 의존성 추가
  useEffect(() => {
    checkFormValidity();
  }, [id, password, email, isVerified, isNicknameChecked, checkFormValidity]);

  // 각 입력 핸들러 수정
  const handleNicknameChange = (e) => {
    const value = e.target.value;
    setId(value);
    setIsNicknameChecked(false);  // 닉네임이 변경되면 중복확인 상태 초기화
    if (!validateNickname(value) && value !== '') {
      setNicknameError('닉네임은 영문자와 숫자만 사용 가능합니다.');
    } else {
      setNicknameError('');
    }
    checkFormValidity();
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (!validatePassword(value) && value !== '') {
      setPasswordError('비밀번호는 최소 8자리 이상, 영문자와 숫자를 포함해야 합니다.');
    } else {
      setPasswordError('');
    }
    checkFormValidity();
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    checkFormValidity();
  };

  const handleNicknameCheck = async () => {
    if (!id) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    if (!validateNickname(id)) {
      alert('닉네임은 영문자와 숫자만 사용 가능합니다.');
      return;
    }

    try {
      const response = await axios.post('/api/auth/check-nickname', { nickname: id });
      if (response.data.success) {
        alert('사용 가능한 닉네임입니다.');
        setIsNicknameChecked(true);
      } else {
        alert(response.data.message);
        setIsNicknameChecked(false);
      }
    } catch (error) {
      alert('닉네임 중복 확인 중 오류가 발생했습니다.');
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setId('');
    setEmailcheck('');
    setIsVerified(false);
    setIsNicknameChecked(false);
    setIsFormValid(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!isNicknameChecked) {
      alert('닉네임 중복 확인을 해주세요.');
      return;
    }

    if (!isVerified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }

    if (!validateNickname(id)) {
      alert('닉네임은 영문자와 숫자만 사용 가능합니다.');
      return;
    }

    if (!validatePassword(password)) {
      alert('비밀번호는 최소 8자리 이상, 영문자와 숫자를 포함해야 합니다.');
      return;
    }

    if (id.toLowerCase() === 'admin') {
      alert('Admin 계정으로는 회원가입이 불가능합니다.');
      return;
    }

    try {
      const response = await axios.post('/api/auth/signup', { 
        email, 
        password,
        id
      });

      if (response.data.success) {
        setIsRegistered(true);
        alert('회원가입이 완료되었습니다.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '회원가입 처리 중 오류가 발생했습니다.';
      alert(errorMessage);
      resetForm(); // 폼 초기화
      console.error('Error:', error);
    }
  };

  return (
    <div className="signin-container">
      {isRegistered ? (
        <p className="signin-success-message">회원가입이 완료되었습니다.</p>
      ) : (
        <div>
          <h2 className="signin-title">회원가입</h2>
          <form className="signin-form" onSubmit={handleSignUp}>
            <div className="signin-input-group">
              <label className="signin-label">ID:</label>
              <div className="email-verification-group">
                <input 
                  className="signin-input"
                  type="text" 
                  value={id} 
                  onChange={handleNicknameChange}
                  required 
                />
                <button 
                  type="button"
                  className="signin-verify-button"
                  onClick={handleNicknameCheck}
                  disabled={!validateNickname(id)}
                >
                  중복확인
                </button>
              </div>
              {nicknameError && <p className="input-error-message">{nicknameError}</p>}
            </div>
            <div className="signin-input-group">
              <label className="signin-label">Password:</label>
              <input 
                className="signin-input"
                type="password" 
                value={password} 
                onChange={handlePasswordChange}
                required 
              />
              {passwordError && <p className="input-error-message">{passwordError}</p>}
            </div>
            <div className="signin-input-group">
              <label className="signin-label">Email:</label>
              <div className="email-verification-group">
                <input 
                  className="signin-input"
                  type="email" 
                  value={email} 
                  onChange={handleEmailChange} 
                  required 
                />
                <button 
                  type="button"
                  className={`signin-verify-button ${isButtonDisabled ? 'disabled' : ''}`}
                  onClick={handleVerificationCode}
                  disabled={isButtonDisabled}
                >
                  {isButtonDisabled 
                    ? `재발송 대기중 (${countdown}초)` 
                    : '확인코드 발송'}
                </button>
              </div>
            </div>
            <div className="signin-input-group">
              <label className="signin-label">Email 확인코드:</label>
              <div className="email-verification-group">
                <input 
                  className="signin-input"
                  type="text" 
                  value={emailcheck} 
                  onChange={(e) => setEmailcheck(e.target.value)} 
                  required 
                />
                <button 
                  type="button"
                  className="signin-verify-button"
                  onClick={handleVerifyCode}
                >
                  확인
                </button>
              </div>
            </div>
            <button 
              className={`signin-submit-button ${!isFormValid ? 'disabled' : ''}`}
              type="submit"
              disabled={!isFormValid}
            >
              가입하기
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SignInPage;