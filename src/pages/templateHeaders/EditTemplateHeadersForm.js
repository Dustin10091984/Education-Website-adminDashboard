import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { editTemplate } from '../../features/templateHeaders/templateHeadersSlice'

const EditTemplateHeadersForm = () => {
  const dispatch = useDispatch()
  const [templateData, setTemplateData] = useState({
    title: '',
    description: '',
    announcement: '',
    link: '',
  })

  const [initialTemplateData, setInitialTemplateData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const editedId = useParams()
  const id = editedId.templateId
  console.log(id)
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        const accessToken = Cookies.get('authToken')
        if (!accessToken) throw new Error('Access token not found')
        const response = await axios.get(
          `https://api.ebsalar.com/api/v1/admin/header/${id}/`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        const fetchedData = {
          title: response.data.results.title || '',
          description: response.data.results.description || '',
          announcement: response.data.results.announcement ? 't' : 'f',
          link: response.data.results.link || '',
        }
        setTemplateData(fetchedData)
        setInitialTemplateData(fetchedData)
        console.log(response.data)
        setIsLoading(false)
      } catch (error) {
        setError(error.message)
        setIsLoading(false)
      }
    }
    fetchTemplateData()
  }, [id])

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
    let updatedData = { ...templateData }
    try {
      updatedData = Object.keys(updatedData).reduce((acc, key) => {
        if (updatedData[key] !== initialTemplateData[key]) {
          acc[key] = updatedData[key]
        }
        return acc
      }, {})

      console.log('Submitting template data:', updatedData)
      dispatch(editTemplate({ id, updatedData }))
        .unwrap()
        .then(() => {
          toast.success('داده ها با موفقیت بروز رسانی شد', {
            onClose: () => {
              setTimeout(() => {
                navigate('/template-headers')
              }, 2000)
            },
            autoClose: 2000,
          })
        })
        .catch((error) => {
          setError(error)
          console.error('Failed to edit template:', error)
          toast.error('Failed to edit template.')
        })
    } catch (error) {
      setError(error.message)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div
      className='flex flex-col  bg-[#182147]
 justify-center h-screen max-w-7xl mx-auto p-5'
    >
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 gap-4 bg-white p-6 rounded-lg shadow-xl'
      >
        {/* Title input */}
        <div className='mb-4'>
          <label
            htmlFor='description'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            عنوان
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
            htmlFor='description'
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
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          >
            ذخیره داده های جدید
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditTemplateHeadersForm
