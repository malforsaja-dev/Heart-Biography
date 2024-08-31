// components/UploadImage.tsx
"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';

export default function UploadImage() {
  const [file, setFile] = useState<File | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();
  }, []);

  async function handleUpload() {
    if (!file || !user) {
      console.log('You must be logged in to upload files.');
      return;
    }

    const { error } = await supabase.storage
      .from('seiten-images')
      .upload(`${user.id}/${file.name}`, file, {
        cacheControl: '3600',
        upsert: false,
        metadata: {
          object_owner: user.id,
        },
      });

    if (error) console.error('Error uploading image:', error);
    else console.log('Image uploaded successfully!');
  }

  return (
    <div className='flex flex-col max-w-md'>
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} 
        disabled={!user}
        className="mb-2 p-2 border rounded"
      />
      <button onClick={handleUpload} className="p-2 bg-blue-500 text-white rounded" disabled={!user}>
        Upload Image
      </button>
      {!user && <p className="text-red-500">You need to be logged in to upload images.</p>}
    </div>
  );
}
