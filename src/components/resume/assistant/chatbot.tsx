'use client';


import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { ApiKeyErrorAlert } from '@/components/ui/api-key-error-alert';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingDots } from '@/components/ui/loading-dots';
import { MemoizedMarkdown } from '@/components/ui/memoized-markdown';
import { Textarea } from '@/components/ui/textarea';
import { Education, Job, Project, Resume, Skill, WorkExperience } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ApiKey } from '@/utils/ai-tools';
import { Message, ToolInvocation } from 'ai';
import { useChat } from 'ai/react';
import { Bot, ChevronDown, ChevronLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from 'react';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';
import ChatInput from './chat-input';
import { QuickSuggestions } from './quick-suggestions';
import { SuggestionSkeleton } from './suggestion-skeleton';
import { Suggestion, WholeResumeSuggestion } from './suggestions';




const LOCAL_STORAGE_KEY = 'resumy-api-keys';
const MODEL_STORAGE_KEY = 'resumy-default-model';

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
          "absolute z-50 rounded-full p-2.5",
          "bg-zinc-900/95 hover:bg-zinc-800",
          "border border-zinc-700/80 hover:border-violet-500/50",
          "shadow-xl shadow-black/30",
          "transition-all duration-200",
          "left-[50%] translate-x-[-50%] bottom-4",
          "hover:scale-105"
        )}
        onClick={() => scrollToBottom()}
      >
        <ChevronDown className="h-4 w-4 text-violet-400" />
      </button>
    )
  );
}

export default function ChatBot({ resume, onResumeChange, job }: ChatBotProps) {
  const router = useRouter();
  const [accordionValue, setAccordionValue] = React.useState<string>("");
  const [apiKeys, setApiKeys] = React.useState<ApiKey[]>([]);
  const [defaultModel, setDefaultModel] = React.useState<string>('gemini-2.5-flash-lite');
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
  if ((resumeForChat as unknown as Record<string, unknown>).document_settings) {
    delete (resumeForChat as unknown as Record<string, unknown>).document_settings;
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
  const _handleDelete = (id: string) => {
    setMessages(messages.filter(message => message.id !== id));
  };

  // Add edit handler
  const _handleEdit = (id: string, content: string) => {
    setEditingMessageId(id);
    setEditContent(content);
  };

  // Add save handler - updated to not trigger regeneration
  const handleSaveEdit = (id: string) => {
    const updatedMessages = messages.map(message =>
      message.id === id
        ? { ...message, content: editContent }
        : message
    );
    setMessages(updatedMessages);
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
        "fixed left-4 sm:left-6 bottom-20 sm:bottom-24 z-[10000]",
        "transition-all duration-300 ease-in-out"
      )}>
        {accordionValue !== "chat" ? (
          // Collapsed circular button
          <button
            onClick={() => setAccordionValue("chat")}
            className={cn(
              "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl",
              "bg-gradient-to-br from-violet-600 to-purple-600",
              "shadow-xl shadow-violet-500/30",
              "hover:shadow-2xl hover:shadow-violet-500/40",
              "hover:scale-105",
              "transition-all duration-300",
              "flex items-center justify-center",
              "border border-violet-400/20",
              "group"
            )}
          >
            <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:scale-110 transition-transform duration-300" />
          </button>
        ) : (
          // Expanded chat interface
          <Card className={cn(
            "w-[calc(100vw-2rem)] sm:w-[380px] h-[calc(100vh-8rem)] sm:h-[70vh] max-h-[600px]",
            "bg-zinc-950",
            "border border-zinc-800/80",
            "shadow-2xl shadow-black/50",
            "overflow-hidden",
            "flex flex-col",
            "rounded-2xl",
            "animate-in slide-in-from-bottom-4 fade-in-0 duration-300"
          )}>
            {/* Header with close button */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAccordionValue("")}
                  className={cn(
                    "p-2 rounded-xl",
                    "hover:bg-zinc-800",
                    "text-zinc-400 hover:text-white",
                    "transition-all duration-200"
                  )}
                  aria-label="Close chat"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-violet-500/20 border border-violet-500/30">
                    <Bot className="h-4 w-4 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
                    <p className="text-[10px] text-zinc-500">Resume optimization</p>
                  </div>
                </div>
              </div>

              <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    className={cn(
                      "px-3 py-1.5 rounded-xl h-8",
                      "bg-zinc-800/80 text-zinc-400 border border-zinc-700/80",
                      "hover:bg-zinc-700 hover:text-white hover:border-zinc-600",
                      "transition-all duration-200",
                      "disabled:opacity-50",
                      "flex items-center gap-1.5"
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
                  "bg-zinc-950/98 backdrop-blur-xl",
                  "border border-zinc-800/80",
                  "shadow-2xl shadow-black/50",
                  "text-white",
                  "rounded-2xl"
                )}>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">Clear Chat History</AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-400">
                      This will remove all messages and reset the chat. This action can&apos;t be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className={cn(
                      "border-zinc-700 bg-zinc-800/80 text-zinc-300",
                      "hover:bg-zinc-700 hover:text-white",
                      "rounded-xl"
                    )}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearChat}
                      className={cn(
                        "bg-violet-600 text-white",
                        "hover:bg-violet-700",
                        "rounded-xl"
                      )}
                    >
                      Clear Chat
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Chat Content */}
            <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-zinc-900">
              <StickToBottom className="flex-1 px-4 relative overflow-y-auto custom-scrollbar" resize="smooth" initial="smooth">
                <StickToBottom.Content className="flex flex-col space-y-3 py-4 pb-8">
                  {messages.length === 0 ? (
                    <QuickSuggestions onSuggestionClick={handleSubmit} />
                  ) : (
                    <>
                      {/* Messages */}
                      {messages.map((m: Message, index) => (
                        <React.Fragment key={index}>

                          {/* Regular Message Content */}
                          {m.content && (
                            <div className="mb-3">
                              <div className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={cn(
                                  "rounded-2xl px-4 py-2.5 max-w-[85%] text-sm relative group",
                                  m.role === 'user' ? [
                                    "bg-gradient-to-br from-violet-600 to-purple-600",
                                    "text-white",
                                    "shadow-lg shadow-violet-500/20",
                                    "ml-auto"
                                  ] : [
                                    "bg-zinc-900/80",
                                    "border border-zinc-800/80",
                                    "shadow-sm",
                                    "text-zinc-100"
                                  ]
                                )}>

                                  {/* Edit Message */}
                                  {editingMessageId === m.id ? (
                                    <div className="flex flex-col gap-2">
                                      <Textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className={cn(
                                          "w-full min-h-[100px] p-3 rounded-xl",
                                          "bg-zinc-900/80",
                                          "text-zinc-100 placeholder-zinc-500",
                                          "border border-zinc-700 focus:border-violet-500/50",
                                          "focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                                        )}
                                      />
                                      <button
                                        onClick={() => handleSaveEdit(m.id)}
                                        className={cn(
                                          "self-end px-4 py-1.5 rounded-xl text-xs font-medium",
                                          "bg-violet-600 text-white",
                                          "hover:bg-violet-700",
                                          "transition-colors duration-200"
                                        )}
                                      >
                                        Save
                                      </button>
                                    </div>
                                  ) : (
                                    <MemoizedMarkdown id={m.id} content={m.content} />
                                  )}

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
                                  <div key={toolCallId} className="mt-2 max-w-[85%]">
                                    <div className="flex justify-start max-w-[85%]">
                                      {toolName === 'getResume' ? (
                                        <div className={cn(
                                          "rounded-2xl px-4 py-2.5 max-w-[85%] text-sm",
                                          "bg-zinc-900/80 border border-zinc-800/80",
                                          "text-zinc-300"
                                        )}>
                                          Reading Resume...
                                        </div>
                                      ) : toolName === 'modifyWholeResume' ? (
                                        <div className={cn(
                                          "w-full rounded-2xl px-4 py-2.5",
                                          "bg-zinc-900/80 border border-zinc-800/80",
                                          "text-zinc-300"
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
                                    <div key={toolCallId} className="mt-2 w-[85%]">
                                      <div className="flex justify-start">
                                        <div className={cn(
                                          "rounded-2xl px-4 py-2.5 max-w-[85%] text-sm",
                                          "bg-zinc-900/80 border border-zinc-800/80",
                                          "text-zinc-300"
                                        )}>
                                          <p>Read Resume ({args.sections?.join(', ') || 'all'}) ✅</p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }

                                if (config.type === 'whole_resume') {
                                  return (
                                    <div key={toolCallId} className="mt-2 w-[85%]">
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
                                        onReject={() => { }}
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
                              <div className="mb-3">
                                <div className="flex justify-start">
                                  <div className={cn(
                                    "rounded-2xl px-4 py-3 min-w-[60px]",
                                    "bg-zinc-900/80",
                                    "border border-zinc-800/80"
                                  )}>
                                    <LoadingDots className="text-violet-400" />
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
                        "rounded-xl p-4 text-sm",
                        "bg-rose-500/10 border border-rose-500/30",
                        "text-rose-300"
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
              <div className="border-t border-zinc-800/80 bg-zinc-900/80">
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