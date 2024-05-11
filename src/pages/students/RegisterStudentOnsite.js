import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { registerStudentOnsite } from '../../features/students/studentsSlice'

const RegisterStudentOnsite = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [studentData, setStudentData] = useState({
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
    school: '',
    father_job: '',
    mother_job: '',
    father_phone: '',
    mother_phone: '',
    avatar: '',
    former: false,
    level: 3,
  })
  const [levels, setLevels] = useState([])
  const [avatarImage, setAvatarImage] = useState(null)
  const [avatarImageUrl, setAvatarImageUrl] = useState('')
  const [birthDay, setBirthDay] = useState({
    year: '',
    month: '',
    day: '',
  })

  // year, month, and day options for the Persian calendar
  const years = Array.from({ length: 102 }, (_, i) => 1302 + i) // from 1302 to 1403
  const months = Array.from({ length: 12 }, (_, i) => i + 1) // 1 to 12
  const days = Array.from({ length: 31 }, (_, i) => i + 1) // 1 to 31

  useEffect(() => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  // Fetch levels starts here
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await axios.get(
          'https://api.ebsalar.com/api/v1/front/level/'
        )
        setLevels(response.data.results)
      } catch (error) {
        console.error('Error fetching levels:', error)
      }
    }
    fetchLevels()
  }, [])

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
          setStudentData({
            ...studentData,
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
    setStudentData((prevData) => ({
      ...prevData,
      [name]: parseInt(value, 10),
    }))
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setStudentData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Consolidate the birth date into a single string
    const birthDaySolar = `${birthDay.year}/${birthDay.month}/${birthDay.day}`

    // Prepare the student data for submission
    const newStudentData = {
      national_number: studentData.national_number,
      first_name: studentData.first_name,
      last_name: studentData.last_name,
      gender: studentData.gender,
      landline_phone: studentData.landline_phone,
      phone_number: studentData.phone_number,
      city: studentData.city,
      address: studentData.address,
      birth_day_solar: birthDaySolar,
      school: studentData.school,
      father_job: studentData.father_job,
      mother_job: studentData.mother_job,
      father_phone: studentData.father_phone,
      mother_phone: studentData.mother_phone,
      avatar: studentData.avatar,
      level: studentData.level,
      former: studentData.former,
      verify: studentData.verify,
    }
    // Dispatch the registerStudentOnsite action
    dispatch(registerStudentOnsite(newStudentData))
      .unwrap()
      .then((newStudentData) => {
        toast.success('Student details updated successfully.', {
          onClose: () => {
            setTimeout(() => {
              navigate('/students')
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
      className='flex flex-col justify-center items-center bg-[#161F2B]   min-h-screen '    >
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-200 p-6 rounded-lg shadow-xl'
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

        {/* Level Select input */}
        <div className='mb-4 md:col-span-1'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            پایه
          </label>
          <select
            name='level'
            value={studentData.level}
            onChange={handleLevelChange}
            className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          >
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </select>
        </div>

        {/* Gender Radio Buttons */}
        <div className='mb-4 md:col-span-1'>
          <span className='block text-gray-700 text-sm font-bold mb-2'>
            دانش آموز
          </span>
          <div>
            <label htmlFor='male' className='inline-flex items-center mr-6'>
              <input
                id='male'
                type='radio'
                name='gender'
                value='m'
                checked={studentData.gender === 'm'}
                onChange={handleInputChange}
                className='form-radio'
              />
              <span className='ml-2'>پسر</span>
            </label>
            <label htmlFor='female' className='inline-flex items-center'>
              <input
                id='female'
                type='radio'
                name='gender'
                value='f'
                checked={studentData.gender === 'f'}
                onChange={handleInputChange}
                className='form-radio'
              />
              <span className='ml-2'>دختر</span>
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
            value={studentData.first_name}
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
            value={studentData.last_name}
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
            کد ملی دانش آموز
          </label>
          <input
            id='national_number'
            type='text'
            name='national_number'
            value={studentData.national_number}
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
            value={studentData.landline_phone}
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
            value={studentData.phone_number}
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
            value={studentData.city}
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
            value={studentData.address}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        {/* School input */}
        <div className='mb-4'>
          <label
            htmlFor='school'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            مدرسه
          </label>
          <input
            id='school'
            type='text'
            name='school'
            value={studentData.school}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        {/* Father Job input */}
        <div className='mb-4'>
          <label
            htmlFor='father_job'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            شغل پدر
          </label>
          <input
            id='father_job'
            type='text'
            name='father_job'
            value={studentData.father_job}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        {/* Mother Job input */}
        <div className='mb-4'>
          <label
            htmlFor='mother_job'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            شغل مادر
          </label>
          <input
            id='mother_job'
            type='text'
            name='mother_job'
            value={studentData.mother_job}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        {/* Father Phone input */}
        <div className='mb-4'>
          <label
            htmlFor='father_phone'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            شماره تماس ویژه پدر
          </label>
          <input
            id='father_phone'
            type='text'
            name='father_phone'
            value={studentData.father_phone}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        {/* Mother Phone input */}
        <div className='mb-4 md:col-span-1'>
          <label
            htmlFor='mother_phone'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            شماره تماس ویژه مادر
          </label>
          <input
            id='mother_phone'
            type='text'
            name='mother_phone'
            value={studentData.mother_phone}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>

        {/* Former Student Checkbox */}
        {/* <div className='mb-4 md:col-span-1'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            دانش آموز قبلی هستم
          </label>
          <input
            type='checkbox'
            name='former'
            checked={studentData?.former || false}
            onChange={handleInputChange}
            className='mt-1'
          />
        </div> */}
        {/* Verify Student Checkbox */}
        <div className=' flex justify-center space-x-3 items-center'>
          <label className='block text-gray-700 text-sm '>
            تایید دانش آموز
          </label>
          <input
            type='checkbox'
            name='verify'
            checked={studentData?.verify || false}
            onChange={handleInputChange}
            className=''
          />
        </div>
        {/* Save Changes Button */}
        <div className='mb-4 md:col-span-1 flex justify-start'>
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          >
            ثبت نام دانش آموز
          </button>
        </div>
      </form>
    </div>
  )
}

export default RegisterStudentOnsite
