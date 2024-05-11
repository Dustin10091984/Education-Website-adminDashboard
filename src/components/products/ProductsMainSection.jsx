import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { FcInfo } from "react-icons/fc";
import {
  deleteProduct,
  fetchProducts,
} from '../../features/products/productsSlice'
import { useNavigate } from 'react-router-dom'
import { MdOutlineSettings, MdDeleteForever } from 'react-icons/md'

const ProductsMainSection = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const products = useSelector((state) => state.productsR.entities)
  const isLoading = useSelector((state) => state.productsR.isLoading)
  const isError = useSelector((state) => state.productsR.isError)
  const [deletedProductIds, setDeletedProductIds] = useState([])

  const [sortInputs, setSortInputs] = useState({
    name: '',
  })
  const [showDeleted, setShowDeleted] = useState(true)

  const toggleShowDeleted = () => {
    setShowDeleted(!showDeleted)
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

  const getProducts = () => {
    if (!products) return []

    return products
      .filter((product) => {
        if (!showDeleted && product.deleted) return false
        return product?.title?.includes(sortInputs.name || '')
      })
      .map((product, index) => (
        <tr key={product.id} className='text-white text-center'>
          <td>
            <button className=' flex justify-center items-center w-full' onClick={() => handleEditProduct(product.id)}>
              <FcInfo className='text-xl' />
            </button>
          </td>
          <td>
            {product.deleted ? (
              <button className='text-gray-600' disabled>Deleted</button>
            ) : (
              <button className='text-xl flex justify-center items-center w-full text-rose-500' onClick={() => handleDeleteProduct(product.id)}>
               <MdDeleteForever />
              </button>
            )}
          </td>
          <td>
            <button className='text-xs text-blue-400' onClick={() => handleEditProduct(product.id)}>
              ویرایش
            </button>
          </td>
          <td>{product.cost}</td>
          <td>{product.title}</td>

          <td>{index + 1}</td>
        </tr>
      ))
  }

  const handleDeleteProduct = (productId) => {
    const isConfirmed = window.confirm('آیا از حذف این محصول مطمعن هستید؟')
    if (isConfirmed) {
      dispatch(deleteProduct(productId)).then((action) => {
        if (deleteProduct.fulfilled.match(action)) {
          setDeletedProductIds((prevIds) => [...prevIds, productId])
        }
      })
    }
  }

  const handleEditProduct = (productId) => {
    navigate(`/edit-product/${productId}`)
  }

  const handleAddProduct = () => {
    navigate('/add-product')
  }

  return (
    <div className='h-full w-[90%] mt-[30px] mx-auto p-4'>
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
          onClick={handleAddProduct}
        >
          اضافه کردن محصول
        </button>
      </div>
      <table className='table-fixed w-full'>
        <thead>
          <tr className='text-white text-center bg-slate-800'>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='detail'
                placeholder='جزییات'
              />
            </th>
            <th>
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
                name='price'
                placeholder='قیمت'
              />
            </th>

            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='name'
                placeholder='نام محصول '
                value={sortInputs.name}
                onChange={handleSortInputChange}
              />
            </th>

            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='theRow'
                placeholder='ردیف'
              />
            </th>
          </tr>
        </thead>
        <tbody className='text-sm text-gray-200 divide-y-2 divide-slate-700 leading-9'>{getProducts()}</tbody>
      </table>
    </div>
  )
}
export default ProductsMainSection
