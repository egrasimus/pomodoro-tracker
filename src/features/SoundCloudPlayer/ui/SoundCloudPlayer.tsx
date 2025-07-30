import React, { useState } from "react"
import styles from "./SoundCloudPlayer.module.scss"
import { Playlist } from "./Playlist"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import type { PlaylistState } from "@/store/playlistSlice"
import { setCurrent } from "@/store/playlistSlice"

export const SoundCloudPlayer: React.FC = () => {
	const [input, setInput] = useState("")
	const [url, setUrl] = useState<string | null>(null)
	const [error, setError] = useState("")
	const [collapsed, setCollapsed] = useState(false)

	const { tracks, current } = useSelector(
		(state: RootState) => state.playlist as PlaylistState
	)
	const dispatch = useDispatch()

	React.useEffect(() => {
		const last = localStorage.getItem("soundcloud_url")
		if (last) setUrl(last)
	}, [])

	// Если есть треки в плейлисте, используем текущий трек
	React.useEffect(() => {
		if (tracks.length && current !== null) {
			setUrl(tracks[current])
		}
	}, [tracks, current])

	const handlePlay = () => {
		if (!input.startsWith("https://soundcloud.com/")) {
			setError("Введите корректную ссылку на SoundCloud!")
			return
		}
		// Добавляем в плейлист и делаем текущим
		dispatch(setCurrent(tracks.length))
		setError("")
		localStorage.setItem("soundcloud_url", input)
	}

	return (
		<div className={styles.playerWrapper}>
			<div className={styles.inputRow}>
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
			<div className={collapsed ? styles.hidden : ""}>
				<Playlist />
			</div>
		</div>
	)
}
