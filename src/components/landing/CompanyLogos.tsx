'use client';

import Image from "next/image";
import { motion } from "framer-motion";

const companies = [
  { name: "Google", logo: "/logos/google.png" },
  { name: "Microsoft", logo: "/logos/microsoft.webp" },
  { name: "Amazon", logo: "/logos/amazon.png" },
  { name: "Meta", logo: "/logos/meta.png" },
  { name: "Netflix", logo: "/logos/netflix.png" },
];

export function CompanyLogos() {
  return (
    <section className="relative py-16 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Social proof section - Trusted by companies */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-xl text-gray-400 mb-8">Used by professionals who have worked at</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 max-w-4xl mx-auto opacity-80">
            {companies.map((company, index) => (
              <div key={index} className="w-24 h-12 relative transition-all duration-300">
                <Image 
                  src={company.logo} 
                  alt={company.name} 
                  fill
                  className="object-contain filter grayscale brightness-0 invert opacity-60 hover:opacity-80 transition-opacity duration-300" 
                  sizes="100px"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
