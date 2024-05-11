import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { editSub } from '../../features/submenus/submenusSlice'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import './ckeditor.css'

const EditDpageForm = () => {
  const dispatch = useDispatch()
  const [submenuData, setSubmenuData] = useState({
    description: '',
    logo: '',
  })
  const [logoImage, setLogoImage] = useState(null)
  const [logoImageUrl, setLogoImageUrl] = useState('')
  const [initialSubmenuData, setInitialSubmenuData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')

  const editedId = useParams()
  const id = editedId.menuId
  console.log(id)
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    const fetchSubmenuData = async () => {
      try {
        const accessToken = Cookies.get('authToken')
        if (!accessToken) throw new Error('Access token not found')
        const response = await axios.get(
          `https://api.ebsalar.com/api/v1/admin/sub_menu/${id}/`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        const fetchedData = {
          description: response.data.results.description || '',
          logo: response.data.results.logo || '',
        }
        setSubmenuData(fetchedData)
        setInitialSubmenuData(fetchedData)
        setLogoImageUrl(fetchedData.logo)
        setUploadedImageUrl(fetchedData.logo)
        console.log(response.data)
        setIsLoading(false)
      } catch (error) {
        setError(error.message)
        setIsLoading(false)
      }
    }
    fetchSubmenuData()
  }, [id])

  class CKEditorImageUploadAdapter {
    constructor(loader) {
      // The file loader instance to use during the upload.
      this.loader = loader
    }

    // Starts the upload process.
    upload() {
      return this.loader.file.then(
        (file) =>
          new Promise((resolve, reject) => {
            const formData = new FormData()
            formData.append('file', file)

            const accessToken = Cookies.get('authToken')
            if (!accessToken) {
              // Handle the error of missing access token if necessary
              reject('Authentication token not found. Please log in.')
              return
            }

            axios
              .post('https://api.ebsalar.com/api/v1/media/', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${accessToken}`,
                },
              })
              .then((response) => {
                // Assume the server responds with the URL to the uploaded image in 'response.data.results'
                resolve({
                  default: response.data.results,
                })
              })
              .catch((error) => {
                console.error('Error uploading file:', error)
                reject('Could not upload image.')
              })
          })
      )
    }

    // Aborts the upload process.
    abort() {
      // Rejects the promise returned from the upload() method.
      // Usually, you should call some API that aborts the upload.
    }
  }

  function CKEditorImageUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new CKEditorImageUploadAdapter(loader)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setSubmenuData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let updatedData = { ...submenuData }
    try {
      updatedData = Object.keys(updatedData).reduce((acc, key) => {
        if (updatedData[key] !== initialSubmenuData[key]) {
          acc[key] = updatedData[key]
        }
        return acc
      }, {})

      console.log('Submitting menu data:', updatedData)
      dispatch(editSub({ id, updatedData }))
        .unwrap()
        .then(() => {
          toast.success('  صفحه داینلمیک با موفقیت بروز رسانی شد ', {
            onClose: () => {
              setTimeout(() => {
                navigate('/dpages')
              }, 2000)
            },
            autoClose: 2000,
          })
        })
        .catch((error) => {
          setError(error)
          console.error('Failed to edit menu:', error)
          toast.error('Failed to edit menu.')
        })
    } catch (error) {
      console.error('Failed to upload image or edit menu:', error)
      setError(error.message)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div
      className='flex flex-col
 justify-center h-screen max-w-7xl mx-auto p-5'
    >
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-xl'
      >
        <CKEditor
          editor={ClassicEditor}
          config={{
            extraPlugins: [CKEditorImageUploadAdapterPlugin],
            // ... other configurations
          }}
          data={submenuData.description}
          onChange={(event, editor) => {
            const data = editor.getData()
            setSubmenuData({ ...submenuData, description: data })
          }}
        />
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

export default EditDpageForm
