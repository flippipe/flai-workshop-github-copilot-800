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

  if (loading) return <div className="container mt-4"><p>Loading workouts...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-4">
      <h2>Workouts</h2>
      <div className="row">
        {workouts.map((workout) => (
          <div key={workout._id} className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{workout.name}</h5>
                <p className="card-text">{workout.description}</p>
                <div className="mb-2">
                  <span className="badge bg-primary me-2">{workout.type}</span>
                  <span className="badge bg-secondary me-2">{workout.difficulty}</span>
                  <span className="badge bg-info">{workout.duration} min</span>
                </div>
                {workout.exercises && (
                  <div className="mt-2">
                    <strong>Exercises:</strong>
                    <p className="text-muted small">{workout.exercises}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {workouts.length === 0 && <p className="text-muted">No workouts available.</p>}
    </div>
  );
}

export default Workouts;
