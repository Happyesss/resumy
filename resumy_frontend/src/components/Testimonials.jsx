import { testimonials } from "../constants";
import { Star } from "lucide-react";

const Testimonials = () => {
  return (
    <div className="mt-20 tracking-wide px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center my-10 lg:my-20">
          Success <span className="bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">Stories</span>
        </h2>
        <p className="text-center text-xl text-neutral-400 max-w-3xl mx-auto mb-16">
          Hear from job seekers who transformed their careers with Resumy
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-b from-neutral-900 to-neutral-800 rounded-xl p-6 border border-neutral-700 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={20} 
                    className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-neutral-600"} 
                  />
                ))}
              </div>
              <p className="text-lg text-neutral-300 italic mb-6">"{testimonial.text}"</p>
              
              <div className="flex items-center mt-8">
                <img
                  className="w-12 h-12 mr-4 rounded-full border-2 border-cyan-400/50 object-cover"
                  src={testimonial.image}
                  alt={testimonial.user}
                />
                <div>
                  <h6 className="font-medium text-white">{testimonial.user}</h6>
                  <span className="text-sm text-neutral-400">
                    {testimonial.company}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
            Join Our Success Stories
          </button>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;