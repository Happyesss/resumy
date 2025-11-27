'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Education, Profile, Project, WorkExperience } from "@/lib/types";

import { Briefcase, FolderGit2, GraduationCap, Lock, PanelLeft, Save, Trash2, Upload, User, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";
import { importResume, updateProfile } from "@/utils/actions/profiles/actions";
import { AlertTriangle } from "lucide-react";
import pdfToText from "react-pdftotext";

interface ProfileEditFormProps {
  profile: Profile;
}

// Tab order for navigation
const PROFILE_TABS = ["basic", "experience", "projects", "education", "skills", "security"];

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

  const handleLinkedInImport = () => {
    toast.info("LinkedIn import feature coming soon!", {
      position: "bottom-right",
      className: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-none",
    });
  };

  const handleResumeUpload = async (content: string) => {
    try {
      setIsProcessingResume(true);
      
      // Get model and API key from local storage
      const MODEL_STORAGE_KEY = 'resumy-default-model';
      const LOCAL_STORAGE_KEY = 'resumy-api-keys';
      
      const selectedModel = 'gemini-2.5-flash-lite'; // Use same model as resume editor
      const storedKeys = localStorage.getItem(LOCAL_STORAGE_KEY);
      let apiKeys = [];
      
      try {
        apiKeys = storedKeys ? JSON.parse(storedKeys) : [];
      } catch (error) {
        console.error('Error parsing API keys:', error);
      }
      
      try {
        const result = await formatProfileWithAI(content, {
          model: selectedModel,
          apiKeys
        });
        
        if (result) {
        // Clean and transform the data to match our database schema
        const cleanedProfile: Partial<Profile> = {
          first_name: result.first_name || null,
          last_name: result.last_name || null,
          email: result.email || null,
          phone_number: result.phone_number || null,
          location: result.location || null,
          website: result.website || null,
          linkedin_url: result.linkedin_url || null,
          github_url: result.github_url || null,
          work_experience: Array.isArray(result.work_experience) 
            ? result.work_experience.map((exp: Partial<WorkExperience>) => ({
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
            ? result.education.map((edu: Partial<Education & { description?: string[] }>) => ({
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
            ? result.skills.map((skill: { category: string; skills?: string[]; items?: string[] }) => ({
                category: skill.category || '',
                items: Array.isArray(skill.skills) 
                  ? skill.skills 
                  : Array.isArray(skill.items) 
                    ? skill.items 
                    : []
              }))
            : [],
          projects: Array.isArray(result.projects)
            ? result.projects.map((proj: Partial<Project>) => ({
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
    toast.info("API key management is currently unavailable");
  };

  return (
    <div className="relative mx-auto">
      {/* Main content container with consistent styling */}
      <div className="relative px-4 sm:px-6 md:px-8 lg:px-10 pb-10">
        {/* Mobile Navigation Toggle Button */}
        <div className="md:hidden sticky top-16 z-30 flex justify-between items-center bg-black/80 backdrop-blur-md py-3 px-2 border-b border-gray-700 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsNavOpen(true)}
            className="flex items-center gap-2 border-gray-600 text-gray-300 hover:text-white"
          >
            <PanelLeft className="h-5 w-5" />
            <span>Navigation</span>
          </Button>
          <div className="text-white font-medium">Profile Editor</div>
        </div>

        {/* Tabs layout with vertical navbar and content side by side */}
        <div className="relative">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
            <div className="flex flex-col md:flex-row gap-6 h-full min-h-[600px]">
              {/* Left Navbar - Desktop view */}
              <div className="hidden md:flex min-w-[220px] w-[240px] lg:w-[260px] shrink-0 h-full flex-col">
                {/* Import Options at the top */}
                <div className="bg-black/70 backdrop-blur-md rounded-lg border border-gray-500 shadow-sm mt-4 mb-4 px-4 py-3 flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-sm shadow-purple-500/20" />
                    <span className="font-semibold text-sm text-gray-200">Import From Resume</span>
                  </div>
                  <Dialog open={isResumeDialogOpen} onOpenChange={setIsResumeDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full flex items-center gap-2 bg-white text-black border-gray-300 hover:bg-gray-100 hover:border-gray-400 py-2 px-3 text-sm font-medium rounded-md transition-all"
                      >
                        <Upload className="h-4 w-4 text-black" />
                        Resume Upload
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-gray-900/95 backdrop-blur-xl border-gray-800/60 shadow-2xl">
                      <DialogHeader className="pb-4">
                        <DialogTitle className="text-xl bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                          Upload Resume Content
                        </DialogTitle>
                        <DialogDescription asChild>
                          <div className="space-y-3 text-sm text-gray-400">
                            <p className="text-gray-300 font-medium">Let our AI analyze and enhance your profile</p>
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                <span className="text-blue-300 font-medium text-xs">Smart Integration</span>
                              </div>
                              <p className="text-gray-300 text-xs leading-relaxed">
                                Your existing profile information will be preserved. New entries will be intelligently added 
                                alongside your current data, avoiding duplicates and enhancing missing details.
                              </p>
                              <p className="text-gray-400 text-xs">
                                💡 <span className="text-amber-400">Pro tip:</span> Want to start fresh? Use the "Reset Profile" option before uploading.
                              </p>
                            </div>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-4">
                          <label
                            onDragEnter={(e) => handleDrag(e, setIsResumeDragging)}
                            onDragLeave={(e) => handleDrag(e, setIsResumeDragging)}
                            onDragOver={(e) => handleDrag(e, setIsResumeDragging)}
                            onDrop={(e) => handleDrop(e, setResumeContent)}
                            className={cn(
                              "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 cursor-pointer group",
                              "bg-gray-800/30 backdrop-blur-sm",
                              isResumeDragging
                                ? "border-violet-400 bg-violet-500/10"
                                : "border-gray-700/60 hover:border-violet-400/60 hover:bg-violet-500/5"
                            )}
                          >
                            <input
                              type="file"
                              className="hidden"
                              accept="application/pdf"
                              onChange={(e) => handleFileInput(e, setResumeContent)}
                            />
                            <div className="p-2 rounded-full bg-violet-500/20 group-hover:bg-violet-500/30 transition-colors">
                              <Upload className="w-6 h-6 text-violet-400" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium text-white">
                                Drop PDF here or click to browse
                              </p>
                            </div>
                          </label>
                          <div className="relative">
                            <div className="absolute -top-2.5 left-3 bg-gray-900 px-2 text-xs text-violet-400 font-medium">
                              Or paste text here
                            </div>
                            <Textarea
                              value={resumeContent}
                              onChange={(e) => setResumeContent(e.target.value)}
                              placeholder="Paste your resume content here..."
                              className={cn(
                                "min-h-[100px] bg-gray-800/50 border-gray-700/60 rounded-lg pt-4",
                                "focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/20 focus:bg-gray-800/70",
                                "hover:border-gray-600/80 hover:bg-gray-800/60",
                                "text-white placeholder:text-gray-500 text-sm",
                                "transition-all duration-300 resize-none"
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      {apiKeyError && (
                        <div className="px-3 py-2 bg-red-900/20 border border-red-800/40 rounded-lg flex items-start gap-2 text-red-400 text-xs">
                          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-medium text-red-300">API Key Required</p>
                            <p className="text-red-400/90">{apiKeyError}</p>
                            <div className="mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-400 border-red-800/40 hover:bg-red-900/30 bg-transparent text-xs"
                                onClick={() => handleApiKeyClick()}
                              >
                                Set API Keys
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      <DialogFooter className="gap-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsResumeDialogOpen(false)}
                          className="border-gray-700/60 bg-gray-800/30 text-gray-300 hover:bg-gray-800/50 hover:border-gray-600/80 hover:text-gray-200"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleResumeUpload(resumeContent)}
                          disabled={isProcessingResume || !resumeContent.trim()}
                          className={cn(
                            "bg-gradient-to-r from-violet-600 to-indigo-600 text-white",
                            "hover:from-violet-700 hover:to-indigo-700",
                            "disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-400",
                            "transition-all duration-300"
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

                {/* Divider before tabs */}
                <div className="my-2 border-t border-gray-400 w-full" />

                {/* Tab List and rest of sidebar... */}
                <TabsList className="flex flex-col w-full h-full bg-black text-white border border-gray-500 rounded-xl shadow-lg overflow-hidden min-h-[500px] justify-start">
                  <TabsTrigger 
                    value="basic" 
                    className="w-full group flex items-center gap-3 px-5 py-4 border-l-4 border-transparent text-left font-medium justify-start transition-all duration-300
                      data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-900 data-[state=active]:to-black
                      data-[state=active]:border-l-purple-400 data-[state=active]:text-white
                      data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 hover:bg-purple-900/20"
                  >
                    <div className="p-2 rounded-full bg-purple-400/10 transition-transform duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:bg-purple-400/20">
                      <User className="h-5 w-5 text-purple-400 transition-colors" />
                    </div>
                    <span className="font-medium">Basic Info</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="experience" 
                    className="w-full group flex items-center gap-3 px-5 py-4 border-l-4 border-transparent text-left font-medium justify-start transition-all duration-300
                      data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-900 data-[state=active]:to-black
                      data-[state=active]:border-l-purple-400 data-[state=active]:text-white
                      data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 hover:bg-purple-900/20"
                  >
                    <div className="p-2 rounded-full bg-purple-400/10 transition-transform duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:bg-purple-400/20">
                      <Briefcase className="h-5 w-5 text-purple-400 transition-colors" />
                    </div>
                    <span className="font-medium">Work Experience</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="projects" 
                    className="w-full group flex items-center gap-3 px-5 py-4 border-l-4 border-transparent text-left font-medium justify-start transition-all duration-300
                      data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-900 data-[state=active]:to-black
                      data-[state=active]:border-l-purple-400 data-[state=active]:text-white
                      data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 hover:bg-purple-900/20"
                  >
                    <div className="p-2 rounded-full bg-purple-400/10 transition-transform duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:bg-purple-400/20">
                      <FolderGit2 className="h-5 w-5 text-purple-400 transition-colors" />
                    </div>
                    <span className="font-medium">Projects</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="education" 
                    className="w-full group flex items-center gap-3 px-5 py-4 border-l-4 border-transparent text-left font-medium justify-start transition-all duration-300
                      data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-900 data-[state=active]:to-black
                      data-[state=active]:border-l-purple-400 data-[state=active]:text-white
                      data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 hover:bg-purple-900/20"
                  >
                    <div className="p-2 rounded-full bg-purple-400/10 transition-transform duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:bg-purple-400/20">
                      <GraduationCap className="h-5 w-5 text-purple-400 transition-colors" />
                    </div>
                    <span className="font-medium">Education</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="skills" 
                    className="w-full group flex items-center gap-3 px-5 py-4 border-l-4 border-transparent text-left font-medium justify-start transition-all duration-300
                      data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-900 data-[state=active]:to-black
                      data-[state=active]:border-l-purple-400 data-[state=active]:text-white
                      data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 hover:bg-purple-900/20"
                  >
                    <div className="p-2 rounded-full bg-purple-400/10 transition-transform duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:bg-purple-400/20">
                      <Wrench className="h-5 w-5 text-purple-400 transition-colors" />
                    </div>
                    <span className="font-medium">Skills</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="w-full group flex items-center gap-3 px-5 py-4 border-l-4 border-transparent text-left font-medium justify-start transition-all duration-300
                      data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-900 data-[state=active]:to-black
                      data-[state=active]:border-l-green-400 data-[state=active]:text-white
                      data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 hover:bg-green-900/20"
                  >
                    <div className="p-2 rounded-full bg-green-400/10 transition-transform duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:bg-green-400/20">
                      <Lock className="h-5 w-5 text-green-400 transition-colors" />
                    </div>
                    <span className="font-medium">Security</span>
                  </TabsTrigger>

                  {/* Divider after last tab */}
                  <div className="my-3 border-t border-gray-500 w-full" />

                  {/* Save and Reset buttons in navbar */}
                  <div className="flex flex-col gap-2 px-4 pb-4">
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    size="sm"
                    className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white font-semibold rounded-md shadow-sm hover:from-teal-600 hover:to-green-600 hover:shadow-md transition-all duration-200 h-9 px-3 flex items-center justify-center gap-2 text-sm"
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
                        size="sm"
                        variant="outline"
                        className="w-full border border-rose-500 text-rose-600 font-medium rounded-md hover:bg-rose-50 hover:border-rose-600 hover:text-rose-700 transition-all duration-200 h-9 px-3 flex items-center justify-center gap-2 text-sm"
                        disabled={isResetting}
                      >
                        {isResetting ? (
                          <><Loader2 className="h-4 w-4 animate-spin" />Resetting...</>
                        ) : (
                          <><Trash2 className="h-4 w-4" />Reset</>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="sm:max-w-[425px]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Reset Profile</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to reset your profile? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isResetting} className="text-gray-100">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleReset}
                          disabled={isResetting}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isResetting ? "Resetting..." : "Reset Profile"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                </div>
                </TabsList>
              </div>
              {/* Content area on the right */}
              <div className="flex-1 relative w-full">
                <div className="absolute inset-0 pointer-events-none rounded-xl"></div>
                <div className="relative space-y-6 px-1 sm:px-2 md:px-4">
                  <TabsContent value="basic" className="animate-in fade-in-50 slide-in-from-left-2 duration-300">
                    <Card className="bg-black text-white border-gray-500 shadow-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] rounded-xl overflow-hidden w-full">
                      <div className="p-3 sm:p-4 md:p-6">
                        <h2 className="text-lg font-semibold mb-4 md:mb-6 text-purple-400">Personal Information</h2>
                        <ProfileBasicInfoForm
                          profile={profile}
                          onChange={(field, value) => {
                            if (field in profile && field !== 'email') {
                              updateField(field as keyof Profile, value);
                            }
                          }}
                        />
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="experience" className="animate-in fade-in-50 slide-in-from-left-2 duration-300">
                    <Card className="bg-black text-white border-gray-500 shadow-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] rounded-xl overflow-hidden w-full">
                      <div className="p-3 sm:p-4 md:p-6">
                        <h2 className="text-lg font-semibold mb-4 md:mb-6 text-purple-400">Work Experience</h2>
                        <ProfileWorkExperienceForm
                          experiences={profile.work_experience}
                          onChange={(experiences) => updateField('work_experience', experiences)}
                        />
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="projects" className="animate-in fade-in-50 slide-in-from-left-2 duration-300">
                    <Card className="bg-black text-white border-gray-500 shadow-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] rounded-xl overflow-hidden w-full">
                      <div className="p-3 sm:p-4 md:p-6">
                        <h2 className="text-lg font-semibold mb-4 md:mb-6 text-purple-400">Projects</h2>
                        <ProfileProjectsForm
                          projects={profile.projects}
                          onChange={(projects) => updateField('projects', projects)}
                        />
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="education" className="animate-in fade-in-50 slide-in-from-left-2 duration-300">
                    <Card className="bg-black text-white border-gray-500 shadow-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] rounded-xl overflow-hidden w-full">
                      <div className="p-3 sm:p-4 md:p-6">
                        <h2 className="text-lg font-semibold mb-4 md:mb-6 text-purple-400">Education</h2>
                        <ProfileEducationForm
                          education={profile.education}
                          onChange={(education) => updateField('education', education)}
                        />
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="skills" className="animate-in fade-in-50 slide-in-from-left-2 duration-300">
                    <Card className="bg-black text-white border-gray-500 shadow-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] rounded-xl overflow-hidden w-full">
                      <div className="p-3 sm:p-4 md:p-6">
                        <h2 className="text-lg font-semibold mb-4 md:mb-6 text-purple-400">Skills</h2>
                        <ProfileSkillsForm
                          skills={profile.skills}
                          onChange={(skills) => updateField('skills', skills)}
                        />
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="security" className="animate-in fade-in-50 slide-in-from-left-2 duration-300">
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold mb-4 md:mb-6 text-green-400">Security Settings</h2>
                      <ChangePasswordForm />
                    </div>
                  </TabsContent>

                </div>
              </div>
            </div>
            {/* Mobile Nav Buttons OUTSIDE the card */}
            <div className="flex md:hidden justify-between gap-2 mt-4 px-1 sm:px-2 md:px-4 text-gray-200">
              <Button variant="outline" onClick={goToPrev} disabled={isFirstTab} className="flex-1">
                Previous
              </Button>
              {isLastTab ? (
                <Button variant="default" onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              ) : (
                <Button variant="default" onClick={goToNext} disabled={isLastTab} className="flex-1">
                  Next
                </Button>
              )}
            </div>
          </Tabs>
        </div>
      </div>

      {/* Mobile Navigation Slide-out */}
      <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
        <SheetContent side="left" className="w-[280px] sm:w-[320px] bg-black border-r border-gray-600 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Profile Navigation</SheetTitle>
            <SheetDescription>Navigate between different sections of your profile</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col h-full">
            {/* Import Options - Mobile */}
            <div className="bg-black/70 backdrop-blur-md border-b border-gray-500 shadow-sm px-4 py-3 flex flex-col gap-3 mt-8 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-sm shadow-purple-500/20" />
                <span className="font-semibold text-sm text-white">Import From Resume</span>
              </div>
              
              <Button
                variant="outline"
                onClick={() => {
                  setIsResumeDialogOpen(true);
                  setIsNavOpen(false);
                }}
                className="w-full flex items-center gap-2 text-violet-400 border-violet-400/30 hover:bg-violet-400/10 hover:border-violet-500/50 py-2 px-3 text-sm font-medium rounded-md transition-all"
              >
                <Upload className="h-4 w-4" />
                Resume Upload
              </Button>
            </div>

            {/* Mobile Tab Navigation */}
            <div className="flex-1 overflow-y-auto">
              <Tabs value={activeTab} onValueChange={(value) => {
                setActiveTab(value);
                setIsNavOpen(false);
              }} className="w-full h-full">
                <TabsList className="flex flex-col w-full h-full bg-black text-white border-none shadow-none overflow-hidden justify-start">
                <TabsTrigger 
                  value="basic" 
                  className="w-full group flex items-center gap-3 px-5 py-4 border-l-4 border-transparent text-left font-medium justify-start transition-all duration-300
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-900 data-[state=active]:to-black
                    data-[state=active]:border-l-purple-400 data-[state=active]:text-white
                    data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 hover:bg-purple-900/20"
                >
                  <div className="p-2 rounded-full bg-purple-400/10 transition-transform duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:bg-purple-400/20">
                    <User className="h-5 w-5 text-purple-400 transition-colors" />
                  </div>
                  <span className="font-medium">Basic Info</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="experience" 
                  className="w-full group flex items-center gap-3 px-5 py-4 border-l-4 border-transparent text-left font-medium justify-start transition-all duration-300
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-900 data-[state=active]:to-black
                    data-[state=active]:border-l-purple-400 data-[state=active]:text-white
                    data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 hover:bg-purple-900/20"
                >
                  <div className="p-2 rounded-full bg-purple-400/10 transition-transform duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:bg-purple-400/20">
                    <Briefcase className="h-5 w-5 text-purple-400 transition-colors" />
                  </div>
                  <span className="font-medium">Work Experience</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="projects" 
                  className="w-full group flex items-center gap-3 px-5 py-4 border-l-4 border-transparent text-left font-medium justify-start transition-all duration-300
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-900 data-[state=active]:to-black
                    data-[state=active]:border-l-purple-400 data-[state=active]:text-white
                    data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 hover:bg-purple-900/20"
                >
                  <div className="p-2 rounded-full bg-purple-400/10 transition-transform duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:bg-purple-400/20">
                    <FolderGit2 className="h-5 w-5 text-purple-400 transition-colors" />
                  </div>
                  <span className="font-medium">Projects</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="education" 
                  className="w-full group flex items-center gap-3 px-5 py-4 border-l-4 border-transparent text-left font-medium justify-start transition-all duration-300
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-900 data-[state=active]:to-black
                    data-[state=active]:border-l-purple-400 data-[state=active]:text-white
                    data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 hover:bg-purple-900/20"
                >
                  <div className="p-2 rounded-full bg-purple-400/10 transition-transform duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:bg-purple-400/20">
                    <GraduationCap className="h-5 w-5 text-purple-400 transition-colors" />
                  </div>
                  <span className="font-medium">Education</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="skills" 
                  className="w-full group flex items-center gap-3 px-5 py-4 border-l-4 border-transparent text-left font-medium justify-start transition-all duration-300
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-900 data-[state=active]:to-black
                    data-[state=active]:border-l-purple-400 data-[state=active]:text-white
                    data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 hover:bg-purple-900/20"
                >
                  <div className="p-2 rounded-full bg-purple-400/10 transition-transform duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:bg-purple-400/20">
                    <Wrench className="h-5 w-5 text-purple-400 transition-colors" />
                  </div>
                  <span className="font-medium">Skills</span>
                </TabsTrigger>

                <TabsTrigger 
                  value="security" 
                  className="w-full group flex items-center gap-3 px-5 py-4 border-l-4 border-transparent text-left font-medium justify-start transition-all duration-300
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-900 data-[state=active]:to-black
                    data-[state=active]:border-l-green-400 data-[state=active]:text-white
                    data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 hover:bg-green-900/20"
                >
                  <div className="p-2 rounded-full bg-green-400/10 transition-transform duration-300 group-data-[state=active]:scale-110 group-data-[state=active]:bg-green-400/20">
                    <Lock className="h-5 w-5 text-green-400 transition-colors" />
                  </div>
                  <span className="font-medium">Security</span>
                </TabsTrigger>
              </TabsList>
              </Tabs>
            </div>
            {/* Mobile Save/Reset Buttons */}
            <div className="flex flex-col gap-2 p-4 border-t border-gray-600">
              <Button 
                onClick={() => {
                  handleSubmit();
                  setIsNavOpen(false);
                }}
                disabled={isSubmitting}
                size="sm"
                className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white font-semibold rounded-md shadow-sm hover:from-teal-600 hover:to-green-600 hover:shadow-md transition-all duration-200 h-9 px-3 flex items-center justify-center gap-2 text-sm"
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
                    size="sm"
                    variant="outline"
                    className="w-full border border-rose-500 text-rose-400 font-medium rounded-md hover:bg-rose-900/20 hover:border-rose-400 transition-all duration-200 h-9 px-3 flex items-center justify-center gap-2 text-sm"
                    disabled={isResetting}
                  >
                    {isResetting ? (
                      <><Loader2 className="h-4 w-4 animate-spin" />Resetting...</>
                    ) : (
                      <><Trash2 className="h-4 w-4" />Reset Profile</>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset Profile</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset your entire profile and remove all your information. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isResetting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleReset}
                      disabled={isResetting}
                      className="bg-rose-500 hover:bg-rose-600"
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
              
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}