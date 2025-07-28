import React from "react"
import styles from "./Button.module.scss"

interface ButtonProps {
	children: React.ReactNode
	onClick?: () => void
	variant?: "primary" | "secondary" | "danger"
	size?: "small" | "medium" | "large"
	disabled?: boolean
	className?: string
}

export const Button: React.FC<ButtonProps> = ({
	children,
	onClick,
	variant = "primary",
	size = "medium",
	disabled = false,
	className = "",
}) => {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
		>
			{children}
		</button>
	)
}
