import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { deleteTerm, fetchTerms } from '../../features/terms/termsSlice'
import { useNavigate } from 'react-router-dom'

const TermsMainSection = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const terms = useSelector((state) => state.termsR.entities)
  const isLoading = useSelector((state) => state.termsR.isLoading)
  const isError = useSelector((state) => state.termsR.isError)
  const [deletedTermIds, setDeletedTermIds] = useState([])

  const [sortInputs, setSortInputs] = useState({
    name: '',
  })

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (accessToken) {
      dispatch(fetchTerms())
    }
  }, [dispatch])

  if (isLoading) return <div className='text-white'>Loading...</div>
  if (isError) return <div>Error loading terms</div>

  // handle sortning starts here
  const handleSortInputChange = (e) => {
    const { name, value } = e.target
    setSortInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }))
  }
  // handle sortning finishes here

  const getTerms = () => {
    if (!terms) return []

    return terms
      .filter((term) => {
        return term?.name?.includes(sortInputs.name || '')
      })
      .map((term, index) => (
        <tr key={term.id} className='text-white text-center'>
          <td>
            {term.deleted ? (
              <button disabled>Deleted</button>
            ) : (
              <button onClick={() => handleDeleteTerm(term.id)}>Delete</button>
            )}
          </td>
          <td>
            <button onClick={() => handleEditTerm(term.id)}>Edit</button>
          </td>
          <td>{term.name}</td>
          <td>{index + 1}</td>
        </tr>
      ))
  }

  const handleDeleteTerm = (termId) => {
    const isConfirmed = window.confirm('آیا از حذف این ترم مطمعن هستید؟')
    if (isConfirmed) {
      dispatch(deleteTerm(termId)).then((action) => {
        if (deleteTerm.fulfilled.match(action)) {
          setDeletedTermIds((prevIds) => [...prevIds, termId])
        }
      })
    }
  }

  const handleEditTerm = (termId) => {
    navigate(`/edit-term/${termId}`)
  }

  const handleRegisterOnsite = () => {
    navigate('/add-term')
  }

  return (
    <div className='h-full w-[90%] mt-[30px] mx-auto p-4'>
      <div className='flex flex-row justify-end -mt-8 mb-2'>
        <button
          className='bg-cyan-600 rounded-md mb-2 px-4 text-white text-sm py-2 mr-4'
          onClick={handleRegisterOnsite}
        >
          اضافه کردن ترم
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
                placeholder='ترم'
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
        <tbody className='text-sm text-gray-200 divide-y-2 divide-slate-700 leading-9'>{getTerms()}</tbody>
      </table>
    </div>
  )
}
export default TermsMainSection
