import { MdOutlineMarkEmailUnread } from 'react-icons/md'
import { Link } from 'react-router-dom'
import logo from '../../assets/images/logo.svg'
// import adminProfile from '../../assets/images/adminProfile.svg'
import moment from 'moment-jalaali'
import { IoNotificationsSharp } from 'react-icons/io5'

const currentDate = moment().format('jYYYY/jMM/jDD')

const LandingNavbar = () => {
  return (
    <div className='fixed top-0 w-full   bg-[#161F2B]  z-50  shadow-2xl shadow-[#070606ae]'>
      <div className=' flex flex-row backdrop-blur-xl justify-between max-w-[1440] h-14 mb-0 align-middle py-3 '>
        <div className='flex justify-end max-w-80 '>
          <Link to='/'>
            <img src={logo} className='ml-10 ' alt='logo' />
          </Link>
        </div>
        <div className='flex justify-center items-center  '>
          <p className='text-gray-400 px-4'> {currentDate} </p>

          {/* <img src={adminProfile} className='mr-4 w-8' alt='admin profile' /> */}
          <IoNotificationsSharp className='mr-10 text-xl text-white ' />
        </div>
      </div>
    </div>
  )
}
export default LandingNavbar
