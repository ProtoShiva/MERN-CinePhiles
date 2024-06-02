import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import client from "../../../api/client"
import { getToken } from "../../../utils/helper"

//get all of users details
export const userDetailsAction = createAsyncThunk(
  "user/details",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users?.userAuth
    const token = getToken()
    try {
      const { data } = await client.get("/user/userDetails", {
        headers: {
          authorization: "Bearer " + token
        }
      })
      localStorage.setItem("userInfo", JSON.stringify(data?.user))
      return data
    } catch (error) {
      if (!error?.response) {
        throw error
      }
      return rejectWithValue(error?.response?.data)
    }
  }
)

//save a product
export const saveProductAction = createAsyncThunk(
  "save/product",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users?.userAuth

    //send back the id in propper format
    const sendId = {
      productId: payload
    }
    const token = getToken()
    try {
      const { data } = await client.put("/user/saveMovie", sendId, {
        headers: {
          authorization: "Bearer " + token
        }
      })

      //update the local storage and user
      localStorage.setItem("userInfo", JSON.stringify(data))

      return data
    } catch (error) {
      if (!error?.response) {
        throw error
      }
      return rejectWithValue(error?.response?.data)
    }
  }
)

//unsave a product
export const unsaveProductAction = createAsyncThunk(
  "unsave/product",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    //send back the id in propper format
    const sendId = {
      productId: payload
    }
    const token = getToken()
    try {
      const { data } = await client.put("/user/unSaveMovie", sendId, {
        headers: {
          authorization: "Bearer " + token
        }
      })
      //update the local storage and user
      localStorage.setItem("userInfo", JSON.stringify(data))

      return data
    } catch (error) {
      if (!error?.response) {
        throw error
      }
      return rejectWithValue(error?.response?.data)
    }
  }
)

//get user from local state and put him into the store
let userAuth

const userInfoToStr = localStorage.getItem("userInfo")

if (userInfoToStr && userInfoToStr !== "undefined") {
  try {
    userAuth = JSON.parse(userInfoToStr)
  } catch (error) {
    console.error("Failed to parse userInfo from localstorage", error)
    userAuth = null
  }
} else {
  userAuth = null
}

const userSlice = createSlice({
  name: "users",
  initialState: {
    user: userAuth
  },
  extraReducers: (builder) => {
    //get user details
    builder.addCase(userDetailsAction.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(userDetailsAction.fulfilled, (state, action) => {
      state.loading = false
      state.user = action?.payload?.user
      state.userDetails = action?.payload?.user
      state.serverErr = undefined
      state.appErr = undefined
    })
    builder.addCase(userDetailsAction.rejected, (state, action) => {
      state.loading = false
      state.serverErr = action?.payload?.message
      state.appErr = action?.payload?.message
    })
    //save a product
    builder.addCase(saveProductAction.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(saveProductAction.fulfilled, (state, action) => {
      state.loading = false
      state.user = action?.payload
      state.serverErr = undefined
      state.appErr = undefined
    })
    builder.addCase(saveProductAction.rejected, (state, action) => {
      state.loading = false
      state.serverErr = action?.payload?.message
      state.appErr = action?.payload?.message
    })
    //unsave a product
    builder.addCase(unsaveProductAction.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(unsaveProductAction.fulfilled, (state, action) => {
      state.loading = false
      state.user = action?.payload
      state.serverErr = undefined
      state.appErr = undefined
    })
    builder.addCase(unsaveProductAction.rejected, (state, action) => {
      state.loading = false
      state.serverErr = action?.payload?.message
      state.appErr = action?.payload?.message
    })
  }
})

export default userSlice.reducer
