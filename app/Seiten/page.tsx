
"use client"

import React, { useEffect } from 'react';

const Seiten = () => {
  console.log('Seiten Page component is being rendered');

  useEffect(() => {
    console.log('Seiten Page useEffect - component mounted');
    return () => {
      console.log('Seiten Page useEffect - component unmounted');
    };
  }, []);
  return <div>Seiten Page</div>;
};

export default Seiten;
