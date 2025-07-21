'use client';

import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import pdfToText from 'react-pdftotext';
import mammoth from 'mammoth';

interface UploadFormProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  isAnalyzing: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  onAnalyze: () => void;
  hasResults: boolean;
  setResumeFile?: (file: File | null) => void; // Add optional PDF file setter
  delayCountdown?: number | null; // Add countdown prop
}

export function UploadForm({
  resumeText,
  setResumeText,
  isAnalyzing,
  error,
  setError,
  onAnalyze,
  hasResults = false,
  setResumeFile,
  delayCountdown,
}: UploadFormProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = async (file: File) => {
    if (isProcessing) return; // Prevent double processing
    
    setIsProcessing(true);
    setUploadedFile(file);

    try {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setResumeText(text);
          setError(null);
          setIsProcessing(false);
        };
        reader.readAsText(file);
      } else if (file.type === 'application/pdf') {
        // Store the PDF file for iframe display
        if (setResumeFile) {
          setResumeFile(file);
          // Store in localStorage as well for persistence
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            localStorage.setItem('resumePdfData', result);
            localStorage.setItem('resumePdfName', file.name);
          };
          reader.readAsDataURL(file);
        }
        
        // Extract text for analysis
        const text = await pdfToText(file);
        setResumeText(text);
        setError(null);
      } else if (
        file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setResumeText(result.value);
        setError(null);
      } else {
        setError('Please upload a PDF or text file (.pdf, .txt), or copy-paste your resume content.');
      }
    } catch (err) {
      setError('Failed to extract text from the file. Please try again or copy-paste the content manually.');
    } finally {
      setIsProcessing(false);
      // Reset file input to allow same file upload again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.target.files?.[0];
    if (!file) return;
    
    await processFile(file);
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
      (file) => file.type === 'application/pdf' || 
               file.type === 'text/plain' ||
               file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );

    if (file) {
      await processFile(file);
    } else {
      setError('Please drop a PDF, DOCX, or text file.');
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
          <label
            htmlFor="file-upload"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-lg p-4 mb-4 text-center transition-colors cursor-pointer relative',
              isDragging ? 'border-purple-400 bg-zinc-900' : 'border-zinc-700 hover:border-purple-500 bg-zinc-900',
              isProcessing && 'opacity-50 cursor-not-allowed'
            )}
            style={{ display: 'block' }}
          >
            <Input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={isProcessing}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="pointer-events-none">
              {isProcessing ? (
                <div className="flex flex-col items-center">
                  <RefreshCw className="h-8 w-8 text-purple-400 mx-auto mb-2 animate-spin" />
                  <p className="text-purple-300 text-sm">Processing file...</p>
                </div>
              ) : uploadedFile ? (
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
          </label>
          <Button
            onClick={onAnalyze}
            disabled={isAnalyzing || !resumeText.trim() || isProcessing}
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

      {/* Additional content below upload form */}
      <div className="max-w-md mx-auto mt-6 space-y-4">
        {/* Features Section */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4" />
                </svg>
              </div>
              <span className="text-white text-sm font-medium">ATS Optimization</span>
            </div>
            <p className="text-gray-400 text-xs">Ensure your resume passes applicant tracking systems</p>
          </div>
          
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-white text-sm font-medium">Instant Analysis</span>
            </div>
            <p className="text-gray-400 text-xs">Get results in seconds, not hours</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4">
          <div className="text-center mb-3">
            <h3 className="text-white text-sm font-semibold mb-1">Trusted by Job Seekers</h3>
            <p className="text-gray-400 text-xs">Join thousands who improved their resume</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-purple-400 font-bold text-lg">10K+</div>
              <div className="text-gray-500 text-xs">Resumes Analyzed</div>
            </div>
            <div>
              <div className="text-purple-400 font-bold text-lg">95%</div>
              <div className="text-gray-500 text-xs">Success Rate</div>
            </div>
            <div>
              <div className="text-purple-400 font-bold text-lg">24/7</div>
              <div className="text-gray-500 text-xs">Available</div>
            </div>
          </div>
        </div>

        {/* File Types Support */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4">
          <h3 className="text-white text-sm font-semibold mb-3 text-center">Supported File Types</h3>
          <div className="flex justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500/20 rounded flex items-center justify-center">
                <span className="text-red-400 text-xs font-bold">PDF</span>
              </div>
              <span className="text-gray-300 text-xs">PDF Files</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center">
                <span className="text-blue-400 text-xs font-bold">DOC</span>
              </div>
              <span className="text-gray-300 text-xs">Word Files</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
