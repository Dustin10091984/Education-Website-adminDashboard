import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

// get the list of aboutus starts here
export const fetchAboutus = createAsyncThunk(
  'aboutus/fetchAboutus',
  async (_, { getState }) => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      throw new Error('Access token not found')
    }
    const response = await axios.get(
      'https://api.ebsalar.com/api/v1/admin/about_us/',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  }
)
// get the list of aboutus finishes here

// Edit functionality starts here
export const editAboutus = createAsyncThunk(
  '/aboutus/editAboutus',
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('AccessToken not found')
    }
    try {
      const response = await axios.patch(
        ` https://api.ebsalar.com/api/v1/admin/about_us/${id}/ `,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data // Assuming API returns the updated aboutus data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Edit functionality finishes here

export const aboutusSlice = createSlice({
  name: 'aboutus',
  initialState: {
    entities: [],
    isLoading: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAboutus.fulfilled, (state, action) => {
        state.entities = action.payload.results
        state.isLoading = false
        state.isError = false
      })
      .addCase(fetchAboutus.rejected, (state, action) => {
        state.entities = []
        state.isLoading = false
        state.isError = true
      })
      .addCase(fetchAboutus.pending, (state) => {
        state.isLoading = true
      })
      .addCase(editAboutus.fulfilled, (state, action) => {
        const index = state.entities.findIndex(
          (aboutus) => aboutus.id === action.payload.id
        )
        if (index !== -1) {
          state.entities[index] = action.payload
        }
      })
  },
})
export default aboutusSlice.reducer
