import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store"
import { tick } from "@/store"

export const useTimer = () => {
	const dispatch = useDispatch<AppDispatch>()
	const {
		isRunning,
		isWorkTime,
		startTimestamp,
		duration,
		sessionsCompleted,
		totalWorkTime,
	} = useSelector((state: RootState) => state.timer)

	const [now, setNow] = useState(Date.now())
	const intervalRef = useRef<NodeJS.Timeout | null>(null)

	// Интервал для обновления UI
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

	// Уведомления при завершении
	useEffect(() => {
		if (timeLeft === 0 && isRunning) {
			new Notification(isWorkTime ? "Время отдыхать!" : "Время работать!", {
				body: isWorkTime
					? "25-минутная сессия завершена. Сделайте перерыв!"
					: "5-минутный перерыв завершен. Пора работать!",
			})
		}
	}, [timeLeft, isWorkTime, isRunning])

	return {
		isRunning,
		isWorkTime,
		startTimestamp,
		duration,
		sessionsCompleted,
		totalWorkTime,
		timeLeft,
		now,
	}
}
