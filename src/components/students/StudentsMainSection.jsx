import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Cookies from 'js-cookie'
import { MdYoutubeSearchedFor } from "react-icons/md";
import {
  addExcels,
  deleteStudent,
  fetchStudents,
} from '../../features/students/studentsSlice'
import axios from 'axios'
import Modal from 'react-modal'

const StudentsMainSection = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const students = useSelector((state) => state.studentsR.entities)
  const isLoading = useSelector((state) => state.studentsR.isLoading)
  const isError = useSelector((state) => state.studentsR.isError)
  const [deletedStudentIds, setDeletedStudentIds] = useState([])
  const [sortInputs, setSortInputs] = useState({
    level: '',
    nationalNumber: '',
    lastName: '',
    firstName: '',
    phoneNumber: '',
  })
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [excelFileData, setExcelFileData] = useState({
    file: '',
  })
  const [fileImage, setFileImage] = useState(null)
  const [fileImageUrl, setFileImageUrl] = useState('')
  const [showDeleted, setShowDeleted] = useState(true)

  const toggleShowDeleted = () => {
    setShowDeleted(!showDeleted)
  }

  useEffect(() => {
    Modal.setAppElement('#root')
    const accessToken = Cookies.get('authToken')
    if (accessToken) {
      dispatch(fetchStudents())
    }
  }, [dispatch])

  if (isLoading) return <div className='text-white'>Loading...</div>
  if (isError) return <div>Error loading students</div>

  // handle sortning starts here
  const handleSortInputChange = (e) => {
    const { name, value } = e.target
    setSortInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }))
  }
  // handle sortning finishes here

  const getRegisteredStudents = () => {
    if (!students) return []

    return students
      .filter((student) => {
        // If showDeleted is false, filter out the deleted students.
        if (!showDeleted && student.deleted) return false
        return (
          student?.level?.includes(sortInputs.level || '') &&
          student?.national_number?.includes(sortInputs.nationalNumber || '') &&
          student?.last_name?.includes(sortInputs.lastName || '') &&
          student?.first_name?.includes(sortInputs.firstName || '') &&
          student?.phone_number?.includes(sortInputs.phoneNumber || '')
        )
      })
      .map((student, index) => (
        <tr key={student.id} className='text-white text-center'>
          <td>
            {student.deleted ? (
              <button disabled className='text-gray-600'>حذف شده</button>
            ) : (
              <button onClick={() => handleDeleteStudent(student.id)} className='text-red-600'>
                حذف
              </button>
            )}
          </td>
          <td>
            <button  className='text-sm text-blue-400' onClick={() => handleEditStudent(student.id)}>ویرایش</button>
          </td>
          <td>{student.level}</td>
          <td>{student.phone_number}</td>
          <td>{student.national_number}</td>
          <td>{student.last_name}</td>
          <td>{student.first_name}</td>
          <td>{index + 1}</td>
        </tr>
      ))
  }

  const handleDeleteStudent = (studentId) => {
    const isConfirmed = window.confirm('آیا از حذف این دانش آموز مطمعن هستید؟')
    if (isConfirmed) {
      dispatch(deleteStudent(studentId)).then((action) => {
        if (deleteStudent.fulfilled.match(action)) {
          setDeletedStudentIds((prevIds) => [...prevIds, studentId])
        }
      })
    }
  }

  const handleEditStudent = (studentId) => {
    navigate(`/edit-student/${studentId}`)
  }

  const handleRegisterOnsite = () => {
    navigate('/register-student-onsite')
  }

  const handleFileImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setFileImage(file)
      // Preview the image
      const reader = new FileReader()
      reader.onloadend = () => {
        setFileImageUrl(reader.result)
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
        toast.success('فایل با موفقیت آپلود شد')
        if (uploadResponse.data && uploadResponse.data.results) {
          setExcelFileData({
            ...excelFileData,
            file: uploadResponse.data.results,
          })
        }
      } catch (error) {
        console.error('Error uploading file:', error)
        toast.error('Failed to upload file image.')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Prepare the excelFile data for submission
    const newExcelFileData = {
      file: excelFileData.file,
    }
    // Dispatch the addExcels action
    dispatch(addExcels(newExcelFileData))
      .unwrap()
      .then((response) => {
        const message = response.results
        toast.success(message, {
          onClose: () => {
            setModalIsOpen(false) // Close the modal
            dispatch(fetchStudents()) // Re-fetch the student list
          },
          autoClose: 2000, // This is the time after which the onClose event will fire
        })
      })
      .catch((error) => {
        const message =
          error.response?.data?.results ||
          `Registration failed: ${error.message || 'Error occurred'}`
        toast.error(message)
      })
  }

  return (
    <div className='h-full w-full mt-10 '>
      <ToastContainer />
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
          onClick={() => setModalIsOpen(true)}
        >
          ثبت نام با اکسل
        </button>
        {/* Modal for Excel File Upload */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel='Excel File Upload'
          className='fixed mx-auto inset-0 flex items-center justify-center p-5 z-50'
          overlayClassName='fixed inset-0 bg-black bg-opacity-75'
          style={{ content: { width: '400px', height: '400px' } }}
        >
          <form
            onSubmit={handleSubmit}
            className='flex flex-col w-[480px] bg-white p-6 rounded-lg shadow-xl'
          >
            <h1 className='mb-4  text-md w-full text-center border-b-2 py-2  border-gray-600'>اضافه کردن فایل اکسل</h1>
            {/* file input */}
            <div className='mb-4 flex flex-row justify-center'>
              <input
                id='file'
                type='file'
                name='file'
                onChange={handleFileImageChange}
                className='shadow appearance-none border rounded py-2 px-4 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              />
              {fileImageUrl && (
                <img
                  src={fileImageUrl}
                  alt='file Preview'
                  className='w-20 h-20 ml-28 rounded-md'
                />
              )}
            </div>
            {/* Save Changes Button */}
            <button
              type='submit'
              className='bg-blue-500 hover:bg-blue-700 text-white text-sm  py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            >
               CSV--ثبت نام با اکسل
            </button>
          </form>
        </Modal>
        <button
          className='bg-cyan-600 rounded-md mb-2 px-4 text-white text-sm py-2 mr-4'
          onClick={handleRegisterOnsite}
        >
          ثبت نام حضوری
        </button>
      </div>
      <table className='table-fixed w-full'>
        <thead>
          <tr className='text-white text-center  bg-slate-800'>
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
                placeholder='پایه'
                value={sortInputs.level}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='phoneNumber'
                placeholder=' تلفن '
                value={sortInputs.phoneNumber}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='nationalNumber'
                placeholder='جستجو کد ملی'
                value={sortInputs.nationalNumber}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='lastName'
                placeholder='جستجو نام خانوادگی'
                value={sortInputs.lastName}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='firstName'
                placeholder='جستجو  نام'
                value={sortInputs.firstName}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-x-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='theRow'
                placeholder='ردیف'
              />
            </th>
          </tr>
        </thead>
        <tbody className='text-sm text-gray-200 divide-y-2 divide-slate-700 leading-9'>{getRegisteredStudents()}</tbody>
      </table>
    </div>
  )
}
export default StudentsMainSection
