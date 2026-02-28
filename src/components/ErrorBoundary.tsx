import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white dark:bg-dark-bg">
          <div className="text-center max-w-sm">
            <span className="material-symbols-outlined text-5xl text-neutral-gray dark:text-neutral-400 mb-4">
              error
            </span>
            <h1 className="text-xl font-bold text-neutral-charcoal dark:text-neutral-100 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-neutral-gray dark:text-neutral-400 mb-6">
              {this.state.error?.message ?? 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="px-6 py-3 rounded-ios font-semibold gradient-accent text-sky-900 dark:text-sky-100"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
