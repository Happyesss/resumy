'use client';

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Education, Profile, Project, WorkExperience } from "@/lib/types";

import { Briefcase, FolderGit2, GraduationCap, KeyRound, Lock, PanelLeft, Save, Trash2, Upload, User, Wrench } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { ProfileBasicInfoForm } from "@/components/profile/profile-basic-info-form";
import { ProfileEducationForm } from "@/components/profile/profile-education-form";
import { ProfileProjectsForm } from "@/components/profile/profile-projects-form";
import { ProfileSkillsForm } from "@/components/profile/profile-skills-form";
import { ProfileWorkExperienceForm } from "@/components/profile/profile-work-experience-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
// import { ProfileEditorHeader } from "./profile-editor-header";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatProfileWithAI } from "../../utils/actions/profiles/ai";

import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";
import { getStoredApiKeys, getStoredDefaultModel } from "@/lib/ai-key-storage";
import { importResume, updateProfile } from "@/utils/actions/profiles/actions";
import { AlertTriangle } from "lucide-react";
import pdfToText from "react-pdftotext";
import { AiApiKeysForm } from "@/components/profile/ai-api-keys-form";

interface ProfileEditFormProps {
  profile: Profile;
}

// Tab order for navigation
const PROFILE_TABS = ["basic", "experience", "projects", "education", "skills", "api-keys", "security"];

export function ProfileEditForm({ profile: initialProfile }: ProfileEditFormProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false);
  const [resumeContent, setResumeContent] = useState("");
  const [isProcessingResume, setIsProcessingResume] = useState(false);
  const [apiKeyError, setApiKeyError] = useState("");
  const [isResumeDragging, setIsResumeDragging] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const desktopTabListRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();

  // Helpers for navigation
  const currentTabIdx = PROFILE_TABS.indexOf(activeTab);
  const isFirstTab = currentTabIdx === 0;
  const isLastTab = currentTabIdx === PROFILE_TABS.length - 1;
  const goToPrev = () => {
    if (!isFirstTab) setActiveTab(PROFILE_TABS[currentTabIdx - 1]);
  };
  const goToNext = () => {
    if (!isLastTab) setActiveTab(PROFILE_TABS[currentTabIdx + 1]);
  };
  const router = useRouter();

  useEffect(() => {
    const queryTab = searchParams.get("tab");
    if (queryTab && PROFILE_TABS.includes(queryTab)) {
      setActiveTab(queryTab);
    }
  }, [searchParams]);

  // Sync with server state when initialProfile changes
  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  // Add useEffect to clear error when dialogs close
  useEffect(() => {
    if (!isResumeDialogOpen) {
      setApiKeyError("");
      setResumeContent(""); // Clear content when dialog closes
    }
  }, [isResumeDialogOpen]);

  useEffect(() => {
    // Avoid loading the desktop sidebar at an offset scroll position.
    desktopTabListRef.current?.scrollTo({ top: 0 });
  }, []);

  const updateField = (field: keyof Profile, value: unknown) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await updateProfile(profile);
      toast.success("Changes saved successfully", {
        position: "bottom-right",
        className: "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-none",
      });
      // Force a server revalidation
      router.refresh();
    } catch (error) {
      void error;
      toast.error("Unable to save your changes. Please try again.", {
        position: "bottom-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsResetting(true);
      // Reset to empty profile locally
      const resetProfile = {
        id: profile.id,
        user_id: profile.user_id,
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        location: '',
        website: '',
        linkedin_url: '',
        github_url: '',
        work_experience: [],
        education: [],
        skills: [],
        projects: [],
        created_at: profile.created_at,
        updated_at: profile.updated_at
      };
      
      // Update local state
      setProfile(resetProfile);
      
      // Save to database
      await updateProfile(resetProfile);
      
      toast.success("Profile reset successfully", {
        position: "bottom-right",
        className: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-none",
      });
      
      // Force a server revalidation
      router.refresh();
    } catch (error: unknown) {
      toast.error("Failed to reset profile. Please try again.", {
        position: "bottom-right",
      });
      console.error(error);
    } finally {
      setIsResetting(false);
    }
  };

  const _handleLinkedInImport = () => {
    toast.info("LinkedIn import feature coming soon!", {
      position: "bottom-right",
      className: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-none",
    });
  };

  const handleResumeUpload = async (content: string) => {
    try {
      setIsProcessingResume(true);
      
      // Get model and API key from local storage
      const selectedModel = getStoredDefaultModel();
      const apiKeys = getStoredApiKeys();
      
      try {
        const result = await formatProfileWithAI(content, {
          model: selectedModel,
          apiKeys
        });
        
        if (result) {
        // Clean and transform the data to match our database schema
        const cleanedProfile: Partial<Profile> = {
          first_name: (result.first_name as string) || null,
          last_name: (result.last_name as string) || null,
          email: (result.email as string) || null,
          phone_number: (result.phone_number as string) || null,
          location: (result.location as string) || null,
          website: (result.website as string) || null,
          linkedin_url: (result.linkedin_url as string) || null,
          github_url: (result.github_url as string) || null,
          work_experience: Array.isArray(result.work_experience) 
            ? (result.work_experience as Partial<WorkExperience>[]).map((exp: Partial<WorkExperience>) => ({
                company: exp.company || '',
                position: exp.position || '',
                location: exp.location || '',
                date: exp.date || '',
                description: Array.isArray(exp.description) 
                  ? exp.description 
                  : [exp.description || ''],
                technologies: Array.isArray(exp.technologies) 
                  ? exp.technologies 
                  : []
              }))
            : [],
          education: Array.isArray(result.education)
            ? (result.education as Partial<Education & { description?: string[] }>[]).map((edu: Partial<Education & { description?: string[] }>) => ({
                school: edu.school || '',
                degree: edu.degree || '',
                field: edu.field || '',
                location: edu.location || '',
                date: edu.date || '',
                gpa: edu.gpa ? parseFloat(edu.gpa.toString()) : undefined,
                achievements: Array.isArray(edu.achievements) 
                  ? edu.achievements 
                  : Array.isArray(edu.description)
                    ? edu.description
                    : []
              }))
            : [],
          skills: Array.isArray(result.skills)
            ? (result.skills as { category: string; skills?: string[]; items?: string[] }[]).map((skill: { category: string; skills?: string[]; items?: string[] }) => ({
                category: skill.category || '',
                items: Array.isArray(skill.skills) 
                  ? skill.skills 
                  : Array.isArray(skill.items) 
                    ? skill.items 
                    : []
              }))
            : [],
          projects: Array.isArray(result.projects)
            ? (result.projects as Partial<Project>[]).map((proj: Partial<Project>) => ({
                name: proj.name || '',
                description: Array.isArray(proj.description) 
                  ? proj.description 
                  : [proj.description || ''],
                technologies: Array.isArray(proj.technologies) 
                  ? proj.technologies 
                  : [],
                url: proj.url || undefined,
                github_url: proj.github_url || undefined,
                date: proj.date || ''
              }))
            : []
        };
        
        await importResume(cleanedProfile);
        
        setProfile(prev => {
          const newProfile = {
            ...prev,
            ...cleanedProfile,
            // Properly merge arrays instead of replacing them
            work_experience: [
              ...(prev.work_experience || []),
              ...(cleanedProfile.work_experience || [])
            ],
            education: [
              ...(prev.education || []),
              ...(cleanedProfile.education || [])
            ],
            skills: [
              ...(prev.skills || []),
              ...(cleanedProfile.skills || [])
            ],
            projects: [
              ...(prev.projects || []),
              ...(cleanedProfile.projects || [])
            ]
          };
          return newProfile;
        });
        toast.success("Content imported successfully - Don't forget to save your changes", {
          position: "bottom-right",
          className: "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-none",
        });
        setIsResumeDialogOpen(false);
        setResumeContent("");
        }
      } catch (aiError) {
        console.error('AI processing error:', aiError);
        throw aiError; // Re-throw to be caught by outer catch
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Resume upload error:', error);
        if (error.message.toLowerCase().includes('api key')) {
          setApiKeyError(
            'API key required to continue.'
          );
        } else {
          toast.error("Failed to process content: " + error.message, {
            position: "bottom-right",
          });
        }
      }
    } finally {
      setIsProcessingResume(false);
    }
  };

  // Add drag event handlers
  const handleDrag = (e: React.DragEvent, isDraggingState: React.Dispatch<React.SetStateAction<boolean>>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      isDraggingState(true);
    } else if (e.type === "dragleave") {
      isDraggingState(false);
    }
  };

  const handleDrop = async (e: React.DragEvent, setContent: React.Dispatch<React.SetStateAction<string>>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResumeDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === "application/pdf");

    if (pdfFile) {
      try {
        const text = await pdfToText(pdfFile);
        setContent(prev => prev + (prev ? "\n\n" : "") + text);
      } catch (error) {
        console.error("PDF processing error:", error);
        toast.error("Failed to extract text from the PDF. Please try again or paste the content manually.", {
          position: "bottom-right",
        });
      }
    } else {
      toast.error("Please drop a PDF file.", {
        position: "bottom-right",
      });
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>, setContent: React.Dispatch<React.SetStateAction<string>>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      try {
        const text = await pdfToText(file);
        setContent(prev => prev + (prev ? "\n\n" : "") + text);
      } catch (error) {
        console.error("PDF processing error:", error);
        toast.error("Failed to extract text from the PDF. Please try again or paste the content manually.", {
          position: "bottom-right",
        });
      }
    }
  };

  // Update onClick handler for both API Key buttons
  const handleApiKeyClick = () => {
    setIsResumeDialogOpen(false);
    setActiveTab("api-keys");
    toast.info("Add your API key in AI Keys under Profile settings.");
  };

  return (
    <div className="relative mx-auto">
      {/* Main content container with consistent styling */}
      <div className="relative px-4 sm:px-6 md:px-8 lg:px-10 pb-10">
        {/* Mobile Navigation Toggle Button */}
        <div className="md:hidden sticky top-16 z-30 flex justify-between items-center bg-zinc-950/95 backdrop-blur-md py-3 px-4 border-b border-zinc-800 mb-4 -mx-4 sm:-mx-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsNavOpen(true)}
            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
          >
            <PanelLeft className="h-5 w-5" />
            <span>Menu</span>
          </Button>
          <span className="text-sm font-medium text-zinc-300">Profile Settings</span>
        </div>

        {/* Tabs layout with vertical navbar and content side by side */}
        <div className="relative">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
            <div className="flex flex-col md:flex-row gap-6 h-full min-h-[600px]">
              {/* Left Navbar - Desktop view */}
              <div className="hidden md:flex min-w-[220px] w-[240px] lg:w-[260px] shrink-0 flex-col sticky top-20 self-start h-[calc(100dvh-6rem)] min-h-0 overflow-hidden">
                {/* Import Options at the top */}
                <div className="bg-zinc-900/80 rounded-xl border border-zinc-800 mt-4 mb-6 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Quick Import</span>
                  </div>
                  <Dialog open={isResumeDialogOpen} onOpenChange={setIsResumeDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 bg-zinc-800/50 text-zinc-300 border-zinc-700 
                          hover:bg-zinc-800 hover:border-zinc-600 hover:text-white
                          py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Resume
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[520px] bg-zinc-950 border-zinc-800 shadow-2xl">
                      <DialogHeader className="pb-4 border-b border-zinc-800">
                        <DialogTitle className="text-lg font-semibold text-zinc-100">
                          Import Resume Content
                        </DialogTitle>
                        <DialogDescription asChild>
                          <div className="space-y-3 text-sm text-zinc-400 mt-2">
                            <p className="text-zinc-300">Let AI analyze and enhance your profile automatically.</p>
                            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                <span className="text-emerald-400 font-medium text-xs">Smart Integration</span>
                              </div>
                              <p className="text-zinc-400 text-xs leading-relaxed">
                                Your existing profile information will be preserved. New entries will be intelligently added 
                                alongside your current data.
                              </p>
                            </div>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-4">
                          <label
                            onDragEnter={(e) => handleDrag(e, setIsResumeDragging)}
                            onDragLeave={(e) => handleDrag(e, setIsResumeDragging)}
                            onDragOver={(e) => handleDrag(e, setIsResumeDragging)}
                            onDrop={(e) => handleDrop(e, setResumeContent)}
                            className={cn(
                              "border border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-3 transition-all duration-200 cursor-pointer",
                              isResumeDragging
                                ? "border-emerald-500 bg-emerald-500/5"
                                : "border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900/50"
                            )}
                          >
                            <input
                              type="file"
                              className="hidden"
                              accept="application/pdf"
                              onChange={(e) => handleFileInput(e, setResumeContent)}
                            />
                            <div className="p-3 rounded-full bg-zinc-800">
                              <Upload className="w-5 h-5 text-zinc-400" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium text-zinc-300">
                                Drop PDF here or click to browse
                              </p>
                              <p className="text-xs text-zinc-500 mt-1">PDF files only</p>
                            </div>
                          </label>
                          <div className="relative">
                            <Label className="text-xs font-medium text-zinc-500 mb-2 block">
                              Or paste text content
                            </Label>
                            <Textarea
                              value={resumeContent}
                              onChange={(e) => setResumeContent(e.target.value)}
                              placeholder="Paste your resume content here..."
                              className={cn(
                                "min-h-[100px] bg-zinc-900 border-zinc-800 rounded-lg",
                                "focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 focus:bg-zinc-900",
                                "hover:border-zinc-700 hover:bg-zinc-900",
                                "text-zinc-100 placeholder:text-zinc-600 text-sm",
                                "transition-colors resize-none"
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      {apiKeyError && (
                        <div className="px-3 py-2.5 bg-red-950/50 border border-red-900/50 rounded-lg flex items-start gap-2.5">
                          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-medium text-red-300 text-sm">API Key Required</p>
                            <p className="text-red-400/80 text-xs mt-0.5">{apiKeyError}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 text-red-400 border-red-800/50 hover:bg-red-900/30 bg-transparent text-xs h-7"
                              onClick={() => handleApiKeyClick()}
                            >
                              Set API Keys
                            </Button>
                          </div>
                        </div>
                      )}
                      <DialogFooter className="gap-2 pt-4 border-t border-zinc-800">
                        <Button
                          variant="outline"
                          onClick={() => setIsResumeDialogOpen(false)}
                          className="border-zinc-700 bg-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleResumeUpload(resumeContent)}
                          disabled={isProcessingResume || !resumeContent.trim()}
                          className={cn(
                            "bg-emerald-600 text-white hover:bg-emerald-700",
                            "disabled:bg-zinc-800 disabled:text-zinc-500",
                            "transition-colors"
                          )}
                        >
                          {isProcessingResume ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Processing...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              <span>Process with AI</span>
                            </div>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Tab List */}
                <div className="flex-1 min-h-0 overflow-hidden">
                <TabsList ref={desktopTabListRef} className="flex flex-col justify-start items-stretch w-full h-full bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-y-auto overscroll-contain p-0 pr-1">
                  <TabsTrigger 
                    value="basic" 
                    className="w-full group flex items-center gap-3 px-4 py-3.5 text-left justify-start transition-all duration-200
                      data-[state=active]:bg-zinc-800 data-[state=active]:text-white
                      data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-200 data-[state=inactive]:hover:bg-zinc-800/50"
                  >
                    <div className="p-1.5 rounded-md bg-zinc-800 group-data-[state=active]:bg-emerald-500/20">
                      <User className="h-4 w-4 text-zinc-400 group-data-[state=active]:text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium">Basic Info</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="experience" 
                    className="w-full group flex items-center gap-3 px-4 py-3.5 text-left justify-start transition-all duration-200
                      data-[state=active]:bg-zinc-800 data-[state=active]:text-white
                      data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-200 data-[state=inactive]:hover:bg-zinc-800/50"
                  >
                    <div className="p-1.5 rounded-md bg-zinc-800 group-data-[state=active]:bg-emerald-500/20">
                      <Briefcase className="h-4 w-4 text-zinc-400 group-data-[state=active]:text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium">Work Experience</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="projects" 
                    className="w-full group flex items-center gap-3 px-4 py-3.5 text-left justify-start transition-all duration-200
                      data-[state=active]:bg-zinc-800 data-[state=active]:text-white
                      data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-200 data-[state=inactive]:hover:bg-zinc-800/50"
                  >
                    <div className="p-1.5 rounded-md bg-zinc-800 group-data-[state=active]:bg-emerald-500/20">
                      <FolderGit2 className="h-4 w-4 text-zinc-400 group-data-[state=active]:text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium">Projects</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="education" 
                    className="w-full group flex items-center gap-3 px-4 py-3.5 text-left justify-start transition-all duration-200
                      data-[state=active]:bg-zinc-800 data-[state=active]:text-white
                      data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-200 data-[state=inactive]:hover:bg-zinc-800/50"
                  >
                    <div className="p-1.5 rounded-md bg-zinc-800 group-data-[state=active]:bg-emerald-500/20">
                      <GraduationCap className="h-4 w-4 text-zinc-400 group-data-[state=active]:text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium">Education</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="skills" 
                    className="w-full group flex items-center gap-3 px-4 py-3.5 text-left justify-start transition-all duration-200
                      data-[state=active]:bg-zinc-800 data-[state=active]:text-white
                      data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-200 data-[state=inactive]:hover:bg-zinc-800/50"
                  >
                    <div className="p-1.5 rounded-md bg-zinc-800 group-data-[state=active]:bg-emerald-500/20">
                      <Wrench className="h-4 w-4 text-zinc-400 group-data-[state=active]:text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium">Skills</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="api-keys" 
                    className="w-full group flex items-center gap-3 px-4 py-3.5 text-left justify-start transition-all duration-200
                      data-[state=active]:bg-zinc-800 data-[state=active]:text-white
                      data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-200 data-[state=inactive]:hover:bg-zinc-800/50"
                  >
                    <div className="p-1.5 rounded-md bg-zinc-800 group-data-[state=active]:bg-emerald-500/20">
                      <KeyRound className="h-4 w-4 text-zinc-400 group-data-[state=active]:text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium">AI Keys</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="w-full group flex items-center gap-3 px-4 py-3.5 text-left justify-start transition-all duration-200
                      data-[state=active]:bg-zinc-800 data-[state=active]:text-white
                      data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-200 data-[state=inactive]:hover:bg-zinc-800/50"
                  >
                    <div className="p-1.5 rounded-md bg-zinc-800 group-data-[state=active]:bg-amber-500/20">
                      <Lock className="h-4 w-4 text-zinc-400 group-data-[state=active]:text-amber-400" />
                    </div>
                    <span className="text-sm font-medium">Security</span>
                  </TabsTrigger>
                </TabsList>
                </div>

                {/* Save and Reset buttons */}
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-zinc-800/80">
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 text-white font-medium rounded-lg 
                      hover:bg-emerald-700 transition-colors h-10 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="h-4 w-4 animate-spin" />Saving...</>
                    ) : (
                      <><Save className="h-4 w-4" />Save Changes</>
                    )}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full border-zinc-700 text-zinc-400 font-medium rounded-lg 
                          hover:bg-zinc-900 hover:text-zinc-300 hover:border-zinc-600 
                          transition-colors h-10 flex items-center justify-center gap-2"
                        disabled={isResetting}
                      >
                        {isResetting ? (
                          <><Loader2 className="h-4 w-4 animate-spin" />Resetting...</>
                        ) : (
                          <><Trash2 className="h-4 w-4" />Reset Profile</>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-zinc-950 border-zinc-800">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-zinc-100">Reset Profile</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                          Are you sure you want to reset your profile? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isResetting} className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-900">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleReset}
                          disabled={isResetting}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          {isResetting ? "Resetting..." : "Reset Profile"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  {/* Logout Button */}
                  <LogoutButton 
                    className="w-full border-zinc-700 text-zinc-400 font-medium rounded-lg 
                      hover:bg-zinc-900 hover:text-zinc-300 hover:border-zinc-600 
                      transition-colors h-10 flex items-center justify-center gap-2 bg-transparent"
                  />
                </div>
              </div>
              {/* Content area on the right */}
              <div className="flex-1 relative w-full min-w-0">
                <div className="space-y-6">
                  <TabsContent value="basic" className="mt-0 animate-in fade-in-50 duration-200">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                      <h2 className="text-base font-semibold text-zinc-100 mb-6">Personal Information</h2>
                        <ProfileBasicInfoForm
                          profile={profile}
                          onChange={(field, value) => {
                            if (field in profile && field !== 'email') {
                              updateField(field as keyof Profile, value);
                            }
                          }}
                        />
                    </div>
                  </TabsContent>

                  <TabsContent value="experience" className="mt-0 animate-in fade-in-50 duration-200">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                      <h2 className="text-base font-semibold text-zinc-100 mb-6">Work Experience</h2>
                        <ProfileWorkExperienceForm
                          experiences={profile.work_experience}
                          onChange={(experiences) => updateField('work_experience', experiences)}
                        />
                    </div>
                  </TabsContent>

                  <TabsContent value="projects" className="mt-0 animate-in fade-in-50 duration-200">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                      <h2 className="text-base font-semibold text-zinc-100 mb-6">Projects</h2>
                        <ProfileProjectsForm
                          projects={profile.projects}
                          onChange={(projects) => updateField('projects', projects)}
                        />
                    </div>
                  </TabsContent>

                  <TabsContent value="education" className="mt-0 animate-in fade-in-50 duration-200">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                      <h2 className="text-base font-semibold text-zinc-100 mb-6">Education</h2>
                        <ProfileEducationForm
                          education={profile.education}
                          onChange={(education) => updateField('education', education)}
                        />
                    </div>
                  </TabsContent>

                  <TabsContent value="skills" className="mt-0 animate-in fade-in-50 duration-200">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                      <h2 className="text-base font-semibold text-zinc-100 mb-6">Skills</h2>
                        <ProfileSkillsForm
                          skills={profile.skills}
                          onChange={(skills) => updateField('skills', skills)}
                        />
                    </div>
                  </TabsContent>

                  <TabsContent value="api-keys" className="mt-0 animate-in fade-in-50 duration-200">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                      <h2 className="text-base font-semibold text-zinc-100 mb-6">AI Keys & Model Settings</h2>
                      <AiApiKeysForm />
                    </div>
                  </TabsContent>

                  <TabsContent value="security" className="mt-0 animate-in fade-in-50 duration-200">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                      <h2 className="text-base font-semibold text-zinc-100 mb-6">Security Settings</h2>
                      <ChangePasswordForm />
                    </div>
                  </TabsContent>

                </div>
              </div>
            </div>
            {/* Mobile Nav Buttons OUTSIDE the card */}
            <div className="flex md:hidden justify-between gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={goToPrev} 
                disabled={isFirstTab} 
                className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 disabled:opacity-40"
              >
                Previous
              </Button>
              {isLastTab ? (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting} 
                  className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              ) : (
                <Button 
                  onClick={goToNext} 
                  disabled={isLastTab} 
                  className="flex-1 bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                >
                  Next
                </Button>
              )}
            </div>
          </Tabs>
        </div>
      </div>

      {/* Mobile Navigation Slide-out */}
      <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
        <SheetContent side="left" className="w-[280px] sm:w-[320px] bg-zinc-950 border-r border-zinc-800 p-0 overflow-y-auto">
          <SheetHeader className="sr-only">
            <SheetTitle>Profile Navigation</SheetTitle>
            <SheetDescription>Navigate between different sections of your profile</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col h-full min-h-0">
            {/* Import Options - Mobile */}
            <div className="border-b border-zinc-800 px-4 py-4 mt-12">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Quick Import</span>
              </div>
              
              <Button
                variant="outline"
                onClick={() => {
                  setIsResumeDialogOpen(true);
                  setIsNavOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-zinc-300 border-zinc-800 
                  hover:bg-zinc-800 hover:text-zinc-100 py-2.5 text-sm font-medium rounded-lg transition-colors"
              >
                <Upload className="h-4 w-4" />
                Upload Resume
              </Button>
            </div>

            {/* Mobile Tab Navigation */}
            <div className="flex-1 overflow-y-auto py-2 min-h-0">
              <Tabs value={activeTab} onValueChange={(value) => {
                setActiveTab(value);
                setIsNavOpen(false);
              }} className="w-full h-full">
                <TabsList className="flex flex-col justify-start items-stretch w-full h-auto bg-transparent border-none p-0">
                <TabsTrigger 
                  value="basic" 
                  className="w-full group flex items-center gap-3 px-4 py-3.5 text-left justify-start transition-all duration-200
                    data-[state=active]:bg-zinc-800 data-[state=active]:text-white
                    data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-200 data-[state=inactive]:hover:bg-zinc-800/50"
                >
                  <div className="p-1.5 rounded-md bg-zinc-800 group-data-[state=active]:bg-emerald-500/20">
                    <User className="h-4 w-4 text-zinc-400 group-data-[state=active]:text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium">Basic Info</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="experience" 
                  className="w-full group flex items-center gap-3 px-4 py-3.5 text-left justify-start transition-all duration-200
                    data-[state=active]:bg-zinc-800 data-[state=active]:text-white
                    data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-200 data-[state=inactive]:hover:bg-zinc-800/50"
                >
                  <div className="p-1.5 rounded-md bg-zinc-800 group-data-[state=active]:bg-emerald-500/20">
                    <Briefcase className="h-4 w-4 text-zinc-400 group-data-[state=active]:text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium">Work Experience</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="projects" 
                  className="w-full group flex items-center gap-3 px-4 py-3.5 text-left justify-start transition-all duration-200
                    data-[state=active]:bg-zinc-800 data-[state=active]:text-white
                    data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-200 data-[state=inactive]:hover:bg-zinc-800/50"
                >
                  <div className="p-1.5 rounded-md bg-zinc-800 group-data-[state=active]:bg-emerald-500/20">
                    <FolderGit2 className="h-4 w-4 text-zinc-400 group-data-[state=active]:text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium">Projects</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="education" 
                  className="w-full group flex items-center gap-3 px-4 py-3.5 text-left justify-start transition-all duration-200
                    data-[state=active]:bg-zinc-800 data-[state=active]:text-white
                    data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-200 data-[state=inactive]:hover:bg-zinc-800/50"
                >
                  <div className="p-1.5 rounded-md bg-zinc-800 group-data-[state=active]:bg-emerald-500/20">
                    <GraduationCap className="h-4 w-4 text-zinc-400 group-data-[state=active]:text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium">Education</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="skills" 
                  className="w-full group flex items-center gap-3 px-4 py-3.5 text-left justify-start transition-all duration-200
                    data-[state=active]:bg-zinc-800 data-[state=active]:text-white
                    data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-200 data-[state=inactive]:hover:bg-zinc-800/50"
                >
                  <div className="p-1.5 rounded-md bg-zinc-800 group-data-[state=active]:bg-emerald-500/20">
                    <Wrench className="h-4 w-4 text-zinc-400 group-data-[state=active]:text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium">Skills</span>
                </TabsTrigger>

                <TabsTrigger 
                  value="api-keys" 
                  className="w-full group flex items-center gap-3 px-4 py-3.5 text-left justify-start transition-all duration-200
                    data-[state=active]:bg-zinc-800 data-[state=active]:text-white
                    data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-200 data-[state=inactive]:hover:bg-zinc-800/50"
                >
                  <div className="p-1.5 rounded-md bg-zinc-800 group-data-[state=active]:bg-emerald-500/20">
                    <KeyRound className="h-4 w-4 text-zinc-400 group-data-[state=active]:text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium">AI Keys</span>
                </TabsTrigger>

                <TabsTrigger 
                  value="security" 
                  className="w-full group flex items-center gap-3 px-4 py-3.5 text-left justify-start transition-all duration-200
                    data-[state=active]:bg-zinc-800 data-[state=active]:text-white
                    data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-200 data-[state=inactive]:hover:bg-zinc-800/50"
                >
                  <div className="p-1.5 rounded-md bg-zinc-800 group-data-[state=active]:bg-amber-500/20">
                    <Lock className="h-4 w-4 text-zinc-400 group-data-[state=active]:text-amber-400" />
                  </div>
                  <span className="text-sm font-medium">Security</span>
                </TabsTrigger>
              </TabsList>
              </Tabs>
            </div>
            {/* Mobile Save/Reset Buttons */}
            <div className="flex flex-col gap-2 p-4 border-t border-zinc-800">
              <Button 
                onClick={() => {
                  handleSubmit();
                  setIsNavOpen(false);
                }}
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white font-medium rounded-lg 
                  hover:bg-emerald-700 transition-colors h-10 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Saving...</>
                ) : (
                  <><Save className="h-4 w-4" />Save Changes</>
                )}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full border-zinc-700 text-zinc-400 font-medium rounded-lg 
                      hover:bg-zinc-900 hover:text-zinc-300 transition-colors h-10 flex items-center justify-center gap-2"
                    disabled={isResetting}
                  >
                    {isResetting ? (
                      <><Loader2 className="h-4 w-4 animate-spin" />Resetting...</>
                    ) : (
                      <><Trash2 className="h-4 w-4" />Reset Profile</>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-zinc-950 border-zinc-800">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-zinc-100">Reset Profile</AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-400">
                      This will reset your entire profile and remove all your information. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isResetting} className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-900">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleReset}
                      disabled={isResetting}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      {isResetting ? (
                        <><Loader2 className="h-4 w-4 animate-spin mr-2" />Resetting...</>
                      ) : (
                        "Reset Profile"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              {/* Logout Button */}
              <LogoutButton 
                className="w-full border-zinc-700 text-zinc-400 font-medium rounded-lg 
                  hover:bg-zinc-900 hover:text-zinc-300 hover:border-zinc-600 
                  transition-colors h-10 flex items-center justify-center gap-2 bg-transparent"
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}