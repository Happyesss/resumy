// This file contains reusable form components

import React, { InputHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  error, 
  icon, 
  className = '',
  ...props 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {icon}
          </div>
        )}
        <input
          className={`w-full ${icon ? 'pl-10' : 'px-3'} pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <div className="mt-1 flex items-center text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 resize-none ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && (
        <div className="mt-1 flex items-center text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: Array<{value: string; label: string}>;
}

export const FormSelect: React.FC<FormSelectProps> = ({ 
  label, 
  error, 
  options, 
  className = '', 
  ...props 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <div className="mt-1 flex items-center text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

interface FormCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({ 
  label, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${className}`}
        {...props}
      />
      <label className="ml-2 block text-sm text-gray-700">
        {label}
      </label>
    </div>
  );
};
