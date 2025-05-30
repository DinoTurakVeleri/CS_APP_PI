import React, { useState, useEffect } from 'react';
import './users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', username: '', password: '', role: '' });
  const [editUser, setEditUser] = useState(null);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');
  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('/api/users', { headers: authHeaders })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => setUsers(data))
      .catch(() => {
        setMessage('Failed to fetch users.');
        setUsers([]);
      });
  };

  const addUser = () => {
    const { name, username, password, role } = newUser;

    if (!name || !username || !password || !role) {
      setMessage('Please fill in all fields.');
      return;
    }

    fetch('/api/users', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ name, username, password, role }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add user');
        return res.json();
      })
      .then(() => {
        fetchUsers();
        setNewUser({ name: '', username: '', password: '', role: '' });
        setMessage('User successfully added!');
      })
      .catch(() => setMessage('Failed to add user.'));
  };

  const deleteUser = (id) => {
    fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: authHeaders,
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete user');
        fetchUsers();
        setMessage('User successfully deleted!');
      })
      .catch(() => setMessage('Failed to delete user.'));
  };

  const updateUser = () => {
    const { password, ...updatePayload } = editUser;

    if (!updatePayload.name || !updatePayload.username || !updatePayload.role) {
      setMessage('Please fill in all fields.');
      return;
    }

    fetch(`/api/users/${editUser.user_id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify(updatePayload),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update user');
        fetchUsers();
        setEditUser(null);
        setMessage('User successfully updated!');
      })
      .catch(() => setMessage('Failed to update user.'));
  };

  return (
    <div className="users-container">
      <h1>Users</h1>

      {message && <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>{message}</div>}

      <div className="form-container">
        <h2>Add New User</h2>
        <input placeholder="Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
        <input placeholder="Username" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} />
        <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
        <select
          className="narrow-select"
          value={newUser.role}
          onChange={e => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="" disabled>Select role</option>
          <option value="ADMIN">ADMIN</option>
          <option value="USER">USER</option>
        </select>
        <button onClick={addUser}>Add User</button>
      </div>

      {editUser && (
        <div className="form-container">
          <h2>Edit User</h2>
          <input value={editUser.name || ''} onChange={e => setEditUser({ ...editUser, name: e.target.value })} />
          <input value={editUser.username || ''} onChange={e => setEditUser({ ...editUser, username: e.target.value })} />
          <input
            type="password"
            value="********"
            readOnly
            style={{ backgroundColor: '#eee', cursor: 'not-allowed' }}
          />
          <select
            className="narrow-select"
            value={editUser.role || ''}
            onChange={e => setEditUser({ ...editUser, role: e.target.value })}
          >
            <option value="" disabled>Select role</option>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>
          <button onClick={updateUser}>Update</button>
          <button onClick={() => setEditUser(null)}>Cancel</button>
        </div>
      )}

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.map((user) => (
            <tr key={user.user_id}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => setEditUser(user)}>Edit</button>
                <button onClick={() => deleteUser(user.user_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
