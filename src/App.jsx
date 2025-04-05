import { useState } from 'react';
import React from 'react'
import PropTypes from 'prop-types';
import { Upload, Shield, Scale, Heart, Brain, Menu, X } from 'lucide-react';


// Custom Alert Component
const CustomAlert = ({ children }) => (
  <div className="flex p-4 mb-6 text-sm rounded-lg bg-blue-900/20 border border-blue-400/20 text-gray-300">
    {children}
  </div>
);

CustomAlert.propTypes = {
  children: PropTypes.node.isRequired
};

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Contact form state
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);
  
  // Ethics modal state
  const [ethicsModalOpen, setEthicsModalOpen] = useState(false);

  const features = [
    { 
      icon: <Scale className="w-6 h-6 md:w-8 md:h-8" />, 
      title: "Ethical Analysis", 
      description: "Transparent and fair detection process with human oversight" 
    },
    { 
      icon: <Shield className="w-6 h-6 md:w-8 md:h-8" />, 
      title: "Privacy Focused", 
      description: "Your data is processed locally and never stored" 
    },
    { 
      icon: <Heart className="w-6 h-6 md:w-8 md:h-8" />, 
      title: "Human-Centered", 
      description: "Supporting authenticity in digital media" 
    },
    { 
      icon: <Brain className="w-6 h-6 md:w-8 md:h-8" />, 
      title: "Responsible AI", 
      description: "Built with ethical AI principles" 
    }
  ];

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file && isValidFileType(file)) {
      setSelectedFile(file);
      setPrediction(null);
    }
  };

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(event.type === "dragenter" || event.type === "dragover");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    const file = event.dataTransfer.files[0];
    if (file && isValidFileType(file)) {
      setSelectedFile(file);
      setPrediction(null);
    }
  };

  const isValidFileType = (file) => {
    return ['video/mp4', 'video/quicktime'].includes(file.type);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Contact form handlers
  const openContactModal = () => {
    setContactModalOpen(true);
    setFormSubmitted(false);
    setFormError(null);
  };

  const closeContactModal = () => {
    setContactModalOpen(false);
  };

  // Ethics modal handlers
  const openEthicsModal = () => {
    setEthicsModalOpen(true);
  };

  const closeEthicsModal = () => {
    setEthicsModalOpen(false);
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // const handleContactSubmit = async (e) => {
  //   e.preventDefault();
  //   setFormError(null);
    
  //   // Basic validation
  //   if (!contactForm.name || !contactForm.email || !contactForm.message) {
  //     setFormError("All fields are required");
  //     return;
  //   }
    
  //   // Email validation
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(contactForm.email)) {
  //     setFormError("Please enter a valid email address");
  //     return;
  //   }

  //   // Simulating form submission
  //   try {
  //     // In production, replace with actual API call
  //     // await fetch('/api/contact', {
  //     //   method: 'POST',
  //     //   headers: { 'Content-Type': 'application/json' },
  //     //   body: JSON.stringify(contactForm)
  //     // });
      
  //     // Simulate API delay
  //     await new Promise(resolve => setTimeout(resolve, 1000));
      
  //     setFormSubmitted(true);
  //     setContactForm({ name: '', email: '', message: '' });
      
  //     // Close modal after 3 seconds on successful submission
  //     setTimeout(() => {
  //       closeContactModal();
  //     }, 3000);
  //   } catch (error) {
  //     console.error('Error submitting form:', error);
  //     setFormError("Something went wrong. Please try again later.");
  //   }
  // };

  // Add this import at the top of your file


// Update your handleContactSubmit function
const handleContactSubmit = async (e) => {
  e.preventDefault();
  
  // Validate form fields
  if (!contactForm.name || !contactForm.email || !contactForm.message) {
    setFormError("All fields are required");
    return;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contactForm.email)) {
    setFormError("Please enter a valid email address");
    return;
  }
  
  try {
    setFormError("");
    
    // Option 2: Using a third-party service like EmailJS
    /* 
    await emailjs.send(
      'YOUR_SERVICE_ID',  // Replace with your service ID
      'YOUR_TEMPLATE_ID', // Replace with your template ID
      contactForm,
      'YOUR_USER_ID'      // Replace with your user ID
    );
    */
    
    // Option 3: Using a serverless function (e.g., AWS Lambda, Netlify Functions)
    /*
    await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      body: JSON.stringify(contactForm),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    */
    
    setFormSubmitted(true);
    
    // Reset form after successful submission
    setContactForm({
      name: '',
      email: '',
      message: ''
    });
    
    // Optionally close the modal after a delay
    setTimeout(() => {
      closeContactModal();
      setFormSubmitted(false);
    }, 3000);
    
  } catch (error) {
    console.error('Error sending message:', error);
    setFormError("Failed to send message. Please try again later.");
  }
};

  const handleContactClick = () => {
    openContactModal();
  };

  const toggleEthicsModal = () => {
    setShowEthicsModal(!showEthicsModal);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Modern animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/10 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* <Shield className="w-8 h-8 text-blue-400" /> */}
              <img width="35px" src="../src/assets/logo.svg" alt="" />
              <span className="pl-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                ClarifAI
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                href="#"
              >
                About
              </a>
              <button
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                onClick={openEthicsModal}
              >
                Ethics
              </button>
              <a
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                href="#"
              >
                Transparency
              </a>
              <button
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                onClick={handleContactClick}
              >
                Contact
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4">
              <a
                className="block py-2 text-gray-300 hover:text-white transition-colors"
                href="#"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <button
                className="block w-full text-left py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => {
                  openEthicsModal();
                  setMobileMenuOpen(false);
                }}
              >
                Ethics
              </button>
              <a
                className="block py-2 text-gray-300 hover:text-white transition-colors"
                href="#"
                onClick={() => setMobileMenuOpen(false)}
              >
                Transparency
              </a>
              <button
                className="block w-full text-left py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => {
                  handleContactClick();
                  setMobileMenuOpen(false);
                }}
              >
                Contact
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Detect DeepFake Content
            </span>
            <br />
            <span className="text-white">With Confidence</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Advanced detection powered by AI technology
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-20">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="text-blue-400 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Upload Section */}
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 p-6 md:p-8">
            <CustomAlert>
              Your privacy matters. Analysis is performed locally, and no data is stored.
            </CustomAlert>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-xl p-6 md:p-8 text-center relative transition-all
                  ${dragActive ? 'border-blue-400 bg-white/5' : 'border-white/20'}
                  ${dragActive ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  accept="video/mp4,video/quicktime"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-10 h-10 md:w-12 md:h-12 text-blue-400 mb-4" />
                  <span className="text-blue-400 font-medium text-lg">
                    Drop your file here
                  </span>
                  <span className="text-sm text-gray-400 mt-2">
                    MP4 up to 50MB
                  </span>
                </label>
                {selectedFile && (
                  <div className="mt-4 text-gray-300 text-sm">
                    Selected: {selectedFile.name}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!selectedFile || loading}
                className={`w-full py-4 px-6 rounded-xl font-medium text-sm transition-all duration-300
                  ${!selectedFile || loading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:-translate-y-1'
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing
                  </span>
                ) : (
                  'Detect Deepfake'
                )}
              </button>
            </form>

            {prediction && (
              <div className="mt-6 p-6 rounded-xl bg-white/5 border border-white/10 animate-fade-in">
                <h3 className="text-xl font-semibold mb-3">Analysis Results</h3>
                <p className="text-gray-300">
                  {prediction === 'real'
                    ? 'This content appears to be authentic. However, we encourage critical thinking and verification from multiple sources.'
                    : 'This content shows potential signs of manipulation. We recommend seeking additional verification and context.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <p className="text-sm text-gray-400">Committed to ethical AI practices and digital authenticity.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <button 
                  onClick={openEthicsModal}
                  className="block text-left w-full text-sm text-gray-400 hover:text-white"
                >
                  Ethics Policy
                </button>
                <a href="#" className="block text-sm text-gray-400 hover:text-white">Privacy Statement</a>
                <a href="#" className="block text-sm text-gray-400 hover:text-white">Terms of Service</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="space-y-2">
                <button
                  onClick={handleContactClick}
                  className="block text-left w-full text-sm text-gray-400 hover:text-white"
                >
                  Contact Us
                </button>
                <a href="#" className="block text-sm text-gray-400 hover:text-white">Support</a>
                <a href="#" className="block text-sm text-gray-400 hover:text-white">Documentation</a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-400">
            © 2025 ClarifAI. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
              onClick={closeContactModal}
            ></div>

            {/* Modal */}
            <div className="relative bg-gray-900 border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-xl transform transition-all">
              <button 
                onClick={closeContactModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Contact Us
                </h3>
                <p className="text-gray-300 mt-2">
                  We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              {formSubmitted ? (
                <div className="p-6 rounded-xl bg-green-900/20 border border-green-400/20 text-center">
                  <h4 className="text-xl font-medium text-green-400 mb-2">Message Sent!</h4>
                  <p className="text-gray-300">Thank you for reaching out. We'll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  {formError && (
                    <div className="p-3 rounded-lg bg-red-900/20 border border-red-400/20 text-red-400 text-sm">
                      {formError}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="name">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactChange}
                      rows="4"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl font-medium text-sm bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ethics Modal */}
      {ethicsModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
              onClick={closeEthicsModal}
            ></div>

            {/* Modal */}
            <div className="relative bg-gray-900 border border-white/10 rounded-2xl max-w-4xl w-full p-6 shadow-xl transform transition-all max-h-[90vh] overflow-y-auto">
              <button 
                onClick={closeEthicsModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Terms and Conditions
                </h3>
              </div>

              <div className="prose prose-invert max-w-none">
                <h4 className="text-xl font-medium text-blue-400 mb-4">1. Introduction</h4>
                <p className="text-gray-300 mb-4">
                  Welcome to ClarifAI. By using our deepfake detection service, you agree to comply with and be bound by the following terms and conditions of use. Please review these terms carefully before using our platform.
                </p>

                <h4 className="text-xl font-medium text-blue-400 mb-4">2. Acceptable Use</h4>
                <p className="text-gray-300 mb-4">
                  You agree to use ClarifAI solely for the purpose of detecting potential deepfake content. You will not use our service to:
                </p>
                <ul className="list-disc pl-6 text-gray-300 mb-4">
                  <li>Violate any local, state, national, or international law or regulation</li>
                  <li>Infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>Attempt to reverse engineer or extract the algorithms or mechanisms by which our platform operates</li>
                  <li>Upload content that contains malware, viruses, or other malicious code</li>
                  <li>Upload content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable</li>
                </ul>

                <h4 className="text-xl font-medium text-blue-400 mb-4">3. Privacy and Data Usage</h4>
                <p className="text-gray-300 mb-4">
                  We are committed to protecting your privacy. All content uploaded for analysis is processed locally and is not permanently stored on our servers. We do not share your data with third parties. For more details, please refer to our Privacy Policy.
                </p>

                <h4 className="text-xl font-medium text-blue-400 mb-4">4. Service Limitations</h4>
                <p className="text-gray-300 mb-4">
                  While we strive for accuracy, our deepfake detection technology is not infallible. Results should be used as one tool among many for verifying content authenticity. We do not guarantee 100% accuracy in all cases, and results should be interpreted with appropriate caution.
                </p>

                <h4 className="text-xl font-medium text-blue-400 mb-4">5. Disclaimers</h4>
                <p className="text-gray-300 mb-4">
                  ClarifAI is provided "as is" without warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted or error-free, that defects will be corrected, or that the platform is free of viruses or other harmful components.
                </p>

                <h4 className="text-xl font-medium text-blue-400 mb-4">6. Limitation of Liability</h4>
                <p className="text-gray-300 mb-4">
                  In no event shall ClarifAI be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
                </p>

                <h4 className="text-xl font-medium text-blue-400 mb-4">7. Changes to Terms</h4>
                <p className="text-gray-300 mb-4">
                  We reserve the right to modify these terms at any time. We will provide notice of significant changes by updating the date at the top of these terms and by maintaining a current version of the terms on our website.
                </p>

                <h4 className="text-xl font-medium text-blue-400 mb-4">8. Governing Law</h4>
                <p className="text-gray-300 mb-4">
                  These terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.
                </p>

                <h4 className="text-xl font-medium text-blue-400 mb-4">9. Contact Information</h4>
                <p className="text-gray-300 mb-4">
                  If you have any questions about these Terms, please contact us through the contact form on our website.
                </p>

                <p className="text-gray-300 mt-8 font-medium">
                  By using ClarifAI, you acknowledge that you have read these terms of service and agree to be bound by them.
                  
                </p>

                
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button 
                onClick={toggleEthicsModal}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-sm font-medium transition-all duration-300"
              >
                I Understand
              </button>
            </div>
              
            </div>

            
            
          </div>
          
        </div>
      )}
    </div>
  );
};

export default App;