import "./App.css"
import { Provider } from "react-redux"
import { store } from "@/store"
import { MainPage } from "@/pages/MainPage"
import { ErrorBoundary } from "./ErrorBoundary"

function App() {
	return (
		<Provider store={store}>
			<ErrorBoundary>
				<MainPage />
			</ErrorBoundary>
		</Provider>
	)
}

export default App
