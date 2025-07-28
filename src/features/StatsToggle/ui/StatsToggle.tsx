import React from "react"
import { Button } from "@/shared"
import styles from "./StatsToggle.module.scss"

interface StatsToggleProps {
	isVisible: boolean
	onToggle: () => void
}

export const StatsToggle: React.FC<StatsToggleProps> = ({
	isVisible,
	onToggle,
}) => {
	return (
		<Button
			onClick={onToggle}
			variant='secondary'
			size='small'
			className={styles.toggleButton}
		>
			{isVisible ? "📊 Hide Stats" : "📊 Show Stats"}
		</Button>
	)
}
