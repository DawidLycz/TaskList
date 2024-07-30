import React, { useState, useEffect } from 'react';
import axios from './axios.js';

const Task = ({task}) => {

  return (
    <div className='task-box'>
      <h1>{task.title}</h1>
    </div>
  );
};

export default Task;
