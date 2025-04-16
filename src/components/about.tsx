"use client"
import React from 'react';
import { Shield, Scale, Heart, Brain, Menu, X, Globe, Users, BookOpen, Award, CheckCircle } from 'lucide-react';

const AboutUsPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);
  const [contactModalOpen, setContactModalOpen] = React.useState<boolean>(false);
  const [ethicsModalOpen, setEthicsModalOpen] = React.useState<boolean>(false);

  const detectionFeatures = [
    {
      icon: <CheckCircle className="w-6 h-6 text-blue-400" />,
      title: "Facial Analysis",
      description: "Advanced algorithms that detect inconsistencies in facial movements, blinking patterns, and skin texture."
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-blue-400" />,
      title: "Audio Verification",
      description: "Sophisticated audio analysis that identifies synthetic voices and speech manipulation."
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-blue-400" />,
      title: "Metadata Scanning",
      description: "Examination of video metadata for signs of editing or generation by AI tools."
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-blue-400" />,
      title: "Temporal Consistency",
      description: "Analysis of frame-to-frame consistency that deepfake generators often struggle to maintain."
    }
  ];

  const technologyPillars = [
    {
      icon: <Brain className="w-10 h-10 text-purple-400" />,
      title: "AI-powered Detection",
      description: "Our proprietary neural networks have been trained on massive datasets of both authentic and synthetic media."
    },
    {
      icon: <Shield className="w-10 h-10 text-blue-400" />,
      title: "Privacy-First Approach",
      description: "All processing happens locally, with no permanent storage of your uploaded content."
    },
    {
      icon: <Scale className="w-10 h-10 text-pink-400" />,
      title: "Ethical Development",
      description: "Built with transparency and fairness at its core, our technology aims to protect, not restrict."
    }
  ];

  const openContactModal = () => {
    setContactModalOpen(true);
  };

  const openEthicsModal = () => {
    setEthicsModalOpen(true);
  };

  const handleContactClick = () => {
    openContactModal();
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
              <img width="35px" src="logo.svg" alt="ClarifAI Logo" />
              <span className="pl-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                ClarifAI
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                className="text-sm font-medium text-white border-b-2 border-purple-400 transition-colors"
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
                className="block py-2 text-white font-medium"
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
              About ClarifAI
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Empowering authenticity in a world of synthetic media
          </p>
        </div>

        {/* Mission Section */}
        <div className="max-w-4xl mx-auto mb-16 md:mb-24">
          <div className="rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Our Mission</h2>
            <p className="text-gray-300 text-lg mb-6">
              At ClarifAI, we believe in a digital world where people can trust what they see and hear. As deepfake technology becomes increasingly sophisticated, the line between real and synthetic media continues to blur, threatening the fabric of trust in digital communication.
            </p>
            <p className="text-gray-300 text-lg mb-6">
              Our mission is to develop and provide accessible, user-friendly tools that empower individuals and organizations to verify the authenticity of digital content, particularly videos that may have been manipulated or artificially generated using deepfake technology.
            </p>
            <p className="text-gray-300 text-lg">
              We are committed to maintaining the highest standards of privacy, ethics, and transparency in our operations, ensuring that our technology serves as a force for good in the digital ecosystem.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-16 md:mb-24">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">How ClarifAI Detects Deepfakes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {detectionFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="rounded-xl backdrop-blur-lg bg-white/5 border border-white/10 p-6 flex items-start"
              >
                <div className="mr-4 mt-1">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Pillars */}
        <div className="mb-16 md:mb-24">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Technology</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {technologyPillars.map((pillar, index) => (
              <div 
                key={index} 
                className="rounded-xl backdrop-blur-lg bg-white/5 border border-white/10 p-6 text-center"
              >
                <div className="flex justify-center mb-4">{pillar.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{pillar.title}</h3>
                <p className="text-gray-300">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Accuracy & Limitations */}
        <div className="max-w-4xl mx-auto mb-16 md:mb-24">
          <div className="rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Accuracy & Limitations</h2>
            <p className="text-gray-300 text-lg mb-6">
              ClarifAI achieves over 95% accuracy on benchmark datasets, but we believe in transparency about our limitations. As deepfake technology evolves, so does our detection methodology.
            </p>
            <p className="text-gray-300 text-lg mb-6">
              Our algorithm performs best on video content with clear facial visibility and sufficient duration. Results should be used as one tool among many for verifying content authenticity, not as definitive proof.
            </p>
            <p className="text-gray-300 text-lg">
              We continuously improve our models through responsible research and development, always staying at the forefront of deepfake detection capabilities while maintaining our ethical standards.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Verify Content?</h2>
          <a 
            href="/"
            className="inline-block py-4 px-8 rounded-xl font-medium text-sm bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:-translate-y-1 transition-all duration-300"
          >
            Try ClarifAI Now
          </a>
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
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sm text-gray-400">Have questions or feedback? Reach out to our team.</p>
              <button 
                onClick={openContactModal}
                className="mt-2 text-sm text-blue-400 hover:underline"
              >
                Contact Us
              </button>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} ClarifAI. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Contact Modal Placeholder */}
      {contactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-xl w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-700 hover:text-black"
              onClick={() => setContactModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="text-sm mb-4">This is a placeholder for the contact form/modal content.</p>
            <button
              onClick={() => setContactModalOpen(false)}
              className="mt-2 px-4 py-2 text-white bg-purple-500 hover:bg-purple-600 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Ethics Modal Placeholder */}
      {ethicsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-xl w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-700 hover:text-black"
              onClick={() => setEthicsModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-4">Ethics Policy</h3>
            <p className="text-sm mb-4">This is a placeholder for the ethics policy/modal content.</p>
            <button
              onClick={() => setEthicsModalOpen(false)}
              className="mt-2 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUsPage;
