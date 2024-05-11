import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { deleteLevel, fetchLevels } from '../../features/levels/levelsSlice'
import { useNavigate } from 'react-router-dom'

const LevelsMainSection = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const levels = useSelector((state) => state.levelsR.entities)
  const isLoading = useSelector((state) => state.levelsR.isLoading)
  const isError = useSelector((state) => state.levelsR.isError)
  const [deletedLevelIds, setDeletedLevelIds] = useState([])

  const [sortInputs, setSortInputs] = useState({
    name: '',
  })

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (accessToken) {
      dispatch(fetchLevels())
    }
  }, [dispatch])

  if (isLoading) return <div className='text-white'>Loading...</div>
  if (isError) return <div>Error loading levels</div>

  // handle sortning starts here
  const handleSortInputChange = (e) => {
    const { name, value } = e.target
    setSortInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }))
  }
  // handle sortning finishes here

  const getLevels = () => {
    if (!levels) return []

    return levels
      .filter((level) => {
        return level?.name?.includes(sortInputs.name || '')
      })
      .map((level, index) => (
        <tr key={level.id} className='text-white text-center'>
          <td>
            {level.deleted ? (
              <button disabled>Deleted</button>
            ) : (
              <button onClick={() => handleDeleteLevel(level.id)}>
                Delete
              </button>
            )}
          </td>
          <td>
            <button onClick={() => handleEditLevel(level.id)}>Edit</button>
          </td>
          <td>{level.name}</td>
          <td>{index + 1}</td>
        </tr>
      ))
  }

  const handleDeleteLevel = (levelId) => {
    const isConfirmed = window.confirm('آیا از حذف این پایه مطمعن هستید؟')
    if (isConfirmed) {
      dispatch(deleteLevel(levelId)).then((action) => {
        if (deleteLevel.fulfilled.match(action)) {
          setDeletedLevelIds((prevIds) => [...prevIds, levelId])
        }
      })
    }
  }

  const handleEditLevel = (levelId) => {
    navigate(`/edit-level/${levelId}`)
  }

  const handleRegisterOnsite = () => {
    navigate('/add-level')
  }

  return (
    <div className='h-full w-[90%] mt-[30px] mx-auto p-4'>
      <div className='flex flex-row justify-end -mt-8 mb-2'>
        <button
          className='bg-cyan-600 rounded-md mb-2 px-4 text-white text-sm py-2 mr-4'
          onClick={handleRegisterOnsite}
        >
          اضافه کردن پایه
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
                placeholder='پایه'
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
        <tbody className='text-sm text-gray-200 divide-y-2 divide-slate-700 leading-9'>{getLevels()}</tbody>
      </table>
    </div>
  )
}
export default LevelsMainSection
