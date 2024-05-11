import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import {
  deleteDepartment,
  fetchDepartments,
} from '../../features/departments/departmentsSlice'
import { useNavigate } from 'react-router-dom'

const DepartmentsMainSection = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const departments = useSelector((state) => state.departmentsR.entities)
  const isLoading = useSelector((state) => state.departmentsR.isLoading)
  const isError = useSelector((state) => state.departmentsR.isError)
  const [deletedDepartmentIds, setDeletedDepartmentIds] = useState([])

  const [sortInputs, setSortInputs] = useState({
    name: '',
  })
  const [showDeleted, setShowDeleted] = useState(true)

  const toggleShowDeleted = () => {
    setShowDeleted(!showDeleted)
  }

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (accessToken) {
      dispatch(fetchDepartments())
    }
  }, [dispatch])

  if (isLoading) return <div className='text-white'>Loading...</div>
  if (isError) return <div>Error loading departments</div>

  // handle sortning starts here
  const handleSortInputChange = (e) => {
    const { name, value } = e.target
    setSortInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }))
  }
  // handle sortning finishes here

  const getDepartments = () => {
    if (!departments) return []

    return departments
      .filter((department) => {
        if (!showDeleted && department.deleted) return false
        return department?.name?.includes(sortInputs.name || '')
      })
      .map((department, index) => (
        <tr key={department.id} className='text-white text-center'>
          <td>
            {department.deleted ? (
              <button disabled>Deleted</button>
            ) : (
              <button onClick={() => handleDeleteDepartment(department.id)}>
                Delete
              </button>
            )}
          </td>
          <td>
            <button onClick={() => handleEditDepartment(department.id)}>
              Edit
            </button>
          </td>
          <td>{department.name}</td>
          <td>{index + 1}</td>
        </tr>
      ))
  }

  const handleDeleteDepartment = (departmentId) => {
    const isConfirmed = window.confirm('آیا از حذف این دپارتمان مطمعن هستید؟')
    if (isConfirmed) {
      dispatch(deleteDepartment(departmentId)).then((action) => {
        if (deleteDepartment.fulfilled.match(action)) {
          setDeletedDepartmentIds((prevIds) => [...prevIds, departmentId])
        }
      })
    }
  }

  const handleEditDepartment = (departmentId) => {
    navigate(`/edit-department/${departmentId}`)
  }

  const handleAddDepartment = () => {
    navigate('/add-department')
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
          onClick={handleAddDepartment}
        >
          اضافه کردن دپارتمان
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
                placeholder='Delete'
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='edit'
                placeholder='Edit'
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='name'
                placeholder='دپارتمان'
                value={sortInputs.name}
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
        <tbody className='text-sm text-gray-200 divide-y-2 divide-slate-700 leading-9'>{getDepartments()}</tbody>
      </table>
    </div>
  )
}
export default DepartmentsMainSection
