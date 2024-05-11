import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

// get the list of templates starts here
export const fetchTemplatesTournaments = createAsyncThunk(
  'templatesTournaments/fetchTemplatesTournaments',
  async (_, { getState }) => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      throw new Error('Access token not found')
    }
    const response = await axios.get(
      'https://api.ebsalar.com/api/v1/admin/tournament/',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  }
)
// get the list of templates finishes here

// Add template functionality start
export const addTemplatesTournaments = createAsyncThunk(
  'templatesTournaments/addTemplatesTournaments',
  async (templateData, { rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Access token not found')
    }
    try {
      const response = await axios.post(
        `https://api.ebsalar.com/api/v1/admin/tournament/`,
        templateData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Add template functionality finish

// Delete a template starts here
export const deleteTemplatesTournament = createAsyncThunk(
  'templatesTournaments/deleteTemplatesTournaments',
  async (templateId, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Accesstoken not found')
    }
    try {
      const response = await axios.delete(
        `https://api.ebsalar.com/api/v1/admin/tournament/${templateId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (response.status === 200) {
        return templateId
      }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Delete a template finishes here

// Edit functionality starts here
export const editTemplatesTournament = createAsyncThunk(
  '/templatesTournaments/editTemplatesTournament',
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('AccessToken not found')
    }
    try {
      const response = await axios.patch(
        ` https://api.ebsalar.com/api/v1/admin/tournament/${id}/ `,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data // Assuming API returns the updated template data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Edit functionality finishes here

export const templatesTournamentsSlice = createSlice({
  name: 'templates',
  initialState: {
    entities: [],
    isLoading: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplatesTournaments.fulfilled, (state, action) => {
        state.entities = action.payload.results
        state.isLoading = false
        state.isError = false
      })
      .addCase(fetchTemplatesTournaments.rejected, (state, action) => {
        state.entities = []
        state.isLoading = false
        state.isError = true
      })
      .addCase(fetchTemplatesTournaments.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteTemplatesTournament.fulfilled, (state, action) => {
        state.entities = state.entities.filter(
          (template) => template.id !== action.payload
        )
      })
      .addCase(editTemplatesTournament.fulfilled, (state, action) => {
        const index = state.entities.findIndex(
          (template) => template.id === action.payload.id
        )
        if (index !== -1) {
          state.entities[index] = action.payload
        }
      })
      .addCase(addTemplatesTournaments.rejected, (state, action) => {
        state.isError = true
        console.log(action.payload)
      })
  },
})
export default templatesTournamentsSlice.reducer
