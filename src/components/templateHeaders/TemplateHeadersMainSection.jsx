import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import {
  fetchTemplateHeaders,
  deleteTemplate,
} from '../../features/templateHeaders/templateHeadersSlice'
import { useNavigate } from 'react-router-dom'

const TemplateHeadersMainSection = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const templateHeaders = useSelector(
    (state) => state.templateHeadersR.entities
  )
  const isLoading = useSelector((state) => state.templateHeadersR.isLoading)
  const isError = useSelector((state) => state.templateHeadersR.isError)
  const [deletedTemplateIds, setDeletedTemplateIds] = useState([])

  const [sortInputs, setSortInputs] = useState({
    title: '',
  })

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (accessToken) {
      dispatch(fetchTemplateHeaders())
    }
  }, [dispatch])

  if (isLoading) return <div className='text-white'>Loading...</div>
  if (isError) return <div>Error loading templateHeaders</div>

  // handle sortning starts here
  const handleSortInputChange = (e) => {
    const { name, value } = e.target
    setSortInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }))
  }
  // handle sortning finishes here

  const getTemplateHeaders = () => {
    if (!templateHeaders) return []

    return templateHeaders
      .filter((templateHeaders) => {
        return templateHeaders?.title.includes(sortInputs.title || '')
      })
      .map((templateHeaders, index) => (
        <tr key={templateHeaders.id} className='text-white text-center'>
          <td>
            {templateHeaders.deleted ? (
              <button disabled>Deleted</button>
            ) : (
              <button
                onClick={() => handleDeleteTemplateHeader(templateHeaders.id)}
              >
                Delete
              </button>
            )}
          </td>
          <td>
            <button
              onClick={() => handleEditTemplateHeader(templateHeaders.id)}
            >
              Edit
            </button>
          </td>
          <td>{templateHeaders.title}</td>
          <td>{index + 1}</td>
        </tr>
      ))
  }

  const handleDeleteTemplateHeader = (templateHeaderId) => {
    const isConfirmed = window.confirm('آیا از حذف این خبر مطمعن هستید؟')
    if (isConfirmed) {
      dispatch(deleteTemplate(templateHeaderId)).then((action) => {
        if (deleteTemplate.fulfilled.match(action)) {
          setDeletedTemplateIds((prevIds) => [...prevIds, templateHeaderId])
        }
      })
    }
  }

  const handleEditTemplateHeader = (templateHeaderId) => {
    navigate(`/edit-template-header/${templateHeaderId}`)
  }

  const handleAddTemplateHeaders = () => {
    navigate('/add-template-header')
  }

  return (
    <div className='h-full w-full mt-[10px] '>
      <div className='flex flex-row justify-end -mt-8 mb-2'>
        <button
          className=' bg-cyan-600 rounded-md mb-2 p-1'
          onClick={handleAddTemplateHeaders}
        >
          افزودن اخبار
        </button>
      </div>
      <table className='table-fixed w-full'>
        <thead>
          <tr className='text-white text-center bg-slate-800'>
            <th className='flex justify-center'>
              <input
                className='bg-slate-800 w-[100px] flex flex-row justify-end'
                type='text'
                name='delete'
                placeholder='Delete'
              />
            </th>
            <th>
              <input
                className='bg-slate-800 w-[100px]'
                type='text'
                name='edit'
                placeholder='Edit'
              />
            </th>
            <th>
              <input
                className='bg-slate-800 w-[100px]'
                type='text'
                name='title'
                placeholder='نام'
                value={sortInputs.title}
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
        <tbody  className=' divide-y-2 divide-slate-700   text-sm '>{getTemplateHeaders()}</tbody>
      </table>
    </div>
  )
}
export default TemplateHeadersMainSection
