import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { addProduct } from '../../features/products/productsSlice'

const AddProduct = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    cost: '',
    banner: '',
    category: 2,
    level: 3,
    available: false,
  })
  const [bannerImage, setBannerImage] = useState(null)
  const [bannerImageUrl, setBannerImageUrl] = useState('')
  const [categories, setCategories] = useState([])
  const [levels, setLevels] = useState([])
  const [features, setFeatures] = useState([{ key: '', values: [''] }])

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
        toast.success('image uploaded successfully')
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

  // Login logic
  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  //   Fetch categories
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

  // Fetch levels starts here
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setProductData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }))
  }

  const handleFeatureKeyChange = (index, value) => {
    setFeatures((currentFeatures) =>
      currentFeatures.map((feature, i) =>
        i === index ? { ...feature, key: value } : feature
      )
    )
  }

  const handleFeatureValueChange = (index, valueIndex, value) => {
    setFeatures((currentFeatures) =>
      currentFeatures.map((feature, i) =>
        i === index
          ? {
              ...feature,
              values: feature.values.map((val, j) =>
                j === valueIndex ? value : val
              ),
            }
          : feature
      )
    )
  }

  const addFeature = () => {
    setFeatures((currentFeatures) => [
      ...currentFeatures,
      { key: '', values: [''] },
    ])
  }

  const addFeatureValue = (index) => {
    setFeatures((currentFeatures) =>
      currentFeatures.map((feature, i) =>
        i === index ? { ...feature, values: [...feature.values, ''] } : feature
      )
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Convert features array to an object where each key has an array of values
    const featuresObject = features.reduce((obj, feature) => {
      if (feature.key && feature.values.some((val) => val.trim() !== '')) {
        // Only add the key if it's not empty and at least one value is non-empty
        obj[feature.key] = feature.values.filter((val) => val.trim() !== '')
      }
      return obj
    }, {})

    // Prepare the product data for submission
    const newProductData = {
      title: productData.title,
      description: productData.description,
      cost: productData.cost,
      banner: productData.banner,
      category: productData.category,
      level: productData.level,
      available: productData.available,
      features: featuresObject,
    }

    // Dispatch the addProduct action
    dispatch(addProduct(newProductData))
      .unwrap()
      .then((newProductData) => {
        toast.success('products details updated successfully.', {
          onClose: () => {
            setTimeout(() => {
              navigate('/products')
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
    <div className='flex flex-col mx-auto mt-10 justify-center items-center w-[480px] border shadow-lg rounded-lg hover:scale-105 duration-300 bg-white p-2'>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        {/* banner input  */}
        <div className='mb-4 flex  md:col-span-1'>
          <label
            className='block text-gray-700 text-sm font-bold -mb-7'
            htmlFor='banner'
          >
            image
          </label>
          <div className='grid grid-cols-2 ml-4 items-end gap-4'>
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
            نام
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
        {/* cost input */}
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
        {/* Available product Checkbox */}
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
        {/* Features section */}
        {features.map((feature, index) => (
          <div key={index}>
            <input
              type='text'
              placeholder='Feature Key'
              value={feature.key}
              onChange={(e) => handleFeatureKeyChange(index, e.target.value)}
            />
            {feature.values.map((value, valueIndex) => (
              <input
                key={valueIndex}
                type='text'
                placeholder='Feature Value'
                value={value}
                onChange={(e) =>
                  handleFeatureValueChange(index, valueIndex, e.target.value)
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
          className='bg-purple-500  hover:bg-blue-700 text-white font-bold py-2 px-2 mb-6 rounded focus:outline-none focus:shadow-outline'
          type='button'
          onClick={addFeature}
        >
          Add Feature
        </button>
        {/* Save Changes Button */}
        <div className='mb-4 md:col-span-1 flex justify-start'>
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          >
            Add product
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddProduct
