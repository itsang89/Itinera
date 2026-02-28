import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      navigate('/trips', { replace: true })
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-neutral-gray">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-charcoal mb-2">
          Itinera
        </h1>
        <p className="text-neutral-gray text-sm mb-10">
          Plan your trips, track your budget, and never forget to pack.
        </p>
        <button
          onClick={signInWithGoogle}
          className="w-full py-4 gradient-accent text-sky-900 font-bold rounded-ios shadow-lg shadow-sky-200/50 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined">login</span>
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
