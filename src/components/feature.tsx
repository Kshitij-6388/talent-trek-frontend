// RecruiterSection.tsx
import React from 'react';
import { motion } from 'framer-motion';

// Interface for feature props
interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Feature component
const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => (
  <motion.div 
    className="flex items-start"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
  >
    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-2 text-neutral-800">{title}</h3>
      <p className="text-neutral-600">{description}</p>
    </div>
  </motion.div>
);

const RecruiterSection: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <section id="recruiter" className="py-16 bg-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50 transform -skew-x-12 translate-x-1/4 z-0"></div>
      <div className="absolute -bottom-48 -left-24 w-96 h-96 bg-[#1E88E5] opacity-10 rounded-full"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left column */}
          <motion.div 
            className="w-full lg:w-1/2 pr-0 lg:pr-12 mb-12 lg:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-800">
              Find the Right Talent Fast
            </h2>
            <p className="text-lg text-neutral-600 mb-10">
              TalentTrek helps employers and recruiters find perfect candidates with our AI-powered matching system. Post jobs, review applications, and connect with qualified talent all in one place.
            </p>

            <div className="space-y-6 mb-10">
              <Feature
                icon={
                  <svg className="w-6 h-6 text-[#1E88E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                }
                title="Post a Job in Minutes"
                description="Our streamlined job posting process makes it quick and easy to create detailed job listings that attract the right candidates."
              />
              <Feature
                icon={
                  <svg className="w-6 h-6 text-[#1E88E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                }
                title="AI-Smart Candidate Matching"
                description="Our AI analyzes candidate resumes and profiles to match them with your job requirements, saving you time in the screening process."
              />
              <Feature
                icon={
                  <svg className="w-6 h-6 text-[#1E88E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                }
                title="Customizable Job Listings"
                description="Design your job posts with custom branding, screening questions, and application requirements to attract qualified candidates."
              />
            </div>

            <a href="#" className="inline-block bg-[#1E88E5] hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300">
              Get Started – Post a Job
            </a>
          </motion.div>

          {/* Right column */}
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 relative">
              <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
                LIVE DEMO
              </div>

              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <h3 className="text-xl font-semibold mb-6 text-neutral-800">Post Your Job</h3>

                <motion.div variants={itemVariants} className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-700">Job Title</label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-neutral-900 text-sm rounded-lg focus:ring-[#1E88E5] focus:border-[#1E88E5] block w-full p-3"
                      placeholder="e.g. Senior Software Engineer"
                      defaultValue="Marketing Director"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-neutral-700">Location</label>
                      <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-neutral-900 text-sm rounded-lg focus:ring-[#1E88E5] focus:border-[#1E88E5] block w-full p-3"
                        placeholder="e.g. New York, NY"
                        defaultValue="San Francisco, CA"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-neutral-700">Employment Type</label>
                      <select className="bg-gray-50 border border-gray-300 text-neutral-900 text-sm rounded-lg focus:ring-[#1E88E5] focus:border-[#1E88E5] block w-full p-3">
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Internship</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-700">Salary Range</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-neutral-500">$</span>
                        </div>
                        <input
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-neutral-900 text-sm rounded-lg focus:ring-[#1E88E5] focus:border-[#1E88E5] block w-full pl-8 p-3"
                          placeholder="Min"
                          defaultValue="90,000"
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-neutral-500">$</span>
                        </div>
                        <input
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-neutral-900 text-sm rounded-lg focus:ring-[#1E88E5] focus:border-[#1E88E5] block w-full pl-8 p-3"
                          placeholder="Max"
                          defaultValue="120,000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Skills section would need state management - simplified here */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-700">Skills Required</label>
                    <div className="bg-gray-50 border border-gray-300 p-3 rounded-lg">
                      <div className="flex flex-wrap gap-2">
                        {['Digital Marketing', 'Social Media', 'Content Strategy', 'SEO'].map((skill) => (
                          <span key={skill} className="bg-[#1E88E5] text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                            {skill}
                            <button className="ml-1 focus:outline-none">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                              </svg>
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          className="outline-none bg-transparent text-neutral-600 border-none p-0 flex-grow min-w-[100px]"
                          placeholder="Add skills..."
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* AI Match Visualization */}
                <motion.div
                  className="bg-blue-50 rounded-lg p-4 mb-6"
                  variants={itemVariants}
                >
                  <h4 className="font-semibold text-neutral-800 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#1E88E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    AI Talent Pool Insights
                  </h4>
                  <p className="text-sm text-neutral-600 mb-4">Based on your job description, we found:</p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-[#1E88E5]">143</div>
                      <div className="text-xs text-neutral-600">Potential Matches</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-[#1E88E5]">37</div>
                      <div className="text-xs text-neutral-600">Perfect Fits</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-[#1E88E5]">92%</div>
                      <div className="text-xs text-neutral-600">Fill Rate</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 bg-[#1E88E5] hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300">
                    Post Job Now
                  </button>
                  <button className="flex-1 bg-transparent border border-[#1E88E5] text-[#1E88E5] hover:bg-blue-50 font-medium py-3 px-6 rounded-lg transition duration-300">
                    Save Draft
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RecruiterSection;