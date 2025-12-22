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
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-neutral-800 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[8.5/11] bg-neutral-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const config = {
    base: {
      gradient: 'from-neutral-200 to-neutral-400',
      border: 'border-neutral-700',
      bg: 'bg-neutral-800/50',
      text: 'text-neutral-300',
      icon: FileText,
      accent: {
        bg: 'neutral-800',
        hover: 'neutral-700'
      }
    },
    tailored: {
      gradient: 'from-blue-400 to-indigo-400',
      border: 'border-indigo-500/30',
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      icon: Sparkles,
      accent: {
        bg: 'indigo-500/20',
        hover: 'indigo-500/30'
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
              "border-2 border-dashed transition-all duration-200",
              "group/new-resume flex flex-col items-center justify-center gap-3",
              "border-neutral-700 hover:border-neutral-600",
              "bg-neutral-900",
              "hover:-translate-y-0.5",
              "w-full"
            )}>
              <div className={cn(
                "relative z-10 flex flex-col items-center",
                "transition-all duration-200"
              )}>
                <div className={cn(
                  "h-11 w-11 rounded-lg",
                  "flex items-center justify-center",
                  "bg-neutral-800",
                  "border border-neutral-700"
                )}>
                  <config.icon className="h-5 w-5 text-neutral-500" />
                </div>
                
                <span className="mt-3 text-sm font-medium text-neutral-400">
                  Limit Reached
                </span>
                
                <span className="mt-1 text-xs text-neutral-500">
                  {totalResumesCount}/{resumeLimit} resumes
                </span>
              </div>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-neutral-900 border-neutral-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Resume Limit Reached</AlertDialogTitle>
              <AlertDialogDescription className="text-neutral-400">
                You have reached the maximum limit of {resumeLimit} resumes ({totalResumesCount}/{resumeLimit} used). 
                Please delete an existing resume to create a new one.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white">
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
          "border-2 border-dashed transition-all duration-200",
          "group/new-resume flex flex-col items-center justify-center gap-3",
          type === 'base'
            ? "border-neutral-600 hover:border-neutral-500"
            : "border-indigo-500/40 hover:border-indigo-500/60",
          "bg-neutral-900",
          "hover:-translate-y-0.5",
          "w-full"
        )}>
          <div className={cn(
            "relative z-10 flex flex-col items-center",
            "transition-all duration-200",
            "group-hover/new-resume:scale-[1.02]"
          )}>
            <div className={cn(
              "h-11 w-11 rounded-lg",
              "flex items-center justify-center",
              "bg-neutral-800 group-hover/new-resume:bg-neutral-700",
              "border",
              type === 'base' ? "border-neutral-600" : "border-indigo-500/40",
              "transition-colors duration-200"
            )}>
              <config.icon className={cn(
                "h-5 w-5 transition-colors duration-200",
                type === 'base'
                  ? "text-neutral-400 group-hover/new-resume:text-white"
                  : "text-indigo-400 group-hover/new-resume:text-indigo-300"
              )} />
            </div>
            
            <span className={cn(
              "mt-3 text-sm font-medium transition-colors duration-200",
              type === 'base'
                ? "text-neutral-400 group-hover/new-resume:text-white"
                : "text-indigo-400 group-hover/new-resume:text-indigo-300"
            )}>
              Create {type === 'base' ? 'Base' : 'Tailored'} Resume
            </span>
            
            <span className={cn(
              "mt-1 text-xs transition-opacity duration-200 opacity-0 group-hover/new-resume:opacity-100",
              "text-neutral-500"
            )}>
              {totalResumesCount}/{resumeLimit} used
            </span>
          </div>
        </button>
      </CreateResumeDialog>
    );
  };

  const LimitReachedCard = () => (
    <div className="aspect-[8.5/11] rounded-xl relative overflow-hidden border-2 border-dashed border-neutral-700 bg-neutral-900 flex flex-col items-center justify-center gap-3">
      <div className="flex flex-col items-center">
        <div className="h-11 w-11 rounded-lg flex items-center justify-center bg-neutral-800 border border-neutral-700">
          <config.icon className="h-5 w-5 text-neutral-500" />
        </div>
        <span className="mt-3 text-sm font-medium text-neutral-400">
          {type === 'base' ? 'Base' : 'Tailored'} Limit Reached
        </span>
        <span className="mt-1 text-xs text-center px-4 text-neutral-500">
          Delete existing resumes to create more
        </span>
      </div>
    </div>
  );

  const ResumeCard = ({ resume }: { resume: OptimisticResume }) => {
    const isDeleting = deletingResumes.has(resume.id);
    const isCopying = copyingResumes.has(resume.originalId || resume.id);

    return (
      <div className={cn(
        "group relative transition-all duration-200",
        isDeleting && "opacity-50 pointer-events-none",
        resume.isOptimistic && "animate-in slide-in-from-top-1 duration-200"
      )}>
        <AlertDialog>
          <div className="relative">
            {resume.isOptimistic ? (
              <div className="cursor-wait relative">
                <MiniResumePreview
                  name={resume.name}
                  type={type}
                  target_role={resume.target_role}
                  createdAt={resume.created_at}
                  className="opacity-60 pointer-events-none"
                />
                <div className="absolute inset-0 bg-neutral-900/90 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
                    <span className="text-xs font-medium text-neutral-400">Copying...</span>
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
                  className="hover:-translate-y-0.5 transition-transform duration-200"
                />
              </Link>
            )}

            {!resume.isOptimistic && (
              <div className="absolute bottom-3 right-3 flex gap-2">
                <AlertDialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={isDeleting}
                    className={cn(
                      "h-8 w-8 rounded-lg",
                      "bg-neutral-800/90 hover:bg-red-500/20",
                      "text-red-400 hover:text-red-300",
                      "border border-neutral-700 hover:border-red-500/50",
                      "backdrop-blur-sm",
                      "transition-all duration-200",
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
                      "bg-neutral-800/90 hover:bg-neutral-700",
                      "text-neutral-300 hover:text-white",
                      "border border-neutral-700",
                      "backdrop-blur-sm",
                      "transition-all duration-200",
                      (isDeleting || isCopying) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isCopying ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Copy className="h-4 w-4" />
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
                          "bg-neutral-800/90 hover:bg-neutral-700",
                          "text-neutral-300 hover:text-white",
                          "border border-neutral-700",
                          "backdrop-blur-sm",
                          "transition-all duration-200"
                        )}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-neutral-900 border-neutral-800">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                          Resume Limit Reached
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-neutral-400">
                          You have reached the maximum limit of {resumeLimit} resumes ({totalResumesCount}/{resumeLimit} used). Please delete an existing resume to create a new one.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white">
                          Okay
                        </AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            )}
          </div>
          <AlertDialogContent className="bg-neutral-900 border-neutral-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Delete Resume</AlertDialogTitle>
              <AlertDialogDescription className="text-neutral-400">
                Are you sure you want to delete &quot;{resume.name}&quot;? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  startTransition(() => {
                    handleDeleteResume(resume.id, resume.name);
                  });
                }}
                className="bg-red-600 text-white hover:bg-red-700"
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
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className={cn(
            "text-lg sm:text-xl font-semibold tracking-tight",
            type === 'base' ? "text-white" : "text-white"
          )}>
            {type === 'base' ? 'Base Resumes' : 'Tailored Resumes'}
          </h2>
          <span className={cn(
            "px-2 py-0.5 rounded-md text-xs font-medium",
            type === 'base' 
              ? "bg-neutral-800 text-neutral-400" 
              : "bg-indigo-500/10 text-indigo-400"
          )}>
            {optimisticResumes.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ResumeSortControls 
            sortParam={sortParam}
            directionParam={directionParam}
            currentSort={currentSort}
            currentDirection={currentDirection}
          />
        </div>
      </div>

      {/* Pagination - Only show when needed */}
      {optimisticResumes.length > paginationState.itemsPerPage && (
        <div className="hidden md:flex w-full justify-end">
          <Pagination>
            <PaginationContent className="gap-1">
              <PaginationItem>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(paginationState.currentPage - 1)}
                  disabled={paginationState.currentPage === 1}
                  className="h-8 w-8 p-0 text-neutral-400 hover:text-white bg-neutral-800 border-neutral-700 disabled:opacity-50"
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
                          "h-8 w-8 p-0 bg-neutral-800 border-neutral-700",
                          "text-neutral-400 hover:text-white",
                          paginationState.currentPage === pageNumber && "bg-neutral-700 text-white font-medium"
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
                      <span className="text-neutral-500 px-2">...</span>
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
                  className="h-8 w-8 p-0 text-neutral-400 hover:text-white bg-neutral-800 border-neutral-700 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Resume Grid */}
      <div className="relative">
        {/* Mobile View - Carousel */}
        <div className="md:hidden space-y-4">
          <div className="w-full max-w-[280px] mx-auto">
            {canCreateMore ? <CreateResumeCard /> : <LimitReachedCard />}
          </div>

          {paginatedResumes.length > 0 && (
            <Carousel className="w-full">
              <CarouselContent className="-ml-2">
                {paginatedResumes.map((resume: OptimisticResume) => (
                  <CarouselItem key={resume.id} className="pl-2 basis-[75%] sm:basis-[60%]">
                    <ResumeCard resume={resume} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex -left-10 bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700 hover:text-white" />
              <CarouselNext className="hidden sm:flex -right-10 bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700 hover:text-white" />
            </Carousel>
          )}
        </div>

        {/* Desktop Grid View */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {canCreateMore ? <CreateResumeCard /> : <LimitReachedCard />}
          {paginatedResumes.map((resume: OptimisticResume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      </div>
    </div>
  );
}