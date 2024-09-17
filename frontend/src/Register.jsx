import React, { useState } from 'react';
import axios from './axios.js';
import { Link } from 'react-router-dom';


function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [serverResponse, setServerResponse] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function verifyPassword() {
    if (username === '') {
      setServerResponse('Please enter a username');
      return false;
    }
    if (username.length < 7) {
      setServerResponse('Please enter a username longer than 7 characters');
      return false;
    }
    if (password === '') {
      setServerResponse('Please enter a password');
      return false;
    }
    if (password.length < 8) {
      setServerResponse('Password must be at least 8 characters long');
      return false;
    }
    if (password.length > 20) {
      setServerResponse('Password must be less than 20 characters long');
      return false;
    }
    if (!/[a-z]/.test(password)) {
      setServerResponse('Password must contain at least one lowercase letter');
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setServerResponse('Password must contain at least one number');
      return false;
    }
    return true;
  }

  async function handleSubmit() {
    if (!verifyPassword()) {
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('api/register/', { username, password });
      setServerResponse('Registration successful!');
      setRegisterSuccess(true);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    } catch (error) {
      if (error.response) {
        setServerResponse(error.response.data.error || 'An error occurred during registration.');
      } else {
        setServerResponse('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }

  function homepage() {
    window.location.href = '/';
  }

  if (registerSuccess) {
    return (
      <div className='register-box'>
        <h1>Registration Successful</h1>
        <button onClick={homepage}>HOMEPAGE</button>
      </div>
    );
  }

  return (
    <div className='register-box'>
      <h1>Register</h1>
        <h2>Username:</h2>
        <input 
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}>
        </input>
        <h2>Password:</h2>
        <input 
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}>
        </input>
        <p>{serverResponse}</p>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        <Link to="/login"><span>Already have account?</span></Link>
    </div>
  );
}

export default Register;