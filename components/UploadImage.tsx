"use client";

import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';

export default function UploadImage() {
  const [file, setFile] = useState<File | null>(null);

  async function handleUpload() {
    if (!file) return;

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.storage
      .from('seiten-images')
      .upload(`${user?.id}/${file.name}`, file, {
        cacheControl: '3600',
        upsert: false,
        metadata: {
          object_owner: user?.id || '',
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
      />
      <button onClick={handleUpload}>Upload Image</button>
    </div>
  );
}
