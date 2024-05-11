import { VscGitPullRequestCreate } from 'react-icons/vsc'
import Performance from '../adminDashboard/Performance'
import ChartBarStudent from '../adminDashboard/ChartBarStudent'
import TableClassM from '../adminDashboard/TableClassM'
import ChartStudent from '../adminDashboard/ChartStudent'
import { Link } from 'react-router-dom'
import { FaFileSignature } from 'react-icons/fa'
import {
  FaBoxesPacking,
  FaChartPie,
  FaPalette,
  FaWandMagicSparkles,
} from 'react-icons/fa6'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

const LandingMainSection = () => {
  const [requestedStudents, setRequestedStudents] = useState('')

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (accessToken) {
      const fetchStudents = async () => {
        try {
          const response = await axios.get(
            'https://api.ebsalar.com/api/v1/admin/panel/ui/',
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          setRequestedStudents(response.data.results)
        } catch (error) {
          console.log('Error fetching list', error)
        }
      }
      fetchStudents()
    }
  }, [])

  return (
    <div className='flex justify-center items-center w-full px-[1%] mt-20 mr-20'>
      <div className='grid grid-cols-5 gap-4 h-full w-full   '>
        
        <Link to='/adminDashboard'>
          <div className='   bg-[#18214775] rounded-md shadow-2xl shadow-black py-6 px-6'>
            <div className='flex flex-col space-y-4 justify-between items-center '>
              <div className=' border border-blue-400 flex justify-around w-full items-center shadow-xl shadow-black bg-blue-400   rounded-md'>
                <FaFileSignature className='text--[#18214775] text-3xl' />
                <p className='text-black  text-center text-3xl'>
                  {requestedStudents.request_students}
                </p>
              </div>

      
                 <p className='text-gray-50 text-xs '>
                  دانش آموزان در انتظار احراز
                </p>
       
            </div>
          </div>
        </Link>




        <Link to='/orders'>
          <div className='   bg-[#18214775] rounded-md shadow-2xl shadow-black py-6 px-6'>
          <div className='flex flex-col space-y-4 justify-between items-center '>
          <div className=' border border-blue-400 flex justify-around w-full items-center shadow-xl shadow-black bg-blue-400   rounded-md'>
                <FaBoxesPacking className='text--[#18214775] text-3xl' />
                <p className='text-black  text-center text-3xl'>
                  {requestedStudents.payed_orders}
                </p>
              </div>

         
                <p className='text-gray-50 text-xs '>
                  سفارشات در انتظار تایید
                </p>
         
            </div>
          </div>
        </Link>



        <Link to='/products'>
          <div className='   bg-[#18214775] rounded-md shadow-2xl shadow-black py-6 px-6'>
            <div className='flex flex-col space-y-4 justify-between items-center '>
            <div className=' border border-blue-400 flex justify-around w-full items-center shadow-xl shadow-black bg-blue-400   rounded-md'>
                <FaWandMagicSparkles className='text--[#18214775] text-3xl' />
                <p className='text-black  text-center text-3xl'>
                  {requestedStudents.products}
                </p>
              </div>

              <div className='flex flex-col space-y-4'>
                <p className='text-gray-50 whitespace-nowrap text-xs '>
                  دوره ها و محصولات
                </p>
              </div>
            </div>
          </div>
        </Link>




        <Link to='/reports'>
          <div className=' h-full flex justify-center items-center bg-[#28323F] rounded-md shadow-2xl shadow-black py-6 px-6'>
            <div className='flex flex-col space-y-4 w-full justify-between items-center '>
            <div className=' border border-blue-400 py-1 flex justify-around w-full items-center shadow-xl shadow-black bg-blue-400   rounded-md'>
                <FaChartPie className='text--[#18214775] text-3xl' />
              </div>

                <p className='text-gray-50 text-xs whitespace-nowrap '> گزارش های مدیریتی </p>
            </div>
          </div>
        </Link>

        <Link to='/UIMain'>
        <div className=' h-full flex justify-center items-center bg-[#28323F] rounded-md shadow-2xl shadow-black py-6 px-6'>
            <div className='flex flex-col space-y-4 w-full justify-between items-center '>
            <div className=' border border-blue-400 py-1 flex justify-around w-full items-center shadow-xl shadow-black bg-blue-400   rounded-md'>
                <FaPalette className='text--[#18214775] text-3xl' />
              </div>
                <p className='text-gray-50 text-xs  whitespace-nowrap'> ویرایش صفحات </p>

            </div>
          </div>
        </Link>





        <div className='  bg-[#28323F]  col-span-2 rounded-md shadow-2xl shadow-black py-6 px-6'>
          <ChartBarStudent />
        </div>
        <div className='col-span-3 bg-[#18214775] shadow-2xl shadow-black rounded-md '>
          <ChartStudent />
        </div>

        <div className='  bg-[#28323F] col-span-2  rounded-md shadow-2xl shadow-black py-6 px-6'>
          <Performance />
        </div>

        <div className='col-span-3 bg-[#18214775] shadow-2xl shadow-black rounded-md '>
          {/* <TableClassM/> */}
        </div>
      </div>
    </div>
  )
}
export default LandingMainSection
