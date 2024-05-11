import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'

import { useNavigate } from 'react-router-dom'
import {
  deleteTemplatesTopStudent,
  fetchTemplatesTopStudents,
} from '../../features/templatesTopStudents/templatesTopStudentsSlice'

const TemplatesTopStudentsMainSection = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const templates = useSelector((state) => state.templatesTopStudentsR.entities)
  const isLoading = useSelector(
    (state) => state.templatesTopStudentsR.isLoading
  )
  const isError = useSelector((state) => state.templatesTopStudentsR.isError)
  const [deletedTemplateIds, setDeletedTemplateIds] = useState([])

  const [sortInputs, setSortInputs] = useState({
    student: '',
  })

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (accessToken) {
      dispatch(fetchTemplatesTopStudents())
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
        return template?.student.first_name?.includes(
          sortInputs.student.first_name || ''
        )
        return template?.student.last_name?.includes(
          sortInputs.student.last_name || ''
        )
        return template?.student.national_number?.includes(
          sortInputs.student.national_number || ''
        )
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
          {/* <td>
            <button onClick={() => handleEditTemplate(template.id)}>
              Edit
            </button>
          </td> */}
          <td>{template.student.national_number}</td>
          <td>{template.student.last_name}</td>
          <td>{template.student.first_name}</td>
          <td>{index + 1}</td>
        </tr>
      ))
  }

  const handleDeleteTemplate = (templateId) => {
    const isConfirmed = window.confirm('آیا از حذف این دانش أموز مطمعن هستید؟')
    if (isConfirmed) {
      dispatch(deleteTemplatesTopStudent(templateId)).then((action) => {
        if (deleteTemplatesTopStudent.fulfilled.match(action)) {
          setDeletedTemplateIds((prevIds) => [...prevIds, templateId])
        }
      })
    }
  }

  //   const handleEditTemplate = (templateId) => {
  //     navigate(`/edit-template-TopStudent/${templateId}`)
  //   }

  const handleAddTemplate = () => {
    navigate('/add-template-topstudent')
  }

  return (
    <div className='h-full w-full mt-[10px] '>
      <div className='flex flex-row justify-end -mt-8 mb-2'>
        <button
          className=' bg-cyan-600 rounded-md px-4 py-2 mb-2 p-1'
          onClick={handleAddTemplate}
        >
          افزودن دانش آموز برتر
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
                name='national_number'
                placeholder=' کد ملی '
                value={sortInputs.student.national_number}
                onChange={handleSortInputChange}
              />
            </th>

            <th>
              <input
                className='bg-slate-800 w-[100px]'
                type='text'
                name='last_name'
                placeholder='نام خانوادگی'
                value={sortInputs.student.last_name}
                onChange={handleSortInputChange}
              />
            </th>
            <th>
              <input
                className='bg-slate-800 w-[100px]'
                type='text'
                name='first_name'
                placeholder=' نام '
                value={sortInputs.student.last_name}
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
        <tbody className=' divide-y-2 divide-gray-700 leading-10 text-sm'>{getTemplates()}</tbody>
      </table>
    </div>
  )
}
export default TemplatesTopStudentsMainSection
