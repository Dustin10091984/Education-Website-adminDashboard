import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Navbar from '../../components/landing/LandingNavbar'
import Sidebar from '../../components/adminDashboard/AdminDashboardSidebar'
import MainSection from '../../components/adminDashboard/AdminDashboardMainSection'

import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const [requestedStudents, setRequestedStudents] = useState([])
  const [activeSection, setActiveSection] = useState('')
  const [error, setError] = useState()

  const handleSectionChange = (section) => {
    setActiveSection(section)
  }

  const navigate = useNavigate()

  useEffect(() => {
    // const accessToken = sessionStorage.getItem('authToken')
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      navigate('/login')
    } else {
      const fetchRequestedStudents = async () => {
        if (!accessToken) {
          setError('No access token found')
          return
        }
        try {
          const response = await axios.get(
            'https://api.ebsalar.com/api/v1/admin/student_request/',
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          setRequestedStudents(response.data.results)
          // console.log(response)
          // console.log(response.data.results[0].first_name)
        } catch (error) {
          setError('Failed to fetch students')
          console.error('Fetch error', error)
        }
      }
      fetchRequestedStudents()
    }
  }, [])

  return (
    <div
      className='flex flex-col bg-[#161F2B]  min-h-screen'   >
      <div className='fixed top-0 w-full backdrop-blur-sm'>
        <Navbar />
      </div>
      <div className='flex flex-row justify-between  pt-20  h-full'>
        <div className='  w-full '>
          <MainSection
            requestedStudents={requestedStudents}
            setRequestedStudents={setRequestedStudents}
            activeSection={activeSection}
          />
        </div>
        <div className='bg-[#161F2B]'>
          <Sidebar onSectionChange={handleSectionChange} />
        </div>
      </div>
      {error && <p>Error: {error}</p>}
    </div>
  )
}

export default AdminDashboard
