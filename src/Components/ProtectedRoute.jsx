// components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [authStatus, setAuthStatus] = useState('checking'); // 'checking' | 'allowed' | 'denied'

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        console.warn('Token missing');
        setAuthStatus('denied');
        return;
      }

      try {
        const response = await fetch(
          'https://synco-i0a7.onrender.com/api/admin/auth/login/verify',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (response.ok && result.status === true) {
          setAuthStatus('allowed');
          // Optional: Save admin info to localStorage
          localStorage.setItem('adminInfo', JSON.stringify(result.admin));
        } else {
          console.warn('Token invalid or expired');
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminInfo');
          setAuthStatus('denied');
        }
      } catch (error) {
        console.error('Verification failed:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
        setAuthStatus('denied');
      }
    };

    verifyToken();
  }, []);

  if (authStatus === 'checking') {
    return (
      <div className="w-full h-screen flex justify-center items-center text-lg text-gray-700">
        Verifying session...
      </div>
    );
  }

  return authStatus === 'allowed' ? children : <Navigate to="/admin-login" replace />;
};

export default ProtectedRoute;
