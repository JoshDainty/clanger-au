import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, Trophy, Zap, Shield } from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'

const features = [
  { icon: Trophy, text: 'Compete in NBA fantasy contests' },
  { icon: Zap, text: 'Real-time scoring & live matchups' },
  { icon: Shield, text: 'Skill-based. Fair play guaranteed.' },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="min-h-svh bg-bg-primary flex">
      {/* Left panel — branding (desktop only) */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] flex-col justify-between relative overflow-hidden bg-bg-secondary border-r border-border">
        {/* Background court lines */}
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[240px] border-2 border-accent rounded" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80px] h-[80px] border-2 border-accent rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[1px] h-[240px] bg-accent" style={{ transform: 'translate(-50%, -50%)' }} />
        </div>

        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/[0.04] rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 px-12 xl:px-16 pt-12">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xl font-black text-text-primary tracking-tight">CLANGER</span>
            <span className="text-base font-bold text-text-tertiary">.au</span>
          </div>
        </div>

        <div className="relative z-10 px-12 xl:px-16 flex-1 flex flex-col justify-center">
          <h2 className="text-3xl xl:text-4xl font-black text-text-primary leading-[1.1] tracking-tight mb-3">
            Australia's Biggest & Best<br />
            <span className="bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">Sports Fantasy Platform</span>
          </h2>
          <p className="text-text-secondary text-base mb-10 max-w-xs">
            Draft your squad. Compete in skill-based NBA contests. Win real prizes.
          </p>

          <div className="space-y-4">
            {features.map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent/8 border border-accent/15 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-4 h-4 text-accent-light" />
                </div>
                <span className="text-sm text-text-secondary">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 px-12 xl:px-16 pb-8">
          <div className="flex items-center gap-6 text-xs text-text-tertiary">
            <span>10,000+ Contests</span>
            <span className="w-1 h-1 bg-text-tertiary rounded-full" />
            <span>$500K+ Prize Pools</span>
            <span className="w-1 h-1 bg-text-tertiary rounded-full" />
            <span>50,000+ Players</span>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-12">
            <div className="flex items-center justify-center gap-1.5 mb-3">
              <span className="text-2xl font-black text-text-primary tracking-tight">CLANGER</span>
              <span className="text-lg font-bold text-text-tertiary">.au</span>
            </div>
            <p className="text-text-tertiary text-sm">Australia's #1 Fantasy Sports Platform</p>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
            <p className="text-text-secondary text-sm mt-2">Sign in to access your contests and leagues.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-5 bg-danger/10 border border-danger/20 rounded-lg text-sm text-danger">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 bg-bg-card border border-border rounded-xl text-text-primary text-sm placeholder:text-text-tertiary focus:border-accent focus:ring-1 focus:ring-accent/30 focus:outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-text-secondary">Password</label>
                <button type="button" className="text-xs text-accent hover:text-accent-light font-medium">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 pr-11 bg-bg-card border border-border rounded-xl text-text-primary text-sm placeholder:text-text-tertiary focus:border-accent focus:ring-1 focus:ring-accent/30 focus:outline-none transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-accent hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-[0_0_24px_rgba(59,130,246,0.25)] hover:shadow-[0_0_32px_rgba(59,130,246,0.35)] active:shadow-[0_0_16px_rgba(59,130,246,0.2)] active:translate-y-[1px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-text-tertiary">
              Don't have an account?{' '}
              <Link to="/signup" className="text-accent hover:text-accent-light font-semibold transition-colors">
                Create one free
              </Link>
            </p>
          </div>

          <div className="mt-10 pt-6 border-t border-border">
            <p className="text-[11px] text-text-tertiary text-center leading-relaxed">
              By signing in you agree to our{' '}
              <a href="#" className="underline hover:text-text-secondary">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="underline hover:text-text-secondary">Privacy Policy</a>.
              Must be 18+ to play.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
