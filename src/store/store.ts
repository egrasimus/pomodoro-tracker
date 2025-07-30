import { configureStore } from "@reduxjs/toolkit"
import timerReducer from "./timerSlice"
import playlistReducer from "./playlistSlice"

export const store = configureStore({
	reducer: {
		timer: timerReducer,
		playlist: playlistReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
