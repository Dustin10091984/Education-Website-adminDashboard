import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'

import { useNavigate } from 'react-router-dom'
import {
  deleteContact,
  fetchContacts,
} from '../../features/contacts/contactsSlice'
import { MdDetails } from 'react-icons/md'

const ContactsMainSection = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const contacts = useSelector((state) => state.contactR.entities)
  const isLoading = useSelector((state) => state.contactR.isLoading)
  const isError = useSelector((state) => state.contactR.isError)
  const [deletedContactIds, setDeletedContactIds] = useState([])

  const [sortInputs, setSortInputs] = useState({
    connection_way: '',
    message: '',
  })

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (accessToken) {
      dispatch(fetchContacts())
    }
  }, [dispatch])

  if (isLoading) return <div className='text-white'>Loading...</div>
  if (isError) return <div>Error loading contacts</div>

  // handle sortning starts here
  const handleSortInputChange = (e) => {
    const { name, value } = e.target
    setSortInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }))
  }
  // handle sortning finishes here

  const handleDetailClick = (contactId) => {
    navigate(`/contact-detail/${contactId}`)
    console.log('detail:', contactId)
  }

  const getContacts = () => {
    if (!contacts) return []
    return contacts.map((contact, index) => (
      <tr key={contact.id} className='text-white text-center'>
        <td className='pt-4 pr-12'>
          <button onClick={() => handleDetailClick(contact.id)}>
            <MdDetails title='Contact Detail' />
          </button>
        </td>
        <td>
          {contact.deleted ? (
            <button disabled>Deleted</button>
          ) : (
            <button onClick={() => handleDeleteContact(contact.id)}>
              Delete
            </button>
          )}
        </td>
        {/* <td>
            <button onClick={() => handleEditContact(contact.id)}>
              Edit
            </button>
          </td> */}
        <td>{contact.message}</td>
        <td>{contact.connection_way}</td>
        <td>{index + 1}</td>
      </tr>
    ))
  }

  const handleDeleteContact = (contactId) => {
    const isConfirmed = window.confirm('آیا از حذف این تماس مطمعن هستید؟')
    if (isConfirmed) {
      dispatch(deleteContact(contactId)).then((action) => {
        if (deleteContact.fulfilled.match(action)) {
          setDeletedContactIds((prevIds) => [...prevIds, contactId])
        }
      })
    }
  }

  // const handleEditContact = (contactId) => {
  //   navigate(`/edit-contact/${contactId}`)
  // }

  // const handleAddContact = () => {
  //   navigate('/add-contact')
  // }

  return (
    <div className='h-full w-full mt-[10px] '>
      <table className='table-fixed w-full'>
        <thead>
          <tr className='text-white text-center bg-slate-800'>
            <th>
              <input
                className='bg-slate-800 w-[100px]'
                type='text'
                name='detail'
                placeholder='Detail'
              />
            </th>
            <th className='flex justify-center'>
              <input
                className='bg-slate-800 w-[100px] flex flex-row justify-end'
                type='text'
                name='delete'
                placeholder='Delete'
              />
            </th>
            {/* <th>
              <input
                className='bg-slate-800 w-[100px]'
                type='text'
                name='edit'
                placeholder='Edit'
              />
            </th> */}
            <th>
              <input
                className='bg-slate-800 w-[100px]'
                type='text'
                name='message'
                placeholder='پیغام'
                value={sortInputs.message}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 w-[100px]'
                type='text'
                name='connection_way'
                placeholder='راه ارتباطی'
                value={sortInputs.connection_way}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 w-[100px]'
                type='text'
                name='theRow'
                placeholder='ردیف'
              />
            </th>
          </tr>
        </thead>
        <tbody>{getContacts()}</tbody>
      </table>
    </div>
  )
}
export default ContactsMainSection
