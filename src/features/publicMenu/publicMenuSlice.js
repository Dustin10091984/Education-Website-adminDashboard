import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

// get the list of menus starts here
export const fetchMenus = createAsyncThunk(
  'menus/fetchMenus',
  async (_, { getState }) => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      throw new Error('Access token not found')
    }
    const response = await axios.get(
      'https://api.ebsalar.com/api/v1/admin/menu/?no-paginate=true',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  }
)
// get the list of menus finishes here

// Add menu functionality start
export const addMenu = createAsyncThunk(
  'menu/addMenu',
  async (menuData, { rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Access token not found')
    }
    try {
      const response = await axios.post(
        `https://api.ebsalar.com/api/v1/admin/menu/`,
        menuData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data // Assuming API returns the newly created menu data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Add menu functionality finish

// Delete a menu starts here
export const deleteMenu = createAsyncThunk(
  'menus/deleteMenu',
  async (menuId, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Accesstoken not found')
    }
    try {
      const response = await axios.delete(
        `https://api.ebsalar.com/api/v1/admin/menu/${menuId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (response.status === 200) {
        return menuId
      }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Delete a menu finishes here

// Edit functionality starts here
export const editMenu = createAsyncThunk(
  '/menus/editMenu',
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('AccessToken not found')
    }
    try {
      const response = await axios.patch(
        ` https://api.ebsalar.com/api/v1/admin/menu/${id}/ `,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data // Assuming API returns the updated menu data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Edit functionality finishes here

// Edit submenu functionality starts here
// export const editSubmenu = createAsyncThunk(
//   '/menus/editSubmenu',
//   async ({ id, updatedData }, { getState, rejectWithValue }) => {
//     const accessToken = Cookies.get('authToken')
//     if (!accessToken) {
//       return rejectWithValue('AccessToken not found')
//     }
//     try {
//       const response = await axios.patch(
//         ` https://api.ebsalar.com/api/v1/admin/menu/sub_menu${id}/ `,
//         updatedData,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       )
//       return response.data // Assuming API returns the updated menu data
//     } catch (error) {
//       return rejectWithValue(error.response.data)
//     }
//   }
// )
// Edit submenu functionality finishes here

export const publicMenuSlice = createSlice({
  name: 'menus',
  initialState: {
    entities: [],
    isLoading: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.entities = action.payload.results
        state.isLoading = false
        state.isError = false
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.entities = []
        state.isLoading = false
        state.isError = true
      })
      .addCase(fetchMenus.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.entities = state.entities.filter(
          (menu) => menu.id !== action.payload
        )
      })
      .addCase(editMenu.fulfilled, (state, action) => {
        const index = state.entities.findIndex(
          (menu) => menu.id === action.payload.id
        )
        if (index !== -1) {
          state.entities[index] = action.payload
        }
      })
      .addCase(addMenu.fulfilled, (state, action) => {
        state.entities.push(action.payload)
      })
      .addCase(addMenu.rejected, (state, action) => {
        state.isError = true
        console.log(action.payload)
      })
    // .addCase(editSubmenu.fulfilled, (state, action) => {
    //   const index = state.entities.findIndex(
    //     (menu) => menu.id === action.payload.id
    //   )
    //   if (index !== -1) {
    //     state.entities[index] = action.payload
    //   }
    // })
  },
})
export default publicMenuSlice.reducer
