
"use client"

import React, { useEffect } from 'react';
import WorkBench from '../components/WorkBench'

const Seiten = () => {
  console.log('Seiten-Page component is being rendered');

  useEffect(() => {
    console.log('Seiten-Page useEffect - component mounted');
    return () => {
      console.log('Seiten-Page useEffect - component unmounted');
    };
  }, []);
  return (
    <div className='bg-gray-100'>
      <WorkBench />
    </div>
  )
}

export default Seiten