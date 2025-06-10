import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Filter, 
  Briefcase, 
  Clock, 
  DollarSign,
  Heart,
  ExternalLink,
  Building,
  Users,
  Star
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  posted: string;
  applicants: number;
  saved: boolean;
  featured: boolean;
  companyLogo?: string;
  rating: number;
}

export const JobSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [filters, setFilters] = useState({
    jobType: '',
    salaryRange: '',
    experience: '',
    remote: false,
    datePosted: ''
  });

  const jobs: Job[] = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120k - $180k',
      description: 'We are looking for a Senior Software Engineer to join our growing team. You will be responsible for designing, developing, and maintaining scalable web applications using modern technologies.',
      requirements: ['5+ years of experience', 'React/Node.js expertise', 'AWS knowledge', 'Strong problem-solving skills'],
      benefits: ['Health insurance', 'Remote work', '401k matching', 'Unlimited PTO'],
      posted: '2 days ago',
      applicants: 45,
      saved: false,
      featured: true,
      rating: 4.8
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'InnovateCo',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$100k - $150k',
      description: 'Join our product team to drive the development of innovative solutions. You will work closely with engineering, design, and business teams to deliver exceptional user experiences.',
      requirements: ['3+ years PM experience', 'Agile methodology', 'Data analysis skills', 'Strong communication'],
      benefits: ['Competitive salary', 'Stock options', 'Learning budget', 'Flexible hours'],
      posted: '1 day ago',
      applicants: 32,
      saved: true,
      featured: false,
      rating: 4.6
    },
    {
      id: '3',
      title: 'UX Designer',
      company: 'DesignStudio',
      location: 'Remote',
      type: 'Full-time',
      salary: '$80k - $120k',
      description: 'We are seeking a talented UX Designer to create intuitive and engaging user experiences. You will conduct user research, create wireframes, and collaborate with development teams.',
      requirements: ['3+ years UX experience', 'Figma/Sketch proficiency', 'User research skills', 'Portfolio required'],
      benefits: ['Remote work', 'Design tools budget', 'Conference attendance', 'Mentorship program'],
      posted: '3 days ago',
      applicants: 28,
      saved: false,
      featured: false,
      rating: 4.5
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      company: 'CloudTech',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$110k - $160k',
      description: 'Looking for a DevOps Engineer to help scale our infrastructure. You will work on CI/CD pipelines, cloud architecture, and automation tools.',
      requirements: ['Docker/Kubernetes', 'AWS/Azure experience', 'Infrastructure as Code', 'Monitoring tools'],
      benefits: ['Equity package', 'Health benefits', 'Home office setup', 'Professional development'],
      posted: '1 week ago',
      applicants: 67,
      saved: false,
      featured: true,
      rating: 4.7
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery, locationQuery);
  };

  const toggleSaveJob = (jobId: string) => {
    console.log('Toggle save job:', jobId);
  };

  const applyToJob = (jobId: string) => {
    console.log('Apply to job:', jobId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                  <select
                    value={filters.salaryRange}
                    onChange={(e) => setFilters({ ...filters, salaryRange: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Salary</option>
                    <option value="0-50k">$0 - $50k</option>
                    <option value="50k-100k">$50k - $100k</option>
                    <option value="100k-150k">$100k - $150k</option>
                    <option value="150k+">$150k+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <select
                    value={filters.experience}
                    onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Level</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Posted</label>
                  <select
                    value={filters.datePosted}
                    onChange={(e) => setFilters({ ...filters, datePosted: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Time</option>
                    <option value="24h">Last 24 hours</option>
                    <option value="3d">Last 3 days</option>
                    <option value="1w">Last week</option>
                    <option value="1m">Last month</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.remote}
                      onChange={(e) => setFilters({ ...filters, remote: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Remote only</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {jobs.length} jobs found
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Most Relevant</option>
              <option>Date Posted</option>
              <option>Salary (High to Low)</option>
              <option>Salary (Low to High)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job List */}
          <div className="lg:col-span-2 space-y-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className={`bg-white rounded-lg shadow-sm border-2 transition-all cursor-pointer ${
                  selectedJob?.id === job.id
                    ? 'border-blue-500 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => setSelectedJob(job)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                          {job.featured && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 font-medium">{job.company}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Briefcase className="h-4 w-4" />
                            <span>{job.type}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{job.salary}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveJob(job.id);
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        job.saved
                          ? 'text-red-500 hover:text-red-600'
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${job.saved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{job.posted}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{job.applicants} applicants</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{job.rating}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        applyToJob(job.id);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Job Details */}
          <div className="lg:col-span-1">
            {selectedJob ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-32">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building className="h-8 w-8 text-gray-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedJob.title}</h2>
                        <p className="text-gray-600 font-medium">{selectedJob.company}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{selectedJob.rating}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <ExternalLink className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Job Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="text-gray-900">{selectedJob.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="text-gray-900">{selectedJob.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Salary:</span>
                          <span className="text-gray-900">{selectedJob.salary}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Posted:</span>
                          <span className="text-gray-900">{selectedJob.posted}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-700 text-sm leading-relaxed">{selectedJob.description}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
                      <ul className="space-y-1">
                        {selectedJob.requirements.map((req, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Benefits</h3>
                      <ul className="space-y-1">
                        {selectedJob.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={() => applyToJob(selectedJob.id)}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Apply Now
                      </button>
                      <button
                        onClick={() => toggleSaveJob(selectedJob.id)}
                        className={`p-3 border rounded-lg transition-colors ${
                          selectedJob.saved
                            ? 'border-red-500 text-red-500 hover:bg-red-50'
                            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${selectedJob.saved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-gray-500">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a job to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};