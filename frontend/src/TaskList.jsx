import React, { useState, useEffect } from 'react';
import axios from './axios.js';
import Task from './Task.jsx';

function TaskList({ tasks, setTasks, mainList, title }) {
  const [draggedTaskIndex, setDraggedTaskIndex] = useState(null);
  
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

  const filteredTasks = mainList ? tasks.filter(task => task.main) : tasks;
  const listClass = mainList ? 'task-list-main' : 'task-list-dependend';
  const totalTasksNumber = filteredTasks.length;
  const accomplishedTasksNumber = filteredTasks.filter(task => task.complete).length;
  const allTaskDone = accomplishedTasksNumber === totalTasksNumber;
  const counterText = totalTasksNumber === accomplishedTasksNumber ? 
  'Wszystkie zadania zostały wykonane' :
  `Zadania Wykonane:  ${accomplishedTasksNumber}/${totalTasksNumber}`;
  const headerClass = allTaskDone ? 'task-list-header task-list-header-done' : 'task-list-header task-list-header-undone';


  return (
    <div className={listClass}>
      <h1 className={headerClass}>{title}
        <p></p>
        {counterText}</h1>
      {filteredTasks.map((task, index) => (
        <Task
          key={task.id}
          task={task}
          index={index}
          setTasks={setTasks}
          tasks={tasks}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
        />
      ))}
    </div>
  );
}


export default TaskList;
