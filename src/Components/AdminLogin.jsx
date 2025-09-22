import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { verifyToken } from './verifyToken';
import { Eye, EyeOff, Check } from 'lucide-react';
import StepOneModal from './NewConfirm';
const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isResetCome, setIsResetCome] = useState(false);
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromURL = params.get("token");
    const emailFromURL = params.get("email");

    for (const [key, value] of params.entries()) {
      console.log(`${key}: ${value}`);
    }

    if (tokenFromURL) {
      setToken(tokenFromURL);
      setIsResetCome(true); // open modal
    }

    if (emailFromURL) {
      setEmail(emailFromURL);
    }
  }, []);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleNext = async (e) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Passwords do not match",
      });
      return;
    }
    if (!newPassword || !confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Both fields are required",
      });
      return;
    }

    const raw = JSON.stringify({
      token,
      newPassword,
      confirmPassword,
    });

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/auth/password/reset`,
        {
          method: "POST",
          headers: myHeaders,
          body: raw,
        }
      );

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: result.message || `Password successfully reset.`,
          showConfirmButton: false,
          timer: 2000, // auto close after 2s
        });
        setIsResetCome(false);
      } else {
        Swal.fire({
          icon: "error",
          title: result.message || "Reset failed",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Server error. Please try again later.",
      });
    } finally {
      setLoading(false);
    }

    console.log("Ready to submit:", { token, newPassword });
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('🔐 Starting login...');

    if (!email || !password) {
      Swal.fire({ icon: 'warning', title: 'Missing Fields', text: 'Please enter both email and password.' });
      return;
    }

    if (!validateEmail(email)) {
      Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);

    try {
      const raw = JSON.stringify({ email, password });

      const response = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: raw,
      });

      const result = await response.json();
      console.log('🟢 Login result:', result);

      if (response.ok && result?.data?.token) {
        const token = result.data.token;
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminId', result.data.admin.id);
        localStorage.setItem(
          "hasPermission",
          JSON.stringify(result.data.admin.hasPermission)
        );

        localStorage.setItem('role', result.data.admin.role);

        console.log('✅ Token saved:', token);

        try {
          const verified = await verifyToken(token);
          console.log('🔍 Verification result:', verified);

          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'Redirecting to dashboard...',
            timer: 1500,
            showConfirmButton: false,
          });

          setTimeout(() => {
            console.log('➡️ Navigating to dashboard...');
            navigate('/');
          }, 1500);

        } catch (verifyError) {
          Swal.fire({
            icon: 'error',
            title: 'Verification Failed',
            text: verifyError.message || 'Token could not be verified.',
          });
        }

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: result.message || 'Invalid credentials.',
        });
      }
    } catch (error) {
      console.error('🚨 Login error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Unable to reach the server.',
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="w-full md:flex flex-col md:flex-row min-h-screen">
        {/* Left Side */}
        <div className="w-full md:w-1/2 flex justify-center min-h-1/2 items-center relative overflow-hidden min-h-[200px] dynamic-height  md:min-h-0">
          {/* Optional: Add AdminLoginImage here */}
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center min-h-1/2  px-6 md:px-12 py-10  dynamicpadding md:py-0">
          <div>
            <div className="mb-6">
              <img
                src='/demo/synco/images/mainlogo.png'
                alt="Logo"
                className=" mx-auto rounded-full"
              />
            </div>

            {/* Welcome Text */}
            <h2 className="md:text-[51px] text-[32px] font-bold text-center  mb-2">
              Welcome Back
            </h2>
            <p className=" text-center md:text-[20px] text-[16px] mb-8 font-semibold">
              Seize the day and make it extraordinary!
            </p>

            {/* Form */}
            <form className="w-full md:text-[16px] text-[13px]  m-auto max-w-lg " onSubmit={handleLogin} autoComplete="on">
              <div className="mb-4">
                <label className="block text-gray-900 mb-2 font-semibold" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  autoComplete="email"
                  name="email"
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
                  name="password"
                  autoComplete="current-password"
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
                    <EyeOff className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-600" />
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
                className={`w-full py-3 md:text-[22px] text-[16px] font-semibold text-white rounded-xl transition-colors ${loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
          </div>
        </div>
        <StepOneModal
          isOpen={isResetCome}
          onClose={() => setIsResetCome(false)}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          setNewPassword={setNewPassword}
          isLoading={loading}
          setConfirmPassword={setConfirmPassword}
          handleNext={handleNext}
        />
      </div>

    </>
  );
};

export default AdminLogin;
