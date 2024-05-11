import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { addTemplate } from '../../features/templatesSliders/templatesSlidersSlice'

const AddTemplatesSliders = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [templateData, setTemplateData] = useState({
    title: '',
    description: '',
    file: '',
  })
  const [fileImage, setFileImage] = useState(null)
  const [fileImageUrl, setFileImageUrl] = useState('')

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  const handleFileImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setFileImage(file)
      // Preview the image
      const reader = new FileReader()
      reader.onloadend = () => {
        setFileImageUrl(reader.result)
      }
      reader.readAsDataURL(file)

      // Prepare the form data to upload
      const formData = new FormData()
      formData.append('file', file)

      // Get the access token
      const accessToken = Cookies.get('authToken')
      if (!accessToken) {
        toast.error('Authentication token not found. Please log in.')
        return
      }

      try {
        const uploadResponse = await axios.post(
          'https://api.ebsalar.com/api/v1/media/',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        toast.success('عکس اسلایدر شما با موفقیت آپلود شد')
        if (uploadResponse.data && uploadResponse.data.results) {
          setTemplateData({
            ...templateData,
            file: uploadResponse.data.results,
          })
        }
      } catch (error) {
        console.error('Error uploading file:', error)
        toast.error('Failed to upload file image.')
      }
    }
  }

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
      file: templateData.file,
    }
    // Dispatch the addTemplate action
    dispatch(addTemplate(newTemplateData))
      .unwrap()
      .then((newTemplateData) => {
        toast.success('templates details updated successfully.', {
          onClose: () => {
            setTimeout(() => {
              navigate('/templates-sliders')
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
    <div className='flex justify-center  items-center max-w-7xl mx-auto p-5 h-screen'>
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className='flex flex-col w-[480px]  bg-white p-6 rounded-lg shadow-xl'
      >
        <h1 className='mb-4 font-extrabold'>اضافه کردن رویداد</h1>
        {/* file input */}
        <div className='mb-4 flex flex-row justify-center md:col-span-1'>
          <label
            className='block text-gray-700 text-sm font-bold -mr-10 -mb-7'
            htmlFor='file'
          >
            ضمیمه فایل
          </label>

          <div className='grid grid-cols-2 items-end gap-4 ml-14'>
            <input
              id='file'
              type='file'
              name='file'
              onChange={handleFileImageChange}
              className='col-span-1 shadow appearance-none border rounded py-2 pl-10 pr-1 w-[300px]  text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
            {fileImageUrl && (
              <img
                src={fileImageUrl}
                alt='file Preview'
                className='w-20 h-20 ml-28 rounded-md'
              />
            )}
          </div>
        </div>
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

export default AddTemplatesSliders
