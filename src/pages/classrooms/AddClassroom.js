import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { addClassroom } from '../../features/classrooms/classroomsSlice'
import { fetchTeachers } from '../../features/teachers/teachersSlice'

const AddClassroom = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [classroomData, setClassroomData] = useState({
    title: '',
    class_number: '',
    online: false,
    class_link: '',
    year: 1402,
    course: '',
    level: 3,
    term: 1,
    teacher: 4,
    student: [],
  })
  const [levels, setLevels] = useState([])
  const [terms, setTerms] = useState([])
  const [teachers, setTeachers] = useState([])
  const [courses, setCourses] = useState([])
  const [studentSearch, setStudentSearch] = useState('')
  const [selectedStudents, setSelectedStudents] = useState([])
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  // Function to fetch students based on the search term
  const handleSearch = async () => {
    try {
      const accessToken = Cookies.get('authToken')
      // Replace with your actual search API endpoint and authorization headers
      const response = await axios.get(
        `https://api.ebsalar.com/api/v1/admin/student/?search=${studentSearch}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      setSearchResults(response.data.results)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  // Function to handle adding a student to the selected list
  const handleAddStudent = (student) => {
    // Prevent adding duplicates
    if (!selectedStudents.some((s) => s.id === student.id)) {
      setSelectedStudents([...selectedStudents, student])
    }
  }

  // Fetch levels
  useEffect(() => {
    const fetchLevels = async () => {
      //   Get the access token
      const accessToken = Cookies.get('authToken')
      if (!accessToken) {
        toast.error('Authentication token not found. Please log in.')
        return
      }
      try {
        const response = await axios.get(
          'https://api.ebsalar.com/api/v1/admin/level/',
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        setLevels(response.data.results)
        console.log('Levels in state:', response.data.results)
      } catch (error) {
        console.error('Error fetching levels:', error)
      }
    }
    fetchLevels()
  }, [])

  // Fetch courses/products starts here
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
          'https://api.ebsalar.com/api/v1/admin/product/',
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              no_paginate: true, // If you want to get all the products without pagination
            },
          }
        )
        const educationProducts = response.data.results.filter(
          (product) => product.category === 'دروس'
        )
        setCourses(educationProducts)
        // setCourses(response.data.results)
      } catch (error) {
        console.log('Error fetching departments:', error)
      }
    }
    fetchCourses()
  }, [])
  // Fetch courses/products finishes here

  // Fetch terms starts here
  useEffect(() => {
    const fetchTerms = async () => {
      //   Get the access token
      const accessToken = Cookies.get('authToken')
      if (!accessToken) {
        toast.error('Authentication token not found. Please log in.')
        return
      }
      try {
        const response = await axios.get(
          'https://api.ebsalar.com/api/v1/admin/term/',
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        setTerms(response.data.results)
        console.log('Terms in state:', response.data.results)
      } catch (error) {
        console.error('Error fetching terms:', error)
      }
    }
    fetchTerms()
  }, [])
  // Fetch terms finishes here

  // Fetch teachers starts here
  useEffect(() => {
    dispatch(fetchTeachers())
      .unwrap()
      .then((response) => {
        setTeachers(response.results)
      })
      .catch((error) => {
        console.log('Error fetching techers', error)
      })
  }, [dispatch])
  // Fetch teachers finishes here

  const handleCourseChange = (e) => {
    const { name, value } = e.target
    setClassroomData((prevData) => ({
      ...prevData,
      [name]: parseInt(value, 10),
    }))
  }

  const handleLevelChange = (e) => {
    const { name, value } = e.target
    setClassroomData((prevData) => ({
      ...prevData,
      [name]: parseInt(value, 10),
    }))
  }

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
    // Prepare the classroom data for submission
    const newClassroomData = {
      title: classroomData.title,
      class_number: classroomData.class_number,
      online: classroomData.online,
      class_link: classroomData.class_link,
      year: classroomData.year,
      course: classroomData.course,
      level: classroomData.level,
      term: classroomData.term,
      teacher: classroomData.teacher,
      students: selectedStudents.map((student) => student.id),
    }
    // Dispatch the addClassroom action
    dispatch(addClassroom(newClassroomData))
      .unwrap()
      .then((newClassroomData) => {
        toast.success('کلاس اضافه شد', {
          onClose: () => {
            setTimeout(() => {
              navigate('/classrooms')
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
        {/* Title input */}
        <div className='mb-4'>
          <label
            htmlFor='title'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            Title
          </label>
          <input
            id='description'
            type='text'
            name='title'
            value={classroomData.title}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
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
        {/* Online Student Checkbox */}
        <div className='mb-4 md:col-span-1'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            online
          </label>
          <input
            type='checkbox'
            name='online'
            checked={classroomData?.online || false}
            onChange={handleInputChange}
            className='mt-1'
          />
        </div>
        {/* Class Link input */}
        <div className='mb-4'>
          <label
            htmlFor='class_link'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            Class Link
          </label>
          <input
            id='description'
            type='text'
            name='class_link'
            value={classroomData.class_link}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        {/* Year input */}
        <div className='mb-4'>
          <label
            htmlFor='year'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            Year
          </label>
          <input
            id='year'
            type='text'
            name='year'
            value={classroomData.year}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        {/* Product/course select input */}
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
                {course.title}
              </option>
            ))}
          </select>
        </div>
        {/* Level Select input */}
        <div className='mb-4 md:col-span-1'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            پایه
          </label>
          <select
            name='level'
            value={classroomData.level}
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
        {/* Term select input */}
        <div className='mb-4 md:col-span-1'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Term
          </label>
          <select
            name='term'
            value={classroomData.term}
            onChange={handleInputChange}
            className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          >
            {terms.map((term) => (
              <option key={term.id} value={term.id}>
                {term.name}
              </option>
            ))}
          </select>
        </div>
        {/* Teacher select input */}
        <div className='mb-4 md:col-span-1'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Teacher
          </label>
          <select
            name='teacher'
            value={classroomData.teacher}
            onChange={handleInputChange}
            className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          >
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.first_name} {teacher.last_name}
              </option>
            ))}
          </select>
        </div>
        {/* Student select input */}
        <div className='mb-4'>
          <label
            htmlFor='studentSearch'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            Search Students by National Number
          </label>
          <input
            type='text'
            name='studentSearch'
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            placeholder='Enter national number...'
            className='...'
          />
          <button type='button' onClick={handleSearch}>
            Search
          </button>
          <ul>
            {searchResults.map((student) => (
              <li key={student.id}>
                {student.first_name} {student.last_name} (
                {student.national_number})
                <button type='button' onClick={() => handleAddStudent(student)}>
                  Add
                </button>
              </li>
            ))}
          </ul>
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

export default AddClassroom
