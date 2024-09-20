import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Use Snow theme CSS

interface QuillEditorProps {
  content: string;
  id: number;
  onContentChange: (content: string, id: number) => void;
}

const QuillEditor = ({ content, id, onContentChange }: QuillEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
            [{ color: [] }, { background: [] }],
            [{ size: ['small', false, 'large', 'huge'] }],
            ['clean'],
          ],
        },
      });

      quillRef.current = quill;
      quill.clipboard.dangerouslyPasteHTML(content);

      quill.on('text-change', () => {
        onContentChange(quill.root.innerHTML, id);
      });
    } else if (quillRef.current && content !== quillRef.current.root.innerHTML) {
      // Update content without re-initializing
      const quill = quillRef.current;
      const selection = quill.getSelection(); // Save selection
      quill.clipboard.dangerouslyPasteHTML(content);
      if (selection) {
        quill.setSelection(selection); // Restore selection
      }
    }
  }, [content, id, onContentChange]);

  return <div ref={editorRef} style={{ height: '100%' }} />;
};

export default QuillEditor;
