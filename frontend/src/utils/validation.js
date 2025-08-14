// Frontend validation utilities
export const validateField = (name, value, type, required = false, options = {}) => {
  const errors = [];

  // Check required fields
  if (required && (!value || value.toString().trim() === '')) {
    errors.push(`${name} is required`);
    return errors;
  }

  // Skip validation if field is empty and not required
  if (!value || value.toString().trim() === '') {
    return errors;
  }

  switch (type) {
    case 'aadhaar':
      if (!/^\d{12}$/.test(value.replace(/\s/g, ''))) {
        errors.push('Aadhaar number must be 12 digits');
      }
      break;

    case 'pan':
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.toUpperCase())) {
        errors.push('Invalid PAN format (e.g., ABCDE1234F)');
      }
      break;

    case 'gstin':
      if (value && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(value.toUpperCase())) {
        errors.push('Invalid GSTIN format');
      }
      break;

    case 'mobile':
      if (!/^[6-9]\d{9}$/.test(value.replace(/[\s\-()]/g, ''))) {
        errors.push('Invalid mobile number');
      }
      break;

    case 'email':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.push('Invalid email format');
      }
      break;

    case 'pincode':
      if (!/^\d{6}$/.test(value)) {
        errors.push('PIN code must be 6 digits');
      }
      break;

    case 'ifsc':
      if (value && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.toUpperCase())) {
        errors.push('Invalid IFSC code format');
      }
      break;

    case 'number': {
      const num = parseFloat(value);
      if (isNaN(num)) {
        errors.push(`${name} must be a valid number`);
      } else if (num < 0) {
        errors.push(`${name} cannot be negative`);
      } else if (options.max && num > options.max) {
        errors.push(`${name} exceeds maximum limit`);
      }
      break;
    }

    case 'date': {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        errors.push('Invalid date format');
      } else if (date > new Date()) {
        errors.push('Date cannot be in the future');
      } else if (date < new Date('1900-01-01')) {
        errors.push('Date cannot be before 1900');
      }
      break;
    }

    case 'text':
      if (options.minLength && value.length < options.minLength) {
        errors.push(`${name} must be at least ${options.minLength} characters`);
      }
      if (options.maxLength && value.length > options.maxLength) {
        errors.push(`${name} cannot exceed ${options.maxLength} characters`);
      }
      if (options.pattern && !new RegExp(options.pattern).test(value)) {
        errors.push(`${name} contains invalid characters`);
      }
      break;
  }

  return errors;
};

export const validateForm = (formData, schema) => {
  const errors = {};
  const fieldsToValidate = [...(schema.step1 || []), ...(schema.step2 || [])];

  fieldsToValidate.forEach(field => {
    const value = formData[field.name];
    const fieldErrors = validateField(
      field.label,
      value,
      field.type === 'tel' ? 'mobile' : field.type,
      field.required,
      {
        minLength: field.minLength,
        maxLength: field.maxLength,
        pattern: field.pattern,
        max: field.max
      }
    );

    if (fieldErrors.length > 0) {
      errors[field.name] = fieldErrors[0]; // Show first error only
    }
  });

  return errors;
};

export const formatFieldValue = (value, type) => {
  if (!value) return value;

  switch (type) {
    case 'aadhaar':
      return value.replace(/\s/g, '').replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
    
    case 'pan':
    case 'gstin':
    case 'ifsc':
      return value.toUpperCase();
    
    case 'mobile':
      return value.replace(/[\s\-()]/g, '');
    
    case 'email':
      return value.toLowerCase().trim();
    
    case 'text':
      return value.trim();
    
    default:
      return value;
  }
};

// Form submission utilities
export const submitFormData = async (formData, apiUrl) => {
  try {
    const response = await fetch(`${apiUrl}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// API utilities
export const checkApiConnection = async (apiUrl) => {
  try {
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      timeout: 5000,
    });
    
    if (response.ok) {
      return { connected: true, status: 'connected' };
    } else {
      return { connected: false, status: 'error' };
    }
  } catch (error) {
    return { connected: false, status: 'disconnected', error: error.message };
  }
};

export const fetchFormSchema = async (apiUrl) => {
  try {
    const response = await fetch(`${apiUrl}/api/form-schema`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const schema = await response.json();
    return { success: true, data: schema };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Error message utilities
export const getErrorMessage = (error, fieldName) => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.validationErrors?.[fieldName]) {
    return error.validationErrors[fieldName];
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

export const getSuccessMessage = (result) => {
  if (result?.registrationId) {
    return `Registration successful! Your Udyam Registration ID is: ${result.registrationId}`;
  }
  
  return result?.message || 'Registration completed successfully!';
};
