import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { addTemplatesIndexCourse } from '../../features/templatesIndexCourse/templatesIndexCourseSlice'

const AddTemplatesIndexCourse = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [templateData, setTemplateData] = useState({
    title: '',
    description: '',
  })

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setTemplateData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Prepare the template data for submission
    const newTemplateData = {
      title: templateData.title,
      description: templateData.description,
    }
    // Dispatch the addTemplate action
    dispatch(addTemplatesIndexCourse(newTemplateData))
      .unwrap()
      .then((newTemplateData) => {
        toast.success('templates details updated successfully.', {
          onClose: () => {
            setTimeout(() => {
              navigate('/templates-indexcourse')
            }, 1000)
          },
          autoClose: 1000,
        })
      })
      .catch((error) => {
        toast.error(`Registration failed: ${error.message || 'Error occurred'}`)
      })
  }

  return (
    <div className='flex bg-slate-900 justify-center items-center max-w-7xl mx-auto p-5 h-screen'>
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className='flex flex-col w-[480px]  bg-white p-6 rounded-lg shadow-xl'
      >
        <h1 className='mb-4 font-extrabold'>اضافه کردن دوره</h1>
        {/* Title input */}
        <div className='mb-4'>
          <label
            htmlFor='title'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            نام دوره
          </label>
          <input
            id='title'
            type='text'
            name='title'
            value={templateData.title}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        {/* Description input */}
        <div className='mb-4'>
          <label
            htmlFor='title'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            توضیحات
          </label>
          <input
            id='description'
            type='text'
            name='description'
            value={templateData.description}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>

        {/* Save Changes Button */}
        <div className='mb-4 md:col-span-1 flex justify-start'>
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          >
            اضافه کن
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddTemplatesIndexCourse
