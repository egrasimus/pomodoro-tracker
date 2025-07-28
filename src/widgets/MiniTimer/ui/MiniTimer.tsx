import React from "react"
import { formatTime, useTimer } from "@/shared"
import styles from "./MiniTimer.module.scss"

interface MiniTimerProps {
	onMaximize: () => void
}

export const MiniTimer: React.FC<MiniTimerProps> = ({ onMaximize }) => {
	const { isWorkTime, timeLeft } = useTimer()

	return (
		<div className={styles.miniTimer}>
			<div className={styles.header}>
				<span className={styles.mode}>
					{isWorkTime ? "🍅 Work" : "☕ Break"}
				</span>
				<button onClick={onMaximize} className={styles.maximizeBtn}>
					⤢
				</button>
			</div>

			<div className={styles.timer}>{formatTime(timeLeft)}</div>
		</div>
	)
}
