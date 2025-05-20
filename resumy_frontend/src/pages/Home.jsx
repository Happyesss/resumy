// src/pages/Home.jsx
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import Workflow from "../components/Workflow";
import Testimonials from "../components/Testimonials";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto pt-20 px-6">
      <HeroSection />
      <FeatureSection />
      <Workflow />
      <Testimonials />
    </div>
  );
};

export default Home;