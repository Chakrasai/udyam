import { useState, useEffect } from 'react';

const UdyamRegistrationForm = ({ onRegistrationSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [language, setLanguage] = useState('en'); // Language toggle state
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/form-schema`);
        const data = await response.json();
        setSchema(data);
      } catch (error) {
        console.error('Error fetching schema:', error);
      }
    };
    
    fetchSchema();
  }, [API_BASE_URL]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateField = (field, value) => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return `${field.label} is required`;
    }

    if (field.pattern && value && !new RegExp(field.pattern).test(value)) {
      return `Please enter a valid ${field.label.toLowerCase()}`;
    }

    if (field.maxLength && value && value.length > field.maxLength) {
      return `${field.label} must be less than ${field.maxLength} characters`;
    }

    if (field.type === 'number' && value && (isNaN(value) || value < 0)) {
      return `${field.label} must be a valid positive number`;
    }

    return null;
  };

  const validateStep = (stepNumber) => {
    if (!schema) return true;

    const stepFields = schema[`step${stepNumber}`];
    const stepErrors = {};
    let isValid = true;

    stepFields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        stepErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(stepErrors);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(1) || !validateStep(2)) {
      return;
    }

    setLoading(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: `Registration successful! Registration ID: ${result.registrationId}`
        });
        setFormData({});
        setCurrentStep(1);
        setTimeout(() => {
          onRegistrationSuccess?.();
        }, 2000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Registration failed'
        });
      }
    } catch (err) {
      console.error('Registration error:', err);
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check if the server is running.'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: formData[field.name] || '',
      onChange: (e) => handleInputChange(field.name, e.target.value),
      className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        errors[field.name] ? 'border-red-500' : 'border-gray-300'
      }`,
      placeholder: field.placeholder
    };

    const fieldWrapper = (content) => (
      <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        {content}
        {field.description && (
          <p className="mt-1 text-xs text-gray-500">{field.description}</p>
        )}
        {errors[field.name] && (
          <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
        )}
      </div>
    );

    switch (field.type) {
      case 'checkbox':
        return fieldWrapper(
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id={field.name}
              name={field.name}
              checked={formData[field.name] || false}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="text-sm text-gray-700">
              {field.description && (
                <p className="text-xs leading-relaxed">{field.description}</p>
              )}
            </div>
          </div>
        );
      
      case 'select':
        return fieldWrapper(
          <select {...commonProps}>
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'textarea':
        return fieldWrapper(
          <textarea {...commonProps} rows={3} />
        );
      
      case 'number':
        return fieldWrapper(
          <input {...commonProps} type="number" min={field.min || 0} />
        );

      case 'date':
        return fieldWrapper(
          <input {...commonProps} type="date" />
        );

      case 'email':
        return fieldWrapper(
          <input {...commonProps} type="email" />
        );

      case 'tel':
        return fieldWrapper(
          <input {...commonProps} type="tel" maxLength={field.maxLength} />
        );
      
      default:
        return fieldWrapper(
          <input {...commonProps} type={field.type} maxLength={field.maxLength} />
        );
    }
  };

  if (!schema) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading form...</p>
      </div>
    );
  }

  const currentStepFields = schema[`step${currentStep}`] || [];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Language Toggle */}
      <div className="mb-4 flex justify-end">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              language === 'en' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              language === 'hi' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Government Notice */}
      <div className="mb-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">
              {language === 'hi' ? 'महत्वपूर्ण सूचना' : 'Important Notice'}
            </h3>
            <div className="mt-1 text-sm text-amber-700">
              {language === 'hi' 
                ? 'उद्यम पंजीकरण निःशुल्क है। किसी भी मध्यस्थ या एजेंट को भुगतान न करें।'
                : 'Udyam Registration is FREE. Do not pay any intermediary or agent.'}
            </div>
          </div>
        </div>
      </div>
      {/* Progress Indicator */}
      <div className="mb-8 bg-white rounded-lg shadow-sm p-6 border">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
              currentStep >= 1 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-gray-100 text-gray-400 border-gray-300'
            }`}>
              {currentStep > 1 ? '✓' : '1'}
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-900">
                {language === 'hi' ? 'व्यक्तिगत जानकारी' : 'Personal Information'}
              </p>
              <p className="text-xs text-gray-500">
                {language === 'hi' ? 'आधार और व्यक्तिगत विवरण' : 'Aadhaar & Personal Details'}
              </p>
            </div>
          </div>
          
          <div className={`flex-1 mx-6 h-2 rounded-full ${
            currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'
          }`}>
            <div className={`h-full rounded-full transition-all duration-300 ${
              currentStep >= 2 ? 'w-full bg-blue-600' : 'w-0 bg-blue-600'
            }`}></div>
          </div>
          
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
              currentStep >= 2 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-gray-100 text-gray-400 border-gray-300'
            }`}>
              {currentStep > 2 ? '✓' : '2'}
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-900">
                {language === 'hi' ? 'व्यावसायिक जानकारी' : 'Business Information'}
              </p>
              <p className="text-xs text-gray-500">
                {language === 'hi' ? 'उद्यम और निवेश विवरण' : 'Enterprise & Investment Details'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{language === 'hi' ? 'प्रगति' : 'Progress'}</span>
            <span>{Math.round((currentStep / 2) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 2) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {submitStatus && (
        <div className={`mb-6 p-4 rounded-md ${
          submitStatus.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {submitStatus.type === 'success' ? (
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{submitStatus.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {currentStep === 1 ? 'Step 1: Personal Information' : 'Step 2: Business Information'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentStepFields.map(field => renderField(field))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Previous
              </button>
            )}
          </div>
          
          <div>
            {currentStep < 2 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Registration'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default UdyamRegistrationForm;
