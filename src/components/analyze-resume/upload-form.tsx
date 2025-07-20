'use client';

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import pdfToText from 'react-pdftotext';

interface UploadFormProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  isAnalyzing: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  onAnalyze: () => void;
  hasResults: boolean;
}

export function UploadForm({
  resumeText,
  setResumeText,
  isAnalyzing,
  error,
  setError,
  onAnalyze,
  hasResults = false,
}: UploadFormProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);

    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setResumeText(text);
        setError(null);
      };
      reader.readAsText(file);
    } else if (file.type === 'application/pdf') {
      try {
        const text = await pdfToText(file);
        setResumeText(text);
        setError(null);
      } catch (err) {
        console.error('PDF processing error:', err);
        setError('Failed to extract text from the PDF. Please try again or copy-paste the content manually.');
      }
    } else if (
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      setError('DOC and DOCX files are not yet supported. Please convert to PDF or text, or copy-paste the content.');
    } else {
      setError('Please upload a PDF or text file (.pdf, .txt), or copy-paste your resume content.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files.find(
      (file) => file.type === 'application/pdf' || file.type === 'text/plain'
    );

    if (file) {
      setUploadedFile(file);
      if (file.type === 'application/pdf') {
        try {
          const text = await pdfToText(file);
          setResumeText(text);
          setError(null);
        } catch (err) {
          console.error('PDF processing error:', err);
          setError('Failed to extract text from the PDF. Please try again or copy-paste the content manually.');
        }
      } else if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setResumeText(text);
          setError(null);
        };
        reader.readAsText(file);
      }
    } else {
      setError('Please drop a PDF or text file.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-2 text-center -mt-10">
        <div className="inline-block w-full max-w-xl mx-auto rounded-xl p-6 bg-gradient-to-br from-purple-900/60 via-black/80 to-purple-700/40 border border-purple-700 shadow-lg">
          <span className="text-xs font-semibold text-purple-300 tracking-wide uppercase block mb-2">Resume Analyzer</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3">
            Make Your <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Resume</span> Stand Out!
          </h1>
          <p className="text-gray-200 text-lg">
            Instantly analyze your resume with AI and get personalized tips to boost your chances of landing interviews.
          </p>
        </div>
      </div>
      <Card className="max-w-md mx-auto bg-black border border-zinc-800 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center">
        <div className="w-full text-center">
          <p className="text-gray-200 text-base mb-1">Drop your resume here or choose a file.</p>
          <p className="text-gray-400 text-sm mb-6">PDF & DOCX only. Max 2MB file size.</p>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-lg p-4 mb-4 text-center transition-colors cursor-pointer',
              isDragging ? 'border-purple-400 bg-zinc-900' : 'border-zinc-700 hover:border-purple-500 bg-zinc-900'
            )}
          >
            <Input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {uploadedFile ? (
              <div className="flex flex-col items-center">
                <FileText className="h-8 w-8 text-teal-400 mx-auto mb-2" />
                <p className="text-teal-300 text-sm font-medium mb-1">{uploadedFile.name}</p>
                <p className="text-gray-400 text-xs">{formatFileSize(uploadedFile.size)}</p>
                <p className="text-gray-300 text-xs mt-2">Click to change file</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <FileText className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <p className="text-gray-200 text-sm">
                  {isDragging ? 'Drop your resume here' : 'Click or drag to upload'}
                </p>
              </div>
            )}
          </div>
          <Button
            onClick={onAnalyze}
            disabled={isAnalyzing || !resumeText.trim()}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg h-12 text-lg shadow mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            {isAnalyzing ? (
              <div className="flex items-center">
                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Resume...
              </div>
            ) : (
              <div className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Analyze Resume
              </div>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
