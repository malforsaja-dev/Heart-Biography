import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Use Snow theme CSS

interface QuillEditorProps {
  content: string;
  id: number;
  onContentChange: (content: string, id: number) => void;
  toolbarId: string; // Pass toolbar ID as a prop
}

const QuillEditor = ({ content, id, onContentChange, toolbarId }: QuillEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: `#${toolbarId}`, // Link to external toolbar by ID
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
  }, [content, id, onContentChange, toolbarId]);

  return <div ref={editorRef} className="h-full w-full" />;
};

export default QuillEditor;
