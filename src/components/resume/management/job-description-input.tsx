import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  isInvalid: boolean;
}

export function JobDescriptionInput({ value, onChange, isInvalid }: JobDescriptionInputProps) {
  return (
    <div className="space-y-3">
      <Label 
        htmlFor="job-description"
        className="text-base font-medium text-neutral-200"
      >
        Job Description <span className="text-red-400">*</span>
      </Label>
      <textarea
        id="job-description"
        placeholder="Paste the job description here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full min-h-[120px] rounded-lg bg-neutral-800/80 text-neutral-200 border border-neutral-700/50",
          "focus:border-purple-500 focus:ring-purple-500/20 focus:outline-none placeholder:text-neutral-500",
          "resize-y p-4 transition-colors",
          isInvalid && "border-red-500 shake"
        )}
        required
      />
    </div>
  );
} 