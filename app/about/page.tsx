
"use client"

import React, { useEffect } from 'react';

const About = () => {
  console.log('About Page component is being rendered');

  useEffect(() => {
    console.log('About Page useEffect - component mounted');
    return () => {
      console.log('About Page useEffect - component unmounted');
    };
  }, []);

  return (
    <div className='bg-gray-100 h-screen w-screen'>
      <p>About Page</p>
      <p className='text-center'>About Page</p>
    </div>
  );
};

export default About;
