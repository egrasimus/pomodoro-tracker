import { useEffect } from "react"
import { Provider } from "react-redux"
import { store } from "@/store"
import { PomodoroTimer } from "@/widgets"

export const MainPage = () => {
	useEffect(() => {
		if (!("Notification" in window)) {
			console.log("This browser does not support desktop notification")
		} else if (Notification.permission !== "denied") {
			Notification.requestPermission()
		}
	}, [])

	return (
		<Provider store={store}>
			<div className='app'>
				<h1>Pomodoro Tracker</h1>
				<PomodoroTimer />
				{/* <StatsChart /> */}
			</div>
		</Provider>
	)
}
