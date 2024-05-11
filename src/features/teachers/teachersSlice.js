import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

// get the list of teachers starts here
export const fetchTeachers = createAsyncThunk(
  'teachers/fetchTeachers',
  async (_, { getState }) => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      throw new Error('Access token not found')
    }
    const response = await axios.get(
      'https://api.ebsalar.com/api/v1/admin/teacher/',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  }
)
// get the list of teachers finishes here

// Register teacher functionality start
export const registerTeacherOnsite = createAsyncThunk(
  'teachers/registerTeacherOnsite',
  async (teacherData, { rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Access token not found')
    }
    try {
      const response = await axios.post(
        `https://api.ebsalar.com/api/v1/admin/teacher/`,
        teacherData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data // Assuming API returns the newly created teacher data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Register teacher functionality finish

// Delete a teacher starts here
export const deleteTeacher = createAsyncThunk(
  'teachers/deleteTeacher',
  async (teacherId, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Accesstoken not found')
    }
    try {
      const response = await axios.delete(
        `https://api.ebsalar.com/api/v1/admin/teacher/${teacherId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (response.status === 200) {
        return teacherId
      }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Delete a teacher finishes here

// Edit functionality starts here
export const editTeacher = createAsyncThunk(
  '/teachers/editTeacher',
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('AccessToken not found')
    }
    try {
      const response = await axios.patch(
        ` https://api.ebsalar.com/api/v1/admin/teacher/${id}/ `,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data // Assuming API returns the updated teacher data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Edit functionality finishes here

export const teachersSlice = createSlice({
  name: 'teachers',
  initialState: {
    entities: [],
    isLoading: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.entities = action.payload.results
        state.isLoading = false
        state.isError = false
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.entities = []
        state.isLoading = false
        state.isError = true
      })
      .addCase(fetchTeachers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.entities = state.entities.filter(
          (teacher) => teacher.id !== action.payload
        )
      })
      .addCase(editTeacher.fulfilled, (state, action) => {
        const index = state.entities.findIndex(
          (teacher) => teacher.id === action.payload.id
        )
        if (index !== -1) {
          state.entities[index] = action.payload
        }
      })
      .addCase(registerTeacherOnsite.fulfilled, (state, action) => {
        state.entities.push(action.payload)
      })
      .addCase(registerTeacherOnsite.rejected, (state, action) => {
        state.isError = true
        console.log(action.payload)
      })
  },
})
export default teachersSlice.reducer
