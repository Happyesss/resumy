import { useState, useRef } from 'react';
import { FiUpload, FiFileText, FiAward, FiBarChart2, FiCheckCircle, FiEdit2, FiTrendingUp } from 'react-icons/fi';
import aiChip from '../assets/aiChip.png';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Send PDF and job description to backend for analysis
  const handleUpload = async () => {
    if (!file || !jobDesc.trim()) return;
    setIsLoading(true);
    setAnalysis(null);
    setError('');

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDesc);

    try {
      const res = await fetch("https://ats-api-m949.onrender.com/analyze-resume", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        let errorMsg = "Failed to analyze resume";
        try {
          const errJson = await res.json();
          if (errJson && errJson.error) {
            errorMsg = `Error: ${errJson.error}`;
          }
        } catch {
          errorMsg = res.statusText || errorMsg;
        }
        setError(errorMsg);
        setIsLoading(false);
        return;
      }
      const result = await res.json();

      // Parse the analysis JSON string from backend
      let parsed = {};
      try {
        parsed = JSON.parse(result.analysis);
      } catch {
        setError("Could not parse analysis result.");
        setIsLoading(false);
        return;
      }

      setAnalysis({
        overall_match_percentage: parsed.overall_match_percentage,
        key_skills_match: parsed.key_skills_match,
        experience_relevance: parsed.experience_relevance,
        missing_qualifications: parsed.missing_qualifications,
        suggestions_for_improvement: parsed.suggestions_for_improvement,
        extracted_text: result.extracted_text,
        extracted_skills: parsed.extracted_skills 
          ? parsed.extracted_skills 
          : (parsed.key_skills_match 
              ? parsed.key_skills_match
                  .split(/[\n,]+/)
                  .map(s => s.trim())
                  .filter(Boolean)
              : []),
      });
    } catch (err) {
      setError("Network or server error.");
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated gradient background elements */}
      <div className="fixed inset-0 overflow-hidden opacity-20">
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img src={aiChip} alt="AI Technology" className="h-24 w-24 object-contain" />
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            AI Resume Excellence
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Upload your resume for instant <span className="text-blue-400">ATS optimization</span> and <span className="text-purple-400">hiring insights</span>
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden mb-16 border border-gray-700">
          <div className="p-8 sm:p-10">
            <div 
              onClick={triggerFileInput}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all 
                ${file ? 'border-green-500 bg-gray-900/50' : 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/30'}`}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              
              {file ? (
                <div className="flex flex-col items-center">
                  <FiCheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium text-white">{file.name}</h3>
                  <p className="mt-1 text-sm text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="mt-4 text-sm text-red-400 hover:text-red-300"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <FiUpload className="h-12 w-12 text-blue-400" />
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-purple-500 rounded-full animate-ping"></div>
                  </div>
                  <h3 className="text-lg font-medium text-white">Drag and drop your resume</h3>
                  <p className="mt-1 text-sm text-gray-400">or click to browse files (PDF or Word)</p>
                  <p className="text-xs text-gray-500 mt-6">We support all standard resume formats</p>
                </div>
              )}
            </div>

            {/* Job Description Input */}
            <div className="mt-8">
              <label className="block text-gray-300 font-medium mb-2" htmlFor="job-desc">
                Paste Job Description <span className="text-red-400">*</span>
              </label>
              <textarea
                id="job-desc"
                rows={5}
                className="w-full rounded-lg bg-gray-900 border border-gray-700 text-gray-100 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paste the job description here for best results..."
                value={jobDesc}
                onChange={e => setJobDesc(e.target.value)}
                required
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || !jobDesc.trim() || isLoading}
              className={`mt-6 w-full py-3 px-4 rounded-lg font-medium text-white transition-all flex items-center justify-center
                ${!file || !jobDesc.trim() ? 'bg-gray-700 cursor-not-allowed text-gray-500' : 
                  isLoading ? 'bg-indigo-700 cursor-wait' : 
                  'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg'}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : 'Analyze My Resume'}
            </button>
            {error && <div className="mt-4 text-red-400 text-sm">{error}</div>}
          </div>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Score Card */}
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 lg:col-span-1 flex flex-col">
              <div>
                <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <h2 className="text-xl font-bold flex items-center">
                    <FiTrendingUp className="mr-2" /> Match Percentage
                  </h2>
                </div>
                <div className="p-6 flex flex-col items-center">
                  <div className="relative w-48 h-48 mb-6">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-gray-700"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-green-500"
                        strokeWidth="8"
                        strokeDasharray={`${parseFloat(analysis.overall_match_percentage) * 2.51}, 251`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
                        {analysis.overall_match_percentage}
                      </span>
                      <span className="text-sm text-gray-400">match with job</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Suggestions for Improvement directly below match percentage */}
              <div className="mt-6">
                <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
                  <h2 className="text-xl font-bold flex items-center">
                    <FiEdit2 className="mr-2" /> Suggestions for Improvement
                  </h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-100 whitespace-pre-line">{analysis.suggestions_for_improvement}</p>
                </div>
              </div>
            </div>
            {/* Analysis Details */}
            <div className="space-y-6 lg:col-span-2">
              <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <h2 className="text-xl font-bold flex items-center">
                    <FiAward className="mr-2" /> Key Skills Match
                  </h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-100 whitespace-pre-line">{analysis.key_skills_match}</p>
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <h2 className="text-xl font-bold flex items-center">
                    <FiBarChart2 className="mr-2" /> Experience Relevance
                  </h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-100 whitespace-pre-line">{analysis.experience_relevance}</p>
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <h2 className="text-xl font-bold flex items-center">
                    <FiEdit2 className="mr-2" /> Missing Qualifications
                  </h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-100 whitespace-pre-line">{analysis.missing_qualifications}</p>
                </div>
              </div>
              {/* Extracted Skills */}
              {analysis.extracted_skills && analysis.extracted_skills.length > 0 && (
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
                  <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <h2 className="text-xl font-bold flex items-center">
                      <FiFileText className="mr-2" /> Extracted Skills from Resume
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(analysis.extracted_skills)
                        ? analysis.extracted_skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-full bg-blue-900/50 text-blue-200 border border-blue-700 text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))
                        : <span className="text-gray-300">{analysis.extracted_skills}</span>
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-2">Professional-Grade Analysis</h2>
          <p className="text-gray-400 max-w-3xl mx-auto mb-12">
            Our AI examines your resume against 20+ hiring criteria used by top employers
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiFileText className="h-8 w-8 text-blue-400" />,
                title: "ATS Compatibility",
                description: "Optimized for applicant tracking systems",
                bg: "bg-blue-900/20"
              },
              {
                icon: <FiBarChart2 className="h-8 w-8 text-purple-400" />,
                title: "Competitive Benchmarking",
                description: "See how you compare to successful candidates",
                bg: "bg-purple-900/20"
              },
              {
                icon: <FiAward className="h-8 w-8 text-green-400" />,
                title: "Interview Probability",
                description: "Get your estimated callback rate",
                bg: "bg-green-900/20"
              }
            ].map((feature, index) => (
              <div key={index} className={`${feature.bg} p-8 rounded-xl border border-gray-700 backdrop-blur-sm hover:backdrop-blur-md transition-all`}>
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-gray-800/50 border border-gray-700">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;