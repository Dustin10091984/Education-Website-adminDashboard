import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import { IoIosSend } from 'react-icons/io'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { RxAvatar } from 'react-icons/rx'

const TicketDetails = () => {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const [tickets, setTickets] = useState(null)
  const [error, setError] = useState()
  const [newMessage, setNewMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileUrl, setFileUrl] = useState('')

  const fileInputRef = useRef(null)

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    const accessToken = Cookies.get('authToken')

    const fetchData = async () => {
      if (!accessToken) {
        setError('No access token found')
        return
      }
      try {
        const response = await axios.get(
          `https://api.ebsalar.com/api/v1/admin/ticket/messages/${ticketId}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        setTickets(response.data.results)
      } catch (error) {
        setError('Error fetching tickets details')
      }
    }
    fetchData()
  }, [ticketId, navigate, newMessage, fileUrl])

  if (error) return <div>{error}</div>
  if (!tickets) return <div>Loading...</div>

  const renderChatMessages = () => {
    // Helper function to format the solar date and time
    const formatDateSolar = (dateTimeSolarString) => {
      if (!dateTimeSolarString) return '---'
      const [date, time] = dateTimeSolarString.split(' ')
      const trimmedTime = time.substring(0, 5)
      return `${date} ${trimmedTime}`
    }

    return tickets.map((ticket, index) => (
      <div key={index} className='flex flex-col'>
        {ticket.staff ? (
          // Staff message or file link
          <div className='flex justify-end'>
            <div className='flex flex-col space-y-2 text-xs max-w-xs mx-2 items-end'>
              <div className='flex flex-row'>
                <div className=' mt-6 mr-2 font-bold'>{ticket.staff}</div>
                <div className='flex items-center justify-center h-14 w-14 mt-1 rounded-full bg-blue-500 text-white font-bold'>
                  <RxAvatar className=' size-16 ' />
                </div>
              </div>
              <div>
                {ticket.message && (
                  <span className='px-4 py-2 mb-6 rounded-lg inline-block rounded-br-none bg-blue-600 text-white'>
                    {ticket.message}
                  </span>
                )}
                {ticket.file && (
                  <a
                    href={ticket.file}
                    download
                    className='px-4 py-2 ml-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white underline'
                  >
                    Download File
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Student message
          <div className='flex justify-start'>
            <div className='flex flex-col space-y-2 text-xs max-w-xs mx-2 items-start'>
              <div className='flex flex-row'>
                <div className='flex items-center justify-center h-14 w-14 mt-1 rounded-full bg-gray-500 text-white font-bold'>
                  <RxAvatar className='size-16 ' />
                </div>
                <div className=' mt-6 ml-2 font-bold'>{ticket.student}</div>
              </div>
              <div>
                <span className='px-4 py-2 rounded-lg inline-block rounded-bl-non'>
                  {ticket.message && (
                    <span className='px-4 py-2 mb-6 rounded-lg inline-block rounded-br-none bg-gray-300 text-gray-600'>
                      {ticket.message}
                    </span>
                  )}
                  {ticket.file && (
                    <a
                      href={ticket.file}
                      download
                      className='px-4 py-2 ml-2 rounded-lg inline-block rounded-br-none bg-gray-300 text-gray-600 underline'
                    >
                      Download File
                    </a>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
        <div className='text-xs text-gray-500 text-center mt-1'>
          {formatDateSolar(ticket.date_time_solar)}
        </div>
      </div>
    ))
  }

  // Function to handle file upload
  const handleFileUpload = async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const accessToken = Cookies.get('authToken')
      const response = await axios.post(
        'https://api.ebsalar.com/api/v1/media/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      const fileData = response.data.results
      // Handle the response here, set the URL state
      setFileUrl(fileData)
      toast.success('File uploaded successfully.')
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Error uploading file.')
    }
  }

  // Function to handle message send
  const handleSendMessage = async () => {
    if (!newMessage && !fileUrl) {
      toast.error('Please enter a message or attach a file.')
      return
    }

    const messageData = {
      message: newMessage,
      file: fileUrl, // Attach the file URL to the message data
    }
    try {
      const accessToken = Cookies.get('authToken')

      const response = await axios.post(
        `https://api.ebsalar.com/api/v1/admin/ticket/messages/${ticketId}/`,
        messageData, // Use the messageData with the file URL
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      // Clear the message and selected file state
      setNewMessage('')
      setFileUrl('')
      setSelectedFile(null)
      fileInputRef.current.value = '' // Reset the file input
      setTickets([...tickets, response.data])
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <div className='flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen'>
      <ToastContainer />
      <div
        id='messages'
        className='flex-grow overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch p-3'
      >
        {renderChatMessages()}
      </div>
      <div className='p-3 flex items-center justify-between'>
        <input
          type='text'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder='Write a message...'
          className='flex-grow p-2 rounded border'
        />
        <input
          type='file'
          onChange={(e) => {
            const file = e.target.files[0]
            if (file) {
              handleFileUpload(file)
            }
          }}
          id='attach-file'
          ref={fileInputRef}
          className='ml-2'
        />
        <button onClick={handleSendMessage} className='p-2 mx-2'>
          <IoIosSend />
        </button>
      </div>
    </div>
  )
}

export default TicketDetails
