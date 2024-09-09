import React, { useState, useEffect } from 'react';
import axios from './axios.js';
import TaskList from './TaskList.jsx';

function SubTask({deleteSubTask, parentTask, task, index, onDragStart, onDragOver, onDrop, setTasks, tasks, setList }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(task);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const doneMark = currentTask.complete ? '✅' : '❎';

  const toggleExpanded = (e) => {
    e.stopPropagation(); 
    setExpanded(prevExpanded => !prevExpanded);
  };

  const toggleDone = () => {
    const updatedTask = { ...currentTask, complete: !currentTask.complete };
    setCurrentTask(updatedTask);
    saveTask(updatedTask);
  };

  const deleteTask = async () => {
    deleteSubTask(task.id);
  };

  const toggleEditing = () => {
    if (editing) {
      const updatedTask = { ...currentTask, title: editedTitle, description: editedDescription };
      saveTask(updatedTask);
      setCurrentTask(updatedTask);
    }
    else {
      setExpanded(true);
    }
    setEditing(prevEditing => !prevEditing);
  };

  const saveTask = async (updatedTask) => {
    try {
      await axios.put(`subtasks/${updatedTask.id}/`, updatedTask);
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
  
  const taskBoxClassDone = currentTask.complete ? 'task-box-completed' : 'task-box-incompleted';
  console.log(taskBoxClassDone);
  const taskBoxClass = 'task-box-sub ' + taskBoxClassDone;
  const footerText = expanded ? '▲ WRAP ▲' : '▼ EXPAND ▼';

  if (editing) {
    return (
      <div
        className={'task-box-sub task-box-edited'}
      >
        <div className='task-box-main-row'>
          <input 
            value={editedTitle} 
            onChange={e => setEditedTitle(e.target.value)} 
            className='subtask-name-edit'
          />
          <button onClick={toggleEditing} className='task-box-button'>💾</button>
          <button onClick={cancelEdit} className='task-box-button'>❌</button>
        </div>
        {expanded ? <textarea
          value={editedDescription}
          onChange={e => setEditedDescription(e.target.value)}
          className='task-description-edit'
        ></textarea> : null}
      </div>
    );
  } else {
    return (
      <>
        <div
          className={taskBoxClass}
          draggable={!expanded}  
          onDragStart={(e) => !expanded && onDragStart(e, index)}  
          onDragOver={(e) => !expanded && onDragOver(e)}
          onDrop={(e) => !expanded && onDrop(e, index)} 
        >
          <div className='task-box-main-row'>
            <span className='task-name'>{currentTask.title}</span>
            <button onClick={toggleDone} className='task-box-button'>{doneMark}</button>
            <button onClick={toggleEditing} className='task-box-button'>📝</button>
            <button onClick={deleteTask} className='task-box-button'>🗑️</button>
          </div>
          {expanded ? <div onClick={e => e.stopPropagation()} className='task-description'>{currentTask.description}</div> : null}
          <button onClick={toggleExpanded} className='add-side-task-button'>{footerText}</button>
        </div>
      </>
    );
  }
}

export default SubTask;