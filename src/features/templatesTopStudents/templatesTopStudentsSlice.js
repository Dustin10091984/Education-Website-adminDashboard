import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

// get the list of templates starts here
export const fetchTemplatesTopStudents = createAsyncThunk(
  'templatesTopStudents/fetchTemplatesTopStudents',
  async (_, { getState }) => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      throw new Error('Access token not found')
    }
    const response = await axios.get(
      'https://api.ebsalar.com/api/v1/admin/top_student/',
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
export const addTemplatesTopStudents = createAsyncThunk(
  'templatesTopStudents/addTemplatesTopStudents',
  async (templateData, { rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Access token not found')
    }
    try {
      const response = await axios.post(
        `https://api.ebsalar.com/api/v1/admin/top_student/`,
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
export const deleteTemplatesTopStudent = createAsyncThunk(
  'templatesTopStudents/deleteTemplatesTopStudents',
  async (templateId, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Accesstoken not found')
    }
    try {
      const response = await axios.delete(
        `https://api.ebsalar.com/api/v1/admin/top_student/${templateId}/`,
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
// export const editTemplatesTopStudent = createAsyncThunk(
//   '/templatesTopStudents/editTemplatesTopStudent',
//   async ({ id, updatedData }, { getState, rejectWithValue }) => {
//     const accessToken = Cookies.get('authToken')
//     if (!accessToken) {
//       return rejectWithValue('AccessToken not found')
//     }
//     try {
//       const response = await axios.patch(
//         ` https://api.ebsalar.com/api/v1/admin/top_student/${id}/ `,
//         updatedData,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       )
//       return response.data // Assuming API returns the updated template data
//     } catch (error) {
//       return rejectWithValue(error.response.data)
//     }
//   }
// )
// Edit functionality finishes here

export const templatesTopStudentsSlice = createSlice({
  name: 'templates',
  initialState: {
    entities: [],
    isLoading: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplatesTopStudents.fulfilled, (state, action) => {
        state.entities = action.payload.results
        state.isLoading = false
        state.isError = false
      })
      .addCase(fetchTemplatesTopStudents.rejected, (state, action) => {
        state.entities = []
        state.isLoading = false
        state.isError = true
      })
      .addCase(fetchTemplatesTopStudents.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteTemplatesTopStudent.fulfilled, (state, action) => {
        state.entities = state.entities.filter(
          (template) => template.id !== action.payload
        )
      })
      //   .addCase(editTemplatesTopStudent.fulfilled, (state, action) => {
      //     const index = state.entities.findIndex(
      //       (template) => template.id === action.payload.id
      //     )
      //     if (index !== -1) {
      //       state.entities[index] = action.payload
      //     }
      //   })
      .addCase(addTemplatesTopStudents.rejected, (state, action) => {
        state.isError = true
        console.log(action.payload)
      })
  },
})
export default templatesTopStudentsSlice.reducer
