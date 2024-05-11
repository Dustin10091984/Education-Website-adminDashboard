import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { editDepartment } from '../../features/departments/departmentsSlice'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const EditDepartmentForm = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  const dispatch = useDispatch()
  const [departmentData, setDepartmentData] = useState({
    department: 0,
  })

  const [departments, setDepartments] = useState([])
  const [initialDepartmentData, setInitialDepartmentData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const editedId = useParams()
  const id = editedId.departmentId
  console.log(id)

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        const accessToken = Cookies.get('authToken')
        if (!accessToken) throw new Error('Access token not found')
        const response = await axios.get(
          `https://api.ebsalar.com/api/v1/admin/department/${id}/`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        const fetchedData = {
          name: response.data.results.name || 0,
        }
        setDepartmentData(fetchedData)
        setInitialDepartmentData(fetchedData)
        console.log(response.data)
        setIsLoading(false)
      } catch (error) {
        setError(error.message)
        setIsLoading(false)
      }
    }
    fetchDepartmentData()
  }, [id])

  useEffect(() => {
    const fetchDepartments = async () => {
      const accessToken = Cookies.get('authToken')
      if (!accessToken) {
        toast.error('Authentication token not found. Please log in.')
        return
      }
      try {
        const response = await axios.get(
          'https://api.ebsalar.com/api/v1/admin/department/',
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        setDepartments(response.data.results)
      } catch (error) {
        console.log('Error fetching departments:', error)
      }
    }
    fetchDepartments()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setDepartmentData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    let updatedData = { ...departmentData }
    try {
      updatedData = Object.keys(updatedData).reduce((acc, key) => {
        if (updatedData[key] !== initialDepartmentData[key]) {
          acc[key] = updatedData[key]
        }
        return acc
      }, {})

      console.log('Submitting department data:', updatedData)
      dispatch(editDepartment({ id, updatedData }))
        .unwrap()
        .then(() => {
          toast.success('مشخصات شما با موفقیت بروز رسانی شد', {
            onClose: () => {
              setTimeout(() => {
                navigate('/departments')
              }, 2000)
            },
            autoClose: 2000,
          })
        })
        .catch((error) => {
          setError(error)
          console.error('Failed to edit department:', error)
          toast.error('Failed to edit department.')
        })
    } catch (error) {
      console.error('Failed to upload image or edit department:', error)
      setError(error.message)
      toast.error('Failed to upload avatar image or edit department.')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className='flex flex-col justify-center h-screen max-w-[500px] mx-auto p-5'>
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-xl'
      >
        {/* Department input */}
        <div className='mb-4'>
          <label
            htmlFor='name'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            دپارتمان
          </label>
          <input
            id='name'
            type='text'
            name='name'
            value={departmentData.name}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
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

export default EditDepartmentForm
