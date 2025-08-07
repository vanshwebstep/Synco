import { AnimatePresence, motion } from "framer-motion";

const StepOneModal = ({
  isOpen,
  onClose,
  newPassword,
  confirmPassword,
  setNewPassword,
  isLoading,
  setConfirmPassword,
  handleNext,
}) => {
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
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="text-xl font-semibold mb-4 text-center">
              Set New Password
            </div>

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

            <div className="flex justify-between gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-xl border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Please wait...' : 'Next'}
              </button>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StepOneModal;
