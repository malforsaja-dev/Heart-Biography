import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface TextEditorProps {
  content: string;
  id: number;
  onContentChange: (content: string, id: number) => void;
  onClose: () => void;
  onCancel?: () => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ content, id, onContentChange, onClose, onCancel }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const initialContentRef = useRef<string>(content);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: `#quill-toolbar-${id}`,
        },
      });
      quillRef.current = quill;
      quill.clipboard.dangerouslyPasteHTML(content);
      quill.on('text-change', () => {
        onContentChange(quill.root.innerHTML, id);
      });
    } else if (quillRef.current && content !== quillRef.current.root.innerHTML) {
      const quill = quillRef.current;
      const selection = quill.getSelection();
      quill.clipboard.dangerouslyPasteHTML(content);
      if (selection) {
        quill.setSelection(selection);
      }
    }
  }, [content, id, onContentChange]);

  const handleCancel = () => {
    if (quillRef.current) {
      quillRef.current.clipboard.dangerouslyPasteHTML(initialContentRef.current);
    }
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <div className="absolute -top-6 left-0 w-full h-full z-10 flex flex-col items-center">
      {/* Toolbar */}
      <div
        id={`quill-toolbar-${id}`}
        className="w-96 bg-gray-100 border-b flex justify-start items-center z-20"
      >
        <button className="ql-bold px-2 py-1 mx-1">B</button>
        <button className="ql-italic px-2 py-1 mx-1">I</button>
        <button className="ql-underline px-2 py-1 mx-1">U</button>
        <select className="ql-size mx-1" defaultValue="">
          <option value="small">Small</option>
          <option value="">Normal</option>
          <option value="large">Large</option>
          <option value="huge">Huge</option>
        </select>
        <select className="ql-align mx-1"></select>
        <select className="ql-color mx-1"></select>
        <select className="ql-background mx-1"></select>
        <button className="ql-list" value="ordered">Ordered</button>
        <button className="ql-list" value="bullet">Bullet</button>
      </div>

      {/* Editor */}
      <div className="w-full h-full p-2 flex-grow">
        <div ref={editorRef} className="h-full w-full" />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-2 mb-2">
        <button onClick={onClose}>✅</button>
        <button onClick={handleCancel}>❌</button>
      </div>
    </div>
  );
};

export default TextEditor;
