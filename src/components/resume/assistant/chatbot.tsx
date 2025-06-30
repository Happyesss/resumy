'use client';


import React, { useEffect, useCallback, useState } from 'react';
import { useChat } from 'ai/react';
import { Card } from "@/components/ui/card";
import { Bot, Trash2, Pencil, ChevronDown, ChevronLeft, RefreshCw } from "lucide-react";
import { Education, Project, Resume, Skill, WorkExperience, Job } from '@/lib/types';
import { Message } from 'ai';
import { cn } from '@/lib/utils';
import { ToolInvocation } from 'ai';
import { MemoizedMarkdown } from '@/components/ui/memoized-markdown';
import { Suggestion } from './suggestions';
import { SuggestionSkeleton } from './suggestion-skeleton';
import ChatInput from './chat-input';
import { LoadingDots } from '@/components/ui/loading-dots';
import { ApiKey } from '@/utils/ai-tools';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { WholeResumeSuggestion } from './suggestions';
import { QuickSuggestions } from './quick-suggestions';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ApiKeyErrorAlert } from '@/components/ui/api-key-error-alert';
import { Textarea } from '@/components/ui/textarea';




const LOCAL_STORAGE_KEY = 'resumelm-api-keys';
const MODEL_STORAGE_KEY = 'resumelm-default-model';

interface ChatBotProps {
  resume: Resume;
  onResumeChange: (field: keyof Resume, value: Resume[typeof field]) => void;
  job?: Job | null;
}

function ScrollToBottom() {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  return (
    !isAtBottom && (
      <button
        className={cn(
          "absolute z-50 rounded-full p-2",
          "bg-gray-800/90 hover:bg-gray-700",
          "border border-gray-600/60 hover:border-gray-500/60",
          "shadow-lg shadow-black/20 hover:shadow-black/30",
          "transition-all duration-300",
          "left-[50%] translate-x-[-50%] bottom-4"
        )}
        onClick={() => scrollToBottom()}
      >
        <ChevronDown className="h-4 w-4 text-gray-300" />
      </button>
    )
  );
}

export default function ChatBot({ resume, onResumeChange, job }: ChatBotProps) {
  const router = useRouter();
  const [accordionValue, setAccordionValue] = React.useState<string>("");
  const [apiKeys, setApiKeys] = React.useState<ApiKey[]>([]);
  const [defaultModel, setDefaultModel] = React.useState<string>('gemini-1.5-flash-8b');
  const [originalResume, setOriginalResume] = React.useState<Resume | null>(null);
  const [isInitialLoading, setIsInitialLoading] = React.useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  // Load settings from local storage
  useEffect(() => {
    const storedKeys = localStorage.getItem(LOCAL_STORAGE_KEY);
    const storedModel = localStorage.getItem(MODEL_STORAGE_KEY);
    
    if (storedKeys) {
      try {
        setApiKeys(JSON.parse(storedKeys));
      } catch (error) {
        console.error('Error loading API keys:', error);
      }
    }

    if (storedModel) {
      setDefaultModel(storedModel);
    }
  }, []);

  const config = {
    model: defaultModel,
    apiKeys,
  };
  
  // Remove document_settings from resume for the chat API
  const resumeForChat = { ...resume };
  // Use type assertion to handle the document_settings property
  if ((resumeForChat as any).document_settings) {
    delete (resumeForChat as any).document_settings;
  }

  const { messages, error, append, isLoading, addToolResult, stop, setMessages } = useChat({
    api: '/api/chat',
    body: {
      target_role: resume.target_role,
      resume: resumeForChat,
      config,
      job: job,
    },
    maxSteps: 5,
    onResponse() {
 
      setIsInitialLoading(false);
    },
    onError() {
      setIsInitialLoading(false);
    },
    async onToolCall({ toolCall }) {
      // setIsStreaming(false);
      
      if (toolCall.toolName === 'getResume') {
        const params = toolCall.args as { sections: string[] };
        
        const personalInfo = {
          first_name: resume.first_name,
          last_name: resume.last_name,
          email: resume.email,
          phone_number: resume.phone_number,
          location: resume.location,
          website: resume.website,
          linkedin_url: resume.linkedin_url,
          github_url: resume.github_url,
        };

        const sectionMap = {
          personal_info: personalInfo,
          work_experience: resume.work_experience,
          education: resume.education,
          skills: resume.skills,
          projects: resume.projects,
        };

        const result = params.sections.includes('all')
          ? { ...sectionMap, target_role: resume.target_role }
          : params.sections.reduce((acc, section) => ({
              ...acc,
              [section]: sectionMap[section as keyof typeof sectionMap]
            }), {});
        
        addToolResult({ toolCallId: toolCall.toolCallId, result });
        console.log('Tool call READ RESUME result:', result);
        return result;
      }

      if (toolCall.toolName === 'suggest_work_experience_improvement') {
        return toolCall.args;
      }

      if (toolCall.toolName === 'suggest_project_improvement') {
        return toolCall.args;
      }

      if (toolCall.toolName === 'suggest_skill_improvement') {
        return toolCall.args;
      }

      if (toolCall.toolName === 'suggest_education_improvement') {
        return toolCall.args;
      }

      if (toolCall.toolName === 'modifyWholeResume') {
        const updates = toolCall.args as {
          basic_info?: Partial<{
            first_name: string;
            last_name: string;
            email: string;
            phone_number: string;
            location: string;
            website: string;
            linkedin_url: string;
            github_url: string;
          }>;
          work_experience?: WorkExperience[];
          education?: Education[];
          skills?: Skill[];
          projects?: Project[];
        };
        
        // Store the current resume state before applying updates
        setOriginalResume({ ...resume });
        
        // Apply updates as before
        if (updates.basic_info) {
          Object.entries(updates.basic_info).forEach(([key, value]) => {
            if (value !== undefined) {
              onResumeChange(key as keyof Resume, value);
            }
          });
        }

        const sections = {
          work_experience: updates.work_experience,
          education: updates.education,
          skills: updates.skills,
          projects: updates.projects,
        };

        Object.entries(sections).forEach(([key, value]) => {
          if (value !== undefined) {
            onResumeChange(key as keyof Resume, value);
          }
        });

        // Add a simple, serializable result for the tool call
        const result = { success: true };
        addToolResult({ toolCallId: toolCall.toolCallId, result });
        return result;
      }
    },
    onFinish() {
      setIsInitialLoading(false);
    },
    // onResponse(response) {
    //   setIsStreaming(true);
    // },
  });

  // Memoize the submit handler
  const handleSubmit = useCallback((message: string) => {
  
    
    setIsInitialLoading(true);
    append({ 
      content: message.replace(/\s+$/, ''), // Extra safety: trim trailing whitespace
      role: 'user' 
    });
    
    
    setAccordionValue("chat");
  }, [append]);

  // Add delete handler
  const handleDelete = (id: string) => {
    setMessages(messages.filter(message => message.id !== id));
  };

  // Add edit handler
  const handleEdit = (id: string, content: string) => {
    setEditingMessageId(id);
    setEditContent(content);
  };

  // Add save handler
  const handleSaveEdit = (id: string) => {
    setMessages(messages.map(message => 
      message.id === id 
        ? { ...message, content: editContent }
        : message
    ));
    setEditingMessageId(null);
    setEditContent("");
  };

  const handleClearChat = useCallback(() => {
    setMessages([]);
    setOriginalResume(null);
    setEditingMessageId(null);
    setEditContent("");
  }, [setMessages]);

  return (
    <>
      {/* Floating Chat Button */}
      <div className={cn(
        "fixed left-6 bottom-6 z-[9999]",
        "transition-all duration-300 ease-in-out"
      )}>
        {accordionValue !== "chat" ? (
          // Collapsed circular button
          <button
            onClick={() => setAccordionValue("chat")}
            className={cn(
              "w-16 h-16 rounded-full",
              "bg-gradient-to-br from-purple-500 to-indigo-500",
              "shadow-xl shadow-purple-500/25",
              "hover:shadow-2xl hover:shadow-purple-500/40",
              "hover:scale-110",
              "transition-all duration-300",
              "flex items-center justify-center",
              "border-2 border-white/20",
              "backdrop-blur-sm",
              "group"
            )}
          >
            <Bot className="h-7 w-7 text-white group-hover:scale-110 transition-transform duration-300" />
          </button>
        ) : (
          // Expanded chat interface
          <Card className={cn(
            "w-96 h-[80vh]",
            "bg-gradient-to-br from-gray-900/95 via-slate-800/95 to-gray-900/95",
            "border-2 border-gray-700/60",
            "shadow-2xl shadow-black/40",
            "backdrop-blur-xl",
            "overflow-hidden",
            "flex flex-col",
            "animate-in slide-in-from-left-2 fade-in-0 duration-300"
          )}>
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700/60">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-600/80 text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <Logo className="text-sm text-white" asLink={false} />
              </div>
              <button
                onClick={() => setAccordionValue("")}
                className={cn(
                  "p-2 rounded-lg mr-2",
                  "hover:bg-gray-700/60",
                  "text-gray-300 hover:text-white",
                  "transition-colors duration-200"
                )}
                style={{ alignSelf: 'flex-start' }}
                aria-label="Close chat"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    className={cn(
                      "px-3 py-1 rounded-lg",
                      "bg-gray-700/60 text-gray-300 border border-gray-600",
                      "hover:bg-gray-600/60 hover:text-white",
                      "transition-all duration-300",
                      "focus:outline-none focus:ring-2 focus:ring-purple-400/40",
                      "disabled:opacity-50",
                      "flex items-center gap-2"
                    )}
                    disabled={messages.length === 0}
                    aria-label="Clear chat history"
                    variant="ghost"
                    size="sm"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span className="text-xs font-medium">Clear</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className={cn(
                  "bg-gray-900/95 backdrop-blur-xl",
                  "border-gray-700/60",
                  "shadow-lg shadow-black/20",
                  "text-white"
                )}>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">Clear Chat History</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-300">
                      This will remove all messages and reset the chat. This action can&apos;t be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className={cn(
                      "border-gray-600/60 bg-gray-800/60 text-gray-300",
                      "hover:bg-gray-700/60",
                      "hover:text-white"
                    )}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearChat}
                      className={cn(
                        "bg-purple-600 text-white",
                        "hover:bg-purple-700",
                        "focus:ring-purple-400"
                      )}
                    >
                      Clear Chat
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Chat Content */}
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
              <StickToBottom className="flex-1 px-4 relative overflow-y-auto custom-scrollbar" resize="smooth" initial="smooth">
                <StickToBottom.Content className="flex flex-col space-y-4 py-4 pb-8">
                  {messages.length === 0 ? (
                    <QuickSuggestions onSuggestionClick={handleSubmit} />
                  ) : (
                    <>
                      {/* Messages */}
                      {messages.map((m: Message, index) => (
                        <React.Fragment key={index}>

                          {/* Regular Message Content */}
                          {m.content && (
                            <div className="mb-4">
                              <div className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={cn(
                                  "rounded-2xl px-4 py-2 max-w-[90%] text-sm relative group items-center mb-6",
                                  m.role === 'user' ? [
                                    "bg-gradient-to-br from-purple-600 to-indigo-600",
                                    "text-white",
                                    "shadow-md shadow-purple-500/20",
                                    "ml-auto pb-0"
                                  ] : [
                                    "bg-gray-800/80",
                                    "border border-gray-700/60",
                                    "shadow-sm",
                                    "backdrop-blur-sm pb-0",
                                    "text-gray-100"
                                  ]
                                )}>

                                  {/* Edit Message */}
                                  {editingMessageId === m.id ? (
                                    <div className="flex flex-col gap-2">
                                      <Textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className={cn(
                                          "w-full min-h-[100px] p-2 rounded-lg",
                                          "bg-gray-900/80 backdrop-blur-sm",
                                          "text-gray-100 placeholder-gray-400",
                                          "border border-gray-600/60 focus:border-purple-400/60",
                                          "focus:outline-none focus:ring-1 focus:ring-purple-400/60"
                                        )}
                                      />
                                      <button
                                        onClick={() => handleSaveEdit(m.id)}
                                        className={cn(
                                          "self-end px-3 py-1 rounded-lg text-xs",
                                          "bg-purple-600 text-white",
                                          "hover:bg-purple-700",
                                          "transition-colors duration-200"
                                        )}
                                      >
                                        Save
                                      </button>
                                    </div>
                                  ) : (
                                    <MemoizedMarkdown id={m.id} content={m.content} />
                                  )}

                                  {/* Message Actions */}
                                  <div className="absolute -bottom-8 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => handleDelete(m.id)}
                                      className={cn(
                                        "transition-colors duration-200",
                                        m.role === 'user' 
                                          ? "text-purple-300/70 hover:text-purple-200"
                                          : "text-gray-400/70 hover:text-gray-300",
                                      )}
                                      aria-label="Delete message"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() => handleEdit(m.id, m.content)}
                                      className={cn(
                                        "transition-colors duration-200",
                                        m.role === 'user' 
                                          ? "text-purple-300/70 hover:text-purple-200"
                                          : "text-gray-400/70 hover:text-gray-300",
                                      )}
                                      aria-label="Edit message"
                                    >
                                      <Pencil className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Tool Invocations as Separate Bubbles */}
                          {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
                            const { toolName, toolCallId, state, args } = toolInvocation;
                            switch (state) {
                              case 'partial-call':
                              case 'call':
                                return (
                                  <div key={toolCallId} className="mt-2 max-w-[90%]">
                                    <div className="flex justify-start max-w-[90%]">
                                      {toolName === 'getResume' ? (
                                        <div className={cn(
                                          "rounded-2xl px-4 py-2 max-w-[90%] text-sm",
                                          "bg-gray-800/80 border border-gray-700/60",
                                          "shadow-sm backdrop-blur-sm text-gray-200"
                                        )}>
                                          Reading Resume...
                                        </div>
                                      ) : toolName === 'modifyWholeResume' ? (
                                        <div className={cn(
                                          "w-full rounded-2xl px-4 py-2",
                                          "bg-gray-800/80 border border-gray-700/60",
                                          "shadow-sm backdrop-blur-sm text-gray-200"
                                        )}>
                                          Preparing resume modifications...
                                        </div>
                                      ) : toolName.startsWith('suggest_') ? (
                                        <SuggestionSkeleton />
                                      ) : null}
                                      {toolName === 'displayWeather' ? (
                                        <div>Loading weather...</div>
                                      ) : null}
                                    </div>
                                  </div>
                                );

                              case 'result':
                                // Map tool names to resume sections and handle suggestions
                                const toolConfig = {
                                  suggest_work_experience_improvement: {
                                    type: 'work_experience' as const,
                                    field: 'work_experience',
                                    content: 'improved_experience',
                                  },
                                  suggest_project_improvement: {
                                    type: 'project' as const,
                                    field: 'projects',
                                    content: 'improved_project',
                                  },
                                  suggest_skill_improvement: {
                                    type: 'skill' as const,
                                    field: 'skills',
                                    content: 'improved_skill',
                                  },
                                  suggest_education_improvement: {
                                    type: 'education' as const,
                                    field: 'education',
                                    content: 'improved_education',
                                  },
                                  modifyWholeResume: {
                                    type: 'whole_resume' as const,
                                    field: 'all',
                                    content: null,
                                  },
                                } as const;
                                const config = toolConfig[toolName as keyof typeof toolConfig];

                                if (!config) return null;

                                // Handle specific tool results
                                if (toolName === 'getResume') {
                                  return (
                                    <div key={toolCallId} className="mt-2 w-[90%]">
                                      <div className="flex justify-start">
                                        <div className={cn(
                                          "rounded-2xl px-4 py-2 max-w-[90%] text-sm",
                                          "bg-gray-800/80 border border-gray-700/60",
                                          "shadow-sm backdrop-blur-sm text-gray-200"
                                        )}>
                                          <p>Read Resume ({args.sections?.join(', ') || 'all'}) ✅</p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }

                                if (config.type === 'whole_resume') {
                                  return (
                                    <div key={toolCallId} className="mt-2 w-[90%]">
                                      <WholeResumeSuggestion
                                        onReject={() => {
                                          if (originalResume) {
                                            Object.keys(originalResume).forEach((key) => {
                                              if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
                                                onResumeChange(key as keyof Resume, originalResume[key as keyof Resume]);
                                              }
                                            });
                                            setOriginalResume(null);
                                          }
                                        }}
                                      />
                                    </div>
                                  );
                                }

                                return (
                                  <div key={toolCallId} className="mt-2 w-[90%]">
                                    <div className="">
                                      <Suggestion
                                        type={config.type}
                                        content={args[config.content]}
                                        currentContent={resume[config.field][args.index]}
                                        onAccept={() => onResumeChange(config.field, 
                                          resume[config.field].map((item: WorkExperience | Education | Project | Skill, i: number) => 
                                            i === args.index ? args[config.content] : item
                                          )
                                        )}
                                        onReject={() => {}}
                                      />
                                    </div>
                                  </div>
                                );

                              default:
                                return null;
                            }
                          })}


                          {/* Loading Dots Message - Modified condition */}
                          {((isInitialLoading && index === messages.length - 1 && m.role === 'user') ||
                            (isLoading && index === messages.length - 1 && m.role === 'assistant')) && (
                            <div className="mb-4">
                              <div className="flex justify-start">
                                <div className={cn(
                                  "rounded-2xl px-4 py-2.5 min-w-[60px]",
                                  "bg-gray-800/80",
                                  "border border-gray-700/60",
                                  "shadow-sm",
                                  "backdrop-blur-sm"
                                )}>
                                  <LoadingDots className="text-purple-400" />
                                </div>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </>
                  )}
                
                  {error && (
                    error.message === "Rate limit exceeded. Try again later." ? (
                      <div className={cn(
                        "rounded-lg p-4 text-sm",
                        "bg-red-900/50 border border-red-800/60",
                        "text-red-200"
                      )}>
                        <p>You&apos;ve used all your available messages. Please try again after:</p>
                        <p className="font-medium mt-2">
                          {new Date(Date.now() + 5 * 60 * 60 * 1000).toLocaleString()} {/* 5 hours from now */}
                        </p>
                      </div>
                    ) : (
                      <ApiKeyErrorAlert 
                        error={error} 
                        router={router} 
                      />
                    )
                  )}
                </StickToBottom.Content>

                <ScrollToBottom />
              </StickToBottom>
              
              {/* Input Bar */}
              <div className="border-t border-gray-700/60 bg-gray-900/60 backdrop-blur-sm">
                <ChatInput
                  isLoading={isLoading}
                  onSubmit={handleSubmit}
                  onStop={stop}
                />
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}