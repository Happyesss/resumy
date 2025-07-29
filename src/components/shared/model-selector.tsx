'use client'

import React, { useState } from "react"
import Image from "next/image"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ServiceName } from "@/lib/types"
import { toast } from "sonner"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface ApiKey {
  service: ServiceName
  key: string
  addedAt: string
}

interface AIModel {
  id: string
  name: string
  provider: ServiceName
  unstable: boolean
}

const PROVIDERS: { 
  id: ServiceName; 
  name: string; 
  apiLink: string;
  unstable: boolean;
  logo?: string;
}[] = [
  {
    id: 'google',
    name: 'Google',
    apiLink: 'https://ai.google.dev/',
    unstable: false,
    logo: '/logos/gemini-logo.webp'
  }
]

const AI_MODELS: AIModel[] = [
  // Use Gemini 2.5 Flash-Lite Preview 06-17
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash-Lite', provider: 'google', unstable: false },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'google', unstable: false }
]

interface ModelSelectorProps {
  value: string
  onValueChange: (value: string) => void
  apiKeys: ApiKey[]
  className?: string
  placeholder?: string
  showToast?: boolean
}

// Helper component for unavailable model popover
function UnavailableModelPopover({ children, model }: { children: React.ReactNode; model: AIModel }) {
  const [open, setOpen] = useState(false)
  const provider = PROVIDERS.find(p => p.id === model.provider)
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="w-full"
        >
          {children}
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 z-50" 
        side="right" 
        align="start"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">
              {model.name} is not available
            </h4>
            <p className="text-xs text-muted-foreground">
              To use this model, you need to add your {provider?.name} API key.
            </p>
          </div>
          
          <div className="space-y-2">
            {/* API Key Option */}
            <div className="p-3 rounded-lg border border-gray-200/50 bg-gray-50/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-800">Add API Key</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Add your own {provider?.name} API key to use this model
              </p>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Button size="sm" variant="outline" className="w-full h-7 text-xs" onClick={() => {
                    toast.error("API key management is currently unavailable");
                  }}>
                    Configure API Key
                  </Button>
                </div>
                {provider?.apiLink && (
                  <Link href={provider.apiLink} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="ghost" className="h-7 px-2">
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function ModelSelector({ 
  value, 
  onValueChange, 
  apiKeys, 
  className,
  placeholder = "Gemini 2.0 Flash",
  showToast = true
}: ModelSelectorProps) {
  // We only support Gemini 2.0 Flash now
  const model = AI_MODELS[0];
  const provider = PROVIDERS[0];
  
  // Check if user has Google API key
  const hasGoogleKey = apiKeys.some(k => k.service === 'google');
  
  return (
    <div className={cn(
      "flex items-center gap-2 h-8 px-3 py-1 rounded-md",
      "bg-white/50 border border-purple-600/60 hover:border-purple-600/80 transition-colors",
      className
    )}>
      {provider.logo && (
        <Image
          src={provider.logo}
          alt={`${provider.name} logo`}
          width={16}
          height={16}
          className="rounded-sm flex-shrink-0"
        />
      )}
      <span className="text-sm font-medium truncate">{model.name}</span>
    </div>
  )
}

// Export the types and constants for reuse
export type { AIModel, ApiKey }
export { AI_MODELS, PROVIDERS } 