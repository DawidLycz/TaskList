import React, { useState, useEffect } from 'react';
import axios from './axios.js';
import TaskList from './TaskList.jsx';
import TaskListSite from './TaskListSite.jsx';
import Homepage from './Homepage.jsx';
import About from './About.jsx';
import Navbar from './Navbar.jsx';
import Register from './Register.jsx';
import Login from './Login.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';


function App() {

  const token = localStorage.getItem('access_token');
  let user = {username: "Anonymous"};
  let isLoggedIn = false;
  if (token) {
    try{
    user = jwtDecode(token);
    isLoggedIn = true;
    } catch (error) {
      console.error("Error decoding token:", error);  
    }
  }
  return (
    <Router>
      <Navbar user={user} isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<Homepage user={user} isLoggedIn={isLoggedIn} />} />
        <Route path="/tasklist/:id" element={<TaskListSite user={user} isLoggedIn={isLoggedIn} mainList={true}/>} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
