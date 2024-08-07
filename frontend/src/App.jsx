import { BrowserRouter as Router, Route} from 'react-router-dom';

import React, { useState, useEffect } from 'react';
import axios from './axios.js';


function Task({ task, setTasks, tasks }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(task);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const doneMark = currentTask.complete ? '✅' : '❎';

  const toggleExpanded = () => {
    setExpanded(prevExpanded => !prevExpanded);
  };

  const toggleDone = () => {
    const updatedTask = { ...currentTask, complete: !currentTask.complete };
    setCurrentTask(updatedTask);
    saveTask(updatedTask);
  };

  const deleteTask = async () => {
    try {
      await axios.delete(`${task.id}/`);
      setTasks(tasks.filter(t => t.id !== task.id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleEditing = () => {
    if (editing) {
      const updatedTask = { ...currentTask, title: editedTitle, description: editedDescription };
      saveTask(updatedTask);
      setCurrentTask(updatedTask);
    }
    setEditing(prevEditing => !prevEditing);
  };

  const saveTask = async (updatedTask) => {
    try {
      await axios.put(`${updatedTask.id}/`, updatedTask);
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
  };

  const footerClass = expanded
    ? 'task-box-footer-expanded'
    : 'task-box-footer-collapsed';

  if (editing) {
    return (
      <div className='task-box'>
        <div className='task-box-main-row'>
          <input 
            value={editedTitle} 
            onChange={e => setEditedTitle(e.target.value)} 
            className='task-name-edit'
          />
          <button onClick={toggleDone} className='task-box-button'>{doneMark}</button>
          <button onClick={toggleEditing} className='task-box-button'>💾</button>
          <button onClick={cancelEdit} className='task-box-button'>❌</button>
        </div>
        {expanded ? <input
          value={editedDescription}
          onChange={e => setEditedDescription(e.target.value)}
          className='task-description'
          /> : null}
        <div onClick={toggleExpanded} className={footerClass}><span>^</span></div>
      </div>
    );
  } else {
    return (
      <div className='task-box'>
        <div className='task-box-main-row'>
          <span className='task-name'>{currentTask.title}</span>
          <button onClick={toggleDone} className='task-box-button'>{doneMark}</button>
          <button onClick={toggleEditing} className='task-box-button'>📝</button>
          <button onClick={deleteTask} className='task-box-button'>🗑️</button>
        </div>
        {expanded ? <div className='task-description'>{currentTask.description}</div> : null}
        <div onClick={toggleExpanded} className={footerClass}><span>^</span></div>
      </div>
    );
  }
}

function TaskList({tasks, setTasks}) {

  return (
    <div className='task-list'>
      <h1>Tasks: </h1>
        {tasks.map(task => (
          <Task key={task.id} task={task} setTasks={setTasks} tasks={tasks} />
        ))}
    </div>
  );
};

function App() {
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

    const addTask = async() =>{
      const newTask = {title: 'NOWE ZADANIE', description: 'MASZ BOJOWE ZADANIE!', complete: false,};
      try{
        const response = await axios.post('', {
          title: newTask.title,
          description: newTask.description,
          complete: false,})
        const currentTasks = [...tasks, response.data];
        setTasks(currentTasks);

      } catch(error) {
        console.error('Error adding task:', error); 
      }
    }
  return (
   <>
   <TaskList tasks={tasks} setTasks={setTasks}></TaskList>
   <button className='add-task-button' onClick={addTask}>➕</button>
   </>
  );
} 

export default App;

