import { useState } from 'react'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


import Navbar from '../../components/landing/LandingNavbar'
import MainSection from '../../components/landing/LandingMainSection'
import Sidebar from '../../components/adminDashboard/AdminDashboardSidebar'

import bg from '../../assets/images/svg.png'


const Landing = () => {
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
      className='flex flex-col min-h-screen bg-[#0A1437] -z-20'  >
          <img src={bg} className='fixed bottom-0 right-0 opacity-10 -z-10  brightness-200' alt='logo' />


      <div>
        <Navbar />
      </div>

      {/* Desktop Sections */}
      <div className='flex flex-row justify-between gap-6 mt-2 w-full h-full'>
        <MainSection activeSection={activeSection} />
        <Sidebar onSectionChange={handleSectionChange} />
      </div>
    </div>
  )
}

export default Landing
