import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { editProduct } from '../../features/products/productsSlice'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const EditProductForm = () => {
  const dispatch = useDispatch()
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    cost: '',
    banner: '',
    category: 2,
    level: 3,
    available: false,
    deleted: false,
  })
  const [categories, setCategories] = useState([])
  const [levels, setLevels] = useState([])
  const [initialProductData, setInitialProductData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showMore, setShowMore] = useState(false)
  const [bannerImage, setBannerImage] = useState(null)
  const [bannerImageUrl, setBannerImageUrl] = useState('')
  // Add a state for the features array
  const [features, setFeatures] = useState([{ key: '', values: [''] }])

  const editedId = useParams()
  const id = editedId.productId
  console.log(id)
  const navigate = useNavigate()

  // Login logic
  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const accessToken = Cookies.get('authToken')
      try {
        const response = await axios.get(
          'https://api.ebsalar.com/api/v1/admin/category/?no-paginate=true',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        setCategories(response.data.results)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Fetch levels
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await axios.get(
          'https://api.ebsalar.com/api/v1/front/level/'
        )
        setLevels(response.data.results)
      } catch (error) {
        console.error('Error fetching levels:', error)
      }
    }
    fetchLevels()
  }, [])

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const accessToken = Cookies.get('authToken')
        if (!accessToken) throw new Error('Access token not found')
        const response = await axios.get(
          `https://api.ebsalar.com/api/v1/admin/product/${id}/`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        const fetchedData = {
          banner: response.data.results.banner || '',
          title: response.data.results.title || '',
          description: response.data.results.description || '',
          cost: response.data.results.cost || '',
          category: response.data.results.category || 2,
          level: response.data.results.level || 3,
          available: response.data.results.available || false,
          deleted: response.data.results.deleted || false,
          features: response.data.results.features || {},
        }

        // When converting fetched data to the features array
        const featuresArray = Object.keys(fetchedData.features).map((key) => ({
          key: key,
          values: Array.isArray(fetchedData.features[key])
            ? fetchedData.features[key]
            : [fetchedData.features[key]],
        }))

        setFeatures(featuresArray)

        // After fetching, find the corresponding category ID
        if (categories.length > 0) {
          const categoryFromApi = fetchedData.category
          const matchingCategory = categories.find(
            (c) => c.name === categoryFromApi
          )
          fetchedData.category = matchingCategory ? matchingCategory.id : ''
        }
        // After fetching, find the corresponding level ID
        if (levels.length > 0) {
          const levelFromApi = fetchedData.level
          const matchingLevel = levels.find((c) => c.name === levelFromApi)
          fetchedData.level = matchingLevel ? matchingLevel.id : ''
        }
        setProductData(fetchedData)
        setInitialProductData(fetchedData)
        setBannerImageUrl(fetchedData.banner)
        console.log(response.data)
        setIsLoading(false)
      } catch (error) {
        setError(error.message)
        setIsLoading(false)
      }
    }
    fetchProductData()
  }, [id, categories, levels])

  const handleBannerImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setBannerImage(file)
      // Preview the image
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannerImageUrl(reader.result)
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
        toast.success('عکس پروفایل شما با موفقیت آپلود شد')
        if (uploadResponse.data && uploadResponse.data.results) {
          setProductData({
            ...productData,
            banner: uploadResponse.data.results,
          })
        }
      } catch (error) {
        console.error('Error uploading file:', error)
        toast.error('Failed to upload banner image.')
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setProductData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }))
  }

  const handleCategoryChange = (e) => {
    const { name, value } = e.target
    setProductData((prevData) => ({
      ...prevData,
      [name]: parseInt(value, 10),
    }))
  }

  const handleLevelChange = (e) => {
    const { name, value } = e.target
    setProductData((prevData) => ({
      ...prevData,
      [name]: parseInt(value, 10),
    }))
  }

  // Function to handle change in feature key or values
  const handleFeatureChange = (index, type, value, valueIndex) => {
    setFeatures((currentFeatures) =>
      currentFeatures.map((feature, i) => {
        if (i === index) {
          if (type === 'key') {
            return { ...feature, key: value }
          } else if (type === 'value') {
            // Clone the values array
            const newValues = [...feature.values]
            // Update the specific value
            newValues[valueIndex] = value
            return { ...feature, values: newValues }
          }
        }
        return feature
      })
    )
  }

  // Function to add a new value input to an existing feature key
  const addFeatureValue = (index) => {
    setFeatures((currentFeatures) =>
      currentFeatures.map((feature, i) => {
        if (i === index) {
          // Only add a new value if it's an array
          if (Array.isArray(feature.values)) {
            return { ...feature, values: [...feature.values, ''] }
          } else {
            // If for some reason it's not an array, initialize it as one
            return { ...feature, values: [''] }
          }
        }
        return feature
      })
    )
  }

  const addFeature = () => {
    setFeatures((currentFeatures) => [
      ...currentFeatures,
      { key: '', values: [''] }, // Note that 'values' should be an array since you want multiple values
    ])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let updatedData = {
      ...productData,
      features: {},
    }

    // Convert the features array into an object
    features.forEach((feature) => {
      if (feature.key) {
        updatedData.features[feature.key] = feature.values.filter(Boolean) // filter out empty strings
      }
    })

    try {
      updatedData = Object.keys(updatedData).reduce((acc, key) => {
        if (updatedData[key] !== initialProductData[key]) {
          acc[key] = updatedData[key]
        }
        return acc
      }, {})

      console.log('Submitting product data:', updatedData)
      dispatch(editProduct({ id, updatedData }))
        .unwrap()
        .then(() => {
          toast.success('مشخصات شما با موفقیت بروز رسانی شد', {
            onClose: () => {
              setTimeout(() => {
                navigate('/products')
              }, 2000)
            },
            autoClose: 2000,
          })
        })
        .catch((error) => {
          setError(error)
          console.error('Failed to edit product:', error)
          toast.error('Failed to edit product.')
        })
    } catch (error) {
      console.error('Failed to upload image or edit product:', error)
      setError(error.message)
      toast.error('Failed to upload banner image or edit product.')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className='flex flex-col mx-auto mt-10 justify-center items-center w-[400px] border shadow-lg rounded-lg hover:scale-105 duration-300 bg-white p-2'>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        {/* banner input with grid layout */}
        <div className='mb-4 md:col-span-1'>
          <label
            className='block text-gray-700 text-sm font-bold -mb-7'
            htmlFor='banner'
          >
            عکس پروفایل
          </label>
          <div className='grid grid-cols-2 items-end gap-4'>
            <input
              id='banner'
              type='file'
              name='banner'
              onChange={handleBannerImageChange}
              className='col-span-1 shadow appearance-none border rounded py-2 px-3 -mr-28 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
            {bannerImageUrl && (
              <img
                src={bannerImageUrl}
                alt='banner Preview'
                className='w-20 h-20 ml-28 rounded-md'
              />
            )}
          </div>
        </div>
        {/* Title input */}
        <div className='mb-4'>
          <label
            htmlFor='title'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            Title
          </label>
          <input
            id='title'
            type='text'
            name='title'
            value={productData.title}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required
          />
        </div>
        {/* Description input */}
        <div className='mb-4'>
          <label
            htmlFor='description'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            Description
          </label>
          <input
            id='description'
            type='text'
            name='description'
            value={productData.description}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        {/* cost input */}
        <div className='mb-4'>
          <label
            htmlFor='description'
            className='block text-gray-700 text-sm font-bold mb-2'
          >
            Cost
          </label>
          <input
            id='cost'
            type='text'
            name='cost'
            value={productData.cost}
            onChange={handleInputChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        {/* Category Select input */}
        <select
          name='category'
          value={productData.category}
          onChange={handleCategoryChange}
          className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {/* Level Select input */}
        <div className='mb-4 md:col-span-1'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            پایه
          </label>
          <select
            name='level'
            value={productData.level}
            onChange={handleLevelChange}
            className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          >
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </select>
        </div>
        {/* available product Checkbox */}
        <div className='mb-4 md:col-span-1'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Available
          </label>
          <input
            type='checkbox'
            name='available'
            checked={productData?.available || false}
            onChange={handleInputChange}
            className='mt-1'
          />
        </div>
        {/* deleted product Checkbox */}
        <div className='mb-4 md:col-span-1'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Deleted
          </label>
          <input
            type='checkbox'
            name='deleted'
            checked={productData?.deleted || false}
            onChange={handleInputChange}
            className='mt-1'
          />
        </div>

        {/* features */}
        <div>
          {features.map((feature, index) => (
            <div className='flex flex-col' key={index}>
              <input
                className='text-blue-700 font-extrabold text-xl'
                type='text'
                placeholder='Feature Key'
                value={feature.key}
                onChange={(e) =>
                  handleFeatureChange(index, 'key', e.target.value)
                }
              />
              {feature.values &&
                feature.values.map((value, valueIndex) => (
                  <input
                    className='text-gray-700 '
                    key={valueIndex}
                    type='text'
                    placeholder='Feature Value'
                    value={value}
                    onChange={(e) =>
                      handleFeatureChange(
                        index,
                        'value',
                        e.target.value,
                        valueIndex
                      )
                    }
                  />
                ))}
              <button
                className='bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-2 mb-6 rounded focus:outline-none focus:shadow-outline'
                type='button'
                onClick={() => addFeatureValue(index)}
              >
                Add Value
              </button>
            </div>
          ))}
          <button
            className='bg-purple-500 hover:bg-blue-700 text-white font-bold py-2 px-2 mb-6 rounded focus:outline-none focus:shadow-outline'
            type='button'
            onClick={addFeature}
          >
            Add Feature
          </button>
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

export default EditProductForm
