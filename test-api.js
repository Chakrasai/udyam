// Test script to verify API endpoints
const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('🧪 Testing API endpoints...\n');
    
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:5000/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test form schema endpoint
    console.log('\n2. Testing form schema endpoint...');
    const schemaResponse = await fetch('http://localhost:5000/api/form-schema');
    const schemaData = await schemaResponse.json();
    console.log('✅ Form schema loaded with steps:', Object.keys(schemaData));
    console.log('   Step 1 fields:', schemaData.step1?.length || 0);
    console.log('   Step 2 fields:', schemaData.step2?.length || 0);
    
    // Test a sample registration (this might fail due to DB issues, but we can see the structure)
    console.log('\n3. Testing registration endpoint with sample data...');
    const testRegistration = {
      aadhaarNumber: '123456789012',
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: '1990-01-01',
      mobileNumber: '9876543210',
      emailAddress: 'test@example.com'
    };
    
    const regResponse = await fetch('http://localhost:5000/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testRegistration)
    });
    
    if (regResponse.ok) {
      const regData = await regResponse.json();
      console.log('✅ Registration test successful:', regData);
    } else {
      const error = await regResponse.json();
      console.log('❌ Registration test failed (expected due to DB):', error.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();
