import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BlockField = ({ value = [], onChange, label, placeholder = "Enter bullet point" }) => {
  const [focusedIndex, setFocusedIndex] = useState(null);

  const handleBulletChange = (idx, v) => {
    const arr = [...value];
    arr[idx] = v;
    onChange(arr);
  };

  const addBullet = () => {
    onChange([...(value || []), ""]);
    setFocusedIndex(value.length);
  };

  const removeBullet = (idx) => {
    onChange(value.filter((_, i) => i !== idx));
    if (focusedIndex === idx && idx > 0) {
      setFocusedIndex(idx - 1);
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addBullet();
    } else if (e.key === "Backspace" && value[idx] === "" && idx > 0) {
      e.preventDefault();
      removeBullet(idx);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <button
          type="button"
          onClick={addBullet}
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Point
        </button>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {(value || []).map((bullet, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-start group"
            >
              <div className="flex items-center h-5 mt-1.5 mr-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => handleBulletChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onFocus={() => setFocusedIndex(idx)}
                  className={`w-full px-3 py-2 border ${
                    focusedIndex === idx ? "border-indigo-500 ring-1 ring-indigo-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-150 placeholder-black`}
                  placeholder={placeholder}
                  autoFocus={focusedIndex === idx}
                />
                <button
                  type="button"
                  onClick={() => removeBullet(idx)}
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity duration-150"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {value?.length > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Enter</kbd> to add new point,{" "}
          <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Backspace</kbd> on empty to remove
        </div>
      )}
    </div>
  );
};

export default BlockField;