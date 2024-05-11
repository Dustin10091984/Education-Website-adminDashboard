import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import { FaArrowRightLong } from 'react-icons/fa6'

const ContactDetails = () => {
  const { contactId } = useParams()
  const navigate = useNavigate()
  const [contact, setContact] = useState(null)
  const [error, setError] = useState()

  useEffect(() => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    const accessToken = Cookies.get('authToken')

    // Fetch the contact data
    const fetchData = async () => {
      if (!accessToken) {
        setError('No access token found')
        return
      }
      try {
        const response = await axios.get(
          `https://api.ebsalar.com/api/v1/admin/contact_us/${contactId}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        setContact(response.data.results)
        console.log(response.data.results.identityـcertificate)
      } catch (error) {
        console.error('Error fetching contact details:', error)
      }
    }

    fetchData()
  }, [contactId])

  if (!contact) return <div>Loading...</div>

  return (
    <div className='flex flex-col justify-center items-center max-w-md mx-auto p-5 mt-8 border rounded-md shadow-md'>
      <p className='mb-2'>
        {contact.connection_way}{' '}
        <span className='text-xl text-blue-500'> :راه ارتباطی</span>
      </p>
      <p>
        {contact.message} <span className='text-xl text-blue-500'>:پبغام</span>
      </p>
    </div>
  )
}

export default ContactDetails
