import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // REST API endpoint format: https://$REACT_APP_CODESPACE_NAME-8000.app.github.dev/api/activities/
        const codespace = process.env.REACT_APP_CODESPACE_NAME || 'localhost:8000';
        const baseUrl = codespace.includes('localhost') 
          ? `http://${codespace}` 
          : `https://${codespace}-8000.app.github.dev`;
        
        const apiEndpoint = `${baseUrl}/api/activities/`;
        console.log('Activities - Fetching from API endpoint:', apiEndpoint);
        console.log('Activities - REACT_APP_CODESPACE_NAME:', process.env.REACT_APP_CODESPACE_NAME);
        
        const response = await fetch(apiEndpoint);
        
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        
        const data = await response.json();
        console.log('Activities - Raw fetched data:', data);
        console.log('Activities - Data type:', Array.isArray(data) ? 'array' : 'object');
        
        // Handle both paginated (.results) and plain array responses
        const activitiesData = Array.isArray(data) ? data : data.results || [];
        console.log('Activities - Processed activities count:', activitiesData.length);
        setActivities(activitiesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) return <div className="container mt-4"><p>Loading activities...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-4">
      <h2>Activities</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Type</th>
              <th>Duration (min)</th>
              <th>Distance (km)</th>
              <th>Calories</th>
              <th>Date</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity._id}>
                <td>{activity._id}</td>
                <td>{activity.user_id}</td>
                <td><span className="badge bg-primary">{activity.type}</span></td>
                <td>{activity.duration}</td>
                <td>{activity.distance}</td>
                <td>{activity.calories}</td>
                <td>{new Date(activity.date).toLocaleDateString()}</td>
                <td>{activity.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-muted">Total activities: {activities.length}</p>
    </div>
  );
}

export default Activities;
