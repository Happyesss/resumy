export interface WorkExperience {
  company: string;
  position: string;
  location?: string;
  date: string;
  description: string[];
  technologies?: string[];
}

export interface Education {
  school: string;
  degree: string;
  field: string;
  location?: string;
  date: string;
  gpa?: number | string;
  achievements?: string[];
}

export interface Project {
  name: string;
  description: string[];
  date?: string;
  technologies?: string[];
  url?: string;
  github_url?: string;
}

export interface Skill {
  category: string;
  items: string[];
}




export interface Job {
  id: string;
  user_id: string;
  company_name: string;
  position_title: string;
  job_url: string | null;
  description: string | null;
  location: string | null;
  salary_range: string | null;
  keywords: string[];
  work_location: 'remote' | 'in_person' | 'hybrid' | null;
  employment_type: 'full_time' | 'part_time' | 'co_op' | 'internship' | 'contract' | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface SectionConfig {
  visible: boolean;
  max_items?: number | null;
  style?: 'grouped' | 'list' | 'grid';
}

export interface Resume {
  id: string;
  user_id: string;
  job_id?: string | null;
  name: string;
  target_role: string;
  is_base_resume: boolean;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  location?: string;
  website?: string;
  linkedin_url?: string;
  github_url?: string;
  professional_summary?: string | null; // Added summary field
  work_experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  created_at: string;
  updated_at: string;
  section_order?: string[];
  section_configs?: {
    [key: string]: { visible: boolean };
  };
  has_cover_letter: boolean;
  cover_letter?: Record<string, unknown> | null;
  template?: 'default' | 'classic' | 'classic-1' | 'modern' | 'modern-1' | 'modern-2' | 'creative' | 'creative-modern' | 'creative-minimal' | 'minimal' | 'minimal-1' | 'ca-professional';
}

// Document settings have been removed

export interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
  location: string | null;
  website: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  work_experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  created_at: string;
  updated_at: string;
}

export const AI_PROVIDERS = {
  GOOGLE: 'google',
  // TOGETHER: 'together',
  // COHERE: 'cohere',
  // FIREWORKS: 'fireworks',
  // DEEPINFRA: 'deepinfra',
  // GROQ: 'groq'
  DEEPSEEK: 'deepseek',
} as const;

export type AIProvider = typeof AI_PROVIDERS[keyof typeof AI_PROVIDERS];

export type ServiceName = 
  | 'openai'
  // | 'azure'
  | 'anthropic'
  // | 'bedrock'
  | 'google'
  // | 'vertex'
  // | 'mistral'
  // | 'xai'
  // | 'together'
  // | 'cohere'
  // | 'fireworks'
  // | 'deepinfra'
  | 'groq'
  | 'deepseek';

export type SortDirection = 'ascending' | 'descending';

export interface SortDescriptor<T> {
  column: T;
  direction: SortDirection;
}

