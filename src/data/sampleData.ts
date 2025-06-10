import { ResumeData } from '../types/resume';

export const sampleResumeData: ResumeData = {
  id: 'sample-resume',
  personalInfo: {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    address: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    linkedIn: 'linkedin.com/in/sarahjohnson',
    website: 'sarahjohnson.dev',
    portfolio: 'portfolio.sarahjohnson.dev'
  },
  summary: 'Experienced Software Engineer with 5+ years developing scalable web applications and leading cross-functional teams. Proven track record of delivering high-quality solutions that drive business growth and improve user experience.',
  workExperience: [
    {
      id: '1',
      company: 'TechCorp Inc.',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2022-01',
      endDate: '',
      current: true,
      description: [
        'Lead development of React-based dashboard serving 10,000+ daily users',
        'Reduced application load time by 40% through optimization techniques',
        'Mentored 3 junior developers and conducted code reviews',
        'Collaborated with product team to define technical requirements'
      ]
    },
    {
      id: '2',
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      location: 'Palo Alto, CA',
      startDate: '2020-03',
      endDate: '2021-12',
      current: false,
      description: [
        'Built and maintained microservices architecture using Node.js and Docker',
        'Developed responsive web applications with React and TypeScript',
        'Implemented CI/CD pipelines reducing deployment time by 60%',
        'Contributed to 15+ feature releases in an agile environment'
      ]
    }
  ],
  education: [
    {
      id: '1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'Berkeley, CA',
      startDate: '2016-08',
      endDate: '2020-05',
      gpa: '3.8',
      honors: 'Magna Cum Laude'
    }
  ],
  skills: [
    { id: '1', name: 'JavaScript', category: 'Programming', level: 'Expert' },
    { id: '2', name: 'React', category: 'Frontend', level: 'Expert' },
    { id: '3', name: 'Node.js', category: 'Backend', level: 'Advanced' },
    { id: '4', name: 'TypeScript', category: 'Programming', level: 'Advanced' },
    { id: '5', name: 'Python', category: 'Programming', level: 'Intermediate' },
    { id: '6', name: 'AWS', category: 'Cloud', level: 'Intermediate' },
    { id: '7', name: 'Docker', category: 'DevOps', level: 'Intermediate' },
    { id: '8', name: 'Git', category: 'Tools', level: 'Advanced' }
  ],
  projects: [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Built a full-stack e-commerce solution with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe API'],
      url: 'https://ecommerce-demo.com',
      github: 'https://github.com/sarah/ecommerce',
      startDate: '2023-01',
      endDate: '2023-04'
    },
    {
      id: '2',
      name: 'Task Management App',
      description: 'Developed a collaborative task management application with real-time updates using Socket.io and React.',
      technologies: ['React', 'Socket.io', 'MongoDB', 'Express'],
      github: 'https://github.com/sarah/task-manager',
      startDate: '2022-09',
      endDate: '2022-12'
    }
  ],
  certifications: [
    {
      id: '1',
      name: 'AWS Certified Developer',
      issuer: 'Amazon Web Services',
      date: '2023-03',
      credentialId: 'AWS-123456789'
    },
    {
      id: '2',
      name: 'Certified Scrum Master',
      issuer: 'Scrum Alliance',
      date: '2022-11',
      credentialId: 'CSM-987654321'
    }
  ],
  template: 'modern-professional',
  lastModified: new Date().toISOString()
};