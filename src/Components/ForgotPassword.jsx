import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Email',
        text: 'Please enter your email address.',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    if (!validateEmail(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    setLoading(true);

    try {
      const raw = JSON.stringify({ email });

      const response = await fetch(
        'https://synco-i0a7.onrender.com/api/admin/auth/password/forget',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: raw,
        }
      );

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Email Sent',
          text: 'Check your inbox for the password reset link.',
          confirmButtonColor: '#16a34a',
        });
        setEmail('');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: result.message || 'Something went wrong.',
          confirmButtonColor: '#dc2626',
        });
      }
    } catch (error) {
      console.error('Forgot Password Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Unable to reach the server. Please try again later.',
        confirmButtonColor: '#dc2626',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row min-h-screen">
      {/* Left Side */}
      <div className="w-full md:w-1/2 flex justify-center items-center relative overflow-hidden min-h-[200px] md:min-h-0">
        {/* Optional image area */}
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 py-10 md:py-0">
        <div>
          <div className="mb-6">
            <img src='public/images/mainlogo.png' alt="Logo" className="mx-auto rounded-full" />
          </div>

          <h2 className="text-[37px] font-semibold text-center mb-2">
            Forgot your password?
          </h2>
          <p className="text-center text-[24px] mb-8 font-semibold">
            Enter your email to receive a reset link
          </p>

          <form className="w-full m-auto max-w-lg" onSubmit={handleForgotPassword}>
            <div className="mb-4">
              <label
                className="block text-gray-900 mb-2 text-[22px] font-semibold"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white text-[22px] placeholder-gray-500 focus:outline-none border border-gray-300"
                
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-[22px] font-semibold text-white rounded-xl transition-colors ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
