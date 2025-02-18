import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="navbar-title">mExpress Dashboard</h1>
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="content-box">
          <h2 className="content-title">Welcome to mExpress</h2>
          <p className="content-text">Your dashboard content will appear here.</p>
        </div>
      </main>
    </div>
  );
};