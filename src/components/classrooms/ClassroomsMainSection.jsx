import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import {
  deleteClassroom,
  fetchClassrooms,
} from '../../features/classrooms/classroomsSlice'

const ClassroomsMainSection = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const classrooms = useSelector((state) => state.classroomsR.entities)
  const isLoading = useSelector((state) => state.classroomsR.isLoading)
  const isError = useSelector((state) => state.classroomsR.isError)
  const [deletedClassroomIds, setDeletedClassroomIds] = useState([])
  const [sortInputs, setSortInputs] = useState({
    class_number: '',
    course: '',
    title: '',
    online: '',
    students_count: '',
    year: '',
    teacher: '',
    term: '',
    level: '',
  })
  // const [showDeleted, setShowDeleted] = useState(true)

  // const toggleShowDeleted = () => {
  //   setShowDeleted(!showDeleted)
  // }

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (accessToken) {
      dispatch(fetchClassrooms())
    }
  }, [dispatch])

  if (isLoading) return <div className='text-white'>Loading...</div>
  if (isError) return <div>Error loading classrooms</div>

  // handle sortning starts here
  const handleSortInputChange = (e) => {
    const { name, value } = e.target
    setSortInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }))
  }
  // handle sortning finishes here

  const getClassrooms = () => {
    if (!classrooms) return []

    return classrooms.map((classroom, index) => (
      <tr key={classroom.id} className='text-white text-center'>
        <td>
          {classroom.deleted ? (
            <button disabled>Deleted</button>
          ) : (
            <button onClick={() => handleDeleteClassroom(classroom.id)}>
              Delete
            </button>
          )}
        </td>
        <td>
          <button onClick={() => handleEditClassroom(classroom.id)}>
            Edit
          </button>
        </td>
        <td>{classroom.level}</td>
        <td>{classroom.term}</td>
        <td>{classroom.teacher?.last_name}</td>
        <td>{classroom.teacher?.first_name}</td>
        <td>{classroom.year}</td>
        <td>{classroom.students_count + 1}</td>
        <td>{classroom.online?.toString()}</td>
        <td>{classroom.course}</td>
        <td>{classroom.class_number}</td>
        <td>{classroom.title}</td>

        <td>{index + 1}</td>
      </tr>
    ))
  }

  const handleDeleteClassroom = (classroomId) => {
    const isConfirmed = window.confirm('آیا از حذف این کلاس مطمعن هستید؟')
    if (isConfirmed) {
      dispatch(deleteClassroom(classroomId)).then((action) => {
        if (deleteClassroom.fulfilled.match(action)) {
          setDeletedClassroomIds((prevIds) => [...prevIds, classroomId])
        }
      })
    }
  }

  const handleEditClassroom = (classroomId) => {
    navigate(`/edit-classroom/${classroomId}`)
  }

  const handleAddClassroom = () => {
    navigate('/add-classroom')
  }

  return (
    <div className='h-full w-full mt-[10px] '>
      <div className='flex flex-row justify-end space-x-2 -mt-8 mb-2'>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white text-sm  py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          onClick={handleAddClassroom}
        >
          اضافه کردن کلاس
        </button>
      </div>
      <table className='table-fixed w-screen'>
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
                name='level'
                placeholder='Level'
                value={sortInputs.level}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='term'
                placeholder='Term'
                value={sortInputs.term}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='teacher'
                placeholder='Teacher LN'
                value={sortInputs.teacher}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='teacher'
                placeholder='Teacher FN'
                value={sortInputs.teacher}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='year'
                placeholder='Year'
                value={sortInputs.year}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='students_count'
                placeholder='Students Count'
                value={sortInputs.students_count}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='online'
                placeholder='Online'
                value={sortInputs.online}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='course'
                placeholder='Course'
                value={sortInputs.course}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='class_number'
                placeholder='Class Number'
                value={sortInputs.class_number}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='title'
                placeholder='Title'
                value={sortInputs.title}
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
        <tbody className='text-sm text-gray-200 divide-y-2 divide-slate-700 leading-9'>
          {getClassrooms()}
        </tbody>
      </table>
    </div>
  )
}
export default ClassroomsMainSection
