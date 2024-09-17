import React, { useState, useEffect } from 'react';
import axios from './axios.js';
import Task from './Task.jsx';
import {jwtDecode} from 'jwt-decode';
import { useLocation } from 'react-router-dom';


function TaskList({user, isLoggedIn, mainList, taskList, setTaskList}) {

  const [tasks, setTasks] = useState(taskList.tasks);
  const [draggedTaskIndex, setDraggedTaskIndex] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(taskList.title);
  const [newDescription, setNewDescription] = useState(taskList.description);

  const listClass = mainList ? 'task-list-main' : 'task-list-dependend';
  const totalTasksNumber = tasks.length;
  const accomplishedTasksNumber = tasks.filter(task => task.complete).length;
  const allTaskDone = accomplishedTasksNumber === totalTasksNumber;
  const counterText = totalTasksNumber === accomplishedTasksNumber ? 
  'All tasks accomplished' :
  `Tasks accomplished:  ${accomplishedTasksNumber}/${totalTasksNumber}`;
  const headerClass = allTaskDone ? 'task-list-header task-list-header-done' : 'task-list-header task-list-header-undone';

  const onDragStart = (e, index) => {
    setDraggedTaskIndex(index);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, index) => {
    e.preventDefault();
    const updatedTasks = [...tasks];
    const [draggedTask] = updatedTasks.splice(draggedTaskIndex, 1);
    updatedTasks.splice(index, 0, draggedTask);
    setTasks(updatedTasks);
    setDraggedTaskIndex(null);
  };

  const addTask = async () => {
    const token = localStorage.getItem('access_token');
    const user_id = jwtDecode(token).user_id;
    
    const newTask = {
      task_list: taskList.id,
      title: 'NEW TASK',
      description: 'TASK THAT NEEDS TO BE ACCOMPLISHED',
      complete: false};
    
    try {
      const response = await axios.post('tasks/', newTask);
      setTasks([...tasks, response.data]);
      console.log("response", response.data);
      console.log("success")
    } catch (error) {
      console.error('Error adding task:', error);
    }};

    const handleEditTaskList = async (taskList) => {
      const newTaskList = {...taskList, title: newTitle, description: newDescription}
      try {
        const response = await axios.patch(`tasklists/${taskList.id}/`, newTaskList);
        setTaskList(response.data);
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
          <button onClick={() => handleEditTaskList(taskList)}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      </div>
    )
    }
  

  return (
    <div className='task-list-main'>
      <h1 className={headerClass}>{taskList.title}
        <p><span>{taskList.description}</span></p>
        {counterText}
        <button onClick={() => setEditMode(true)}>📝</button>
        </h1>
      {tasks.map((task, index) => (
        <Task
          key={task.id}
          task={task}
          index={index}
          setTasks={setTasks}
          tasks={tasks}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          isMain={true}
        />
      ))}
      <button className='add-task-button' onClick={addTask}>➕</button>
      {editMode && renderEditModeConentent()}
    </div>
  );
}


export default TaskList;
