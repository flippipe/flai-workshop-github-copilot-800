import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // REST API endpoint format: https://$REACT_APP_CODESPACE_NAME-8000.app.github.dev/api/teams/
        const codespace = process.env.REACT_APP_CODESPACE_NAME || 'localhost:8000';
        const baseUrl = codespace.includes('localhost') 
          ? `http://${codespace}` 
          : `https://${codespace}-8000.app.github.dev`;
        
        const teamsEndpoint = `${baseUrl}/api/teams/`;
        const usersEndpoint = `${baseUrl}/api/users/`;
        
        const [teamsResponse, usersResponse] = await Promise.all([
          fetch(teamsEndpoint),
          fetch(usersEndpoint)
        ]);
        
        if (!teamsResponse.ok || !usersResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const teamsData = await teamsResponse.json();
        const usersData = await usersResponse.json();
        
        // Handle both paginated (.results) and plain array responses
        const teams = Array.isArray(teamsData) ? teamsData : teamsData.results || [];
        const allUsers = Array.isArray(usersData) ? usersData : usersData.results || [];
        setTeams(teams);
        setUsers(allUsers);
        setLoading(false);
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching data:', err);
        }
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getMemberCount = (teamId) => {
    return users.filter(user => user.team_id === teamId).length;
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
          <h1 className="page-title">👥 Teams</h1>
          <span className="stats-badge">Total: {teams.length} teams</span>
        </div>
        
        <div className="row">
          {teams.map((team) => (
            <div key={team._id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{team.name}</h5>
                  <p className="card-text">{team.description}</p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      <span className="badge bg-primary me-2">Team ID: {team._id}</span>
                      <span className="badge bg-success">{getMemberCount(team._id)} members</span>
                    </div>
                    <small className="text-muted">
                      Created: {new Date(team.created_at).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {teams.length === 0 && (
          <div className="alert alert-info" role="alert">
            No teams available.
          </div>
        )}
      </div>
    </div>
  );
}

export default Teams;
