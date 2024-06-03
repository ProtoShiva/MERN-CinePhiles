import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import client from "../../../api/client"

//fetch all products
export const fetchAllProducts = createAsyncThunk(
  "fetchAll/products",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    const token = getToken()
    try {
      const { data } = await client.get("/movie/getMovies", {
        headers: {
          authorization: "Bearer " + token
        }
      })
      return data
    } catch (error) {
      if (!error?.response) {
        throw error
      }
      return rejectWithValue(error?.response?.data)
    }
  }
)

//initialise slice
const productSlice = createSlice({
  name: "products",
  initialState: {},
  extraReducers: (builder) => {
    //fetch all products
    builder.addCase(fetchAllProducts.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      state.loading = false
      state.aLLProductsGot = action?.payload
      state.serverErr = undefined
      state.appErr = undefined
    })
    builder.addCase(fetchAllProducts.rejected, (state, action) => {
      state.appErr = action?.payload?.message
      state.serverErr = action?.payload?.message
      state.loading = false
    })
  }
})

export default productSlice.reducer
