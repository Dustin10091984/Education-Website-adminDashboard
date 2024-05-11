import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { addDepartment } from '../../features/departments/departmentsSlice'
import Cookies from 'js-cookie'

const AddDepartment = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  const dispatch = useDispatch()
  const [departmentData, setDepartmentData] = useState({
    department: 0,
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setDepartmentData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Prepare the department data for submission
    const newDepartmentData = {
      name: departmentData.name,
    }
    // Dispatch the addDepartment action
    dispatch(addDepartment(newDepartmentData))
      .unwrap()
      .then((newDepartmentData) => {
        toast.success('departments details updated successfully.', {
          onClose: () => {
            setTimeout(() => {
              navigate('/departments')
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
    <div className='flex flex-col justify-center items-center max-w-7xl mx-auto p-5 h-screen'>
      <h1>اضافه کردن دپارتمان</h1>
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-xl'
      >
        {/* Department input */}
        <div className='mb-4'>
          <label
            htmlFor='name'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            دپارتمان
          </label>
          <input
            id='name'
            type='text'
            name='name'
            value={departmentData.name}
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
            اضافه کردن دپارتمان
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddDepartment
