import React from "react"
import { StatsToggle } from "@/features/StatsToggle"
import styles from "./Header.module.scss"

interface HeaderProps {
	isStatsVisible: boolean
	onToggleStats: () => void
}

export const Header: React.FC<HeaderProps> = ({
	isStatsVisible,
	onToggleStats,
}) => {
	return (
		<>
			<div className={styles.headerHoverZone} />
			<header className={styles.header}>
				<div className={styles.container}>
					<div className={styles.logo}>
						<h1>🍅 Pomodoro Tracker</h1>
					</div>
					<nav className={styles.nav}>
						<StatsToggle isVisible={isStatsVisible} onToggle={onToggleStats} />
					</nav>
				</div>
			</header>
		</>
	)
}
