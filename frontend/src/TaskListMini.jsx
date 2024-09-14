import React, { useState } from 'react';
import axios from './axios.js';

function TaskListMini({ taskList, onClick, taskLists, setTaskLists, turnOnEditMode }) {
  const hasTasks = taskList.tasks.length > 0;
  const doneTasks = taskList.tasks.filter(t => t.complete).length;
  const [hover, setHover] = useState(false);

  function handleMouseOn() {
    setHover(true);
  }

  function handleMouseOff() {
    setHover(false);
  }

  const  handleRemoveButton = async (event) => {
    event.stopPropagation();
    try {
      await axios.delete(`tasklists/${taskList.id}/`);
      setTaskLists(taskLists.filter(t => t.id !== taskList.id));

    } catch (error) {
      console.error('Error deleting task list:', error);
    }
  }

  const handleEditButton = (event) => {
    event.stopPropagation();
    turnOnEditMode({taskList: taskList});
  }


  function renderContent() {
    if (!hasTasks) {
      return <p className='task-list-mini-info'>This list has no tasks</p>
    }
    else {
      if (hover) {
        return (
            <div className='task-list-mini-tasks'>
              {taskList.tasks.map((task) => (
                <p key={task.id} style={{ textAlign: 'left' }}>{task.complete?'✔️':'❌'}   {task.title}</p>
                ))}
            </div>
          )}
      else {
        return <p className='task-list-mini-info'>Accomplished tasks: {doneTasks}/{taskList.tasks.length}</p>
        }
      }
    }
  

  return (
    <div
      onMouseEnter={handleMouseOn}
      onMouseLeave={handleMouseOff}
      onClick={onClick}  
      className='task-list-mini'
      style={{ cursor: 'pointer' }}  
    >
      <div className='task-list-mini-bar'>
        <button onClick = {(event) => handleEditButton(event)} className='task-list-mini-bar-button-left'>
          <span className='task-list-mini-button-icon'>📝</span>
        </button>
        <button onClick = {(event) => handleRemoveButton(event)} className='task-list-mini-bar-button-right'>
          <span className='task-list-mini-button-icon'>🗑️</span>
        </button> 

      </div>
      {hover ? <h1>{taskList.description}</h1> : <h1>{taskList.title}</h1>}
      {renderContent()}
    </div>
  );
}

export default TaskListMini;
