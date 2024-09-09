import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from './axios.js';
import TaskList from './TaskList.jsx';

function TaskListSite({ user, isLoggedIn, mainList }) {
  const { id } = useParams();  
  const [taskList, setTaskList] = useState(null);
  
  useEffect(() => {
    const fetchTaskList = async () => {
      try {
        const response = await axios.get(`/tasklists/${id}/`);
        setTaskList(response.data);
      } catch (error) {
        console.error('Error fetching task list:', error);
      }
    };

    fetchTaskList();
  }, [id]);

  if (!taskList) {
    return <p>Loading task list...</p>;
  }

  return (
    <TaskList
      user={user}
      isLoggedIn={isLoggedIn}
      mainList={mainList}
      taskList={taskList}
    />
  );
}

export default TaskListSite;
