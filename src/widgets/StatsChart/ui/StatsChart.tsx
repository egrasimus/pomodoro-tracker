import React from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Bar } from "react-chartjs-2"
import { Chart, registerables } from "chart.js"
Chart.register(...registerables)

export const StatsChart: React.FC = () => {
	const history = useSelector((state: RootState) => state.timer.history)

	const data = {
		labels: history.map((item) => item.date),
		datasets: [
			{
				label: "Pomodoro Sessions",
				data: history.map((item) => item.sessions),
				backgroundColor: "rgba(75, 192, 192, 0.6)",
			},
		],
	}

	return (
		<div className='stats-chart'>
			<h2>Your Productivity</h2>
			<Bar
				data={data}
				options={{
					responsive: true,
					scales: {
						y: {
							beginAtZero: true,
							ticks: {
								stepSize: 1,
							},
						},
					},
				}}
			/>
		</div>
	)
}
