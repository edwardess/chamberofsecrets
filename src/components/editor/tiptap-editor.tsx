"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { Button } from '@heroui/react';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string, json: object) => void;
  editable?: boolean;
}

export default function TiptapEditor({ content, onChange, editable = true }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getJSON());
    },
    // Fix for SSR hydration mismatch
    immediatelyRender: false,
  });

  if (!editor) {
    return <div className="h-64 border border-foreground/10 rounded-lg p-4 flex items-center justify-center">Loading editor...</div>;
  }

  return (
    <div className="border border-foreground/20 rounded-lg overflow-hidden shadow-sm">
      {editable && (
        <div className="bg-background border-b border-foreground/10 p-2 flex flex-wrap gap-1 items-center">
          <div className="flex gap-1 mr-1">
            <Button 
              size="sm" 
              variant={editor.isActive('bold') ? 'solid' : 'flat'} 
              onClick={() => editor.chain().focus().toggleBold().run()}
              className="min-w-[36px] h-9 transition-colors"
              color={editor.isActive('bold') ? 'primary' : 'default'}
              title="Bold"
            >
              <BoldIcon />
            </Button>
            <Button 
              size="sm" 
              variant={editor.isActive('italic') ? 'solid' : 'flat'} 
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className="min-w-[36px] h-9 transition-colors"
              color={editor.isActive('italic') ? 'primary' : 'default'}
              title="Italic"
            >
              <ItalicIcon />
            </Button>
            <Button 
              size="sm" 
              variant={editor.isActive('strike') ? 'solid' : 'flat'} 
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className="min-w-[36px] h-9 transition-colors"
              color={editor.isActive('strike') ? 'primary' : 'default'}
              title="Strikethrough"
            >
              <StrikeIcon />
            </Button>
          </div>
          
          <div className="h-6 w-px bg-foreground/10 mx-1"></div>
          
          <div className="flex gap-1 mr-1">
            <Button 
              size="sm" 
              variant={editor.isActive('heading', { level: 1 }) ? 'solid' : 'flat'} 
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className="min-w-[36px] h-9 transition-colors font-semibold"
              color={editor.isActive('heading', { level: 1 }) ? 'primary' : 'default'}
              title="Heading 1"
            >
              H1
            </Button>
            <Button 
              size="sm" 
              variant={editor.isActive('heading', { level: 2 }) ? 'solid' : 'flat'} 
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className="min-w-[36px] h-9 transition-colors font-semibold"
              color={editor.isActive('heading', { level: 2 }) ? 'primary' : 'default'}
              title="Heading 2"
            >
              H2
            </Button>
            <Button 
              size="sm" 
              variant={editor.isActive('heading', { level: 3 }) ? 'solid' : 'flat'} 
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className="min-w-[36px] h-9 transition-colors font-semibold"
              color={editor.isActive('heading', { level: 3 }) ? 'primary' : 'default'}
              title="Heading 3"
            >
              H3
            </Button>
          </div>
          
          <div className="h-6 w-px bg-foreground/10 mx-1"></div>
          
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant={editor.isActive('bulletList') ? 'solid' : 'flat'} 
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className="min-w-[36px] h-9 transition-colors"
              color={editor.isActive('bulletList') ? 'primary' : 'default'}
              title="Bullet List"
            >
              <ListIcon />
            </Button>
            <Button 
              size="sm" 
              variant={editor.isActive('orderedList') ? 'solid' : 'flat'} 
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className="min-w-[36px] h-9 transition-colors"
              color={editor.isActive('orderedList') ? 'primary' : 'default'}
              title="Numbered List"
            >
              <OrderedListIcon />
            </Button>
          </div>
          
          <div className="h-6 w-px bg-foreground/10 mx-1"></div>
          
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant={editor.isActive('link') ? 'solid' : 'flat'} 
              onClick={() => {
                const url = window.prompt('Enter URL:');
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                } else if (editor.isActive('link')) {
                  editor.chain().focus().unsetLink().run();
                }
              }}
              className="min-w-[36px] h-9 transition-colors"
              color={editor.isActive('link') ? 'primary' : 'default'}
              title="Add Link"
            >
              <LinkIcon />
            </Button>
            <Button 
              size="sm" 
              variant="flat" 
              onClick={() => {
                const url = window.prompt('Enter image URL:');
                if (url) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              }}
              className="min-w-[36px] h-9 transition-colors"
              title="Add Image"
            >
              <ImageIcon />
            </Button>
            
            <Button 
              size="sm" 
              variant={editor.isActive('highlight') ? 'solid' : 'flat'} 
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className="min-w-[36px] h-9 transition-colors"
              color={editor.isActive('highlight') ? 'warning' : 'default'}
              title="Highlight Text"
            >
              <HighlightIcon />
            </Button>
          </div>
        </div>
      )}
      <EditorContent 
        editor={editor} 
        className={`prose prose-blue max-w-none p-5 min-h-[400px] focus:outline-none ${!editable ? 'pointer-events-none' : ''}`}
      />
    </div>
  );
}

// Simple icon components
function BoldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
    </svg>
  );
}

function ItalicIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="4" x2="10" y2="4"></line>
      <line x1="14" y1="20" x2="5" y2="20"></line>
      <line x1="15" y1="4" x2="9" y2="20"></line>
    </svg>
  );
}

function StrikeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <path d="M16 6c-.5-1.8-2.1-3-4-3-2.2 0-4 1.8-4 4 0 1.5.8 2.8 2 3.5"></path>
      <path d="M8 18c.5 1.8 2.1 3 4 3 2.2 0 4-1.8 4-4 0-1.5-.8-2.8-2-3.5"></path>
    </svg>
  );
}

function ListIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"></line>
      <line x1="8" y1="12" x2="21" y2="12"></line>
      <line x1="8" y1="18" x2="21" y2="18"></line>
      <line x1="3" y1="6" x2="3.01" y2="6"></line>
      <line x1="3" y1="12" x2="3.01" y2="12"></line>
      <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
  );
}

function OrderedListIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="10" y1="6" x2="21" y2="6"></line>
      <line x1="10" y1="12" x2="21" y2="12"></line>
      <line x1="10" y1="18" x2="21" y2="18"></line>
      <path d="M4 6h1v4"></path>
      <path d="M4 10h2"></path>
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  );
}

function HighlightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l.642.005.616.017.299.013.579.034.553.046c4.687.455 6.65 2.333 7.166 6.906l.046.553.034.579.013.299.017.616.005.642-.005.642-.017.616-.013.299-.034.579-.046.553c-.455 4.687-2.333 6.65-6.906 7.166l-.553.046-.579.034-.299.013-.616.017L12 22l-.642-.005-.616-.017-.299-.013-.579-.034-.553-.046c-4.687-.455-6.65-2.333-7.166-6.906l-.046-.553-.034-.579-.013-.299-.017-.616L1 12l.005-.642.017-.616.013-.299.034-.579.046-.553c.455-4.687 2.333-6.65 6.906-7.166l.553-.046.579-.034.299-.013.616-.017L12 2z"></path>
    </svg>
  );
}
