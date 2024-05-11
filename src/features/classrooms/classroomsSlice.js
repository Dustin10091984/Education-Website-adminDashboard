import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

// get the list of classrooms starts here
export const fetchClassrooms = createAsyncThunk(
  'classrooms/fetchClassrooms',
  async (_, { getState }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      throw new Error('Access token not found')
    }
    const response = await axios.get(
      'https://api.ebsalar.com/api/v1/admin/class_room',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  }
)
// get the list of classrooms finishes here

// Add classroom functionality start
export const addClassroom = createAsyncThunk(
  'classrooms/addClassroom',
  async (classroomData, { rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Access token not found')
    }
    try {
      const response = await axios.post(
        `https://api.ebsalar.com/api/v1/admin/class_room/`,
        classroomData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data // Assuming API returns the newly created classroom data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Add classroom functionality finish

// Delete starts here
export const deleteClassroom = createAsyncThunk(
  'classrooms/deleteClassroom',
  async (classroomId, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Accesstoken not found')
    }
    try {
      const response = await axios.delete(
        `https://api.ebsalar.com/api/v1/admin/class_room/${classroomId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (response.status === 200) {
        return classroomId
      }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Delete finishes here

// Edit functionality starts here
export const editClassroom = createAsyncThunk(
  '/classrooms/editClassroom',
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('AccessToken not found')
    }
    try {
      const response = await axios.patch(
        ` https://api.ebsalar.com/api/v1/admin/class_room/${id}/ `,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data // Assuming API returns the updated classrooms data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Edit functionality finishes here

export const classroomsSlice = createSlice({
  name: 'classrooms',
  initialState: {
    entities: [],
    isLoading: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassrooms.fulfilled, (state, action) => {
        state.entities = action.payload.results
        state.isLoading = false
        state.isError = false
      })
      .addCase(fetchClassrooms.rejected, (state, action) => {
        state.entities = []
        state.isLoading = false
        state.isError = true
      })
      .addCase(fetchClassrooms.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteClassroom.fulfilled, (state, action) => {
        state.entities = state.entities.filter(
          (classroom) => classroom.id !== action.payload
        )
      })
      .addCase(editClassroom.fulfilled, (state, action) => {
        const index = state.entities.findIndex(
          (classroom) => classroom.id === action.payload.id
        )
        if (index !== -1) {
          state.entities[index] = action.payload
        }
      })
      .addCase(addClassroom.fulfilled, (state, action) => {
        state.entities.push(action.payload)
      })
      .addCase(addClassroom.rejected, (state, action) => {
        state.isError = true
        console.log(action.payload)
      })
  },
})

export default classroomsSlice.reducer
