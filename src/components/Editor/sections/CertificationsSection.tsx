import React from 'react';
import { Award, Plus, Trash2 } from 'lucide-react';
import { ResumeData, Certification } from '../../../types/resume';
import { ActionButtons } from '../ActionButtons';

interface CertificationsSectionProps {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  data,
  onUpdate
}) => {
  const { certifications } = data;

  const addCertification = () => {
    const newCertification: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: ''
    };
    onUpdate({
      certifications: [...certifications, newCertification]
    });
  };

  const updateCertification = (id: string, field: string, value: string) => {
    onUpdate({
      certifications: certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    });
  };

  const removeCertification = (id: string) => {
    onUpdate({
      certifications: certifications.filter(cert => cert.id !== id)
    });
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6 transition-all duration-200 hover:border-gray-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Award className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Certifications</h2>
        </div>
        <ActionButtons
          onAdd={addCertification}
          addLabel="Add Certification"
        />
      </div>

      <div className="space-y-6">
        {certifications.map((cert, index) => (
          <div key={cert.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">
                Certification {index + 1}
              </span>
              <button
                onClick={() => removeCertification(cert.id)}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certification Name *
                </label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="AWS Certified Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Amazon Web Services"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Date *
                </label>
                <input
                  type="month"
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date (Optional)
                </label>
                <input
                  type="month"
                  value={cert.expiryDate || ''}
                  onChange={(e) => updateCertification(cert.id, 'expiryDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credential ID (Optional)
                </label>
                <input
                  type="text"
                  value={cert.credentialId || ''}
                  onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="AWS-123456789"
                />
              </div>
            </div>
          </div>
        ))}

        {certifications.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No certifications added yet</p>
            <p className="text-sm">Click "Add Certification" to showcase your credentials</p>
          </div>
        )}
      </div>
    </div>
  );
};