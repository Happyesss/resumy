import { features } from "../constants";

const FeatureSection = () => {
  return (
    <div className="relative mt-20 min-h-[800px] max-w-7xl mx-auto px-4">
      <div className="text-center">
        <span className="bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium px-4 py-1.5 uppercase tracking-wider">
          Why Choose Resumy
        </span>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl mt-8 lg:mt-12 tracking-wide">
          Everything you need to{" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
            land interviews
          </span>
        </h2>
        <p className="text-xl text-neutral-400 max-w-3xl mx-auto mt-6">
          Our powerful tools help you create resumes that get noticed by employers and ATS systems
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800 hover:border-blue-500/30 rounded-xl p-8 transition-all duration-300 group"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center mb-6">
                <div className="flex h-12 w-12 p-2 bg-blue-500/10 text-blue-400 justify-center items-center rounded-lg group-hover:bg-blue-500/20 transition-all">
                  {feature.icon}
                </div>
              </div>
              <h5 className="text-xl font-medium mb-3 text-white">{feature.text}</h5>
              <p className="text-md text-neutral-400 flex-grow">
                {feature.description}
              </p>
              <div className="mt-6 pt-6 border-t border-neutral-800">
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center transition-all">
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-20">
        <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3.5 rounded-full font-medium hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
          Explore All Features
        </button>
      </div>
    </div>
  );
};

export default FeatureSection;