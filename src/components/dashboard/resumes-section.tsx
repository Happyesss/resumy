'use client';

import { CreateResumeDialog } from '@/components/resume/management/dialogs/create-resume-dialog';
import { ResumeSortControls, type SortDirection, type SortOption } from '@/components/resume/management/resume-sort-controls';
import { MiniResumePreview } from '@/components/resume/shared/mini-resume-preview';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { RESUME_LIMIT } from '@/lib/constants';
import type { Profile, Resume } from '@/lib/types';
import { cn } from '@/lib/utils';
import { copyResume, deleteResume } from '@/utils/actions/resumes/actions';
import { ChevronLeft, ChevronRight, Copy, FileText, Loader2, Sparkles, Trash2 } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { toast } from 'sonner';

interface OptimisticResume extends Resume {
  isOptimistic?: boolean;
  originalId?: string;
}

type OptimisticAction = 
  | { type: 'ADD'; resume: OptimisticResume }
  | { type: 'REMOVE'; resumeId: string };

interface ResumesSectionProps {
  type: 'base' | 'tailored';
  resumes: Resume[];
  profile: Profile;
  sortParam: string;
  directionParam: string;
  currentSort: SortOption;
  currentDirection: SortDirection;
  baseResumes?: Resume[];
  canCreateMore?: boolean;
  totalResumesCount?: number;
  resumeLimit?: number;
}

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
}

export function ResumesSection({ 
  type,
  resumes,
  profile,
  sortParam,
  directionParam,
  currentSort,
  currentDirection,
  baseResumes = [],
  canCreateMore,
  totalResumesCount = 0,
  resumeLimit = RESUME_LIMIT
}: ResumesSectionProps) {
  const [optimisticResumes, dispatchOptimistic] = React.useOptimistic(
    resumes as OptimisticResume[],
    (state: OptimisticResume[], action: OptimisticAction) => {
      switch (action.type) {
        case 'ADD':
          return [action.resume, ...state];
        case 'REMOVE':
          return state.filter((resume: OptimisticResume) => resume.id !== action.resumeId);
        default:
          return state;
      }
    }
  );

  const [, startTransition] = React.useTransition();
  const [deletingResumes, setDeletingResumes] = React.useState<Set<string>>(new Set());
  const [copyingResumes, setCopyingResumes] = React.useState<Set<string>>(new Set());
  const [isMounted, setIsMounted] = React.useState(false);

  // Renamed to avoid any potential name collision
  const [paginationState, setPaginationState] = React.useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 7
  });

  // Ensure component is mounted before rendering hooks
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  const config = {
    base: {
      gradient: 'from-purple-400 to-indigo-500',
      border: 'border-purple-400/30',
      bg: 'bg-purple-400/10',
      text: 'text-purple-400',
      icon: FileText,
      accent: {
        bg: 'purple-400/20',
        hover: 'purple-400/30'
      }
    },
    tailored: {
      gradient: 'from-purple-400 to-blue-500',
      border: 'border-purple-400/30',
      bg: 'bg-blue-400/10',
      text: 'text-purple-400',
      icon: Sparkles,
      accent: {
        bg: 'blue-400/20',
        hover: 'blue-400/30'
      }
    }
  }[type];

  const handleDeleteResume = async (resumeId: string, resumeName: string) => {
    setDeletingResumes((prev: Set<string>) => new Set(prev).add(resumeId));
    
    // Only remove this specific resume ID from the UI - don't affect other resumes
    dispatchOptimistic({ type: 'REMOVE', resumeId });
    toast.loading(`Deleting "${resumeName}"...`, { id: resumeId });
    
    try {
      // Delete only this specific resume
      await deleteResume(resumeId);
      toast.success(`"${resumeName}" deleted successfully`, { id: resumeId });
    } catch (error) {
      console.error('Failed to delete resume:', error);
      toast.error(`Failed to delete "${resumeName}". Please try again.`, { id: resumeId });
    } finally {
      setDeletingResumes((prev: Set<string>) => {
        const newSet = new Set(prev);
        newSet.delete(resumeId);
        return newSet;
      });
    }
  };

  const handleCopyResume = async (sourceResume: OptimisticResume) => {
    setCopyingResumes((prev: Set<string>) => new Set(prev).add(sourceResume.id));
    
    const optimisticCopy: OptimisticResume = {
      ...sourceResume,
      id: `temp-${Date.now()}-${Math.random()}`,
      name: `${sourceResume.name} (Copy)`,
      isOptimistic: true,
      originalId: sourceResume.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    dispatchOptimistic({ type: 'ADD', resume: optimisticCopy });
    toast.loading(`Copying "${sourceResume.name}"...`, { id: `copy-${sourceResume.id}` });
    
    try {
      await copyResume(sourceResume.id);
      toast.success(`"${sourceResume.name}" copied successfully`, { id: `copy-${sourceResume.id}` });
    } catch (error) {
      console.error('Failed to copy resume:', error);
      toast.error(`Failed to copy "${sourceResume.name}". Please try again.`, { id: `copy-${sourceResume.id}` });
    } finally {
      setCopyingResumes((prev: Set<string>) => {
        const newSet = new Set(prev);
        newSet.delete(sourceResume.id);
        return newSet;
      });
    }
  };

  const startIndex = (paginationState.currentPage - 1) * paginationState.itemsPerPage;
  const endIndex = startIndex + paginationState.itemsPerPage;
  const paginatedResumes = optimisticResumes.slice(startIndex, endIndex);

  function handlePageChange(page: number) {
    setPaginationState((prev: PaginationState) => ({
      ...prev,
      currentPage: page
    }));
  }

  const CreateResumeCard = () => {
    // If limit reached, show alert dialog instead of create dialog
    if (!canCreateMore) {
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className={cn(
              "aspect-[8.5/11] rounded-xl",
              "relative overflow-hidden",
              "border-2 border-dashed transition-all duration-300",
              "group/new-resume flex flex-col items-center justify-center gap-4",
              "border-red-400/40 hover:border-red-400/70",
              "bg-gradient-to-br from-gray-900 to-gray-800",
              "hover:shadow-lg hover:shadow-red-400/10 hover:-translate-y-1",
              "w-full sm:w-auto"
            )}>
              <div className={cn(
                "relative z-10 flex flex-col items-center",
                "transform transition-all duration-300",
                "group-hover/new-resume:scale-105"
              )}>
                <div className={cn(
                  "h-12 w-12 rounded-xl",
                  "flex items-center justify-center",
                  "bg-gradient-to-br from-gray-800 to-gray-700",
                  "border border-red-400/30",
                  "shadow-sm group-hover/new-resume:shadow-md",
                  "group-hover/new-resume:scale-110"
                )}>
                  <config.icon className={cn(
                    "h-5 w-5 transition-all duration-300",
                    "text-red-400",
                    "group-hover/new-resume:scale-110"
                  )} />
                </div>
                
                <span className={cn(
                  "mt-4 text-sm font-medium",
                  "transition-all duration-300",
                  "text-red-400",
                  "group-hover/new-resume:font-semibold"
                )}>
                  Limit Reached
                </span>
                
                <span className={cn(
                  "mt-2 text-xs",
                  "transition-all duration-300 opacity-70",
                  "text-red-400/70",
                  "group-hover/new-resume:opacity-100"
                )}>
                  {totalResumesCount}/{resumeLimit} resumes
                </span>
              </div>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border-black">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Resume Limit Reached</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                You have reached the maximum limit of {resumeLimit} resumes ({totalResumesCount}/{resumeLimit} used). 
                Please delete an existing resume to create a new one.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">
                Okay
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }

    // Normal create resume dialog when limit not reached
    return (
      <CreateResumeDialog 
        type={type} 
        profile={profile}
        totalResumesCount={totalResumesCount}
        {...(type === 'tailored' && { baseResumes })}
      >
        <button className={cn(
          "aspect-[8.5/11] rounded-xl",
          "relative overflow-hidden",
          "border-2 border-dashed transition-all duration-300",
          "group/new-resume flex flex-col items-center justify-center gap-4",
          type === 'base'
            ? "border-gray-400 hover:border-gray-100"
            : "border-purple-400/40 hover:border-purple-400/70",
          "bg-gradient-to-br from-gray-900 to-gray-800",
          "hover:shadow-lg hover:shadow-purple-400/10 hover:-translate-y-1",
          "w-full sm:w-auto"
        )}>
          <div className={cn(
            "relative z-10 flex flex-col items-center",
            "transform transition-all duration-300",
            "group-hover/new-resume:scale-105"
          )}>
            <div className={cn(
              "h-12 w-12 rounded-xl",
              "flex items-center justify-center",
              "bg-gradient-to-br from-gray-800 to-gray-700",
              type === 'base'
                ? "border border-white"
                : "border border-purple-400/30",
              "shadow-sm group-hover/new-resume:shadow-md",
              "group-hover/new-resume:scale-110"
            )}>
              <config.icon className={cn(
                "h-5 w-5 transition-all duration-300",
                type === 'base'
                  ? "text-white"
                  : "text-purple-400",
                "group-hover/new-resume:scale-110"
              )} />
            </div>
            
            <span className={cn(
              "mt-4 text-sm font-medium",
              "transition-all duration-300",
              type === 'base'
                ? "text-white"
                : "text-purple-400",
              "group-hover/new-resume:font-semibold"
            )}>
              Create {type === 'base' ? 'Base' : 'Tailored'} Resume
            </span>
            
            <span className={cn(
              "mt-2 text-xs",
              "transition-all duration-300 opacity-0",
              type === 'base'
                ? "text-white/70"
                : "text-purple-400/70",
              "group-hover/new-resume:opacity-100"
            )}>
              {totalResumesCount}/{resumeLimit} used
            </span>
          </div>
        </button>
      </CreateResumeDialog>
    );
  };

  const LimitReachedCard = () => (
    <div className={cn(
      "group/limit",
      "transition-all duration-300",
    )}>
      <div className={cn(
        "aspect-[8.5/11] rounded-xl",
        "relative overflow-hidden",
        "border-2 border-dashed",
        "flex flex-col items-center justify-center gap-4",
        "border-purple-400/40",
        "bg-gradient-to-br from-gray-900 to-gray-800",
        "shadow-lg shadow-purple-400/10",
        "border-purple-400/70"
      )}>
        <div className={cn(
          "relative z-10 flex flex-col items-center",
          "transform transition-all duration-300"
        )}>
          <div className={cn(
            "h-12 w-12 rounded-xl",
            "flex items-center justify-center",
            "bg-gradient-to-br from-gray-800 to-gray-700",
            "border border-purple-400/30",
            "shadow-md"
          )}>
            <config.icon className={cn(
              "h-5 w-5 text-purple-400"
            )} />
          </div>
          <span className={cn(
            "mt-4 text-sm font-medium",
            "text-purple-400"
          )}>
            {type === 'base' ? 'Base' : 'Tailored'} Limit Reached
          </span>
          <span className={cn(
            "mt-2 text-xs text-center px-2",
            "text-purple-400/70"
          )}>
            Delete existing resumes to create more
          </span>
        </div>
      </div>
    </div>
  );

  const ResumeCard = ({ resume }: { resume: OptimisticResume }) => {
    const isDeleting = deletingResumes.has(resume.id);
    const isCopying = copyingResumes.has(resume.originalId || resume.id);

    return (
      <div className={cn(
        "group relative transition-all duration-300",
        isDeleting && "opacity-50 pointer-events-none",
        resume.isOptimistic && "animate-in slide-in-from-top-1 duration-300"
      )}>
        <AlertDialog>
          <div className="relative">
            {resume.isOptimistic ? (
              <div className={cn("cursor-wait relative")}>
                <MiniResumePreview
                  name={resume.name}
                  type={type}
                  target_role={resume.target_role}
                  createdAt={resume.created_at}
                  className={cn(
                    "transition-all duration-300 opacity-60",
                    "pointer-events-none"
                  )}
                />
                <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                    <span className="text-xs font-medium text-purple-400">Copying...</span>
                  </div>
                </div>
              </div>
            ) : (
              <Link href={`/resumes/${resume.id}`}>
                <MiniResumePreview
                  name={resume.name}
                  type={type}
                  target_role={resume.target_role}
                  createdAt={resume.created_at}
                  className="hover:-translate-y-1 transition-transform duration-300"
                />
              </Link>
            )}

            {!resume.isOptimistic && (
              <div className="absolute bottom-3 left-3 flex gap-2">
                <AlertDialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={isDeleting}
                    className={cn(
                      "h-8 w-8 rounded-lg",
                      "bg-gray-800 hover:bg-gray-700",
                      "text-rose-400 hover:text-rose-300",
                      "border border-gray-700",
                      "shadow-sm",
                      "transition-all duration-300",
                      "hover:scale-105 hover:shadow-md",
                      "hover:-translate-y-0.5",
                      isDeleting && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                
                {canCreateMore ? (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      startTransition(() => {
                        handleCopyResume(resume);
                      });
                    }}
                    disabled={isDeleting || isCopying}
                    className={cn(
                      "h-8 w-8 rounded-lg",
                      "bg-gray-800 hover:bg-gray-700",
                      "text-white hover:text-green-400",
                      "border border-gray-700",
                      "shadow-sm",
                      "transition-all duration-300",
                      "hover:scale-105 hover:shadow-md",
                      "hover:-translate-y-0.5",
                      (isDeleting || isCopying) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isCopying ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Copy className="h-4 w-4 text-white" />
                    )}
                  </Button>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={cn(
                          "h-8 w-8 rounded-lg",
                          "bg-gray-800 hover:bg-gray-700",
                          "text-white hover:text-green-400",
                          "border border-gray-700",
                          "shadow-sm",
                          "transition-all duration-300",
                          "hover:scale-105 hover:shadow-md",
                          "hover:-translate-y-0.5"
                        )}
                      >
                        <Copy className="h-4 w-4 text-white" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-black">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                          {canCreateMore ? "Create Resume" : "Resume Limit Reached"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          {canCreateMore 
                            ? `You can create more ${type} resumes. Currently using ${totalResumesCount}/${resumeLimit} total resumes.`
                            : `You have reached the maximum limit of ${resumeLimit} resumes (${totalResumesCount}/${resumeLimit} used). Please delete an existing resume to create a new one.`
                          }
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">
                          Cancel
                        </AlertDialogCancel>
                        {canCreateMore && (
                          <AlertDialogAction asChild>
                            <CreateResumeDialog 
                              type={type as 'base' | 'tailored'}
                              profile={profile}
                              totalResumesCount={totalResumesCount}
                              baseResumes={type === 'tailored' ? baseResumes : undefined}
                            >
                              <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700">
                                Create Resume
                              </Button>
                            </CreateResumeDialog>
                          </AlertDialogAction>
                        )}
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            )}
          </div>
          <AlertDialogContent className="border-black">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Delete Resume</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Are you sure you want to delete &quot;{resume.name}&quot;? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  startTransition(() => {
                    handleDeleteResume(resume.id, resume.name);
                  });
                }}
                className="bg-rose-600 text-white hover:bg-rose-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="flex flex-col gap-4 w-full">
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className={
            type === 'base'
              ? "text-2xl sm:text-3xl font-semibold tracking-tight text-gray-200"
              : `text-2xl sm:text-3xl font-semibold tracking-tight bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`
          }>
            {type === 'base' ? 'Base' : 'Tailored'} Resumes
          </h2>
          <div className="flex items-center gap-2 mb-4">
            <ResumeSortControls 
              sortParam={sortParam}
              directionParam={directionParam}
              currentSort={currentSort}
              currentDirection={currentDirection}
            />
          </div>
        </div>

        {optimisticResumes.length > paginationState.itemsPerPage && (
          <div className="hidden md:flex w-full items-start justify-start -mt-4">
            <Pagination className="flex justify-end">
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(paginationState.currentPage - 1)}
                    disabled={paginationState.currentPage === 1}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white bg-gray-800 border-gray-700"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </PaginationItem>
                
                {Array.from({ length: Math.ceil(optimisticResumes.length / paginationState.itemsPerPage) }).map((_, index) => {
                  const pageNumber = index + 1;
                  const totalPages = Math.ceil(optimisticResumes.length / paginationState.itemsPerPage);
                  
                  if (
                    pageNumber === 1 || 
                    pageNumber === totalPages || 
                    (pageNumber >= paginationState.currentPage - 1 && pageNumber <= paginationState.currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={index}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePageChange(pageNumber)}
                          className={cn(
                            "h-8 w-8 p-0 bg-gray-800 border-gray-700",
                            "text-gray-400 hover:text-white",
                            paginationState.currentPage === pageNumber && "font-medium text-purple-400"
                          )}
                        >
                          {pageNumber}
                        </Button>
                      </PaginationItem>
                    );
                  }

                  if (
                    pageNumber === 2 && paginationState.currentPage > 3 ||
                    pageNumber === totalPages - 1 && paginationState.currentPage < totalPages - 2
                  ) {
                    return (
                      <PaginationItem key={index}>
                        <span className="text-gray-500 px-2">...</span>
                      </PaginationItem>
                    );
                  }

                  return null;
                })}

                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(paginationState.currentPage + 1)}
                    disabled={paginationState.currentPage === Math.ceil(optimisticResumes.length / paginationState.itemsPerPage)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white bg-gray-800 border-gray-700"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <div className="relative pb-6">
        {/* Mobile View */}
        <div className="md:hidden w-full space-y-6">
          {canCreateMore ? (
            <div className="px-2 w-full flex">
              <CreateResumeCard />
            </div>
          ) : (
            <div className="px-4 w-full">
              <LimitReachedCard />
            </div>
          )}

          {paginatedResumes.length > 0 && (
            <div className="w-full">
              <Carousel className="w-full">
                <CarouselContent>
                  {paginatedResumes.map((resume: OptimisticResume) => (
                    <CarouselItem key={resume.id} className="basis-[85%] pl-4">
                      <ResumeCard resume={resume} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden sm:block">
                  <CarouselPrevious className="absolute -left-12 top-1/2 bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white" />
                  <CarouselNext className="absolute -right-12 top-1/2 bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white" />
                </div>
              </Carousel>
            </div>
          )}
        </div>

        {/* Desktop Grid View */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {canCreateMore ? (
            <CreateResumeCard />
          ) : (
            <LimitReachedCard />
          )}

          {paginatedResumes.map((resume: OptimisticResume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
          {optimisticResumes.length === 0 && optimisticResumes.length + 1 < 4 && (
            <div className="col-span-2 md:col-span-1" />
          )}
        </div>
      </div>
    </div>
  );
}