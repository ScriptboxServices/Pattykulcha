// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'


import menuReducer from './slices/Menu';

// Slice Imports


export const store = configureStore({
  reducer: {
    menu: menuReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

