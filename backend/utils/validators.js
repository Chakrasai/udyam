// Validation utilities for Udyam Registration
const validator = require('validator');

/**
 * Validates Aadhaar number format
 * @param {string} aadhaar - Aadhaar number
 * @returns {object} - Validation result
 */
const validateAadhaar = (aadhaar) => {
  if (!aadhaar) {
    return { isValid: false, message: 'Aadhaar number is required' };
  }
  
  if (typeof aadhaar !== 'string') {
    return { isValid: false, message: 'Aadhaar number must be a string' };
  }
  
  // Remove spaces and check length
  const cleanAadhaar = aadhaar.replace(/\s/g, '');
  
  if (cleanAadhaar.length !== 12) {
    return { isValid: false, message: 'Aadhaar number must be exactly 12 digits' };
  }
  
  if (!/^\d{12}$/.test(cleanAadhaar)) {
    return { isValid: false, message: 'Aadhaar number must contain only digits' };
  }
  
  // Check for invalid patterns (all same digits, sequential numbers)
  if (/^(\d)\1{11}$/.test(cleanAadhaar)) {
    return { isValid: false, message: 'Invalid Aadhaar number pattern' };
  }
  
  if (/^(0123456789|1234567890|9876543210)$/.test(cleanAadhaar)) {
    return { isValid: false, message: 'Invalid Aadhaar number pattern' };
  }
  
  return { isValid: true, message: 'Valid Aadhaar number', cleanValue: cleanAadhaar };
};

/**
 * Validates PAN number format
 * @param {string} pan - PAN number
 * @returns {object} - Validation result
 */
const validatePAN = (pan) => {
  if (!pan) {
    return { isValid: false, message: 'PAN number is required' };
  }
  
  const cleanPAN = pan.toUpperCase().replace(/\s/g, '');
  
  if (cleanPAN.length !== 10) {
    return { isValid: false, message: 'PAN number must be exactly 10 characters' };
  }
  
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(cleanPAN)) {
    return { isValid: false, message: 'Invalid PAN number format (e.g., ABCDE1234F)' };
  }
  
  return { isValid: true, message: 'Valid PAN number', cleanValue: cleanPAN };
};

/**
 * Validates GSTIN number format
 * @param {string} gstin - GSTIN number
 * @returns {object} - Validation result
 */
const validateGSTIN = (gstin) => {
  if (!gstin) {
    return { isValid: true, message: 'GSTIN is optional' }; // GSTIN is optional
  }
  
  const cleanGSTIN = gstin.toUpperCase().replace(/\s/g, '');
  
  if (cleanGSTIN.length !== 15) {
    return { isValid: false, message: 'GSTIN must be exactly 15 characters' };
  }
  
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
  if (!gstinRegex.test(cleanGSTIN)) {
    return { isValid: false, message: 'Invalid GSTIN format' };
  }
  
  return { isValid: true, message: 'Valid GSTIN', cleanValue: cleanGSTIN };
};

/**
 * Validates mobile number format
 * @param {string} mobile - Mobile number
 * @returns {object} - Validation result
 */
const validateMobile = (mobile) => {
  if (!mobile) {
    return { isValid: false, message: 'Mobile number is required' };
  }
  
  const cleanMobile = mobile.replace(/[\s\-\(\)]/g, '');
  
  if (cleanMobile.length !== 10) {
    return { isValid: false, message: 'Mobile number must be exactly 10 digits' };
  }
  
  if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
    return { isValid: false, message: 'Invalid Indian mobile number format' };
  }
  
  return { isValid: true, message: 'Valid mobile number', cleanValue: cleanMobile };
};

/**
 * Validates email address
 * @param {string} email - Email address
 * @returns {object} - Validation result
 */
const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: 'Email address is required' };
  }
  
  if (!validator.isEmail(email)) {
    return { isValid: false, message: 'Invalid email format' };
  }
  
  const cleanEmail = email.toLowerCase().trim();
  
  return { isValid: true, message: 'Valid email address', cleanValue: cleanEmail };
};

/**
 * Validates PIN code
 * @param {string} pincode - PIN code
 * @returns {object} - Validation result
 */
const validatePincode = (pincode) => {
  if (!pincode) {
    return { isValid: false, message: 'PIN code is required' };
  }
  
  const cleanPincode = pincode.replace(/\s/g, '');
  
  if (cleanPincode.length !== 6) {
    return { isValid: false, message: 'PIN code must be exactly 6 digits' };
  }
  
  if (!/^\d{6}$/.test(cleanPincode)) {
    return { isValid: false, message: 'PIN code must contain only digits' };
  }
  
  return { isValid: true, message: 'Valid PIN code', cleanValue: cleanPincode };
};

/**
 * Validates IFSC code
 * @param {string} ifsc - IFSC code
 * @returns {object} - Validation result
 */
const validateIFSC = (ifsc) => {
  if (!ifsc) {
    return { isValid: true, message: 'IFSC code is optional' };
  }
  
  const cleanIFSC = ifsc.toUpperCase().replace(/\s/g, '');
  
  if (cleanIFSC.length !== 11) {
    return { isValid: false, message: 'IFSC code must be exactly 11 characters' };
  }
  
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  if (!ifscRegex.test(cleanIFSC)) {
    return { isValid: false, message: 'Invalid IFSC code format (e.g., SBIN0001234)' };
  }
  
  return { isValid: true, message: 'Valid IFSC code', cleanValue: cleanIFSC };
};

/**
 * Validates investment amount
 * @param {number|string} amount - Investment amount
 * @returns {object} - Validation result
 */
const validateInvestment = (amount) => {
  if (!amount && amount !== 0) {
    return { isValid: false, message: 'Investment amount is required' };
  }
  
  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) {
    return { isValid: false, message: 'Investment amount must be a valid number' };
  }
  
  if (numAmount < 0) {
    return { isValid: false, message: 'Investment amount cannot be negative' };
  }
  
  if (numAmount > 50000000000) { // 500 crore limit
    return { isValid: false, message: 'Investment amount exceeds maximum limit' };
  }
  
  return { isValid: true, message: 'Valid investment amount', cleanValue: numAmount };
};

/**
 * Validates date format and range
 * @param {string} date - Date string
 * @param {string} fieldName - Field name for error messages
 * @returns {object} - Validation result
 */
const validateDate = (date, fieldName = 'Date') => {
  if (!date) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, message: `Invalid ${fieldName.toLowerCase()} format` };
  }
  
  const now = new Date();
  const minDate = new Date('1900-01-01');
  
  if (dateObj > now) {
    return { isValid: false, message: `${fieldName} cannot be in the future` };
  }
  
  if (dateObj < minDate) {
    return { isValid: false, message: `${fieldName} cannot be before 1900` };
  }
  
  return { isValid: true, message: `Valid ${fieldName.toLowerCase()}`, cleanValue: dateObj.toISOString().split('T')[0] };
};

/**
 * Validates enterprise name
 * @param {string} name - Enterprise name
 * @returns {object} - Validation result
 */
const validateEnterpriseName = (name) => {
  if (!name) {
    return { isValid: false, message: 'Enterprise name is required' };
  }
  
  const cleanName = name.trim();
  
  if (cleanName.length < 2) {
    return { isValid: false, message: 'Enterprise name must be at least 2 characters long' };
  }
  
  if (cleanName.length > 200) {
    return { isValid: false, message: 'Enterprise name cannot exceed 200 characters' };
  }
  
  // Allow letters, numbers, spaces, and common business symbols
  const nameRegex = /^[a-zA-Z0-9\s\.\,\&\-\(\)]+$/;
  if (!nameRegex.test(cleanName)) {
    return { isValid: false, message: 'Enterprise name contains invalid characters' };
  }
  
  return { isValid: true, message: 'Valid enterprise name', cleanValue: cleanName };
};

/**
 * Comprehensive form validation
 * @param {object} formData - Form data to validate
 * @returns {object} - Validation results
 */
const validateRegistrationForm = (formData) => {
  const errors = {};
  const cleanData = {};
  
  // Required field validations
  const validations = [
    { field: 'aadhaarNumber', validator: validateAadhaar },
    { field: 'entrepreneurName', validator: (name) => validateEnterpriseName(name) },
    { field: 'panNumber', validator: validatePAN },
    { field: 'mobileNumber', validator: validateMobile },
    { field: 'emailAddress', validator: validateEmail },
    { field: 'pincode', validator: validatePincode },
    { field: 'investment', validator: validateInvestment },
    { field: 'turnover', validator: validateInvestment },
    { field: 'dateOfBirth', validator: (date) => validateDate(date, 'Date of birth') },
  ];
  
  // Optional field validations
  const optionalValidations = [
    { field: 'gstinNumber', validator: validateGSTIN },
    { field: 'ifscCode', validator: validateIFSC },
    { field: 'enterpriseName', validator: validateEnterpriseName },
  ];
  
  // Validate required fields
  validations.forEach(({ field, validator }) => {
    const result = validator(formData[field]);
    if (!result.isValid) {
      errors[field] = result.message;
    } else {
      cleanData[field] = result.cleanValue || formData[field];
    }
  });
  
  // Validate optional fields (only if provided)
  optionalValidations.forEach(({ field, validator }) => {
    if (formData[field]) {
      const result = validator(formData[field]);
      if (!result.isValid) {
        errors[field] = result.message;
      } else {
        cleanData[field] = result.cleanValue || formData[field];
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    cleanData
  };
};

module.exports = {
  validateAadhaar,
  validatePAN,
  validateGSTIN,
  validateMobile,
  validateEmail,
  validatePincode,
  validateIFSC,
  validateInvestment,
  validateDate,
  validateEnterpriseName,
  validateRegistrationForm
};
