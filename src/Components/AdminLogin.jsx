import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

import { Eye, EyeOff, Check } from 'lucide-react';
const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please enter both email and password.',
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

    setLoading(true); // 🔵 Start loading

    try {
      const raw = JSON.stringify({ email, password });

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: raw,
      };

      const response = await fetch(
        'https://synco-i0a7.onrender.com/api/admin/auth/login',
        requestOptions
      );
      const result = await response.json();

      if (response.ok && result?.data?.token) {
        localStorage.setItem('adminToken', result.data.token);
        localStorage.setItem('adminId', result.data.adminId);

        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Redirecting to dashboard...',
          timer: 2000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: result.message || 'Invalid credentials.',
          confirmButtonColor: '#dc2626',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Unable to reach the server. Please try again later.',
        confirmButtonColor: '#dc2626',
      });
      console.error('Login Error:', error);
    } finally {
      setLoading(false); // 🔵 Stop loading regardless of outcome
    }
  };


  return (
    <>
      <div className="w-full flex flex-col md:flex-row min-h-screen">
        {/* Left Side */}
        <div className="w-full md:w-1/2 flex justify-center items-center relative overflow-hidden min-h-[200px] md:min-h-0">
          {/* Optional: Add AdminLoginImage here */}
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 py-10 md:py-0">
          <div>
            <div className="mb-6">
              <img
                src='/images/mainlogo.png'
                alt="Logo"
                className=" mx-auto rounded-full"
              />
            </div>

            {/* Welcome Text */}
            <h2 className="text-[51px] font-bold text-center  mb-2">
              Welcome Back
            </h2>
            <p className=" text-center text-[20px] mb-8 font-semibold">
              Seize the day and make it extraordinary!
            </p>

            {/* Form */}
            <form className="w-full m-auto max-w-lg " onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-900 mb-2 font-semibold" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white placeholder-gray-500 focus:outline-none border border-gray-300"
                />
              </div>

              <div className="mb-4 relative">
                <label className="block text-gray-900 mb-2 font-semibold" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white placeholder-gray-500 focus:outline-none border border-gray-300 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-14 -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-600"  />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-600"  />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between mb-6 text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="peer hidden" />
                  <span className="w-5 h-5 inline-flex mr-2 text-gray-500 items-center justify-center border border-gray-400 rounded-sm bg-transparent peer-checked:text-white peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors">
                    <Check
                      className="w-3 h-3  transition-all font-semibold"
                      strokeWidth={3}
                    />
                  </span>
                  Remember me
                </label>

             <Link to="/admin-ForgotPassword" className="hover:underline font-semibold">
  Forgot password?
</Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 text-[22px] font-semibold text-white rounded-xl transition-colors ${loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
          </div>
        </div>
      </div>

    </>
  );
};

export default AdminLogin;
