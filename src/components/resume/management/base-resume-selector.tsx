import { cn } from "@/lib/utils";
import { Resume } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BaseResumeSelectorProps {
  baseResumes: Resume[];
  selectedResumeId: string;
  onResumeSelect: (value: string) => void;
  isInvalid?: boolean;
}

export function BaseResumeSelector({ 
  baseResumes,
  selectedResumeId,
  onResumeSelect,
  isInvalid 
}: BaseResumeSelectorProps) {
  return (
    <Select value={selectedResumeId} onValueChange={onResumeSelect}>
      <SelectTrigger 
        id="base-resume" 
        className={cn(
          "h-14 px-4 text-base bg-neutral-950 border-2 border-gray-800 rounded-xl text-white transition-all duration-300",
          "hover:border-purple-400 hover:bg-neutral-900",
          "focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:bg-neutral-900",
          "data-[state=open]:border-purple-500 data-[state=open]:ring-4 data-[state=open]:ring-purple-500/10",
          isInvalid && "border-red-500 bg-red-950/50 shake ring-4 ring-red-500/10"
        )}
      >
        <SelectValue placeholder="Select a base resume" className="text-gray-300" />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-2 border-gray-800 shadow-xl bg-neutral-900">
        {baseResumes?.map((resume) => (
          <SelectItem 
            key={resume.id} 
            value={resume.id}
            className="text-base py-3 px-4 rounded-lg m-1 focus:bg-purple-900/30 hover:bg-purple-900/30 transition-colors duration-200 text-white"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="font-medium">{resume.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 