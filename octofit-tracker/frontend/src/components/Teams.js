import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        // REST API endpoint format: https://$REACT_APP_CODESPACE_NAME-8000.app.github.dev/api/teams/
        const codespace = process.env.REACT_APP_CODESPACE_NAME || 'localhost:8000';
        const baseUrl = codespace.includes('localhost') 
          ? `http://${codespace}` 
          : `https://${codespace}-8000.app.github.dev`;
        
        const apiEndpoint = `${baseUrl}/api/teams/`;
        console.log('Teams - Fetching from API endpoint:', apiEndpoint);
        console.log('Teams - REACT_APP_CODESPACE_NAME:', process.env.REACT_APP_CODESPACE_NAME);
        
        const response = await fetch(apiEndpoint);
        
        if (!response.ok) {
          throw new Error('Failed to fetch teams');
        }
        
        const data = await response.json();
        console.log('Teams - Raw fetched data:', data);
        console.log('Teams - Data type:', Array.isArray(data) ? 'array' : 'object');
        
        // Handle both paginated (.results) and plain array responses
        const teamsData = Array.isArray(data) ? data : data.results || [];
        console.log('Teams - Processed teams count:', teamsData.length);
        setTeams(teamsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) return <div className="container mt-4"><p>Loading teams...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-4">
      <h2>Teams</h2>
      <div className="row">
        {teams.map((team) => (
          <div key={team._id} className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{team.name}</h5>
                <p className="card-text">{team.description}</p>
                <p className="text-muted small">
                  Created: {new Date(team.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {teams.length === 0 && <p className="text-muted">No teams available.</p>}
    </div>
  );
}

export default Teams;
