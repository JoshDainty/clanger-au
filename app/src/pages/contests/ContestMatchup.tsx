import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Zap, LayoutGrid, MapPin, Sparkles, MessageSquare } from 'lucide-react'
import CourtView, { type AnimationIntensity, type CourtPlayer } from '@/components/CourtView'

/* ─── Types ─── */
type GameStatus = { type: 'live'; quarter: string; clock: string } | { type: 'final' } | { type: 'upcoming'; time: string }

interface MatchupPlayer {
  name: string
  team: string
  teamColor: string
  position: string
  fantasyPts: number
  pts: number
  reb: number
  ast: number
  gameStatus: GameStatus
}

interface EventItem {
  id: number
  player: string
  team: string
  action: string
  points: number
  time: string
  icon: 'three' | 'dunk' | 'assist' | 'rebound' | 'steal' | 'block' | 'foul' | 'ft'
}

/* ─── Mock Data ─── */
const MY_TEAM = { name: 'JoshDainty', record: '8-2', rank: 1 }
const OPP_TEAM = { name: 'MattKellyFF', record: '6-4', rank: 4 }

const myPlayers: MatchupPlayer[] = [
  { name: 'Luka Dončić', team: 'DAL', teamColor: '#007DC5', position: 'PG', fantasyPts: 52.4, pts: 28, reb: 9, ast: 11, gameStatus: { type: 'live', quarter: 'Q3', clock: '4:22' } },
  { name: 'Anthony Edwards', team: 'MIN', teamColor: '#236192', position: 'SG', fantasyPts: 41.8, pts: 24, reb: 5, ast: 4, gameStatus: { type: 'live', quarter: 'Q3', clock: '4:22' } },
  { name: 'Jayson Tatum', team: 'BOS', teamColor: '#007A33', position: 'SF', fantasyPts: 38.6, pts: 22, reb: 8, ast: 3, gameStatus: { type: 'live', quarter: 'Q4', clock: '1:08' } },
  { name: 'Giannis A.', team: 'MIL', teamColor: '#00471B', position: 'PF', fantasyPts: 33.2, pts: 18, reb: 11, ast: 5, gameStatus: { type: 'live', quarter: 'Q4', clock: '1:08' } },
  { name: 'Nikola Jokić', team: 'DEN', teamColor: '#0E2240', position: 'C', fantasyPts: 0, pts: 0, reb: 0, ast: 0, gameStatus: { type: 'upcoming', time: '8:30 PM' } },
  { name: 'Damian Lillard', team: 'MIL', teamColor: '#00471B', position: 'UTIL', fantasyPts: 21.4, pts: 14, reb: 3, ast: 6, gameStatus: { type: 'live', quarter: 'Q4', clock: '1:08' } },
]

const oppPlayers: MatchupPlayer[] = [
  { name: 'Shai Gilgeous-Alexander', team: 'OKC', teamColor: '#007AC1', position: 'PG', fantasyPts: 44.2, pts: 26, reb: 4, ast: 7, gameStatus: { type: 'final' } },
  { name: 'Devin Booker', team: 'PHX', teamColor: '#E56020', position: 'SG', fantasyPts: 32.1, pts: 22, reb: 3, ast: 5, gameStatus: { type: 'final' } },
  { name: 'Kevin Durant', team: 'PHX', teamColor: '#E56020', position: 'SF', fantasyPts: 28.5, pts: 20, reb: 5, ast: 3, gameStatus: { type: 'final' } },
  { name: 'Paolo Banchero', team: 'ORL', teamColor: '#0077C0', position: 'PF', fantasyPts: 22.8, pts: 14, reb: 6, ast: 4, gameStatus: { type: 'upcoming', time: '8:30 PM' } },
  { name: 'Bam Adebayo', team: 'MIA', teamColor: '#98002E', position: 'C', fantasyPts: 18.4, pts: 10, reb: 9, ast: 3, gameStatus: { type: 'final' } },
  { name: 'Trae Young', team: 'ATL', teamColor: '#E03A3E', position: 'UTIL', fantasyPts: 17.8, pts: 12, reb: 2, ast: 8, gameStatus: { type: 'final' } },
]

const myTotal = myPlayers.reduce((s, p) => s + p.fantasyPts, 0)
const oppTotal = oppPlayers.reduce((s, p) => s + p.fantasyPts, 0)
const totalMax = myTotal + oppTotal || 1
const myPct = (myTotal / totalMax) * 100

const events: EventItem[] = [
  { id: 1, player: 'Luka Dončić', team: 'DAL', action: '3-pointer', points: 4.5, time: '12s ago', icon: 'three' },
  { id: 2, player: 'Anthony Edwards', team: 'MIN', action: 'Driving layup', points: 3.0, time: '45s ago', icon: 'dunk' },
  { id: 3, player: 'Jayson Tatum', team: 'BOS', action: 'Offensive rebound', points: 1.2, time: '1m ago', icon: 'rebound' },
  { id: 4, player: 'Giannis A.', team: 'MIL', action: 'Blocked shot', points: 3.0, time: '2m ago', icon: 'block' },
  { id: 5, player: 'Luka Dončić', team: 'DAL', action: 'Assist to Kyrie', points: 1.5, time: '3m ago', icon: 'assist' },
  { id: 6, player: 'Anthony Edwards', team: 'MIN', action: 'Steal + fast break', points: 5.0, time: '4m ago', icon: 'steal' },
  { id: 7, player: 'Damian Lillard', team: 'MIL', action: 'Free throws (2/2)', points: 2.0, time: '5m ago', icon: 'ft' },
  { id: 8, player: 'Jayson Tatum', team: 'BOS', action: 'Pull-up midrange', points: 3.0, time: '6m ago', icon: 'dunk' },
  { id: 9, player: 'Luka Dončić', team: 'DAL', action: 'Steal', points: 2.0, time: '8m ago', icon: 'steal' },
  { id: 10, player: 'Giannis A.', team: 'MIL', action: 'And-one dunk', points: 4.5, time: '10m ago', icon: 'dunk' },
]

const EVENT_ICONS: Record<string, { emoji: string; color: string }> = {
  three: { emoji: '🎯', color: 'text-accent-light' },
  dunk: { emoji: '🔥', color: 'text-warning' },
  assist: { emoji: '🏀', color: 'text-success' },
  rebound: { emoji: '💪', color: 'text-text-secondary' },
  steal: { emoji: '⚡', color: 'text-purple-400' },
  block: { emoji: '🛡️', color: 'text-danger' },
  foul: { emoji: '⚠️', color: 'text-warning' },
  ft: { emoji: '🎯', color: 'text-text-secondary' },
}

/* ─── Helpers ─── */
function StatusBadge({ status }: { status: GameStatus }) {
  if (status.type === 'live') return (
    <span className="flex items-center gap-1 text-[10px] font-bold text-success">
      <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
      {status.quarter} {status.clock}
    </span>
  )
  if (status.type === 'final') return <span className="text-[10px] font-bold text-text-tertiary">FINAL</span>
  return <span className="text-[10px] font-medium text-text-tertiary">{status.time}</span>
}

function PlayerAvatar({ name, teamColor }: { name: string; teamColor: string }) {
  const initials = name.split(' ').map(n => n[0]).join('')
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 border-2"
      style={{ backgroundColor: teamColor + '20', borderColor: teamColor + '45', color: teamColor }}
    >
      {initials}
    </div>
  )
}

/* ─── Main Component ─── */
export default function ContestMatchup() {
  const [viewMode, setViewMode] = useState<'list' | 'court'>('list')
  const [animIntensity, setAnimIntensity] = useState<AnimationIntensity>('full')

  const winning = myTotal > oppTotal
  const diff = Math.abs(myTotal - oppTotal).toFixed(1)

  // Map matchup players to CourtPlayer format
  const courtMyPlayers: CourtPlayer[] = myPlayers.map(p => ({
    id: `my-${p.name}`,
    name: p.name,
    team: p.team,
    teamColor: p.teamColor,
    position: p.position,
    fantasyPts: p.fantasyPts,
    isLive: p.gameStatus.type === 'live',
    isMine: true,
  }))
  const courtOppPlayers: CourtPlayer[] = oppPlayers.map(p => ({
    id: `opp-${p.name}`,
    name: p.name,
    team: p.team,
    teamColor: p.teamColor,
    position: p.position,
    fantasyPts: p.fantasyPts,
    isLive: p.gameStatus.type === 'live',
    isMine: false,
  }))

  return (
    <div className="space-y-7 pb-4">
      {/* Back */}
      <Link to="/leagues/1" className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-text-secondary transition-colors">
        <ArrowLeft className="w-4 h-4" /> League
      </Link>

      {/* ─── SCOREBOARD ─── */}
      <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
        {/* Live badge */}
        <div className="flex items-center justify-center gap-2 py-2 bg-success/[0.06] border-b border-success/10">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-xs font-bold text-success uppercase tracking-wider">Live Matchup · NBA Tuesday Salary Showdown</span>
        </div>

        {/* Scores */}
        <div className="px-4 py-6 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* My team */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-3 justify-center sm:justify-start mb-2">
                <div className="w-11 h-11 rounded-full bg-accent/15 border-2 border-accent/30 flex items-center justify-center text-sm font-bold text-accent-light">
                  JD
                </div>
                <div>
                  <div className="text-sm font-bold text-text-primary">{MY_TEAM.name}</div>
                  <div className="text-[10px] text-text-tertiary">{MY_TEAM.record} · #{MY_TEAM.rank}</div>
                </div>
              </div>
              <div className={`text-4xl sm:text-5xl font-black tabular-nums ${winning ? 'text-accent-light' : 'text-text-primary'}`}>
                {myTotal.toFixed(1)}
              </div>
            </div>

            {/* VS / status */}
            <div className="flex flex-col items-center gap-2 px-2 flex-shrink-0">
              <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${winning ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                {winning ? '+' : '-'}{diff}
              </div>
              <span className="text-[10px] text-text-tertiary font-medium uppercase tracking-wider">VS</span>
            </div>

            {/* Opponent */}
            <div className="flex-1 text-center sm:text-right">
              <div className="flex items-center gap-3 justify-center sm:justify-end mb-2">
                <div className="sm:order-2 w-11 h-11 rounded-full bg-danger/12 border-2 border-danger/25 flex items-center justify-center text-sm font-bold text-danger">
                  MK
                </div>
                <div className="sm:order-1">
                  <div className="text-sm font-bold text-text-primary">{OPP_TEAM.name}</div>
                  <div className="flex items-center gap-2 text-[10px] text-text-tertiary">
                    <span>{OPP_TEAM.record} · #{OPP_TEAM.rank}</span>
                    <Link to="/chat" className="text-accent hover:text-accent-light transition-colors" title="Message opponent">
                      <MessageSquare className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className={`text-4xl sm:text-5xl font-black tabular-nums ${!winning ? 'text-danger' : 'text-text-primary'}`}>
                {oppTotal.toFixed(1)}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5 h-2 bg-danger/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light transition-all duration-700"
              style={{ width: `${myPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-[10px] text-text-tertiary font-medium">
            <span>{myPct.toFixed(0)}%</span>
            <span>{(100 - myPct).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* ─── VIEW TOGGLE ─── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-0.5 bg-bg-card border border-border rounded-lg">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'list' ? 'bg-accent text-white' : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> List
          </button>
          <button
            onClick={() => setViewMode('court')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'court' ? 'bg-accent text-white' : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" /> Court
          </button>
        </div>

        {viewMode === 'court' && (
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-text-tertiary" />
            <div className="flex items-center gap-0.5 p-0.5 bg-bg-card border border-border rounded-md">
              {(['full', 'reduced', 'off'] as AnimationIntensity[]).map(level => (
                <button
                  key={level}
                  onClick={() => setAnimIntensity(level)}
                  className={`px-2 py-1 rounded text-[10px] font-medium capitalize transition-colors ${
                    animIntensity === level ? 'bg-accent/15 text-accent-light' : 'text-text-tertiary hover:text-text-secondary'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── COURT VIEW ─── */}
      {viewMode === 'court' && (
        <div className="bg-bg-card border border-border rounded-2xl p-4 overflow-hidden">
          <CourtView
            myPlayers={courtMyPlayers}
            oppPlayers={courtOppPlayers}
            intensity={animIntensity}
          />
        </div>
      )}

      {/* ─── PLAYER COMPARISONS (List View) ─── */}
      {viewMode === 'list' && (
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-text-primary">Player Matchups</h2>
          <span className="text-xs text-text-tertiary">{myPlayers.filter(p => p.gameStatus.type === 'live').length} players live</span>
        </div>

        <div className="space-y-2">
          {myPlayers.map((mine, i) => {
            const opp = oppPlayers[i]
            const myWins = mine.fantasyPts > opp.fantasyPts
            const bothZero = mine.fantasyPts === 0 && opp.fantasyPts === 0
            const borderColor = bothZero ? 'border-border' : myWins ? 'border-success/20' : 'border-danger/20'

            return (
              <div key={i} className={`bg-bg-card border ${borderColor} rounded-xl overflow-hidden`}>
                {/* Position header */}
                <div className="flex items-center justify-between px-4 py-1.5 bg-bg-elevated/50 border-b border-border/50">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">{mine.position}</span>
                  {!bothZero && (
                    <span className={`text-[10px] font-bold ${myWins ? 'text-success' : 'text-danger'}`}>
                      {myWins ? '+' : ''}{(mine.fantasyPts - opp.fantasyPts).toFixed(1)}
                    </span>
                  )}
                </div>

                <div className="flex items-stretch">
                  {/* My player */}
                  <div className={`flex-1 p-3 ${!bothZero && myWins ? 'bg-success/[0.02]' : ''}`}>
                    <div className="flex items-center gap-2.5 mb-2">
                      <PlayerAvatar name={mine.name} teamColor={mine.teamColor} />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-text-primary truncate">{mine.name}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-text-tertiary">{mine.team}</span>
                          <StatusBadge status={mine.gameStatus} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className={`text-xl font-black tabular-nums ${mine.gameStatus.type === 'upcoming' ? 'text-text-tertiary' : myWins ? 'text-success' : 'text-text-primary'}`}>
                        {mine.fantasyPts || '—'}
                      </span>
                      {mine.gameStatus.type !== 'upcoming' && (
                        <span className="text-[10px] text-text-tertiary tabular-nums">{mine.pts}p {mine.reb}r {mine.ast}a</span>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-px bg-border" />

                  {/* Opp player */}
                  <div className={`flex-1 p-3 ${!bothZero && !myWins ? 'bg-danger/[0.02]' : ''}`}>
                    <div className="flex items-center gap-2.5 mb-2">
                      <PlayerAvatar name={opp.name} teamColor={opp.teamColor} />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-text-primary truncate">{opp.name}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-text-tertiary">{opp.team}</span>
                          <StatusBadge status={opp.gameStatus} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className={`text-xl font-black tabular-nums ${opp.gameStatus.type === 'upcoming' ? 'text-text-tertiary' : !myWins ? 'text-danger' : 'text-text-primary'}`}>
                        {opp.fantasyPts || '—'}
                      </span>
                      {opp.gameStatus.type !== 'upcoming' && (
                        <span className="text-[10px] text-text-tertiary tabular-nums">{opp.pts}p {opp.reb}r {opp.ast}a</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      )}

      {/* ─── EVENT FEED ─── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Zap className="w-4 h-4 text-warning" /> Live Feed
          </h2>
          <span className="flex items-center gap-1 text-[10px] font-bold text-success uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" /> Updating
          </span>
        </div>

        <div className="bg-bg-card border border-border rounded-xl overflow-hidden divide-y divide-border/50">
          {events.map((evt, i) => {
            const { emoji, color } = EVENT_ICONS[evt.icon]
            return (
              <div
                key={evt.id}
                className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.01] transition-colors"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="text-base mt-0.5 flex-shrink-0">{emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-secondary">
                    <span className="font-semibold text-text-primary">{evt.player}</span>
                    <span className="text-text-tertiary"> · {evt.team} · </span>
                    {evt.action}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-sm font-bold ${color}`}>+{evt.points}</span>
                  <span className="text-[10px] text-text-tertiary">{evt.time}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
