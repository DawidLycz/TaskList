import React, { useState, useEffect } from 'react';


function About() {

  return (
    <>
      <h2 className='about-page-title'>What is Task Hub?</h2>
      <p className='about-page-text'>Task Hub is a powerful and intuitive task manager designed to help you stay organized and productive. 
        Whether you're managing personal todos or collaborating on a team project, Task Hub provides an easy-to-use interface for creating, organizing, and tracking tasks. 
        With customizable task lists, real-time updates, and a focus on simplicity, you can stay on top of your workload and achieve your goals effortlessly. 
        Organize your life, prioritize your tasks, and get more done with Task Hub.</p>
      <h2 className='about-page-title'>What is the purpose of Task Hub?</h2>
      <p className='about-page-text'>Task Hub is project that has been created on training purposes. Main goal was to learn React.</p>
      <h2 className='about-page-title'>Who made it?</h2>
      <p className='about-page-text'>Well, i did ;) here is my github: <a href="https://github.com/DawidLycz/TaskList">https://github.com/DawidLycz/TaskList</a></p>

    </>
  );
}

export default About;