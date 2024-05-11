import React from 'react'
import Navbar from '../../components/landing/LandingNavbar'
// import MainSection from '../../components/landing/LandingMainSection'
import Sidebar from '../../components/adminDashboard/AdminDashboardSidebar'
import { Link } from 'react-router-dom'
import {
  FaBoxesPacking,
  FaChartPie,
  FaPalette,
  FaWandMagicSparkles,
} from 'react-icons/fa6'

const UIMain = () => {
  return (
    <div className=' bg-[#182147] min-h-screen flex justify-center px-20  pt-20 items-center w-full'>
      <Navbar />
      <Sidebar />

      <div className='grid w-full  gap-8  grid-cols-5 pr-20'>
      

      
      
      
        <Link   to='/edit-aboutus/1'   >
           <div className='flex justify-center h-full items-center flex-col border border-gray-800  shadow-[#0000006c]  shadow-xl  rounded-md'>

            <p className='text-pink-600 text-sm '>ویرایش صفحه درباره ما</p>
          </div>
        </Link>
        <div className='flex flex-col w-ful shadow-xl shadow-[#0000006c] rounded-md '>
          <div className='flex justify-around bg-[#0005] rounded-t-md py-4 items-center  '>
            <div className=' border border-blue-400 flex justify-center items-center shadow-xl shadow-black bg-blue-400  p-2 rounded-md'>
              <FaPalette className='text--[#18214775] text-3xl' />
            </div>
            <p className='text-pink-600 py-4 text-sm '>ویرایش صفحه اصلی</p>
          </div>
          <Link to='/template-headers'>
            <div className='border-y-2 py-2 border-gray-700'>
              <p className='text-gray-200 text-xs w-full text-center'>
                ویرایش اطلاعیه ها
              </p>
            </div>
          </Link>

          <Link to='/templates-sliders'>
            <div className='border-b-2 py-2 border-gray-700'>
              <p className='text-gray-200 text-xs w-full text-center'>
                ویرایش اسلایدر اول
              </p>
            </div>
          </Link>

          <Link to='/templates-indexcourse'>
            <div className='border-b-2 py-2 border-gray-700'>
              <p className='text-gray-200 text-xs w-full text-center'>
                ویرایش دوره ها
              </p>
            </div>
          </Link>

          <Link to='/templates-tournaments'>
            <div className='border-b-2 py-2 border-gray-700'>
              <p className='text-gray-200 text-xs w-full text-center'>
                ویرایش برگزیده ها و تورنمنت ها
              </p>
            </div>
          </Link>

          <Link to='/templates-questions'>
            <div className='border-b-2 py-2 border-gray-700'>
              <p className='text-gray-200 text-xs w-full text-center'>
                ویرایش سوالات متداول
              </p>
            </div>
          </Link>

          <Link to='/templates-topstudents'>
            <div className='border-b-2 py-2 border-gray-700'>
              <p className='text-gray-200 text-xs w-full text-center'>
                ویرایش دانش آموزان برتر
              </p>
            </div>
          </Link>



       
        </div>
          <Link to='/galleryfiles'>
           <div className='flex justify-center h-full items-center flex-col border border-gray-800  shadow-[#0000006c]  shadow-xl  rounded-md'>
            <div className='border-b-2 py-2 border-gray-700'>
              <p className='text-pink-600 text-sm w-full text-center'>
                ویرایش گالری
              </p>
            </div>
          </div>
          </Link>


          <Link to='/PublicMenu'>
           <div className='flex justify-center h-full items-center flex-col border border-gray-800  shadow-[#0000006c]  shadow-xl  rounded-md'>
            <div className='border-b-2 py-2 border-gray-700'>
              <p className='text-pink-600 text-sm w-full text-center'>
                ویرایش منو عمومی
              </p>
            </div>
          </div>
          </Link>


          <Link to='/dpages'>
           <div className='flex justify-center h-full items-center flex-col border border-gray-800  shadow-[#0000006c]  shadow-xl  rounded-md'>
            <div className='border-b-2 py-2 border-gray-700'>
              <p className='text-pink-600 text-sm w-full text-center'>
                 مدیریت صفحات داینامیک
              </p>
            </div>
          </div>
          </Link>
      </div>
    </div>
  )
}

export default UIMain
