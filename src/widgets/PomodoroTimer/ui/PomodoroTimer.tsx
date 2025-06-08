import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store"
import { startTimer, pauseTimer, resetTimer, tick } from "@/store"
import styles from "./PomodoroTimer.module.scss"

export const PomodoroTimer: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>()
	const { isRunning, isWorkTime, timeLeft, sessionsCompleted, totalWorkTime } =
		useSelector((state: RootState) => state.timer)
	const history = useSelector((state: RootState) => state.timer.history)

	useEffect(() => {
		localStorage.setItem(
			"pomodoroState",
			JSON.stringify({
				isRunning,
				isWorkTime,
				timeLeft,
				sessionsCompleted,
				totalWorkTime,
				history,
			})
		)
	}, [isRunning, isWorkTime, timeLeft, sessionsCompleted, totalWorkTime])

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null

		if (isRunning) {
			interval = setInterval(() => {
				dispatch(tick())
			}, 1000)
		} else if (interval) {
			clearInterval(interval)
		}

		return () => {
			if (interval) clearInterval(interval)
		}
	}, [isRunning, dispatch])

	useEffect(() => {
		if (timeLeft === 0) {
			new Notification(isWorkTime ? "Время отдыхать!" : "Время работать!", {
				body: isWorkTime
					? "25-минутная сессия завершена. Сделайте перерыв!"
					: "5-минутный перерыв завершен. Пора работать!",
			})
		}
	}, [timeLeft, isWorkTime])

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`
	}

	return (
		<div className={styles.wrapper}>
			<h1>{isWorkTime ? "Work Time" : "Break Time"}</h1>
			<div className={styles.timer}>{formatTime(timeLeft)}</div>

			<div className={styles.buttonsWrapper}>
				{!isRunning ? (
					<button
						onClick={() => dispatch(startTimer())}
						className={styles.button}
					>
						Start
					</button>
				) : (
					<button
						onClick={() => dispatch(pauseTimer())}
						className={styles.button}
					>
						Pause
					</button>
				)}
				<button
					onClick={() => dispatch(resetTimer())}
					className={styles.button}
				>
					Reset
				</button>
			</div>

			<div>
				<p className={styles.text}>Sessions completed: {sessionsCompleted}</p>
				<p className={styles.text}>
					Total work time: {formatTime(totalWorkTime)}
				</p>
			</div>
		</div>
	)
}
