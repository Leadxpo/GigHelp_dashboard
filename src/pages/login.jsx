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
      const response = await fetch("http://localhost:3001/dashboard/systemuser/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const { token, user } = result.data;

        console.log("✅ token:", token);
        console.log("✅ user Data:", user);

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
