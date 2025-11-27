'use client';

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, FileText, FolderGit2, GraduationCap, User, Wrench } from "lucide-react";

export function ResumeEditorTabs() {
  return (
    <>

      <TabsList className="h-full w-full relative bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-lg overflow-hidden grid grid-cols-3 @[500px]:grid-cols-8 gap-0.5 p-0.5 shadow-lg">
        {/* Basic Info Tab */}
        <TabsTrigger 
          value="basic" 
          className="group flex items-center gap-1.5 px-2 py-1 rounded-md font-medium relative transition-all duration-300
            data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500/20 data-[state=active]:to-cyan-500/20
            data-[state=active]:border-teal-500/30 data-[state=active]:shadow-md hover:bg-gray-800/80
            data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200"
        >
          <div className="p-1 rounded-md bg-teal-900/80 transition-transform duration-300 group-data-[state=active]:scale-105 group-data-[state=active]:bg-teal-900">
            <User className="h-3.5 w-3.5 text-teal-400 transition-colors group-data-[state=inactive]:text-teal-500/70" />
          </div>
          <span className="relative text-xs whitespace-nowrap">
            Basic Info
            <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-teal-400 scale-x-0 transition-transform duration-300 group-data-[state=active]:scale-x-100"></div>
          </span>
        </TabsTrigger>

        {/* Summary Tab */}
        <TabsTrigger 
          value="summary" 
          className="group flex items-center gap-1.5 px-2 py-1 rounded-md font-medium relative transition-all duration-300
            data-[state=active]:bg-gradient-to-r data-[state=active]:from-fuchsia-500/20 data-[state=active]:to-pink-500/20
            data-[state=active]:border-fuchsia-500/30 data-[state=active]:shadow-md hover:bg-gray-800/80
            data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200"
        >
          <div className="p-1 rounded-md bg-fuchsia-900/80 transition-transform duration-300 group-data-[state=active]:scale-105 group-data-[state=active]:bg-fuchsia-900">
            <FileText className="h-3.5 w-3.5 text-fuchsia-400 transition-colors group-data-[state=inactive]:text-fuchsia-500/70" />
          </div>
          <span className="relative text-xs whitespace-nowrap">
            Summary
            <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-fuchsia-400 scale-x-0 transition-transform duration-300 group-data-[state=active]:scale-x-100"></div>
          </span>
        </TabsTrigger>

        {/* Work Tab */}
        <TabsTrigger 
          value="work" 
          className="group flex items-center gap-1.5 px-2 py-1 rounded-md font-medium relative transition-all duration-300
            data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20
            data-[state=active]:border-cyan-500/30 data-[state=active]:shadow-md hover:bg-gray-800/80
            data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200"
        >
          <div className="p-1 rounded-md bg-cyan-900/80 transition-transform duration-300 group-data-[state=active]:scale-105 group-data-[state=active]:bg-cyan-900">
            <Briefcase className="h-3.5 w-3.5 text-cyan-400 transition-colors group-data-[state=inactive]:text-cyan-500/70" />
          </div>
          <span className="relative text-xs whitespace-nowrap">
            Work
            <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-cyan-400 scale-x-0 transition-transform duration-300 group-data-[state=active]:scale-x-100"></div>
          </span>
        </TabsTrigger>

        {/* Projects Tab */}
        <TabsTrigger 
          value="projects" 
          className="group flex items-center gap-1.5 px-2 py-1 rounded-md font-medium relative transition-all duration-300
            data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/20 data-[state=active]:to-purple-500/20
            data-[state=active]:border-violet-500/30 data-[state=active]:shadow-md hover:bg-gray-800/80
            data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200"
        >
          <div className="p-1 rounded-md bg-violet-900/80 transition-transform duration-300 group-data-[state=active]:scale-105 group-data-[state=active]:bg-violet-900">
            <FolderGit2 className="h-3.5 w-3.5 text-violet-400 transition-colors group-data-[state=inactive]:text-violet-500/70" />
          </div>
          <span className="relative text-xs whitespace-nowrap">
            Projects
            <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-violet-400 scale-x-0 transition-transform duration-300 group-data-[state=active]:scale-x-100"></div>
          </span>
        </TabsTrigger>

        {/* Education Tab */}
        <TabsTrigger 
          value="education" 
          className="group flex items-center gap-1.5 px-2 py-1 rounded-md font-medium relative transition-all duration-300
            data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/20 data-[state=active]:to-blue-500/20
            data-[state=active]:border-indigo-500/30 data-[state=active]:shadow-md hover:bg-gray-800/80
            data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200"
        >
          <div className="p-1 rounded-md bg-indigo-900/80 transition-transform duration-300 group-data-[state=active]:scale-105 group-data-[state=active]:bg-indigo-900">
            <GraduationCap className="h-3.5 w-3.5 text-indigo-400 transition-colors group-data-[state=inactive]:text-indigo-500/70" />
          </div>
          <span className="relative text-xs whitespace-nowrap">
            Education
            <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-indigo-400 scale-x-0 transition-transform duration-300 group-data-[state=active]:scale-x-100"></div>
          </span>
        </TabsTrigger>

        {/* Skills Tab */}
        <TabsTrigger 
          value="skills" 
          className="group flex items-center gap-1.5 px-2 py-1 rounded-md font-medium relative transition-all duration-300
            data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500/20 data-[state=active]:to-pink-500/20
            data-[state=active]:border-rose-500/30 data-[state=active]:shadow-md hover:bg-gray-800/80
            data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200"
        >
          <div className="p-1 rounded-md bg-rose-900/80 transition-transform duration-300 group-data-[state=active]:scale-105 group-data-[state=active]:bg-rose-900">
            <Wrench className="h-3.5 w-3.5 text-rose-400 transition-colors group-data-[state=inactive]:text-rose-500/70" />
          </div>
          <span className="relative text-xs whitespace-nowrap">
            Skills
            <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-rose-400 scale-x-0 transition-transform duration-300 group-data-[state=active]:scale-x-100"></div>
          </span>
        </TabsTrigger>
      </TabsList>
    </>
  );
}