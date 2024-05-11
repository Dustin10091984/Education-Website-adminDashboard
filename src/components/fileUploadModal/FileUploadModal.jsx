import React, { useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

const FileUploadModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null)

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file first.')
      return
    }

    const accessToken = Cookies.get('authToken')
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(
        'https://api.ebsalar.com/api/v1/admin/student_excel/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      alert('File uploaded successfully')
      onClose() // Close the modal on successful upload
    } catch (error) {
      alert('Error uploading file: ' + error.message)
    }
  }

  if (!isOpen) return null

  return (
    <div className='modal'>
      <div className='modal-content'>
        <span className='close' onClick={onClose}>
          &times;
        </span>
        <h2>Upload File</h2>
        <input type='file' onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Upload</button>
      </div>
    </div>
  )
}

export default FileUploadModal
