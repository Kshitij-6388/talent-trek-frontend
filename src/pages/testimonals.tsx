import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Testimonials: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'job-seekers' | 'recruiters'>('job-seekers');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.3, duration: 0.6, ease: 'easeOut' },
    }),
  };

  const tabContentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const slideVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.5 } },
  };

  // Testimonial data
  const jobSeekerTestimonials = [
    {
      name: 'Sarah Johnson',
      role: 'UX Designer at TechVision',
      quote: 'The AI resume feedback was a game-changer. After implementing the suggestions, I got callbacks from 4 companies within a week and landed my dream job with a 35% salary increase!',
      avatarColor: 'bg-blue-200',
      textColor: 'text-[#1E88E5]',
      badge: 'Got hired in 3 weeks',
      badgeColor: 'bg-green-100 text-green-800',
    },
    {
      name: 'Michael Rodriguez',
      role: 'Data Analyst at FinScope',
      quote: 'As a career changer, TalentTrek’s job matching highlighted roles aligning with my transferable skills. The recommendations were spot on!',
      avatarColor: 'bg-green-200',
      textColor: 'text-green-600',
      badge: 'Career changer',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      name: 'Emma Chen',
      role: 'Marketing Associate at BrandWave',
      quote: 'As a recent graduate, TalentTrek’s AI feedback helped me quantify my internships and coursework. I got multiple interviews within days!',
      avatarColor: 'bg-purple-200',
      textColor: 'text-purple-600',
      badge: 'Recent graduate',
      badgeColor: 'bg-yellow-100 text-yellow-800',
    },
  ];

  const recruiterTestimonials = [
    {
      name: 'Jennifer Thompson',
      role: 'HR Director at Quantum Solutions',
      quote: 'TalentTrek’s AI matching cut our time-to-hire by 50%. Pre-qualified candidates are delivered straight to us—it’s a game-changer!',
      avatarColor: 'bg-red-200',
      textColor: 'text-red-600',
      badge: 'Hire time reduced by 50%',
      badgeColor: 'bg-red-100 text-red-800',
    },
    {
      name: 'David Wilson',
      role: 'CEO at CreativeEdge Studio',
      quote: 'As a small business owner, TalentTrek simplifies finding qualified candidates fast. The AI matching ensures perfect cultural fits.',
      avatarColor: 'bg-orange-200',
      textColor: 'text-orange-600',
      badge: 'Small business owner',
      badgeColor: 'bg-orange-100 text-orange-800',
    },
    {
      name: 'Alisha Patel',
      role: 'Tech Recruiter at InnovateTech',
      quote: 'The AI understands nuanced skill needs, delivering top candidates. We’ve reduced bad hires by 80%!',
      avatarColor: 'bg-teal-200',
      textColor: 'text-teal-600',
      badge: 'Tech industry',
      badgeColor: 'bg-teal-100 text-teal-800',
    },
  ];

  const testimonials = activeTab === 'job-seekers' ? jobSeekerTestimonials : recruiterTestimonials;
  const totalSlides = testimonials.length;

  // Auto-rotation for carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const goToSlide = (index: number) => setCurrentSlide(index);

  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={0}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-800">Success Stories</h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Hear from job seekers and recruiters about their TalentTrek experiences.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="flex justify-center border-b border-gray-200">
            <button
              className={`py-2 px-4 font-medium border-b-2 focus:outline-none transition-colors duration-300 ${
                activeTab === 'job-seekers'
                  ? 'border-[#1E88E5] text-[#1E88E5]'
                  : 'border-transparent text-neutral-500 hover:text-[#1E88E5]'
              }`}
              onClick={() => {
                setActiveTab('job-seekers');
                setCurrentSlide(0);
              }}
            >
              Job Seekers
            </button>
            <button
              className={`py-2 px-4 font-medium border-b-2 focus:outline-none transition-colors duration-300 ${
                activeTab === 'recruiters'
                  ? 'border-[#1E88E5] text-[#1E88E5]'
                  : 'border-transparent text-neutral-500 hover:text-[#1E88E5]'
              }`}
              onClick={() => {
                setActiveTab('recruiters');
                setCurrentSlide(0);
              }}
            >
              Recruiters
            </button>
          </div>
        </div>

        {/* Testimonial Carousel */}
        <motion.div
          key={activeTab}
          initial="hidden"
          animate="visible"
          variants={tabContentVariants}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative">
            <motion.div
              key={currentSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={slideVariants}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`bg-blue-50 rounded-xl shadow-md p-8 md:flex ${index === currentSlide ? 'block' : 'hidden'}`}
                >
                  <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                    <div className={`w-24 h-24 rounded-full ${testimonial.avatarColor} overflow-hidden flex items-center justify-center`}>
                      <svg className={`w-16 h-16 ${testimonial.textColor}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="md:w-2/3 md:pl-8">
                    <div className="flex mb-4">
                      {Array(5).fill(0).map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-neutral-600 italic mb-6">"{testimonial.quote}"</p>
                    <div>
                      <h4 className="font-semibold text-lg text-neutral-800">{testimonial.name}</h4>
                      <p className="text-neutral-500">{testimonial.role}</p>
                      <div className="mt-3 flex items-center">
                        <span className={`${testimonial.badgeColor} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                          {testimonial.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Navigation Arrows */}
            <button
              className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md z-10 flex items-center justify-center text-neutral-600 hover:bg-gray-100 focus:outline-none"
              onClick={prevSlide}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md z-10 flex items-center justify-center text-neutral-600 hover:bg-gray-100 focus:outline-none"
              onClick={nextSlide}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full focus:outline-none ${index === currentSlide ? 'bg-[#1E88E5]' : 'bg-gray-300'}`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={1}
        >
          {[
            { value: '90%', label: 'Job Search Success' },
            { value: '75%', label: 'Faster Hiring' },
            { value: '10K+', label: 'Happy Users' },
            { value: '85%', label: 'Resume Improvement' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-[#1E88E5]">{stat.value}</div>
              <div className="text-neutral-600 mt-2">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={2}
        >
          <div className="inline-block py-3 px-6 rounded-full bg-blue-50 text-[#1E88E5] font-medium mb-8">
            Ready to transform your career or recruitment process?
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.a
              href="#job-search"
              className="bg-[#1E88E5] hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300"
              whileHover={{ scale: 1.05 }}
            >
              Find Jobs
            </motion.a>
            <motion.a
              href="#recruiter"
              className="bg-transparent border-2 border-[#1E88E5] text-[#1E88E5] hover:bg-blue-50 font-medium py-3 px-8 rounded-lg transition duration-300"
              whileHover={{ scale: 1.05 }}
            >
              Post a Job
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;