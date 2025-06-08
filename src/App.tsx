import "./App.css"
import { MainPage } from "@/pages/MainPage"
import backgroundImage from "@/assets/images/background.png"
import styles from "./App.module.scss"

function App() {
	return (
		<div>
			<MainPage />
			<div className={styles.appBackground}>
				<img src={backgroundImage} alt='Background' />
			</div>
		</div>
	)
}

export default App
