import { useState, useRef, useEffect } from "react";
import BlockField from "../components/BlockField";
import templates from "../config/resumeTemplates";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FiDownload, FiPlus, FiChevronLeft, FiChevronRight, FiX, FiEdit2, FiTrash2 } from "react-icons/fi";

const fieldTypes = [
  { value: "text", label: "Text Field" },
  { value: "textarea", label: "Text Area" },
  { value: "bullets", label: "Bullet List" }
];

function AddFieldModal({ open, onClose, onAdd }) {
  const [type, setType] = useState("text");
  const [label, setLabel] = useState("");
  const [placeholder, setPlaceholder] = useState("");

  return open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-100"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add New Field</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Field Type</label>
            <select
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              {fieldTypes.map(ft => (
                <option key={ft.value} value={ft.value}>{ft.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="e.g. 'Work Experience'"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={placeholder}
              onChange={e => setPlaceholder(e.target.value)}
              placeholder="e.g. 'Describe your experience'"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            disabled={!label}
            onClick={() => {
              onAdd({
                name: `custom_${Date.now()}`,
                label,
                type,
                placeholder,
                custom: true,
                repeatable: type === "bullets"
              });
              setLabel("");
              setPlaceholder("");
              setType("text");
              onClose();
            }}
          >
            Add Field
          </button>
        </div>
      </motion.div>
    </div>
  ) : null;
}

const ResumePreview = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [formData, setFormData] = useState(templates[0].dummy);
  const [fieldPage, setFieldPage] = useState(0);
  const [customFields, setCustomFields] = useState(
    templates.map(() => [])
  );
  const [removedFields, setRemovedFields] = useState(
    templates.map(() => [])
  );
  const [showModal, setShowModal] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);

  useEffect(() => {
    // Simple mobile detection (width or user agent)
    const isMobile = () =>
      window.innerWidth < 640 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile()) setShowMobileModal(true);
    else setShowMobileModal(false);

    const handleResize = () => {
      if (isMobile()) setShowMobileModal(true);
      else setShowMobileModal(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show all fields (built-in + custom) except those removed for this template
  const fields = [
    ...templates[selectedTemplate].fields.filter(
      f => !(removedFields[selectedTemplate] || []).includes(f.name)
    ),
    ...(customFields[selectedTemplate] || [])
  ];

  const TemplateComponent = templates[selectedTemplate].component;
  const fieldsPerPage = templates[selectedTemplate].fieldsPerPage || 8;
  const totalPages = Math.ceil(fields.length / fieldsPerPage);
  const currentFields = fields.slice(fieldPage * fieldsPerPage, (fieldPage + 1) * fieldsPerPage);

  // Add a new custom field
  const handleAddField = (newField) => {
    setCustomFields(prev => {
      const updated = [...prev];
      updated[selectedTemplate] = [...(updated[selectedTemplate] || []), newField];
      return updated;
    });
  };

  // Remove a field (custom or built-in) for this template only
  const handleRemoveField = (fieldName) => {
    // Remove custom field if present
    setCustomFields(prev => {
      const updated = [...prev];
      updated[selectedTemplate] = (updated[selectedTemplate] || []).filter(f => f.name !== fieldName);
      return updated;
    });
    // Remove built-in field for this template (hide it)
    if (templates[selectedTemplate].fields.some(f => f.name === fieldName)) {
      setRemovedFields(prev => {
        const updated = [...prev];
        updated[selectedTemplate] = [...(updated[selectedTemplate] || []), fieldName];
        return updated;
      });
    }
    // Remove from formData
    setFormData(prev => {
      const copy = { ...prev };
      delete copy[fieldName];
      return copy;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBulletsChange = (name, arr) => {
    setFormData(prev => ({
      ...prev,
      [name]: arr
    }));
  };

  const previewRef = useRef();

  const handleDownloadPDF = async () => {
    const previewNode = previewRef.current;
    if (!previewNode) return;
    
    const loader = document.createElement('div');
    loader.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
    loader.innerHTML = '<div class="bg-white p-6 rounded-lg shadow-xl"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div><p class="mt-3 text-gray-700">Generating PDF...</p></div>';
    document.body.appendChild(loader);
    
    try {
      const resumeNode = previewNode.firstElementChild;
      if (!resumeNode) return;
      
      const canvas = await html2canvas(resumeNode, { 
        scale: 2, 
        backgroundColor: "#fff",
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgProps = {
        width: canvas.width,
        height: canvas.height
      };
      
      const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
      const imgWidth = imgProps.width * ratio;
      const imgHeight = imgProps.height * ratio;
      const y = (pageHeight - imgHeight) / 2;
      
      pdf.addImage(imgData, "PNG", (pageWidth - imgWidth) / 2, y, imgWidth, imgHeight);
      pdf.save("resume.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      document.body.removeChild(loader);
    }
  };

  return (
    <>
      {/* Mobile Block Modal */}
      {showMobileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center text-center border border-gray-200">
            <svg width="48" height="48" fill="none" className="mb-4 text-blue-500" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="14" rx="2" fill="#3B82F6" opacity="0.1"/>
              <rect x="3" y="4" width="18" height="14" rx="2" stroke="#3B82F6" strokeWidth="2"/>
              <rect x="8" y="20" width="8" height="2" rx="1" fill="#3B82F6"/>
            </svg>
            <h2 className="text-lg font-semibold mb-2 text-blue-700">Switch to Desktop</h2>
            <p className="text-gray-600 text-sm mb-4">
              Resume editing and preview is best experienced on a desktop or laptop. Please use a larger screen. Mobile format is not supported yet.
            </p>
            <button
              className="mt-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
              onClick={() => setShowMobileModal(false)}
            >
              Continue Anyway
            </button>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        <AddFieldModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onAdd={handleAddField}
        />
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form Section - Left */}
          <div className="w-full lg:w-1/3 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6 rounded-xl shadow-lg border border-blue-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-blue-800 mb-1">Resume Builder</h2>
              <p className="text-blue-500 text-sm">Fill in your details and see real-time preview</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-blue-700 mb-2">Template Selection</label>
              <div className="relative">
                <select
                  className="w-full pl-3 pr-10 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjJ2M3Y0IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtaGVscGVycyI+PHBvbHlsaW5lIHBvaW50cz0iNiA5IDEyIDE1IDE4IDkiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_0.75rem] bg-[length:1.25rem_1.25rem] text-orange-500"
                  value={selectedTemplate}
                  onChange={e => {
                    setSelectedTemplate(Number(e.target.value));
                    setFormData(templates[Number(e.target.value)].dummy);
                    setFieldPage(0);
                  }}
                >
                  {templates.map((tpl, idx) => (
                    <option value={idx} key={tpl.name}>{tpl.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-blue-700">Resume Sections</h3>
                <span className="text-xs text-blue-400">
                  Page {fieldPage + 1} of {totalPages}
                </span>
              </div>
              
              {currentFields.map(field => (
                <div key={field.name} className="relative group">
                  <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      className="p-1.5 bg-white rounded-full shadow-sm border border-blue-200 text-red-500 hover:bg-red-50 transition-colors"
                      onClick={() => handleRemoveField(field.name)}
                      title="Remove this field"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                  
                  {field.type === "bullets" ? (
                    <BlockField
                      value={formData[field.name]}
                      onChange={arr => handleBulletsChange(field.name, arr)}
                      label={field.label}
                      placeholder={field.placeholder}
                    />
                  ) : field.type === "textarea" ? (
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1.5">{field.label}</label>
                      <textarea
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-blue-200 bg-blue-50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all placeholder-gray-400 text-black"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1.5">{field.label}</label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-blue-200 bg-blue-50 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all placeholder-gray-400 text-black"
                        placeholder={field.placeholder}
                      />
                    </div>
                  )}
                </div>
              ))}
              
              <div className="flex items-center justify-between pt-2">
                <button
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                  onClick={() => setFieldPage(p => Math.max(0, p - 1))}
                  disabled={fieldPage === 0}
                >
                  <FiChevronLeft size={16} />
                  Previous
                </button>
                
                <button
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-colors shadow-sm"
                  onClick={() => setShowModal(true)}
                >
                  <FiPlus size={16} />
                  Add Custom Field
                </button>
                
                <button
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                  onClick={() => setFieldPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={fieldPage === totalPages - 1}
                >
                  Next
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
            
            <div className="mt-8 pt-5 border-t border-blue-200">
              <button
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-lg shadow-md transition-all"
                onClick={handleDownloadPDF}
                type="button"
              >
                <FiDownload size={18} />
                Download PDF Resume
              </button>
            </div>
          </div>
          
          {/* Resume Preview - Right */}
          <div className="w-full lg:w-2/3">
            <div className="sticky top-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Live Preview</h3>
                  <div className="flex gap-2">
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                      onClick={() => {
                        const next = (selectedTemplate + 1) % templates.length;
                        setSelectedTemplate(next);
                        setFormData(templates[next].dummy);
                        setFieldPage(0);
                      }}
                    >
                      <FiEdit2 size={14} />
                      Change Template
                    </button>
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                      onClick={handleDownloadPDF}
                      type="button"
                    >
                      <FiDownload size={14} />
                      Download
                    </button>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50" ref={previewRef}>
                  <TemplateComponent data={formData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumePreview;