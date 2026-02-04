import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        // REST API endpoint format: https://$REACT_APP_CODESPACE_NAME-8000.app.github.dev/api/workouts/
        const codespace = process.env.REACT_APP_CODESPACE_NAME || 'localhost:8000';
        const baseUrl = codespace.includes('localhost') 
          ? `http://${codespace}` 
          : `https://${codespace}-8000.app.github.dev`;
        
        const apiEndpoint = `${baseUrl}/api/workouts/`;
        console.log('Workouts - Fetching from API endpoint:', apiEndpoint);
        console.log('Workouts - REACT_APP_CODESPACE_NAME:', process.env.REACT_APP_CODESPACE_NAME);
        
        const response = await fetch(apiEndpoint);
        
        if (!response.ok) {
          throw new Error('Failed to fetch workouts');
        }
        
        const data = await response.json();
        console.log('Workouts - Raw fetched data:', data);
        console.log('Workouts - Data type:', Array.isArray(data) ? 'array' : 'object');
        
        // Handle both paginated (.results) and plain array responses
        const workoutsData = Array.isArray(data) ? data : data.results || [];
        console.log('Workouts - Processed workouts count:', workoutsData.length);
        setWorkouts(workoutsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWorkouts();
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
          <h1 className="page-title">💪 Workouts</h1>
          <span className="stats-badge">Total: {workouts.length} workouts</span>
        </div>
        
        <div className="row">
          {workouts.map((workout) => (
            <div key={workout._id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{workout.name}</h5>
                  <p className="card-text">{workout.description}</p>
                  <div className="mb-3">
                    <span className="badge bg-primary me-2">{workout.type}</span>
                    <span className="badge bg-warning text-dark me-2">{workout.difficulty}</span>
                    <span className="badge bg-info">{workout.duration} min</span>
                  </div>
                  {workout.exercises && (
                    <div className="mt-3">
                      <strong className="text-muted">Exercises:</strong>
                      <p className="text-muted small mt-1">{workout.exercises}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {workouts.length === 0 && (
          <div className="alert alert-info" role="alert">
            No workouts available.
          </div>
        )}
      </div>
    </div>
  );
}

export default Workouts;
