import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'

import { useNavigate } from 'react-router-dom'
import {
  deleteTemplatesQuestion,
  fetchTemplatesQuestions,
} from '../../features/templatesQuestions/templatesQuestionsSlice'

const TemplatesQuestionsMainSection = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const templates = useSelector((state) => state.templatesQuestionsR.entities)
  const isLoading = useSelector((state) => state.templatesQuestionsR.isLoading)
  const isError = useSelector((state) => state.templatesQuestionsR.isError)
  const [deletedTemplateIds, setDeletedTemplateIds] = useState([])

  const [sortInputs, setSortInputs] = useState({
    title: '',
  })

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (accessToken) {
      dispatch(fetchTemplatesQuestions())
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
    const isConfirmed = window.confirm('آیا از حذف این سوال مطمعن هستید؟')
    if (isConfirmed) {
      dispatch(deleteTemplatesQuestion(templateId)).then((action) => {
        if (deleteTemplatesQuestion.fulfilled.match(action)) {
          setDeletedTemplateIds((prevIds) => [...prevIds, templateId])
        }
      })
    }
  }

  const handleEditTemplate = (templateId) => {
    navigate(`/edit-template-question/${templateId}`)
  }

  const handleAddTemplate = () => {
    navigate('/add-template-question')
  }

  return (
    <div className='h-full w-full mt-[10px] '>
      <div className='flex flex-row justify-end -mt-8 mb-2'>
        <button
          className=' bg-cyan-600 rounded-md px-4 py-2 text-white mb-2 p-1'
          onClick={handleAddTemplate}
        >
          افزودن سوال
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
        <tbody  className=' divide-y-2 text-sm leading-10  divide-gray-700'>{getTemplates()}</tbody>
      </table>
    </div>
  )
}
export default TemplatesQuestionsMainSection
