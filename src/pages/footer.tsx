// Footer.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Interface for footer link sections
interface FooterSectionProps {
  title: string;
  links: { text: string; href: string }[];
}

// Interface for social media icons
interface SocialIcon {
  platform: string;
  path: string;
  fillRule?: 'inherit' | 'evenodd' | 'nonzero'; // Specific SVG fillRule values
  clipRule?: 'inherit' | 'evenodd' | 'nonzero'; // Specific SVG clipRule values
}

const FooterSection: React.FC<FooterSectionProps> = ({ title, links }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
  >
    <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
    <ul className="space-y-3">
      {links.map((link, index) => (
        <li key={index}>
          <a href={link.href} className="text-neutral-400 hover:text-[#1E88E5] transition-colors">
            {link.text}
          </a>
        </li>
      ))}
    </ul>
  </motion.div>
);

const Footer: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Define social icons with proper typing
  const socialIcons: SocialIcon[] = [
    {
      platform: 'LinkedIn',
      path: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'
    },
    {
      platform: 'Twitter',
      path: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84'
    },
    {
      platform: 'Instagram',
      path: 'M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z',
      fillRule: 'evenodd',
      clipRule: 'evenodd'
    },
  ];

  return (
    <footer id="footer" className="bg-neutral-900 text-white">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <motion.div
          className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* About Section */}
          <motion.div variants={containerVariants}>
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold text-white">TalentTrek</span>
            </div>
            <p className="text-neutral-400 mb-6">
              Your Career Compass. TalentTrek connects job seekers with opportunities and employers with talent.
            </p>
            <div className="flex space-x-4">
              {socialIcons.map((social) => (
                <motion.a
                  key={social.platform}
                  href="#"
                  className="text-neutral-400 hover:text-[#1E88E5] transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="sr-only">{social.platform}</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule={social.fillRule}
                      clipRule={social.clipRule}
                      d={social.path}
                    />
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Sections */}
          <FooterSection
            title="For Job Seekers"
            links={[
              { text: 'Search Jobs', href: '#job-search' },
              { text: 'Resume Feedback', href: '#ai-resume' },
              { text: 'Career Resources', href: '#' },
              { text: 'Salary Guide', href: '#' },
              { text: 'Interview Tips', href: '#' },
            ]}
          />
          <FooterSection
            title="For Recruiters"
            links={[
              { text: 'Post a Job', href: '#recruiter' },
              { text: 'Talent Search', href: '#' },
              { text: 'Employer Branding', href: '#' },
              { text: 'Pricing', href: '#' },
              { text: 'Enterprise Solutions', href: '#' },
            ]}
          />
          <FooterSection
            title="Company"
            links={[
              { text: 'About Us', href: '#' },
              { text: 'Contact', href: '#' },
              { text: 'Privacy Policy', href: '#' },
              { text: 'Terms of Use', href: '#' },
              { text: 'FAQ', href: '#' },
            ]}
          />
        </motion.div>

        {/* Newsletter Subscription */}
        <motion.div
          className="py-8 border-t border-neutral-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="max-w-xl mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-white text-center">Stay Updated</h3>
            <p className="text-neutral-400 mb-4 text-center">
              Subscribe to our newsletter for the latest job opportunities and career insights.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow bg-neutral-800 border border-neutral-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
              />
              <motion.button
                type="submit"
                className="bg-[#1E88E5] hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Copyright & Bottom Links */}
        <motion.div
          className="py-6 border-t border-neutral-800 text-center md:flex md:justify-between md:items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="text-neutral-500 mb-4 md:mb-0">
            © 2023 TalentTrek. All rights reserved.
          </div>
          <div className="flex justify-center space-x-6">
            {['Terms', 'Privacy', 'Cookies', 'Sitemap'].map((link) => (
              <a key={link} href="#" className="text-neutral-500 hover:text-[#1E88E5] transition-colors">
                {link}
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        className="fixed bottom-8 right-8 bg-[#1E88E5] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showBackToTop ? 1 : 0, y: showBackToTop ? 0 : 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
      >
        <span className="sr-only">Back to top</span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
      </motion.button>
    </footer>
  );
};

export default Footer;