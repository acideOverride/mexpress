import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard';
import { CustomerList, CustomerForm, CustomerDetail } from './components/customers';
import { TicketList, TicketForm, TicketDetail } from './components/tickets';
import { MainLayout } from './components/layout';
import { NotFound, LoadingSpinner } from './components/common';
import './App.css';

const App: React.FC = () => {
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);

  const handleSearch = (query: string) => {
    // Simulate search results
    if (query) {
      const results = [
        'John Doe - Customer',
        'Recent Call - 5 mins ago',
        'Activity - File uploaded'
      ].filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleActionSelect = (action: string) => {
    switch (action) {
      case 'new-call':
        setNotification({
          message: 'Initiating new call...',
          type: 'info'
        });
        // Simulate API call
        setTimeout(() => {
          setNotification({
            message: 'Call system ready',
            type: 'success'
          });
        }, 1500);
        break;

      case 'new-customer':
        setNotification({
          message: 'Opening customer form...',
          type: 'info'
        });
        // Simulate API call
        setTimeout(() => {
          setNotification({
            message: 'Customer form ready',
            type: 'success'
          });
        }, 1500);
        break;

      case 'sync-data':
        setNotification({
          message: 'Syncing data...',
          type: 'info'
        });
        // Simulate API call
        setTimeout(() => {
          setNotification({
            message: 'Data synchronized successfully',
            type: 'success'
          });
        }, 2000);
        break;

      default:
        setNotification({
          message: 'Unknown action',
          type: 'error'
        });
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transition-all transform z-50
            ${notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : ''}
            ${notification.type === 'info' ? 'bg-blue-50 text-blue-800 border border-blue-200' : ''}
            ${notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : ''}
          `}>
            <div className="flex items-center space-x-2">
              {notification.type === 'success' && (
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {notification.type === 'info' && (
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
              {notification.type === 'error' && (
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <p>{notification.message}</p>
            </div>
          </div>
        )}

        <MainLayout>
          <Routes>
            <Route path="/" element={
              <Dashboard
                onSearch={handleSearch}
                onActionSelect={handleActionSelect}
              />
            } />
            
            {/* Customer Routes */}
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customers/new" element={<CustomerForm />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />
            <Route path="/customers/:id/edit" element={<CustomerForm />} />
            
            {/* Ticket Routes */}
            <Route path="/tickets" element={<TicketList />} />
            <Route path="/tickets/new" element={<TicketForm />} />
            <Route path="/tickets/:id" element={<TicketDetail />} />
            <Route path="/tickets/:id/edit" element={<TicketForm isEdit={true} />} />
            
            {/* 404 Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </div>
    </Router>
  );
};

export default App;
