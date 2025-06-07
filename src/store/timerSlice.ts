import { createSlice } from "@reduxjs/toolkit"

interface TimerState {
	isRunning: boolean
	isWorkTime: boolean
	timeLeft: number
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
		timeLeft: WORK_DURATION,
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
		},
		pauseTimer: (state) => {
			state.isRunning = false
		},
		resetTimer: (state) => {
			state.isRunning = false
			state.isWorkTime = true
			state.timeLeft = WORK_DURATION
		},
		tick: (state) => {
			if (state.timeLeft > 0) {
				state.timeLeft -= 1
				if (state.isWorkTime) {
					state.totalWorkTime += 1
				}
			} else {
				state.isRunning = false
				if (state.isWorkTime) {
					state.sessionsCompleted += 1
					state.isWorkTime = false
					state.timeLeft = BREAK_DURATION
					const today = new Date().toISOString().split("T")[0]
					const dayInHistory = state.history.find((day) => day.date === today)
					if (dayInHistory) {
						dayInHistory.sessions += 1
					} else {
						state.history.push({ date: today, sessions: 1 })
					}
				} else {
					state.isWorkTime = true
					state.timeLeft = WORK_DURATION
				}
			}
		},
	},
})

export const { startTimer, pauseTimer, resetTimer, tick } = timerSlice.actions
export default timerSlice.reducer
