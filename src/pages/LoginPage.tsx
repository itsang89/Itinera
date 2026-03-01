import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const { user, loading, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [signingInWithGoogle, setSigningInWithGoogle] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && user) {
      navigate('/trips', { replace: true })
    }
  }, [user, loading, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Please enter email and password.')
      return
    }
    setSubmitting(true)
    try {
      if (isSignUp) {
        await signUpWithEmail(email.trim(), password)
      } else {
        await signInWithEmail(email.trim(), password)
      }
    } catch (err) {
      const msg = (err as Error).message
      if (msg.includes('auth/invalid-email')) {
        setError('Invalid email address.')
      } else if (msg.includes('auth/user-not-found') || msg.includes('auth/invalid-credential')) {
        setError('Invalid email or password.')
      } else if (msg.includes('auth/wrong-password')) {
        setError('Invalid email or password.')
      } else if (msg.includes('auth/email-already-in-use')) {
        setError('An account with this email already exists. Sign in instead.')
      } else if (msg.includes('auth/weak-password')) {
        setError('Password should be at least 6 characters.')
      } else {
        setError(msg || 'Sign in failed. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleSignInWithGoogle = async () => {
    setError('')
    setSigningInWithGoogle(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      const msg = (err as Error).message
      if (msg.includes('popup-closed-by-user') || msg.includes('cancelled-popup-request')) {
        setError('Sign-in was cancelled.')
      } else if (msg.includes('popup-blocked')) {
        setError('Popup was blocked. Please allow popups for this site.')
      } else if (msg.includes('network')) {
        setError('Network error. Please check your connection.')
      } else {
        setError(msg || 'Sign in failed. Please try again.')
      }
    } finally {
      setSigningInWithGoogle(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-bg">
        <div className="animate-pulse text-neutral-gray dark:text-neutral-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white dark:bg-dark-bg">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-hero font-normal tracking-tight text-neutral-charcoal dark:text-neutral-100 mb-2 text-center">
          Itinera
        </h1>
        <p className="text-neutral-gray dark:text-neutral-400 text-sm mb-8 text-center">
          Plan your trips, track your budget, and never forget to pack.
        </p>
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-charcoal dark:text-neutral-200 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-soft-gray dark:border-dark-elevated bg-white dark:bg-dark-elevated text-neutral-charcoal dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-blue-start"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-charcoal dark:text-neutral-200 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-soft-gray dark:border-dark-elevated bg-white dark:bg-dark-elevated text-neutral-charcoal dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-blue-start"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 gradient-accent text-sky-900 dark:text-sky-100 font-bold rounded-ios shadow-lg shadow-sky-300/50 dark:shadow-sky-900/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70"
          >
            <span className="material-symbols-outlined">login</span>
            {submitting ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
          </button>
        </form>
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp)
            setError('')
          }}
          className="mt-4 w-full text-sm text-neutral-gray dark:text-neutral-400 hover:text-accent-blue-start transition-colors"
        >
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
        </button>
        <div className="mt-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-soft-gray dark:bg-dark-elevated" />
          <span className="text-sm text-neutral-400 dark:text-neutral-500">or</span>
          <div className="flex-1 h-px bg-soft-gray dark:bg-dark-elevated" />
        </div>
        <button
          type="button"
          onClick={handleSignInWithGoogle}
          disabled={signingInWithGoogle}
          className="mt-6 w-full py-4 border border-soft-gray dark:border-dark-elevated bg-white dark:bg-dark-elevated text-neutral-charcoal dark:text-neutral-100 font-bold rounded-ios flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70 hover:bg-neutral-50 dark:hover:bg-dark-elevated/80"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {signingInWithGoogle ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  )
}
