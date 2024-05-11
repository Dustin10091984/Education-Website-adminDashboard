import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { fetchTickets } from '../../features/tickets/ticketsSlice'
import { ticketClosed } from '../../features/tickets/ticketsSlice'
import { useNavigate } from 'react-router-dom'
import { MdDetails } from 'react-icons/md'
import { FcInfo } from "react-icons/fc";
import { FaStar } from 'react-icons/fa' // Import the star icon
import { IoCloseCircleOutline } from 'react-icons/io5'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const TicketsMainSection = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const tickets = useSelector((state) => state.ticketsR.entities)
  const isLoading = useSelector((state) => state.ticketsR.isLoading)
  const isError = useSelector((state) => state.ticketsR.isError)

  const renderStars = (count) => {
    let stars = []
    for (let i = 0; i < count; i++) {
      stars.push(<FaStar key={i} />) // Push a star icon for each count
    }
    return stars
  }

  const [sortInputs, setSortInputs] = useState({
    title: '',
    department: '',
    open: '',
  })

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (accessToken) {
      dispatch(fetchTickets())
    }
  }, [dispatch])

  if (isLoading) return <div className='text-white'>Loading...</div>
  if (isError) return <div>Error loading tickets</div>

  // handle sortning starts here
  const handleSortInputChange = (e) => {
    const { name, value } = e.target
    setSortInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }))
  }
  // handle sortning finishes here

  const handleDetailClick = (ticketId) => {
    navigate(`/ticket-detail/${ticketId}`)
    console.log('detail:', ticketId)
  }

  const handleCloseTicket = async (ticketId) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      toast.error('Please login to close the ticket.')
      return
    }
    try {
      const response = await axios.patch(
        `https://api.ebsalar.com/api/v1/admin/ticket/messages/${ticketId}/`,
        { open: false },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      // Update tickets in the local state to reflect the change
      dispatch(ticketClosed(ticketId))
      toast.success('Ticket closed successfully.')
    } catch (error) {
      console.error('Error closing the ticket:', error)
      toast.error('Error closing the ticket.')
    }
  }

  const getTickets = () => {
    if (!tickets) return []
    return tickets
      .filter((ticket) => {
        return (
          ticket.title.includes(sortInputs.title || '') &&
          ticket.department.includes(sortInputs.department || '') &&
          ticket.open.toString().includes(sortInputs.open || '')
        )
      })
      .map((ticket, index) => (
        <tr key={ticket.id} className='text-white text-center '>
          <td className='pt-4 w-16 flex justify-center'>
            {ticket.open && (
              <button className='bg-red-400 text-xl'
                onClick={() => handleCloseTicket(ticket.id)}
                title='Close Ticket'
              >
                <IoCloseCircleOutline />
              </button>
            )}
          </td>
          <td className=''>
            <button className='text-blue-400 text-xl flex justify-center items-center w-full'
             onClick={() => handleDetailClick(ticket.id)}>
              <FcInfo title='Ticket Detail' />
            </button>
          </td>
          <td className='flex flex-row text-yellow-400 w-full justify-center items-center   h-12'>
            {renderStars(ticket.stars)}
          </td>
          {/* Render the stars here */}
          <td className='pt-4 pr-12'>{ticket.open.toString()}</td>
          <td className='pt-4 pr-12'>{ticket.department}</td>
          <td className='pt-4 pr-12 '> {ticket.title}</td>
          <td className='pt-4 pr-12'>{index + 1}</td>
        </tr>
      ))
  }

  const checkContactsUs = () => {
    navigate('/contacts')
  }

  return (
    <div className='h-full w-full mt-[10px] '>
      <ToastContainer />
      <div className='flex flex-row justify-end -mt-8 mb-2'>
        <button
          className='bg-cyan-600 rounded-md mb-2 px-4 text-white text-sm py-2 mr-4'
          onClick={checkContactsUs}
        >
           پیام های کاربران عمومی
        </button>
      </div>
      <table className='table-fixed w-full'>
        <thead>
          <tr className='text-white text-center bg-slate-800'>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='close'
                placeholder='بستن'
              />
            </th>
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
                name='stars'
                placeholder='امتیاز'
                value={sortInputs.open}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='open'
                placeholder='وضعیت'
                value={sortInputs.open}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='department'
                placeholder='دپارتمات'
                value={sortInputs.department}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='title'
                placeholder='Title'
                value={sortInputs.title}
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
        <tbody className='text-sm text-gray-200 divide-y-2 divide-slate-700 leading-9'>{getTickets()}</tbody>
      </table>
    </div>
  )
}
export default TicketsMainSection
