import React, { useState } from 'react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header id="header">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-4 dark:bg-neutral-900 fixed w-full z-50 shadow-md">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <a href="#" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap text-primary-600 dark:text-white">
              TalentTrek
            </span>
          </a>
          <div className="flex items-center lg:order-2">
            <a
              href="/signin"
              className="text-white bg-[#1E88E5] hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 focus:outline-none"
            >
              Find Jobs
            </a>
            <a
           href="/signin"
              className="text-[#1E88E5] border border-[#1E88E5] hover:bg-blue-50 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 focus:outline-none"
            >
              Post a Job
            </a>
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-neutral-800 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
          <div
            className={`${
              isMobileMenuOpen ? 'block' : 'hidden'
            } justify-between items-center w-full lg:flex lg:w-auto lg:order-1`}
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              {['Home', 'Job Search', 'For Recruiters', 'How It Works', 'Testimonials'].map(
                (item, index) => (
                  <li key={index}>
                    <a
                      href={`#${item.toLowerCase().replace(' ', '-')}`}
                      className={`block py-2 pr-4 pl-3 ${
                        index === 0
                          ? 'text-white rounded bg-[#1E88E5] lg:bg-transparent lg:text-[#1E88E5]'
                          : 'text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-[#1E88E5]'
                      } lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-neutral-800 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700`}
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;