import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import {
	addTrack,
	removeTrack,
	setCurrent,
	moveTrack,
	editTrack,
} from "@/store/playlistSlice"
import type { PlaylistState } from "@/store/playlistSlice"
import styles from "./Playlist.module.scss"
import { Button } from "@/shared/ui/Button"
import { formatSoundCloudTitle } from "@/shared/utils/formatTitle"

export const Playlist: React.FC = () => {
	const { tracks, current } = useSelector(
		(state: RootState) => state.playlist as PlaylistState
	)
	const dispatch = useDispatch()
	const [input, setInput] = useState("")
	const [editIdx, setEditIdx] = useState<number | null>(null)
	const [editValue, setEditValue] = useState("")
	const [dragged, setDragged] = useState<number | null>(null)

	const [url, setUrl] = useState<string | null>(null)
	const [error, setError] = useState("")
	const [collapsed, setCollapsed] = useState(false)

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

	const handleAdd = () => {
		if (input.startsWith("https://soundcloud.com/")) {
			dispatch(addTrack(input))
			setInput("")
		}
	}

	const handleEdit = (idx: number) => {
		if (editValue.startsWith("https://soundcloud.com/")) {
			dispatch(editTrack({ index: idx, url: editValue }))
			setEditIdx(null)
			setEditValue("")
		}
	}

	return (
		<>
			<div className={styles.inputRow}>
				<input
					type='text'
					placeholder='Добавить ссылку на SoundCloud...'
					value={input}
					onChange={(e) => setInput(e.target.value)}
					className={styles.input}
				/>
				<Button size='small' onClick={handleAdd}>
					Добавить
				</Button>
			</div>
			<ul className={styles.list}>
				{tracks.map((track: string, idx: number) => (
					<li
						key={idx}
						className={
							styles.track +
							(idx === current ? " " + styles.selected : "") +
							(dragged === idx ? " " + styles.dragged : "")
						}
						draggable
						onDragStart={() => setDragged(idx)}
						onDragOver={(e) => {
							e.preventDefault()
							if (dragged !== null && dragged !== idx) {
								dispatch(moveTrack({ from: dragged, to: idx }))
								setDragged(idx)
							}
						}}
						onDragEnd={() => setDragged(null)}
						onClick={() => dispatch(setCurrent(idx))}
					>
						{editIdx === idx ? (
							<>
								<input
									value={editValue}
									onChange={(e) => setEditValue(e.target.value)}
									className={styles.input}
									style={{ flex: 1 }}
								/>
								<Button size='small' onClick={() => handleEdit(idx)}>
									Сохранить
								</Button>
								<Button
									size='small'
									variant='secondary'
									onClick={() => setEditIdx(null)}
								>
									Отмена
								</Button>
							</>
						) : (
							<>
								<span className={styles.title}>
									{formatSoundCloudTitle(track)}
								</span>
								<button
									onClick={(e) => {
										e.stopPropagation()
										setEditIdx(idx)
										setEditValue(track)
									}}
									className={styles.iconBtn}
									title='Редактировать'
								>
									✎
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation()
										dispatch(removeTrack(idx))
									}}
									className={styles.iconBtn}
									title='Удалить'
								>
									✕
								</button>
							</>
						)}
					</li>
				))}
			</ul>
			{url && (
				<div className={styles.iframeWrapper}>
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
		</>
	)
}
