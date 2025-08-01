import React from 'react';
import { FaCookieBite, FaCog, FaEye, FaTrash } from 'react-icons/fa';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-6">
            <FaCookieBite className="text-3xl text-blue-600 mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Cookie Policy</h1>
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
              This Cookie Policy explains how MovieReview uses cookies and similar technologies to recognize you 
              when you visit our website. It explains what these technologies are and why we use them, as well as 
              your rights to control our use of them.
            </p>
          </section>

          {/* What Are Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">What Are Cookies?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
              Cookies are widely used by website owners to make their websites work, or to work more efficiently, 
              as well as to provide reporting information.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800">
                <strong>💡 Did you know?</strong> Cookies set by the website owner (in this case, MovieReview) 
                are called "first-party cookies". Cookies set by parties other than the website owner are called 
                "third-party cookies".
              </p>
            </div>
          </section>

          {/* Types of Cookies We Use */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaCog className="text-blue-600 mr-2" />
              Types of Cookies We Use
            </h2>
            <div className="space-y-6">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Essential Cookies</h3>
                <p className="text-gray-700 mb-2">
                  These cookies are essential to provide you with services available through our website and to 
                  enable you to use some of its features.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Authentication and security cookies</li>
                  <li>Session management cookies</li>
                  <li>Load balancing cookies</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Functionality Cookies</h3>
                <p className="text-gray-700 mb-2">
                  These cookies allow our website to remember choices you make when you use our website.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Language preferences</li>
                  <li>Theme preferences</li>
                  <li>User interface customization</li>
                </ul>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Analytics Cookies</h3>
                <p className="text-gray-700 mb-2">
                  These cookies allow us to analyze how our website is being accessed and used.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Page visit statistics</li>
                  <li>User behavior analysis</li>
                  <li>Performance monitoring</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaEye className="text-blue-600 mr-2" />
              How We Use Cookies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">To Provide Our Services</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Keep you signed in</li>
                  <li>Remember your preferences</li>
                  <li>Provide personalized content</li>
                  <li>Ensure website security</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">To Improve Our Website</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Analyze usage patterns</li>
                  <li>Identify popular features</li>
                  <li>Fix technical issues</li>
                  <li>Optimize performance</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookie Management */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaTrash className="text-blue-600 mr-2" />
              Managing Your Cookie Preferences
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Browser Settings</h3>
                <p className="text-gray-700 leading-relaxed">
                  You can control and/or delete cookies as you wish. You can delete all cookies that are already 
                  on your computer and you can set most browsers to prevent them from being placed.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">How to Disable Cookies</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                  <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                  <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                </ul>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-yellow-800">
                  <strong>⚠️ Important:</strong> If you disable cookies, some features of our website may not 
                  function properly, including the ability to stay logged in and save your preferences.
                </p>
              </div>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Third-Party Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics 
              of our website and deliver advertisements on and through our website.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Third-Party Services We Use</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>Google Analytics:</strong> Website usage analytics</li>
                <li><strong>Google Fonts:</strong> Typography and design</li>
                <li><strong>Social Media:</strong> Sharing and integration features</li>
              </ul>
            </div>
          </section>

          {/* Updates to This Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Updates to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Cookie Policy from time to time in order to reflect, for example, changes to 
              the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit 
              this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about our use of cookies, please contact us:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@moviereview.com<br />
                <strong>Subject:</strong> Cookie Policy Inquiry<br />
                <strong>Response Time:</strong> We aim to respond within 48 hours
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy; 