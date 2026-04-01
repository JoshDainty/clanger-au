import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Camera, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${enabled ? 'bg-accent' : 'bg-border'}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${enabled ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  )
}

export default function ProfileSettings() {
  const { user } = useAuth()
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'JoshDainty')
  const [bio, setBio] = useState('Fantasy NBA enthusiast')
  const [emailContests, setEmailContests] = useState(true)
  const [emailResults, setEmailResults] = useState(true)
  const [emailMarketing, setEmailMarketing] = useState(false)
  const [pushLive, setPushLive] = useState(true)
  const [pushChat, setPushChat] = useState(true)
  const [pushDraft, setPushDraft] = useState(true)
  const [showDanger, setShowDanger] = useState(false)

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Link to="/profile" className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-text-secondary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Profile
      </Link>

      <h1 className="text-3xl font-black text-text-primary tracking-tight">Settings</h1>

      {/* Avatar + Name */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-5">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-16 h-16 rounded-full bg-accent/15 border-2 border-accent/30 flex items-center justify-center text-xl font-bold text-accent-light">
              {displayName.slice(0, 2).toUpperCase()}
            </div>
            <button className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">Profile Photo</p>
            <p className="text-xs text-text-tertiary mt-0.5">Click avatar to upload. JPG or PNG, max 2MB.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="w-full h-11 px-4 bg-bg-primary border border-border rounded-xl text-text-primary text-sm focus:border-accent focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-xl text-text-primary text-sm resize-none focus:border-accent focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
          <input
            type="email"
            value={user?.email || 'player@clanger.au'}
            disabled
            className="w-full h-11 px-4 bg-bg-elevated border border-border rounded-xl text-text-tertiary text-sm cursor-not-allowed"
          />
          <p className="text-[11px] text-text-tertiary mt-1">Email cannot be changed. Contact support if needed.</p>
        </div>

        <button className="h-10 px-5 bg-accent hover:bg-accent-dark text-white text-sm font-bold rounded-xl transition-colors">
          Save Changes
        </button>
      </div>

      {/* Email Preferences */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Email Preferences</h2>
        {[
          { label: 'Contest reminders', desc: 'Draft starts, contest deadlines', value: emailContests, set: setEmailContests },
          { label: 'Results & payouts', desc: 'Contest results, prize notifications', value: emailResults, set: setEmailResults },
          { label: 'News & promotions', desc: 'Platform updates, offers', value: emailMarketing, set: setEmailMarketing },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between py-1">
            <div>
              <div className="text-sm font-medium text-text-primary">{item.label}</div>
              <div className="text-xs text-text-tertiary">{item.desc}</div>
            </div>
            <Toggle enabled={item.value} onChange={item.set} />
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Push Notifications</h2>
        {[
          { label: 'Live scoring updates', desc: 'Player scores during games', value: pushLive, set: setPushLive },
          { label: 'Chat messages', desc: 'League and direct messages', value: pushChat, set: setPushChat },
          { label: 'Draft reminders', desc: 'Your pick is coming up', value: pushDraft, set: setPushDraft },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between py-1">
            <div>
              <div className="text-sm font-medium text-text-primary">{item.label}</div>
              <div className="text-xs text-text-tertiary">{item.desc}</div>
            </div>
            <Toggle enabled={item.value} onChange={item.set} />
          </div>
        ))}
      </div>

      {/* Security */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">Security</h2>
        <button className="w-full h-11 bg-bg-primary border border-border rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:border-accent/25 transition-colors">
          Change Password
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-bg-card border border-danger/20 rounded-xl p-5 space-y-3">
        <h2 className="text-sm font-bold text-danger uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Danger Zone
        </h2>
        <p className="text-xs text-text-tertiary">Permanently delete your account and all associated data. This action cannot be undone.</p>
        {!showDanger ? (
          <button
            onClick={() => setShowDanger(true)}
            className="h-10 px-5 border border-danger/30 text-danger text-sm font-medium rounded-xl hover:bg-danger/5 transition-colors"
          >
            Delete Account
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button className="h-10 px-5 bg-danger text-white text-sm font-bold rounded-xl hover:bg-red-600 transition-colors">
              Yes, Delete My Account
            </button>
            <button onClick={() => setShowDanger(false)} className="h-10 px-4 text-sm text-text-tertiary hover:text-text-secondary">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
