import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for your message! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-movie-pattern py-8 custom-cursor">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-theater-silver mb-4">Contact Us</h1>
          <p className="text-xl text-theater-silver/80">
            Get in touch with us. We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="glass rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-theater-silver mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium label-dark mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full form-dark"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium label-dark mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full form-dark"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium label-dark mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full form-dark"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium label-dark mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full textarea-dark"
                  placeholder="Tell us more..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 px-6 glow-blue font-semibold disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="glass rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-theater-silver mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <FaEnvelope className="h-6 w-6 text-theater-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-theater-silver">Email</h3>
                    <p className="text-theater-silver/80">contact@moviereview.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <FaPhone className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-theater-silver">Phone</h3>
                    <p className="text-theater-silver/80">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <FaMapMarkerAlt className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-theater-silver">Address</h3>
                    <p className="text-theater-silver/80">123 Movie Street<br />Cinema City, CC 12345</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="glass rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-theater-silver mb-6">Follow Us</h2>
              <div className="flex space-x-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <FaGithub className="h-6 w-6" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <FaTwitter className="h-6 w-6" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <FaLinkedin className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* FAQ */}
            <div className="glass rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-theater-silver mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-theater-silver mb-2">How do I create an account?</h3>
                  <p className="text-theater-silver/80">
                    Click the "Register" button in the navigation bar and fill out the registration form.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-theater-silver mb-2">Can I edit my reviews?</h3>
                  <p className="text-theater-silver/80">
                    Yes, you can edit and delete your own reviews from your profile page.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-theater-silver mb-2">How do I search for movies?</h3>
                  <p className="text-theater-silver/80">
                    Use the search bar in the navigation or visit the Movies page to browse and filter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
