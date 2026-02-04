import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  // Log environment configuration on app load (development only)
  if (process.env.NODE_ENV === 'development') {
    console.log('=== OctoFit Tracker App Configuration ===');
    console.log('REACT_APP_CODESPACE_NAME:', process.env.REACT_APP_CODESPACE_NAME);
    console.log('Node Environment:', process.env.NODE_ENV);
    console.log('Backend API Base URL:', 
      process.env.REACT_APP_CODESPACE_NAME 
        ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev` 
        : 'http://localhost:8000'
    );
  }
  
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <img src="/octofit-logo.png" alt="OctoFit Logo" className="navbar-logo" />
              <strong>OctoFit Tracker</strong>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/activities">
                    Activities
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">
                    Leaderboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teams">
                    Teams
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/users">
                    Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/workouts">
                    Workouts
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="container mt-5">
              <div className="welcome-container">
                <h1 className="welcome-title display-3">🏋️ Welcome to OctoFit Tracker</h1>
                <p className="welcome-subtitle">Track your fitness activities and compete with your team!</p>
                <hr className="my-4" />
                <div className="row mt-5">
                  <div className="col-md-4 mb-3">
                    <div className="card text-center">
                      <div className="card-body">
                        <h2 className="card-title">🏃</h2>
                        <h5 className="card-subtitle mb-2 text-muted">Track Activities</h5>
                        <p className="card-text">Log all your fitness activities and monitor progress</p>
                        <Link to="/activities" className="btn btn-primary">View Activities</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card text-center">
                      <div className="card-body">
                        <h2 className="card-title">🏆</h2>
                        <h5 className="card-subtitle mb-2 text-muted">Leaderboard</h5>
                        <p className="card-text">Compete with others and climb the rankings</p>
                        <Link to="/leaderboard" className="btn btn-primary">View Leaderboard</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card text-center">
                      <div className="card-body">
                        <h2 className="card-title">💪</h2>
                        <h5 className="card-subtitle mb-2 text-muted">Workout Plans</h5>
                        <p className="card-text">Discover personalized workout routines</p>
                        <Link to="/workouts" className="btn btn-primary">View Workouts</Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-md-6 mb-3">
                    <div className="card text-center">
                      <div className="card-body">
                        <h2 className="card-title">👥</h2>
                        <h5 className="card-subtitle mb-2 text-muted">Join Teams</h5>
                        <p className="card-text">Collaborate with your team members</p>
                        <Link to="/teams" className="btn btn-primary">View Teams</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="card text-center">
                      <div className="card-body">
                        <h2 className="card-title">👤</h2>
                        <h5 className="card-subtitle mb-2 text-muted">User Profiles</h5>
                        <p className="card-text">View all registered users and their stats</p>
                        <Link to="/users" className="btn btn-primary">View Users</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          } />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

