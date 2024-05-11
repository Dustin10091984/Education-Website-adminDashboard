import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { editStudent } from '../../features/students/studentsSlice'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const EditStudentForm = () => {
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
  const [initialStudentData, setInitialStudentData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // year, month, and day options for the Persian calendar
  const years = Array.from({ length: 102 }, (_, i) => 1302 + i) // from 1302 to 1403
  const months = Array.from({ length: 12 }, (_, i) => i + 1) // 1 to 12
  const days = Array.from({ length: 31 }, (_, i) => i + 1) // 1 to 31

  const editedId = useParams()
  const id = editedId.studentId
  console.log(id)
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const accessToken = Cookies.get('authToken')
        if (!accessToken) throw new Error('Access token not found')
        const response = await axios.get(
          `https://api.ebsalar.com/api/v1/admin/student/${id}/`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        const fetchedData = {
          national_number: response.data.results.national_number || '',
          first_name: response.data.results.first_name || '',
          last_name: response.data.results.last_name || '',
          gender: response.data.results.gender || 'm',
          verify: response.data.results.verify || false,
          landline_phone: response.data.results.landline_phone || '',
          phone_number: response.data.results.phone_number || '',
          city: response.data.results.city || '',
          address: response.data.results.address || '',
          birth_day_solar: response.data.results.birth_day_solar || '',
          school: response.data.results.school || '',
          father_job: response.data.results.father_job || '',
          mother_job: response.data.results.mother_job || '',
          father_phone: response.data.results.father_phone || '',
          mother_phone: response.data.results.mother_phone || '',
          avatar: response.data.results.avatar || '',
          former: response.data.results.former || false,
          level: response.data.results.level || 3,
        }
        const [year, month, day] =
          response.data.results.birth_day_solar.split('/')
        setBirthDay({ year, month, day })
        setStudentData(fetchedData)
        setInitialStudentData(fetchedData)
        setAvatarImageUrl(fetchedData.avatar)
        console.log(response.data)
        setIsLoading(false)
      } catch (error) {
        setError(error.message)
        setIsLoading(false)
      }
    }
    fetchStudentData()
  }, [id])

  // Fetch levels
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
        toast.success('عکس پروفایل شما با موفقیت آپلود شد')
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
    const birthDaySolar = `${birthDay.year}/${birthDay.month}/${birthDay.day}`

    let updatedData = { ...studentData, birth_day_solar: birthDaySolar }
    try {
      updatedData = Object.keys(updatedData).reduce((acc, key) => {
        if (updatedData[key] !== initialStudentData[key]) {
          acc[key] = updatedData[key]
        }
        return acc
      }, {})

      console.log('Submitting student data:', updatedData)
      dispatch(editStudent({ id, updatedData }))
        .unwrap()
        .then(() => {
          toast.success('مشخصات شما با موفقیت بروز رسانی شد', {
            onClose: () => {
              setTimeout(() => {
                navigate('/students')
              }, 2000)
            },
            autoClose: 2000,
          })
        })
        .catch((error) => {
          setError(error)
          console.error('Failed to edit student:', error)
          toast.error('Failed to edit student.')
        })
    } catch (error) {
      console.error('Failed to upload image or edit student:', error)
      setError(error.message)
      toast.error('Failed to upload avatar image or edit student.')
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
              <option value=''>سال</option>
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
              <option value=''>ماه</option>
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
              <option value=''>روز</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>
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
        <div className='mb-4 md:col-span-1'>
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
        </div>
        {/* verify Student Checkbox */}
        <div className='mb-4 md:col-span-1'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            تایید دانش آموز
          </label>
          <input
            type='checkbox'
            name='verify'
            checked={studentData?.verify || false}
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
            ذخیره داده های جدید
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditStudentForm
