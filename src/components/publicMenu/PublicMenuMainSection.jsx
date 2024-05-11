import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'

import { useNavigate } from 'react-router-dom'
import {
  deleteMenu,
  fetchMenus,
} from '../../features/publicMenu/publicMenuSlice'
import { fetchSubmenu } from '../../features/submenus/submenusSlice'

const PublicMenuMainSection = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const menus = useSelector((state) => state.menuR.entities)
  const isLoading = useSelector((state) => state.menuR.isLoading)
  const isError = useSelector((state) => state.menuR.isError)
  const [deletedMenuIds, setDeletedMenuIds] = useState([])

  const [sortInputs, setSortInputs] = useState({
    name: '',
  })
  const [showDeleted, setShowDeleted] = useState(true)

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (accessToken) {
      dispatch(fetchMenus())
    }
  }, [dispatch])

  if (isLoading) return <div className='text-white'>Loading...</div>
  if (isError) return <div>Error loading menus</div>

  // handle sortning starts here
  const handleSortInputChange = (e) => {
    const { name, value } = e.target
    setSortInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }))
  }
  // handle sortning finishes here

  const getMenus = () => {
    if (!menus) return []

    return menus
      .filter((menu) => {
        if (!showDeleted && menu.deleted) return false
        return menu?.name?.includes(sortInputs.name || '')
      })
      .map((menu, index) => (
        <tr key={menu.id} className='text-white text-center'>
          <td>
            {menu.deleted ? (
              <button disabled>Deleted</button>
            ) : (
              <button onClick={() => handleDeleteMenu(menu.id)}>Delete</button>
            )}
          </td>
          <td>
            <button onClick={() => handleEditMenu(menu.id)}>Edit</button>
          </td>
          <td>
            <button onClick={() => handleFetchSubmenu(menu.id)}>
              زیر منوها
            </button>
          </td>
          <td>{menu.name}</td>
          <td>{index + 1}</td>
        </tr>
      ))
  }

  const handleDeleteMenu = (menuId) => {
    const isConfirmed = window.confirm('آیا از حذف این منو مطمعن هستید؟')
    if (isConfirmed) {
      dispatch(deleteMenu(menuId)).then((action) => {
        if (deleteMenu.fulfilled.match(action)) {
          setDeletedMenuIds((prevIds) => [...prevIds, menuId])
        }
      })
    }
  }

  const handleEditMenu = (menuId) => {
    navigate(`/edit-menu/${menuId}`)
  }
  const handleFetchSubmenu = (menuId) => {
    dispatch(fetchSubmenu(menuId))
      .unwrap()
      .then(() => {
        navigate(`/submenus/${menuId}`)
      })
      .catch((error) => {
        console.error('Could not fetch submenus:', error)
        // Handle error, e.g., show a notification
      })
  }

  const handleAddMenu = () => {
    navigate('/add-menu')
  }

  return (
    <div className='h-full w-[90%] mt-[30px] mx-auto p-4'>
      <div className='flex flex-row justify-end -mt-8 mb-2'>
        <button
          className='bg-cyan-600 rounded-md mb-2 px-4 text-white text-sm py-2 mr-4'
          onClick={handleAddMenu}
        >
          اضافه کردن منو جدید
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
                placeholder='Delete'
              />
            </th>
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
                placeholder='زیر منوها'
              />
            </th>
            <th>
              <input
                className='bg-slate-800 placeholder-pink-500 border-l-2 border-gray-700 w-full text-sm text-center py-2 flex flex-row justify-center'
                type='text'
                name='name'
                placeholder='منو'
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
          {getMenus()}
        </tbody>
      </table>
    </div>
  )
}
export default PublicMenuMainSection
