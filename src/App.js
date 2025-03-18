import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/Home";
import Task from "./pages/Task";
import Profile from "./pages/profile";
import Disputes from "./pages/Disputes";
import Requsts from "./pages/Requsts";
import User from "./pages/users";
import Transections from "./pages/Transections";
import TermsAndConditions from "./pages/Terms&Conditions";
import Promotions from "./pages/Promotions";


import Layout from "./pages/layout";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("accessToken"));
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <Router>
      {!isAuthenticated ? (
        <Login setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <Routes>
          <Route
            element={
              <Layout
                onLogout={handleLogout}
                toggleSidebar={toggleSidebar}
                isSidebarCollapsed={isSidebarCollapsed}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          >
            {/* Main Pages */}
            <Route path="/home" element={<Home />} />
            <Route path="/task" element={<Task />} />
            <Route path="/disputes" element={<Disputes />} />
            <Route path="/user" element={<User />} />
            <Route path="/requsts" element={<Requsts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/transections" element={<Transections />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/termsconditions" element={<TermsAndConditions />} />
            {/* Redirects */}
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Route>
        </Routes>
      )}
    </Router>
  );
};

export default App;
