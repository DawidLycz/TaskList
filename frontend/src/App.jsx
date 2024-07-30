import { BrowserRouter as Router, Route} from 'react-router-dom';

import React, { useState, useEffect } from 'react';
import axios from './axios.js';

const Task = ({task}) => {
  return (
    <div className='task-box'>
        <span className='task-name'>{task.title}</span>
        <button className='task-box-button'>📜</button>
        <button className='task-box-button'>❎</button>
        <button className='task-box-button'>🗑️</button>
        <div className='task-box-footer'><span>^</span></div>
    </div>
  );
};

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className='task-list'>
      <h1>Tasks: </h1>
        {tasks.map(task => (
          <Task key={task.id} task={task} />
        ))}
    </div>
  );
};

function App() {
  return (
   <TaskList></TaskList>
  );
}

export default App;

