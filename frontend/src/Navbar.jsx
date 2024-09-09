import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {jwtDecode} from "jwt-decode";

function Navbar({user, isLoggedIn}) {
  
  function logout() {
    localStorage.clear();
    window.location.reload();}

  
  return (
    <div className='navbar'>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/register">Register</Link>
      {isLoggedIn ? <Link onClick={logout} to="/">Logout</Link> : <Link to="/login">Login</Link>}
      {isLoggedIn ?
       <span style={{float: "right"}}>Logged in as: {user.username}</span> : 
       <span style={{float: "right"}}>Not logged in</span>}
    </div>
  );
}

export default Navbar;