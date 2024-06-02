import { configureStore } from "@reduxjs/toolkit"
import userSlices from "../slices/users/usersSlices"

const store = configureStore({
  reducer: {
    users: userSlices
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }) // to ensure the data we get from our backend should be in json format
})

export default store
