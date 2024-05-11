import React from 'react'
import Sidebar from '../../components/adminDashboard/AdminDashboardSidebar'
import SubmenusMainSection from '../../components/submenus/SubmenusMainSection'
import LandingNavbar from '../../components/landing/LandingNavbar'

const Submenus = () => {
  return (
    <div className=' bg-[#182147] min-h-screen flex justify-center px-20  pt-20 items-center w-full'>
      <LandingNavbar />
      <Sidebar />
      <SubmenusMainSection />
    </div>
  )
}

export default Submenus
