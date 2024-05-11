import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { deleteOrder, fetchOrders } from '../../features/orders/ordersSlice'
import { useNavigate } from 'react-router-dom'

const OrdersMainSection = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const orders = useSelector((state) => state.ordersR.entities)
  const isLoading = useSelector((state) => state.ordersR.isLoading)
  const isError = useSelector((state) => state.ordersR.isError)
  const [deletedOrderIds, setDeletedOrderIds] = useState([])

  const [sortInputs, setSortInputs] = useState({
    status: '',
  })
  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (accessToken) {
      dispatch(fetchOrders())
    }
  }, [dispatch])

  if (isLoading) return <div className='text-white'>Loading...</div>
  if (isError) return <div>Error loading orders</div>

  // handle sortning starts here
  const handleSortInputChange = (e) => {
    const { name, value } = e.target
    setSortInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value.toLowerCase(),
    }))
  }
  // handle sortning finishes here

  const statusMap = {
    p: 'Payed',
    e: 'Pending',
    f: 'Failed',
    s: 'Submitted',
    c: 'Cancel',
  }

  const getOrders = () => {
    if (!orders) return []

    return orders
      .filter((order) => {
        const fullStatus = statusMap[order.status.toLowerCase()] || order.status
        return fullStatus.toLowerCase().includes(sortInputs.status)
      })
      .map((order) => (
        <tr key={order.id} className='text-white text-center'>
          <td>
            {order.deleted ? (
              <button disabled>Deleted</button>
            ) : (
              <button onClick={() => handleDeleteOrder(order.id)}>
                Delete
              </button>
            )}
          </td>
          <td>
            <button onClick={() => handleEditOrder(order.id)}>Edit</button>
          </td>
          <td>{order.total_price}</td>
          <td>{order.created_at}</td>
          {/* <td>{order.status}</td> */}
          {statusMap[order.status.toLowerCase()] || order.status}
          <td>{order.id}</td>
        </tr>
      ))
  }

  const handleDeleteOrder = (orderId) => {
    const isConfirmed = window.confirm('آیا از حذف این سفارش مطمعن هستید؟')
    if (isConfirmed) {
      dispatch(deleteOrder(orderId)).then((action) => {
        if (deleteOrder.fulfilled.match(action)) {
          setDeletedOrderIds((prevIds) => [...prevIds, orderId])
        }
      })
    }
  }

  const handleEditOrder = (orderId) => {
    navigate(`/edit-order/${orderId}`)
  }

  const handleAddOrder = () => {
    navigate('/add-order')
  }

  return (
    <div className='h-full w-[90%] mt-[30px] mx-auto p-4'>
      <div className='flex flex-row justify-end -mt-8 mb-2'>
        <button
          className='bg-cyan-600 rounded-md mb-2 px-4 text-white text-sm py-2 mr-4'
          onClick={handleAddOrder}
        >
           ثبت فروش حضوری 
        </button>
      </div>
      <table className='table-fixed w-full'>
        <thead>
          <tr className='text-white text-center bg-slate-800'>
            <th className='flex justify-center'>
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
                name='total_price'
                placeholder='قیمت کل '
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='created_at'
                placeholder=' زمان سفارش'
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='status'
                placeholder='وضعیت'
                value={sortInputs.status}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='id'
                placeholder='کد سفارش'
              />
            </th>
          </tr>
        </thead>
        <tbody className='text-sm text-gray-200 divide-y-2 divide-slate-700 leading-9'>{getOrders()}</tbody>
      </table>
    </div>
  )
}
export default OrdersMainSection
