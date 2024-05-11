import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { deleteStaff, fetchStaffs } from '../../features/staffs/staffsSlice'
import { useNavigate } from 'react-router-dom'

const StaffsMainSection = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const staffs = useSelector((state) => state.staffsR.entities)
  const isLoading = useSelector((state) => state.staffsR.isLoading)
  const isError = useSelector((state) => state.staffsR.isError)
  const [deletedStaffIds, setDeletedStaffIds] = useState([])
  const [sortInputs, setSortInputs] = useState({
    nationalNumber: '',
    lastName: '',
    firstName: '',
  })
  const [showDeleted, setShowDeleted] = useState(true)

  const toggleShowDeleted = () => {
    setShowDeleted(!showDeleted)
  }

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (accessToken) {
      dispatch(fetchStaffs())
    }
  }, [dispatch])

  if (isLoading) return <div className='text-white'>Loading...</div>
  if (isError) return <div>Error loading staffs</div>

  // handle sortning starts here
  const handleSortInputChange = (e) => {
    const { name, value } = e.target
    setSortInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }))
  }
  // handle sortning finishes here

  const getStaffs = () => {
    if (!staffs) return []

    return staffs
      .filter((staff) => {
        if (!showDeleted && staff.deleted) return false
        return (
          staff?.national_number?.includes(sortInputs.nationalNumber || '') &&
          staff?.last_name?.includes(sortInputs.lastName || '') &&
          staff?.first_name?.includes(sortInputs.firstName || '')
        )
      })
      .map((staff, index) => (
        <tr key={staff.id} className='text-white text-center'>
          <td>
            {staff.deleted ? (
              <button disabled>Deleted</button>
            ) : (
              <button onClick={() => handleDeleteStaff(staff.id)}>
                Delete
              </button>
            )}
          </td>
          <td>
            <button onClick={() => handleEditStaff(staff.id)}>Edit</button>
          </td>
          <td>{staff.national_number}</td>
          <td>{staff.last_name}</td>
          <td>{staff.first_name}</td>
          <td>{index + 1}</td>
        </tr>
      ))
  }

  const handleDeleteStaff = (staffId) => {
    const isConfirmed = window.confirm('آیا از حذف این کارمند مطمعن هستید؟')
    if (isConfirmed) {
      dispatch(deleteStaff(staffId)).then((action) => {
        if (deleteStaff.fulfilled.match(action)) {
          setDeletedStaffIds((prevIds) => [...prevIds, staffId])
        }
      })
    }
  }

  const handleEditStaff = (staffId) => {
    navigate(`/edit-staff/${staffId}`)
  }

  const handleRegisterOnsite = () => {
    navigate('/register-staff-onsite')
  }

  return (
    <div className='h-full w-full mt-[10px] '>
      <div className='flex flex-row justify-end space-x-2 -mt-8 mb-2'>
        {/* New "Hide Deleted" button */}
        <button
              className='bg-blue-500 hover:bg-blue-700 text-white text-sm  py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              onClick={toggleShowDeleted}
        >
          {showDeleted ? 'Hide Deleted' : 'Show Deleted'}
        </button>
        <button
                       className='bg-blue-500 hover:bg-blue-700 text-white text-sm  py-2 px-4 rounded focus:outline-none focus:shadow-outline'

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
        <tbody className='text-sm text-gray-200 divide-y-2 divide-slate-700 leading-9'>{getStaffs()}</tbody>
      </table>
    </div>
  )
}
export default StaffsMainSection
