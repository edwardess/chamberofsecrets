"use client";

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import Jodit only on the client side
const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
  loading: () => <div className="h-[400px] border border-foreground/10 rounded-lg p-4 flex items-center justify-center">Loading editor...</div>
});

interface JoditEditorWrapperProps {
  content: string;
  onChange: (html: string) => void;
  editable?: boolean;
}

export default function JoditEditorWrapper({ 
  content, 
  onChange, 
  editable = true 
}: JoditEditorWrapperProps) {
  const editorRef = useRef(null);
  
  // Configuration for Jodit Editor
  // Cast config as any to avoid TypeScript issues with Jodit types
  const config: any = {
    readonly: !editable,
    height: 400,
    toolbarSticky: true,
    toolbarStickyOffset: 0,
    // Define font options
    defaultFontSizePoints: '14',
    buttons: [
      // Main formatting
      'bold', 'italic', 'underline', 'strikethrough', 
      'subscript', 'superscript', '|',
      
      // Headings & paragraph styles
      'h1', 'h2', 'h3', 'paragraph', 'fontsize', 'font', '|',
      
      // Lists
      'ul', 'ol', '|',
      
      // Alignment & indentation
      'left', 'center', 'right', 'justify', '|',
      'indent', 'outdent', '|',
      
      // Media
      'link', 'image', 'video', 'file', '|',
      
      // Text styling
      'brush', 'format', '|',
      
      // Other elements
      'hr', 'table', 'symbols', '|',
      
      // Utility
      'undo', 'redo', '|',
      
      // HTML source
      'source' // Add source button to allow manual iframe embedding
    ],
    uploader: {
      insertImageAsBase64URI: true,
      imagesExtensions: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
      // Limit image size to 5MB to prevent Firestore size limits
      maxFileSize: 5 * 1024 * 1024,
    },
    imageDefaultWidth: 600, // Set a default image width
    style: {
      // Default font family (can be overridden by font selector)
      fontFamily: 'var(--font-inter), system-ui, sans-serif',
    }
  };
  
  // Font options
  config.fonts = {
    list: {
      'Arial, Helvetica, sans-serif': 'Arial',
      'Georgia, serif': 'Georgia',
      'Inter, sans-serif': 'Inter',
      'Verdana, Geneva, sans-serif': 'Verdana',
      'Tahoma, Geneva, sans-serif': 'Tahoma',
      'Trebuchet MS, Helvetica, sans-serif': 'Trebuchet MS',
      'Times New Roman, Times, serif': 'Times New Roman',
      'Courier New, Courier, monospace': 'Courier New',
      'Garamond, serif': 'Garamond'
    }
  };
  
  // Iframe and UI settings
  config.iframe = true;
  config.iframeDefaultSrc = 'about:blank';
  config.iframeStyle = `
    html{height:100%}
    body{height:100%;margin:0;padding:10px;box-sizing:border-box;font-family:var(--font-inter),system-ui,sans-serif;font-size:14px;line-height:1.5}
    table{width:100%;border-collapse:collapse;margin-bottom:1em}
    table td,table th{border:1px solid #ddd;padding:8px}
    p{margin-top:0}
  `;
  
  // Counter and UI settings
  config.showCharsCounter = false;
  config.showWordsCounter = false;
  config.showXPathInStatusbar = false;
  config.askBeforePasteHTML = false;
  config.askBeforePasteFromWord = false;
  config.defaultActionOnPaste = 'insert_as_html';
  
  // Tags and attributes
  config.allowTags = ['iframe', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot', 'colgroup', 'col'];
  config.allowTagsAttributes = {
    iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen']
  };
  
  // Disable mobile plugins
  config.disablePlugins = 'mobile';
  
  // Video control configuration
  config.controls = {
    video: {
      icon: 'video',
      tooltip: 'Insert Video',
      popup: (editor: any, current: any, close: any) => {
        const form = editor.create.fromHTML(
          `<div class="jodit-ui-block">
            <div class="jodit-ui-input">
              <label>Video URL (YouTube, Vimeo, etc.)</label>
              <input type="text" placeholder="https://www.youtube.com/watch?v=..." required/>
            </div>
            <div class="jodit-ui-input">
              <label>Width</label>
              <input type="text" value="560" required/>
            </div>
            <div class="jodit-ui-input">
              <label>Height</label>
              <input type="text" value="315" required/>
            </div>
            <div class="jodit-ui-block">
              <button type="button" class="jodit-ui-button">Insert Video</button>
            </div>
          </div>`
        );

        const inputs = form.querySelectorAll('input');
        const button = form.querySelector('button');
        
        button?.addEventListener('click', () => {
          const url = inputs[0].value.trim();
          const width = inputs[1].value;
          const height = inputs[2].value;

          if (!url) return;

          // Process URL to get embed version
          let embedURL = url;
          
          // Handle YouTube links
          if (url.match(/youtube\.com\/watch\?v=([^&]+)/)) {
            const videoId = url.match(/youtube\.com\/watch\?v=([^&]+)/)?.[1];
            if (videoId) {
              embedURL = `https://www.youtube.com/embed/${videoId}`;
            }
          } else if (url.match(/youtu\.be\/([^?&]+)/)) {
            const videoId = url.match(/youtu\.be\/([^?&]+)/)?.[1];
            if (videoId) {
              embedURL = `https://www.youtube.com/embed/${videoId}`;
            }
          }
          // Handle Vimeo links
          else if (url.match(/vimeo\.com\/(\d+)/)) {
            const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
            if (videoId) {
              embedURL = `https://player.vimeo.com/video/${videoId}`;
            }
          }

          // Create iframe HTML
          const iframe = `<div class="jodit-media-wrapper"><iframe width="${width}" height="${height}" 
            src="${embedURL}" frameborder="0" allowfullscreen="allowfullscreen"></iframe></div>`;
          
          editor.selection.insertHTML(iframe);
          close();
        });

        return form;
      }
    }
  };

  return (
    <div className="jodit-editor-container">
      <JoditEditor
        ref={editorRef}
        value={content}
        config={config}
        onBlur={(newContent) => onChange(newContent)}
        onChange={(newContent) => {}}
      />
      <style jsx global>{`
        .jodit-container:not(.jodit_inline) {
          border-color: rgba(23, 23, 23, 0.1);
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .jodit-toolbar__box:not(:empty) {
          background: #fff;
          border-bottom: 1px solid rgba(23, 23, 23, 0.1);
        }
        .jodit-toolbar-button {
          margin: 0;
        }
        .jodit-toolbar-button__button {
          padding: 6px 8px;
        }
        .jodit-toolbar-button__trigger {
          width: 12px;
          height: 100%;
          padding: 0 3px;
        }
        .jodit-status-bar {
          display: none;
        }
        .jodit-container .jodit-workplace {
          min-height: 400px;
        }
        .jodit-container .jodit-wysiwyg {
          font-family: var(--font-inter), system-ui, sans-serif;
          font-size: 0.95rem;
          padding: 16px;
        }
        .jodit-container .jodit-wysiwyg h1, 
        .jodit-container .jodit-wysiwyg h2, 
        .jodit-container .jodit-wysiwyg h3 {
          margin-top: 1em;
          margin-bottom: 0.5em;
          font-weight: 600;
        }
        .jodit-container .jodit-wysiwyg h1 {
          font-size: 1.5em;
        }
        .jodit-container .jodit-wysiwyg h2 {
          font-size: 1.25em;
        }
        .jodit-container .jodit-wysiwyg h3 {
          font-size: 1.125em;
        }
        .jodit-container .jodit-wysiwyg p {
          margin: 0 0 0.75em;
        }
        .jodit-container .jodit-wysiwyg ul, 
        .jodit-container .jodit-wysiwyg ol {
          margin: 0.75em 0;
          padding-left: 2em;
        }
        .jodit-container .jodit-wysiwyg a {
          color: #2563eb;
          text-decoration: underline;
        }
        .jodit-container .jodit-wysiwyg img {
          max-width: 100%;
          height: auto;
          margin: 0.75em auto;
        }
        .jodit-container .jodit-wysiwyg iframe {
          max-width: 100%;
          margin: 1em auto;
          display: block;
        }
        .jodit-container .jodit-wysiwyg .jodit-media-wrapper {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          height: 0;
          overflow: hidden;
          max-width: 100%;
          margin: 1em auto;
        }
        .jodit-container .jodit-wysiwyg .jodit-media-wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          margin: 0;
        }
        .jodit-ui-input {
          margin-bottom: 10px;
        }
        .jodit-ui-input label {
          display: block;
          margin-bottom: 5px;
          font-size: 14px;
        }
        .jodit-ui-input input {
          width: 100%;
          padding: 6px 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .jodit-ui-block {
          margin: 10px 0;
        }
        .jodit-ui-button {
          background: #2563eb;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        .jodit-ui-button:hover {
          background: #1d4ed8;
        }
      `}</style>
    </div>
  );
}
