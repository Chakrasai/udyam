import { useState, useEffect } from 'react';

const RegistrationsList = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByActivity, setFilterByActivity] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/registrations`);
        const data = await response.json();
        
        if (response.ok) {
          setRegistrations(data.data || []);
        } else {
          setError(data.error || 'Failed to fetch registrations');
        }
      } catch {
        setError('Network error. Please check if the server is running.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [API_BASE_URL]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/registrations`);
      const data = await response.json();
      
      if (response.ok) {
        setRegistrations(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch registrations');
      }
    } catch {
      setError('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = !searchTerm || 
      reg.entrepreneurName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.enterpriseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.aadhaarNumber.includes(searchTerm) ||
      reg.panNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesActivity = !filterByActivity || reg.majorActivity === filterByActivity;
    
    return matchesSearch && matchesActivity;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityBadgeColor = (activity) => {
    switch (activity) {
      case 'Manufacturing': return 'bg-blue-100 text-blue-800';
      case 'Trading': return 'bg-green-100 text-green-800';
      case 'Service': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading registrations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={fetchRegistrations}
                className="mt-2 text-sm text-red-800 underline hover:text-red-900"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const uniqueActivities = [...new Set(registrations.map(reg => reg.majorActivity).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Registration Records</h2>
            <p className="text-blue-100 mt-1">Manage and view all Udyam registrations</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{registrations.length}</div>
            <div className="text-blue-100 text-sm">Total Registrations</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Registrations
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by name, enterprise, Aadhaar, or PAN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="w-full sm:w-48">
            <label htmlFor="activity" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Activity
            </label>
            <select
              id="activity"
              value={filterByActivity}
              onChange={(e) => setFilterByActivity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Activities</option>
              {uniqueActivities.map(activity => (
                <option key={activity} value={activity}>{activity}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-700">
          Showing {filteredRegistrations.length} of {registrations.length} registrations
        </p>
        <button
          onClick={fetchRegistrations}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {/* Registrations List */}
      {filteredRegistrations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No registrations found</h3>
          <p className="text-gray-500">
            {registrations.length === 0 
              ? "No registrations have been submitted yet." 
              : "No registrations match your current filters."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredRegistrations.map((registration) => (
            <div key={registration.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {registration.enterpriseName || 'Enterprise Name Not Provided'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Registration ID: #{registration.id} • {formatDate(registration.createdAt)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {registration.majorActivity && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActivityBadgeColor(registration.majorActivity)}`}>
                        {registration.majorActivity}
                      </span>
                    )}
                    {registration.constitution && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                        {registration.constitution}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Personal Information</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Name:</span> {registration.entrepreneurName}</p>
                      <p><span className="font-medium">Aadhaar:</span> {registration.aadhaarNumber}</p>
                      <p><span className="font-medium">PAN:</span> {registration.panNumber || 'Not provided'}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Business Details</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Location:</span> {registration.district}, {registration.state}</p>
                      <p><span className="font-medium">PIN:</span> {registration.pincode || 'Not provided'}</p>
                      {registration.businessAddress && (
                        <p><span className="font-medium">Address:</span> {registration.businessAddress.substring(0, 50)}...</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Financial Information</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {registration.investment > 0 && (
                        <p><span className="font-medium">Investment:</span> {formatCurrency(registration.investment)}</p>
                      )}
                      {registration.turnover > 0 && (
                        <p><span className="font-medium">Turnover:</span> {formatCurrency(registration.turnover)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegistrationsList;
