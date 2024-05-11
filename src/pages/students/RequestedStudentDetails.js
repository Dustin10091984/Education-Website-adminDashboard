import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import { FaArrowRightLong } from "react-icons/fa6";




const RequestedStudentDetails = () => {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const [requestedStudent, setRequestedStudent] = useState(null)
  const [error, setError] = useState()
  const [approvalData, setApprovalData] = useState({
    approve: false,
    reject: false,
    notification_message: '',
  })

  useEffect(() => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    const accessToken = Cookies.get('authToken')

    // Fetch the student data
    const fetchData = async () => {
      if (!accessToken) {
        setError('No access token found')
        return
      }
      try {
        const response = await axios.get(
          `https://api.ebsalar.com/api/v1/admin/student_request/${studentId}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        setRequestedStudent(response.data.results)
        console.log(response.data.results.identityـcertificate)
      } catch (error) {
        console.error('Error fetching student details:', error)
      }
    }

    fetchData()
  }, [studentId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setApprovalData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleApproveRejectChange = (e) => {
    const { name, checked } = e.target
    // Ensure that approve and reject are not both selected
    setApprovalData((prevData) => ({
      ...prevData,
      approve: false,
      reject: false,
      [name]: checked,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      console.error('Access token not found')
      return
    }
    try {
      const response = await axios.patch(
        `https://api.ebsalar.com/api/v1/admin/student_request/${studentId}/`,
        approvalData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      console.log(response.data)
      navigate('/adminDashboard')
    } catch (error) {
      console.error('Error sending approval data:', error)
    }
  }

  if (!requestedStudent) return <div>Loading...</div>

  return (
    <div className='bg-[#0A1437] flex justify-center items-center flex-col w-full p-10'>

      <div className='fixed h-96 -rotate-90 left-12  top-4'>
        <h2 className='text-2xl    tracking-wider    font-semibold text-gray-500 '>
          Requested Student Details
        </h2>
      </div>

<div className='grid grid-cols-2 w-full gap-6'>
{/* <grid item 1> */}
<div className='w-full flex flex-col justify-center  items-center'>

            <p className='text-gray-200 py-2'>عکس پروفایل</p>
            <img src={`${requestedStudent.avatar}`} alt='avatar' className='max-h-[600px]' />
    </div>
{/* </grid item 1> */}





{/* <grid item 2> */}

<div className='flex flex-col min-h-screen  space-y-6 justify-center items-center' >

        <p className='text-gray-200 w-full text-center'>نام: {requestedStudent.first_name}</p>
        <p className='text-gray-200 w-full text-center'>نام خانوادگی: {requestedStudent.last_name}</p>
        <p className='text-gray-200 w-full text-center'>کد ملی دانش آموز: {requestedStudent.national_number}</p>
        <p className='text-gray-200 w-full text-center'>جنسیت: {requestedStudent.gender}</p>
        <p className='text-gray-200 w-full text-center'>شماره تلفن ثابت: {requestedStudent.landline_phone}</p>
        <p className='text-gray-200 w-full text-center'>آدرس دقیق منزل: {requestedStudent.address}</p>
        <p className='text-gray-200 w-full text-center'>شهر محل اقام: {requestedStudent.city}</p>
        <p className='text-gray-200 w-full text-center'>تاریخ تولد: {requestedStudent.birth_day_solar}</p>
        <p className='text-gray-200 w-full text-center'>مدرسه در حال تحصیل: {requestedStudent.school}</p>
        <p className='text-gray-200 w-full text-center'>شغل پدر: {requestedStudent.father_job}</p>
        <p className='text-gray-200 w-full text-center'>شغل مادر: {requestedStudent.mother_job}</p>
        <p className='text-gray-200 w-full text-center'>شماره تماس ویژه پدر: {requestedStudent.father_phone}</p>
        <p className='text-gray-200 w-full text-center'>شماره تماس ویژه مادر: {requestedStudent.mother_phone}</p>
        <p className='text-gray-200 w-full text-center'>پایه: {requestedStudent.level}</p>
        <p className='text-gray-200 w-full text-center'>دانش آموز قبلی: {requestedStudent.former ? 'Yes' : 'No'}</p>
</div>

{/* </grid item 2> */}


      
{/* </grid item 3> */}

<div className='w-full flex justify-center  items-center'>

<div className='w-full flex flex-col justify-center  items-center border-t-2 border-gray-500'>
        <p className='text-gray-200 py-2'>عکس کارت ملی:</p>
        <img src={`${requestedStudent.national_number_image}`} className='max-h-screen' />
    </div>

</div>
{/* </grid item 3> */}

  {/* grid */}
<div>

<div className='w-full flex flex-col justify-center  items-center border-t-2 border-gray-500'>

        <p className='text-gray-300 py-2'>عکس شناسنامه</p>
        <img src={`${requestedStudent.identityـcertificate}`}  className='max-h-screen'/>
    </div>

</div>

  {/* grid */}

</div>

<div className='w-full py-6 border-t-2 border-gray-500 mt-6'>

   <form onSubmit={handleSubmit} className='flex flex-row-reverse justify-around items-center  w-full'>

    <div>
          <label className='flex justify-around items-center  text-green-400'>
            قبول درخواست
            <input
              type='checkbox'
              name='approve'
              checked={approvalData.approve}
              onChange={handleApproveRejectChange}
              className='form-checkbox mx-4 h-5 w-5'
            />
          </label>

    </div>

    <div>
    <label className='flex justify-around items-center  text-rose-400'>
            رد درخواست
            <input
              type='checkbox'
              name='reject'
              checked={approvalData.reject}
              onChange={handleApproveRejectChange}
              className='form-checkbox mx-4 h-5 w-5'
            />
          </label>
    </div>

    <div className=''>
          <label className='flex flex-row-reverse text-gray-400 justify-center items-center '>
            پیام
            <input
              type='text'
              name='notification_message'
              value={approvalData.notification_message}
              onChange={handleInputChange}
              className='block w-full p-2 mx-2 border border-gray-300 rounded'
            />
          </label>
    </div>

<div>
          <button
            type='submit'
            className='w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            تایید
          </button>

</div>

        </form>

<div  className=' fixed top-5 right-5'>

        <button
          onClick={() => navigate(-1)}
          className=''   >
         <FaArrowRightLong className='text-gray-200 text-2xl'/>
        </button>
</div>
</div>

    </div>
  )
}

export default RequestedStudentDetails
