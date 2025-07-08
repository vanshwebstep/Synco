// ✅ Required: framer-motion, tailwindcss, react-router-dom
// You can optionally use @shadcn/ui or headlessui for modal shell

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StepModal = ({ isOpen, onClose, email }) => {
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
      const res = await fetch('https://synco-i0a7.onrender.com/api/admin/auth/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const result = await res.json();
      if (res.ok) {
        onClose();
        navigate('/admin-login');
      } else {
        alert(result.message || 'Reset failed');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
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
              {step === 3 && 'Done!'}
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
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full mb-4 p-3 border rounded-xl text-lg"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            )}

            <div className="flex justify-between gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-xl border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              {step < 2 ? (
                <button
                  onClick={handleNext}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StepModal;
