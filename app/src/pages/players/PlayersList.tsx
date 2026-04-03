import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus, X } from 'lucide-react'
import { PLAYERS, POSITIONS, ALL_TEAMS, type Position, type Player } from '@/lib/playerData'

type SortKey = 'fantasyAvg' | 'ppg' | 'rpg' | 'apg' | 'fgPct' | 'salary' | 'name'
type SortDir = 'asc' | 'desc'

const STAT_COLS: { key: SortKey; label: string; short: string }[] = [
  { key: 'fantasyAvg', label: 'Fantasy', short: 'FPTS' },
  { key: 'ppg', label: 'Points', short: 'PPG' },
  { key: 'rpg', label: 'Rebounds', short: 'RPG' },
  { key: 'apg', label: 'Assists', short: 'APG' },
  { key: 'fgPct', label: 'FG%', short: 'FG%' },
  { key: 'salary', label: 'Salary', short: 'SAL' },
]

function TrendIcon({ trend }: { trend: Player['trending'] }) {
  if (trend === 'up') return <TrendingUp className="w-3 h-3 text-success" />
  if (trend === 'down') return <TrendingDown className="w-3 h-3 text-danger" />
  return <Minus className="w-3 h-3 text-text-tertiary" />
}

function PlayerAvatar({ player }: { player: Player }) {
  const initials = player.name.split(' ').map(n => n[0]).join('')
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border-2"
      style={{ backgroundColor: player.teamColor + '25', borderColor: player.teamColor + '50', color: player.teamColor }}
    >
      {initials}
    </div>
  )
}

export default function PlayersList() {
  const [query, setQuery] = useState('')
  const [posFilter, setPosFilter] = useState<Position | 'All'>('All')
  const [teamFilter, setTeamFilter] = useState<string>('All')
  const [sortKey, setSortKey] = useState<SortKey>('fantasyAvg')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const filteredPlayers = useMemo(() => {
    let results = [...PLAYERS]

    if (query.trim()) {
      const q = query.toLowerCase()
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q)
      )
    }
    if (posFilter !== 'All') results = results.filter(p => p.position === posFilter)
    if (teamFilter !== 'All') results = results.filter(p => p.team === teamFilter)

    results.sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
    })

    return results
  }, [query, posFilter, teamFilter, sortKey, sortDir])

  const SortHeader = ({ col }: { col: typeof STAT_COLS[number] }) => {
    const active = sortKey === col.key
    return (
      <button
        onClick={() => handleSort(col.key)}
        className={`flex items-center gap-1 justify-end font-medium text-[11px] uppercase tracking-wider transition-colors ${
          active ? 'text-accent-light' : 'text-text-tertiary hover:text-text-secondary'
        }`}
      >
        {col.short}
        {active && (sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
      </button>
    )
  }

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-3xl font-black text-text-primary tracking-tight">Players</h1>
        <p className="text-text-secondary text-sm mt-1">{PLAYERS.length} NBA players · 2025–26 season stats</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-10 pl-9 pr-9 bg-bg-card border border-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none transition-colors"
          placeholder="Search players or teams..."
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 p-0.5 bg-bg-card border border-border rounded-lg">
          <button
            onClick={() => setPosFilter('All')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              posFilter === 'All' ? 'bg-accent text-white' : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            All
          </button>
          {POSITIONS.map(pos => (
            <button
              key={pos}
              onClick={() => setPosFilter(pos === posFilter ? 'All' : pos)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                posFilter === pos ? 'bg-accent text-white' : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>

        <div className="relative group">
          <button className={`flex items-center gap-2 h-8 px-3 border rounded-lg text-xs font-medium transition-colors ${
            teamFilter !== 'All'
              ? 'bg-accent/10 border-accent/25 text-accent-light'
              : 'bg-bg-card border-border text-text-secondary hover:text-text-primary'
          }`}>
            {teamFilter === 'All' ? 'All Teams' : teamFilter}
            <ChevronDown className="w-3 h-3" />
          </button>
          <div className="absolute left-0 top-full mt-1 w-36 max-h-64 overflow-y-auto bg-bg-card border border-border rounded-xl shadow-2xl opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all z-20 py-1">
            <button
              onClick={() => setTeamFilter('All')}
              className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                teamFilter === 'All' ? 'text-accent-light bg-accent/5' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.02]'
              }`}
            >
              All Teams
            </button>
            {ALL_TEAMS.map(t => (
              <button
                key={t}
                onClick={() => setTeamFilter(t)}
                className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                  teamFilter === t ? 'text-accent-light bg-accent/5' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.02]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-text-tertiary ml-auto">{filteredPlayers.length} players</span>
      </div>

      {/* Table */}
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <div className="hidden lg:grid grid-cols-[1fr_56px_56px_56px_56px_56px_64px] gap-4 items-center px-4 py-3 border-b border-border">
          <button
            onClick={() => handleSort('name')}
            className={`flex items-center gap-1 text-[11px] uppercase tracking-wider font-medium ${
              sortKey === 'name' ? 'text-accent-light' : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            Player
            {sortKey === 'name' && (sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
          </button>
          {STAT_COLS.map(col => <SortHeader key={col.key} col={col} />)}
        </div>

        {filteredPlayers.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-text-tertiary">No players match your search.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredPlayers.map((player, i) => (
              <Link
                key={player.id}
                to={`/players/${player.id}`}
                className="flex lg:grid lg:grid-cols-[1fr_56px_56px_56px_56px_56px_64px] gap-4 items-center px-4 py-3 hover:bg-white/[0.015] transition-colors group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xs text-text-tertiary w-5 text-right flex-shrink-0 hidden sm:block">{i + 1}</span>
                  <PlayerAvatar player={player} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-text-primary group-hover:text-accent-light transition-colors truncate">{player.name}</span>
                      <TrendIcon trend={player.trending} />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: player.teamColor + '18', color: player.teamColor }}>{player.team}</span>
                      <span className="text-[10px] font-bold text-text-tertiary bg-bg-elevated px-1.5 py-0.5 rounded">{player.position}</span>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block text-right"><span className="text-sm font-bold text-accent-light">{player.fantasyAvg}</span></div>
                <div className="hidden lg:block text-right text-sm text-text-secondary">{player.ppg}</div>
                <div className="hidden lg:block text-right text-sm text-text-secondary">{player.rpg}</div>
                <div className="hidden lg:block text-right text-sm text-text-secondary">{player.apg}</div>
                <div className="hidden lg:block text-right text-sm text-text-secondary">{player.fgPct}%</div>
                <div className="hidden lg:block text-right text-xs text-text-tertiary">${(player.salary / 1000).toFixed(1)}K</div>

                <div className="flex items-center gap-3 lg:hidden flex-shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-bold text-accent-light">{player.fantasyAvg}</div>
                    <div className="text-[10px] text-text-tertiary">FPTS</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-text-secondary">{player.ppg}</div>
                    <div className="text-[10px] text-text-tertiary">PPG</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
