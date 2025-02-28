import React from 'react';
import { motion } from 'framer-motion';

const AIResume: React.FC = () => {
  // Animation variants for fade-in effects
  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
    }),
  };

  const progressBarVariants = {
    hidden: { width: 0 },
    visible: (percent: number) => ({
      width: `${percent}%`,
      transition: { duration: 1, ease: 'easeOut', delay: 0.5 },
    }),
  };

  const circleProgressVariants = {
    hidden: { strokeDashoffset: 283 },
    visible: {
      strokeDashoffset: 70, // 75% of 283 (circle circumference)
      transition: { duration: 1.5, ease: 'easeOut', delay: 0.3 },
    },
  };

  // Feature data
  const features = [
    {
      title: 'Format Analysis',
      description: 'Get feedback on your resume’s structure, formatting, and visual appeal.',
      icon: (
        <svg className="w-6 h-6 text-[#1E88E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Content Review',
      description: 'Highlight your most impactful achievements and experiences.',
      icon: (
        <svg className="w-6 h-6 text-[#1E88E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
        </svg>
      ),
    },
    {
      title: 'Keyword Optimization',
      description: 'Add industry-specific keywords to pass ATS filters.',
      icon: (
        <svg className="w-6 h-6 text-[#1E88E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Smart Suggestions',
      description: 'Tailored recommendations to enhance your resume.',
      icon: (
        <svg className="w-6 h-6 text-[#1E88E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
  ];

  // Progress data
  const progressData = [
    { label: 'Format', percent: 90 },
    { label: 'Content Quality', percent: 75 },
    { label: 'ATS Compatibility', percent: 60 },
    { label: 'Keywords', percent: 80 },
  ];

  return (
    <section id="ai-resume" className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Column: Information */}
          <motion.div
            className="w-full lg:w-1/2"
            initial="hidden"
            animate="visible"
            variants={fadeInLeft}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-800">
              Boost Your Resume with AI Insights
            </h2>
            <p className="text-lg text-neutral-600 mb-8">
              Our AI-powered tool analyzes your resume, optimizing it for recruiters and ATS systems with actionable feedback.
            </p>

            {/* Features */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-md"
                    initial="hidden"
                    animate="visible"
                    variants={featureVariants}
                    custom={index}
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-neutral-800">{feature.title}</h3>
                    <p className="text-neutral-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Button */}
            <motion.button
              className="bg-[#1E88E5] hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Resume for Free Feedback
            </motion.button>
          </motion.div>

          {/* Right Column: Resume Score Visualization */}
          <motion.div
            className="w-full lg:w-1/2"
            initial="hidden"
            animate="visible"
            variants={fadeInRight}
          >
            <div className="bg-white rounded-xl shadow-lg p-8 relative">
              <div className="absolute top-0 right-0 bg-[#1E88E5] text-white px-4 py-2 rounded-bl-lg rounded-tr-lg font-semibold">
                AI Powered
              </div>

              {/* Resume Score */}
              <div className="mb-8 text-center">
                <h3 className="text-xl font-semibold mb-4 text-neutral-800">Resume Strength Score</h3>
                <div className="relative inline-block w-48 h-48">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e6e6e6" strokeWidth="8" />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#1E88E5"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="283"
                      transform="rotate(-90 50 50)"
                      variants={circleProgressVariants}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <motion.span
                      className="text-4xl font-bold text-neutral-800"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1, duration: 0.5 }}
                    >
                      75
                    </motion.span>
                    <span className="text-neutral-600">/100</span>
                  </div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-4">
                {progressData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-neutral-700">{item.label}</span>
                      <span className="text-[#1E88E5] font-medium">{item.percent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-[#1E88E5] h-2 rounded-full"
                        initial="hidden"
                        animate="visible"
                        variants={progressBarVariants}
                        custom={item.percent}
                      />
                    </div>
                  </div>
                ))}

                {/* Suggestions */}
                <motion.div
                  className="mt-8 pt-6 border-t border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  <h4 className="font-semibold text-lg mb-3 text-neutral-800">Top Suggestions:</h4>
                  <ul className="space-y-2">
                    {[
                      'Add measurable achievements with specific metrics.',
                      'Enhance ATS compatibility with key industry terms.',
                      'Shorten your summary section for conciseness.',
                    ].map((suggestion, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg className="w-5 h-5 text-[#1E88E5] mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="text-neutral-600">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIResume;