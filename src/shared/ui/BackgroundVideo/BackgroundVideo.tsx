import React from "react"
import styles from "./BackgroundVideo.module.scss"

interface BackgroundVideoProps {
	src: string
	className?: string
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
	src,
	className = "",
}) => {
	return (
		<div className={`${styles.backgroundVideo} ${className}`}>
			<video autoPlay muted loop playsInline className={styles.video}>
				<source src={src} type='video/mp4' />
				Your browser does not support the video tag.
			</video>
			<div className={styles.overlay}></div>
		</div>
	)
}
