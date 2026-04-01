import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  SlidersHorizontal,
  Trophy,
  Clock,
  Users,
  DollarSign,
  Zap,
  ChevronDown,
  X,
  Flame,
} from 'lucide-react'

/* ─── Types ─── */
type ContestType = 'Draft' | 'Salary Cap' | 'Best Ball'
type StatusTab = 'Upcoming' | 'Live' | 'Completed'

interface Contest {
  id: string
  name: string
  type: ContestType
  entryFee: number
  prizePool: number
  spotsTotal: number
  spotsFilled: number
  startTime: string
  countdown: string
  status: StatusTab
  featured?: boolean
  guaranteed?: boolean
}

/* ─── Mock Data ─── */
const CONTESTS: Contest[] = [
  { id: '1', name: 'NBA Tuesday Salary Showdown', type: 'Salary Cap', entryFee: 5, prizePool: 2500, spotsTotal: 500, spotsFilled: 412, startTime: 'Today 7:00 PM', countdown: '2h 15m', status: 'Upcoming', featured: true, guaranteed: true },
  { id: '2', name: 'Primetime Draft League', type: 'Draft', entryFee: 10, prizePool: 100, spotsTotal: 10, spotsFilled: 7, startTime: 'Today 7:30 PM', countdown: '2h 45m', status: 'Upcoming' },
  { id: '3', name: 'Best Ball Marathon #47', type: 'Best Ball', entryFee: 2, prizePool: 10000, spotsTotal: 5000, spotsFilled: 3842, startTime: 'Today 8:00 PM', countdown: '3h 15m', status: 'Upcoming', guaranteed: true },
  { id: '4', name: 'High Roller Draft', type: 'Draft', entryFee: 50, prizePool: 500, spotsTotal: 10, spotsFilled: 4, startTime: 'Today 9:00 PM', countdown: '4h 15m', status: 'Upcoming' },
  { id: '5', name: '$1 Micro Salary Blitz', type: 'Salary Cap', entryFee: 1, prizePool: 500, spotsTotal: 1000, spotsFilled: 623, startTime: 'Tomorrow 6:00 PM', countdown: '22h', status: 'Upcoming', guaranteed: true },
  { id: '6', name: 'Best Ball Freeroll', type: 'Best Ball', entryFee: 0, prizePool: 50, spotsTotal: 200, spotsFilled: 188, startTime: 'Tomorrow 7:00 PM', countdown: '23h', status: 'Upcoming' },
  { id: '7', name: 'Mates Draft League', type: 'Draft', entryFee: 5, prizePool: 50, spotsTotal: 10, spotsFilled: 8, startTime: 'Tomorrow 8:00 PM', countdown: '24h', status: 'Upcoming' },
  { id: '8', name: 'Weekend Salary Slam', type: 'Salary Cap', entryFee: 20, prizePool: 5000, spotsTotal: 250, spotsFilled: 89, startTime: 'Sat 5:00 PM', countdown: '3d', status: 'Upcoming', featured: true, guaranteed: true },
  // Live
  { id: '9', name: 'Monday Night Salary Cap', type: 'Salary Cap', entryFee: 5, prizePool: 1500, spotsTotal: 300, spotsFilled: 300, startTime: 'Live', countdown: 'Q3', status: 'Live', guaranteed: true },
  { id: '10', name: 'NBA Afternoon Draft', type: 'Draft', entryFee: 10, prizePool: 100, spotsTotal: 10, spotsFilled: 10, startTime: 'Live', countdown: 'Q2', status: 'Live' },
  // Completed
  { id: '11', name: 'Sunday Showdown', type: 'Salary Cap', entryFee: 5, prizePool: 2000, spotsTotal: 400, spotsFilled: 400, startTime: 'Completed', countdown: 'Final', status: 'Completed', guaranteed: true },
  { id: '12', name: 'Best Ball Weekly #46', type: 'Best Ball', entryFee: 2, prizePool: 8000, spotsTotal: 4000, spotsFilled: 4000, startTime: 'Completed', countdown: 'Final', status: 'Completed' },
]

const TYPE_STYLES: Record<ContestType, { bg: string; dot: string }> = {
  'Draft': { bg: 'bg-accent/10 text-accent-light', dot: 'bg-accent-light' },
  'Salary Cap': { bg: 'bg-success/10 text-success', dot: 'bg-success' },
  'Best Ball': { bg: 'bg-purple-500/10 text-purple-400', dot: 'bg-purple-400' },
}

const STATUS_TABS: StatusTab[] = ['Upcoming', 'Live', 'Completed']
const SORT_OPTIONS = ['Start Time', 'Entry Fee', 'Prize Pool', 'Spots Left'] as const

/* ─── Component ─── */
export default function ContestsList() {
  const [statusTab, setStatusTab] = useState<StatusTab>('Upcoming')
  const [typeFilter, setTypeFilter] = useState<ContestType | 'All'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<typeof SORT_OPTIONS[number]>('Start Time')
  const [showFilters, setShowFilters] = useState(false)

  const liveCount = CONTESTS.filter(c => c.status === 'Live').length

  const filteredContests = useMemo(() => {
    let results = CONTESTS.filter(c => c.status === statusTab)

    if (typeFilter !== 'All') {
      results = results.filter(c => c.type === typeFilter)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      results = results.filter(c => c.name.toLowerCase().includes(q))
    }

    results.sort((a, b) => {
      switch (sortBy) {
        case 'Entry Fee': return a.entryFee - b.entryFee
        case 'Prize Pool': return b.prizePool - a.prizePool
        case 'Spots Left': return (a.spotsTotal - a.spotsFilled) - (b.spotsTotal - b.spotsFilled)
        default: return 0 // Start Time — already in order
      }
    })

    return results
  }, [statusTab, typeFilter, searchQuery, sortBy])

  return (
    <div className="space-y-7">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight">Contests</h1>
          <p className="text-text-secondary text-sm mt-1">Find your next competition.</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 p-1 bg-bg-card border border-border rounded-xl w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusTab(tab)}
            className={`relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all min-h-[44px] flex items-center ${
              statusTab === tab
                ? 'bg-accent text-white shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab}
            {tab === 'Live' && liveCount > 0 && (
              <span className={`ml-1.5 inline-flex items-center justify-center text-[10px] font-bold rounded-full w-4 h-4 ${
                statusTab === 'Live' ? 'bg-white/20 text-white' : 'bg-success/15 text-success'
              }`}>
                {liveCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search + Filter Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 bg-bg-card border border-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none transition-colors"
            placeholder="Search contests..."
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 h-10 px-3 border rounded-lg text-sm font-medium transition-colors ${
            showFilters || typeFilter !== 'All'
              ? 'bg-accent/10 border-accent/25 text-accent-light'
              : 'bg-bg-card border-border text-text-secondary hover:text-text-primary'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {typeFilter !== 'All' && (
            <span className="w-1.5 h-1.5 bg-accent rounded-full" />
          )}
        </button>

        {/* Sort dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 h-10 px-3 bg-bg-card border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors">
            <span className="hidden sm:inline">{sortBy}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <div className="absolute right-0 top-full mt-1 w-40 bg-bg-card border border-border rounded-xl shadow-2xl opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all z-20 py-1">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setSortBy(opt)}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  sortBy === opt ? 'text-accent-light bg-accent/5' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.02]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="flex items-center gap-2 flex-wrap p-3 bg-bg-card border border-border rounded-xl">
          <span className="text-xs text-text-tertiary font-medium mr-1">Type:</span>
          {(['All', 'Draft', 'Salary Cap', 'Best Ball'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                typeFilter === type
                  ? type === 'All'
                    ? 'bg-accent/15 text-accent-light border border-accent/20'
                    : `${TYPE_STYLES[type as ContestType].bg} border border-current/15`
                  : 'bg-bg-elevated text-text-tertiary hover:text-text-secondary border border-transparent'
              }`}
            >
              {type}
            </button>
          ))}
          {typeFilter !== 'All' && (
            <button
              onClick={() => { setTypeFilter('All'); setShowFilters(false) }}
              className="ml-auto text-xs text-text-tertiary hover:text-text-secondary"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Contest List */}
      {filteredContests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-bg-card border border-border flex items-center justify-center mb-4">
            <Trophy className="w-6 h-6 text-text-tertiary" />
          </div>
          <h3 className="text-base font-semibold text-text-primary mb-1">No contests found</h3>
          <p className="text-sm text-text-tertiary max-w-xs">
            {searchQuery
              ? `No results for "${searchQuery}". Try a different search.`
              : 'No contests match your current filters. Try adjusting them.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredContests.map((contest) => {
            const style = TYPE_STYLES[contest.type]
            const spotsLeft = contest.spotsTotal - contest.spotsFilled
            const fillPct = (contest.spotsFilled / contest.spotsTotal) * 100
            const almostFull = fillPct >= 85

            return (
              <div
                key={contest.id}
                className={`bg-bg-card border rounded-xl p-4 hover:border-accent/20 transition-all group ${
                  contest.featured ? 'border-accent/15 ring-1 ring-accent/5' : 'border-border'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Left: Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        {contest.type}
                      </span>
                      {contest.guaranteed && (
                        <span className="text-[10px] font-bold text-warning uppercase tracking-wider flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Guaranteed
                        </span>
                      )}
                      {contest.featured && (
                        <span className="text-[10px] font-bold text-accent-light uppercase tracking-wider flex items-center gap-1">
                          <Flame className="w-3 h-3" /> Featured
                        </span>
                      )}
                      {contest.status === 'Live' && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-success uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" /> {contest.countdown}
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/contests/${contest.id}`}
                      className="text-sm font-semibold text-text-primary group-hover:text-accent-light transition-colors"
                    >
                      {contest.name}
                    </Link>

                    {/* Meta row */}
                    <div className="flex items-center gap-4 mt-2.5 text-xs text-text-tertiary">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {contest.entryFee === 0 ? (
                          <span className="text-success font-bold">FREE</span>
                        ) : (
                          <span>${contest.entryFee} entry</span>
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        <span className="font-semibold text-text-secondary">${contest.prizePool.toLocaleString()}</span> pool
                      </span>
                      {contest.status === 'Upcoming' && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {contest.countdown}
                        </span>
                      )}
                    </div>

                    {/* Spots progress */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 max-w-[200px] h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            contest.status === 'Completed' ? 'bg-text-tertiary' :
                            almostFull ? 'bg-warning' : 'bg-accent'
                          }`}
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${almostFull && contest.status !== 'Completed' ? 'text-warning' : 'text-text-tertiary'}`}>
                        <Users className="w-3 h-3 inline mr-1" />
                        {contest.status === 'Completed'
                          ? `${contest.spotsTotal} entered`
                          : `${contest.spotsFilled}/${contest.spotsTotal}`
                        }
                        {almostFull && spotsLeft > 0 && contest.status === 'Upcoming' && (
                          <span className="text-warning ml-1">· {spotsLeft} left!</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Right: Price + CTA */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0 max-w-[100px] sm:max-w-none">
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-bold text-text-primary">${contest.prizePool.toLocaleString()}</div>
                      <div className="text-[10px] text-text-tertiary uppercase tracking-wide hidden sm:block">Prize Pool</div>
                    </div>
                    {contest.status === 'Upcoming' && (
                      <Link
                        to={`/contests/${contest.id}`}
                        className="inline-flex items-center gap-1.5 h-9 px-4 bg-accent hover:bg-accent-dark text-white text-xs font-bold rounded-lg transition-all shadow-[0_0_16px_rgba(59,130,246,0.15)] hover:shadow-[0_0_24px_rgba(59,130,246,0.25)]"
                      >
                        {contest.entryFee === 0 ? 'Enter Free' : `Join · $${contest.entryFee}`}
                      </Link>
                    )}
                    {contest.status === 'Live' && (
                      <Link
                        to={`/contests/${contest.id}/matchup`}
                        className="inline-flex items-center gap-1.5 h-9 px-4 bg-success/15 text-success text-xs font-bold rounded-lg hover:bg-success/20 transition-colors"
                      >
                        Watch Live
                      </Link>
                    )}
                    {contest.status === 'Completed' && (
                      <Link
                        to={`/contests/${contest.id}`}
                        className="inline-flex items-center gap-1.5 h-9 px-4 bg-bg-elevated text-text-tertiary text-xs font-bold rounded-lg hover:text-text-secondary transition-colors border border-border"
                      >
                        View Results
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
