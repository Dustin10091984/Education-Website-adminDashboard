import Cookies from 'js-cookie'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (_, { getState }) => {
    // Access the token from the state or storage
    const accessToken = Cookies.get('authToken')

    // Check if the accessToken exists
    if (!accessToken) {
      throw new Error('Access token not found')
    }

    // Make the API call with the Authorization header
    const response = await axios.get(
      'https://api.ebsalar.com/api/v1/admin/student/',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  }
)
// Register student functionality start
export const registerStudentOnsite = createAsyncThunk(
  'students/registerStudentOnsite',
  async (studentData, { rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Access token not found')
    }
    try {
      const response = await axios.post(
        `https://api.ebsalar.com/api/v1/admin/student/`,
        studentData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data // Assuming API returns the newly created student data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Register student functionality finish

// delete functionality start
export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (studentId, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Accesstoken not found')
    }
    try {
      const response = await axios.delete(
        `https://api.ebsalar.com/api/v1/admin/student/${studentId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (response.status === 200) {
        return studentId
      }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// delete functionality finish

// edit functionality start
export const editStudent = createAsyncThunk(
  'students/editStudent',
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('AccessToken not found')
    }
    try {
      const response = await axios.patch(
        `https://api.ebsalar.com/api/v1/admin/student/${id}/`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data // Assuming API returns the updated student data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// edit functionality finish

// Add excel file functionality start
export const addExcels = createAsyncThunk(
  'excels/addExcels',
  async (excelFilesData, { rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Access token not found')
    }
    try {
      const response = await axios.post(
        `https://api.ebsalar.com/api/v1/admin/student_excel/`,
        excelFilesData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data // Assuming API returns the newly created excelFile data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Add excel file functionality finish

export const studentsSlice = createSlice({
  name: 'students',
  initialState: {
    entities: [],
    isLoading: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.entities = action.payload.results
        state.isLoading = false
        state.isError = false
      })
      .addCase(fetchStudents.rejected, (state) => {
        state.entities = []
        state.isLoading = false
        state.isError = true
      })
      .addCase(fetchStudents.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.entities = state.entities.filter(
          (student) => student.id !== action.payload
        )
      })
      .addCase(editStudent.fulfilled, (state, action) => {
        const index = state.entities.findIndex(
          (student) => student.id === action.payload.id
        )
        if (index !== -1) {
          state.entities[index] = action.payload
        }
      })
      .addCase(registerStudentOnsite.fulfilled, (state, action) => {
        state.entities.push(action.payload)
      })
      .addCase(registerStudentOnsite.rejected, (state, action) => {
        state.isError = true
        console.error(action.payload)
      })
      .addCase(addExcels.fulfilled, (state, action) => {
        state.entities.push(action.payload)
      })
  },
})
export default studentsSlice.reducer
