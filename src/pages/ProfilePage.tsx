import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  fetchWorkExperience, 
  updateWorkExperience, 
  fetchEducation, 
  updateEducation, 
  fetchSkills, 
  updateSkills, 
  fetchProjects, 
  updateProjects, 
  WorkExperience, 
  Education, 
  Skill, 
  Project 
} from '../lib/profile';
import { 
  validatePersonalInfo, 
  validateWorkExperience, 
  validateEducation, 
  validateSkill, 
  validateProject 
} from '../utils/validation';
import { ErrorBanner } from '../components/ErrorBanner';
import { SuccessBanner } from '../components/SuccessBanner';
import { createOfflineStorage } from '../utils/offlineStorage';
import ProfileHeader from '../components/ProfilePage/ProfileHeader';
import ProfileCompletion from '../components/ProfilePage/ProfileCompletion';
import ProfileTabs from '../components/ProfilePage/ProfileTabs';
import PersonalInfoTab from '../components/ProfilePage/PersonalInfoTab';
import ExperienceTab from '../components/ProfilePage/ExperienceTab';
import EducationTab from '../components/ProfilePage/EducationTab';
import SkillsTab from '../components/ProfilePage/SkillsTab';
import PortfolioTab from '../components/ProfilePage/PortfolioTab';

export const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize page loading
  useEffect(() => {
    if (user && profile) {
      setPageLoading(false);
    }
  }, [user, profile]);

  // Reset success message after 3 seconds
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  // Get first and last name from full_name
  const getNameParts = () => {
    if (!profile?.full_name) return { firstName: '', lastName: '' };
    const nameParts = profile.full_name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    return { firstName, lastName };
  };

  // Profile data state
  const [profileData, setProfileData] = useState(() => {
    const { firstName, lastName } = getNameParts();
    return {
      firstName,
      lastName,
      email: user?.email || '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      bio: '',
      profileImage: profile?.avatar_url || ''
    };
  });
  
  // Update profile data when user or profile changes
  useEffect(() => {
    if (user && profile) {
      const { firstName, lastName } = getNameParts();
      setProfileData(prevData => ({
        ...prevData,
        firstName,
        lastName,
        email: user.email || '',
        profileImage: profile.avatar_url || '',
        // Keep existing values for fields that might not be in the basic profile schema
      }));
    }
  }, [user, profile]);

  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  const [loadingData, setLoadingData] = useState({
    workExperience: false,
    education: false,
    skills: false,
    projects: false
  });
  
  const [errorMessages, setErrorMessages] = useState<{[key: string]: string}>({});
  
  // Form validation state
  const [validationErrors, setValidationErrors] = useState<{
    personal: Record<string, string>;
    workExperience: { [key: string]: Record<string, string> };
    education: { [key: string]: Record<string, string> };
    skills: { [key: string]: Record<string, string> };
    projects: { [key: string]: Record<string, string> };
  }>({
    personal: {},
    workExperience: {},
    education: {},
    skills: {},
    projects: {}
  });

  // Initialize offline storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Add event listeners for online/offline events
      const handleOffline = () => {
        console.log('App is offline');
      };
      const handleOnline = () => {
        console.log('App is back online');
        
        // Sync any pending changes when coming back online
        if (user) {
          syncOfflineData();
        }
      };
      window.addEventListener('offline', handleOffline);
      window.addEventListener('online', handleOnline);
      
      return () => {
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('online', handleOnline);
      };
    }
  }, [user]);
  
  // Create storage instances for each data type
  const workExperienceStorage = createOfflineStorage<WorkExperience[]>('work_experience');
  const educationStorage = createOfflineStorage<Education[]>('education');
  const skillsStorage = createOfflineStorage<Skill[]>('skills');
  const projectsStorage = createOfflineStorage<Project[]>('projects');
  const profileStorage = createOfflineStorage<any>('profile');
  
  // Function to sync all offline data
  const syncOfflineData = async () => {
    if (!user || !navigator.onLine) return;
    try {
      setLoading(true);
      const pendingChanges = {
        ...workExperienceStorage.getPendingChanges(),
        ...educationStorage.getPendingChanges(),
        ...skillsStorage.getPendingChanges(),
        ...projectsStorage.getPendingChanges(),
        ...profileStorage.getPendingChanges()
      };
      if (Object.keys(pendingChanges).length === 0) {
        console.log('No pending changes to sync');
        return;
      }
      console.log('Syncing pending changes', pendingChanges);
      // Work experience changes
      const workExpChanges = workExperienceStorage.getPendingChanges();
      if (Object.keys(workExpChanges).length > 0) {
        try {
          await updateWorkExperience(user.id, workExperience);
          Object.keys(workExpChanges).forEach(key => workExperienceStorage.clearPendingChange(key));
        } catch (error) {
          setErrorMessages(prev => ({ ...prev, workExperience: 'Failed to sync work experience' }));
        }
      }
      // Education changes
      const educationChanges = educationStorage.getPendingChanges();
      if (Object.keys(educationChanges).length > 0) {
        try {
          await updateEducation(user.id, education);
          Object.keys(educationChanges).forEach(key => educationStorage.clearPendingChange(key));
        } catch (error) {
          setErrorMessages(prev => ({ ...prev, education: 'Failed to sync education' }));
        }
      }
      // Skills changes
      const skillChanges = skillsStorage.getPendingChanges();
      if (Object.keys(skillChanges).length > 0) {
        try {
          await updateSkills(user.id, skills);
          Object.keys(skillChanges).forEach(key => skillsStorage.clearPendingChange(key));
        } catch (error) {
          setErrorMessages(prev => ({ ...prev, skills: 'Failed to sync skills' }));
        }
      }
      // Projects changes
      const projectChanges = projectsStorage.getPendingChanges();
      if (Object.keys(projectChanges).length > 0) {
        try {
          await updateProjects(user.id, projects);
          Object.keys(projectChanges).forEach(key => projectsStorage.clearPendingChange(key));
        } catch (error) {
          setErrorMessages(prev => ({ ...prev, projects: 'Failed to sync projects' }));
        }
      }
      // Profile changes
      const profileChanges = profileStorage.getPendingChanges();
      if (Object.keys(profileChanges).length > 0 && profile) {
        const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();
        try {
          await updateProfile({ full_name: fullName, avatar_url: profileData.profileImage });
          Object.keys(profileChanges).forEach(key => profileStorage.clearPendingChange(key));
        } catch (error) {
          setErrorMessages(prev => ({ ...prev, profile: 'Failed to sync profile' }));
        }
      }
      setSaveSuccess(true);
    } catch (error) {
      console.error('Error syncing offline data:', error);
      setErrorMessages(prev => ({ ...prev, sync: 'Failed to sync offline changes' }));
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile data from the database
  useEffect(() => {
    if (user) {
      // Fetch work experience
      setLoadingData(prev => ({ ...prev, workExperience: true }));
      fetchWorkExperience(user.id)
        .then(data => {
          setWorkExperience(data);
          setErrorMessages(prev => ({ ...prev, workExperience: '' }));
        })
        .catch(error => {
          console.error('Error fetching work experience:', error);
          setErrorMessages(prev => ({ 
            ...prev, 
            workExperience: 'Failed to load work experience. Please try again later.'
          }));
        })
        .finally(() => setLoadingData(prev => ({ ...prev, workExperience: false })));
      
      // Fetch education
      setLoadingData(prev => ({ ...prev, education: true }));
      fetchEducation(user.id)
        .then(data => {
          setEducation(data);
          setErrorMessages(prev => ({ ...prev, education: '' }));
        })
        .catch(error => {
          console.error('Error fetching education:', error);
          setErrorMessages(prev => ({ 
            ...prev, 
            education: 'Failed to load education history. Please try again later.'
          }));
        })
        .finally(() => setLoadingData(prev => ({ ...prev, education: false })));
      
      // Fetch skills
      setLoadingData(prev => ({ ...prev, skills: true }));
      fetchSkills(user.id)
        .then(data => {
          setSkills(data);
          setErrorMessages(prev => ({ ...prev, skills: '' }));
        })
        .catch(error => {
          console.error('Error fetching skills:', error);
          setErrorMessages(prev => ({ 
            ...prev, 
            skills: 'Failed to load skills. Please try again later.'
          }));
        })
        .finally(() => setLoadingData(prev => ({ ...prev, skills: false })));
      
      // Fetch projects
      setLoadingData(prev => ({ ...prev, projects: true }));
      fetchProjects(user.id)
        .then(data => {
          setProjects(data);
          setErrorMessages(prev => ({ ...prev, projects: '' }));
        })
        .catch(error => {
          console.error('Error fetching projects:', error);
          setErrorMessages(prev => ({ 
            ...prev, 
            projects: 'Failed to load portfolio projects. Please try again later.'
          }));
        })
        .finally(() => setLoadingData(prev => ({ ...prev, projects: false })));
    }
  }, [user]);

  // We're now using saveAllProfileData for all saving operations

  const addWorkExperience = () => {
    const newExp: WorkExperience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setWorkExperience([...workExperience, newExp]);
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: '',
      school: '',
      location: '',
      startDate: '',
      endDate: ''
    };
    setEducation([...education, newEdu]);
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 'Intermediate'
    };
    setSkills([...skills, newSkill]);
  };
  
  const updateSkill = (id: string, updates: Partial<Skill>) => {
    setSkills(skills.map(skill => 
      skill.id === id ? { ...skill, ...updates } : skill
    ));
  };

  const deleteWorkExperience = (id: string) => {
    setWorkExperience(experiences => experiences.filter(exp => exp.id !== id));
  };

  const deleteEducation = (id: string) => {
    setEducation(items => items.filter(item => item.id !== id));
  };

  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setLoading(true);
      
      // Clear any previous error messages
      setErrorMessages(prev => ({ ...prev, profileImage: '' }));
      
      // Import required functions
      const { uploadFile, getPublicUrl } = await import('../lib/supabase');
      const { optimizeImage } = await import('../utils/imageUtils');
      
      // Optimize the image before uploading (resize to max 500px, 85% quality)
      const optimizedFile = await optimizeImage(file, 500, 0.85);
      
      // Upload the optimized file to Supabase storage
      const filePath = `profile_images/${user.id}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      
      try {
        await uploadFile('public', filePath, optimizedFile);
      } catch (uploadError: any) {
        console.error('Upload error details:', uploadError);
        
        // Check if it's a bucket not found error
        if (uploadError.message?.includes('Bucket not found') || 
            uploadError.message?.includes('bucket') ||
            (uploadError.statusCode === 404 || uploadError.status === 404)) {
          throw new Error('Storage bucket not configured. Please contact support or check your Supabase project setup.');
        }
        
        // Re-throw other errors
        throw uploadError;
      }
      
      // Get the public URL
      const imageUrl = getPublicUrl('public', filePath);
      
      // Update the profile data state
      setProfileData({
        ...profileData,
        profileImage: imageUrl
      });
      
      // Update the profile in the database
      if (profile) {
        await updateProfile({
          avatar_url: imageUrl
        });
      }
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      console.error('Error uploading profile image:', error);
      
      let errorMessage = 'Failed to upload profile image. Please try again.';
      
      // Provide more specific error messages
      if (error.message?.includes('Storage bucket not configured')) {
        errorMessage = 'Image upload is not available. The storage system needs to be configured. Please contact support.';
      } else if (error.message?.includes('File too large')) {
        errorMessage = 'The image file is too large. Please choose a smaller image.';
      } else if (error.message?.includes('Invalid file type')) {
        errorMessage = 'Invalid file type. Please choose a JPG, PNG, or WebP image.';
      } else if (!navigator.onLine) {
        errorMessage = 'You are offline. Please check your internet connection and try again.';
      }
      
      setErrorMessages(prev => ({ 
        ...prev, 
        profileImage: errorMessage
      }));
    } finally {
      setLoading(false);
    }
  };
  
  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'portfolio', label: 'Portfolio' }
  ];

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let totalFields = 0;
    let completedFields = 0;
    
    // Personal info fields
    const personalFields = [
      profileData.firstName,
      profileData.lastName,
      profileData.email,
      profileData.phone,
      profileData.location,
      profileData.linkedin,
      profileData.website,
      profileData.bio,
      profileData.profileImage
    ];
    
    totalFields += personalFields.length;
    completedFields += personalFields.filter(field => field && field.trim() !== '').length;
    
    // Work experience
    if (workExperience.length > 0) {
      completedFields += 1;
    }
    totalFields += 1;
    
    // Education
    if (education.length > 0) {
      completedFields += 1;
    }
    totalFields += 1;
    
    // Skills
    if (skills.length > 0) {
      completedFields += 1;
    }
    totalFields += 1;
    
    // Projects
    if (projects.length > 0) {
      completedFields += 1;
    }
    totalFields += 1;
    
    return Math.round((completedFields / totalFields) * 100);
  };
  
  const [completionPercentage, setCompletionPercentage] = useState(75);

  // Update completion percentage when data changes
  useEffect(() => {
    setCompletionPercentage(calculateProfileCompletion());
  }, [profileData, workExperience, education, skills, projects]);

  // Validate all form data
  const validateAllForms = (): boolean => {
    // Reset validation errors
    const newValidationErrors: {
      personal: Record<string, string>;
      workExperience: { [key: string]: Record<string, string> };
      education: { [key: string]: Record<string, string> };
      skills: { [key: string]: Record<string, string> };
      projects: { [key: string]: Record<string, string> };
    } = {
      personal: {},
      workExperience: {},
      education: {},
      skills: {},
      projects: {}
    };
    
    // Validate personal info
    const personalValidation = validatePersonalInfo(profileData);
    newValidationErrors.personal = personalValidation.errors;
    
    // Validate work experience
    workExperience.forEach(exp => {
      const result = validateWorkExperience(exp);
      if (!result.isValid) {
        newValidationErrors.workExperience[exp.id] = result.errors;
      }
    });
    
    // Validate education
    education.forEach(edu => {
      const result = validateEducation(edu);
      if (!result.isValid) {
        newValidationErrors.education[edu.id] = result.errors;
      }
    });
    
    // Validate skills
    skills.forEach(skill => {
      const result = validateSkill(skill);
      if (!result.isValid) {
        newValidationErrors.skills[skill.id] = result.errors;
      }
    });
    
    // Validate projects
    projects.forEach(project => {
      const result = validateProject(project);
      if (!result.isValid) {
        newValidationErrors.projects[project.id] = result.errors;
      }
    });
    
    setValidationErrors(newValidationErrors);
    
    // Check if any validation errors exist
    const hasErrors = 
      Object.keys(newValidationErrors.personal).length > 0 ||
      Object.keys(newValidationErrors.workExperience).length > 0 ||
      Object.keys(newValidationErrors.education).length > 0 ||
      Object.keys(newValidationErrors.skills).length > 0 ||
      Object.keys(newValidationErrors.projects).length > 0;
    
    return !hasErrors;
  };

  // Save all profile data
  const saveAllProfileData = async () => {
    try {
      setLoading(true);
      setErrorMessages({});
      
      // Validate all forms before saving
      const isValid = validateAllForms();
      if (!isValid) {
        setErrorMessages(prev => ({
          ...prev,
          validation: 'Please fix the form errors before saving'
        }));
        setLoading(false);
        return;
      }
      
      // Create full_name from firstName and lastName
      const full_name = `${profileData.firstName} ${profileData.lastName}`.trim();
      
      // Create a list of all save operations
      const savePromises: Promise<any>[] = [];
      
      // Save basic profile data
      savePromises.push(
        updateProfile({
          full_name,
          avatar_url: profileData.profileImage,
          // Add more fields as needed
        }).catch(error => {
          console.error('Error updating basic profile:', error);
          setErrorMessages(prev => ({ 
            ...prev, 
            profile: 'Failed to save basic profile information'
          }));
          throw error;
        })
      );
      
      // Save work experience
      if (user) {
        savePromises.push(
          updateWorkExperience(user.id, workExperience).catch(error => {
            console.error('Error updating work experience:', error);
            setErrorMessages(prev => ({ 
              ...prev, 
              workExperience: 'Failed to save work experience'
            }));
            throw error;
          })
        );
        
        // Save education
        savePromises.push(
          updateEducation(user.id, education).catch(error => {
            console.error('Error updating education:', error);
            setErrorMessages(prev => ({ 
              ...prev, 
              education: 'Failed to save education information'
            }));
            throw error;
          })
        );
        
        // Save skills
        savePromises.push(
          updateSkills(user.id, skills).catch(error => {
            console.error('Error updating skills:', error);
            setErrorMessages(prev => ({ 
              ...prev, 
              skills: 'Failed to save skills'
            }));
            throw error;
          })
        );
        
        // Save projects
        savePromises.push(
          updateProjects(user.id, projects).catch(error => {
            console.error('Error updating projects:', error);
            setErrorMessages(prev => ({ 
              ...prev, 
              projects: 'Failed to save portfolio projects'
            }));
            throw error;
          })
        );
      }
      
      // Wait for all save operations to complete
      await Promise.all(savePromises);
      
      // Exit edit mode
      setIsEditing(false);
      setSaveSuccess(true);
    } catch (error) {
      console.error('Failed to save profile data:', error);
      // Keep edit mode open if there was an error
    } finally {
      setLoading(false);
    }
  };

  // Rename local update functions to avoid import conflicts
  const updateWorkExperienceLocal = (id: string, updates: Partial<WorkExperience>) => {
    setWorkExperience(experiences => 
      experiences.map(exp => exp.id === id ? { ...exp, ...updates } : exp)
    );
  };
  const updateEducationLocal = (id: string, updates: Partial<Education>) => {
    setEducation(items => 
      items.map(item => item.id === id ? { ...item, ...updates } : item)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {pageLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      ) : (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SuccessBanner 
          message={saveSuccess ? "Profile updated successfully!" : ""}
          onDismiss={() => setSaveSuccess(false)}
        />
        <ErrorBanner
          message={errorMessages.validation || errorMessages.profile || errorMessages.profileImage || ""}
          onDismiss={() => setErrorMessages(prev => ({ ...prev, validation: '', profile: '', profileImage: '' }))}
        />
        <ProfileHeader
          profileData={profileData}
          user={user}
          isEditing={isEditing}
          loading={loading}
          fileInputRef={fileInputRef}
          handleProfileImageClick={handleProfileImageClick}
          handleProfileImageUpload={handleProfileImageUpload}
          setIsEditing={setIsEditing}
          saveAllProfileData={saveAllProfileData}
          setSaveSuccess={setSaveSuccess}
        />
        <ProfileCompletion completionPercentage={completionPercentage} />
        <div className="bg-white rounded-lg shadow-sm">
          <ProfileTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="p-6">
            {activeTab === 'personal' && (
              <PersonalInfoTab
                profileData={profileData}
                setProfileData={setProfileData}
                isEditing={isEditing}
                validationErrors={validationErrors}
                loading={loading}
                saveAllProfileData={saveAllProfileData}
              />
            )}
            {activeTab === 'experience' && (
              <ExperienceTab
                workExperience={workExperience}
                isEditing={isEditing}
                loading={loading}
                loadingData={loadingData}
                validationErrors={validationErrors}
                addWorkExperience={addWorkExperience}
                updateWorkExperienceLocal={updateWorkExperienceLocal}
                deleteWorkExperience={deleteWorkExperience}
                saveAllProfileData={saveAllProfileData}
                errorMessages={errorMessages}
                setErrorMessages={setErrorMessages}
              />
            )}
            {activeTab === 'education' && (
              <EducationTab
                education={education}
                isEditing={isEditing}
                loading={loading}
                loadingData={loadingData}
                validationErrors={validationErrors}
                addEducation={addEducation}
                updateEducationLocal={updateEducationLocal}
                deleteEducation={deleteEducation}
                saveAllProfileData={saveAllProfileData}
                errorMessages={errorMessages}
                setErrorMessages={setErrorMessages}
              />
            )}
            {activeTab === 'skills' && (
              <SkillsTab
                skills={skills}
                isEditing={isEditing}
                loading={loading}
                loadingData={loadingData}
                validationErrors={validationErrors}
                addSkill={addSkill}
                updateSkill={updateSkill}
                errorMessages={errorMessages}
                setErrorMessages={setErrorMessages}
              />
            )}
            {activeTab === 'portfolio' && (
              <PortfolioTab
                projects={projects}
                isEditing={isEditing}
                errorMessages={errorMessages}
                setErrorMessages={setErrorMessages}
              />
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};