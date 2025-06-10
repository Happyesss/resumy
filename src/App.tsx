import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/resume-builder" 
                element={
                  <ProtectedRoute>
                    <ResumeBuilderPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/resume-builder/:id" 
                element={
                  <ProtectedRoute>
                    <ResumeBuilderPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;