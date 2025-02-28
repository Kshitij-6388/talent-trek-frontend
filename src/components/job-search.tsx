import React from 'react';
import { motion } from 'framer-motion';

// Define types for job data (used in Featured and Recommended sections)
interface Job {
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
  logoBg: string;
  logoColor: string;
  logoText: string;
  isRemote?: boolean;
  workType: string;
}

const JobSearch: React.FC = () => {
  // Animation variants for fade-in-up effect
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.3, duration: 0.5 },
    }),
  };

  // Sample data for Featured Jobs
  const featuredJobs: Job[] = [
    {
      title: 'Senior UX Designer',
      company: 'TechCorp',
      location: 'San Francisco, CA (Remote)',
      salary: '$120,000 - $150,000',
      tags: ['Full-time', 'Remote', 'Design'],
      logoBg: 'bg-blue-100',
      logoColor: 'text-[#1E88E5]',
      logoText: 'TC',
      isRemote: true,
      workType: 'Remote',
    },
    {
      title: 'Full Stack Developer',
      company: 'Growth Horizon',
      location: 'New York, NY (Hybrid)',
      salary: '$90,000 - $120,000',
      tags: ['Full-time', 'Hybrid', 'Development'],
      logoBg: 'bg-green-100',
      logoColor: 'text-green-600',
      logoText: 'GH',
      workType: 'Hybrid',
    },
    {
      title: 'Marketing Manager',
      company: 'Innovate Inc',
      location: 'Austin, TX (On-site)',
      salary: '$85,000 - $105,000',
      tags: ['Full-time', 'On-site', 'Marketing'],
      logoBg: 'bg-purple-100',
      logoColor: 'text-purple-600',
      logoText: 'IN',
      workType: 'On-site',
    },
  ];

  // Sample data for Recommended Jobs
  const recommendedJobs: Job[] = [
    {
      title: 'Frontend Developer',
      company: 'Atlas Tech',
      location: 'Boston, MA (Remote)',
      salary: '$85,000 - $110,000',
      tags: ['Remote'],
      logoBg: 'bg-pink-100',
      logoColor: 'text-pink-600',
      logoText: 'AT',
      isRemote: true,
      workType: 'Remote',
    },
    {
      title: 'Data Analyst',
      company: 'NextStep Analytics',
      location: 'Chicago, IL (Hybrid)',
      salary: '$70,000 - $90,000',
      tags: ['Hybrid'],
      logoBg: 'bg-yellow-100',
      logoColor: 'text-yellow-600',
      logoText: 'NS',
      workType: 'Hybrid',
    },
  ];

  return (
    <section id="job-search" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-800">
            Find Your Dream Job
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Search through thousands of opportunities tailored to your skills and career goals.
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={1}
        >
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-neutral-900 text-sm rounded-lg focus:ring-[#1E88E5] focus:border-[#1E88E5] block w-full pl-10 p-3"
                placeholder="Job title or keyword"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-neutral-900 text-sm rounded-lg focus:ring-[#1E88E5] focus:border-[#1E88E5] block w-full pl-10 p-3"
                placeholder="Location"
              />
            </div>
            <div>
              <select className="bg-gray-50 border border-gray-300 text-neutral-900 text-sm rounded-lg focus:ring-[#1E88E5] focus:border-[#1E88E5] block w-full p-3">
                <option value="">Category</option>
                <option value="IT">Information Technology</option>
                <option value="FIN">Finance</option>
                <option value="MARK">Marketing</option>
                <option value="HR">Human Resources</option>
                <option value="ENG">Engineering</option>
                <option value="HEALTH">Healthcare</option>
                <option value="EDU">Education</option>
              </select>
            </div>
            <div>
              <select className="bg-gray-50 border border-gray-300 text-neutral-900 text-sm rounded-lg focus:ring-[#1E88E5] focus:border-[#1E88E5] block w-full p-3">
                <option value="">Experience Level</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="exec">Executive</option>
              </select>
            </div>
            <div className="md:col-span-2 lg:col-span-4">
              <button
                type="button"
                className="w-full bg-[#1E88E5] hover:bg-blue-700 text-white font-medium text-sm py-3 px-5 rounded-lg transition duration-300 flex justify-center items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Jobs
              </button>
            </div>
          </form>
        </motion.div>

        {/* Featured Jobs */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-neutral-800">Featured Jobs</h3>
            <a href="#" className="text-[#1E88E5] hover:text-blue-700 font-medium flex items-center">
              View All
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                custom={index}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 flex-shrink-0 rounded-full ${job.logoBg} flex items-center justify-center`}>
                      <span className={`font-bold ${job.logoColor}`}>{job.logoText}</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-lg text-neutral-800">{job.title}</h4>
                      <p className="text-neutral-600">{job.company}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center text-neutral-600 mb-2">
                      <svg className="w-5 h-5 mr-2 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </div>
                    <div className="flex items-center text-neutral-600">
                      <svg className="w-5 h-5 mr-2 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {job.salary}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-[#1E88E5] rounded-full text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="w-full bg-[#1E88E5] hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                    Apply Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recommended For You */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-neutral-800">Recommended For You</h3>
            <a href="#" className="text-[#1E88E5] hover:text-blue-700 font-medium flex items-center">
              View All
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedJobs.map((job, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                custom={index}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 flex-shrink-0 rounded-full ${job.logoBg} flex items-center justify-center`}>
                      <span className={`font-bold ${job.logoColor}`}>{job.logoText}</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-lg text-neutral-800">{job.title}</h4>
                      <p className="text-neutral-600">{job.company}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between">
                      <div className="flex items-center text-neutral-600">
                        <svg className="w-5 h-5 mr-2 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-[#1E88E5] rounded-full text-xs font-medium">
                        {job.workType}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-700 font-semibold">{job.salary}</span>
                    <button className="bg-[#1E88E5] hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                      Apply
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobSearch;