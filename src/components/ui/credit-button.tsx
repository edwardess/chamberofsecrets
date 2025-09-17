"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CreditButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Credit button - hidden on mobile */}
      <button
        onClick={openModal}
        className="fixed bottom-4 right-4 hidden lg:flex items-center px-4 py-2 bg-white/90 hover:bg-blue-50 hover:text-blue-700 text-sm text-gray-700 rounded-full shadow-md hover:shadow-lg transition-all duration-200 z-40 border border-gray-300 hover:border-blue-300 cursor-pointer hover:scale-105"
        aria-label="Created by Edward, Husband @TheWFHCouple"
      >
        Created by Edward, Husband @TheWFHCouple
      </button>

      {/* Donation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={closeModal}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[450px] bg-white rounded-xl shadow-xl z-50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Support Our Work</h2>
                <button
                  onClick={closeModal}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-5 space-y-6">
                {/* Section 1 - Support The WFH Couple */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Support The WFH Couple</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Everything we create is free and always will be. We do not sell anything. If you&apos;d like to support us, your donation helps us build more and support more freelancers and families like ours.
                  </p>
                  <div className="bg-white p-3 rounded-md border border-blue-200">
                    <p className="text-sm text-gray-500 mb-1">GCash:</p>
                    <p className="text-lg font-bold text-gray-800 select-all mb-1">09770680065</p>
                    <p className="text-md font-medium text-gray-700 select-all">A****Z A****D</p>
                  </div>
                </div>

                {/* Section 2 - Donate to Charity */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Donate to Charity</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    You may also donate to charity. 100% of what&apos;s donated here will be given to Reach Out &amp; Feed Philippines to help children in need.
                  </p>
                  <div className="bg-white p-3 rounded-md border border-green-200">
                    <p className="text-sm text-gray-500 mb-1">GCash:</p>
                    <p className="text-lg font-bold text-gray-800 select-all mb-1">09670045408</p>
                    <p className="text-md font-medium text-gray-700 select-all">A****A H****M</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-gray-50 text-center">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
