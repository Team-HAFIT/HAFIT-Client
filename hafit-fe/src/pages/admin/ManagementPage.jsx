import React, { useEffect, useState } from 'react';

const ManagementPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Set dummy users data
    setDummyUsers();
  }, []);

  const setDummyUsers = () => {
    const dummyData = [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User' },
      { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'User' },
      // Add more dummy user objects as needed
    ];
    setUsers(dummyData);
  };

  return (
    <div>
      <h1>User Management</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagementPage;
