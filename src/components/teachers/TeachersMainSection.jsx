import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import {
  deleteTeacher,
  fetchTeachers,
} from '../../features/teachers/teachersSlice'
import { useNavigate } from 'react-router-dom'

const TeachersMainSection = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const teachers = useSelector((state) => state.teachersR.entities)
  const isLoading = useSelector((state) => state.teachersR.isLoading)
  const isError = useSelector((state) => state.teachersR.isError)
  const [deletedTeacherIds, setDeletedTeacherIds] = useState([])
  const [showDeleted, setShowDeleted] = useState(true)

  const toggleShowDeleted = () => {
    setShowDeleted(!showDeleted)
  }
  const [sortInputs, setSortInputs] = useState({
    nationalNumber: '',
    lastName: '',
    firstName: '',
  })

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (accessToken) {
      dispatch(fetchTeachers())
    }
  }, [dispatch])

  if (isLoading) return <div className='text-white'>Loading...</div>
  if (isError) return <div>Error loading teachers</div>

  // handle sortning starts here
  const handleSortInputChange = (e) => {
    const { name, value } = e.target
    setSortInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }))
  }
  // handle sortning finishes here

  const getTeachers = () => {
    if (!teachers) return []

    return teachers
      .filter((teacher) => {
        if (!showDeleted && teacher.deleted) return false
        return (
          teacher?.national_number?.includes(sortInputs.nationalNumber || '') &&
          teacher?.last_name?.includes(sortInputs.lastName || '') &&
          teacher?.first_name?.includes(sortInputs.firstName || '')
        )
      })
      .map((teacher, index) => (
        <tr key={teacher.id} className='text-white text-center'>
          <td>
            {teacher.deleted ? (
              <button disabled>Deleted</button>
            ) : (
              <button onClick={() => handleDeleteTeacher(teacher.id)}>
                Delete
              </button>
            )}
          </td>
          <td>
            <button onClick={() => handleEditTeacher(teacher.id)}>Edit</button>
          </td>
          <td>{teacher.national_number}</td>
          <td>{teacher.last_name}</td>
          <td>{teacher.first_name}</td>
          <td>{index + 1}</td>
        </tr>
      ))
  }

  const handleDeleteTeacher = (teacherId) => {
    const isConfirmed = window.confirm('آیا از حذف این دبیر مطمعن هستید؟')
    if (isConfirmed) {
      dispatch(deleteTeacher(teacherId)).then((action) => {
        if (deleteTeacher.fulfilled.match(action)) {
          setDeletedTeacherIds((prevIds) => [...prevIds, teacherId])
        }
      })
    }
  }

  const handleEditTeacher = (teacherId) => {
    navigate(`/edit-teacher/${teacherId}`)
  }

  const handleRegisterOnsite = () => {
    navigate('/register-teacher-onsite')
  }

  return (
    <div className='h-full w-[90%] mt-[30px] mx-auto p-4'>
      <div className='flex flex-row justify-end -mt-8 mb-2'>
        {/* New "Hide Deleted" button */}
        <button
          className='bg-cyan-600 rounded-md mb-2 px-4 text-white text-sm py-2 mr-4'
          onClick={toggleShowDeleted}
        >
          {showDeleted ? 'Hide Deleted' : 'Show Deleted'}
        </button>
        <button
          className='bg-cyan-600 rounded-md mb-2 px-4 text-white text-sm py-2 mr-4'
          onClick={handleRegisterOnsite}
        >
          ثبت نام حضوری
        </button>
      </div>
      <table className='table-fixed w-full'>
        <thead>
          <tr className='text-white text-center bg-slate-800'>
            <th className='flex justify-center'>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='delete'
                placeholder='حذف'
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='edit'
                placeholder='ویرایش'
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='nationalNumber'
                placeholder='کد ملی'
                value={sortInputs.nationalNumber}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='lastName'
                placeholder='نام خانوادگی'
                value={sortInputs.lastName}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='firstName'
                placeholder='نام'
                value={sortInputs.firstName}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='theRow'
                placeholder='ردیف'
              />
            </th>
          </tr>
        </thead>
        <tbody className='text-sm text-gray-200 divide-y-2 divide-slate-700 leading-9'>{getTeachers()}</tbody>
      </table>
    </div>
  )
}
export default TeachersMainSection
