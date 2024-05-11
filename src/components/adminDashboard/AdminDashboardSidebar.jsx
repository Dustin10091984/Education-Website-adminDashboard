import { useState } from 'react'

import { VscGitPullRequestCreate } from 'react-icons/vsc'
import { AiOutlineInfoCircle, AiOutlineApartment } from 'react-icons/ai'
import { PiStudentFill, PiChatCircleTextFill } from 'react-icons/pi'
import { RiMenuFoldFill, RiTeamFill, RiChatQuoteFill } from 'react-icons/ri'
import { SiLevelsdotfyi, SiShopee } from 'react-icons/si'
import { FaChalkboardTeacher } from 'react-icons/fa'
import { TbBrandCitymapper, TbZoomMoney } from 'react-icons/tb'
import { ImExit } from 'react-icons/im'
import { MdOutlineCastForEducation, MdReduceCapacity } from 'react-icons/md'
import { FaUserEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { FaCartShopping } from 'react-icons/fa6'

const AdminDashboardSidebar = () => {
  const navigate = useNavigate()
  // const AdminDashboardSidebar = ({ onSectionChange }) => {
  const [width, setWidth] = useState('w-20')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleWidth = () => {
    if (width === 'w-20') {
      setWidth('w-[200px] ')
    } else {
      setWidth('w-20')
    }
  }

  // Add this function to handle dropdown
  const toggleDropdown = (event) => {
    // Prevents the dropdown from closing if you click inside the dropdown
    event.preventDefault()
    setIsDropdownOpen(!isDropdownOpen)
  }

  const clearCookies = () => {
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
    })
  }

  const handleLogout = () => {
    navigate('/')
    clearCookies()
  }

  return (
    <div className='fixed right-0 top-16 max-h-screen overflow-y-auto'>
      <div
        style={{ transition: 'width 0.2s ease-in-out' }}
        className={`${width}   rounded-l-xl border border-[#3d3d3d46] backdrop-blur-md  z-50 bg-[#070c1f75] shadow-2xl shadow-[#6d3a436c] flex justify-around py-[10%] gap-4 items-center flex-col`}
      >
        <RiMenuFoldFill
          className='  my-4 text-gray-400 text-3xl '
          onClick={toggleWidth}
        />

        {/* <div className='flex justify-end items-center pr-5 w-full relative'>
          <button
            className={`${
              width === 'w-20' ? 'hidden' : ''
            } whitespace-nowrap text-gray-300 text-sm pr-4 flex justify-center items-center`}
            onClick={toggleDropdown} // Toggle dropdown on click
          >
            ویرایش رابط کاربری
          </button>
          <div className='flex justify-center items-center bg-[#ffffff1f] p-2 rounded-md'>
            <FaUserEdit
              className='text-blue-400 text-xl'
              onClick={toggleDropdown}
            />
          </div>

          
          {isDropdownOpen && ( 
            <div className='absolute right-0 w-full mt-[105px] origin-top-right rounded-md shadow-lg bg-black ring-1 ring-black ring-opacity-5 focus:outline-none'>
              <div className='py-1'>
                <Link
                  to='/template-headers'
                  className='text-gray-300 block px-4 py-1 text-sm'
                >
                  ویرایش اطلاعیه ها
                </Link>
                <Link
                  to='/templates-sliders'
                  className='text-gray-300 block px-4 py-1 text-sm'
                >
                  ویرایش رویدادها
                </Link>
                <Link
                  to='/templates-indexcourse'
                  className='text-gray-300 block px-4 py-1 text-sm'
                >
                  ویرایش دوره ها
                </Link>
                <Link
                  to='/templates-questions'
                  className='text-gray-300 block px-4 py-1 text-sm'
                >
                  سوالات متداول
                </Link>
                <Link
                  to='/templates-tournaments'
                  className='text-gray-300 block px-4 py-1 text-sm'
                >
                  ویرایش تورنومنت ها
                </Link>
                <Link
                  to='/templates-topstudents'
                  className='text-gray-300 block px-4 py-1 text-sm'
                >
                  دانش آموزان برتر
                </Link>
              </div>
            </div>
          )}
        </div> */}
        <div className='flex justify-end  items-center  pr-5 w-full'>
          <Link to='/adminDashboard'>
            <button
              className={`${
                width === 'w-20' ? 'hidden' : ''
              } whitespace-nowrap text-gray-300 text-sm px-4 flex justify-center items-center`}
            >
              لیست احراز
            </button>
          </Link>
          <Link to='/adminDashboard'>
            <div className='flex justify-center items-center bg-[#ffffff1f] p-2 rounded-md'>
              <VscGitPullRequestCreate className='text-blue-400 text-xl' />
            </div>
          </Link>
        </div>
        <div className='flex justify-end items-center pr-5  w-full'>
          <Link to='/students'>
            <button
              className={`${
                width === 'w-20' ? 'hidden' : ''
              } whitespace-nowrap text-gray-300 text-sm pr-4 flex justify-center items-center`}
            >
              دانش آموزان
            </button>
          </Link>
          <Link to='/students'>
            <div className='flex justify-center items-center bg-[#ffffff1f] p-2 rounded-md'>
              <PiStudentFill className='text-blue-400 text-xl' />
            </div>
          </Link>
        </div>
        <div className='flex justify-end items-center pr-5  w-full'>
          <Link to='/teachers'>
            <button
              className={`${
                width === 'w-20' ? 'hidden' : ''
              } whitespace-nowrap text-gray-300 text-sm pr-4 flex justify-center items-center`}
            >
              مدرس ها
            </button>
          </Link>
          <Link to='/teachers'>
            <div className='flex justify-center items-center bg-[#ffffff1f] p-2 rounded-md'>
              <FaChalkboardTeacher className='text-blue-400 text-xl' />
            </div>
          </Link>
        </div>
        <div className='flex justify-end items-center pr-5  w-full'>
          <Link to='/staffs'>
            <button
              className={`${
                width === 'w-20' ? 'hidden' : ''
              } whitespace-nowrap text-gray-300 text-sm pr-4 flex justify-center items-center`}
            >
              کارمندان
            </button>
          </Link>
          <Link to='/staffs'>
            <div className='flex justify-center items-center bg-[#ffffff1f] p-2 rounded-md'>
              <RiTeamFill className='text-blue-400 text-xl' />
            </div>
          </Link>
        </div>
        <div className='flex justify-end items-center pr-5  w-full'>
          <Link to='/departments'>
            <button
              className={`${
                width === 'w-20' ? 'hidden' : ''
              } whitespace-nowrap text-gray-300 text-sm pr-4 flex justify-center items-center`}
            >
              دپارتمان ها
            </button>
          </Link>
          <Link to='/departments'>
            <div className='flex justify-center items-center bg-[#ffffff1f] p-2 rounded-md'>
              <AiOutlineApartment className='text-blue-400 text-xl' />
            </div>
          </Link>
        </div>
        <div className='flex justify-end items-center pr-5  w-full'>
          <Link to='/levels'>
            <button
              className={`${
                width === 'w-20' ? 'hidden' : ''
              } whitespace-nowrap text-gray-300 text-sm pr-4 flex justify-center items-center`}
            >
              پایه ها
            </button>
          </Link>
          <Link to='/levels'>
            <div className='flex justify-center items-center bg-[#ffffff1f] p-2 rounded-md'>
              <SiLevelsdotfyi className='text-blue-400 text-xl' />
            </div>
          </Link>
        </div>
        <div className='flex justify-end items-center pr-5  w-full'>
          <Link to='/terms'>
            <button
              className={`${
                width === 'w-20' ? 'hidden' : ''
              } whitespace-nowrap text-gray-300 text-sm pr-4 flex justify-center items-center`}
            >
              ترم ها
            </button>
          </Link>
          <Link to='/terms'>
            <div className='flex justify-center items-center bg-[#ffffff1f] p-2 rounded-md'>
              <TbBrandCitymapper className='text-blue-400 text-xl' />
            </div>
          </Link>
        </div>
        <div className='flex justify-end items-center pr-5  w-full'>
          <Link to='/classrooms'>
            <button
              className={`${
                width === 'w-20' ? 'hidden' : ''
              } whitespace-nowrap text-gray-300 text-sm pr-4 flex justify-center items-center`}
            >
              کلاس ها
            </button>
          </Link>
          <Link to='/classrooms'>
            <div className='flex justify-center items-center bg-[#ffffff1f] p-2 rounded-md'>
              <MdOutlineCastForEducation className='text-blue-400 text-xl' />
            </div>
          </Link>
        </div>
        <div className='flex justify-end items-center pr-5  w-full'>
          <Link to='/'>
            <button
              className={`${
                width === 'w-20' ? 'hidden' : ''
              } whitespace-nowrap text-gray-300 text-sm pr-4 flex justify-center items-center`}
            >
              دوره ها
            </button>
          </Link>
          <Link to='/'>
            <div className='flex justify-center items-center bg-[#ffffff1f] p-2 rounded-md'>
              <MdReduceCapacity className='text-blue-400 text-xl' />
            </div>
          </Link>
        </div>
        <div className='flex justify-end items-center pr-5  w-full'>
          <Link to='/'>
            <button
              className={`${
                width === 'w-20' ? 'hidden' : ''
              } whitespace-nowrap text-gray-300 text-sm pr-4 flex justify-center items-center`}
            >
              مالی
            </button>
          </Link>
          <Link to='/'>
            <div className='flex justify-center items-center bg-[#ffffff1f] p-2 rounded-md'>
              <TbZoomMoney className='text-blue-400 text-xl' />
            </div>
          </Link>
        </div>
        <div className='flex justify-end items-center pr-5  w-full'>
          <Link to='/products'>
            <button
              className={`${
                width === 'w-20' ? 'hidden' : ''
              } whitespace-nowrap text-gray-300 text-sm pr-4 flex justify-center items-center`}
            >
              فروشگاه
            </button>
          </Link>
          <Link to='/products'>
            <div className='flex justify-center items-center bg-[#ffffff1f] p-2 rounded-md'>
              <SiShopee className='text-blue-400 text-xl' />
            </div>
          </Link>
        </div>

        <div className='flex justify-end items-center pr-5  w-full'>
          <Link to='/orders'>
            <button
              className={`${
                width === 'w-20' ? 'hidden' : ''
              } whitespace-nowrap text-gray-300 text-sm pr-4 flex justify-center items-center`}
            >
              سفارشات
            </button>
          </Link>
          <Link to='/orders'>
            <div className='flex justify-center items-center bg-[#ffffff1f] p-2 rounded-md'>
              <FaCartShopping className='text-blue-400 text-xl' />
            </div>
          </Link>
        </div>

        <div className='flex justify-end items-center pr-5  w-full'>
          <Link to='/tickets'>
            <button
              className={`${
                width === 'w-20' ? 'hidden' : ''
              } whitespace-nowrap text-gray-300 text-sm pr-4 flex justify-center items-center`}
            >
              تیکت
            </button>
          </Link>
          <Link to='/tickets'>
            <div className='flex justify-center items-center bg-[#ffffff1f] p-2 rounded-md'>
              <PiChatCircleTextFill className='text-blue-400 text-xl' />
            </div>
          </Link>
        </div>
        <div className='flex justify-end items-center pr-5  w-full'>
          <Link to='/'>
            <button
              className={`${
                width === 'w-20' ? 'hidden' : ''
              } whitespace-nowrap text-gray-300 text-sm pr-4 flex justify-center items-center`}
              onClick={handleLogout}
            >
              خروج
            </button>
          </Link>
          <Link to='/'>
            <div className='flex justify-center items-center bg-[#ffffff1f] p-2 rounded-md'>
              <ImExit className='text-red-600 text-xl' onClick={handleLogout} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
export default AdminDashboardSidebar
