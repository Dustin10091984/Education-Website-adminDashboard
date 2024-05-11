import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { fetchProducts } from '../../features/products/productsSlice'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { MdDelete } from 'react-icons/md'

const AddOrder = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const products = useSelector((state) => state.productsR.entities)
  const isLoading = useSelector((state) => state.productsR.isLoading)
  const isError = useSelector((state) => state.productsR.isError)

  const [sortInputs, setSortInputs] = useState({
    name: '',
  })
  const [phoneNumber, setPhoneNumber] = useState('')
  const [selectedProducts, setSelectedProducts] = useState([])

  const handleQuantityChange = (product, quantity) => {
    const validatedQuantity = Math.max(0, Number(quantity)) // Ensure quantity isn't negative and is a number

    setSelectedProducts((prevSelectedProducts) => {
      const productIndex = prevSelectedProducts.findIndex(
        (p) => p.id === product.id
      )

      if (productIndex >= 0) {
        // If the product already exists in the array
        if (validatedQuantity > 0) {
          // Update quantity
          return prevSelectedProducts.map((p, index) =>
            index === productIndex ? { ...p, quantity: validatedQuantity } : p
          )
        } else {
          // Remove product when quantity is 0
          return prevSelectedProducts.filter(
            (p, index) => index !== productIndex
          )
        }
      } else if (validatedQuantity > 0) {
        // Add new product with quantity more than 0
        return [
          ...prevSelectedProducts,
          { ...product, quantity: validatedQuantity },
        ]
      }
      // If quantity is 0, don't add the product
      return prevSelectedProducts
    })
  }

  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.filter((product) => product.id !== productId)
    )
  }
  // Function to determine if the URL is valid for an image
  const isValidHttpUrl = (string) => {
    let url
    try {
      url = new URL(string)
    } catch (_) {
      return false
    }

    return url.protocol === 'http:' || url.protocol === 'https:'
  }

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (accessToken) {
      dispatch(fetchProducts())
    }
  }, [dispatch])

  if (isLoading) return <div className='text-white'>Loading...</div>
  if (isError) return <div>Error loading products</div>

  // handle sortning starts here
  const handleSortInputChange = (e) => {
    const { name, value } = e.target
    setSortInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }))
  }
  // handle sortning finishes here

  // Function to render the selected products in the top table
  const getProducts = () => {
    if (!products) return []

    return products
      .filter((product) => {
        return product?.title?.includes(sortInputs.name || '')
      })
      .slice(0, 3) // Limit the array to 3 products in the top table
      .map((product, index) => {
        // Find the product in the selectedProducts array to bind its quantity
        const selectedProduct = selectedProducts.find(
          (p) => p.id === product.id
        )
        return (
          <tr key={product.id} className='text-white text-center'>
            <div>
              <td>
                {isValidHttpUrl(product.banner) ? (
                  <img
                    src={product.banner}
                    alt={product.banner.title}
                    className='w-20 h-20 ml-20 mt-2 object-cover rounded'
                  />
                ) : (
                  <span className='text-slate-700 ml-20 mt-2 flex items-center justify-center w-20 h-20 rounded bg-slate-300'>
                    No Image
                  </span>
                )}
              </td>
            </div>
            <td>
              <input
                className='text-slate-700'
                type='number'
                placeholder='quantity'
                value={selectedProduct ? selectedProduct.quantity : 0}
                onChange={(e) => handleQuantityChange(product, e.target.value)}
              />
            </td>
            <td className='text-slate-700'>{product.cost}</td>
            <td className='text-slate-700'>{product.title}</td>
            <td className='text-slate-700'>{product.id}</td>
          </tr>
        )
      })
  }

  // Function to render the selected products in the bottom table
  const renderSelectedProducts = () => {
    return selectedProducts.map((product, index) => (
      <tr key={product.id} className='text-white text-center'>
        <div>
          <td>
            <button
              onClick={() => handleRemoveProduct(product.id)}
              className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
            >
              <MdDelete />
            </button>
          </td>
          <td>
            {isValidHttpUrl(product.banner) ? (
              <img
                src={product.banner}
                alt={product.banner.title}
                className='w-20 h-20 ml-2 mt-2 object-cover rounded'
              />
            ) : (
              <span className='text-slate-700 ml-2 mt-2 flex items-center justify-center w-20 h-20 rounded bg-slate-300'>
                No Image
              </span>
            )}
          </td>
        </div>
        <td>
          <input
            className='text-slate-700'
            type='number'
            placeholder='quantity'
            value={product.quantity} // Bind the input value to the product quantity
            onChange={(e) => handleQuantityChange(product, e.target.value)}
          />
        </td>
        <td className='text-slate-700'>{product.cost}</td>
        <td className='text-slate-700'>{product.title}</td>
        <td className='text-slate-700'>{product.id}</td>
      </tr>
    ))
  }

  const handleSubmitOrder = async () => {
    const orderData = {
      phone_number: phoneNumber,
      products: selectedProducts.map((p) => ({
        product: p.id,
        quantity: p.quantity,
      })),
    }

    try {
      const accessToken = Cookies.get('authToken')
      const response = await axios.post(
        'https://api.ebsalar.com/api/v1/admin/orders/',
        orderData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (response.status === 400) {
        return alert('status is 400')
      }
      if (phoneNumber) {
        toast.success('Order submitted successfully.', {
          onClose: () => {
            setTimeout(() => {
              navigate('/orders')
            }, 2000)
          },
          autoClose: 2000,
        })
      } else {
        toast.error('Enter phone number')
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('Please enter a correct phone number.')
      }
      // toast.error(
      //   `Order submission failed ${error.message || 'Error occurred'}`
      // )
    }
  }

  return (
    <div>
      <ToastContainer />
      <div className='h-full w-[90%] mt-[30px] mx-auto pb-2 shadow-xl ounded-lg'>
        <table className='table-fixed w-full'>
          <thead>
            <tr className='text-white text-center bg-slate-800'>
              <th>
                <input
                  className='bg-slate-800 w-[100px]'
                  type='text'
                  name='image'
                  placeholder='image'
                />
              </th>
              <th>
                <input
                  className='bg-slate-800 w-[100px]'
                  type='text'
                  name='quantity'
                  placeholder='quantity'
                />
              </th>
              <th>
                <input
                  className='bg-slate-800 w-[100px]'
                  type='text'
                  name='price'
                  placeholder='price'
                />
              </th>

              <th>
                <input
                  className='bg-slate-800 w-[100px]'
                  type='text'
                  name='name'
                  placeholder='product name'
                  value={sortInputs.name}
                  onChange={handleSortInputChange}
                />
              </th>
              <th>
                <input
                  className='bg-slate-800 w-[100px]'
                  type='text'
                  name='id'
                  placeholder='product id'
                />
              </th>
            </tr>
          </thead>
          <tbody>{getProducts()}</tbody>
        </table>
      </div>
      <div className='h-full w-[90%] mt-[30px] mx-auto pb-2 shadow-xl ounded-lg'>
        <table className='table-fixed w-full'>
          <thead>
            <tr className='text-white text-center bg-slate-800'>
              <th>
                <input
                  className='bg-slate-800 w-[100px]'
                  type='text'
                  name='image'
                  placeholder='image'
                />
              </th>
              <th>
                <input
                  className='bg-slate-800 w-[100px]'
                  type='text'
                  name='quantity'
                  placeholder='quantity'
                />
              </th>
              <th>
                <input
                  className='bg-slate-800 w-[100px]'
                  type='text'
                  name='price'
                  placeholder='price'
                />
              </th>

              <th>
                <input
                  className='bg-slate-800 w-[100px]'
                  type='text'
                  name='name'
                  placeholder='product name'
                />
              </th>
              <th>
                <input
                  className='bg-slate-800 w-[100px]'
                  type='text'
                  name='id'
                  placeholder='product id'
                />
              </th>
            </tr>
          </thead>
          <tbody>{renderSelectedProducts()}</tbody>
        </table>
      </div>
      <div className='mt-10 w-40 mx-auto'>
        <input
          required
          type='text'
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder='Enter phone number'
        />
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={handleSubmitOrder}
        >
          Submit Order
        </button>
      </div>
    </div>
  )
}
export default AddOrder
