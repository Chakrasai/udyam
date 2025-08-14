const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { PrismaClient } = require('./generated/prisma');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

// Environment variables with defaults
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const API_VERSION = process.env.API_VERSION || 'v1';

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration
app.use(cors({
  origin: NODE_ENV === 'production' ? process.env.CORS_ORIGIN : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.message,
      timestamp: new Date().toISOString()
    });
  }
  
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      error: 'Database operation failed',
      details: NODE_ENV === 'development' ? err.message : 'Please try again later',
      timestamp: new Date().toISOString()
    });
  }
  
  res.status(500).json({
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'API is running successfully', timestamp: new Date().toISOString() });
});

// Get form schema endpoint
app.get('/api/form-schema', (req, res) => {
  const schema = {
    step1: [
      {
        name: 'aadhaarNumber',
        label: 'Aadhaar Number / आधार संख्या',
        type: 'text',
        required: true,
        maxLength: 12,
        pattern: '[0-9]{12}',
        placeholder: 'Your Aadhaar No',
        description: 'Aadhaar number shall be required for Udyam Registration.'
      },
      {
        name: 'entrepreneurName',
        label: 'Name of Entrepreneur / उद्यमी का नाम',
        type: 'text',
        required: true,
        maxLength: 100,
        placeholder: 'Name as per Aadhaar',
        description: 'The Aadhaar number shall be of the proprietor in the case of a proprietorship firm, of the managing partner in the case of a partnership firm and of a karta in the case of a Hindu Undivided Family (HUF).'
      },
      {
        name: 'consentCheckbox',
        label: 'Consent for Aadhaar Usage',
        type: 'checkbox',
        required: true,
        description: 'I, the holder of the above Aadhaar, hereby give my consent to Ministry of MSME, Government of India, for using my Aadhaar number as alloted by UIDAI for Udyam Registration. NIC / Ministry of MSME, Government of India, have informed me that my aadhaar data will not be stored/shared.'
      }
    ],
    step2: [
      {
        name: 'panNumber',
        label: 'PAN Number',
        type: 'text',
        required: true,
        maxLength: 10,
        pattern: '[A-Z]{5}[0-9]{4}[A-Z]{1}',
        placeholder: 'Enter PAN number (e.g., ABCDE1234F)',
        description: 'For Companies, LLP, Cooperative Society, Trust - provide GSTIN and PAN along with Aadhaar number.'
      },
      {
        name: 'gstinNumber',
        label: 'GSTIN (if applicable)',
        type: 'text',
        required: false,
        maxLength: 15,
        pattern: '[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}',
        placeholder: 'Enter 15-digit GSTIN',
        description: 'As per applicability of CGST Act 2017 and as notified by the ministry of MSME'
      },
      {
        name: 'enterpriseName',
        label: 'Enterprise Name',
        type: 'text',
        required: true,
        maxLength: 100,
        placeholder: 'Enter official enterprise name'
      },
      {
        name: 'constitution',
        label: 'Constitution of Enterprise',
        type: 'select',
        required: true,
        options: [
          'Proprietorship', 
          'Partnership', 
          'LLP (Limited Liability Partnership)', 
          'Private Limited Company',
          'Public Limited Company',
          'Hindu Undivided Family (HUF)',
          'Cooperative Society',
          'Trust',
          'Others'
        ]
      },
      {
        name: 'majorActivity',
        label: 'Major Business Activity',
        type: 'select',
        required: true,
        options: ['Manufacturing', 'Trading', 'Service']
      },
      {
        name: 'nicCode',
        label: 'NIC Code',
        type: 'text',
        required: true,
        maxLength: 5,
        placeholder: 'Enter 5-digit NIC code',
        description: 'National Industrial Classification code for your business activity'
      },
      {
        name: 'businessCommencementDate',
        label: 'Date of Commencement of Business',
        type: 'date',
        required: true
      },
      {
        name: 'businessAddress',
        label: 'Business Address',
        type: 'textarea',
        required: true,
        placeholder: 'Enter complete business address'
      },
      {
        name: 'state',
        label: 'State / UT',
        type: 'select',
        required: true,
        options: [
          'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
          'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
          'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
          'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
          'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
          'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
          'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
          'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
        ]
      },
      {
        name: 'district',
        label: 'District',
        type: 'text',
        required: true,
        placeholder: 'Enter district name'
      },
      {
        name: 'pincode',
        label: 'PIN Code',
        type: 'text',
        required: true,
        maxLength: 6,
        pattern: '[0-9]{6}',
        placeholder: 'Enter 6-digit PIN code'
      },
      {
        name: 'mobileNumber',
        label: 'Mobile Number',
        type: 'tel',
        required: true,
        maxLength: 10,
        pattern: '[0-9]{10}',
        placeholder: 'Enter 10-digit mobile number'
      },
      {
        name: 'emailAddress',
        label: 'Email Address',
        type: 'email',
        required: true,
        placeholder: 'Enter valid email address'
      },
      {
        name: 'investment',
        label: 'Investment in Plant & Machinery/Equipment (₹)',
        type: 'number',
        required: true,
        min: 0,
        placeholder: 'Enter investment amount in rupees',
        description: 'Investment in plant and machinery or equipment (excluding land and building)'
      },
      {
        name: 'turnover',
        label: 'Annual Turnover (₹)',
        type: 'number',
        required: true,
        min: 0,
        placeholder: 'Enter annual turnover in rupees',
        description: 'Previous year annual turnover'
      },
      {
        name: 'bankAccountNumber',
        label: 'Bank Account Number',
        type: 'text',
        required: false,
        maxLength: 20,
        placeholder: 'Enter bank account number'
      },
      {
        name: 'ifscCode',
        label: 'IFSC Code',
        type: 'text',
        required: false,
        maxLength: 11,
        pattern: '[A-Z]{4}0[A-Z0-9]{6}',
        placeholder: 'Enter IFSC code (e.g., SBIN0001234)'
      }
    ]
  };
  
  res.json(schema);
});

// Submit registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { validateRegistrationForm } = require('./utils/validators');
    
    // Validate the form data
    const validation = validateRegistrationForm(req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        validationErrors: validation.errors,
        timestamp: new Date().toISOString()
      });
    }
    
    const cleanData = validation.cleanData;
    
    // Check for existing registrations
    const existingAadhaar = await prisma.udyamRegistration.findFirst({
      where: { aadhaarNumber: cleanData.aadhaarNumber }
    });
    
    if (existingAadhaar) {
      return res.status(409).json({
        error: 'Registration already exists',
        message: 'An enterprise is already registered with this Aadhaar number',
        registrationId: existingAadhaar.registrationId,
        timestamp: new Date().toISOString()
      });
    }
    
    // Generate unique registration ID
    const registrationId = `UDYAM-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    // Create registration record
    const registration = await prisma.udyamRegistration.create({
      data: {
        registrationId,
        aadhaarNumber: cleanData.aadhaarNumber,
        entrepreneurName: cleanData.entrepreneurName,
        panNumber: cleanData.panNumber,
        enterpriseName: cleanData.enterpriseName || cleanData.entrepreneurName,
        constitution: cleanData.constitution || 'Individual',
        majorActivity: cleanData.majorActivity || 'Manufacturing',
        businessAddress: cleanData.businessAddress || '',
        state: cleanData.state || '',
        district: cleanData.district || '',
        pincode: cleanData.pincode,
        mobileNumber: cleanData.mobileNumber,
        emailAddress: cleanData.emailAddress,
        investment: cleanData.investment,
        turnover: cleanData.turnover,
        dateOfBirth: cleanData.dateOfBirth ? new Date(cleanData.dateOfBirth) : null,
        gstinNumber: cleanData.gstinNumber || null,
        bankAccountNumber: cleanData.bankAccountNumber || null,
        ifscCode: cleanData.ifscCode || null,
        nicCode: cleanData.nicCode || null,
        dateOfCommencementProduction: cleanData.dateOfCommencementProduction ? new Date(cleanData.dateOfCommencementProduction) : null,
        consent: cleanData.consent || true,
        status: 'PENDING'
      }
    });

    // Log successful registration
    console.log(`[${new Date().toISOString()}] New registration created: ${registrationId}`);

    res.status(201).json({
      message: 'Registration submitted successfully',
      registrationId: registration.registrationId,
      status: registration.status,
      submittedAt: registration.createdAt,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Duplicate entry',
        message: 'A registration with this information already exists',
        field: error.meta?.target?.[0] || 'unknown',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(500).json({
      error: 'Registration failed',
      message: NODE_ENV === 'development' ? error.message : 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
});

// Get all registrations endpoint
app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await prisma.udyamRegistration.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({
      message: 'Registrations retrieved successfully',
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Error fetching registrations' });
  }
});

// Get registration by ID endpoint
app.get('/api/registrations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await prisma.udyamRegistration.findUnique({
      where: { id: parseInt(id) }
    });

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.json({
      message: 'Registration found',
      data: registration
    });
  } catch (error) {
    console.error('Error fetching registration:', error);
    res.status(500).json({ error: 'Error fetching registration' });
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Udyam Registration API server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 API endpoints: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🔧 CORS Origin: ${CORS_ORIGIN}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
  await prisma.$disconnect();
});

// Export app for testing
module.exports = app;

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});