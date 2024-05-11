import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { editClassroom } from '../../features/classrooms/classroomsSlice'
import { fetchTeachers } from '../../features/teachers/teachersSlice'

const EditClassroomForm = () => {
  const dispatch = useDispatch()
  const [classroomData, setClassroomData] = useState({
    class_number: '',
    course: 13,
    level: 3,
    term: 1,
    year: 1402,
    teacher: 4,
    online: false,
    class_link: '',
    student: [],
  })

  const [levels, setLevels] = useState([])
  const [terms, setTerms] = useState([])
  const [teachers, setTeachers] = useState([])
  const [courses, setCourses] = useState([])
  const [initialClassroomData, setInitialClassroomData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [studentSearch, setStudentSearch] = useState('')
  const [selectedStudents, setSelectedStudents] = useState([])
  const [searchResults, setSearchResults] = useState([])

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

  // Handler to search for students by national number
  const handleSearch = async () => {
    try {
      const accessToken = Cookies.get('authToken')
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

  // A function to add the student to the selected list
  const handleAddStudent = (event, studentId) => {
    event.preventDefault() // Prevents the default action of the button
    event.stopPropagation() // Stops the event from bubbling up to parent elements
    setSelectedStudents((prevSelectedStudents) => [
      ...prevSelectedStudents,
      studentId,
    ])
  }

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
          class_link: response.data.results.class_link || '',
          course: response.data.results.course || 13,
          level: response.data.results.level,
          term: response.data.results.term,
          year: response.data.results.year || 1402,
          teacher: response.data.results.teacher.id,
          online: response.data.results.online || false,
          student: response.data.results.student.id,
        }
        setClassroomData(fetchedData)
        setInitialClassroomData(fetchedData)
        console.log('Fetched level:', fetchedData.level)
        setSelectedStudents(
          response.data.results.student.map((student) => student.id)
        )

        // console.log(response.data)
        setIsLoading(false)
      } catch (error) {
        setError(error.message)
        setIsLoading(false)
      }
    }
    fetchClassroomData()
  }, [id])

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
    let updatedData = { ...classroomData, student: selectedStudents }
    try {
      // Remove any unchanged data from the updatedData object
      updatedData = Object.keys(updatedData).reduce((acc, key) => {
        if (updatedData[key] !== initialClassroomData[key]) {
          acc[key] = updatedData[key]
        }
        return acc
      }, {})

      console.log('Submitting classroom data:', updatedData)
      // Dispatch the editClassroom action with the updated data
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
      console.error('Failed to submit the form:', error)
      setError(error.message)
      toast.error('Failed to submit the form.')
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
        <div>
          <input
            type='text'
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            placeholder='Search students by national number...'
          />
          <button type='button' onClick={handleSearch}>
            Search
          </button>
          {/* Assuming you have a state variable `searchResults` to hold the results */}
          <ul>
            {searchResults.map((student) => (
              <li key={student.id}>
                {student.first_name} {student.last_name}
                <button
                  type='button'
                  onClick={(event) => handleAddStudent(event, student.id)}
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
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
        {/* Class Number input */}
        <div className='mb-4'>
          <label
            htmlFor='class_link'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            Class Link
          </label>
          <input
            id='class_link'
            type='text'
            name='class_link'
            value={classroomData.class_link}
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

export default EditClassroomForm
