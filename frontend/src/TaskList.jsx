import React, { useState, useEffect } from 'react';
import axios from './axios.js';
import Task from './Task.jsx';
import {jwtDecode} from 'jwt-decode';
import { useLocation } from 'react-router-dom';


function TaskList({user, isLoggedIn, mainList, taskList}) {

  const [tasks, setTasks] = useState(taskList.tasks);
  const [draggedTaskIndex, setDraggedTaskIndex] = useState(null);
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
  

  return (
    <div className={listClass}>
      <h1 className={headerClass}>{taskList.title}
        <p></p>
        {counterText}</h1>
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
    </div>
  );
}


export default TaskList;
