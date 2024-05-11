// import styles from './index.css';

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { AgGridReact } from 'ag-grid-react'
import React, {
  StrictMode,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { createRoot } from "react-dom/client";
import axios from 'axios'
// import { CiSettings } from "react-icons/ci";
// import { FaRegCircleUser } from "react-icons/fa6";
import TableClass from './TableClass'
import { FaEye } from 'react-icons/fa'
import { CiEdit } from 'react-icons/ci'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { fetchClassrooms } from '../../features/classrooms/classroomsSlice'

const TableClassM = () => {
  const dispatch = useDispatch()
  const classrooms = useSelector((state) => state.classroomsR.entities) // Adjust the state path as necessary
  const isLoading = useSelector((state) => state.classroomsR.isLoading)
  const isError = useSelector((state) => state.classroomsR.isError)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchClassrooms())
  }, [dispatch])

  const [RowSelected, setRowSelected] = useState()
  const CustomButtonComponent = (props) => {
    return (
      <button
        className='px-8 h-8 mt-1 flex items-center w-30 rounded-md '
        onClick={() => {
          navigate(`/classroom-detail/${props.data.id}`, {
            state: { ...props.data },
          }) // Modify this line
        }}
      >
        <FaEye className='shadow' color='#61A5FB' size={25} />
      </button>
    )
  }
  console.log(RowSelected)

  useEffect(() => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      navigate('/login')
    }
  }, [])

  const containerStyle = useMemo(
    () => ({ height: 400, fontFamily: 'IRANSansWeb' }),
    []
  )
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), [])
  // const [rowData, setRowData] = useState()
  const [columnDefs, setColumnDefs] = useState([
    { field: 'id' },
    { field: 'class_number' },
    { field: 'course' },
    { field: 'online' },
    { field: 'students_count' },
    { field: 'teacher.first_name' },
    { field: 'teacher.last_name' },
    { field: 'term' },
    { field: 'year' },
    { field: 'level' },
    { field: 'Details', cellRenderer: CustomButtonComponent },
  ])
  const defaultColDef = useMemo(() => {
    return {
      editable: false,
      filter: true,
    }
  }, [])

  const rowData = useMemo(() => {
    if (!isLoading && !isError) {
      return classrooms
    }
    // Handle loading and error states as appropriate
    return []
  }, [classrooms, isLoading, isError])

  const [ShowModel, setShowModel] = useState(false)

  return (
    <div style={containerStyle} className='w-full'>
      <div
        style={gridStyle}
        className={'ag-theme-quartz-dark  h-[90%] w-[90%]'}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          sideBar={true}
          enableRtl={true}
          suppressMenuHide={true}
          onGridRrowDataeady={rowData}
          style={{ fontFamily: 'IRANSansWeb' }}
        />
      </div>

      {(() => {
        if (rowData && ShowModel) {
          return (
            <TableClass
              ShowModel={ShowModel}
              setShowModel={setShowModel}
              rowData={rowData}
              RowSelected={RowSelected}
            />
          )
        }
      })()}
    </div>
  )
}
export default TableClassM
