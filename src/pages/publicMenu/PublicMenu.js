import React from 'react'
import LandingNavbar from '../../components/landing/LandingNavbar'
import Sidebar from '../../components/adminDashboard/AdminDashboardSidebar'
import PublicMenuMainSection from '../../components/publicMenu/PublicMenuMainSection'

const PublicMenu = () => {
  return (
    <div className=' bg-[#182147] min-h-screen flex justify-center px-20  pt-20 items-center w-full'>
        <LandingNavbar/>
        <Sidebar/>
      <PublicMenuMainSection/>

    </div>
  )
}

export default PublicMenu