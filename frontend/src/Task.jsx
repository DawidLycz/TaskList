import React, { useState, useEffect } from 'react';
import axios from './axios.js';
import TaskList from './TaskList.jsx';

function Task({ task, index, onDragStart, onDragOver, onDrop, setTasks, tasks }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(task);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const doneMark = currentTask.complete ? '✅' : '❎';
  const [dependendTasks, setDependendTasks] = useState(tasks.filter(t => t.depends.includes(task.id)));
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
    else {
      setExpanded(true);
    }
    setEditing(prevEditing => !prevEditing);
  };
  const addSubtask = async () => {
    const newSubtask = { title: 'NOWE ZADANIE', description: 'MASZ BOJOWE ZADANIE!', complete: false, main: false, depends: [currentTask.id] };
    try {
      const response = await axios.post('', newSubtask);
      setTasks([...tasks, response.data]);
      setDependendTasks([...dependendTasks, response.data]);

    } catch (error) {
      console.error('Error adding subtask:', error);
    }
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
  
  const taskBoxClassMain = currentTask.main ? 'task-box-main' : 'task-box-sub';
  const taskBoxClassDone = currentTask.complete ? 'task-box-completed' : 'task-box-incompleted';
  const taskBoxClass = taskBoxClassMain + ' ' + taskBoxClassDone;
  const footerText = expanded
    ? '▲ WRAP ▲'
    : '▼ EXPAND ▼';

  if (editing) {
    return (
      <div
        className={taskBoxClassMain + ' ' + 'task-box-edited'}
      >
        <div className='task-box-main-row'>
          <input 
            value={editedTitle} 
            onChange={e => setEditedTitle(e.target.value)} 
            className='task-name-edit'
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
        {dependendTasks.length > 0 && expanded ? <TaskList tasks={dependendTasks} setTasks={setDependendTasks} title='Zadania zależne' />: null}
        {currentTask.main && expanded && <button onClick={addSubtask} className='add-side-task-button'>+ ADD SUBTASK +</button>}
        <button onClick={toggleExpanded} className='add-side-task-button'>{footerText}</button>
        
      </div>



      </>
    );
  }
}

export default Task;