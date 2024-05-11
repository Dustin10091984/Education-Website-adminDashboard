import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { addSub } from '../../features/submenus/submenusSlice'

const AddSubmenu = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [submenuData, setSubmenuData] = useState({
    name: '',
    link: '',
    logo: '',
    menu: 0,
  })
  const [logoImage, setLogoImage] = useState(null)
  const [logoImageUrl, setLogoImageUrl] = useState('')
  const [menus, setMenus] = useState([])

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      navigate('/login')
    }
  }, [])

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
          setSubmenuData({
            ...submenuData,
            logo: uploadResponse.data.results,
          })
        }
      } catch (error) {
        console.error('Error uploading logo:', error)
        toast.error('Failed to upload logo image.')
      }
    }
  }

  useEffect(() => {
    const fetchMenus = async () => {
      //   Get the access token
      const accessToken = Cookies.get('authToken')
      if (!accessToken) {
        toast.error('Authentication token not found. Please log in.')
        return
      }
      try {
        const response = await axios.get(
          'https://api.ebsalar.com/api/v1/admin/menu/',
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        setMenus(response.data.results)
      } catch (error) {
        console.log('Error fetching menus:', error)
      }
    }
    fetchMenus()
  }, [])

  const handleMenuChange = (e) => {
    const { name, value } = e.target
    setSubmenuData((prevData) => ({
      ...prevData,
      [name]: parseInt(value, 10),
    }))
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setSubmenuData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Prepare the menu data for submission
    const newSubmenuData = {
      name: submenuData.name,
      link: submenuData.link,
      logo: submenuData.logo,
      menu: submenuData.menu,
    }
    // Dispatch the addMenu action
    dispatch(addSub(newSubmenuData))
      .unwrap()
      .then((newSubmenuData) => {
        toast.success('زیر منو اضافه شد', {
          onClose: () => {
            setTimeout(() => {
              navigate('/PublicMenu')
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
    <div className='flex justify-center bg-[#161F2B]  items-center max-w-7xl mx-auto p-5 h-screen'>
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className='flex flex-col w-[480px]  bg-gray-200 p-6 rounded-lg shadow-xl'
      >
        {/* logo input */}
        <div className='mb-4 flex flex-row justify-center md:col-span-1'>
          <label
            className=' text-gray-700 text-sm   flex justify-center items-center'
            htmlFor='logo'
          >
            ضمیمه لوگو
          </label>

          <div className='grid grid-cols-1  gap-4 ml-14'>
            <input
              id='logo'
              type='file'
              name='logo'
              onChange={handleLogoImageChange}
              className='col-span-1 shadow appearance-none border rounded py-2 pl-10 pr-1 w-[300px]  text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
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
            id='name'
            type='text'
            name='name'
            value={submenuData.name}
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
            لینگ (لطفا لینک نگذارید)
          </label>
          <input
            id='link'
            type='text'
            name='link'
            value={submenuData.link}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        {/* menu Select input */}
        <div className='mb-4 md:col-span-1'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            دپارتمان
          </label>
          <select
            name='menu'
            value={submenuData.menu}
            onChange={handleMenuChange}
            className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          >
            {menus.map((menu) => (
              <option key={menu.id} value={menu.id}>
                {menu.name}
              </option>
            ))}
          </select>
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

export default AddSubmenu
