import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

// get the list of subs starts here

//Thunk to fetch submenus of a specific menu
export const fetchSubmenu = createAsyncThunk(
  'subs/fetchSubmenu',
  async (menuId, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Access token not found')
    }
    try {
      const response = await axios.get(
        `https://api.ebsalar.com/api/v1/admin/menu/sub_menu/${menuId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data.results // Adjust depending on the actual response shape
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// get the list of subs finishes here

// get the list of submenus for only description starts here
export const fetchSubs = createAsyncThunk(
  'subs/fetchSubs',
  async (_, { getState }) => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      throw new Error('Access token not found')
    }
    const response = await axios.get(
      'https://api.ebsalar.com/api/v1/admin/sub_menu',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  }
)
// get the list of submenus for only description finishes here

// Add submenu functionality start
export const addSub = createAsyncThunk(
  'sub/addSub',
  async (subData, { rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Access token not found')
    }
    try {
      const response = await axios.post(
        `https://api.ebsalar.com/api/v1/admin/sub_menu/`,
        subData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data // Assuming API returns the newly created sub data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Add submenu functionality finish

// Delete a sub starts here
export const deleteSub = createAsyncThunk(
  'subs/deleteSub',
  async (subId, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Accesstoken not found')
    }
    try {
      const response = await axios.delete(
        `https://api.ebsalar.com/api/v1/admin/sub_menu/${subId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (response.status === 200) {
        return subId
      }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Delete a sub finishes here

// Edit functionality starts here
export const editSub = createAsyncThunk(
  '/subs/editSub',
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('AccessToken not found')
    }
    try {
      const response = await axios.patch(
        ` https://api.ebsalar.com/api/v1/admin/sub_menu/${id}/ `,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data // Assuming API returns the updated sub data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Edit functionality finishes here

export const submenusSlice = createSlice({
  name: 'subs',
  initialState: {
    entities: [],
    isLoading: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubmenu.fulfilled, (state, action) => {
        // Assuming you want to store the submenus within the entities array
        state.entities = action.payload
        state.isLoading = false
        state.isError = false
      })
      .addCase(fetchSubmenu.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
      })
      .addCase(fetchSubmenu.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchSubs.fulfilled, (state, action) => {
        state.entities = action.payload.results
        state.isLoading = false
        state.isError = false
      })
      .addCase(fetchSubs.rejected, (state, action) => {
        state.entities = []
        state.isLoading = false
        state.isError = true
      })
      .addCase(fetchSubs.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteSub.fulfilled, (state, action) => {
        state.entities = state.entities.filter(
          (sub) => sub.id !== action.payload
        )
      })
      .addCase(editSub.fulfilled, (state, action) => {
        const index = state.entities.findIndex(
          (sub) => sub.id === action.payload.id
        )
        if (index !== -1) {
          state.entities[index] = action.payload
        }
      })
      .addCase(addSub.fulfilled, (state, action) => {
        state.entities.push(action.payload)
      })
      .addCase(addSub.rejected, (state, action) => {
        state.isError = true
        console.log(action.payload)
      })
  },
})
export default submenusSlice.reducer
