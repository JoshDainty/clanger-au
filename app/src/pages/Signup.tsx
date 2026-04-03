import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, Check, Trophy, Zap, Shield, X } from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'

function LegalModal({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-bg-card border border-border rounded-2xl overflow-hidden max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border flex-shrink-0">
          <h2 className="text-base font-bold text-text-primary">{title}</h2>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-primary"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 overflow-y-auto space-y-4 text-sm text-text-secondary leading-relaxed">
          <p>This is a placeholder for the {title}. Full legal documentation will be published before Clanger.au launches publicly.</p>
          <p>By using Clanger.au, you agree to participate in skill-based fantasy sports contests. Real money entry fees apply. You must be 18 or older and located in Australia to participate.</p>
          <p>Clanger.au operates under Australian consumer protection laws. All contests are based on real NBA player statistics and outcomes. Entry fees contribute to prize pools, minus a platform fee.</p>
          {title === 'Responsible Play Policy' && (
            <p>Clanger.au is committed to responsible play. We provide tools to set deposit limits, self-exclude, and seek support. If you feel your play is becoming a problem, contact the <span className="text-accent-light">Gambling Help Online</span> service at 1800 858 858.</p>
          )}
          <p>For questions, contact <span className="text-accent-light">support@clanger.au</span>.</p>
          <p className="text-text-tertiary text-xs">Last updated: April 2026</p>
        </div>
        <div className="px-5 pb-5 flex-shrink-0">
          <button onClick={onClose} className="w-full h-10 bg-bg-secondary border border-border rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

const features = [
  { icon: Trophy, text: 'Compete in NBA fantasy contests' },
  { icon: Zap, text: 'Real-time scoring & live matchups' },
  { icon: Shield, text: 'Skill-based. Fair play guaranteed.' },
]

const passwordChecks = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'Contains a number', test: (p: string) => /\d/.test(p) },
]

export default function Signup() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [legalModal, setLegalModal] = useState<string | null>(null)

  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    const { error } = await signUp(email, password)
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <>
    <div className="min-h-svh bg-bg-primary flex flex-col lg:flex-row">

      {/* ─── Left: Branding Panel (desktop) ─── */}
      <div className="hidden lg:flex w-[520px] flex-shrink-0 flex-col bg-bg-secondary border-r border-border relative overflow-hidden">
        {/* Court lines decoration */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-48 border-2 border-accent rounded" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-accent rounded-full" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-accent" />
        </div>

        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(236,72,153,0.04)' }} />

        {/* Logo */}
        <div className="relative z-10 pt-10 pl-12">
          <span className="text-xl font-black text-text-primary tracking-tight">CLANGER</span>
          <span className="text-base font-bold text-text-tertiary">.au</span>
        </div>

        {/* Main branding */}
        <div className="relative z-10 flex-1 flex flex-col justify-center pl-12 pr-10">
          <h2 className="text-4xl font-black text-text-primary leading-tight tracking-tight mb-4">
            Start Competing
            <br />
            <span className="bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
              Today.
            </span>
          </h2>
          <p className="text-text-secondary text-base mb-12 max-w-xs leading-relaxed">
            Join thousands of Australians playing the smartest fantasy NBA platform.
          </p>
          <div className="space-y-5">
            {features.map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border" style={{ background: 'rgba(236,72,153,0.08)', borderColor: 'rgba(236,72,153,0.15)' }}>
                  <f.icon className="w-4.5 h-4.5 text-accent-light" />
                </div>
                <span className="text-sm text-text-secondary">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 pl-12 pb-8">
          <div className="flex items-center gap-6 text-xs text-text-tertiary">
            <span>Free to start</span>
            <span className="w-1 h-1 bg-text-tertiary rounded-full" />
            <span>No credit card</span>
            <span className="w-1 h-1 bg-text-tertiary rounded-full" />
            <span>Must be 18+</span>
          </div>
        </div>
      </div>

      {/* ─── Right: Signup Form ─── */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-14">
            <div className="flex items-center justify-center gap-1.5 mb-3">
              <span className="text-3xl font-black text-text-primary tracking-tight">CLANGER</span>
              <span className="text-xl font-bold text-text-tertiary">.au</span>
            </div>
            <p className="text-text-tertiary text-sm">Australia's #1 Fantasy Sports Platform</p>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-text-primary">Create your account</h1>
            <p className="text-text-secondary text-base mt-2">Start competing in fantasy NBA contests for free.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 mb-6 rounded-xl text-sm text-danger border" style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Display name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full h-12 px-4 bg-bg-card border border-border rounded-xl text-text-primary text-sm focus:border-accent focus:outline-none transition-colors"
                placeholder="FantasyKing42"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 bg-bg-card border border-border rounded-xl text-text-primary text-sm focus:border-accent focus:outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 pr-12 bg-bg-card border border-border rounded-xl text-text-primary text-sm focus:border-accent focus:outline-none transition-colors"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {password.length > 0 && (
                <div className="mt-3 space-y-2">
                  {passwordChecks.map((check) => {
                    const passes = check.test(password)
                    return (
                      <div key={check.label} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passes ? 'bg-success/20' : 'bg-white/5'}`}>
                          <Check className={`w-2.5 h-2.5 ${passes ? 'text-success' : 'text-text-tertiary'}`} />
                        </div>
                        <span className={`text-xs ${passes ? 'text-success' : 'text-text-tertiary'}`}>{check.label}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-accent hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all"
              style={{ boxShadow: '0 0 24px rgba(236,72,153,0.25)' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                'Create Free Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-text-tertiary mt-10">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:text-accent-light font-semibold transition-colors">
              Sign in
            </Link>
          </p>

          <div className="mt-12 pt-6 border-t border-border">
            <p className="text-xs text-text-tertiary text-center leading-relaxed">
              By creating an account you agree to our{' '}
              <button type="button" onClick={() => setLegalModal('Terms of Service')} className="underline hover:text-text-secondary">Terms of Service</button>,{' '}
              <button type="button" onClick={() => setLegalModal('Privacy Policy')} className="underline hover:text-text-secondary">Privacy Policy</button>, and{' '}
              <button type="button" onClick={() => setLegalModal('Responsible Play Policy')} className="underline hover:text-text-secondary">Responsible Play Policy</button>.
              Must be 18+ to play.
            </p>
          </div>
        </div>
      </div>
    </div>

    {legalModal && <LegalModal title={legalModal} onClose={() => setLegalModal(null)} />}
    </>
  )
}
