'use client'

import { Component, ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryFallbackProps {
  error?: Error
  onRetry: () => void
}

function ErrorBoundaryFallback({ error, onRetry }: ErrorBoundaryFallbackProps) {
  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Something went wrong
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{error?.message ?? 'An unexpected error occurred.'}</p>
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </Button>
      </CardContent>
    </Card>
  )
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return <ErrorBoundaryFallback error={this.state.error} onRetry={this.handleRetry} />
    }

    return this.props.children
  }
}

/**
 * A simpler error boundary for granular component-level error handling.
 * Renders the fallback UI when any child component throws an error.
 */
interface GranularErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  name?: string
}

export function GranularErrorBoundary({
  children,
  fallback,
  name = 'Component',
}: GranularErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        fallback ?? (
          <Card className="p-4 border-destructive/50">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                {name} failed to load
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                <RefreshCw className="h-3 w-3 mr-2" />
                Reload
              </Button>
            </CardContent>
          </Card>
        )
      }
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundary
