import { Link } from 'react-router-dom'
import { Plus, Crown, ChevronRight, Trophy, Users, Zap } from 'lucide-react'

interface League {
  id: string
  name: string
  type: string
  typeBg: string
  members: number
  maxMembers: number
  myRank: number
  record: string
  entryFee: number
  isCommissioner: boolean
  status: 'active' | 'drafting' | 'completed'
}

const leagues: League[] = [
  { id: '1', name: 'Mates League 2026', type: 'Draft', typeBg: 'bg-accent/10 text-accent-light', members: 8, maxMembers: 10, myRank: 1, record: '8-2', entryFee: 5, isCommissioner: true, status: 'active' },
  { id: '2', name: 'Work Legends', type: 'Salary Cap', typeBg: 'bg-success/10 text-success', members: 12, maxMembers: 12, myRank: 4, record: '6-4', entryFee: 10, isCommissioner: false, status: 'active' },
  { id: '3', name: 'Best Ball Bros', type: 'Best Ball', typeBg: 'bg-purple-500/10 text-purple-400', members: 6, maxMembers: 8, myRank: 2, record: '7-3', entryFee: 2, isCommissioner: false, status: 'active' },
  { id: '4', name: 'Sunday Sessions', type: 'Draft', typeBg: 'bg-accent/10 text-accent-light', members: 10, maxMembers: 10, myRank: 0, record: '—', entryFee: 20, isCommissioner: true, status: 'drafting' },
]

export default function LeaguesList() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Leagues</h1>
          <p className="text-text-secondary text-sm mt-1">{leagues.length} leagues · {leagues.filter(l => l.status === 'active').length} active</p>
        </div>
        <Link
          to="/leagues/create"
          className="inline-flex items-center gap-2 h-10 px-4 bg-accent hover:bg-accent-dark text-white text-sm font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)]"
        >
          <Plus className="w-4 h-4" /> Create a League
        </Link>
      </div>

      <div className="space-y-3">
        {leagues.map(league => (
          <Link
            key={league.id}
            to={`/leagues/${league.id}`}
            className="block bg-bg-card border border-border rounded-xl p-4 hover:border-accent/20 transition-all group"
          >
            <div className="flex items-start gap-4">
              {/* Left: Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${league.typeBg}`}>
                    {league.type}
                  </span>
                  {league.isCommissioner && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-warning">
                      <Crown className="w-3 h-3" /> Commissioner
                    </span>
                  )}
                  {league.status === 'drafting' && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-accent-light">
                      <Zap className="w-3 h-3" /> Drafting Soon
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent-light transition-colors">
                  {league.name}
                </h3>

                <div className="flex items-center gap-4 mt-2.5 text-xs text-text-tertiary">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {league.members}/{league.maxMembers}
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> ${league.entryFee} entry
                  </span>
                  {league.status === 'active' && (
                    <span>Record: <span className="text-text-secondary font-medium">{league.record}</span></span>
                  )}
                </div>
              </div>

              {/* Right: Rank + Arrow */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {league.status === 'active' && league.myRank > 0 && (
                  <div className="text-right">
                    <div className={`text-lg font-bold ${league.myRank <= 3 ? 'text-success' : 'text-text-primary'}`}>
                      #{league.myRank}
                    </div>
                    <div className="text-[10px] text-text-tertiary uppercase tracking-wide">Rank</div>
                  </div>
                )}
                <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-text-secondary transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
