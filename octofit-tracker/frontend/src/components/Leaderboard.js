import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // REST API endpoint format: https://$REACT_APP_CODESPACE_NAME-8000.app.github.dev/api/leaderboard/
        const codespace = process.env.REACT_APP_CODESPACE_NAME || 'localhost:8000';
        const baseUrl = codespace.includes('localhost') 
          ? `http://${codespace}` 
          : `https://${codespace}-8000.app.github.dev`;
        
        const apiEndpoint = `${baseUrl}/api/leaderboard/`;
        console.log('Leaderboard - Fetching from API endpoint:', apiEndpoint);
        console.log('Leaderboard - REACT_APP_CODESPACE_NAME:', process.env.REACT_APP_CODESPACE_NAME);
        
        const response = await fetch(apiEndpoint);
        
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }
        
        const data = await response.json();
        console.log('Leaderboard - Raw fetched data:', data);
        console.log('Leaderboard - Data type:', Array.isArray(data) ? 'array' : 'object');
        
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = Array.isArray(data) ? data : data.results || [];
        console.log('Leaderboard - Processed entries count:', leaderboardData.length);
        setLeaderboard(leaderboardData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <strong>Error!</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">🏆 Leaderboard</h1>
          <span className="stats-badge">Total: {leaderboard.length} competitors</span>
        </div>
        
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User Name</th>
                <th>Team</th>
                <th>Activities</th>
                <th>Duration (min)</th>
                <th>Distance (km)</th>
                <th>Calories</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry._id}>
                  <td>
                    <span className={`badge ${entry.rank === 1 ? 'bg-warning text-dark' : entry.rank === 2 ? 'bg-secondary' : entry.rank === 3 ? 'bg-info' : 'bg-light text-dark'}`}>
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : ''} #{entry.rank}
                    </span>
                  </td>
                  <td><strong>{entry.user_name}</strong></td>
                  <td><span className="badge bg-info">Team {entry.team_id}</span></td>
                  <td>{entry.total_activities}</td>
                  <td>{entry.total_duration}</td>
                  <td>{entry.total_distance?.toFixed(2)}</td>
                  <td><span className="badge bg-success">{entry.total_calories}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
