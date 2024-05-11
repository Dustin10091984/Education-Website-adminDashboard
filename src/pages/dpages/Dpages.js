import React from 'react'
import LandingNavbar from '../../components/landing/LandingNavbar'
import Sidebar from '../../components/adminDashboard/AdminDashboardSidebar'
import DpagesMainSection from '../../components/dpages/DpagesMainSection'


const Dpages = () => {
  return (
    <div className=' bg-[#182147] min-h-screen flex justify-center px-20  pt-20 items-center w-full'>
      <LandingNavbar/>
      <Sidebar/>

      <DpagesMainSection/>
    </div>
  )
}

export default Dpages