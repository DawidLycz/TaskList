import React, { useState, useEffect } from 'react';
import axios from './axios.js';
import TaskListMini from './TaskListMini.jsx';
import { useNavigate } from 'react-router-dom';

function Homepage({ user, isLoggedIn, setSelectedTaskList }) {
  const [taskLists, setTaskLists] = useState([]);
  const [showDescription, setShowDescription] = useState(false);
  const nonEmpty = taskLists.length > 0;
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [editingTaskList, setEditingTaskList] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');


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
      title: 'NEW TASK LIST', 
      description: 'YOU HAVE SOME TASK TO DO', 
      author: user.user_id,
    };
    try {
      const response = await axios.post('', newTaskList);
      setTaskLists([...taskLists, response.data]);
    } catch (error) {
      console.error('Error adding task list:', error);
    }
  };

  const handleEditTaskList = async (taskList) => {
    const newTaskList = {...taskList, title: newTitle, description: newDescription}
    try {
      const response = await axios.patch(`tasklists/${taskList.id}/`, newTaskList);
      setTaskLists(taskLists.map((list) => (list.id === taskList.id ? response.data : list)));
    } catch (error) {
      console.error('Error editing task list:', error);
    }
    setEditMode(false);
  };

  const renderEditModeConentent = () => {

    return (
    <div className='edit-mode-content'>
      <div className='edit-mode-box'>
        <h1>Editing</h1>
        <input value={newTitle} onChange={(event) => setNewTitle(event.target.value)}></input>
        <textarea value={newDescription} onChange={(event) => setNewDescription(event.target.value)}></textarea>
        <button onClick={() => handleEditTaskList(editingTaskList)}>Save</button>
        <button onClick={() => setEditMode(false)}>Cancel</button>
      </div>
    </div>
  )
  }

  const renderDescriptionContent = () => {
    return (
      <div className='home-page-description-box'>
      <p className='home-page-description-text'>What is Task Hub?</p>
      <p className='home-page-description-text'>
        Task Hub is a powerful and intuitive task manager designed to help you stay organized and productive. 
        Whether you're managing personal todos or collaborating on a team project, Task Hub provides an easy-to-use interface for creating, organizing, and tracking tasks. 
        With customizable task lists, real-time updates, and a focus on simplicity, you can stay on top of your workload and achieve your goals effortlessly. 
        Organize your life, prioritize your tasks, and get more done with Task Hub.
      </p>
     <button onClick={() => setShowDescription(false)}>🗙</button>
    </div>
    )
  }

  const renderDescriptionButton = () => {
    return (
      <button className='home-page-description-button' onClick={() => setShowDescription(true)}>?</button>
    )
  }

  function turnOnEditMode({taskList}) {
    setEditMode(true);
    setEditingTaskList(taskList);
    setNewTitle(taskList.title);
    setNewDescription(taskList.description);
  }

  function handleTaskListClick(listId) {
    navigate('/tasklist/' + listId);
  }

  function demoButton() {
    const logInIntoDemo = async () => {
      console.log("działa")
      try {
        const response = await axios.post('api/token/', {
          username: 'demo_user',
          password: 'demouser123',
        });
        const {access, refresh} = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    }
    return (<button className='demo-button' onClick={logInIntoDemo}>DEMO</button>)
  }
  
  if (isLoggedIn) {
    return (
    <>
      <h1 className='home-page-title'>Task Hub</h1>
      {showDescription ? renderDescriptionContent() : renderDescriptionButton()}
      {nonEmpty ? (
      <div className='list-container'>
        {taskLists.map((taskList, index) => (
          <TaskListMini 
            onClick={() => handleTaskListClick(taskList.id)} 
            key={index} 
            taskList={taskList}
            taskLists={taskLists}
            setTaskLists={setTaskLists}
            turnOnEditMode={turnOnEditMode}
          />
        ))}
      </div>
      ) : <h1 className='home-page-title' style={{textAlign: 'center', fontSize: '300%'}}>There is no task list yet. Click button to add one.</h1>} 
      <button onClick={addTaskList} className='add-task-list-button'>Add new task list</button>
      {editMode ? renderEditModeConentent() : null}
    </>
  );
  }

    return (
    <>
      <h1 className='home-page-title'>Task Hub</h1>
      {showDescription ? renderDescriptionContent() : renderDescriptionButton()}
      <button onClick={() => {navigate('/login');}} className='add-task-list-button'>Please log in to continue</button>
      {demoButton()}
    </>
    );
}

export default Homepage;
