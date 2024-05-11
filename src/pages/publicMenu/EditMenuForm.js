import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { editMenu } from '../../features/publicMenu/publicMenuSlice'

const EditMenuForm = () => {
  const dispatch = useDispatch()
  const [menuData, setMenuData] = useState({
    name: '',
    link: '',
    logo: '',
  })
  const [logoImage, setLogoImage] = useState(null)
  const [logoImageUrl, setLogoImageUrl] = useState('')

  const [initialMenuData, setInitialMenuData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const editedId = useParams()
  const id = editedId.menuId
  console.log(id)
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const accessToken = Cookies.get('authToken')
        if (!accessToken) throw new Error('Access token not found')
        const response = await axios.get(
          `https://api.ebsalar.com/api/v1/admin/menu/${id}/`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        const fetchedData = {
          name: response.data.results.name || '',
          link: response.data.results.link || '',
          logo: response.data.results.logo || '',
        }
        setMenuData(fetchedData)
        setInitialMenuData(fetchedData)
        setLogoImageUrl(fetchedData.logo)
        console.log(response.data)
        setIsLoading(false)
      } catch (error) {
        setError(error.message)
        setIsLoading(false)
      }
    }
    fetchMenuData()
  }, [id])

  const handleLogoImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogoImage(file)
      // Preview the image
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoImageUrl(reader.result)
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
        toast.success(' لوگو شما با موفقیت آپلود شد')
        if (uploadResponse.data && uploadResponse.data.results) {
          setMenuData({
            ...menuData,
            logo: uploadResponse.data.results,
          })
        }
      } catch (error) {
        console.error('Error uploading file:', error)
        toast.error('Failed to upload logo image.')
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setMenuData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let updatedData = { ...menuData }
    try {
      updatedData = Object.keys(updatedData).reduce((acc, key) => {
        if (updatedData[key] !== initialMenuData[key]) {
          acc[key] = updatedData[key]
        }
        return acc
      }, {})

      console.log('Submitting menu data:', updatedData)
      dispatch(editMenu({ id, updatedData }))
        .unwrap()
        .then(() => {
          toast.success(' منو با موفقیت بروز رسانی شد', {
            onClose: () => {
              setTimeout(() => {
                navigate('/PublicMenu')
              }, 2000)
            },
            autoClose: 2000,
          })
        })
        .catch((error) => {
          setError(error)
          console.error('Failed to edit menu:', error)
          toast.error('Failed to edit menu.')
        })
    } catch (error) {
      console.error('Failed to upload image or edit menu:', error)
      setError(error.message)
      toast.error('Failed to upload logo image or edit menu.')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div
      className='flex flex-col
 justify-center h-screen max-w-7xl mx-auto p-5'
    >
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-xl'
      >
        {/* logo input with grid layout */}
        <div className='mb-4 md:col-span-1'>
          <label
            className='block text-gray-700 text-sm font-bold -mb-7'
            htmlFor='logo'
          >
            لوگو
          </label>
          <div className='grid grid-cols-2 items-end gap-4'>
            <input
              id='logo'
              type='file'
              name='logo'
              onChange={handleLogoImageChange}
              className='col-span-1 shadow appearance-none border rounded py-2 px-3 -mr-28 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
            {logoImageUrl && (
              <img
                src={logoImageUrl}
                alt='logo Preview'
                className='w-20 h-20 ml-28 rounded-md'
              />
            )}
          </div>
        </div>
        {/* Name input */}
        <div className='mb-4'>
          <label
            htmlFor='name'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            نام
          </label>
          <input
            id='first_name'
            type='text'
            name='name'
            value={menuData.name}
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
            value={menuData.link}
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
            ذخیره داده های جدید
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditMenuForm
