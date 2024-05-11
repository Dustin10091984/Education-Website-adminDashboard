import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

// get the list of levels starts here
export const fetchLevels = createAsyncThunk(
  'levels/fetchLevels',
  async (_, { getState }) => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      throw new Error('Access token not found')
    }
    const response = await axios.get(
      'https://api.ebsalar.com/api/v1/admin/level/',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  }
)
// get the list of levels finishes here

// Add level  functionality start
export const addLevel = createAsyncThunk(
  'level/addLevel',
  async (levelData, { rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Access token not found')
    }
    try {
      const response = await axios.post(
        `https://api.ebsalar.com/api/v1/admin/level/`,
        levelData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data // Assuming API returns the newly created level data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Add level functionality finish

// Delete a level starts here
export const deleteLevel = createAsyncThunk(
  'levels/deleteLevel',
  async (levelId, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Accesstoken not found')
    }
    try {
      const response = await axios.delete(
        `https://api.ebsalar.com/api/v1/admin/level/${levelId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (response.status === 200) {
        return levelId
      }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Delete a level finishes here

// Edit functionality starts here
export const editLevel = createAsyncThunk(
  '/levels/editLevel',
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('AccessToken not found')
    }
    try {
      const response = await axios.patch(
        ` https://api.ebsalar.com/api/v1/admin/level/${id}/ `,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data // Assuming API returns the updated level data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Edit functionality finishes here

export const levelsSlice = createSlice({
  name: 'levels',
  initialState: {
    entities: [],
    isLoading: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLevels.fulfilled, (state, action) => {
        state.entities = action.payload.results
        state.isLoading = false
        state.isError = false
      })
      .addCase(fetchLevels.rejected, (state, action) => {
        state.entities = []
        state.isLoading = false
        state.isError = true
      })
      .addCase(fetchLevels.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteLevel.fulfilled, (state, action) => {
        state.entities = state.entities.filter(
          (level) => level.id !== action.payload
        )
      })
      .addCase(editLevel.fulfilled, (state, action) => {
        const index = state.entities.findIndex(
          (level) => level.id === action.payload.id
        )
        if (index !== -1) {
          state.entities[index] = action.payload
        }
      })
      .addCase(addLevel.fulfilled, (state, action) => {
        state.entities.push(action.payload)
      })
      .addCase(addLevel.rejected, (state, action) => {
        state.isError = true
        console.log(action.payload)
      })
  },
})
export default levelsSlice.reducer
