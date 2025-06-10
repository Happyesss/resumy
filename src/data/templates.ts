import { Template } from '../types/resume';

export const templates: Template[] = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Clean, minimalist design perfect for corporate environments',
    category: 'modern',
    preview: '/templates/modern-professional.png',
    features: ['ATS-compliant', 'Clean typography', 'Professional layout', 'Skills visualization']
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    description: 'Eye-catching design for creative professionals',
    category: 'creative',
    preview: '/templates/creative-portfolio.png',
    features: ['Visual appeal', 'Portfolio section', 'Color accents', 'Project showcase']
  },
  {
    id: 'executive-premium',
    name: 'Executive Premium',
    description: 'Sophisticated layout for senior leadership positions',
    category: 'traditional',
    preview: '/templates/executive-premium.png',
    features: ['Professional header', 'Leadership focus', 'Achievement highlights', 'Premium styling']
  },
  {
    id: 'technical-specialist',
    name: 'Technical Specialist',
    description: 'Optimized for IT and engineering professionals',
    category: 'technical',
    preview: '/templates/technical-specialist.png',
    features: ['Technical skills grid', 'Project timeline', 'Code-friendly', 'Certification display']
  },
  {
    id: 'startup-dynamic',
    name: 'Startup Dynamic',
    description: 'Modern and energetic design for innovative companies',
    category: 'modern',
    preview: '/templates/startup-dynamic.png',
    features: ['Dynamic layout', 'Innovation focus', 'Startup-friendly', 'Growth metrics']
  }
];

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(template => template.id === id);
};