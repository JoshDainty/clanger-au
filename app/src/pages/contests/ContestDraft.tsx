import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, X, ChevronDown, ArrowLeft, Clock, ScrollText,
  TrendingUp, TrendingDown, Minus,
} from 'lucide-react'
import { PLAYERS, POSITIONS, type Position, type Player } from '@/lib/playerData'

/* ─── Types ─── */
interface RosterSlot {
  position: string
  label: string
  player: Player | null
}

interface DraftPick {
  pickNumber: number
  round: number
  pickInRound: number
  teamName: string
  teamIndex: number
  player: Player | null // null = not yet picked
}

/* ─── Constants ─── */
const TEAMS = [
  'JoshDainty', 'MattKellyFF', 'DraftKingAU', 'HoopsDreamer',
  'SlamDunkSid', 'BallerBrisbane', 'CourtVision', 'RimProtector',
  'TripleDouble', 'FantasyPhenom',
]
const MY_TEAM_INDEX = 0
const ROUNDS = 8
const TOTAL_PICKS = TEAMS.length * ROUNDS
const CURRENT_PICK = 15 // Round 2, Pick 5 (0-indexed: 14)
const PICK_TIMER_SECONDS = 60

const POS_COLORS: Record<string, string> = {
  PG: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  SG: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  SF: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  PF: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
  C: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
}

/* ─── Generate snake draft order ─── */
function generateDraftOrder(): DraftPick[] {
  const picks: DraftPick[] = []
  for (let round = 0; round < ROUNDS; round++) {
    const order = round % 2 === 0 ? [...Array(TEAMS.length).keys()] : [...Array(TEAMS.length).keys()].reverse()
    order.forEach((teamIdx, pickInRound) => {
      picks.push({
        pickNumber: picks.length + 1,
        round: round + 1,
        pickInRound: pickInRound + 1,
        teamName: TEAMS[teamIdx],
        teamIndex: teamIdx,
        player: null,
      })
    })
  }
  return picks
}

/* ─── Pre-draft first 14 picks ─── */
function preDraft(picks: DraftPick[]): { picks: DraftPick[]; draftedIds: Set<string> } {
  const topPlayers = [...PLAYERS].sort((a, b) => b.fantasyAvg - a.fantasyAvg)
  const draftedIds = new Set<string>()

  for (let i = 0; i < CURRENT_PICK - 1 && i < topPlayers.length; i++) {
    picks[i].player = topPlayers[i]
    draftedIds.add(topPlayers[i].id)
  }

  return { picks, draftedIds }
}

/* ─── Component ─── */
export default function ContestDraft() {
  const [allPicks, setAllPicks] = useState<DraftPick[]>(() => {
    const { picks } = preDraft(generateDraftOrder())
    return picks
  })
  const [draftedIds, setDraftedIds] = useState<Set<string>>(() => {
    const { draftedIds } = preDraft(generateDraftOrder())
    return draftedIds
  })
  const [roster, setRoster] = useState<RosterSlot[]>([
    { position: 'PG', label: 'PG', player: null },
    { position: 'SG', label: 'SG', player: null },
    { position: 'SF', label: 'SF', player: null },
    { position: 'PF', label: 'PF', player: null },
    { position: 'C', label: 'C', player: null },
    { position: 'UTIL', label: 'UTIL', player: null },
    { position: 'BENCH', label: 'BE', player: null },
    { position: 'BENCH2', label: 'BE', player: null },
  ])
  const [query, setQuery] = useState('')
  const [posFilter, setPosFilter] = useState<Position | 'All'>('All')
  const [timer, setTimer] = useState(PICK_TIMER_SECONDS)
  const [showDraftLog, setShowDraftLog] = useState(false)
  const [mobileTab, setMobileTab] = useState<'players' | 'roster'>('players')

  const currentPickIndex = allPicks.findIndex(p => !p.player)
  const currentPick = currentPickIndex >= 0 ? allPicks[currentPickIndex] : null
  const isMyTurn = currentPick?.teamIndex === MY_TEAM_INDEX
  const completedPicks = allPicks.filter(p => p.player !== null)

  // Timer countdown
  useEffect(() => {
    if (!currentPick) return
    setTimer(PICK_TIMER_SECONDS)
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [currentPickIndex])

  // Available players
  const availablePlayers = useMemo(() => {
    let result = PLAYERS.filter(p => !draftedIds.has(p.id))
    if (posFilter !== 'All') result = result.filter(p => p.position === posFilter)
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q))
    }
    return result.sort((a, b) => b.fantasyAvg - a.fantasyAvg)
  }, [draftedIds, posFilter, query])

  // Draft a player
  const draftPlayer = useCallback((player: Player) => {
    if (!isMyTurn) return

    // Find first open roster slot
    const slotIndex = roster.findIndex(s => {
      if (s.player) return false
      if (s.position === 'UTIL' || s.position === 'BENCH' || s.position === 'BENCH2') return true
      return s.position === player.position
    })
    // fallback to any open UTIL/BENCH
    const finalSlot = slotIndex >= 0 ? slotIndex : roster.findIndex(s => !s.player && (s.position === 'UTIL' || s.position === 'BENCH' || s.position === 'BENCH2'))
    if (finalSlot < 0) return

    setRoster(prev => prev.map((s, i) => i === finalSlot ? { ...s, player } : s))
    setDraftedIds(prev => new Set([...prev, player.id]))
    setAllPicks(prev => prev.map((p, i) => i === currentPickIndex ? { ...p, player } : p))
  }, [isMyTurn, roster, currentPickIndex])

  const projectedTotal = roster.reduce((sum, s) => sum + (s.player?.fantasyAvg ?? 0), 0)

  // Position scarcity
  const positionCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    POSITIONS.forEach(p => {
      counts[p] = PLAYERS.filter(pl => pl.position === p && !draftedIds.has(pl.id)).length
    })
    return counts
  }, [draftedIds])

  return (
    <div className="fixed inset-0 z-50 bg-bg-primary flex flex-col">

      {/* ─── TOP BAR ─── */}
      <div className="h-14 bg-bg-secondary border-b border-border flex items-center px-4 gap-4 flex-shrink-0">
        <Link to="/contests" className="text-text-tertiary hover:text-text-secondary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-text-primary">NBA Primetime Draft</span>
          <span className="text-[10px] font-bold text-accent-light bg-accent/10 px-2 py-0.5 rounded-full border border-accent/15">LIVE</span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          {/* Round/Pick */}
          {currentPick && (
            <div className="hidden sm:flex items-center gap-3 text-xs">
              <span className="text-text-tertiary">Round <span className="text-text-primary font-bold">{currentPick.round}</span></span>
              <span className="text-text-tertiary">Pick <span className="text-text-primary font-bold">{currentPick.pickNumber}</span></span>
            </div>
          )}

          {/* Timer */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
            isMyTurn
              ? timer <= 10
                ? 'bg-danger/15 border-danger/30 timer-critical'
                : 'bg-accent/15 border-accent/30'
              : 'bg-bg-card border-border'
          }`}>
            <Clock className={`w-4 h-4 ${isMyTurn ? timer <= 10 ? 'text-danger' : 'text-accent-light' : 'text-text-tertiary'}`} />
            <span className={`text-lg font-black tabular-nums ${isMyTurn ? timer <= 10 ? 'text-danger' : 'text-accent-light' : 'text-text-secondary'}`}>
              {timer}s
            </span>
          </div>

          {/* Current drafter */}
          {currentPick && (
            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              isMyTurn ? 'bg-accent/10 border border-accent/25' : 'bg-bg-card border border-border'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isMyTurn ? 'bg-accent animate-pulse' : 'bg-text-tertiary'}`} />
              <span className={`text-xs font-bold ${isMyTurn ? 'text-accent-light' : 'text-text-secondary'}`}>
                {isMyTurn ? 'YOUR PICK' : currentPick.teamName}
              </span>
            </div>
          )}

          {/* Draft log toggle */}
          <button
            onClick={() => setShowDraftLog(!showDraftLog)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              showDraftLog ? 'bg-accent/10 border-accent/25 text-accent-light' : 'bg-bg-card border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            <ScrollText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log</span>
          </button>
        </div>
      </div>

      {/* ─── YOUR TURN BANNER ─── */}
      {isMyTurn && (
        <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 border-b border-accent/20 px-4 py-2 text-center">
          <span className="text-sm font-bold text-accent-light">It's your turn to pick! Select a player from the list.</span>
        </div>
      )}

      {/* ─── RECENT PICKS TICKER ─── */}
      <div className="h-9 bg-bg-secondary/50 border-b border-border flex items-center gap-3 px-4 overflow-x-auto flex-shrink-0">
        <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider flex-shrink-0">Recent:</span>
        {completedPicks.slice(-5).reverse().map(pick => (
          <span key={pick.pickNumber} className="text-xs text-text-secondary flex-shrink-0 whitespace-nowrap">
            <span className="text-text-tertiary">#{pick.pickNumber}</span>{' '}
            <span className={pick.teamIndex === MY_TEAM_INDEX ? 'text-accent-light font-semibold' : 'font-medium'}>{pick.teamName}</span>{' '}
            → <span className="text-text-primary">{pick.player?.name}</span>
          </span>
        ))}
      </div>

      {/* ─── MOBILE TAB TOGGLE ─── */}
      <div className="lg:hidden flex items-center border-b border-border flex-shrink-0">
        <button
          onClick={() => setMobileTab('players')}
          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-center transition-colors ${
            mobileTab === 'players' ? 'text-accent-light border-b-2 border-accent' : 'text-text-tertiary'
          }`}
        >
          Available ({availablePlayers.length})
        </button>
        <button
          onClick={() => setMobileTab('roster')}
          className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-center transition-colors ${
            mobileTab === 'roster' ? 'text-accent-light border-b-2 border-accent' : 'text-text-tertiary'
          }`}
        >
          Roster ({roster.filter(s => s.player).length}/{roster.length})
        </button>
      </div>

      {/* ─── MAIN AREA ─── */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT: Available Players */}
        <div className={`flex-1 lg:flex-[6] flex flex-col border-r border-border min-w-0 ${mobileTab !== 'players' ? 'hidden lg:flex' : ''}`}>
          {/* Search + Filters */}
          <div className="p-3 border-b border-border space-y-2 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-8 bg-bg-card border border-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
                placeholder="Search available players..."
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(['All', ...POSITIONS] as const).map(pos => {
                const count = pos === 'All' ? availablePlayers.length : positionCounts[pos] ?? 0
                const scarce = pos !== 'All' && count <= 3
                return (
                  <button
                    key={pos}
                    onClick={() => setPosFilter(pos === 'All' ? 'All' : pos as Position)}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors flex-shrink-0 min-h-[36px] ${
                      posFilter === pos
                        ? 'bg-accent text-white'
                        : 'text-text-tertiary hover:text-text-secondary bg-bg-card border border-border'
                    }`}
                  >
                    {pos}
                    <span className={`text-[10px] ${posFilter === pos ? 'text-white/70' : scarce ? 'text-danger' : 'text-text-tertiary'}`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Player List */}
          <div className="flex-1 overflow-y-auto">
            {/* Header */}
            <div className="grid grid-cols-[1fr_48px_48px_48px_56px_72px] gap-2 items-center px-3 py-2 text-[10px] text-text-tertiary uppercase tracking-wider font-medium border-b border-border sticky top-0 bg-bg-primary z-10">
              <span>Player</span>
              <span className="text-right">PPG</span>
              <span className="text-right">RPG</span>
              <span className="text-right">APG</span>
              <span className="text-right text-accent-light">FPTS</span>
              <span></span>
            </div>

            {availablePlayers.map(player => {
              const initials = player.name.split(' ').map(n => n[0]).join('')
              const trend = player.trending
              return (
                <div
                  key={player.id}
                  className="grid grid-cols-[1fr_48px_48px_48px_56px_72px] gap-2 items-center px-3 py-2.5 border-b border-border/50 hover:bg-white/[0.015] transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 border"
                      style={{ backgroundColor: player.teamColor + '20', borderColor: player.teamColor + '40', color: player.teamColor }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-text-primary truncate">{player.name}</span>
                        {trend === 'up' && <TrendingUp className="w-3 h-3 text-success flex-shrink-0" />}
                        {trend === 'down' && <TrendingDown className="w-3 h-3 text-danger flex-shrink-0" />}
                        {trend === 'stable' && <Minus className="w-3 h-3 text-text-tertiary flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[9px] font-bold px-1 py-px rounded border ${POS_COLORS[player.position]}`}>{player.position}</span>
                        <span className="text-[10px] text-text-tertiary">{player.team}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-text-secondary text-right tabular-nums">{player.ppg}</span>
                  <span className="text-xs text-text-secondary text-right tabular-nums">{player.rpg}</span>
                  <span className="text-xs text-text-secondary text-right tabular-nums">{player.apg}</span>
                  <span className="text-xs font-bold text-accent-light text-right tabular-nums">{player.fantasyAvg}</span>
                  <div className="flex justify-end">
                    <button
                      onClick={() => draftPlayer(player)}
                      disabled={!isMyTurn}
                      className={`h-7 px-3 rounded-md text-[11px] font-bold transition-all ${
                        isMyTurn
                          ? 'bg-accent hover:bg-accent-dark text-white shadow-[0_0_12px_rgba(59,130,246,0.2)] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] cursor-pointer'
                          : 'bg-bg-elevated text-text-tertiary cursor-not-allowed'
                      }`}
                    >
                      Draft
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* RIGHT: Roster + Draft Log */}
        <div className={`w-full lg:w-80 flex flex-col bg-bg-secondary flex-shrink-0 ${mobileTab !== 'roster' ? 'hidden lg:flex' : ''}`}>
          {/* Roster Section */}
          <div className={`flex-1 flex flex-col overflow-hidden ${showDraftLog ? 'h-1/2' : ''}`}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
              <h3 className="text-sm font-bold text-text-primary">Your Roster</h3>
              <div className="text-right">
                <span className="text-xs text-text-tertiary">Projected </span>
                <span className="text-sm font-bold text-accent-light">{projectedTotal.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {roster.map((slot, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-2.5 border-b border-border/50 ${slot.player ? '' : 'opacity-50'}`}>
                  <div className={`w-8 h-5 rounded text-[10px] font-bold flex items-center justify-center flex-shrink-0 border ${
                    slot.position === 'UTIL' || slot.position === 'BENCH' || slot.position === 'BENCH2'
                      ? 'bg-bg-elevated text-text-tertiary border-border'
                      : POS_COLORS[slot.position] || 'bg-bg-elevated text-text-tertiary border-border'
                  }`}>
                    {slot.label}
                  </div>
                  {slot.player ? (
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-text-primary truncate">{slot.player.name}</div>
                      <div className="flex items-center gap-2 text-[10px] text-text-tertiary">
                        <span>{slot.player.team} · {slot.player.position}</span>
                        <span className="text-accent-light font-bold">{slot.player.fantasyAvg} FPTS</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-text-tertiary italic">Empty</span>
                  )}
                </div>
              ))}
            </div>

            {/* Roster count */}
            <div className="px-4 py-2.5 border-t border-border flex items-center justify-between text-xs text-text-tertiary flex-shrink-0">
              <span>{roster.filter(s => s.player).length}/{roster.length} drafted</span>
              <div className="flex items-center gap-2">
                {POSITIONS.map(pos => (
                  <span key={pos} className={`text-[10px] font-bold ${positionCounts[pos] <= 3 ? 'text-danger' : 'text-text-tertiary'}`}>
                    {pos}: {positionCounts[pos]}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Draft Log */}
          {showDraftLog && (
            <div className="h-1/2 flex flex-col border-t border-border">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border flex-shrink-0">
                <h3 className="text-sm font-bold text-text-primary">Draft Log</h3>
                <button onClick={() => setShowDraftLog(false)} className="text-text-tertiary hover:text-text-secondary">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {completedPicks.map(pick => (
                  <div key={pick.pickNumber} className={`flex items-start gap-2 px-4 py-2 text-xs border-b border-border/30 ${
                    pick.teamIndex === MY_TEAM_INDEX ? 'bg-accent/[0.04]' : ''
                  }`}>
                    <span className="text-text-tertiary font-mono w-5 flex-shrink-0">#{pick.pickNumber}</span>
                    <div className="min-w-0">
                      <span className={`font-semibold ${pick.teamIndex === MY_TEAM_INDEX ? 'text-accent-light' : 'text-text-secondary'}`}>
                        {pick.teamName}
                      </span>
                      <span className="text-text-tertiary"> selects </span>
                      <span className="text-text-primary font-semibold">{pick.player?.name}</span>
                      <span className="text-text-tertiary"> ({pick.player?.position})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
