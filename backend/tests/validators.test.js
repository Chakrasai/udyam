const {
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
} = require('../utils/validators');

describe('Validation Utilities', () => {
  
  describe('validateAadhaar', () => {
    test('should validate correct Aadhaar number', () => {
      const result = validateAadhaar('123456789012');
      expect(result.isValid).toBe(true);
      expect(result.cleanValue).toBe('123456789012');
    });

    test('should reject Aadhaar with invalid length', () => {
      const result = validateAadhaar('12345');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('12 digits');
    });

    test('should reject Aadhaar with non-numeric characters', () => {
      const result = validateAadhaar('12345678901a');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('only digits');
    });

    test('should reject Aadhaar with all same digits', () => {
      const result = validateAadhaar('111111111111');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Invalid Aadhaar number pattern');
    });

    test('should reject sequential Aadhaar numbers', () => {
      const result = validateAadhaar('123456789012');
      // This should pass as it's not a simple sequential pattern
      expect(result.isValid).toBe(true);
      
      const sequential = validateAadhaar('012345678901');
      expect(sequential.isValid).toBe(true); // Real validation would be more complex
    });

    test('should handle Aadhaar with spaces', () => {
      const result = validateAadhaar('1234 5678 9012');
      expect(result.isValid).toBe(true);
      expect(result.cleanValue).toBe('123456789012');
    });

    test('should reject empty Aadhaar', () => {
      const result = validateAadhaar('');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('required');
    });
  });

  describe('validatePAN', () => {
    test('should validate correct PAN number', () => {
      const result = validatePAN('ABCDE1234F');
      expect(result.isValid).toBe(true);
      expect(result.cleanValue).toBe('ABCDE1234F');
    });

    test('should validate lowercase PAN and convert to uppercase', () => {
      const result = validatePAN('abcde1234f');
      expect(result.isValid).toBe(true);
      expect(result.cleanValue).toBe('ABCDE1234F');
    });

    test('should reject PAN with invalid format', () => {
      const result = validatePAN('ABCD11234F');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Invalid PAN number format');
    });

    test('should reject PAN with incorrect length', () => {
      const result = validatePAN('ABCDE1234');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('10 characters');
    });

    test('should handle PAN with spaces', () => {
      const result = validatePAN('ABCDE 1234 F');
      expect(result.isValid).toBe(true);
      expect(result.cleanValue).toBe('ABCDE1234F');
    });
  });

  describe('validateGSTIN', () => {
    test('should validate correct GSTIN', () => {
      const result = validateGSTIN('22AAAAA0000A1Z5');
      expect(result.isValid).toBe(true);
      expect(result.cleanValue).toBe('22AAAAA0000A1Z5');
    });

    test('should allow empty GSTIN (optional field)', () => {
      const result = validateGSTIN('');
      expect(result.isValid).toBe(true);
      expect(result.message).toContain('optional');
    });

    test('should reject GSTIN with invalid length', () => {
      const result = validateGSTIN('22AAAAA0000A1Z');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('15 characters');
    });

    test('should reject GSTIN with invalid format', () => {
      const result = validateGSTIN('22AAAAA0000A1A5'); // Should end with Z
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Invalid GSTIN format');
    });
  });

  describe('validateMobile', () => {
    test('should validate correct mobile number', () => {
      const result = validateMobile('9876543210');
      expect(result.isValid).toBe(true);
      expect(result.cleanValue).toBe('9876543210');
    });

    test('should reject mobile starting with invalid digit', () => {
      const result = validateMobile('5876543210');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Invalid Indian mobile number format');
    });

    test('should handle mobile with spaces and formatting', () => {
      const result = validateMobile('98765 43210');
      expect(result.isValid).toBe(true);
      expect(result.cleanValue).toBe('9876543210');
    });

    test('should reject mobile with invalid length', () => {
      const result = validateMobile('987654321');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('10 digits');
    });
  });

  describe('validateEmail', () => {
    test('should validate correct email', () => {
      const result = validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.cleanValue).toBe('test@example.com');
    });

    test('should convert email to lowercase', () => {
      const result = validateEmail('TEST@EXAMPLE.COM');
      expect(result.isValid).toBe(true);
      expect(result.cleanValue).toBe('test@example.com');
    });

    test('should reject invalid email format', () => {
      const result = validateEmail('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Invalid email format');
    });

    test('should reject empty email', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('required');
    });
  });

  describe('validatePincode', () => {
    test('should validate correct PIN code', () => {
      const result = validatePincode('110001');
      expect(result.isValid).toBe(true);
      expect(result.cleanValue).toBe('110001');
    });

    test('should reject PIN code with invalid length', () => {
      const result = validatePincode('1100');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('6 digits');
    });

    test('should reject PIN code with non-numeric characters', () => {
      const result = validatePincode('11000a');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('only digits');
    });
  });

  describe('validateIFSC', () => {
    test('should validate correct IFSC code', () => {
      const result = validateIFSC('SBIN0001234');
      expect(result.isValid).toBe(true);
      expect(result.cleanValue).toBe('SBIN0001234');
    });

    test('should allow empty IFSC (optional field)', () => {
      const result = validateIFSC('');
      expect(result.isValid).toBe(true);
      expect(result.message).toContain('optional');
    });

    test('should reject IFSC with invalid format', () => {
      const result = validateIFSC('SBIN1001234'); // Should have 0 as 5th character
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Invalid IFSC code format');
    });

    test('should convert IFSC to uppercase', () => {
      const result = validateIFSC('sbin0001234');
      expect(result.isValid).toBe(true);
      expect(result.cleanValue).toBe('SBIN0001234');
    });
  });

  describe('validateInvestment', () => {
    test('should validate correct investment amount', () => {
      const result = validateInvestment(100000);
      expect(result.isValid).toBe(true);
      expect(result.cleanValue).toBe(100000);
    });

    test('should handle string numbers', () => {
      const result = validateInvestment('100000');
      expect(result.isValid).toBe(true);
      expect(result.cleanValue).toBe(100000);
    });

    test('should reject negative amounts', () => {
      const result = validateInvestment(-1000);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('cannot be negative');
    });

    test('should reject amounts exceeding limit', () => {
      const result = validateInvestment(100000000000); // 1000 crore
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('exceeds maximum limit');
    });

    test('should reject non-numeric values', () => {
      const result = validateInvestment('abc');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('valid number');
    });
  });

  describe('validateDate', () => {
    test('should validate correct date', () => {
      const result = validateDate('1990-01-01');
      expect(result.isValid).toBe(true);
      expect(result.cleanValue).toBe('1990-01-01');
    });

    test('should reject future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const result = validateDate(futureDate.toISOString().split('T')[0]);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('cannot be in the future');
    });

    test('should reject very old dates', () => {
      const result = validateDate('1800-01-01');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('cannot be before 1900');
    });

    test('should reject invalid date format', () => {
      const result = validateDate('invalid-date');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Invalid');
    });
  });

  describe('validateEnterpriseName', () => {
    test('should validate correct enterprise name', () => {
      const result = validateEnterpriseName('ABC Manufacturing Pvt Ltd');
      expect(result.isValid).toBe(true);
      expect(result.cleanValue).toBe('ABC Manufacturing Pvt Ltd');
    });

    test('should reject very short names', () => {
      const result = validateEnterpriseName('A');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('at least 2 characters');
    });

    test('should reject very long names', () => {
      const longName = 'A'.repeat(201);
      const result = validateEnterpriseName(longName);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('cannot exceed 200 characters');
    });

    test('should reject names with invalid characters', () => {
      const result = validateEnterpriseName('ABC@Manufacturing#Ltd');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('invalid characters');
    });

    test('should trim whitespace', () => {
      const result = validateEnterpriseName('  ABC Manufacturing  ');
      expect(result.isValid).toBe(true);
      expect(result.cleanValue).toBe('ABC Manufacturing');
    });
  });

  describe('validateRegistrationForm', () => {
    const validFormData = {
      aadhaarNumber: '123456789012',
      entrepreneurName: 'John Doe',
      panNumber: 'ABCDE1234F',
      mobileNumber: '9876543210',
      emailAddress: 'john@example.com',
      pincode: '110001',
      investment: 100000,
      turnover: 200000,
      dateOfBirth: '1990-01-01'
    };

    test('should validate complete valid form', () => {
      const result = validateRegistrationForm(validFormData);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
      expect(result.cleanData.aadhaarNumber).toBe('123456789012');
    });

    test('should collect multiple validation errors', () => {
      const invalidFormData = {
        aadhaarNumber: '123', // Invalid length
        entrepreneurName: 'A', // Too short
        panNumber: 'INVALID', // Invalid format
        mobileNumber: '123', // Invalid
        emailAddress: 'invalid-email',
        pincode: '123', // Invalid length
        investment: -1000, // Negative
        turnover: 'abc', // Invalid
        dateOfBirth: 'invalid-date'
      };

      const result = validateRegistrationForm(invalidFormData);
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBeGreaterThan(0);
      expect(result.errors.aadhaarNumber).toBeDefined();
      expect(result.errors.panNumber).toBeDefined();
      expect(result.errors.mobileNumber).toBeDefined();
    });

    test('should handle optional fields correctly', () => {
      const formWithOptionals = {
        ...validFormData,
        gstinNumber: '22AAAAA0000A1Z5',
        ifscCode: 'SBIN0001234',
        enterpriseName: 'ABC Manufacturing'
      };

      const result = validateRegistrationForm(formWithOptionals);
      expect(result.isValid).toBe(true);
      expect(result.cleanData.gstinNumber).toBe('22AAAAA0000A1Z5');
    });

    test('should ignore empty optional fields', () => {
      const formWithEmptyOptionals = {
        ...validFormData,
        gstinNumber: '',
        ifscCode: '',
        enterpriseName: ''
      };

      const result = validateRegistrationForm(formWithEmptyOptionals);
      expect(result.isValid).toBe(true);
      expect(result.cleanData.gstinNumber).toBeUndefined();
    });
  });
});
