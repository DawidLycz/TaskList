import React, { useState } from 'react';
import axios from './axios.js';
import { Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [serverResponse, setServerResponse] = useState('');
  const [loading, setLoading] = useState(false);

  

  async function handleSubmit() {
    setLoading(true);
    try {
      const response = await axios.post('api/token/', { username, password });
      const {access, refresh} = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setServerResponse('Login successful!');
      window.location.href = '/';
    } catch (error) {
      console.log(response)
      if (error.response) {
        setServerResponse(error.response.data.error || 'An error occurred during login.');
      } else {
        setServerResponse('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
      
    }
  }

  return (
    <div className='register-box'>
      <h1>Login</h1>
      <h2>Username:</h2>
      <input 
        value={username}
        onChange={(e) => {
          setServerResponse(''); 
          setUsername(e.target.value);
        }}>
      </input>
      <h2>Password:</h2>
      <input 
        type="password"
        value={password}
        onChange={(e) => {
          setServerResponse(''); 
          setPassword(e.target.value);
        }}>
      </input>
      <p>{serverResponse}</p>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Loging in...' : 'Log in'}
      </button>
      <Link to="/register"><span>Don't have account?</span></Link>
    </div>
  );
}

export default Login;