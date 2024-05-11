import { useState } from 'react'
import { MdDetails } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const AdminDashboardMainSection = ({
  requestedStudents,
  setRequestedStudents,
}) => {
  const navigate = useNavigate()

  const [sortInputs, setSortInputs] = useState({
    level: '',
    nationalNumber: '',
    lastName: '',
    firstName: '',
  })

  const handleSortInputChange = (e) => {
    const { name, value } = e.target
    setSortInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }))
  }

  const handleDetailClick = (studentId) => {
    navigate(`/requested-student-detail/${studentId}`)
    console.log('detail:', studentId)
  }

  const getRequestedStudents = () => {
    return requestedStudents
      .filter((requestedStudent) => {
        return (
          requestedStudent.national_number.includes(
            sortInputs.nationalNumber
          ) &&
          requestedStudent.last_name.includes(sortInputs.lastName) &&
          requestedStudent.first_name.includes(sortInputs.firstName)
        )
      })
      .map((requestedStudent, index) => (
        <tr key={requestedStudent.id} className='text-white text-center'>
          <td>
            <button onClick={() => handleDetailClick(requestedStudent.id)}>
              <MdDetails />
            </button>
          </td>
          <td>{requestedStudent.level}</td>
          <td>{requestedStudent.national_number}</td>
          <td>{requestedStudent.last_name}</td>
          <td>{requestedStudent.first_name}</td>
          <td>{index + 1}</td>
        </tr>
      ))
  }

  const handleRegisterOnsite = () => {
    navigate('/register-student-onsite')
  }

  return (
    <div className=' w-full px-24  '>
      <div className='flex flex-row justify-end '>
        <button
          className='bg-cyan-600 rounded-md mb-2 px-4 text-white text-sm py-2 mr-4'
          onClick={handleRegisterOnsite}
        >
          ثبت نام حضوری
        </button>
      </div>
      <table className='table-fixed  w-full'>
        <thead>
          <tr className='text-white text-center   bg-slate-800'>
            <th className='flex w-24 justify-center py-2 border-r-2 border-gray-700'>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='prove'
                placeholder='جزئیات'
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='level'
                placeholder='پایه'
                value={sortInputs.level}
                onChange={handleSortInputChange}
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
                name='firstName'
                placeholder='ردیف'
              />
            </th>
          </tr>
        </thead>
        <tbody className='text-sm text-gray-200 divide-y-2 divide-slate-700 leading-9'>{getRequestedStudents()}</tbody>
      </table>
    </div>
  )
}

export default AdminDashboardMainSection
