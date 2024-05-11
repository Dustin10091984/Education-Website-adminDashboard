import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'

import { useNavigate } from 'react-router-dom'
import { fetchSubs } from '../../features/submenus/submenusSlice'

const DpagesMainSection = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const submenus = useSelector((state) => state.subR.entities)
  const isLoading = useSelector((state) => state.subR.isLoading)
  const isError = useSelector((state) => state.subR.isError)

  const [sortInputs, setSortInputs] = useState({
    name: '',
  })

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (accessToken) {
      dispatch(fetchSubs())
    }
  }, [dispatch])

  if (isLoading) return <div className='text-white'>Loading...</div>
  if (isError) return <div>Error loading submenus</div>

  // handle sortning starts here
  const handleSortInputChange = (e) => {
    const { name, value } = e.target
    setSortInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }))
  }
  // handle sortning finishes here

  const getSubmenus = () => {
    if (!submenus) return []

    return submenus.map((submenu, index) => (
      <tr key={submenu.id} className='text-white text-center'>
        <td>
          <button onClick={() => handleEditSubmenu(submenu.id)}>Edit</button>
        </td>
        <td>{submenu.name}</td>
        <td>{index + 1}</td>
      </tr>
    ))
  }

  const handleEditSubmenu = (submenuId) => {
    navigate(`/edit-dpage/${submenuId}`)
  }

  return (
    <div className='h-full w-[90%] mt-[30px] mx-auto p-4'>
      <div className='flex flex-row justify-end -mt-8 mb-2'></div>
      <table className='table-fixed w-full'>
        <thead>
          <tr className='text-white text-center bg-slate-800'>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='edit'
                placeholder='Edit'
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='name'
                placeholder='نام'
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
        <tbody className='text-sm text-gray-200 divide-y-2 divide-slate-700 leading-9'>
          {getSubmenus()}
        </tbody>
      </table>
    </div>
  )
}
export default DpagesMainSection
