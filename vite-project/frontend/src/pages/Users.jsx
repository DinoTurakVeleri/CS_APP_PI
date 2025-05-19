import React, { useState, useEffect } from 'react';
import './users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', username: '', password_hash: '', role: '' });
  const [editUser, setEditUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('http://localhost:5001/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => setMessage('Failed to fetch users.'));
  };

  const addUser = () => {
    const { name, username, password_hash, role } = newUser;

    if (!name || !username || !password_hash || !role) {
      setMessage('Please fill in all fields.');
      return;
    }

    fetch('http://localhost:5001/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
      .then(res => res.json())
      .then(() => {
        fetchUsers();
        setNewUser({ name: '', username: '', password_hash: '', role: '' });
        setMessage('User successfully added!');
      })
      .catch(() => setMessage('Failed to add user.'));
  };

  const deleteUser = (id) => {
    fetch(`http://localhost:5001/api/users/${id}`, { method: 'DELETE' })
      .then(() => {
        fetchUsers();
        setMessage('User successfully deleted!');
      })
      .catch(() => setMessage('Failed to delete user.'));
  };

  const updateUser = () => {
    const { password_hash, ...updatePayload } = editUser;

    if (!updatePayload.name || !updatePayload.username || !updatePayload.role) {
      setMessage('Please fill in all fields.');
      return;
    }

    fetch(`http://localhost:5001/api/users/${editUser.user_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload),
    })
      .then(() => {
        fetchUsers();
        setEditUser(null);
        setMessage('User successfully updated!');
      })
      .catch(() => setMessage('Failed to update user.'));
  };

  return (
    <div className="users-container">
      <h1>Users</h1>

      {/* Poruka */}
      {message && <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>{message}</div>}

      <div className="form-container">
        <h2>Add New User</h2>
        <input placeholder="Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
        <input placeholder="Username" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} />
        <input placeholder="Password" value={newUser.password_hash} onChange={e => setNewUser({ ...newUser, password_hash: e.target.value })} />
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
            value={editUser.password_hash || ''}
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
          {users.map((user) => (
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
