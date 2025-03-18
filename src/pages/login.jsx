import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import LoginForm from '../components/LoginComponent/LoginForm';

const Login = ({ setIsAuthenticated }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setIsAuthenticated(true);
      navigate('/dashboard');
    }
  }, [navigate, setIsAuthenticated]);

  const handleLogin = async (e, email, password) => {
    e.preventDefault();

    if (email === '' || password === '') {
      setAlertMessage('Please fill in all fields');
      return;
    }

    const data = { email, password };

    try {
      const response = await fetch("http://localhost:3001/web/employee/login-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        const { accessToken, refreshToken } = result.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        await getLoginUserData(accessToken);
      } else {
        setAlertMessage(result.message || "Login failed");
      }
    } catch (error) {
      setAlertMessage("Login failed");
    }
  };

  const getLoginUserData = async (accessToken) => {
    try {
      const response = await fetch("http://localhost:3001/web/employee/get-logged-in-employee-details", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("userData", JSON.stringify(result.data));
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setAlertMessage(result.message || "Failed to get user details");
      }
    } catch (error) {
      setAlertMessage("Failed to get user details");
    }
  };

  return (
    <Container maxWidth="xs">
      <LoginForm handleLogin={handleLogin} alertMessage={alertMessage} />
    </Container>
  );
};

export default Login;
