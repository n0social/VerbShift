import React, { useState } from 'react';

export default function AdminSettings() {
  const [urls, setUrls] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


    // Removed: Admin email scraper settings page
}
