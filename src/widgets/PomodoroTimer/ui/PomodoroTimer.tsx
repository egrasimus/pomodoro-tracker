import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store"
import { startTimer, pauseTimer, resetTimer, tick } from "@/store"
import { Button, formatTime } from "@/shared"
import { TimerSettings } from "@/features/TimerSettings"
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

	return (
		<div className={styles.wrapper}>
			<div className={styles.header}>
				<TimerSettings />
				<h1>{isWorkTime ? "Work Time" : "Break Time"}</h1>
			</div>
			<div className={styles.timer}>{formatTime(timeLeft)}</div>

			<div className={styles.buttonsWrapper}>
				{!isRunning ? (
					<Button
						onClick={() => {
							dispatch(startTimer())
							setNow(Date.now())
						}}
						variant='primary'
						size='large'
					>
						Start
					</Button>
				) : (
					<Button
						onClick={() => dispatch(pauseTimer())}
						variant='secondary'
						size='large'
					>
						Pause
					</Button>
				)}
				<Button
					onClick={() => dispatch(resetTimer())}
					variant='danger'
					size='large'
				>
					Reset
				</Button>
			</div>

			<div className={styles.stats}>
				<p className={styles.text}>Sessions: {sessionsCompleted}</p>
				<p className={styles.text}>Total: {formatTime(totalWorkTime)}</p>
			</div>
		</div>
	)
}
