import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

// get the list of departments starts here
export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (_, { getState }) => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      throw new Error('Access token not found')
    }
    const response = await axios.get(
      'https://api.ebsalar.com/api/v1/admin/department/',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  }
)
// get the list of departments finishes here

// Add department  functionality start
export const addDepartment = createAsyncThunk(
  'department/addDepartment',
  async (departmentData, { rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Access token not found')
    }
    try {
      const response = await axios.post(
        `https://api.ebsalar.com/api/v1/admin/department/`,
        departmentData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data // Assuming API returns the newly created department data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Add department functionality finish

// Delete a department starts here
export const deleteDepartment = createAsyncThunk(
  'departments/deleteDepartment',
  async (departmentId, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Accesstoken not found')
    }
    try {
      const response = await axios.delete(
        `https://api.ebsalar.com/api/v1/admin/department/${departmentId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (response.status === 200) {
        return departmentId
      }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Delete a department finishes here

// Edit functionality starts here
export const editDepartment = createAsyncThunk(
  '/departments/editDepartment',
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('AccessToken not found')
    }
    try {
      const response = await axios.patch(
        ` https://api.ebsalar.com/api/v1/admin/department/${id}/ `,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data // Assuming API returns the updated department data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Edit functionality finishes here

export const departmentsSlice = createSlice({
  name: 'departments',
  initialState: {
    entities: [],
    isLoading: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.entities = action.payload.results
        state.isLoading = false
        state.isError = false
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.entities = []
        state.isLoading = false
        state.isError = true
      })
      .addCase(fetchDepartments.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.entities = state.entities.filter(
          (department) => department.id !== action.payload
        )
      })
      .addCase(editDepartment.fulfilled, (state, action) => {
        const index = state.entities.findIndex(
          (department) => department.id === action.payload.id
        )
        if (index !== -1) {
          state.entities[index] = action.payload
        }
      })
      .addCase(addDepartment.fulfilled, (state, action) => {
        state.entities.push(action.payload)
      })
      .addCase(addDepartment.rejected, (state, action) => {
        state.isError = true
        console.log(action.payload)
      })
  },
})
export default departmentsSlice.reducer
