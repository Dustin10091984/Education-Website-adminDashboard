import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { registerTeacherOnsite } from '../../features/teachers/teachersSlice'

const RegisterTeacherOnsite = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [teacherData, setTeacherData] = useState({
    national_number: '',
    first_name: '',
    last_name: '',
    gender: '',
    verify: false,
    landline_phone: '',
    phone_number: '',
    city: '',
    address: '',
    birth_day_solar: '',
    avatar: '',
    degree: 'd',
  })
  const [avatarImage, setAvatarImage] = useState(null)
  const [avatarImageUrl, setAvatarImageUrl] = useState('')
  const [birthDay, setBirthDay] = useState({
    year: '',
    month: '',
    day: '',
  })

  useEffect(() => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  // year, month, and day options for the Persian calendar
  const years = Array.from({ length: 102 }, (_, i) => 1302 + i) // from 1302 to 1403
  const months = Array.from({ length: 12 }, (_, i) => i + 1) // 1 to 12
  const days = Array.from({ length: 31 }, (_, i) => i + 1) // 1 to 31

  // Degree options
  const DEGREE_OPTIONS = {
    d: 'دیپلم',
    a: 'فوق دیپلم',
    b: 'لیسانس',
    m: 'فوق لیسانس',
    p: 'دکترا',
  }

  const handleAvatarImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarImage(file)
      // Preview the image
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarImageUrl(reader.result)
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
        toast.success('image uploaded successfully')
        if (uploadResponse.data && uploadResponse.data.results) {
          setTeacherData({
            ...teacherData,
            avatar: uploadResponse.data.results,
          })
        }
      } catch (error) {
        console.error('Error uploading file:', error)
        toast.error('Failed to upload avatar image.')
      }
    }
  }
  const handleLevelChange = (e) => {
    const { name, value } = e.target
    setTeacherData((prevData) => ({
      ...prevData,
      [name]: parseInt(value, 10),
    }))
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setTeacherData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Consolidate the birth date into a single string
    const birthDaySolar = `${birthDay.year}/${birthDay.month}/${birthDay.day}`

    // Prepare the teacher data for submission
    const newTeacherData = {
      national_number: teacherData.national_number,
      first_name: teacherData.first_name,
      last_name: teacherData.last_name,
      gender: teacherData.gender,
      verify: teacherData.verify,
      landline_phone: teacherData.landline_phone,
      phone_number: teacherData.phone_number,
      city: teacherData.city,
      address: teacherData.address,
      birth_day_solar: birthDaySolar,
      avatar: teacherData.avatar,
      degree: teacherData.degree,
    }
    // Dispatch the registerTeacherOnsite action
    dispatch(registerTeacherOnsite(newTeacherData))
      .unwrap()
      .then((newTeacherData) => {
        toast.success('Teachers details updated successfully.', {
          onClose: () => {
            setTimeout(() => {
              navigate('/teachers')
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
 justify-center h-screen  max-w-7xl mx-auto p-5'
    >
      <h1>ثبت نام حضوری معلم</h1>
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-xl'
      >
        {/* Avatar input with grid layout */}
        <div className='mb-4 md:col-span-1'>
          <label
            className='block text-gray-700 text-sm font-bold -mb-7'
            htmlFor='avatar'
          >
            عکس پروفایل
          </label>
          <div className='grid grid-cols-2 items-end gap-4'>
            <input
              id='avatar'
              type='file'
              name='avatar'
              onChange={handleAvatarImageChange}
              className='col-span-1 shadow appearance-none border rounded py-2 px-3 -mr-28 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
            {avatarImageUrl && (
              <img
                src={avatarImageUrl}
                alt='Avatar Preview'
                className='w-20 h-20 ml-28 rounded-md'
              />
            )}
          </div>
        </div>
        {/* Degree Select input */}
        <div className='mb-4 md:col-span-1'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            مدرک تحصیلی
          </label>
          <select
            name='degree'
            value={teacherData.degree}
            onChange={handleInputChange}
            className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          >
            {Object.entries(DEGREE_OPTIONS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        {/* Gender Radio Buttons */}
        <div className='mb-4 md:col-span-1'>
          <span className='block text-gray-700 text-sm font-bold mb-2'>
            معلم
          </span>
          <div>
            <label htmlFor='male' className='inline-flex items-center mr-6'>
              <input
                id='male'
                type='radio'
                name='gender'
                value='m'
                checked={teacherData.gender === 'm'}
                onChange={handleInputChange}
                className='form-radio'
                required
              />
              <span className='ml-2'>آقا</span>
            </label>
            <label htmlFor='female' className='inline-flex items-center'>
              <input
                id='female'
                type='radio'
                name='gender'
                value='f'
                checked={teacherData.gender === 'f'}
                onChange={handleInputChange}
                className='form-radio'
              />
              <span className='ml-2'>خانم</span>
            </label>
          </div>
        </div>
        {/* First Name input */}
        <div className='mb-4'>
          <label
            htmlFor='first_name'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            نام
          </label>
          <input
            id='first_name'
            type='text'
            name='first_name'
            value={teacherData.first_name}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        {/* Last Name input */}
        <div className='mb-4'>
          <label
            htmlFor='last_name'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            نام خانوادگی
          </label>
          <input
            id='last_name'
            type='text'
            name='last_name'
            value={teacherData.last_name}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        {/* National Number input */}
        <div className='mb-4'>
          <label
            htmlFor='national_number'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            کد ملی معلم
          </label>
          <input
            id='national_number'
            type='text'
            name='national_number'
            value={teacherData.national_number}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        {/* Birthday selectors */}
        <div className='mb-4 col-span-2 grid grid-cols-3 gap-4'>
          <div>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              سال تولد
            </label>
            <select
              name='year'
              value={birthDay.year}
              onChange={(e) =>
                setBirthDay({ ...birthDay, year: e.target.value })
              }
              className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            >
              <option value=''>Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              ماه تولد
            </label>
            <select
              name='month'
              value={birthDay.month}
              onChange={(e) =>
                setBirthDay({ ...birthDay, month: e.target.value })
              }
              className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            >
              <option value=''>Month</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              روز تولد
            </label>
            <select
              name='day'
              value={birthDay.day}
              onChange={(e) =>
                setBirthDay({ ...birthDay, day: e.target.value })
              }
              className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            >
              <option value=''>Day</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Landline Phone input */}
        <div className='mb-4'>
          <label
            htmlFor='landline_phone'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            شماره تلفن ثابت
          </label>
          <input
            id='landline_phone'
            type='text'
            name='landline_phone'
            value={teacherData.landline_phone}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        {/* Phone Number input */}
        <div className='mb-4'>
          <label
            htmlFor='phone_number'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            شماره تلفن همراه
          </label>
          <input
            id='phone_number'
            type='text'
            name='phone_number'
            value={teacherData.phone_number}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        {/* City input */}
        <div className='mb-4'>
          <label
            htmlFor='city'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            شهر محل اقامت
          </label>
          <input
            id='city'
            type='text'
            name='city'
            value={teacherData.city}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        {/* Address input */}
        <div className='mb-4'>
          <label
            htmlFor='address'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            آدرس دقیق منزل
          </label>
          <input
            id='address'
            type='text'
            name='address'
            value={teacherData.address}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        {/* Verify Teacher Checkbox */}
        <div className='mb-4 md:col-span-1'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            تایید معلم
          </label>
          <input
            type='checkbox'
            name='verify'
            checked={teacherData?.verify || false}
            onChange={handleInputChange}
            className='mt-1'
          />
        </div>
        {/* Save Changes Button */}
        <div className='mb-4 md:col-span-1 flex justify-start'>
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          >
            ثبت نام معلم
          </button>
        </div>
      </form>
    </div>
  )
}

export default RegisterTeacherOnsite
