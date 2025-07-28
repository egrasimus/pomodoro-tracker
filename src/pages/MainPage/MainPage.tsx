import { useEffect } from "react"
import { PomodoroTimer, StatsChart } from "@/widgets"
import styles from "./MainPage.module.scss"

export const MainPage = () => {
	useEffect(() => {
		if (!("Notification" in window)) {
			console.log("This browser does not support desktop notification")
		} else if (Notification.permission !== "denied") {
			Notification.requestPermission()
		}
	}, [])

	return (
		<div className={styles.app}>
			<h1>Pomodoro Tracker</h1>
			<PomodoroTimer />
			<StatsChart />
		</div>
	)
}
