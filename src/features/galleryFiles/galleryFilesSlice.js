import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

// get the list of galleryFiles starts here
export const fetchGalleryFiles = createAsyncThunk(
  'galleryFiles/fetchGalleryFiles',
  async (_, { getState }) => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      throw new Error('Access token not found')
    }
    const response = await axios.get(
      'https://api.ebsalar.com/api/v1/admin/gallery_files/',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  }
)
// get the list of galleryFiles finishes here

// Add galleryFiles functionality start
export const addGalleryFiles = createAsyncThunk(
  'galleryFiles/addGalleryFiles',
  async (galleryFilesData, { rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Access token not found')
    }
    try {
      const response = await axios.post(
        `https://api.ebsalar.com/api/v1/admin/gallery_files/`,
        galleryFilesData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data // Assuming API returns the newly created galleryFiles data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Add galleryFiles functionality finish

// Delete a galleryFile starts here
export const deleteGalleryFile = createAsyncThunk(
  'galleryFiles/deleteGalleryFile',
  async (galleryFilesId, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Accesstoken not found')
    }
    try {
      const response = await axios.delete(
        `https://api.ebsalar.com/api/v1/admin/gallery_files/${galleryFilesId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (response.status === 200) {
        return galleryFilesId
      }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Delete a galleryFile finishes here

// Edit functionality starts here
export const editGalleryFile = createAsyncThunk(
  '/galleryFiles/editGalleryFile',
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('AccessToken not found')
    }
    try {
      const response = await axios.patch(
        ` https://api.ebsalar.com/api/v1/admin/gallery_files/${id}/ `,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data // Assuming API returns the updated galleryFiles data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Edit functionality finishes here

export const galleryFilesSlice = createSlice({
  name: 'galleryFiles',
  initialState: {
    entities: [],
    isLoading: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGalleryFiles.fulfilled, (state, action) => {
        state.entities = action.payload.results
        state.isLoading = false
        state.isError = false
      })
      .addCase(fetchGalleryFiles.rejected, (state, action) => {
        state.entities = []
        state.isLoading = false
        state.isError = true
      })
      .addCase(fetchGalleryFiles.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteGalleryFile.fulfilled, (state, action) => {
        state.entities = state.entities.filter(
          (galleryFiles) => galleryFiles.id !== action.payload
        )
      })
      .addCase(editGalleryFile.fulfilled, (state, action) => {
        const index = state.entities.findIndex(
          (galleryFiles) => galleryFiles.id === action.payload.id
        )
        if (index !== -1) {
          state.entities[index] = action.payload
        }
      })
      .addCase(addGalleryFiles.fulfilled, (state, action) => {
        state.entities.push(action.payload)
      })
      .addCase(addGalleryFiles.rejected, (state, action) => {
        state.isError = true
        console.log(action.payload)
      })
  },
})
export default galleryFilesSlice.reducer
