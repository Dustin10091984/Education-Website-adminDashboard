import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

// get the list of staffs starts here
export const fetchStaffs = createAsyncThunk(
  'staffs/fetchStaffs',
  async (_, { getState }) => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      throw new Error('Access token not found')
    }
    const response = await axios.get(
      'https://api.ebsalar.com/api/v1/admin/staff/',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  }
)
// get the list of staffs finishes here

// Register staff functionality start
export const registerStaffOnsite = createAsyncThunk(
  'staffs/registerStaffOnsite',
  async (staffData, { rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Access token not found')
    }
    try {
      const response = await axios.post(
        `https://api.ebsalar.com/api/v1/admin/staff/`,
        staffData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data // Assuming API returns the newly created staff data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Register staff functionality finish

// Delete a staff starts here
export const deleteStaff = createAsyncThunk(
  'staffs/deleteStaff',
  async (staffId, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Accesstoken not found')
    }
    try {
      const response = await axios.delete(
        `https://api.ebsalar.com/api/v1/admin/staff/${staffId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (response.status === 200) {
        return staffId
      }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Delete a staff finishes here

// Edit functionality starts here
export const editStaff = createAsyncThunk(
  '/staffs/editStaff',
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('AccessToken not found')
    }
    try {
      const response = await axios.patch(
        ` https://api.ebsalar.com/api/v1/admin/staff/${id}/ `,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data // Assuming API returns the updated staff data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Edit functionality finishes here

export const staffsSlice = createSlice({
  name: 'staffs',
  initialState: {
    entities: [],
    isLoading: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffs.fulfilled, (state, action) => {
        state.entities = action.payload.results
        state.isLoading = false
        state.isError = false
      })
      .addCase(fetchStaffs.rejected, (state, action) => {
        state.entities = []
        state.isLoading = false
        state.isError = true
      })
      .addCase(fetchStaffs.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.entities = state.entities.filter(
          (staff) => staff.id !== action.payload
        )
      })
      .addCase(editStaff.fulfilled, (state, action) => {
        const index = state.entities.findIndex(
          (staff) => staff.id === action.payload.id
        )
        if (index !== -1) {
          state.entities[index] = action.payload
        }
      })
      .addCase(registerStaffOnsite.fulfilled, (state, action) => {
        state.entities.push(action.payload)
      })
      .addCase(registerStaffOnsite.rejected, (state, action) => {
        state.isError = true
        console.log(action.payload)
      })
  },
})
export default staffsSlice.reducer
