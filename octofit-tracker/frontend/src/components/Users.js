import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // REST API endpoint format: https://$REACT_APP_CODESPACE_NAME-8000.app.github.dev/api/users/
        const codespace = process.env.REACT_APP_CODESPACE_NAME || 'localhost:8000';
        const baseUrl = codespace.includes('localhost') 
          ? `http://${codespace}` 
          : `https://${codespace}-8000.app.github.dev`;
        
        const apiEndpoint = `${baseUrl}/api/users/`;
        console.log('Users - Fetching from API endpoint:', apiEndpoint);
        console.log('Users - REACT_APP_CODESPACE_NAME:', process.env.REACT_APP_CODESPACE_NAME);
        
        const response = await fetch(apiEndpoint);
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        console.log('Users - Raw fetched data:', data);
        console.log('Users - Data type:', Array.isArray(data) ? 'array' : 'object');
        
        // Handle both paginated (.results) and plain array responses
        const usersData = Array.isArray(data) ? data : data.results || [];
        console.log('Users - Processed users count:', usersData.length);
        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="container mt-4"><p>Loading users...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-4">
      <h2>Users</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Team ID</th>
              <th>Role</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td><strong>{user.name}</strong></td>
                <td>{user.email}</td>
                <td><span className="badge bg-info">{user.team_id}</span></td>
                <td><span className="badge bg-success">{user.role}</span></td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-muted">Total users: {users.length}</p>
    </div>
  );
}

export default Users;
