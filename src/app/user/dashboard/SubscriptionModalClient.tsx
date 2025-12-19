"use client";
import React, { useState, useEffect } from "react";

export default function SubscriptionModalClient({ hasSubscription }: { hasSubscription: boolean }) {
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (!hasSubscription) {
      setShowModal(true);
    }
  }, [hasSubscription]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full text-center relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
          onClick={() => setShowModal(false)}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Subscription Required</h2>
        <p className="mb-4">You need an active subscription to continue using the dashboard features.</p>
        <a href="/account/subscriptions" className="btn-primary">Purchase Subscription</a>
      </div>
    </div>
  );
}
