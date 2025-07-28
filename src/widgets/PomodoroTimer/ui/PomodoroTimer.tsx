import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store"
import { startTimer, pauseTimer, resetTimer, tick } from "@/store"
import styles from "./PomodoroTimer.module.scss"

export const PomodoroTimer: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>()
	const {
		isRunning,
		isWorkTime,
		startTimestamp,
		duration,
		sessionsCompleted,
		totalWorkTime,
	} = useSelector((state: RootState) => state.timer)
	const history = useSelector((state: RootState) => state.timer.history)

	const [now, setNow] = useState(Date.now())
	const intervalRef = useRef<NodeJS.Timeout | null>(null)

	// Сохраняем состояние в localStorage
	useEffect(() => {
		localStorage.setItem(
			"pomodoroState",
			JSON.stringify({
				isRunning,
				isWorkTime,
				startTimestamp,
				duration,
				sessionsCompleted,
				totalWorkTime,
				history,
			})
		)
	}, [
		isRunning,
		isWorkTime,
		startTimestamp,
		duration,
		sessionsCompleted,
		totalWorkTime,
	])

	// Интервал только для обновления UI
	useEffect(() => {
		if (isRunning) {
			intervalRef.current = setInterval(() => {
				setNow(Date.now())
				if (isRunning && startTimestamp) {
					const elapsed = Math.floor((Date.now() - startTimestamp) / 1000)
					if (duration - elapsed <= 0) {
						dispatch(tick())
					}
				}
			}, 1000)
		} else {
			if (intervalRef.current) clearInterval(intervalRef.current)
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current)
		}
	}, [isRunning, dispatch, startTimestamp, duration])

	// Вычисляем оставшееся время
	let timeLeft = duration
	if (isRunning && startTimestamp) {
		const elapsed = Math.floor((now - startTimestamp) / 1000)
		timeLeft = Math.max(duration - elapsed, 0)
	}

	useEffect(() => {
		if (timeLeft === 0 && isRunning) {
			new Notification(isWorkTime ? "Время отдыхать!" : "Время работать!", {
				body: isWorkTime
					? "25-минутная сессия завершена. Сделайте перерыв!"
					: "5-минутный перерыв завершен. Пора работать!",
			})
		}
	}, [timeLeft, isWorkTime, isRunning])

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
						onClick={() => {
							dispatch(startTimer())
							setNow(Date.now())
						}}
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
