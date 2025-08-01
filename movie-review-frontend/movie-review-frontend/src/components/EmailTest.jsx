import React, { useState } from 'react';

const EmailTest = () => {
  const [testEmail, setTestEmail] = useState('admin@movieapp.com');
  const [result, setResult] = useState('');

  const testEmailValidation = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = testEmail.trim();
    const isValid = emailRegex.test(trimmedEmail);
    
    setResult(`Email: "${trimmedEmail}" - Valid: ${isValid}`);
    console.log('Email test:', { email: trimmedEmail, isValid });
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Email Validation Test</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Test Email:</label>
          <input
            type="text"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter email to test"
          />
        </div>
        <button
          onClick={testEmailValidation}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Test Email
        </button>
        {result && (
          <div className="p-3 bg-white border rounded-md">
            <p className="text-sm">{result}</p>
          </div>
        )}
        <div className="text-xs text-gray-600">
          <p>Expected admin email: admin@movieapp.com</p>
          <p>Expected user emails: john@example.com, jane@example.com, mike@example.com</p>
        </div>
      </div>
    </div>
  );
};

export default EmailTest; 