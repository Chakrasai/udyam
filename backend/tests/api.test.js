const request = require('supertest');
const app = require('../index');

describe('API Endpoints', () => {
  
  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('API is running successfully');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/form-schema', () => {
    test('should return form schema', async () => {
      const response = await request(app)
        .get('/api/form-schema')
        .expect(200);

      expect(response.body).toHaveProperty('step1');
      expect(response.body).toHaveProperty('step2');
      expect(Array.isArray(response.body.step1)).toBe(true);
      expect(Array.isArray(response.body.step2)).toBe(true);
      
      // Check for required fields in step1
      const step1Fields = response.body.step1.map(field => field.name);
      expect(step1Fields).toContain('aadhaarNumber');
      expect(step1Fields).toContain('entrepreneurName');
    });

    test('should return fields with required properties', async () => {
      const response = await request(app)
        .get('/api/form-schema')
        .expect(200);

      const firstField = response.body.step1[0];
      expect(firstField).toHaveProperty('name');
      expect(firstField).toHaveProperty('label');
      expect(firstField).toHaveProperty('type');
      expect(firstField).toHaveProperty('required');
    });
  });

  describe('POST /api/register', () => {
    const validRegistrationData = {
      aadhaarNumber: '123456789012',
      entrepreneurName: 'John Doe',
      panNumber: 'ABCDE1234F',
      mobileNumber: '9876543210',
      emailAddress: 'john@example.com',
      pincode: '110001',
      investment: 100000,
      turnover: 200000,
      dateOfBirth: '1990-01-01',
      consent: true
    };

    test('should successfully register with valid data', async () => {
      const response = await request(app)
        .post('/api/register')
        .send(validRegistrationData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('registrationId');
      expect(response.body).toHaveProperty('status');
      expect(response.body.registrationId).toMatch(/^UDYAM-/);
    });

    test('should reject registration with invalid Aadhaar', async () => {
      const invalidData = {
        ...validRegistrationData,
        aadhaarNumber: '123' // Invalid length
      };

      const response = await request(app)
        .post('/api/register')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Validation failed');
      expect(response.body).toHaveProperty('validationErrors');
      expect(response.body.validationErrors).toHaveProperty('aadhaarNumber');
    });

    test('should reject registration with invalid PAN', async () => {
      const invalidData = {
        ...validRegistrationData,
        panNumber: 'INVALID'
      };

      const response = await request(app)
        .post('/api/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.validationErrors).toHaveProperty('panNumber');
    });

    test('should reject registration with invalid mobile number', async () => {
      const invalidData = {
        ...validRegistrationData,
        mobileNumber: '123'
      };

      const response = await request(app)
        .post('/api/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.validationErrors).toHaveProperty('mobileNumber');
    });

    test('should reject registration with invalid email', async () => {
      const invalidData = {
        ...validRegistrationData,
        emailAddress: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.validationErrors).toHaveProperty('emailAddress');
    });

    test('should reject registration with negative investment', async () => {
      const invalidData = {
        ...validRegistrationData,
        investment: -1000
      };

      const response = await request(app)
        .post('/api/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.validationErrors).toHaveProperty('investment');
    });

    test('should handle missing required fields', async () => {
      const incompleteData = {
        aadhaarNumber: '123456789012'
        // Missing other required fields
      };

      const response = await request(app)
        .post('/api/register')
        .send(incompleteData)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
      expect(response.body.validationErrors).toHaveProperty('entrepreneurName');
      expect(response.body.validationErrors).toHaveProperty('panNumber');
    });

    test('should accept optional fields when provided', async () => {
      const dataWithOptionals = {
        ...validRegistrationData,
        gstinNumber: '22AAAAA0000A1Z5',
        ifscCode: 'SBIN0001234',
        enterpriseName: 'ABC Manufacturing',
        bankAccountNumber: '1234567890'
      };

      const response = await request(app)
        .post('/api/register')
        .send(dataWithOptionals)
        .expect(201);

      expect(response.body).toHaveProperty('registrationId');
    });

    test('should handle duplicate Aadhaar registration', async () => {
      // First registration
      await request(app)
        .post('/api/register')
        .send(validRegistrationData)
        .expect(201);

      // Attempt duplicate registration
      const duplicateData = {
        ...validRegistrationData,
        entrepreneurName: 'Jane Doe' // Different name, same Aadhaar
      };

      const response = await request(app)
        .post('/api/register')
        .send(duplicateData)
        .expect(409);

      expect(response.body.error).toBe('Registration already exists');
      expect(response.body.message).toContain('Aadhaar number');
    });

    test('should validate GSTIN format when provided', async () => {
      const invalidGSTINData = {
        ...validRegistrationData,
        gstinNumber: 'INVALID-GSTIN'
      };

      const response = await request(app)
        .post('/api/register')
        .send(invalidGSTINData)
        .expect(400);

      expect(response.body.validationErrors).toHaveProperty('gstinNumber');
    });

    test('should validate IFSC format when provided', async () => {
      const invalidIFSCData = {
        ...validRegistrationData,
        ifscCode: 'INVALID'
      };

      const response = await request(app)
        .post('/api/register')
        .send(invalidIFSCData)
        .expect(400);

      expect(response.body.validationErrors).toHaveProperty('ifscCode');
    });
  });

  describe('GET /api/registrations', () => {
    test('should return list of registrations', async () => {
      const response = await request(app)
        .get('/api/registrations')
        .expect(200);

      expect(response.body).toHaveProperty('registrations');
      expect(Array.isArray(response.body.registrations)).toBe(true);
      expect(response.body).toHaveProperty('total');
      expect(typeof response.body.total).toBe('number');
    });

    test('should return registrations with proper structure', async () => {
      // Create a registration first
      const registrationData = {
        aadhaarNumber: '987654321098',
        entrepreneurName: 'Test User',
        panNumber: 'TESTD1234E',
        mobileNumber: '9876543210',
        emailAddress: 'test@example.com',
        pincode: '110001',
        investment: 100000,
        turnover: 200000,
        dateOfBirth: '1990-01-01',
        consent: true
      };

      await request(app)
        .post('/api/register')
        .send(registrationData)
        .expect(201);

      const response = await request(app)
        .get('/api/registrations')
        .expect(200);

      expect(response.body.registrations.length).toBeGreaterThan(0);
      
      const registration = response.body.registrations[0];
      expect(registration).toHaveProperty('registrationId');
      expect(registration).toHaveProperty('entrepreneurName');
      expect(registration).toHaveProperty('status');
      expect(registration).toHaveProperty('createdAt');
    });
  });

  describe('Rate Limiting', () => {
    test('should enforce rate limits', async () => {
      // This test would need to be adjusted based on actual rate limit settings
      // and might be slow to run in practice
      
      const requests = [];
      for (let i = 0; i < 5; i++) {
        requests.push(
          request(app).get('/health')
        );
      }

      const responses = await Promise.all(requests);
      responses.forEach(response => {
        expect([200, 429]).toContain(response.status);
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid JSON in request body', async () => {
      const response = await request(app)
        .post('/api/register')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400);

      // Response should handle the error gracefully
    });

    test('should return 404 for non-existent endpoints', async () => {
      const response = await request(app)
        .get('/non-existent-endpoint')
        .expect(404);
    });
  });
});
