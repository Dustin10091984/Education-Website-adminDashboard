import axios from 'axios'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const ProductDetail = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [productDetail, setProductDetail] = useState('')
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = Cookies.get('authToken')
      try {
        const response = await axios.get(
          `https://api.ebsalar.com/api/v1/admin/product/${productId}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        setProductDetail(response.data.results)
        console.log(response.data.results.title)
        if (response.data.results.features) {
          console.log('Session:', response.data.results.features.session)
          console.log('Teacher:', response.data.results.features.teacher)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [productId])

  const truncateDescription = (description) => {
    if (description) {
      return description.split(' ').slice(0, 5).join(' ') + '...'
    }
    return 'Loading...'
  }

  const handleShowMore = () => {
    setShowMore(!showMore)
  }

  return (
    <div className='flex flex-col mx-auto mt-10 justify-center items-center w-80 border shadow-lg rounded-lg hover:scale-105 duration-300 bg-white p-2'>
      <img
        className='w-40 border rounded'
        src={productDetail.banner}
        alt='banner'
      />
      <p>Title: {productDetail.title}</p>
      <p>Price: {productDetail.cost}</p>
      <p className='mt-2'>
        Description:
        {showMore
          ? productDetail.description
          : truncateDescription(productDetail.description)}
        <button className='text-blue-800' onClick={handleShowMore}>
          {showMore ? 'Less' : 'More'}
        </button>
      </p>
      <p>Level: {productDetail.level}</p>
      <p>Category: {productDetail.category}</p>
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          productDetail.available
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {productDetail.available ? 'Available' : 'Unavailable'}
      </span>
      <h2 className='text-xl text-blue-700 mt-4'>Features:</h2>
      <p>Session: {productDetail.features?.session}</p>
      <p>Teacher: {productDetail.features?.teacher}</p>
      <p>{productDetail.deleted && <button disabled>Deleted</button>}</p>
    </div>
  )
}
export default ProductDetail
