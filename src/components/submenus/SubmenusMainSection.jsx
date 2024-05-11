import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'

import { useNavigate, useParams } from 'react-router-dom'
import { deleteSub, fetchSubmenu } from '../../features/submenus/submenusSlice'

const SubmenusMainSection = () => {
  const { menuId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const submenus = useSelector((state) => state.subR.entities)
  const isLoading = useSelector((state) => state.subR.isLoading)
  const isError = useSelector((state) => state.subR.isError)
  const [deletedSubIds, setDeletedSubIds] = useState([])

  // console.log(submenus)

  const [sortInputs, setSortInputs] = useState({
    name: '',
  })

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (accessToken) {
      dispatch(fetchSubmenu(menuId))
    }
  }, [menuId])

  if (isLoading) return <div className='text-white'>Loading...</div>
  if (isError) return <div>Error loading subs</div>

  // handle sortning starts here
  const handleSortInputChange = (e) => {
    const { name, value } = e.target
    setSortInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }))
  }
  // handle sortning finishes here

  const getSubs = () => {
    if (!submenus) return []

    return submenus.map((submenu, index) => (
      <tr key={submenu.id} className='text-black text-center'>
        <td>
          {submenu.deleted ? (
            <button disabled>Deleted</button>
          ) : (
            <button onClick={() => handleDeleteSub(submenu.id)}>Delete</button>
          )}
        </td>
        <td>
          <button onClick={() => handleEditSub(submenu.id)}>Edit</button>
        </td>
        <td>{submenu.name}</td>
        <td>{index + 1}</td>
      </tr>
    ))
  }

  const handleDeleteSub = (subId) => {
    const isConfirmed = window.confirm('آیا از حذف این زیر منو مطمعن هستید؟')
    if (isConfirmed) {
      dispatch(deleteSub(subId)).then((action) => {
        if (deleteSub.fulfilled.match(action)) {
          setDeletedSubIds((prevIds) => [...prevIds, subId])
        }
      })
    }
  }

  const handleEditSub = (subId) => {
    navigate(`/edit-submenu/${subId}`)
  }

  const handleAddSubmenu = () => {
    navigate('/add-submenu')
  }

  return (
    <div className='h-full w-[90%] mt-[30px] mx-auto p-4'>
      <div className='flex flex-row justify-end -mt-8 mb-2'>
        <button
          className='bg-cyan-600 rounded-md mb-2 px-4 text-white text-sm py-2 mr-4'
          onClick={handleAddSubmenu}
        >
          اضافه کردن زیر منو جدید
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
                placeholder=' زیر منو'
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
          {getSubs()}
        </tbody>
      </table>
    </div>
  )
}
export default SubmenusMainSection
