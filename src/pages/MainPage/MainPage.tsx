import { useEffect, useState } from "react"
import { PomodoroTimer, StatsChart, Header } from "@/widgets"
import { BackgroundVideo } from "@/shared"
import coffeeVideo from "@/assets/videos/coffee.mp4"
import styles from "./MainPage.module.scss"

export const MainPage = () => {
	const [isStatsVisible, setIsStatsVisible] = useState(() => {
		const saved = localStorage.getItem("statsVisible")
		return saved ? JSON.parse(saved) : false
	})

	useEffect(() => {
		if (!("Notification" in window)) {
			console.log("This browser does not support desktop notification")
		} else if (Notification.permission !== "denied") {
			Notification.requestPermission()
		}
	}, [])

	const toggleStats = () => {
		const newValue = !isStatsVisible
		setIsStatsVisible(newValue)
		localStorage.setItem("statsVisible", JSON.stringify(newValue))
	}

	return (
		<div className={styles.app}>
			<BackgroundVideo src={coffeeVideo} />
			<Header isStatsVisible={isStatsVisible} onToggleStats={toggleStats} />
			<main className={styles.main}>
				<PomodoroTimer />
				{isStatsVisible && <StatsChart />}
			</main>
		</div>
	)
}
