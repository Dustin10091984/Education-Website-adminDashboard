import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { addTemplate } from '../../features/templateHeaders/templateHeadersSlice'

const AddTemplatesHeaders = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [templateData, setTemplateData] = useState({
    title: '',
    description: '',
    announcement: '',
    link: '',
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
      announcement: templateData.announcement,
      link: templateData.link, // Include the link
    }
    // Dispatch the addTemplate action
    dispatch(addTemplate(newTemplateData))
      .unwrap()
      .then((newTemplateData) => {
        toast.success('خبر جدید اضافه شد', {
          onClose: () => {
            setTimeout(() => {
              navigate('/template-headers')
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
    <div className='flex bg-[#13192b] justify-center items-center max-w-7xl mx-auto p-5 h-screen'>
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className='flex flex-col w-[480px]  bg-white p-6 rounded-lg shadow-xl'
      >
        <h1 className='mb-4 font-extrabold'>
          اضافه کردن اطلاعیه یا جدیدترین های هفته
        </h1>
        {/* Title input */}
        <div className='mb-4'>
          <label
            htmlFor='title'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            نام رویداد
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
        {/* Link input */}
        <div className='mb-4'>
          <label
            htmlFor='link'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            لینک
          </label>
          <input
            id='link'
            type='text'
            name='link'
            value={templateData.link}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>

        {/* announcement Radio Buttons */}
        <div className='mb-4 md:col-span-1'>
          <span className='block text-gray-700 text-sm font-bold mb-2'>
            اخبار
          </span>
          <div>
            <label htmlFor='true' className='inline-flex items-center mr-6'>
              <input
                id='true'
                type='radio'
                name='announcement'
                value='t'
                checked={templateData.announcement === 't'}
                onChange={handleInputChange}
                className='form-radio'
                required
              />
              <span className='ml-2'>اطلاعیه </span>
            </label>
            <label htmlFor='false' className='inline-flex items-center'>
              <input
                id='false'
                type='radio'
                name='announcement'
                value='f'
                checked={templateData.announcement === 'f'}
                onChange={handleInputChange}
                className='form-radio'
              />
              <span className='ml-2'>جدیدترین های هفته</span>
            </label>
          </div>
        </div>
        {/* Save Changes Button */}
        <div className='mb-4 md:col-span-1 flex justify-start'>
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          >
            ثبت و ذخیره
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddTemplatesHeaders
