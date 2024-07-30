import React, { useState, useEffect } from 'react';
import axios from './axios.js';
import Task from './Task.jsx';

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
    <div>
      <h1>Tasks: </h1>
      <ul>
        {tasks.map(task => (
          <Task key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
