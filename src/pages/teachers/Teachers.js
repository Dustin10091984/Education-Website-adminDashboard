import Navbar from '../../components/landing/LandingNavbar'
import Sidebar from '../../components/adminDashboard/AdminDashboardSidebar'
import TeachersMainSection from '../../components/teachers/TeachersMainSection'
import { useState } from 'react'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Teachers = () => {
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
    <div
      className='flex flex-col min-h-screen'  >
      <div className='fixed top-0 w-full bg-[#161F2B] backdrop-blur-sm'>
        <Navbar />
      </div>
      <div className='flex  justify-between min-h-screen'>
        <div className='bg-[#161F2B] pt-24'>
          <TeachersMainSection activeSection={activeSection} />
        </div>
        <div className='bg-[#161F2B]'>
          <Sidebar onSectionChange={handleSectionChange} />
        </div>
      </div>
    </div>
  )
}
export default Teachers
