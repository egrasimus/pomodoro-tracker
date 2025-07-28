import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store"
import { setTime } from "@/store"
import { Button } from "@/shared"
import styles from "./TimerSettings.module.scss"

export const TimerSettings: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>()
	const { isWorkTime, duration } = useSelector(
		(state: RootState) => state.timer
	)

	const [workMinutes, setWorkMinutes] = useState(Math.floor(duration / 60))
	const [breakMinutes, setBreakMinutes] = useState(5)
	const [isOpen, setIsOpen] = useState(false)

	const handleSave = () => {
		dispatch(
			setTime({
				duration: workMinutes * 60,
				isWorkTime: true,
			})
		)
		setIsOpen(false)
	}

	return (
		<div className={styles.settings}>
			<Button
				onClick={() => setIsOpen(!isOpen)}
				variant='secondary'
				size='small'
			>
				⚙️ Settings
			</Button>

			{isOpen && (
				<div className={styles.settingsPanel}>
					<h3>Timer Settings</h3>

					<div className={styles.setting}>
						<label>Work Duration (minutes):</label>
						<input
							type='number'
							min='1'
							max='60'
							value={workMinutes}
							onChange={(e) => setWorkMinutes(Number(e.target.value))}
						/>
					</div>

					<div className={styles.setting}>
						<label>Break Duration (minutes):</label>
						<input
							type='number'
							min='1'
							max='30'
							value={breakMinutes}
							onChange={(e) => setBreakMinutes(Number(e.target.value))}
						/>
					</div>

					<div className={styles.actions}>
						<Button onClick={handleSave} variant='primary'>
							Save
						</Button>
						<Button onClick={() => setIsOpen(false)} variant='secondary'>
							Cancel
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}
