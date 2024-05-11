import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { editClassroom } from '../../features/classrooms/classroomsSlice'

const ClassroomDetail = () => {
  const dispatch = useDispatch()
  const [classroomData, setClassroomData] = useState({
    class_number: '',
    course: 13,
  })

  // const [departments, setDepartments] = useState([])
  const [courses, setCourses] = useState([])
  const [initialClassroomData, setInitialClassroomData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const editedId = useParams()
  const id = editedId.classroomId
  console.log(id)
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        const accessToken = Cookies.get('authToken')
        if (!accessToken) throw new Error('Access token not found')
        const response = await axios.get(
          `https://api.ebsalar.com/api/v1/admin/class_room/${id}/`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        const fetchedData = {
          class_number: response.data.results.class_number || '',
          course: response.data.results.course || 13,

          // department: response.data.results.department || 0,
        }
        setClassroomData(fetchedData)
        setInitialClassroomData(fetchedData)
        console.log(response.data)
        setIsLoading(false)
      } catch (error) {
        setError(error.message)
        setIsLoading(false)
      }
    }
    fetchClassroomData()
  }, [id])

  // Fetch courses starts here
  useEffect(() => {
    const fetchCourses = async () => {
      //   Get the access token
      const accessToken = Cookies.get('authToken')
      if (!accessToken) {
        toast.error('Authentication token not found. Please log in.')
        return
      }
      try {
        const response = await axios.get(
          'https://api.ebsalar.com/api/v1/admin/course/',
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        setCourses(response.data.results)
      } catch (error) {
        console.log('Error fetching departments:', error)
      }
    }
    fetchCourses()
  }, [])
  // Fetch courses finishes here

  const handleCourseChange = (e) => {
    const { name, value } = e.target
    setClassroomData((prevData) => ({
      ...prevData,
      [name]: parseInt(value, 10),
    }))
  }

  // useEffect(() => {
  //   const fetchDepartments = async () => {
  //     //   Get the access token
  //     const accessToken = Cookies.get('authToken')
  //     if (!accessToken) {
  //       toast.error('Authentication token not found. Please log in.')
  //       return
  //     }
  //     try {
  //       const response = await axios.get(
  //         'https://api.ebsalar.com/api/v1/admin/department/',
  //         {
  //           headers: {
  //             'Content-Type': 'multipart/form-data',
  //             Authorization: `Bearer ${accessToken}`,
  //           },
  //         }
  //       )
  //       setDepartments(response.data.results)
  //     } catch (error) {
  //       console.log('Error fetching departments:', error)
  //     }
  //   }
  //   fetchDepartments()
  // }, [])

  // const handleDepartmentChange = (e) => {
  //   const { name, value } = e.target
  //   setClassroomData((prevData) => ({
  //     ...prevData,
  //     [name]: parseInt(value, 10),
  //   }))
  // }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setClassroomData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let updatedData = { ...classroomData }
    try {
      updatedData = Object.keys(updatedData).reduce((acc, key) => {
        if (updatedData[key] !== initialClassroomData[key]) {
          acc[key] = updatedData[key]
        }
        return acc
      }, {})

      console.log('Submitting classroom data:', updatedData)
      dispatch(editClassroom({ id, updatedData }))
        .unwrap()
        .then(() => {
          toast.success('کلاس با موفقیت بروز رسانی شد', {
            onClose: () => {
              setTimeout(() => {
                navigate('/classrooms')
              }, 2000)
            },
            autoClose: 2000,
          })
        })
        .catch((error) => {
          setError(error)
          console.error('Failed to edit classroom:', error)
          toast.error('Failed to edit classroom.')
        })
    } catch (error) {
      console.error('Failed to upload image or edit classroom:', error)
      setError(error.message)
      toast.error('Failed to upload avatar image or edit classroom.')
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
        {/* Class Number input */}
        <div className='mb-4'>
          <label
            htmlFor='class_number'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            Class Number
          </label>
          <input
            id='class_number'
            type='text'
            name='class_number'
            value={classroomData.class_number}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        {/* Course select input */}
        <div className='mb-4 md:col-span-1'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Course
          </label>
          <select
            name='course'
            value={classroomData.course}
            onChange={handleCourseChange}
            className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
        {/* Department Select input */}
        {/* <div className='mb-4 md:col-span-1'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Department
          </label>
          <select
            name='department'
            value={classroomData.department}
            onChange={handleDepartmentChange}
            className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          >
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div> */}
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

export default ClassroomDetail
