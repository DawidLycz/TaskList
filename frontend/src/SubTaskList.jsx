import React, { useState, useEffect } from 'react';
import axios from './axios.js';
import SubTask from './SubTask.jsx';

function SubTaskList({ deleteSubTask, parentTask, taskList, setList }) {
  const [tasks, setTasks] = useState(taskList);
  const [draggedTaskIndex, setDraggedTaskIndex] = useState(null);

  const listClass = 'task-list-dependent';
  const totalTasksNumber = tasks.length;
  const accomplishedTasksNumber = tasks.filter(task => task.complete).length;
  const allTaskDone = accomplishedTasksNumber === totalTasksNumber;
  const counterText = totalTasksNumber === accomplishedTasksNumber ? 
    'All subtasks accomplished' :
    `Subtask accomplished: ${accomplishedTasksNumber}/${totalTasksNumber}`;
  const headerClass = allTaskDone ? 'task-list-header task-list-header-done' : 'task-list-header task-list-header-undone';

  useEffect(() => {
    setTasks(taskList);
  }, [taskList]);

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
    setList(updatedTasks);  
    setDraggedTaskIndex(null);
  };

  return (
    <div className={listClass}>
      <h1 className={headerClass}>Sub tasks
        <p>{counterText}</p>
      </h1>
      {tasks.map((task, index) => (
        <SubTask
          key={task.id}
          task={task}
          index={index}
          setTasks={setTasks}
          tasks={tasks}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          parentTask={parentTask}
          deleteSubTask={deleteSubTask}
        />
      ))}
    </div>
  );
}

export default SubTaskList;
