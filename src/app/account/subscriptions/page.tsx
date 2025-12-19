"use client";

import { useState } from "react";

export default function SubscriptionsPage() {
  const [subscription, setSubscription] = useState({
    tier: "basic",
    postLimit: 5,
    usedPosts: 2,
  });



  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Manage Your Subscription</h1>
      <p className="mt-2 text-gray-600">Current Tier: {subscription.tier}</p>
      <p className="mt-2 text-gray-600">
        Posts Used: {subscription.usedPosts} / {subscription.postLimit}
      </p>

      <div className="mt-4 flex flex-col gap-4">
        <a
          href="https://buy.stripe.com/eVq7sE3mIaMCgMl1X37ok02"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-500 text-white rounded text-center"
        >
          Subscribe to Basic ($5.99/month)
        </a>
        <a
          href="https://buy.stripe.com/28E3co3mIcUKfIhgRX7ok03"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-purple-600 text-white rounded text-center"
        >
          Subscribe to Premium ($9.99/month)
        </a>
      </div>
    </div>
  );
}