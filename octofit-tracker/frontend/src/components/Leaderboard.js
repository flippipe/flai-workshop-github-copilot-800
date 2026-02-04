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

  if (loading) return <div className="container mt-4"><p>Loading leaderboard...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-4">
      <h2>Leaderboard</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Rank</th>
              <th>User Name</th>
              <th>Team ID</th>
              <th>Total Activities</th>
              <th>Total Duration (min)</th>
              <th>Total Distance (km)</th>
              <th>Total Calories</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => (
              <tr key={entry._id}>
                <td>
                  <span className={`badge ${entry.rank <= 3 ? 'bg-warning' : 'bg-secondary'}`}>
                    {entry.rank}
                  </span>
                </td>
                <td><strong>{entry.user_name}</strong></td>
                <td>{entry.team_id}</td>
                <td>{entry.total_activities}</td>
                <td>{entry.total_duration}</td>
                <td>{entry.total_distance.toFixed(2)}</td>
                <td>{entry.total_calories}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-muted">Total entries: {leaderboard.length}</p>
    </div>
  );
}

export default Leaderboard;
