import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { editGalleryFile } from '../../features/galleryFiles/galleryFilesSlice'

const EditGalleryFileForm = () => {
  const dispatch = useDispatch()
  const [galleryFileData, setGalleryFileData] = useState({
    description: '',
    file: '',
  })
  const [fileImage, setFileImage] = useState(null)
  const [fileImageUrl, setFileImageUrl] = useState('')
  const [initialGalleryFileData, setInitialGalleryFileData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const editedId = useParams()
  const id = editedId.galleryFileId
  console.log(id)
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    const fetchGalleryFileData = async () => {
      try {
        const accessToken = Cookies.get('authToken')
        if (!accessToken) throw new Error('Access token not found')
        const response = await axios.get(
          `https://api.ebsalar.com/api/v1/admin/gallery_files/${id}/`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        const fetchedData = {
          description: response.data.results.description || '',
          file: response.data.results.file || '',
        }
        setGalleryFileData(fetchedData)
        setInitialGalleryFileData(fetchedData)
        setFileImageUrl(fetchedData.file)
        console.log(response.data)
        setIsLoading(false)
      } catch (error) {
        setError(error.message)
        setIsLoading(false)
      }
    }
    fetchGalleryFileData()
  }, [id])

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
        toast.success('عکس گالری شما با موفقیت آپلود شد')
        if (uploadResponse.data && uploadResponse.data.results) {
          setGalleryFileData({
            ...galleryFileData,
            file: uploadResponse.data.results,
          })
        }
      } catch (error) {
        console.error('Error uploading file:', error)
        toast.error('Failed to upload file image.')
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setGalleryFileData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let updatedData = { ...galleryFileData }
    try {
      updatedData = Object.keys(updatedData).reduce((acc, key) => {
        if (updatedData[key] !== initialGalleryFileData[key]) {
          acc[key] = updatedData[key]
        }
        return acc
      }, {})

      console.log('Submitting galleryFile data:', updatedData)
      dispatch(editGalleryFile({ id, updatedData }))
        .unwrap()
        .then(() => {
          toast.success('گالری با موفقیت بروز رسانی شد', {
            onClose: () => {
              setTimeout(() => {
                navigate('/galleryfiles')
              }, 1000)
            },
            autoClose: 1000,
          })
        })
        .catch((error) => {
          setError(error)
          console.error('Failed to edit galleryFile:', error)
          toast.error('Failed to edit galleryFile.')
        })
    } catch (error) {
      console.error('Failed to upload image or edit galleryFile:', error)
      setError(error.message)
      toast.error('Failed to upload file image or edit galleryFile.')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div
      className='flex flex-col
 justify-center bg-[#182147] min-h-screen max-w-7xl mx-auto p-5'
    >
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1  gap-4 bg-white p-6 rounded-lg shadow-xl'
      >
        {/* file input with grid layout */}
        <div className='mb-4 md:col-span-1'>
          <label
            className='block text-gray-700 text-sm font-bold -mb-7'
            htmlFor='file'
          >
            ضمیمه فایل
          </label>
          <div className='grid grid-cols-2 items-end gap-4'>
            <input
              id='file'
              type='file'
              name='file'
              onChange={handleFileImageChange}
              className='col-span-1 shadow appearance-none border rounded py-2 px-3 -mr-28 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
            {fileImageUrl && (
              <img
                src={fileImageUrl}
                alt='file Preview'
                className='w-20 h-20 ml-28 rounded-md'
              />
            )}
          </div>
        </div>
        {/* Description input */}
        <div className='mb-4'>
          <label
            htmlFor='description'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            توضیحات
          </label>
          <input
            id='description'
            type='text'
            name='description'
            value={galleryFileData.description}
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

export default EditGalleryFileForm
