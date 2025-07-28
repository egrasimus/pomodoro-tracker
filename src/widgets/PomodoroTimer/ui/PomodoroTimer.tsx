import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store"
import { startTimer, pauseTimer, resetTimer } from "@/store"
import { Button, formatTime, useTimer } from "@/shared"
import { TimerSettings } from "@/features/TimerSettings"
import styles from "./PomodoroTimer.module.scss"

interface PomodoroTimerProps {
	onMinimize?: () => void
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onMinimize }) => {
	const dispatch = useDispatch<AppDispatch>()
	const history = useSelector((state: RootState) => state.timer.history)
	const {
		isRunning,
		isWorkTime,
		startTimestamp,
		duration,
		sessionsCompleted,
		totalWorkTime,
		timeLeft,
	} = useTimer()

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

	return (
		<div className={styles.wrapper}>
			<div className={styles.header}>
				<TimerSettings />
				<h1>{isWorkTime ? "Work Time" : "Break Time"}</h1>
				{onMinimize && (
					<button
						onClick={onMinimize}
						className={styles.minimizeBtn}
						title='Minimize'
					>
						-
					</button>
				)}
			</div>
			<div className={styles.timer}>{formatTime(timeLeft)}</div>

			<div className={styles.buttonsWrapper}>
				{!isRunning ? (
					<Button
						onClick={() => dispatch(startTimer())}
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
