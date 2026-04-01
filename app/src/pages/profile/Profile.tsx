import { Link } from 'react-router-dom'
import { useAuth } from '@/lib/AuthContext'
import { Trophy, TrendingUp, Target, Zap, Settings, Camera, Award, Flame, Crown, Star, Shield } from 'lucide-react'

const stats = [
  { label: 'Contests Played', value: '47', icon: Trophy },
  { label: 'Wins', value: '18', icon: Target },
  { label: 'Win Rate', value: '38%', icon: TrendingUp },
  { label: 'Total Winnings', value: '$842', icon: Zap },
]

const recentResults = [
  { contest: 'NBA Tuesday Salary Showdown', type: 'Salary Cap', rank: 3, totalEntries: 412, prize: '$125', date: 'Today' },
  { contest: 'Best Ball Weekly #46', type: 'Best Ball', rank: 12, totalEntries: 1240, prize: '$45', date: 'Yesterday' },
  { contest: 'Mates League — Round 7', type: 'Draft', rank: 1, totalEntries: 10, prize: '$25', date: '3d ago' },
  { contest: 'Monday Night Showdown', type: 'Salary Cap', rank: 8, totalEntries: 300, prize: '$10', date: '5d ago' },
  { contest: 'High Roller Draft', type: 'Draft', rank: 2, totalEntries: 10, prize: '$200', date: '1w ago' },
]

const achievements = [
  { icon: Crown, label: 'First Place', desc: 'Win a contest', color: '#F59E0B', unlocked: true },
  { icon: Flame, label: 'Hot Streak', desc: 'Win 3 in a row', color: '#EF4444', unlocked: true },
  { icon: Star, label: 'All-Star', desc: 'Score 200+ pts', color: '#3B82F6', unlocked: true },
  { icon: Shield, label: 'Iron Defense', desc: 'Top 10 in 10 contests', color: '#10B981', unlocked: true },
  { icon: Trophy, label: 'Grand Slam', desc: 'Win all 3 contest types', color: '#8B5CF6', unlocked: false },
  { icon: Award, label: 'Season MVP', desc: 'Win a season league', color: '#EC4899', unlocked: false },
]

export default function Profile() {
  const { user } = useAuth()
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'JoshDainty'
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-16 h-16 rounded-full bg-accent/15 border-2 border-accent/30 flex items-center justify-center text-xl font-bold text-accent-light">
              {initials}
            </div>
            <button className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">{displayName}</h1>
            <p className="text-sm text-text-tertiary mt-0.5">Fantasy NBA enthusiast · Melbourne, AU</p>
            <p className="text-xs text-text-tertiary mt-1">Member since March 2026</p>
          </div>
        </div>
        <Link to="/profile/settings" className="flex items-center gap-1.5 h-9 px-3 bg-bg-card border border-border rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary transition-colors">
          <Settings className="w-3.5 h-3.5" /> Edit
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-bg-card border border-border rounded-xl p-4">
            <div className="w-8 h-8 rounded-lg bg-accent/[0.06] border border-accent/10 flex items-center justify-center mb-3">
              <s.icon className="w-4 h-4 text-accent-light" />
            </div>
            <div className="text-xl font-bold text-text-primary">{s.value}</div>
            <div className="text-[11px] text-text-tertiary uppercase tracking-wide mt-1 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-base font-bold text-text-primary mb-3">Achievements</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {achievements.map(a => (
            <div key={a.label} className={`flex flex-col items-center text-center p-3 rounded-xl border transition-colors ${a.unlocked ? 'bg-bg-card border-border' : 'bg-bg-card/50 border-border/50 opacity-40'}`}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-2 border"
                style={a.unlocked ? { backgroundColor: a.color + '15', borderColor: a.color + '30', color: a.color } : { backgroundColor: 'rgba(107,114,128,0.1)', borderColor: 'rgba(107,114,128,0.2)', color: '#6B7280' }}
              >
                <a.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-text-primary leading-tight">{a.label}</span>
              <span className="text-[9px] text-text-tertiary mt-0.5">{a.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Results */}
      <div>
        <h2 className="text-base font-bold text-text-primary mb-3">Recent Results</h2>
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden divide-y divide-border/50">
          {recentResults.map((r, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-text-primary truncate">{r.contest}</div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-text-tertiary">
                  <span>{r.type}</span>
                  <span>·</span>
                  <span>#{r.rank} of {r.totalEntries}</span>
                  <span>·</span>
                  <span>{r.date}</span>
                </div>
              </div>
              <span className={`text-sm font-bold flex-shrink-0 ml-3 ${r.rank <= 3 ? 'text-success' : 'text-text-secondary'}`}>
                {r.prize}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
