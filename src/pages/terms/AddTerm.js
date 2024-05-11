import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { addTerm } from '../../features/terms/termsSlice'
import Cookies from 'js-cookie'

const AddTerm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [termData, setTermData] = useState({
    term: 0,
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setTermData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }))
  }

  useEffect(() => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Prepare the term data for submission
    const newTermData = {
      name: termData.name,
    }
    // Dispatch the addTerm action
    dispatch(addTerm(newTermData))
      .unwrap()
      .then((newTermData) => {
        toast.success('terms details updated successfully.', {
          onClose: () => {
            setTimeout(() => {
              navigate('/terms')
            }, 2000)
          },
          autoClose: 2000,
        })
      })
      .catch((error) => {
        toast.error(`Registration failed: ${error.message || 'Error occurred'}`)
      })
  }

  return (
    <div
      className='flex flex-col
 justify-center h-screen max-w-[500px] items-center mx-auto p-5'
    >
      <h1>اضافه کردن ترم</h1>
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-xl'
      >
        {/* term input */}
        <div className='mb-4'>
          <label
            htmlFor='name'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            ترم
          </label>
          <input
            id='name'
            type='text'
            name='name'
            value={termData.name}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        {/* Save Changes Button */}
        <div className='mb-4 md:col-span-1 flex justify-start'>
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          >
            اضافه کردن ترم
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddTerm
