import "./App.css"
import { MainPage } from "@/pages/MainPage"
import { ErrorBoundary } from "./ErrorBoundary"

function App() {
	return (
		<ErrorBoundary>
			<MainPage />
		</ErrorBoundary>
	)
}

export default App
