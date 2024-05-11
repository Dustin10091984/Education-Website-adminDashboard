import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

// get the list of orders starts here
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { getState }) => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      throw new Error('Access token not found')
    }
    const response = await axios.get(
      'https://api.ebsalar.com/api/v1/admin/orders/',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  }
)
// get the list of orders finishes here

// Add order functionality start
export const registerOrderOnsite = createAsyncThunk(
  'orders/registerOrderOnsite',
  async (orderData, { rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Access token not found')
    }
    try {
      const response = await axios.post(
        `https://api.ebsalar.com/api/v1/admin/orders/`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data // Assuming API returns the newly created order data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Add order functionality finish

// Delete a order starts here
export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('Accesstoken not found')
    }
    try {
      const response = await axios.delete(
        `https://api.ebsalar.com/api/v1/admin/orders/${orderId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      if (response.status === 200) {
        return orderId
      }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Delete a order finishes here

// Edit functionality starts here
export const editOrder = createAsyncThunk(
  '/orders/editOrder',
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    const accessToken = Cookies.get('authToken')
    if (!accessToken) {
      return rejectWithValue('AccessToken not found')
    }
    try {
      const response = await axios.patch(
        ` https://api.ebsalar.com/api/v1/admin/orders/${id}/ `,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data // Assuming API returns the updated order data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)
// Edit functionality finishes here

export const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    entities: [],
    isLoading: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.entities = action.payload.results
        state.isLoading = false
        state.isError = false
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.entities = []
        state.isLoading = false
        state.isError = true
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.entities = state.entities.filter(
          (order) => order.id !== action.payload
        )
      })
      .addCase(editOrder.fulfilled, (state, action) => {
        const index = state.entities.findIndex(
          (order) => order.id === action.payload.id
        )
        if (index !== -1) {
          state.entities[index] = action.payload
        }
      })
      .addCase(registerOrderOnsite.fulfilled, (state, action) => {
        state.entities.push(action.payload)
      })
      .addCase(registerOrderOnsite.rejected, (state, action) => {
        state.isError = true
        console.log(action.payload)
      })
  },
})
export default ordersSlice.reducer
