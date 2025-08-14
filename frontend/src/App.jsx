import { useState, useEffect } from 'react';
import UdyamRegistrationForm from './components/UdyamRegistrationForm';
import RegistrationsList from './components/RegistrationsList';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('registration');
  const [backendStatus, setBackendStatus] = useState('connecting');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('disconnected');
        }
      } catch (error) {
        console.log('Backend not connected:', error);
        setBackendStatus('disconnected');
      }
    };
    
    checkConnection();
  }, [API_BASE_URL]);

  const handleRegistrationSuccess = () => {
    // Optionally switch to view tab or show success message
    console.log('Registration successful!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Government Header */}
      <header className="bg-blue-800 text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2 rounded">
                <div className="w-12 h-12 bg-blue-800 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xl">🇮🇳</span>
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold">
                  सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय
                </h1>
                <h2 className="text-sm opacity-90">
                  Ministry of Micro, Small & Medium Enterprises
                </h2>
                <p className="text-xs opacity-75">Government of India</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">Udyam Registration Portal</p>
              <p className="text-xs opacity-75">उद्यम पंजीकरण पोर्टल</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('registration')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'registration'
                  ? 'bg-blue-600 text-white border-b-2 border-yellow-400'
                  : 'text-blue-100 hover:text-white hover:bg-blue-600'
              }`}
            >
              New Registration / नया पंजीकरण
            </button>
            <button
              onClick={() => setActiveTab('view')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'view'
                  ? 'bg-blue-600 text-white border-b-2 border-yellow-400'
                  : 'text-blue-100 hover:text-white hover:bg-blue-600'
              }`}
            >
              View Registrations / पंजीकरण देखें
            </button>
          </div>
        </div>
      </nav>

      {/* Status Indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  backendStatus === 'connected' ? 'bg-green-500' : 
                  backendStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm text-gray-600">
                  Server: {backendStatus === 'connected' ? 'Connected' : 
                           backendStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('hi-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'registration' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Udyam Registration / उद्यम पंजीकरण
              </h2>
              <p className="text-gray-600">
                Complete your MSME registration online. सूक्ष्म, लघु और मध्यम उद्यम के लिए ऑनलाइन पंजीकरण।
              </p>
              <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                <p className="text-sm text-blue-700">
                  <strong>Important:</strong> Please ensure all information matches your official documents. 
                  कृपया सुनिश्चित करें कि सभी जानकारी आपके आधिकारिक दस्तावेजों से मेल खाती है।
                </p>
              </div>
            </div>
            <UdyamRegistrationForm onRegistrationSuccess={handleRegistrationSuccess} />
          </div>
        )}

        {activeTab === 'view' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Registered Enterprises / पंजीकृत उद्यम
            </h2>
            <RegistrationsList />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">About Udyam</h3>
              <p className="text-sm text-gray-300">
                Udyam Registration is a government initiative to promote and support MSMEs in India.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Quick Links</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li><a href="#" className="hover:text-white">Guidelines</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Help</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Contact</h3>
              <p className="text-sm text-gray-300">
                Ministry of MSME<br />
                Government of India
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-400">
            © 2025 Government of India. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
