import React from 'react'
import HeroSection from '../components/HeroSection'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsLetterBox from '../components/NewsLetterBox'
import ReviewsSection from '../components/ReviewsSection'
import Faqs from './Faqs'

const Home = () => {
  return (
    <div className='px-4 sm:px-[2vw] md:px-[3vw] lg:px-[4vw]'>
      <HeroSection />
      <LatestCollection />
      <BestSeller />
      <Faqs />
      <ReviewsSection />
      <OurPolicy />
      <NewsLetterBox />
      <div className='pb-20'></div>
    </div>
  )
}

export default Home
