"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';

export default function UploadImage({ onUploadSuccess }: { onUploadSuccess: (url: string) => void }) {
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

    const filePath = `${user.id}/${file.name}`;
    const { error } = await supabase.storage
      .from('seiten-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        metadata: {
          object_owner: user.id,
        },
      });

    if (error) {
      console.error('Error uploading image:', error);
    } else {
      const { data } = supabase.storage.from('seiten-images').getPublicUrl(filePath);
      onUploadSuccess(data.publicUrl);
    }
  }

  return (
    <div className="flex items-center">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        disabled={!user}
        className="mr-2 p-1 border rounded text-sm"
        style={{ width: '250px' }}
      />
      <button onClick={handleUpload} className="p-1 bg-blue-500 text-white rounded text-sm" disabled={!user}>
        Upload
      </button>
    </div>
  );
}
