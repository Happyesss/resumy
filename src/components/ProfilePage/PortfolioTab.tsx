// PortfolioTab.tsx
import { ErrorBanner } from '../ErrorBanner';

const PortfolioTab = ({
  projects,
  isEditing,
  errorMessages,
  setErrorMessages
}: any) => (
  <div className="space-y-6">
    <ErrorBanner 
      message={errorMessages.projects || ""}
      onDismiss={() => setErrorMessages((prev: any) => ({ ...prev, projects: '' }))} 
    />
    {projects.length === 0 ? (
      <div className="text-center py-12 text-gray-500">
        <p>No projects added yet.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Render project cards here */}
      </div>
    )}
    {isEditing && projects.length > 0 && (
      <div className="flex justify-end">
        {/* Add save button or actions if needed */}
      </div>
    )}
  </div>
);

export default PortfolioTab;
