import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { editLevel } from '../../features/levels/levelsSlice'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const EditLevelForm = () => {
  const dispatch = useDispatch()
  const [levelData, setLevelData] = useState({
    level: 0,
  })

  const [levels, setLevels] = useState([])
  const [initialLevelData, setInitialLevelData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const editedId = useParams()
  const id = editedId.levelId
  console.log(id)
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        const accessToken = Cookies.get('authToken')
        if (!accessToken) throw new Error('Access token not found')
        const response = await axios.get(
          `https://api.ebsalar.com/api/v1/admin/level/${id}/`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        const fetchedData = {
          name: response.data.results.name || 0,
        }
        setLevelData(fetchedData)
        setInitialLevelData(fetchedData)
        console.log(response.data)
        setIsLoading(false)
      } catch (error) {
        setError(error.message)
        setIsLoading(false)
      }
    }
    fetchLevelData()
  }, [id])

  useEffect(() => {
    const fetchLevels = async () => {
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
      } catch (error) {
        console.log('Error fetching levels:', error)
      }
    }
    fetchLevels()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setLevelData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    let updatedData = { ...levelData }
    try {
      updatedData = Object.keys(updatedData).reduce((acc, key) => {
        if (updatedData[key] !== initialLevelData[key]) {
          acc[key] = updatedData[key]
        }
        return acc
      }, {})

      console.log('Submitting level data:', updatedData)
      dispatch(editLevel({ id, updatedData }))
        .unwrap()
        .then(() => {
          toast.success('مشخصات شما با موفقیت بروز رسانی شد', {
            onClose: () => {
              setTimeout(() => {
                navigate('/levels')
              }, 2000)
            },
            autoClose: 2000,
          })
        })
        .catch((error) => {
          setError(error)
          console.error('Failed to edit level:', error)
          toast.error('Failed to edit level.')
        })
    } catch (error) {
      console.error('Failed to upload image or edit level:', error)
      setError(error.message)
      toast.error('Failed to upload avatar image or edit level.')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div
      className='flex flex-col
 justify-center  min-h-screen items-center bg-slate-800 p-5'
    >
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1  gap-4 bg-gray-200 p-6 rounded-lg shadow-xl'
      >
        {/* level input */}
        <div className='mb-4'>
          <label
            htmlFor='name'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            پایه
          </label>
          <input
            id='name'
            type='text'
            name='name'
            value={levelData.name}
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

export default EditLevelForm
