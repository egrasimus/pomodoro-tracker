import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface PlaylistState {
	tracks: string[]
	current: number | null // индекс текущего трека
}

const loadPlaylist = (): PlaylistState => {
	const saved = localStorage.getItem("soundcloud_playlist")
	if (saved) return JSON.parse(saved)
	return { tracks: [], current: null }
}

const initialState: PlaylistState = loadPlaylist()

export const playlistSlice = createSlice({
	name: "playlist",
	initialState,
	reducers: {
		addTrack: (state, action: PayloadAction<string>) => {
			state.tracks.push(action.payload)
			if (state.current === null) state.current = 0
			localStorage.setItem("soundcloud_playlist", JSON.stringify(state))
		},
		removeTrack: (state, action: PayloadAction<number>) => {
			state.tracks.splice(action.payload, 1)
			if (state.current !== null) {
				if (state.tracks.length === 0) state.current = null
				else if (state.current >= state.tracks.length)
					state.current = state.tracks.length - 1
			}
			localStorage.setItem("soundcloud_playlist", JSON.stringify(state))
		},
		setCurrent: (state, action: PayloadAction<number>) => {
			state.current = action.payload
			localStorage.setItem("soundcloud_playlist", JSON.stringify(state))
		},
		moveTrack: (state, action: PayloadAction<{ from: number; to: number }>) => {
			const { from, to } = action.payload
			const [removed] = state.tracks.splice(from, 1)
			state.tracks.splice(to, 0, removed)
			if (state.current === from) state.current = to
			else if (state.current !== null) {
				if (from < state.current && to >= state.current) state.current--
				else if (from > state.current && to <= state.current) state.current++
			}
			localStorage.setItem("soundcloud_playlist", JSON.stringify(state))
		},
		editTrack: (
			state,
			action: PayloadAction<{ index: number; url: string }>
		) => {
			state.tracks[action.payload.index] = action.payload.url
			localStorage.setItem("soundcloud_playlist", JSON.stringify(state))
		},
		clearPlaylist: (state) => {
			state.tracks = []
			state.current = null
			localStorage.setItem("soundcloud_playlist", JSON.stringify(state))
		},
	},
})

export const {
	addTrack,
	removeTrack,
	setCurrent,
	moveTrack,
	editTrack,
	clearPlaylist,
} = playlistSlice.actions
export default playlistSlice.reducer
