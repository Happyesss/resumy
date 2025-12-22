'use client'

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ArrowDownAZ, Briefcase, Calendar } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export type SortOption = 'name' | 'jobTitle' | 'createdAt'
export type SortDirection = 'asc' | 'desc'

const sortOptions = [
  { value: 'name', label: 'Name', icon: ArrowDownAZ },
  { value: 'jobTitle', label: 'Job Title', icon: Briefcase },
  { value: 'createdAt', label: 'Creation Date', icon: Calendar },
]

interface ResumeSortControlsProps {
  sortParam?: string;
  directionParam?: string;
  currentSort?: SortOption;
  currentDirection?: SortDirection;
}

import { usePathname } from "next/navigation"

export function ResumeSortControls({ 
  sortParam = 'sort',
  directionParam = 'direction',
  currentSort: propCurrentSort,
  currentDirection: propCurrentDirection
}: ResumeSortControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const _pathname = usePathname();

  const currentSort = propCurrentSort || (searchParams.get(sortParam) as SortOption) || 'createdAt'
  const direction = propCurrentDirection || (searchParams.get(directionParam) as SortDirection) || 'desc'

  function handleSortChange(sort: SortOption) {
    const params = new URLSearchParams(searchParams)
    params.set(sortParam, sort)
    if (sort !== currentSort) {
      params.set(directionParam, 'asc')
    }
    router.push(`?${params.toString()}`)
  }

  function _toggleDirection() {
    const params = new URLSearchParams(searchParams)
    params.set(directionParam, direction === 'asc' ? 'desc' : 'asc')
    router.push(`?${params.toString()}`)
  }

  // Hide sort controls on mobile screens
  // Use "hidden sm:flex" to hide on mobile, show on sm+
  return (
    <div className="hidden sm:flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="gap-2 bg-neutral-800 border border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white"
          >
            <span className="text-sm">Sort: {sortOptions.find(opt => opt.value === currentSort)?.label}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-neutral-900 border-neutral-800">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSortChange(option.value as SortOption)}
              className="text-neutral-300 hover:text-white hover:bg-neutral-800 focus:bg-neutral-800 focus:text-white"
            >
              <option.icon className="mr-2 h-4 w-4" />
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
    </div>
  )
}