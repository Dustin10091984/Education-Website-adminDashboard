import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import Cookies from 'js-cookie'

// get the list of tickets starts here
export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (_, { getState }) => {
    const accessToken = Cookies.get('authToken')

    if (!accessToken) {
      throw new Error('Access token not found')
    }
    const response = await axios.get(
      'https://api.ebsalar.com/api/v1/admin/ticket/',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    return response.data
  }
)
// get the list of tickets finishes here

export const ticketClosed = createAction('tickets/ticketClosed')

export const ticketsSlice = createSlice({
  name: 'tickets',
  initialState: {
    entities: [],
    isLoading: false,
    isError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.entities = action.payload.results
        state.isLoading = false
        state.isError = false
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.entities = []
        state.isLoading = false
        state.isError = true
      })
      .addCase(fetchTickets.pending, (state) => {
        state.isLoading = true
      })
      .addCase(ticketClosed, (state, action) => {
        const index = state.entities.findIndex(
          (ticket) => ticket.id === action.payload
        )
        if (index !== -1) {
          state.entities[index].open = false
        }
      })
  },
})
export default ticketsSlice.reducer
