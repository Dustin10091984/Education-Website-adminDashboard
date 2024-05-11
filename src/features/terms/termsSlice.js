import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

// get the list of terms starts here
export const fetchTerms = createAsyncThunk(
  'terms/fetchTerms',
  async (_, { getState }) => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      throw new Error('Access token not found')
    }
    const response = await axios.get(
      'https://api.ebsalar.com/api/v1/admin/term/',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  }
)
// get the list of terms finishes here

// Add term  functionality start
export const addTerm = createAsyncThunk(
  'term/addTerm',
  async (termData, { rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Access token not found')
    }
    try {
      const response = await axios.post(
        `https://api.ebsalar.com/api/v1/admin/term/`,
        termData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data // Assuming API returns the newly created term data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Add term functionality finish

// Delete a term starts here
export const deleteTerm = createAsyncThunk(
  'terms/deleteTerm',
  async (termId, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Accesstoken not found')
    }
    try {
      const response = await axios.delete(
        `https://api.ebsalar.com/api/v1/admin/term/${termId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (response.status === 200) {
        return termId
      }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Delete a term finishes here

// Edit functionality starts here
export const editTerm = createAsyncThunk(
  '/terms/editTerm',
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('AccessToken not found')
    }
    try {
      const response = await axios.patch(
        ` https://api.ebsalar.com/api/v1/admin/term/${id}/ `,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data // Assuming API returns the updated term data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Edit functionality finishes here

export const termsSlice = createSlice({
  name: 'terms',
  initialState: {
    entities: [],
    isLoading: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTerms.fulfilled, (state, action) => {
        state.entities = action.payload.results
        state.isLoading = false
        state.isError = false
      })
      .addCase(fetchTerms.rejected, (state, action) => {
        state.entities = []
        state.isLoading = false
        state.isError = true
      })
      .addCase(fetchTerms.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteTerm.fulfilled, (state, action) => {
        state.entities = state.entities.filter(
          (term) => term.id !== action.payload
        )
      })
      .addCase(editTerm.fulfilled, (state, action) => {
        const index = state.entities.findIndex(
          (term) => term.id === action.payload.id
        )
        if (index !== -1) {
          state.entities[index] = action.payload
        }
      })
      .addCase(addTerm.fulfilled, (state, action) => {
        state.entities.push(action.payload)
      })
      .addCase(addTerm.rejected, (state, action) => {
        state.isError = true
        console.log(action.payload)
      })
  },
})
export default termsSlice.reducer
