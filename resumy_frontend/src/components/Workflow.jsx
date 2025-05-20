import Resume from "../assets/resume.png";
import { checklistItems } from "../constants";

const Workflow = () => {
  return (
    <div className="mt-20 px-4">
      <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center mt-6 tracking-wide">
        Transform your{" "}
        <span className="bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
          job search
        </span>
      </h2>
      <p className="text-center text-xl text-neutral-400 max-w-3xl mx-auto mt-6">
        Our AI-powered platform streamlines every step of creating the perfect resume that gets noticed
      </p>
      
      <div className="flex flex-wrap justify-center items-center mt-12">
        <div className="p-2 w-full lg:w-1/2">
          <img 
            src={Resume}
            alt="Resume Analysis" 
            className="rounded-xl shadow-lg shadow-blue-500/20 border border-blue-500/20"
          />
        </div>
        <div className="pt-6 w-full lg:w-1/2">
          {checklistItems.map((item, index) => (
            <div key={index} className="flex mb-8 group">
              <div className="text-blue-500 mx-6 bg-blue-500/10 h-12 w-12 p-2 flex justify-center items-center rounded-lg group-hover:bg-blue-500/20 transition-all">
                {item.icon}
              </div>
              <div className="max-w-md">
                <h5 className="mt-1 mb-2 text-xl font-medium text-white">{item.title}</h5>
                <p className="text-md text-neutral-400">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Workflow;