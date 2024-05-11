import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import {
  deleteGalleryFile,
  fetchGalleryFiles,
} from '../../features/galleryFiles/galleryFilesSlice'

const GalleryFilesMainSection = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const galleryFiles = useSelector((state) => state.galleryFilesR.entities)
  const isLoading = useSelector((state) => state.galleryFilesR.isLoading)
  const isError = useSelector((state) => state.galleryFilesR.isError)
  const [deletedGalleryFileIds, setDeletedGalleryFileIds] = useState([])

  const [sortInputs, setSortInputs] = useState({
    description: '',
  })

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (accessToken) {
      dispatch(fetchGalleryFiles())
    }
  }, [dispatch])

  if (isLoading) return <div className='text-white'>Loading...</div>
  if (isError) return <div>Error loading galleryFiles</div>

  // handle sortning starts here
  const handleSortInputChange = (e) => {
    const { name, value } = e.target
    setSortInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }))
  }
  // handle sortning finishes here

  const getGalleryFiles = () => {
    if (!galleryFiles) return []

    return (
      galleryFiles
        // .filter((galleryFile) => {
        //   return galleryFile?.description?.includes(sortInputs.description || '')
        //   return galleryFile?.description?.includes(sortInputs.description || '')
        // })
        .map((galleryFile, index) => (
          <tr key={galleryFile.id} className='text-white text-center'>
            <td>
              {galleryFile.deleted ? (
                <button disabled>Deleted</button>
              ) : (
                <button onClick={() => handleDeleteGalleryFile(galleryFile.id)}>
                  حذف
                </button>
              )}
            </td>
            <td>
              <button onClick={() => handleEditGalleryFile(galleryFile.id)}>
                ویرایش
              </button>
            </td>
            <td>{galleryFile.description}</td>
            <td>{index + 1}</td>
          </tr>
        ))
    )
  }

  const handleDeleteGalleryFile = (galleryFileId) => {
    const isConfirmed = window.confirm('آیا از حذف این گالری مطمعن هستید؟')
    if (isConfirmed) {
      dispatch(deleteGalleryFile(galleryFileId)).then((action) => {
        if (deleteGalleryFile.fulfilled.match(action)) {
          setDeletedGalleryFileIds((prevIds) => [...prevIds, galleryFileId])
        }
      })
    }
  }

  const handleEditGalleryFile = (galleryFileId) => {
    navigate(`/edit-gallery-file/${galleryFileId}`)
  }

  const handleAddGalleryFile = () => {
    navigate('/add-gallery-file')
  }

  return (
    <div className='h-full w-full mt-[10px] '>
      <div className='flex flex-row justify-end -mt-8 mb-2'>
        <button
          className=' bg-cyan-600 rounded-md mb-2 px-4 py-2 '
          onClick={handleAddGalleryFile}
        >
          افزودن گالری
        </button>
      </div>
      <table className='table-fixed w-full'>
        <thead>
          <tr className='text-white text-center  bg-slate-800'>
            <th className='flex items-center py-2  justify-center'>
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
                name='description'
                placeholder='توضیحات'
                value={sortInputs.description}
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
        <tbody className=' divide-y-2  divide-gray-700 text-sm leading-8'>{getGalleryFiles()}</tbody>
      </table>
    </div>
  )
}
export default GalleryFilesMainSection
