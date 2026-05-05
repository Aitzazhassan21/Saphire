import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='px-4 sm:px-[2vw] md:px-[3vw] lg:px-[4vw]'>
        {/* Trust Badges */}
        <div className='flex flex-col sm:flex-row justify-around items-center gap-6 py-8 border-t border-b border-gray-200 text-sm text-gray-700'>
            <div className='flex items-center gap-2'>
                <span className='text-xl'>🚚</span>
                <span className='font-semibold'>Fast UK Dispatch</span>
            </div>
            <div className='flex items-center gap-2'>
                <span className='text-xl'>💎</span>
                <span className='font-semibold'>100% Genuine Frames</span>
            </div>
            <div className='flex items-center gap-2'>
                <span className='text-xl'>🇬🇧</span>
                <span className='font-semibold'>UK Based Support</span>
            </div>
        </div>

        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr_1fr] gap-10 my-10 mt-16 text-sm'>
            <div>
                <Link to='/'>
                    <img src={assets.logo} className='w-32 mb-5 cursor-pointer' alt="Sapphire Optics" />
                </Link>
                <p className='w-full text-gray-600 md:w-3/4'>Sapphire Optics — your Manchester-based eyewear specialist. We offer prescription glasses, reglazing, and a huge range of designer and kids frames. With an in-house lab, fast UK dispatch, and 14-day money-back guarantee, clear vision has never been easier.</p>
                <div className='flex gap-4 mt-4 text-gray-600'>
                    <a href="https://instagram.com/sapphire.optics" target="_blank" rel="noopener noreferrer" className='hover:text-black'>Instagram</a>
                    <a href="https://tiktok.com/@sapphire.optics" target="_blank" rel="noopener noreferrer" className='hover:text-black'>TikTok</a>
                </div>
            </div>

            <div>
                <p className='mb-5 text-xl font-medium'>SHOP</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <Link to='/category/men'><li>Mens</li></Link>
                    <Link to='/category/women'><li>Womens</li></Link>
                    <Link to='/category/unisex'><li>Unisex</li></Link>
                    <Link to='/category/child'><li>Kids</li></Link>
                    <Link to='/category/sunglasses'><li>Sunglasses</li></Link>
                    <Link to='/reglazing'><li>Reglazing</li></Link>
                </ul>
            </div>

            <div>
                <p className='mb-5 text-xl font-medium'>HELP</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <Link to='/faqs'><li>FAQs</li></Link>
                    <Link to='/contact'><li>Contact Us</li></Link>
                    <Link to='/about'><li>Delivery & Returns</li></Link>
                    <Link to='/about'><li>Lenses and Coatings</li></Link>
                    <Link to='/about'><li>Price Promise</li></Link>
                    <Link to='/about'><li>PD Calculator</li></Link>
                </ul>
            </div>

            <div>
                <p className='mb-5 text-xl font-medium'>LEGAL</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <Link to='/about'><li>Terms & Conditions</li></Link>
                    <Link to='/about'><li>Privacy Policy</li></Link>
                    <Link to='/about'><li>Refund Policy</li></Link>
                    <Link to='/about'><li>Shipping Policy</li></Link>
                    <Link to='/about'><li>Refer A Friend</li></Link>
                    <Link to='/about'><li>Gift Cards</li></Link>
                </ul>
            </div>
        </div>
        <div>
            <hr />
            <div className='flex flex-col sm:flex-row justify-between items-center py-5 text-xs text-gray-500 gap-2'>
                <p>© 2026, Sapphire Optics. All rights reserved.</p>
                <div className='flex gap-4'>
                    <Link to='/about' className='hover:text-black'>Privacy policy</Link>
                    <Link to='/about' className='hover:text-black'>Refund policy</Link>
                    <Link to='/about' className='hover:text-black'>Terms of service</Link>
                    <Link to='/about' className='hover:text-black'>Shipping policy</Link>
                    <Link to='/contact' className='hover:text-black'>Contact information</Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer
