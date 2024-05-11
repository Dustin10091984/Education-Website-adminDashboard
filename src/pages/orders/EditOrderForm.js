import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { editOrder } from '../../features/orders/ordersSlice'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const EditOrderForm = () => {
  const dispatch = useDispatch()
  const [orderData, setOrderData] = useState({
    id: '',
    user: '',
    status: '',
    created_at: '',
    total_price: '',
  })

  const [orderItems, setOrderItems] = useState([])

  const [initialOrderData, setInitialOrderData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const editedId = useParams()
  const id = editedId.orderId
  console.log(id)
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const accessToken = Cookies.get('authToken')
        if (!accessToken) throw new Error('Access token not found')
        const response = await axios.get(
          `https://api.ebsalar.com/api/v1/admin/orders/${id}/`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        const fetchedData = {
          id: response.data.results.id,
          first_name: response.data.results.user?.first_name || '',
          last_name: response.data.results.user?.last_name || '',
          national_number: response.data.results.user?.national_number || '',
          status: response.data.results.status || 'p',
          created_at: response.data.results.created_at,
          total_price: response.data.results.total_price,
        }
        setOrderData(fetchedData)
        setInitialOrderData(fetchedData)
        // console.log(response.data)
        setIsLoading(false)
      } catch (error) {
        setError(error.message)
        setIsLoading(false)
      }
    }
    fetchOrderData()
  }, [id])

  useEffect(() => {
    const fetchOrderItems = async () => {
      try {
        const accessToken = Cookies.get('authToken')
        if (!accessToken) throw new Error('Access token not found')
        const response = await axios.get(
          `https://api.ebsalar.com/api/v1/admin/order_items/order/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        setOrderItems(response.data.results)
      } catch (error) {
        console.log(error)
      }
    }
    fetchOrderItems()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setOrderData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let updatedData = { ...orderData }
    try {
      updatedData = Object.keys(updatedData).reduce((acc, key) => {
        if (updatedData[key] !== initialOrderData[key]) {
          acc[key] = updatedData[key]
        }
        return acc
      }, {})

      console.log('Submitting order data:', updatedData)
      dispatch(editOrder({ id, updatedData }))
        .unwrap()
        .then(() => {
          toast.success(' سفارش با موفقیت بروز رسانی شد', {
            onClose: () => {
              setTimeout(() => {
                navigate('/orders')
              }, 2000)
            },
            autoClose: 2000,
          })
        })
        .catch((error) => {
          setError(error)
          console.error('Failed to edit order:', error)
          toast.error('Failed to edit order.')
        })
    } catch (error) {
      console.error('Failed to upload image or edit order:', error)
      setError(error.message)
      toast.error('Failed to upload avatar image or edit order.')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className='flex flex-col justify-center items-center h-screen '>
      <ToastContainer />
      <div className='w-full max-w-xl p-6 rounded-lg shadow-xl mb-8'>
        <h2 className='block text-blue-700 text-lg font-bold mb-2'>
          Order Detail
        </h2>
        <p>Order Number: {orderData.id}</p>
        <p>First Name: {orderData.first_name || ''} </p>
        <p>Last Name: {orderData.last_name}</p>
        <p>National Number: {orderData.national_number}</p>
        <p>Status: {orderData.status}</p>
        <p>created at: {orderData.created_at}</p>
        <p>Total Price: {orderData.total_price}</p>
      </div>
      <div className='w-full max-w-xl p-6 rounded-lg shadow-xl mb-8'>
        <h2 className='block text-blue-700 text-lg font-bold mb-2'>Items</h2>
        <div className='flex justify-center gap-8'>
          {orderItems.map((item, index) => (
            <div
              className='border shadow-lg rounded-lg hover:scale-105 duration-300 bg-white p-2'
              key={index}
            >
              <p>Title: {item.product.title}</p>
              <p>Price Each: {item.price_each}</p>
              <p>Quantity: {item.quantity}</p>
              <img
                className='w-40 border rounded'
                src={item.product.banner}
                alt='banner'
              />
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  item.product.available
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {item.product.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          ))}
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-xl p-6 rounded-lg shadow-xl'
      >
        {/* Status input */}
        <div className='mb-4 md:col-span-1'>
          <h2 className='block text-blue-700 text-lg font-bold mb-2'>Status</h2>
          <div>
            <label htmlFor='payed' className='inline-flex items-center mr-6'>
              <input
                id='payed'
                type='radio'
                name='status'
                value='p'
                checked={orderData.status === 'p'}
                onChange={handleInputChange}
                className='form-radio'
              />
              <span className='ml-2'>Payed</span>
            </label>
            <label htmlFor='pending' className='inline-flex items-center mr-6'>
              <input
                id='pending'
                type='radio'
                name='status'
                value='e'
                checked={orderData.status === 'e'}
                onChange={handleInputChange}
                className='form-radio'
              />
              <span className='ml-2'>Pending</span>
            </label>
            <label htmlFor='failed' className='inline-flex items-center mr-6'>
              <input
                id='failed'
                type='radio'
                name='status'
                value='f'
                checked={orderData.status === 'f'}
                onChange={handleInputChange}
                className='form-radio'
              />
              <span className='ml-2'>Failed</span>
            </label>
            <label
              htmlFor='submitted'
              className='inline-flex items-center mr-6'
            >
              <input
                id='submitted'
                type='radio'
                name='status'
                value='s'
                checked={orderData.status === 's'}
                onChange={handleInputChange}
                className='form-radio'
              />
              <span className='ml-2'>Submitted</span>
            </label>
            <label htmlFor='cancel' className='inline-flex items-center'>
              <input
                id='cancel'
                type='radio'
                name='status'
                value='c'
                checked={orderData.status === 'c'}
                onChange={handleInputChange}
                className='form-radio'
              />
              <span className='ml-2'>Cancel</span>
            </label>
          </div>
        </div>
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

export default EditOrderForm
