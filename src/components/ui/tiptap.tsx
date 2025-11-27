'use client'

import { cn } from '@/lib/utils'
import Bold from '@tiptap/extension-bold'
import Document from '@tiptap/extension-document'
import History from '@tiptap/extension-history'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { EditorContent, useEditor } from '@tiptap/react'
import { useCallback, useEffect, useMemo } from 'react'

interface TiptapProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
  readOnly?: boolean;
  variant?: 'default' | 'skill';
  editorProps?: {
    attributes?: {
      class?: string;
      placeholder?: string;
    };
  };
}

const Tiptap = ({
  content,
  onChange,
  className,
  readOnly,
  variant = 'default',
  editorProps: customEditorProps
}: TiptapProps) => {
    // Transform content to HTML before loading
    const transformContent = useCallback((content: string) => {
      // First handle bold formatting
      const withBoldFormatting = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Then handle newlines by converting them to paragraph tags
      return withBoldFormatting
        .split(/\n\n+/) // Split on double newlines which represent paragraphs
        .map(paragraph => `<p>${paragraph}</p>`)
        .join('');
    }, []);

  // Memoize editor configuration
  const extensions = useMemo(
    () => [Document, Text, Paragraph, Bold, History],
    []
  );

  const editorProps = useMemo(
    () => ({
      attributes: {
        class: cn(
          "prose w-full rounded-lg border border-input bg-white/50 text-xs md:text-sm ring-offset-background",
          "placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          variant === 'default' && "min-h-[80px] px-3 py-2",
          variant === 'skill' && "px-3",
          className,
          customEditorProps?.attributes?.class
        ),
        ...(customEditorProps?.attributes?.placeholder && { 
          placeholder: customEditorProps.attributes.placeholder 
        })
      }
    }),
    [className, customEditorProps?.attributes, variant]
  );

  const editor = useEditor({
    extensions,
    content: transformContent(content),
    editorProps,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const textWithAsterisks = html
        .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
        .replace(/<p>/g, '')
        .replace(/<\/p>/g, '\n\n')
        .replace(/\n\n+/g, '\n\n')
        .trim();
      
      // Single, immediate update
      onChange(textWithAsterisks);
    },
    immediatelyRender: true,
  });

  // Sync editor content when content prop changes
  useEffect(() => {
    if (editor) {
      const currentHTML = editor.getHTML().replace(/<p>/g, '').replace(/<\/p>/g, '').trim();
      if (content !== currentHTML) {
        editor.commands.setContent(transformContent(content));
      }
    }
  }, [content, editor, transformContent]);

  return <EditorContent editor={editor} />;
};

Tiptap.displayName = 'Tiptap';

export default Tiptap;
