import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

interface TimerState {
	isRunning: boolean
	isWorkTime: boolean
	startTimestamp: number | null // ms since epoch
	duration: number // seconds
	sessionsCompleted: number
	totalWorkTime: number
	history: Array<{ date: string; sessions: number }>
}

const WORK_DURATION = 25 * 60
const BREAK_DURATION = 5 * 60

const loadState = (): TimerState => {
	const saved = localStorage.getItem("pomodoroState")
	if (saved) {
		return JSON.parse(saved)
	}
	return {
		isRunning: false,
		isWorkTime: true,
		startTimestamp: null,
		duration: WORK_DURATION,
		sessionsCompleted: 0,
		totalWorkTime: 0,
		history: [],
	}
}

const initialState: TimerState = loadState()

export const timerSlice = createSlice({
	name: "timer",
	initialState,
	reducers: {
		startTimer: (state) => {
			state.isRunning = true
			// Сбросить duration только если это новый запуск (а не пауза)
			if (
				state.startTimestamp === null &&
				((state.isWorkTime && state.duration === WORK_DURATION) ||
					(!state.isWorkTime && state.duration === BREAK_DURATION))
			) {
				state.duration = state.isWorkTime ? WORK_DURATION : BREAK_DURATION
			}
			state.startTimestamp = Date.now()
		},
		pauseTimer: (state) => {
			if (state.isRunning && state.startTimestamp) {
				const elapsed = Math.floor((Date.now() - state.startTimestamp) / 1000)
				state.duration = Math.max(state.duration - elapsed, 0)
				state.startTimestamp = null
				state.isRunning = false
			}
		},
		resetTimer: (state) => {
			state.isRunning = false
			state.isWorkTime = true
			state.startTimestamp = null
			state.duration = WORK_DURATION
		},
		tick: (state) => {
			if (!state.isRunning || !state.startTimestamp) return
			const elapsed = Math.floor((Date.now() - state.startTimestamp) / 1000)
			const timeLeft = Math.max(state.duration - elapsed, 0)
			if (timeLeft > 0) {
				if (state.isWorkTime) {
					state.totalWorkTime += 1
				}
			} else {
				state.isRunning = false
				state.startTimestamp = null
				if (state.isWorkTime) {
					state.sessionsCompleted += 1
					state.isWorkTime = false
					state.duration = BREAK_DURATION
					const today = new Date().toISOString().split("T")[0]
					const dayInHistory = state.history.find((day) => day.date === today)
					if (dayInHistory) {
						dayInHistory.sessions += 1
					} else {
						state.history.push({ date: today, sessions: 1 })
					}
				} else {
					state.isWorkTime = true
					state.duration = WORK_DURATION
				}
			}
		},
		setTime: (
			state,
			action: PayloadAction<{ duration: number; isWorkTime: boolean }>
		) => {
			state.duration = action.payload.duration
			state.isWorkTime = action.payload.isWorkTime
			state.startTimestamp = null
			state.isRunning = false
		},
	},
})

export const { startTimer, pauseTimer, resetTimer, tick, setTime } =
	timerSlice.actions
export default timerSlice.reducer
