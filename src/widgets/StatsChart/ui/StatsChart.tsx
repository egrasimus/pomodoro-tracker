import React from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Bar, Line } from "react-chartjs-2"
import { Chart, registerables } from "chart.js"
import { format } from "date-fns"
import styles from "./StatsChart.module.scss"
Chart.register(...registerables)

export const StatsChart: React.FC = () => {
	const history = useSelector((state: RootState) => state.timer.history)
	const { totalWorkTime, sessionsCompleted } = useSelector(
		(state: RootState) => state.timer
	)

	// Получаем последние 7 дней
	const last7Days = Array.from({ length: 7 }, (_, i) => {
		const date = new Date()
		date.setDate(date.getDate() - i)
		return date.toISOString().split("T")[0]
	}).reverse()

	const sessionsData = last7Days.map((date) => {
		const dayData = history.find((item) => item.date === date)
		return dayData ? dayData.sessions : 0
	})

	const barData = {
		labels: last7Days.map((date) => format(new Date(date), "MMM dd")),
		datasets: [
			{
				label: "Pomodoro Sessions",
				data: sessionsData,
				backgroundColor: "rgba(100, 108, 255, 0.6)",
				borderColor: "rgba(100, 108, 255, 1)",
				borderWidth: 2,
			},
		],
	}

	const lineData = {
		labels: last7Days.map((date) => format(new Date(date), "MMM dd")),
		datasets: [
			{
				label: "Cumulative Sessions",
				data: sessionsData.reduce((acc, val, i) => {
					acc.push((acc[i - 1] || 0) + val)
					return acc
				}, [] as number[]),
				borderColor: "rgba(255, 99, 132, 1)",
				backgroundColor: "rgba(255, 99, 132, 0.1)",
				tension: 0.4,
				fill: true,
			},
		],
	}

	return (
		<div className={styles["stats-chart"]}>
			<h2>Your Productivity</h2>

			<div className={styles["stats-summary"]}>
				<div className={styles["stat-item"]}>
					<span className={styles["stat-value"]}>{sessionsCompleted}</span>
					<span className={styles["stat-label"]}>Total Sessions</span>
				</div>
				<div className={styles["stat-item"]}>
					<span className={styles["stat-value"]}>
						{Math.floor(totalWorkTime / 60)}
					</span>
					<span className={styles["stat-label"]}>Total Hours</span>
				</div>
			</div>

			<div className={styles["chart-container"]}>
				<h3>Daily Sessions</h3>
				<Bar
					data={barData}
					options={{
						responsive: true,
						plugins: {
							legend: {
								display: false,
							},
						},
						scales: {
							y: {
								beginAtZero: true,
								ticks: {
									stepSize: 1,
									color: "rgba(255, 255, 255, 0.7)",
								},
								grid: {
									color: "rgba(255, 255, 255, 0.1)",
								},
							},
							x: {
								ticks: {
									color: "rgba(255, 255, 255, 0.7)",
								},
								grid: {
									color: "rgba(255, 255, 255, 0.1)",
								},
							},
						},
					}}
				/>
			</div>

			<div className={styles["chart-container"]}>
				<h3>Progress Trend</h3>
				<Line
					data={lineData}
					options={{
						responsive: true,
						plugins: {
							legend: {
								display: false,
							},
						},
						scales: {
							y: {
								beginAtZero: true,
								ticks: {
									color: "rgba(255, 255, 255, 0.7)",
								},
								grid: {
									color: "rgba(255, 255, 255, 0.1)",
								},
							},
							x: {
								ticks: {
									color: "rgba(255, 255, 255, 0.7)",
								},
								grid: {
									color: "rgba(255, 255, 255, 0.1)",
								},
							},
						},
					}}
				/>
			</div>
		</div>
	)
}
