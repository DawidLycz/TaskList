import React, { useState, useEffect } from 'react';
import axios from './axios.js';
import Task from './Task.jsx';
import TaskList from './TaskList.jsx';



function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async () => {
    const newTask = { title: 'NOWE ZADANIE', description: 'MASZ BOJOWE ZADANIE!', complete: false };
    try {
      const response = await axios.post('', newTask);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <>
      <TaskList tasks={tasks} setTasks={setTasks} mainList={true} title='Dzienna lista zadań'/>
      <button className='add-task-button' onClick={addTask}>➕</button>
    </>
  );
}

export default App;
