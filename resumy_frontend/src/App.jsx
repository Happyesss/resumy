import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Resume from './pages/Resume';
import ResumePreview from './pages/ResumePreview';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/resume" element={<Resume />} />
        <Route path="/resume-preview" element={<ResumePreview />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;