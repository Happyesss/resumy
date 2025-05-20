import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";
import { useRef, useEffect } from "react";

const HeroSection = () => {
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);

  useEffect(() => {
    if (videoRef1.current) videoRef1.current.playbackRate = 2;
    if (videoRef2.current) videoRef2.current.playbackRate = 2;
  }, []);

  return (
    <div className="flex flex-col items-center mt-6 lg:mt-16">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide font-bold">
        Craft Resumes That
        <span className="bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
          {" "}
          Get You Hired
        </span>
      </h1>
      <p className="mt-10 text-xl text-center text-neutral-400 max-w-4xl leading-relaxed">
        Resumy uses AI-powered analysis to transform your resume into a
        <span className="font-semibold text-cyan-400"> job-winning masterpiece</span>.
        Get instant feedback, optimize for ATS, and stand out from the crowd.
      </p>
      <div className="flex justify-center my-10 gap-4">
        <a
          href="http://localhost:5173/resume"
          className="bg-gradient-to-r from-blue-600 to-cyan-500 py-3 px-8 rounded-full text-lg font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
        >
          Analyze Your Resume
        </a>
        <a href="#" className="py-3 px-8 rounded-full border border-gray-700 text-lg font-medium hover:bg-gray-800/50 transition-all duration-300">
          Read docs
        </a>
      </div>
      <div className="flex flex-col lg:flex-row mt-10 justify-center w-full max-w-6xl px-4">
        <div className="relative w-full lg:w-1/2 mx-2 my-4 group">
          <video
            ref={videoRef1}
            autoPlay
            loop
            muted
            className="rounded-xl w-full border border-cyan-500/20 shadow-lg shadow-cyan-500/10 group-hover:shadow-cyan-500/30 transition-all duration-500"
          >
            <source src={video1} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute -bottom-3 -right-3 bg-cyan-500 text-gray-900 px-3 py-1 rounded-lg font-medium text-sm">
            AI Analysis
          </div>
        </div>
        <div className="relative w-full lg:w-1/2 mx-2 my-4 group">
          <video
            ref={videoRef2}
            autoPlay
            loop
            muted
            className="rounded-xl w-full border border-blue-500/20 shadow-lg shadow-blue-500/10 group-hover:shadow-blue-500/30 transition-all duration-500"
          >
            <source src={video2} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute -bottom-3 -right-3 bg-blue-500 text-gray-900 px-3 py-1 rounded-lg font-medium text-sm">
            Smart Templates
          </div>
        </div>
      </div>
      <div className="mt-16 flex flex-wrap justify-center gap-6 max-w-4xl">
        <div className="text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text">98%</div>
          <div className="text-gray-400">ATS Optimization</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text">3x</div>
          <div className="text-gray-400">More Interviews</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text">30s</div>
          <div className="text-gray-400">Quick Analysis</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text">50+</div>
          <div className="text-gray-400">Professional Templates</div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;