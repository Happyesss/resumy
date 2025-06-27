'use client';

import { User, Briefcase, FolderGit2, GraduationCap, Wrench } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ResumeEditorTabs() {
  return (
    <>
      {/* Enhanced second row with Resume Score and Cover Letter */}
      <div className="my-2">
        <TabsList className="h-full w-full relative bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-lg overflow-hidden grid grid-cols-2 gap-0.5 p-0.5 shadow-lg">
          
          {/* Resume Score */}
          <TabsTrigger 
            value="resume-score" 
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium relative transition-all duration-300
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/20 data-[state=active]:to-teal-500/20
              data-[state=active]:border-emerald-500/30 data-[state=active]:shadow-md hover:bg-gray-800/80
              data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200"
          >
            <div className="p-1 rounded-md bg-emerald-900/80 transition-transform duration-300 group-data-[state=active]:scale-105 group-data-[state=active]:bg-emerald-900">
              <svg className="h-3.5 w-3.5 text-emerald-400 transition-colors group-data-[state=inactive]:text-emerald-500/70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <span className="relative text-sm whitespace-nowrap">
              Resume Score
              <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-emerald-400 scale-x-0 transition-transform duration-300 group-data-[state=active]:scale-x-100"></div>
            </span>
          </TabsTrigger>

          {/* Cover Letter */}
          <TabsTrigger 
            value="cover-letter" 
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium relative transition-all duration-300
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20
              data-[state=active]:border-amber-500/30 data-[state=active]:shadow-md hover:bg-gray-800/80
              data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200"
          >
            <div className="p-1 rounded-md bg-amber-900/80 transition-transform duration-300 group-data-[state=active]:scale-105 group-data-[state=active]:bg-amber-900">
              <svg className="h-3.5 w-3.5 text-amber-400 transition-colors group-data-[state=inactive]:text-amber-500/70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <line x1="10" y1="9" x2="8" y2="9"/>
              </svg>
            </div>
            <span className="relative text-sm whitespace-nowrap">
              Cover Letter
              <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-amber-400 scale-x-0 transition-transform duration-300 group-data-[state=active]:scale-x-100"></div>
            </span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsList className="h-full w-full relative bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-lg overflow-hidden grid grid-cols-3 @[500px]:grid-cols-5 gap-0.5 p-0.5 shadow-lg">
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