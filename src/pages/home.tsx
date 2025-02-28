import React from 'react'
import Header from '../components/header'
import Hero from '../components/hero'
import JobSearch from '../components/job-search'
import AIResume from '../components/ai-resume'
import RecruiterSection from '../components/feature'
import Footer from './footer'
import Testimonials from './testimonals'

const Home = () => {
  return (
    <div>
        <Header />
        <Hero />
        <JobSearch />
        <RecruiterSection />
        <Testimonials />
        <Footer />
    </div>
  )
}

export default Home