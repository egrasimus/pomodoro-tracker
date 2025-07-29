import React, { useState } from "react"
import styles from "./SoundCloudPlayer.module.scss"

export const SoundCloudPlayer: React.FC = () => {
	const [input, setInput] = useState("")
	const [url, setUrl] = useState<string | null>(null)
	const [error, setError] = useState("")
	const [collapsed, setCollapsed] = useState(false)

	const handlePlay = () => {
		if (!input.startsWith("https://soundcloud.com/")) {
			setError("Введите корректную ссылку на SoundCloud!")
			return
		}
		setUrl(input)
		setError("")
		localStorage.setItem("soundcloud_url", input)
	}

	React.useEffect(() => {
		const last = localStorage.getItem("soundcloud_url")
		if (last) setUrl(last)
	}, [])

	return (
		<div className={styles.playerWrapper}>
			<div className={styles.inputRow}>
				<input
					type='text'
					placeholder='Вставьте ссылку на SoundCloud...'
					value={input}
					onChange={(e) => setInput(e.target.value)}
					className={styles.input}
				/>
				<button onClick={handlePlay} className={styles.playBtn}>
					Play
				</button>
				{url && (
					<button
						onClick={() => {
							setUrl(null)
							setInput("")
							localStorage.removeItem("soundcloud_url")
						}}
						className={styles.clearBtn}
					>
						✕
					</button>
				)}
				{url && (
					<button
						onClick={() => setCollapsed((c) => !c)}
						className={styles.collapseBtn}
						title={collapsed ? "Развернуть" : "Свернуть"}
					>
						{collapsed ? "▼" : "▲"}
					</button>
				)}
			</div>
			{error && <div className={styles.error}>{error}</div>}
			{url && (
				<div
					className={
						styles.iframeWrapper + (collapsed ? " " + styles.iframeHidden : "")
					}
				>
					<iframe
						width='100%'
						height='130'
						scrolling='no'
						frameBorder='no'
						allow='autoplay'
						src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
							url
						)}&color=%23646cff&auto_play=true&show_artwork=true&show_comments=false&show_user=false&show_reposts=false&visual=false`}
						className={styles.animatedIframe}
					></iframe>
				</div>
			)}
		</div>
	)
}
