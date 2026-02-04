import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // REST API endpoint format: https://$REACT_APP_CODESPACE_NAME-8000.app.github.dev/api/leaderboard/
        const codespace = process.env.REACT_APP_CODESPACE_NAME || 'localhost:8000';
        const baseUrl = codespace.includes('localhost') 
          ? `http://${codespace}` 
          : `https://${codespace}-8000.app.github.dev`;
        
        const leaderboardEndpoint = `${baseUrl}/api/leaderboard/`;
        const teamsEndpoint = `${baseUrl}/api/teams/`;
        console.log('Leaderboard - Fetching from API endpoints:', leaderboardEndpoint, teamsEndpoint);
        console.log('Leaderboard - REACT_APP_CODESPACE_NAME:', process.env.REACT_APP_CODESPACE_NAME);
        
        const [leaderboardResponse, teamsResponse] = await Promise.all([
          fetch(leaderboardEndpoint),
          fetch(teamsEndpoint)
        ]);
        
        if (!leaderboardResponse.ok || !teamsResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const leaderboardData = await leaderboardResponse.json();
        const teamsData = await teamsResponse.json();
        console.log('Leaderboard - Raw fetched leaderboard data:', leaderboardData);
        console.log('Leaderboard - Raw fetched teams data:', teamsData);
        
        // Handle both paginated (.results) and plain array responses
        const leaderboard = Array.isArray(leaderboardData) ? leaderboardData : leaderboardData.results || [];
        const allTeams = Array.isArray(teamsData) ? teamsData : teamsData.results || [];
        console.log('Leaderboard - Processed entries count:', leaderboard.length);
        console.log('Leaderboard - Processed teams count:', allTeams.length);
        setLeaderboard(leaderboard);
        setTeams(allTeams);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTeamName = (teamId) => {
    const team = teams.find(t => t._id === teamId);
    return team ? team.name : `Team ${teamId}`;
  };

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
                  <td><span className="badge bg-info">{getTeamName(entry.team_id)}</span></td>
                  <td>{entry.total_activities}</td>
                  <td>{entry.total_duration} min</td>
                  <td>{entry.total_distance?.toFixed(2)} km</td>
                  <td><span className="badge bg-success">{entry.total_calories || 0} cal</span></td>
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
