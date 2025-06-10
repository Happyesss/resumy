// ProfileTabs.tsx
import React from 'react';

interface ProfileTabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ tabs, activeTab, setActiveTab }) => (
  <div className="border-b border-gray-200">
    <nav className="flex space-x-8 px-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  </div>
);

export default ProfileTabs;
