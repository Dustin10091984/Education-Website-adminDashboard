import Navbar from '../../components/landing/LandingNavbar'
import Sidebar from '../../components/adminDashboard/AdminDashboardSidebar'
import { useState } from 'react'
import TermsMainSection from '../../components/terms/TermsMainSection'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Terms = () => {
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
      className='flex bg-[#161F2B] flex-col min-h-screen'  >
      <div className=' fixed top-0 w-full backdrop-blur-sm'>
        <Navbar />
      </div>
      <div className='flex flex-row justify-between pt-24 w-full h-full'>
        <div className='bg-[#161F2B] w-screen m-2'>
          <TermsMainSection activeSection={activeSection} />
        </div>
        <div className='bg-[#161F2B]'>
          <Sidebar onSectionChange={handleSectionChange} />
        </div>
      </div>
    </div>
  )
}
export default Terms
