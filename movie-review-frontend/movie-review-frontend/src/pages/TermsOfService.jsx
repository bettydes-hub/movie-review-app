import React from 'react';
import { FaGavel, FaExclamationTriangle, FaCheckCircle, FaUserShield } from 'react-icons/fa';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-6">
            <FaGavel className="text-3xl text-blue-600 mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Terms of Service</h1>
              <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to MovieReview. By accessing and using our website, you accept and agree to be bound by 
              the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaCheckCircle className="text-blue-600 mr-2" />
              Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              By using MovieReview, you agree to these Terms of Service. We may modify these terms at any time, 
              and such modifications shall be effective immediately upon posting. Your continued use of the service 
              constitutes acceptance of the modified terms.
            </p>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaUserShield className="text-blue-600 mr-2" />
              User Accounts
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Account Creation</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>You must provide accurate and complete information when creating an account</li>
                  <li>You are responsible for maintaining the security of your account credentials</li>
                  <li>You must be at least 13 years old to create an account</li>
                  <li>One account per person is allowed</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Account Responsibilities</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>You are responsible for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Do not share your account with others</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Acceptable Use</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree to use MovieReview only for lawful purposes and in accordance with these Terms:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-green-800 mb-2">✅ What You Can Do</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Write honest and constructive movie reviews</li>
                  <li>Rate movies based on your personal opinion</li>
                  <li>Share your thoughts and recommendations</li>
                  <li>Engage in respectful discussions</li>
                  <li>Report inappropriate content</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-800 mb-2">❌ What You Cannot Do</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Post spam, advertising, or promotional content</li>
                  <li>Harass, bully, or threaten other users</li>
                  <li>Post spoilers without proper warnings</li>
                  <li>Use automated tools or bots</li>
                  <li>Violate copyright or intellectual property rights</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Content Guidelines */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaExclamationTriangle className="text-blue-600 mr-2" />
              Content Guidelines
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All content you submit must comply with our community guidelines:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Be Respectful:</strong> Treat others with kindness and respect</li>
              <li><strong>Be Honest:</strong> Write genuine reviews based on your experience</li>
              <li><strong>Be Constructive:</strong> Provide helpful feedback and insights</li>
              <li><strong>Be Original:</strong> Write your own content, don't copy others</li>
              <li><strong>Be Appropriate:</strong> Avoid offensive, harmful, or inappropriate content</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Intellectual Property</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Your Content</h3>
                <p className="text-gray-700 leading-relaxed">
                  You retain ownership of the content you submit. By posting content, you grant us a license 
                  to use, display, and distribute your content on our platform.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Our Content</h3>
                <p className="text-gray-700 leading-relaxed">
                  All content on MovieReview, including text, graphics, logos, and software, is our property 
                  or licensed to us and is protected by copyright laws.
                </p>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may terminate or suspend your account at any time for violations of these terms:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Violation of these Terms of Service</li>
              <li>Repeated inappropriate behavior</li>
              <li>Fraudulent or illegal activities</li>
              <li>At our discretion for any reason</li>
            </ul>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> legal@moviereview.com<br />
                <strong>Address:</strong> MovieReview Team, Legal Department<br />
                <strong>Response Time:</strong> We aim to respond within 48 hours
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 