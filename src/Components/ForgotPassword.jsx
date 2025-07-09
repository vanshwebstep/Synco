// ✅ Required: framer-motion, tailwindcss, react-router-dom
// Main ForgotPassword component with animated modal reset flow

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const StepModal = ({ isOpen, onClose, email }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step === 1 && (!newPassword || !confirmPassword || newPassword !== confirmPassword)) return;
    if (step === 2 && !otp) return;
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/auth/password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const result = await res.json();
      if (res.ok) {
        setStep(3);
      } else {
        alert(result.message || 'Reset failed');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = () => {
    onClose();
    navigate('/admin-login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="text-xl font-semibold mb-4 text-center">
              {step === 1 && 'Set New Password'}
              {step === 2 && 'Enter OTP'}
              {step === 3 && 'Password Reset Successful'}
            </div>

            {step === 1 && (
              <>
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full mb-3 p-3 border rounded-xl text-lg"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full mb-4 p-3 border rounded-xl text-lg"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </>
            )}

            {step === 2 && (
              <div>
                <p className="text-sm text-gray-600 mb-2 text-center">An OTP was sent to your email: <strong>{email}</strong></p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full mb-4 p-3 border rounded-xl text-lg"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            )}

            {step === 3 && (
              <div className="text-center">
                <p className="text-lg text-green-600 mb-4">Your password has been successfully reset.</p>
              </div>
            )}

            <div className="flex justify-between gap-4">
              <button
                onClick={step === 3 ? handleRedirect : onClose}
                className="flex-1 py-2 rounded-xl border border-gray-300 hover:bg-gray-100"
              >
                {step === 3 ? 'OK' : 'Cancel'}
              </button>
              {step < 2 ? (
                <button
                  onClick={handleNext}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
                >
                  Next
                </button>
              ) : step === 2 ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              ) : (
                <button
                  onClick={handleRedirect}
                  className="flex-1 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700"
                >
                  Go to Login
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email || !validateEmail(email)) {
      alert('Please enter a valid email.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/auth/password/forget`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      if (res.ok) {
        setIsModalOpen(true);
      } else {
        alert(result.message || 'Email send failed.');
      }
    } catch (err) {
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row min-h-screen">
      <div className="w-full md:w-1/2 flex justify-center items-center relative overflow-hidden min-h-[200px] md:min-h-0"></div>
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 py-10 md:py-0">
        <div>
          <div className="mb-6">
            <img src="/images/mainlogo.png" alt="Logo" className="mx-auto rounded-full" />
          </div>
          <h2 className="text-[37px] font-semibold text-center mb-2">Forgot your password?</h2>
          <p className="text-center text-[24px] mb-8 font-semibold">Enter your email to receive a reset link</p>
          <form className="w-full m-auto max-w-lg" onSubmit={handleForgotPassword}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-900 mb-2 text-[22px] font-semibold">Email</label>
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
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
             {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
      <StepModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} email={email} />
    </div>
  );
};

export default ForgotPassword;
