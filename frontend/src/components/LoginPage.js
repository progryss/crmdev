import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ handleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setUsernameError('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let isValid = true;

    if (username.trim() === '') {
      setUsernameError('Please enter username');
      isValid = false;
    } else {
      setUsernameError('');
    }

    if (password.trim() === '') {
      setPasswordError('Please enter password');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!isValid) {
      return;
    }

    const validUsername = 'admin@progryss.com';
    const validPassword = 'Jgw@13579';

    if (username !== validUsername) {
      setUsernameError('Invalid username');
    } else if (password !== validPassword) {
      setPasswordError('Invalid password');
    } else {
      setUsername('');
      setPassword('');
      handleLogin(); 
      navigate('/'); 
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="card shadow login-box-width">
        <div className="card-body">
          <div className="card-title text-center mb-4"><img src="progryss-logo.svg" alt="" width="125"></img></div>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="username" className='label-value'>Username</label>
              <input
                type="text"
                className={`form-control mt-2 ${usernameError ? 'is-invalid' : ''}`}
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={handleUsernameChange}
              />
              {usernameError && <div className="invalid-feedback">{usernameError}</div>}
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password" className='label-value'>Password</label>
              <input
                type="password"
                className={`form-control mt-2 ${passwordError ? 'is-invalid' : ''}`}
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={handlePasswordChange}
              />
              {passwordError && <div className="invalid-feedback">{passwordError}</div>}
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
