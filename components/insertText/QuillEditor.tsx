import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ 'font': [] }, { 'size': [] }],
    [{ 'align': [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'color': [] }, { 'background': [] }],
    ['link', 'image'],
    ['clean']
  ],
};

const formats = [
  'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'align',
  'list',
  'color', 'background',
  'link', 'image'
];

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  isEditMode?: boolean;
  placeholder?: string;
}

const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  isEditMode = true,
  placeholder = "Start typing..."
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ margin: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      {isEditMode ? (
        <ReactQuill
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          theme="snow"
          placeholder={placeholder}
        />
      ) : (
        <div
          className="ql-editor"
          style={{ minHeight: '100px', padding: '10px', backgroundColor: '#f9f9f9' }}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      )}
    </div>
  );
};

export default QuillEditor;
