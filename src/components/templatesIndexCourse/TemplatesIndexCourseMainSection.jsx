import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'

import { useNavigate } from 'react-router-dom'
import {
  fetchTemplatesIndexCourse,
  deleteTemplatesIndexCourse,
} from '../../features/templatesIndexCourse/templatesIndexCourseSlice'

const TemplatesIndexCourseMainSection = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const templates = useSelector((state) => state.templatesIndexCourseR.entities)
  const isLoading = useSelector(
    (state) => state.templatesIndexCourseR.isLoading
  )
  const isError = useSelector((state) => state.templatesIndexCourseR.isError)
  const [deletedTemplateIds, setDeletedTemplateIds] = useState([])

  const [sortInputs, setSortInputs] = useState({
    title: '',
  })

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (accessToken) {
      dispatch(fetchTemplatesIndexCourse())
    }
  }, [dispatch])

  if (isLoading) return <div className='text-white'>Loading...</div>
  if (isError) return <div>Error loading templates</div>

  // handle sortning starts here
  const handleSortInputChange = (e) => {
    const { name, value } = e.target
    setSortInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }))
  }
  // handle sortning finishes here

  const getTemplates = () => {
    if (!templates) return []
    return templates
      .filter((template) => {
        return template?.title?.includes(sortInputs.title || '')
        return template?.description?.includes(sortInputs.description || '')
      })
      .map((template, index) => (
        <tr key={template.id} className='text-white text-center'>
          <td>
            {template.deleted ? (
              <button disabled>Deleted</button>
            ) : (
              <button onClick={() => handleDeleteTemplate(template.id)}>
                Delete
              </button>
            )}
          </td>
          <td>
            <button onClick={() => handleEditTemplate(template.id)}>
              Edit
            </button>
          </td>
          <td>{template.title}</td>
          <td>{index + 1}</td>
        </tr>
      ))
  }

  const handleDeleteTemplate = (templateId) => {
    const isConfirmed = window.confirm('آیا از حذف این دوره مطمعن هستید؟')
    if (isConfirmed) {
      dispatch(deleteTemplatesIndexCourse(templateId)).then((action) => {
        if (deleteTemplatesIndexCourse.fulfilled.match(action)) {
          setDeletedTemplateIds((prevIds) => [...prevIds, templateId])
        }
      })
    }
  }

  const handleEditTemplate = (templateId) => {
    navigate(`/edit-template-indexcourse/${templateId}`)
  }

  const handleAddTemplate = () => {
    navigate('/add-template-indexcourse')
  }

  return (
    <div className='h-full w-full mt-[10px] '>
      <div className='flex flex-row justify-end -mt-8 mb-2'>
        <button
          className=' bg-cyan-600 rounded-md mb-2 px-4 py-2 p-1'
          onClick={handleAddTemplate}
        >
           افزودن دوره محبوب
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
        <tbody className='  divide-y-2 divide-gray-700'>{getTemplates()}</tbody>
      </table>
    </div>
  )
}
export default TemplatesIndexCourseMainSection
