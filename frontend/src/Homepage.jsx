import React, { useState, useEffect } from 'react';
import axios from './axios.js';
import TaskList from './TaskList.jsx';
import { Link, useNavigate } from 'react-router-dom';



function Homepage({user, isLoggedIn, setSelectedTaskList}) {
  const [taskLists, setTaskLists] = useState([]);
  const token = localStorage.getItem('access_token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaskLists = async () => {
      try {
        const response = await axios.get('');
        setTaskLists(response.data);
      } catch (error) {
        console.error('Error fetching task lists:', error);
      }
    };
    fetchTaskLists();
  }, []);

  const addTaskList = async () => {

    const newTaskList = { 
      title: 'NOWA LISTA ZADAŃ', 
      description: 'MASZ BOJOWE ZADANIA!', 
      author: user.user.user_id, };
    try {
      const response = await axios.post('', newTaskList);
      setTaskLists([...taskLists, response.data]);
    } catch (error) {
      console.error('Error adding task list:', error);
    }
  };

  const handleTaskListClick = (taskList) => {
    setSelectedTaskList(taskList);  
    navigate('/tasklist');  
  };

  return (
    <>
      <h1>Powitanie</h1>
      <p>Tutaj będzie lista zadan</p>
      {taskLists.map((taskList, index) => (
        <Link key={index} to={'/tasklist/' + taskList.id}>
          {taskList.title}
        </Link>
      ))}
    </>
  );
}
export default Homepage;