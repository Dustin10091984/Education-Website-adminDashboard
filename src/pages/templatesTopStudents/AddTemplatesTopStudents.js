import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Cookies from 'js-cookie'
import { fetchStudents } from '../../features/students/studentsSlice'
import { addTemplatesTopStudents } from '../../features/templatesTopStudents/templatesTopStudentsSlice'

const AddTemplatesTopStudents = () => {
  const dispatch = useDispatch()
  const students = useSelector((state) => state.studentsR.entities) // Assuming your students are in studentsR slice
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredStudents, setFilteredStudents] = useState([])

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (accessToken) {
      dispatch(fetchStudents()) // Dispatch an action to fetch all students without pagination
    }
  }, [dispatch])

  useEffect(() => {
    setFilteredStudents(
      students.filter((student) => student.national_number.includes(searchTerm))
    )
  }, [students, searchTerm])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleAddTopStudent = (student) => {
    const studentData = {
      student: student.id, // Assuming the API needs the student's ID
      description: 'Top student', // Add other data as needed
    }
    dispatch(addTemplatesTopStudents(studentData))
  }

  return (
    <div className='flex flex-col justify-center items-center max-w-7xl mx-auto p-5 mt-8'>
      <input
        type='text'
        placeholder=' جستجوی کد ملی به انگلیسی'
        value={searchTerm}
        onChange={handleSearchChange}
        className='shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4'
      />
      {filteredStudents.map((student) => (
        <div key={student.id}>
          <p>
            {student.first_name} {student.last_name}
          </p>
          <p>{student.national_number}</p>
          <button
            className='mt-2 mb-8 btn bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            onClick={() => handleAddTopStudent(student)}
          >
            افزودن به لیست دانش آموزان ممتاز
          </button>
        </div>
      ))}
    </div>
  )
}

export default AddTemplatesTopStudents
