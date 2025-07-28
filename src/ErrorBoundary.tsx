import React from "react"

interface ErrorBoundaryProps {
	children: React.ReactNode
}

interface ErrorBoundaryState {
	hasError: boolean
}

export class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(_: Error): ErrorBoundaryState {
		return { hasError: true }
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// Можно логировать ошибку в сервис
		console.error("Uncaught error:", error, errorInfo)
	}

	render() {
		if (this.state.hasError) {
			return <h1>Что-то пошло не так. Пожалуйста, перезагрузите страницу.</h1>
		}
		return this.props.children
	}
}
