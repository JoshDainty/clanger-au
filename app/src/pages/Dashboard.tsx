import { Link } from 'react-router-dom'
import { useAuth } from '@/lib/AuthContext'
import {
  Trophy,
  TrendingUp,
  Users,
  Zap,
  Plus,
  UserPlus,
  Shirt,
  ChevronRight,
  Clock,
  ArrowUpRight,
  ArrowDownRight,

  Target,
  DollarSign,
  Star,
  Flame,
} from 'lucide-react'

/* ─── Mock Data ─── */

const stats = [
  { label: 'Active Contests', value: '3', icon: Trophy, change: '+1 today', up: true },
  { label: 'Total Winnings', value: '$842', icon: TrendingUp, change: '+$125 this week', up: true },
  { label: 'Leagues Joined', value: '5', icon: Users, change: '2 drafting', up: true },
  { label: 'Win Rate', value: '62%', icon: Zap, change: 'Top 15%', up: true },
]

const activeContests = [
  {
    id: '1',
    name: 'NBA Tuesday Salary Showdown',
    type: 'Salary',
    typeBg: 'bg-accent/10 text-accent-light',
    score: 187.4,
    rank: 3,
    totalEntries: 412,
    prizePool: '$2,500',
    status: 'live',
    players: ['L. Dončić', 'A. Edwards', 'J. Tatum'],
  },
  {
    id: '2',
    name: 'Best Ball Weekly #47',
    type: 'Best Ball',
    typeBg: 'bg-success/10 text-success',
    score: 145.2,
    rank: 12,
    totalEntries: 1240,
    prizePool: '$10,000',
    status: 'live',
    players: ['N. Jokić', 'S. Gilgeous-Alexander', 'D. Booker'],
  },
  {
    id: '3',
    name: 'Mates League — Round 8',
    type: 'Draft',
    typeBg: 'bg-warning/10 text-warning',
    score: 112.8,
    rank: 1,
    totalEntries: 10,
    prizePool: '$50',
    status: 'Q3',
    players: ['L. James', 'K. Durant', 'J. Brunson'],
  },
]

const upcomingDrafts = [
  { id: '10', name: 'NBA Primetime Draft', type: 'Draft', time: '2h 15m', entry: '$10', spots: 3 },
  { id: '11', name: 'Salary Cap Blitz', type: 'Salary', time: '4h 30m', entry: '$5', spots: 48 },
  { id: '12', name: 'Best Ball Marathon', type: 'Best Ball', time: 'Tomorrow 6pm', entry: '$2', spots: 200 },
]

const todaysGames = [
  { away: 'DAL', home: 'MIN', awayScore: 68, homeScore: 61, status: 'Q3 4:22', live: true },
  { away: 'BOS', home: 'MIL', awayScore: 94, homeScore: 101, status: 'Q4 1:08', live: true },
  { away: 'DEN', home: 'LAL', awayScore: null, homeScore: null, status: '8:30 PM', live: false },
  { away: 'PHX', home: 'GSW', awayScore: null, homeScore: null, status: '10:00 PM', live: false },
]

const recentActivity = [
  { icon: Star, text: 'You drafted Luka Dončić in NBA Tuesday Salary Showdown', time: '12m ago', color: 'text-warning' },
  { icon: TrendingUp, text: 'Your team scored 145.2 pts in Best Ball Weekly #47', time: '1h ago', color: 'text-success' },
  { icon: Trophy, text: 'You moved to 1st place in Mates League — Round 8', time: '2h ago', color: 'text-accent-light' },
  { icon: DollarSign, text: 'Won $125 in NBA Monday Showdown', time: '1d ago', color: 'text-success' },
  { icon: UserPlus, text: 'Joined Best Ball Marathon ($2 entry)', time: '1d ago', color: 'text-text-secondary' },
  { icon: Flame, text: 'Anthony Edwards scored 38.6 fantasy pts for you', time: '2d ago', color: 'text-danger' },
]

/* ─── Component ─── */

export default function Dashboard() {
  const { user } = useAuth()
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Fantasy Fan'

  return (
    <div className="space-y-8 pb-4">

      {/* ─── Welcome + Quick Actions ─── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight">
            G'day, <span className="text-accent-light">{displayName}</span>
          </h1>
          <p className="text-text-secondary text-sm mt-1">3 active contests · 2 games live now</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/contests"
            className="inline-flex items-center gap-2 h-10 px-4 bg-accent hover:bg-accent-dark text-white text-sm font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(236,72,153,0.2)] hover:shadow-[0_0_28px_rgba(236,72,153,0.3)]"
          >
            <Plus className="w-4 h-4" /> Join a Contest
          </Link>
          <Link
            to="/leagues/create"
            className="inline-flex items-center gap-2 h-10 px-4 bg-bg-card hover:bg-bg-elevated border border-border text-text-secondary hover:text-text-primary text-sm font-medium rounded-lg transition-colors"
          >
            <UserPlus className="w-4 h-4" /> Create League
          </Link>
          <Link
            to="/players"
            className="hidden sm:inline-flex items-center gap-2 h-10 px-4 bg-bg-card hover:bg-bg-elevated border border-border text-text-secondary hover:text-text-primary text-sm font-medium rounded-lg transition-colors"
          >
            <Shirt className="w-4 h-4" /> Players
          </Link>
        </div>
      </div>

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-bg-card border border-border rounded-xl p-4 hover:border-accent/20 transition-colors group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-accent/[0.06] border border-accent/10 flex items-center justify-center group-hover:bg-accent/10 group-hover:border-accent/20 transition-colors">
                <stat.icon className="w-[18px] h-[18px] text-accent-light" />
              </div>
              {stat.up ? (
                <ArrowUpRight className="w-4 h-4 text-success" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-danger" />
              )}
            </div>
            <div className="text-[22px] font-bold text-text-primary leading-none">{stat.value}</div>
            <div className="text-[11px] text-text-tertiary mt-1.5 uppercase tracking-wide font-medium">{stat.label}</div>
            <div className="text-xs text-success mt-2 font-medium">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* ─── Main Grid: Contests + Games Sidebar ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Active Contests — 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-text-primary">My Active Contests</h2>
            <Link to="/contests" className="text-xs text-accent hover:text-accent-light font-medium flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {activeContests.map((contest) => (
              <Link
                key={contest.id}
                to={`/contests/${contest.id}/matchup`}
                className="block bg-bg-card border border-border rounded-xl p-4 hover:border-accent/20 transition-all group"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${contest.typeBg}`}>
                        {contest.type}
                      </span>
                      {contest.status === 'live' ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-success uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" /> Live
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-text-tertiary">{contest.status}</span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent-light transition-colors truncate">
                      {contest.name}
                    </h3>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold text-text-primary">{contest.score}</div>
                    <div className="text-[11px] text-text-tertiary">pts</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-text-tertiary">
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      Rank <span className={`font-bold ${contest.rank <= 3 ? 'text-success' : 'text-text-secondary'}`}>#{contest.rank}</span>
                      <span className="text-text-tertiary">/ {contest.totalEntries}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> {contest.prizePool}
                    </span>
                  </div>
                  <div className="flex -space-x-1">
                    {contest.players.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-bg-elevated border-2 border-bg-card text-[8px] font-bold text-text-tertiary"
                        title={p}
                      >
                        {p.split(' ').map(n => n[0]).join('')}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* ─── Upcoming Drafts ─── */}
          <div className="flex items-center justify-between mt-6">
            <h2 className="text-base font-bold text-text-primary">Upcoming Drafts</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {upcomingDrafts.map((draft) => (
              <Link
                key={draft.id}
                to={`/contests/${draft.id}`}
                className="bg-bg-card border border-border rounded-xl p-4 hover:border-accent/20 transition-all group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-3.5 h-3.5 text-warning" />
                  <span className="text-xs font-bold text-warning">{draft.time}</span>
                </div>
                <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent-light transition-colors mb-2 leading-snug">
                  {draft.name}
                </h3>
                <div className="flex items-center justify-between text-xs text-text-tertiary">
                  <span>{draft.entry} entry</span>
                  <span>{draft.spots} spots</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Sidebar — Games + Activity */}
        <div className="space-y-4">

          {/* Today's Games */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-text-primary">Today's NBA</h2>
              <span className="flex items-center gap-1 text-[10px] font-bold text-success uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" /> 2 Live
              </span>
            </div>

            <div className="bg-bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
              {todaysGames.map((game, i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-3 hover:bg-white/[0.01] transition-colors">
                  <div className="flex-1 space-y-1">
                    <div className={`flex items-center justify-between text-sm ${game.live && game.awayScore! > game.homeScore! ? 'font-bold text-text-primary' : 'text-text-secondary'}`}>
                      <span>{game.away}</span>
                      <span>{game.awayScore ?? '—'}</span>
                    </div>
                    <div className={`flex items-center justify-between text-sm ${game.live && game.homeScore! > game.awayScore! ? 'font-bold text-text-primary' : 'text-text-secondary'}`}>
                      <span>{game.home}</span>
                      <span>{game.homeScore ?? '—'}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-14 text-right">
                    {game.live ? (
                      <span className="text-[10px] font-bold text-success bg-success/10 px-1.5 py-0.5 rounded">
                        {game.status}
                      </span>
                    ) : (
                      <span className="text-[11px] text-text-tertiary font-medium">{game.status}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-base font-bold text-text-primary mb-3">Recent Activity</h2>
            <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
              {recentActivity.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 px-4 py-3 ${i < recentActivity.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-secondary leading-relaxed">{item.text}</p>
                    <p className="text-[10px] text-text-tertiary mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
