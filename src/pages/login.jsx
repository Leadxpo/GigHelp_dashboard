import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import LoginForm from '../components/LoginComponent/LoginForm';

// Decode JWT token
const decodeToken = (token) => {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (error) {
    console.error("Token decoding error:", error);
    return null;
  }
};

const Login = ({ setIsAuthenticated }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      const decoded = decodeToken(accessToken);

      if (decoded && decoded.exp * 1000 > Date.now()) {
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        alert("Session expired. Please login again.");
        navigate('/');
      }
    }
  }, [navigate, setIsAuthenticated]);

  const handleLogin = async (e, email, password) => {
    e.preventDefault();

    if (!email || !password) {
      setAlertMessage('Please fill in all fields');
      return;
    }

    const data = { email, password };

    try {
      const response = await fetch("http://localhost:3001/dashboard/systemuser/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const { token, user } = result.data;
        const decoded = decodeToken(token);

        if (!decoded || decoded.exp * 1000 < Date.now()) {
          setAlertMessage("Token is expired. Please login again.");
          return;
        }

        localStorage.setItem("accessToken", token);
        localStorage.setItem("userData", JSON.stringify(user));

        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setAlertMessage(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setAlertMessage("Login failed");
    }
  };

  return (
    <Container maxWidth="xs">
      <LoginForm handleLogin={handleLogin} alertMessage={alertMessage} />
    </Container>
  );
};

export default Login;
