import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { addLevel } from '../../features/levels/levelsSlice'
import Cookies from 'js-cookie'

const AddLevel = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [levelData, setLevelData] = useState({
    level: 0,
  })

  useEffect(() => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      navigate('/login')
    }
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
    // Prepare the level data for submission
    const newLevelData = {
      name: levelData.name,
    }
    // Dispatch the addlevel action
    dispatch(addLevel(newLevelData))
      .unwrap()
      .then((newLevelData) => {
        toast.success('levels details updated successfully.', {
          onClose: () => {
            setTimeout(() => {
              navigate('/levels')
            }, 2000)
          },
          autoClose: 2000,
        })
      })
      .catch((error) => {
        toast.error(`Registration failed: ${error.message || 'Error occurred'}`)
      })
  }

  return (
    <div className='flex flex-col justify-center h-screen  max-w-[500px] mx-auto p-5'>
      <h1>اضافه کردن پایه</h1>
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-xl'
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
            اضافه کردن پایه
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddLevel
