"use client"

import AuthLayout from "@/components/AuthLayout";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import QuillEditor with no SSR
const QuillEditorNoSSR = dynamic(() => import('@/components/insertText/QuillEditor'), { ssr: false });

const Print = () => {
  const [editorContent, setEditorContent] = useState('<p>Welcome to the Quill editor!</p>');
  const [isEditing, setIsEditing] = useState(true);

  const toggleEditMode = () => setIsEditing(!isEditing);

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={toggleEditMode}>
        {isEditing ? 'Switch to Display Mode' : 'Switch to Edit Mode'}
      </button>
      <QuillEditorNoSSR 
        value={editorContent} 
        onChange={setEditorContent} 
        isEditMode={isEditing} 
        placeholder="Type your content here..."
      />
    </div>
  );
}

export default Print;
