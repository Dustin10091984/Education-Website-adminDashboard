import Navbar from '../../components/landing/LandingNavbar'
import Sidebar from '../../components/adminDashboard/AdminDashboardSidebar'
import { useState } from 'react'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AboutusMainSection from '../../components/aboutus/AboutusMainSection'

const Aboutus = () => {
  const [activeSection, setActiveSection] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  const handleSectionChange = (section) => {
    setActiveSection(section)
  }

  return (
    <div className='flex flex-col bg-[#161F2B] min-h-screen'>
      <div className='fixed top-0 w-full backdrop-blur-sm'>
        <Navbar />
      </div>
      <div className='pt-24 flex flex-row justify-between  w-full h-full'>
        <div className='bg-[#161F2B] w-screen px-24 m-2'>
          <AboutusMainSection activeSection={activeSection} />
        </div>
        <div className='bg-[#161F2B]'>
          <Sidebar onSectionChange={handleSectionChange} />
        </div>
      </div>
    </div>
  )
}
export default Aboutus
