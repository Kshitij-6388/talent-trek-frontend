import React from 'react';

const Hero = () => {
  return (
    <section id="hero" className="bg-neutral-900 text-white min-h-[70vh] flex items-center relative overflow-hidden">
      <div className="absolute inset-0 "></div>
     
      <div className="container mx-auto px-6 py-16 relative z-10 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0 animate__animated animate__fadeInLeft">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">Your Next Career Move Starts Here</h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl mx-auto lg:mx-0">
            TalentTrek helps job seekers find the right opportunities and empowers recruiters to connect with top talent.
            Get AI-powered resume feedback and apply with confidence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="/signin"
              className="bg-[#1E88E5] hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 text-center"
            >
              Find Jobs
            </a>
            <a
                          href="/signin"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-neutral-900 text-white font-medium py-3 px-6 rounded-lg transition duration-300 text-center"
            >
              Post a Job
            </a>
          </div>
        </div>
        <div className="lg:w-1/2 animate__animated animate__fadeInRight">
          <div className="relative mx-auto w-full max-w-md">
            <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <circle cx="300" cy="200" r="150" fill="#1E88E5" opacity="0.1" />
              <circle cx="300" cy="200" r="100" fill="#1E88E5" opacity="0.2" />
              <rect x="200" y="120" width="200" height="250" rx="10" fill="white" />
              <rect x="220" y="150" width="160" height="10" rx="5" fill="#E0E0E0" />
              <rect x="220" y="170" width="120" height="10" rx="5" fill="#E0E0E0" />
              <rect x="220" y="190" width="140" height="10" rx="5" fill="#E0E0E0" />
              <rect x="220" y="210" width="100" height="10" rx="5" fill="#E0E0E0" />
              <rect x="220" y="230" width="160" height="10" rx="5" fill="#E0E0E0" />
              <rect x="220" y="250" width="130" height="10" rx="5" fill="#E0E0E0" />
              <rect x="220" y="270" width="140" height="10" rx="5" fill="#E0E0E0" />
              <rect x="220" y="290" width="120" height="10" rx="5" fill="#E0E0E0" />
              <rect x="220" y="310" width="150" height="10" rx="5" fill="#E0E0E0" />
              <rect x="200" y="200" width="200" height="4" fill="#1E88E5" opacity="0.7">
                <animate attributeName="y" from="120" to="370" dur="3s" repeatCount="indefinite" />
              </rect>
              <circle cx="350" cy="80" r="40" fill="#FF5722" opacity="0.9" />
              <circle cx="350" cy="60" r="15" fill="white" />
              <path d="M325 95 C325 80 375 80 375 95 C375 110 325 110 325 95" fill="white" />
              <path d="M300 200 L400 150" stroke="#1E88E5" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M300 220 L420 260" stroke="#1E88E5" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M300 180 L420 120" stroke="#1E88E5" strokeWidth="2" strokeDasharray="5,5" />
              <circle cx="420" cy="120" r="10" fill="#1E88E5" />
              <circle cx="400" cy="150" r="10" fill="#1E88E5" />
              <circle cx="420" cy="260" r="10" fill="#1E88E5" />
            </svg>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;