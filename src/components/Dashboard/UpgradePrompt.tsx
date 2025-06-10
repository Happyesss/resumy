import React from 'react';
import { Database } from '../../types/database';

type Profile = Database['public']['Tables']['users']['Row'];

interface UpgradePromptProps {
  profile?: Profile;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({ profile }) => {
  if (profile?.subscription_tier !== 'free') {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
      <h3 className="text-lg font-semibold mb-2">Upgrade to Pro</h3>
      <p className="text-blue-100 text-sm mb-4">
        Unlock premium templates, advanced features, and unlimited downloads.
      </p>
      <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm">
        Upgrade Now
      </button>
    </div>
  );
};
