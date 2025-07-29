import { cn } from "@/lib/utils";
import { Copy, Sparkles, Brain } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";

interface ImportMethodRadioItemProps extends ComponentPropsWithoutRef<'input'> {
  title: string;
  description: string;
  icon: React.ReactNode;
  checked?: boolean;
  id: string;
  gradient: string;
  iconGradient: string;
  hoverGradient: string;
}

function ImportMethodRadioItem({
  title,
  description,
  icon,
  id,
  gradient,
  iconGradient,
  hoverGradient,
  ...props
}: ImportMethodRadioItemProps) {
  return (
    <label htmlFor={id} className="h-full cursor-pointer group">
      <input
        type="radio"
        className="sr-only peer"
        id={id}
        {...props}
      />
      <div
        className={cn(
          "relative overflow-hidden",
          "flex flex-col items-center justify-center rounded-xl p-3 h-full min-h-[110px]",
          "bg-gray-900/80 backdrop-blur-sm",
          "border border-gray-700/50 shadow-lg shadow-black/20",
          "hover:border-gray-600/70 hover:shadow-xl hover:shadow-black/30",
          "hover:bg-gray-800/90",
          "transition-all duration-300 ease-out",
          "peer-checked:border-blue-500/60 peer-checked:shadow-xl peer-checked:shadow-blue-500/10",
          "peer-checked:bg-gray-800/90",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        )}
      >
        {/* Selected state indicator */}
        <div 
          className={cn(
            "absolute inset-0 rounded-xl opacity-0 transition-all duration-300",
            "peer-checked:opacity-100 peer-checked:bg-gradient-to-br peer-checked:from-blue-600/20 peer-checked:to-purple-600/20"
          )}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Icon container with clean styling */}
          <div 
            className={cn(
              "relative mb-4 p-3 rounded-lg",
              "bg-gray-800/60 border border-gray-600/30",
              "group-hover:bg-gray-700/70 group-hover:border-gray-500/50",
              "peer-checked:bg-gradient-to-br peer-checked:border-transparent",
              "transition-all duration-300 ease-out"
            )}
            style={{ 
              background: props.checked ? iconGradient : undefined 
            }}
          >
            <div className="relative z-10">
              {icon}
            </div>
          </div>

          {/* Title with clean styling */}
          <h3 className={cn(
            "font-semibold text-lg mb-2 text-gray-100",
            "group-hover:text-white peer-checked:text-white",
            "transition-colors duration-300"
          )}>
            {title}
          </h3>

          {/* Description with clean styling */}
          <p className={cn(
            "text-sm leading-relaxed text-gray-400",
            "group-hover:text-gray-300 peer-checked:text-gray-300",
            "transition-colors duration-300"
          )}>
            {description}
          </p>

          {/* Clean selection indicator */}
          <div className={cn(
            "absolute top-4 right-4 w-5 h-5 rounded-full",
            "border-2 border-gray-600 bg-gray-800",
            "opacity-0 peer-checked:opacity-100",
            "peer-checked:border-blue-500 peer-checked:bg-blue-500",
            "transition-all duration-300"
          )}>
            <div className={cn(
              "w-full h-full rounded-full flex items-center justify-center",
              "opacity-0 peer-checked:opacity-100 transition-opacity duration-300"
            )}>
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>
        </div>
      </div>
    </label>
  );
}

interface ImportMethodRadioGroupProps {
  value: 'import-profile' | 'ai';
  onChange: (value: 'import-profile' | 'ai') => void;
}

export function ImportMethodRadioGroup({ value, onChange }: ImportMethodRadioGroupProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ImportMethodRadioItem
        name="tailorOption"
        value="ai"
        id="ai-tailor"
        checked={value === 'ai'}
        onChange={() => onChange('ai')}
        title="Tailor with AI"
        description="Let AI analyze the job description and optimize your resume for the best match"
        icon={<Brain className="h-7 w-7 text-white drop-shadow-sm" />}
        gradient="linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)"
        iconGradient="linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)"
        hoverGradient="linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)"
      />
      
      <ImportMethodRadioItem
        name="tailorOption"
        value="import-profile"
        id="manual-tailor"
        checked={value === 'import-profile'}
        onChange={() => onChange('import-profile')}
        title="Copy Base Resume"
        description="Create a copy of your base resume. Add a job description to link it to a specific position."
        icon={<Copy className="h-7 w-7 text-white drop-shadow-sm" />}
        gradient="linear-gradient(135deg, #059669 0%, #10b981 100%)"
        iconGradient="linear-gradient(135deg, #059669 0%, #10b981 100%)"
        hoverGradient="linear-gradient(135deg, #059669 0%, #10b981 100%)"
      />
    </div>
  );
} 