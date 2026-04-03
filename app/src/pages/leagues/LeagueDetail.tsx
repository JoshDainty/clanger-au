import { useState, type Dispatch, type SetStateAction } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Crown, Users, Trophy, Copy, Check, Calendar, Settings, MessageSquare, Zap, UserRoundCog, ArrowLeftRight, ChevronRight, TrendingUp, TrendingDown, Minus, X, Handshake, Send, Search, Plus, Clock } from 'lucide-react'
import { getMockMessages, useRealtimeMessages } from '@/lib/messages'
import ChatPanel from '@/components/ChatPanel'
import { useToast } from '@/components/Toast'

const TABS = ['My Team', 'Standings', 'Schedule', 'Players', 'Chat', 'Settings'] as const
type Tab = typeof TABS[number]

/* ── Sample Data ── */

const LINEUP_SLOTS = ['PG', 'SG', 'SF', 'PF', 'C', 'UTIL'] as const
type LineupSlot = typeof LINEUP_SLOTS[number]

// UTIL accepts any position; all other slots require an exact position match
function canFillSlot(slot: LineupSlot, playerPosition: string): boolean {
  return slot === 'UTIL' || playerPosition === slot
}

interface RosterPlayer {
  id: string
  name: string
  position: string   // natural position: PG / SG / SF / PF / C
  team: string
  teamColor: string
  fantasyPts: number
  avgPts: number
  status: 'active' | 'injured' | 'questionable' | 'out'
  slot: LineupSlot | null  // which starting slot they occupy; null = bench
  trend: 'up' | 'down' | 'neutral'
}

const rosterPlayers: RosterPlayer[] = [
  { id: 'p1', name: 'Luka Dončić',          position: 'PG', team: 'DAL', teamColor: '#00538C', fantasyPts: 58.4, avgPts: 51.2, status: 'active',      slot: 'PG',   trend: 'up' },
  { id: 'p2', name: 'Anthony Edwards',       position: 'SG', team: 'MIN', teamColor: '#236192', fantasyPts: 42.8, avgPts: 38.5, status: 'active',      slot: 'SG',   trend: 'up' },
  { id: 'p3', name: 'Jayson Tatum',          position: 'SF', team: 'BOS', teamColor: '#007A33', fantasyPts: 35.1, avgPts: 37.8, status: 'active',      slot: 'SF',   trend: 'neutral' },
  { id: 'p4', name: 'Giannis Antetokounmpo', position: 'PF', team: 'MIL', teamColor: '#00471B', fantasyPts: 47.2, avgPts: 49.1, status: 'active',      slot: 'PF',   trend: 'down' },
  { id: 'p5', name: 'Victor Wembanyama',     position: 'C',  team: 'SAS', teamColor: '#C4CED4', fantasyPts: 41.6, avgPts: 39.8, status: 'active',      slot: 'C',    trend: 'up' },
  { id: 'p6', name: "De'Aaron Fox",          position: 'PG', team: 'SAC', teamColor: '#5A2D81', fantasyPts: 33.4, avgPts: 31.2, status: 'active',      slot: 'UTIL', trend: 'up' },
  { id: 'p7', name: 'Trae Young',            position: 'PG', team: 'ATL', teamColor: '#E03A3E', fantasyPts: 28.9, avgPts: 30.1, status: 'questionable', slot: null,   trend: 'down' },
  { id: 'p8', name: 'Bam Adebayo',           position: 'C',  team: 'MIA', teamColor: '#98002E', fantasyPts: 26.4, avgPts: 28.3, status: 'active',       slot: null,   trend: 'neutral' },
]

interface Member {
  rank: number
  name: string
  initials: string
  color: string
  wins: number
  losses: number
  totalPts: number
  isCommissioner: boolean
  isYou: boolean
  streak: string
}

const members: Member[] = [
  { rank: 1, name: 'JoshDainty',      initials: 'JD', color: '#3B82F6', wins: 8, losses: 2, totalPts: 1452.3, isCommissioner: true,  isYou: true,  streak: 'W4' },
  { rank: 2, name: 'SlamDunkSid',     initials: 'SS', color: '#10B981', wins: 7, losses: 3, totalPts: 1388.1, isCommissioner: false, isYou: false, streak: 'W2' },
  { rank: 3, name: 'HoopsDreamer',    initials: 'HD', color: '#F59E0B', wins: 7, losses: 3, totalPts: 1365.8, isCommissioner: false, isYou: false, streak: 'L1' },
  { rank: 4, name: 'MattKellyFF',     initials: 'MK', color: '#EF4444', wins: 6, losses: 4, totalPts: 1312.4, isCommissioner: false, isYou: false, streak: 'W1' },
  { rank: 5, name: 'CourtVision',     initials: 'CV', color: '#8B5CF6', wins: 5, losses: 5, totalPts: 1278.6, isCommissioner: false, isYou: false, streak: 'L2' },
  { rank: 6, name: 'BallerBrisbane',  initials: 'BB', color: '#EC4899', wins: 4, losses: 6, totalPts: 1201.2, isCommissioner: false, isYou: false, streak: 'L1' },
  { rank: 7, name: 'RimProtector',    initials: 'RP', color: '#14B8A6', wins: 3, losses: 7, totalPts: 1145.8, isCommissioner: false, isYou: false, streak: 'L3' },
  { rank: 8, name: 'DraftKingAU',     initials: 'DK', color: '#F97316', wins: 2, losses: 8, totalPts: 1098.5, isCommissioner: false, isYou: false, streak: 'W1' },
]

interface MatchupPlayer { name: string; position: string; team: string; pts: number; projected?: number }
interface MatchupData {
  week: number
  opponent: string
  oppInitials: string
  oppColor: string
  myScore: number
  oppScore: number
  status: 'completed' | 'live' | 'upcoming'
  myLineup: MatchupPlayer[]
  oppLineup: MatchupPlayer[]
}

const MATCHUP_DATA: MatchupData[] = [
  {
    week: 8, opponent: 'SlamDunkSid', oppInitials: 'SS', oppColor: '#10B981',
    myScore: 145.2, oppScore: 132.7, status: 'completed',
    myLineup: [
      { name: 'Luka Dončić',    position: 'PG',   team: 'DAL', pts: 54.2 },
      { name: 'A. Edwards',     position: 'SG',   team: 'MIN', pts: 38.4 },
      { name: 'Jayson Tatum',   position: 'SF',   team: 'BOS', pts: 12.6 },
      { name: 'Giannis A.',     position: 'PF',   team: 'MIL', pts: 22.1 },
      { name: 'V. Wembanyama',  position: 'C',    team: 'SAS', pts: 8.9  },
      { name: "De'Aaron Fox",   position: 'UTIL', team: 'SAC', pts: 9.0  },
    ],
    oppLineup: [
      { name: 'Steph Curry',    position: 'PG',   team: 'GSW', pts: 48.1 },
      { name: 'Klay Thompson',  position: 'SG',   team: 'DAL', pts: 18.3 },
      { name: 'LeBron James',   position: 'SF',   team: 'LAL', pts: 31.4 },
      { name: 'A. Davis',       position: 'PF',   team: 'LAL', pts: 17.2 },
      { name: 'Nikola Jokić',   position: 'C',    team: 'DEN', pts: 12.9 },
      { name: 'J. Brunson',     position: 'UTIL', team: 'NYK', pts: 4.8  },
    ],
  },
  {
    week: 9, opponent: 'CourtVision', oppInitials: 'CV', oppColor: '#8B5CF6',
    myScore: 158.4, oppScore: 141.2, status: 'completed',
    myLineup: [
      { name: 'Luka Dončić',    position: 'PG',   team: 'DAL', pts: 61.8 },
      { name: 'A. Edwards',     position: 'SG',   team: 'MIN', pts: 44.2 },
      { name: 'Jayson Tatum',   position: 'SF',   team: 'BOS', pts: 18.3 },
      { name: 'Giannis A.',     position: 'PF',   team: 'MIL', pts: 14.9 },
      { name: 'V. Wembanyama',  position: 'C',    team: 'SAS', pts: 9.1  },
      { name: "De'Aaron Fox",   position: 'UTIL', team: 'SAC', pts: 10.1 },
    ],
    oppLineup: [
      { name: 'D. Lillard',     position: 'PG',   team: 'MIL', pts: 38.4 },
      { name: 'D. Mitchell',    position: 'SG',   team: 'CLE', pts: 32.1 },
      { name: 'K. Durant',      position: 'SF',   team: 'PHX', pts: 28.8 },
      { name: 'P. George',      position: 'PF',   team: 'PHI', pts: 19.4 },
      { name: 'J. Embiid',      position: 'C',    team: 'PHI', pts: 16.2 },
      { name: 'T. Haliburton',  position: 'UTIL', team: 'IND', pts: 6.3  },
    ],
  },
  {
    week: 10, opponent: 'MattKellyFF', oppInitials: 'MK', oppColor: '#EF4444',
    myScore: 258.5, oppScore: 122.4, status: 'live',
    myLineup: [
      { name: 'Luka Dončić',    position: 'PG',   team: 'DAL', pts: 58.4 },
      { name: 'A. Edwards',     position: 'SG',   team: 'MIN', pts: 42.8 },
      { name: 'Jayson Tatum',   position: 'SF',   team: 'BOS', pts: 35.1 },
      { name: 'Giannis A.',     position: 'PF',   team: 'MIL', pts: 47.2 },
      { name: 'V. Wembanyama',  position: 'C',    team: 'SAS', pts: 41.6 },
      { name: "De'Aaron Fox",   position: 'UTIL', team: 'SAC', pts: 33.4 },
    ],
    oppLineup: [
      { name: 'Trae Young',     position: 'PG',   team: 'ATL', pts: 28.9 },
      { name: 'D. Booker',      position: 'SG',   team: 'PHX', pts: 24.1 },
      { name: 'J. Ingram',      position: 'SF',   team: 'NOP', pts: 22.6 },
      { name: 'Z. LaVine',      position: 'PF',   team: 'CHI', pts: 19.4 },
      { name: 'Bam Adebayo',    position: 'C',    team: 'MIA', pts: 16.2 },
      { name: 'T. Maxey',       position: 'UTIL', team: 'PHI', pts: 11.2 },
    ],
  },
  {
    week: 11, opponent: 'BallerBrisbane', oppInitials: 'BB', oppColor: '#EC4899',
    myScore: 0, oppScore: 0, status: 'upcoming',
    myLineup: [
      { name: 'Luka Dončić',    position: 'PG',   team: 'DAL', pts: 0, projected: 52.1 },
      { name: 'A. Edwards',     position: 'SG',   team: 'MIN', pts: 0, projected: 39.2 },
      { name: 'Jayson Tatum',   position: 'SF',   team: 'BOS', pts: 0, projected: 38.4 },
      { name: 'Giannis A.',     position: 'PF',   team: 'MIL', pts: 0, projected: 48.8 },
      { name: 'V. Wembanyama',  position: 'C',    team: 'SAS', pts: 0, projected: 40.1 },
      { name: "De'Aaron Fox",   position: 'UTIL', team: 'SAC', pts: 0, projected: 32.0 },
    ],
    oppLineup: [
      { name: 'J. Brunson',     position: 'PG',   team: 'NYK', pts: 0, projected: 34.2 },
      { name: 'B. Beal',        position: 'SG',   team: 'PHX', pts: 0, projected: 28.1 },
      { name: 'K. Durant',      position: 'SF',   team: 'PHX', pts: 0, projected: 41.3 },
      { name: 'P. Siakam',      position: 'PF',   team: 'IND', pts: 0, projected: 29.8 },
      { name: 'R. Gobert',      position: 'C',    team: 'MIN', pts: 0, projected: 22.4 },
      { name: 'C. McCollum',    position: 'UTIL', team: 'NOP', pts: 0, projected: 24.1 },
    ],
  },
  {
    week: 12, opponent: 'RimProtector', oppInitials: 'RP', oppColor: '#14B8A6',
    myScore: 0, oppScore: 0, status: 'upcoming',
    myLineup: [
      { name: 'Luka Dončić',    position: 'PG',   team: 'DAL', pts: 0, projected: 50.8 },
      { name: 'A. Edwards',     position: 'SG',   team: 'MIN', pts: 0, projected: 38.5 },
      { name: 'Jayson Tatum',   position: 'SF',   team: 'BOS', pts: 0, projected: 37.8 },
      { name: 'Giannis A.',     position: 'PF',   team: 'MIL', pts: 0, projected: 49.1 },
      { name: 'V. Wembanyama',  position: 'C',    team: 'SAS', pts: 0, projected: 39.8 },
      { name: "De'Aaron Fox",   position: 'UTIL', team: 'SAC', pts: 0, projected: 31.2 },
    ],
    oppLineup: [
      { name: 'Steph Curry',    position: 'PG',   team: 'GSW', pts: 0, projected: 44.1 },
      { name: 'A. Wiggins',     position: 'SG',   team: 'GSW', pts: 0, projected: 22.4 },
      { name: 'D. Green',       position: 'SF',   team: 'GSW', pts: 0, projected: 18.8 },
      { name: 'J. Poole',       position: 'PF',   team: 'WAS', pts: 0, projected: 26.2 },
      { name: 'K. Looney',      position: 'C',    team: 'GSW', pts: 0, projected: 14.3 },
      { name: 'G. Payton II',   position: 'UTIL', team: 'POR', pts: 0, projected: 19.7 },
    ],
  },
]

/* ── Matchup Detail Modal ── */
function MatchupModal({ matchup, onClose }: { matchup: MatchupData; onClose: () => void }) {
  const isUpcoming = matchup.status === 'upcoming'
  const isLive = matchup.status === 'live'
  const myWon = matchup.myScore > matchup.oppScore

  const myTotal = isUpcoming
    ? matchup.myLineup.reduce((s, p) => s + (p.projected ?? 0), 0)
    : matchup.myScore
  const oppTotal = isUpcoming
    ? matchup.oppLineup.reduce((s, p) => s + (p.projected ?? 0), 0)
    : matchup.oppScore

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/65 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-bg-card border border-border rounded-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-bold text-text-tertiary">Week {matchup.week}</span>
              {isLive && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-success px-1.5 py-0.5 rounded-full bg-success/10">
                  <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" /> LIVE
                </span>
              )}
              {!isLive && !isUpcoming && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${myWon ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                  {myWon ? 'WIN' : 'LOSS'}
                </span>
              )}
              {isUpcoming && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-accent/10 text-accent-light">UPCOMING</span>
              )}
            </div>
            <h2 className="text-base font-bold text-text-primary">vs {matchup.opponent}</h2>
          </div>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score summary */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div className="text-center flex-1">
            <p className="text-[11px] text-accent-light font-bold uppercase tracking-wider mb-1">You</p>
            <p className={`text-3xl font-black tabular-nums ${!isUpcoming && myWon ? 'text-success' : !isUpcoming ? 'text-danger' : 'text-text-primary'}`}>
              {isUpcoming ? myTotal.toFixed(1) : myTotal.toFixed(1)}
            </p>
            {isUpcoming && <p className="text-[10px] text-text-tertiary mt-0.5">Projected</p>}
          </div>
          <div className="text-text-tertiary font-bold text-sm px-4">vs</div>
          <div className="text-center flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: matchup.oppColor }}>{matchup.opponent}</p>
            <p className={`text-3xl font-black tabular-nums ${!isUpcoming && !myWon ? 'text-success' : !isUpcoming ? 'text-danger' : 'text-text-primary'}`}>
              {oppTotal.toFixed(1)}
            </p>
            {isUpcoming && <p className="text-[10px] text-text-tertiary mt-0.5">Projected</p>}
          </div>
        </div>

        {/* Lineups */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 divide-x divide-border">

            {/* My lineup */}
            <div>
              <div className="px-3 py-2 border-b border-border bg-bg-secondary/50">
                <p className="text-[10px] font-bold text-accent-light uppercase tracking-wider">Your Lineup</p>
              </div>
              {matchup.myLineup.map((p, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2.5 border-b border-border/40 last:border-0">
                  <span className="text-[9px] font-bold text-text-tertiary w-7 flex-shrink-0">{p.position}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-primary truncate">{p.name}</p>
                    <p className="text-[10px] text-text-tertiary">{p.team}</p>
                  </div>
                  <span className={`text-xs font-bold tabular-nums flex-shrink-0 ${isUpcoming ? 'text-text-secondary' : 'text-text-primary'}`}>
                    {isUpcoming ? (p.projected?.toFixed(1) ?? '—') : p.pts.toFixed(1)}
                  </span>
                </div>
              ))}
              <div className="px-3 py-2 border-t border-border bg-bg-secondary/30 flex items-center justify-between">
                <span className="text-[10px] text-text-tertiary font-medium">{isUpcoming ? 'Proj.' : 'Total'}</span>
                <span className="text-sm font-black text-text-primary tabular-nums">{myTotal.toFixed(1)}</span>
              </div>
            </div>

            {/* Opponent lineup */}
            <div>
              <div className="px-3 py-2 border-b border-border bg-bg-secondary/50">
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: matchup.oppColor }}>{matchup.opponent}</p>
              </div>
              {matchup.oppLineup.map((p, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2.5 border-b border-border/40 last:border-0">
                  <span className="text-[9px] font-bold text-text-tertiary w-7 flex-shrink-0">{p.position}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-primary truncate">{p.name}</p>
                    <p className="text-[10px] text-text-tertiary">{p.team}</p>
                  </div>
                  <span className={`text-xs font-bold tabular-nums flex-shrink-0 ${isUpcoming ? 'text-text-secondary' : 'text-text-primary'}`}>
                    {isUpcoming ? (p.projected?.toFixed(1) ?? '—') : p.pts.toFixed(1)}
                  </span>
                </div>
              ))}
              <div className="px-3 py-2 border-t border-border bg-bg-secondary/30 flex items-center justify-between">
                <span className="text-[10px] text-text-tertiary font-medium">{isUpcoming ? 'Proj.' : 'Total'}</span>
                <span className="text-sm font-black text-text-primary tabular-nums">{oppTotal.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live matchup link */}
        {isLive && (
          <div className="px-5 py-4 border-t border-border flex-shrink-0">
            <Link
              to="/contests/2/matchup"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full h-11 bg-success/10 border border-success/25 text-success text-sm font-bold rounded-xl hover:bg-success/15 transition-colors"
            >
              <Zap className="w-4 h-4" /> View Live Court
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Trade Modal ── */
const TRADE_PARTNERS = members.filter(m => !m.isYou)

const PARTNER_ROSTERS: Record<string, { name: string; position: string; team: string; avgPts: number }[]> = {
  'SlamDunkSid':    [{ name: 'Steph Curry', position: 'PG', team: 'GSW', avgPts: 46.1 }, { name: 'LeBron James', position: 'SF', team: 'LAL', avgPts: 38.4 }, { name: 'Nikola Jokić', position: 'C', team: 'DEN', avgPts: 52.3 }, { name: 'A. Davis', position: 'PF', team: 'LAL', avgPts: 34.2 }, { name: 'Klay Thompson', position: 'SG', team: 'DAL', avgPts: 21.4 }],
  'HoopsDreamer':   [{ name: 'D. Lillard', position: 'PG', team: 'MIL', avgPts: 38.4 }, { name: 'D. Mitchell', position: 'SG', team: 'CLE', avgPts: 32.1 }, { name: 'K. Durant', position: 'SF', team: 'PHX', avgPts: 41.2 }, { name: 'J. Embiid', position: 'C', team: 'PHI', avgPts: 44.8 }, { name: 'P. George', position: 'PF', team: 'PHI', avgPts: 28.3 }],
  'MattKellyFF':    [{ name: 'Trae Young', position: 'PG', team: 'ATL', avgPts: 30.1 }, { name: 'D. Booker', position: 'SG', team: 'PHX', avgPts: 29.8 }, { name: 'Z. LaVine', position: 'PF', team: 'CHI', avgPts: 26.4 }, { name: 'Bam Adebayo', position: 'C', team: 'MIA', avgPts: 28.3 }, { name: 'T. Maxey', position: 'UTIL', team: 'PHI', avgPts: 24.1 }],
  'CourtVision':    [{ name: 'J. Brunson', position: 'PG', team: 'NYK', avgPts: 34.2 }, { name: 'B. Beal', position: 'SG', team: 'PHX', avgPts: 22.1 }, { name: 'P. Siakam', position: 'PF', team: 'IND', avgPts: 29.8 }, { name: 'R. Gobert', position: 'C', team: 'MIN', avgPts: 18.4 }, { name: 'C. McCollum', position: 'SF', team: 'NOP', avgPts: 24.1 }],
  'BallerBrisbane': [{ name: 'T. Haliburton', position: 'PG', team: 'IND', avgPts: 31.2 }, { name: 'D. Sabonis', position: 'C', team: 'SAC', avgPts: 38.1 }, { name: 'M. Bridges', position: 'SF', team: 'NYK', avgPts: 24.8 }, { name: 'J. Hart', position: 'PF', team: 'NYK', avgPts: 19.2 }, { name: 'I. Quickley', position: 'SG', team: 'TOR', avgPts: 22.4 }],
  'RimProtector':   [{ name: 'C. Paul', position: 'PG', team: 'GSW', avgPts: 18.4 }, { name: 'O. Porter Jr.', position: 'SF', team: 'MIA', avgPts: 16.2 }, { name: 'W. Carter Jr.', position: 'PF', team: 'HOU', avgPts: 14.8 }, { name: 'N. Claxton', position: 'C', team: 'BKN', avgPts: 21.3 }, { name: 'C. Cunningham', position: 'SG', team: 'DET', avgPts: 28.4 }],
  'DraftKingAU':    [{ name: 'S. Gilgeous-Alexander', position: 'PG', team: 'OKC', avgPts: 44.2 }, { name: 'L. Doncic', position: 'SF', team: 'DAL', avgPts: 51.2 }, { name: 'J. Williams', position: 'PF', team: 'OKC', avgPts: 22.1 }, { name: 'C. Holmgren', position: 'C', team: 'OKC', avgPts: 28.8 }, { name: 'L. Dort', position: 'SG', team: 'OKC', avgPts: 18.4 }],
}

interface TradeOffer {
  id: string
  partner: typeof TRADE_PARTNERS[0]
  myOffering: string[]
  theyOffering: string[]
  sentAt: string
}

function TradeModal({ onClose, onSend, editOffer }: {
  onClose: () => void
  onSend: (offer: Omit<TradeOffer, 'id' | 'sentAt'>) => void
  editOffer?: TradeOffer
}) {
  const { toast } = useToast()
  const [step, setStep] = useState<'partner' | 'build'>(editOffer ? 'build' : 'partner')
  const [partner, setPartner] = useState<typeof TRADE_PARTNERS[0] | null>(editOffer?.partner ?? null)
  const [myOffering, setMyOffering] = useState<string[]>(editOffer?.myOffering ?? [])
  const [theyOffering, setTheyOffering] = useState<string[]>(editOffer?.theyOffering ?? [])

  const partnerRoster = partner ? (PARTNER_ROSTERS[partner.name] ?? []) : []

  const toggleMine = (name: string) =>
    setMyOffering(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])

  const toggleTheirs = (name: string) =>
    setTheyOffering(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])

  const handleSend = () => {
    onSend({ partner: partner!, myOffering, theyOffering })
    toast('success', `Trade offer ${editOffer ? 'updated and re-sent' : 'sent'} to ${partner!.name}!`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/65 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-bg-card border border-border rounded-2xl overflow-hidden max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            {step === 'build' && (
              <button onClick={() => { setStep('partner'); setPartner(null); setMyOffering([]); setTheyOffering([]) }} className="text-text-tertiary hover:text-text-secondary mr-1">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="text-base font-bold text-text-primary">
              {step === 'partner' ? 'Propose a Trade' : `Trade with ${partner?.name}`}
            </h2>
          </div>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-primary"><X className="w-5 h-5" /></button>
        </div>

        {/* Step 1 — pick partner */}
        {step === 'partner' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <p className="text-xs text-text-tertiary mb-3">Select a team to trade with.</p>
            {TRADE_PARTNERS.map(m => (
              <button
                key={m.name}
                onClick={() => { setPartner(m); setStep('build') }}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-accent/25 hover:bg-white/[0.02] transition-colors text-left group"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0"
                  style={{ backgroundColor: m.color + '20', borderColor: m.color + '40', color: m.color }}>
                  {m.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary">{m.name}</p>
                  <p className="text-xs text-text-tertiary">{m.wins}-{m.losses} · #{m.rank}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-text-secondary transition-colors" />
              </button>
            ))}
          </div>
        )}

        {/* Step 2 — build offer */}
        {step === 'build' && partner && (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 divide-x divide-border">

                {/* My players */}
                <div>
                  <div className="px-3 py-2.5 border-b border-border bg-bg-secondary/50">
                    <p className="text-[10px] font-bold text-accent-light uppercase tracking-wider">You offer</p>
                    <p className="text-[10px] text-text-tertiary">{myOffering.length} selected</p>
                  </div>
                  {rosterPlayers.map(p => {
                    const sel = myOffering.includes(p.name)
                    return (
                      <button
                        key={p.id}
                        onClick={() => toggleMine(p.name)}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 border-b border-border/40 last:border-0 text-left transition-colors ${sel ? 'bg-accent/8' : 'hover:bg-white/[0.02]'}`}
                      >
                        <div className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors ${sel ? 'bg-accent border-accent' : 'border-border'}`}>
                          {sel && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-text-primary truncate">{p.name}</p>
                          <p className="text-[10px] text-text-tertiary">{p.position} · AVG {p.avgPts}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Their players */}
                <div>
                  <div className="px-3 py-2.5 border-b border-border bg-bg-secondary/50">
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: partner.color }}>They offer</p>
                    <p className="text-[10px] text-text-tertiary">{theyOffering.length} selected</p>
                  </div>
                  {partnerRoster.map((p, i) => {
                    const sel = theyOffering.includes(p.name)
                    return (
                      <button
                        key={i}
                        onClick={() => toggleTheirs(p.name)}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 border-b border-border/40 last:border-0 text-left transition-colors ${sel ? 'bg-warning/5' : 'hover:bg-white/[0.02]'}`}
                      >
                        <div className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors ${sel ? 'bg-warning border-warning' : 'border-border'}`}>
                          {sel && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-text-primary truncate">{p.name}</p>
                          <p className="text-[10px] text-text-tertiary">{p.position} · AVG {p.avgPts}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Send button */}
            <div className="px-5 py-4 border-t border-border flex-shrink-0">
              {(myOffering.length > 0 || theyOffering.length > 0) && (
                <p className="text-xs text-text-tertiary text-center mb-3">
                  {myOffering.length > 0 ? myOffering.join(', ') : 'nothing'} → {theyOffering.length > 0 ? theyOffering.join(', ') : 'nothing'}
                </p>
              )}
              <button
                onClick={handleSend}
                disabled={myOffering.length === 0 && theyOffering.length === 0}
                className="w-full h-11 bg-accent hover:bg-accent-dark disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Trade Offer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const MAX_ROSTER_SIZE = 10

/* ── My Team Tab ── */
function MyTeamTab({ isDraftLeague, roster, setRoster }: {
  isDraftLeague: boolean
  roster: RosterPlayer[]
  setRoster: Dispatch<SetStateAction<RosterPlayer[]>>
}) {
  const { toast } = useToast()
  const [swapping, setSwapping] = useState<string | null>(null)
  const [showTrade, setShowTrade] = useState(false)
  const [editingOffer, setEditingOffer] = useState<TradeOffer | undefined>(undefined)
  const [pendingOffers, setPendingOffers] = useState<TradeOffer[]>([])

  const handleSendOffer = (offer: Omit<TradeOffer, 'id' | 'sentAt'>) => {
    if (editingOffer) {
      // Replace existing offer
      setPendingOffers(prev => prev.map(o =>
        o.id === editingOffer.id
          ? { ...offer, id: editingOffer.id, sentAt: 'Just now' }
          : o
      ))
      setEditingOffer(undefined)
    } else {
      setPendingOffers(prev => [...prev, {
        ...offer,
        id: crypto.randomUUID(),
        sentAt: 'Just now',
      }])
    }
  }

  const cancelOffer = (id: string) => {
    setPendingOffers(prev => prev.filter(o => o.id !== id))
    toast('info', 'Trade offer withdrawn.')
  }

  const editOffer = (offer: TradeOffer) => {
    setEditingOffer(offer)
    setShowTrade(true)
  }

  // Slot entries: each of the 6 slots with its occupant (or null)
  const slotEntries = LINEUP_SLOTS.map(slot => ({
    slot,
    player: roster.find(p => p.slot === slot) ?? null,
  }))
  const bench = roster.filter(p => p.slot === null)
  const totalPts = roster.filter(p => p.slot !== null).reduce((sum, p) => sum + p.fantasyPts, 0)

  // The bench-selected player and the slots they're eligible to fill
  const swappingPlayer = swapping ? roster.find(p => p.id === swapping) ?? null : null
  const eligibleSlots = swappingPlayer
    ? LINEUP_SLOTS.filter(s => canFillSlot(s, swappingPlayer.position))
    : []

  const handleAction = (id: string) => {
    const player = roster.find(p => p.id === id)!

    // Tapping a starter → always bench them immediately (one tap, no partner needed)
    if (player.slot !== null && !swapping) {
      setRoster(prev => prev.map(p => p.id === id ? { ...p, slot: null } : p))
      toast('info', `${player.name} moved to bench.`)
      return
    }

    // Tapping the already-selected bench player → cancel
    if (swapping === id) { setSwapping(null); return }

    // A bench player is selected and we tapped a starter → replace that starter
    if (swapping && player.slot !== null) {
      const pA = roster.find(p => p.id === swapping)!
      const targetSlot = player.slot as LineupSlot
      if (!canFillSlot(targetSlot, pA.position)) {
        toast('error', `${pA.name} can't play the ${targetSlot} slot.`)
        setSwapping(null)
        return
      }
      setRoster(prev => prev.map(p =>
        p.id === pA.id ? { ...p, slot: targetSlot } :
        p.id === id    ? { ...p, slot: null } : p
      ))
      setSwapping(null)
      toast('success', 'Lineup updated!')
      return
    }

    // Tapping a bench player with nothing selected → select them
    setSwapping(id)
  }

  const handleSlotClick = (slot: LineupSlot) => {
    if (!swapping) return
    const player = roster.find(p => p.id === swapping)!
    if (!canFillSlot(slot, player.position)) {
      toast('error', `${player.name} can't play the ${slot} slot.`)
      setSwapping(null)
      return
    }
    setRoster(prev => prev.map(p => p.id === swapping ? { ...p, slot } : p))
    setSwapping(null)
    toast('success', 'Lineup updated!')
  }

  const statusBadge = (s: RosterPlayer['status']) => {
    if (s === 'active') return null
    const cfg = { injured: 'bg-danger/15 text-danger', questionable: 'bg-warning/15 text-warning', out: 'bg-danger/15 text-danger' }
    return <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${cfg[s]}`}>{s === 'questionable' ? 'Q' : s === 'injured' ? 'INJ' : 'OUT'}</span>
  }

  const TrendIcon = ({ trend }: { trend: RosterPlayer['trend'] }) => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-success" />
    if (trend === 'down') return <TrendingDown className="w-3 h-3 text-danger" />
    return <Minus className="w-3 h-3 text-text-tertiary" />
  }

  const PlayerRow = ({ p, slotLabel }: { p: RosterPlayer; slotLabel?: string }) => {
    const isSelected = swapping === p.id
    const inStartingSlot = p.slot !== null
    // A bench player is selected and this starter can be replaced by them
    const isEligibleTarget = swapping !== null && !isSelected && inStartingSlot &&
      canFillSlot(p.slot as LineupSlot, swappingPlayer!.position)
    return (
      <div className={`flex items-center gap-3 px-4 py-3 border-b border-border/50 last:border-0 transition-colors
        ${isSelected ? 'bg-accent/8 border-l-2 border-l-accent' : ''}
        ${isEligibleTarget ? 'bg-success/5 hover:bg-success/8' : !isSelected ? 'hover:bg-white/[0.01]' : ''}
        ${p.status === 'out' ? 'opacity-50' : ''}`}>
        <span className={`text-[10px] font-bold w-9 text-center px-1 py-1 rounded flex-shrink-0 ${
          inStartingSlot ? 'bg-accent/10 text-accent-light' : 'bg-bg-secondary text-text-tertiary'
        }`}>{slotLabel ?? p.position}</span>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 border-2"
          style={{ backgroundColor: p.teamColor + '25', borderColor: p.teamColor + '50', color: p.teamColor }}
        >
          {p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-text-primary truncate">{p.name}</span>
            {statusBadge(p.status)}
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-text-tertiary">
            <span>{p.team}</span>
            <span>·</span>
            <span>{p.position}</span>
            <span>·</span>
            <span>AVG {p.avgPts}</span>
            <TrendIcon trend={p.trend} />
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className={`text-sm font-bold tabular-nums ${inStartingSlot ? 'text-text-primary' : 'text-text-tertiary'}`}>{p.fantasyPts}</div>
          <div className="text-[10px] text-text-tertiary">FPTS</div>
        </div>
        <button
          onClick={() => handleAction(p.id)}
          className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors flex-shrink-0 ${
            isSelected
              ? 'bg-accent text-white border-accent'
              : isEligibleTarget
              ? 'bg-success/15 text-success border-success/30 hover:bg-success/25'
              : 'bg-bg-secondary border-border text-text-tertiary hover:text-text-primary hover:border-accent/30'
          }`}
          title={isSelected ? 'Cancel' : inStartingSlot ? 'Move to bench' : 'Select to move'}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  const EmptySlotRow = ({ slot }: { slot: LineupSlot }) => {
    const isEligible = swapping !== null && eligibleSlots.includes(slot)
    return (
      <button
        onClick={() => isEligible ? handleSlotClick(slot) : undefined}
        className={`w-full flex items-center gap-3 px-4 py-3 border-b border-border/50 last:border-0 transition-colors text-left ${
          isEligible ? 'bg-accent/5 hover:bg-accent/10 cursor-pointer' : 'opacity-35 cursor-default'
        }`}
      >
        <span className="text-[10px] font-bold w-9 text-center px-1 py-1 rounded flex-shrink-0 bg-bg-secondary text-text-tertiary border border-dashed border-border">{slot}</span>
        <div className="w-8 h-8 rounded-full border-2 border-dashed border-border flex-shrink-0 flex items-center justify-center">
          {isEligible && <Plus className="w-3 h-3 text-accent-light" />}
        </div>
        <span className={`text-sm flex-1 ${isEligible ? 'text-accent-light font-medium' : 'text-text-tertiary italic'}`}>
          {isEligible ? `Place ${swappingPlayer?.name} here` : 'Empty'}
        </span>
      </button>
    )
  }

  return (
    <div className="space-y-4">
      {/* Score summary + trade button */}
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="text-xs text-text-tertiary">Week 10 Total</p>
          <p className="text-2xl font-black text-text-primary tabular-nums">{totalPts.toFixed(1)} <span className="text-sm font-medium text-success">pts</span></p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-text-tertiary">vs MattKellyFF</p>
            <p className="text-lg font-bold text-danger tabular-nums">122.4</p>
          </div>
          {isDraftLeague && (
            <button
              onClick={() => setShowTrade(true)}
              className="flex items-center gap-2 h-10 px-4 bg-warning/10 border border-warning/25 text-warning text-sm font-bold rounded-xl hover:bg-warning/15 transition-colors"
            >
              <Handshake className="w-4 h-4" /> Trade
            </button>
          )}
        </div>
      </div>

      {showTrade && (
        <TradeModal
          onClose={() => { setShowTrade(false); setEditingOffer(undefined) }}
          onSend={handleSendOffer}
          editOffer={editingOffer}
        />
      )}

      {/* Pending trade offers */}
      {isDraftLeague && pendingOffers.length > 0 && (
        <div className="bg-bg-card border border-warning/20 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-warning/15 bg-warning/5">
            <Handshake className="w-3.5 h-3.5 text-warning" />
            <span className="text-xs font-bold text-warning uppercase tracking-wider">Pending Trade Offers</span>
            <span className="ml-auto text-xs text-text-tertiary">{pendingOffers.length} sent</span>
          </div>
          {pendingOffers.map(offer => (
            <div key={offer.id} className="px-4 py-3.5 border-b border-border/40 last:border-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 flex-shrink-0"
                    style={{ backgroundColor: offer.partner.color + '20', borderColor: offer.partner.color + '40', color: offer.partner.color }}>
                    {offer.partner.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary">To {offer.partner.name}</p>
                    <p className="text-[11px] text-text-tertiary mt-0.5">Sent {offer.sentAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => editOffer(offer)}
                    className="h-7 px-3 text-xs font-medium text-accent-light bg-accent/10 border border-accent/20 rounded-lg hover:bg-accent/15 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => cancelOffer(offer.id)}
                    className="h-7 px-3 text-xs font-medium text-danger bg-danger/10 border border-danger/20 rounded-lg hover:bg-danger/15 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div className="mt-2.5 flex items-center gap-2 text-xs flex-wrap">
                <span className="text-text-tertiary">You give:</span>
                {offer.myOffering.length > 0
                  ? offer.myOffering.map(n => <span key={n} className="px-2 py-0.5 rounded-full bg-accent/10 text-accent-light font-medium">{n}</span>)
                  : <span className="text-text-tertiary italic">nothing</span>}
                <span className="text-text-tertiary mx-1">→</span>
                <span className="text-text-tertiary">You get:</span>
                {offer.theyOffering.length > 0
                  ? offer.theyOffering.map(n => <span key={n} className="px-2 py-0.5 rounded-full bg-warning/10 text-warning font-medium">{n}</span>)
                  : <span className="text-text-tertiary italic">nothing</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Starters — always 6 fixed slots */}
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-bg-secondary/50">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Starting Lineup</span>
          <span className="text-xs text-text-tertiary">{slotEntries.filter(s => s.player).length}/6 filled</span>
        </div>
        {slotEntries.map(({ slot, player }) =>
          player
            ? <PlayerRow key={slot} p={player} slotLabel={slot} />
            : <EmptySlotRow key={slot} slot={slot} />
        )}
      </div>

      {/* Bench */}
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-bg-secondary/50">
          <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Bench</span>
          <span className="text-xs text-text-tertiary">{bench.length} players</span>
        </div>
        {bench.length === 0
          ? <p className="text-sm text-text-tertiary text-center py-6 italic">No bench players</p>
          : bench.map(p => <PlayerRow key={p.id} p={p} />)
        }
      </div>

      <p className="text-xs text-text-tertiary text-center">Tap <ArrowLeftRight className="w-3 h-3 inline" /> on a starter to bench them. Tap a bench player to select, then tap a slot to move them.</p>
    </div>
  )
}

/* ── Player Pool Data ── */
interface AvailablePlayer {
  id: string
  name: string
  position: string
  team: string
  teamColor: string
  avgPts: number
  lastWeekPts: number
  ownership: number
  status: 'free_agent' | 'waiver'
  waiverEnds?: string
  trend: 'up' | 'down' | 'neutral'
  ownedBy?: string
}

const PLAYER_POOL: AvailablePlayer[] = [
  { id: 'ap1',  name: 'Shai Gilgeous-Alexander', position: 'PG', team: 'OKC', teamColor: '#007AC1', avgPts: 44.2, lastWeekPts: 48.9, ownership: 0,    status: 'free_agent', trend: 'up' },
  { id: 'ap2',  name: 'Tyrese Haliburton',        position: 'PG', team: 'IND', teamColor: '#002D62', avgPts: 31.2, lastWeekPts: 34.1, ownership: 0,    status: 'free_agent', trend: 'up' },
  { id: 'ap3',  name: 'Cade Cunningham',          position: 'SG', team: 'DET', teamColor: '#C8102E', avgPts: 28.4, lastWeekPts: 22.1, ownership: 0,    status: 'waiver',     waiverEnds: '24h', trend: 'down' },
  { id: 'ap4',  name: 'Domantas Sabonis',         position: 'C',  team: 'SAC', teamColor: '#5A2D81', avgPts: 38.1, lastWeekPts: 41.2, ownership: 0,    status: 'free_agent', trend: 'up' },
  { id: 'ap5',  name: 'Miles Bridges',            position: 'SF', team: 'NYK', teamColor: '#006BB6', avgPts: 24.8, lastWeekPts: 19.4, ownership: 0,    status: 'free_agent', trend: 'down' },
  { id: 'ap6',  name: 'Nic Claxton',              position: 'C',  team: 'BKN', teamColor: '#000000', avgPts: 21.3, lastWeekPts: 23.8, ownership: 0,    status: 'waiver',     waiverEnds: '6h',  trend: 'up' },
  { id: 'ap7',  name: 'Isaiah Joe',               position: 'SG', team: 'OKC', teamColor: '#007AC1', avgPts: 16.4, lastWeekPts: 28.2, ownership: 0,    status: 'free_agent', trend: 'up' },
  { id: 'ap8',  name: 'Jalen Williams',           position: 'SF', team: 'OKC', teamColor: '#007AC1', avgPts: 22.1, lastWeekPts: 24.9, ownership: 0,    status: 'free_agent', trend: 'neutral' },
  { id: 'ap9',  name: 'Brook Lopez',              position: 'C',  team: 'MIL', teamColor: '#00471B', avgPts: 19.8, lastWeekPts: 17.2, ownership: 0,    status: 'free_agent', trend: 'neutral' },
  { id: 'ap10', name: 'Immanuel Quickley',        position: 'PG', team: 'TOR', teamColor: '#CE1141', avgPts: 22.4, lastWeekPts: 26.1, ownership: 0,    status: 'waiver',     waiverEnds: '12h', trend: 'up' },
  { id: 'ap11', name: 'Obi Toppin',               position: 'PF', team: 'IND', teamColor: '#002D62', avgPts: 17.6, lastWeekPts: 21.3, ownership: 0,    status: 'free_agent', trend: 'up' },
  { id: 'ap12', name: 'Cam Thomas',               position: 'SG', team: 'BKN', teamColor: '#000000', avgPts: 26.8, lastWeekPts: 31.4, ownership: 0,    status: 'free_agent', trend: 'up' },
  // Owned players (for "All Players" view)
  { id: 'op1',  name: 'Steph Curry',              position: 'PG', team: 'GSW', teamColor: '#1D428A', avgPts: 46.1, lastWeekPts: 48.1, ownership: 100,  status: 'free_agent', trend: 'up',      ownedBy: 'SlamDunkSid' },
  { id: 'op2',  name: 'LeBron James',             position: 'SF', team: 'LAL', teamColor: '#552583', avgPts: 38.4, lastWeekPts: 31.4, ownership: 100,  status: 'free_agent', trend: 'neutral', ownedBy: 'SlamDunkSid' },
  { id: 'op3',  name: 'Nikola Jokić',             position: 'C',  team: 'DEN', teamColor: '#FEC524', avgPts: 52.3, lastWeekPts: 55.8, ownership: 100,  status: 'free_agent', trend: 'up',      ownedBy: 'SlamDunkSid' },
  { id: 'op4',  name: 'Damian Lillard',           position: 'PG', team: 'MIL', teamColor: '#00471B', avgPts: 38.4, lastWeekPts: 34.2, ownership: 100,  status: 'free_agent', trend: 'down',    ownedBy: 'HoopsDreamer' },
  { id: 'op5',  name: 'Kevin Durant',             position: 'SF', team: 'PHX', teamColor: '#1D1160', avgPts: 41.2, lastWeekPts: 28.8, ownership: 100,  status: 'free_agent', trend: 'down',    ownedBy: 'HoopsDreamer' },
  { id: 'op6',  name: 'Joel Embiid',              position: 'C',  team: 'PHI', teamColor: '#006BB6', avgPts: 44.8, lastWeekPts: 38.6, ownership: 100,  status: 'free_agent', trend: 'neutral', ownedBy: 'HoopsDreamer' },
]

const POSITIONS = ['All', 'PG', 'SG', 'SF', 'PF', 'C'] as const

/* ── Drop Player Modal ── */
function DropPlayerModal({
  roster,
  addingPlayer,
  onDrop,
  onClose,
}: {
  roster: RosterPlayer[]
  addingPlayer: AvailablePlayer
  onDrop: (dropId: string) => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/65 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm bg-bg-card border border-border rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <div>
            <h2 className="text-base font-bold text-text-primary">Drop a Player</h2>
            <p className="text-xs text-text-tertiary mt-0.5">Roster full · Adding <span className="text-accent-light font-medium">{addingPlayer.name}</span></p>
          </div>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-primary"><X className="w-4 h-4" /></button>
        </div>
        <div className="overflow-y-auto max-h-80">
          {roster.map(p => (
            <button
              key={p.id}
              onClick={() => onDrop(p.id)}
              className="w-full flex items-center gap-3 px-4 py-3 border-b border-border/50 last:border-0 hover:bg-danger/5 text-left transition-colors group"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold border-2 flex-shrink-0"
                style={{ backgroundColor: p.teamColor + '25', borderColor: p.teamColor + '45', color: p.teamColor }}
              >
                {p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">{p.name}</p>
                <p className="text-[11px] text-text-tertiary">{p.position} · {p.team} · AVG {p.avgPts}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.slot !== null ? 'bg-accent/10 text-accent-light' : 'bg-bg-secondary text-text-tertiary'}`}>
                {p.slot !== null ? p.slot : 'BN'}
              </span>
              <span className="text-xs text-danger opacity-0 group-hover:opacity-100 transition-opacity font-medium flex-shrink-0">Drop</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Players Tab ── */
function PlayersTab({ roster, setRoster }: {
  roster: RosterPlayer[]
  setRoster: Dispatch<SetStateAction<RosterPlayer[]>>
}) {
  const { toast } = useToast()
  const [view, setView] = useState<'available' | 'all'>('available')
  const [posFilter, setPosFilter] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())
  const [droppingFor, setDroppingFor] = useState<AvailablePlayer | null>(null)

  // Exclude players already on your roster from the available pool
  const rosterNames = new Set(roster.map(p => p.name))

  const handleAddOrClaim = (player: AvailablePlayer) => {
    if (roster.length >= MAX_ROSTER_SIZE) {
      setDroppingFor(player)
    } else {
      commitAdd(player, null)
    }
  }

  const commitAdd = (player: AvailablePlayer, dropId: string | null) => {
    const newPlayer: RosterPlayer = {
      id: player.id,
      name: player.name,
      position: player.position,
      team: player.team,
      teamColor: player.teamColor,
      fantasyPts: player.lastWeekPts,
      avgPts: player.avgPts,
      status: 'active',
      slot: null,
      trend: player.trend,
    }
    setRoster(prev => {
      const without = dropId ? prev.filter(p => p.id !== dropId) : prev
      return [...without, newPlayer]
    })
    setAddedIds(prev => new Set(prev).add(player.id))
    setDroppingFor(null)
    if (player.status === 'waiver') {
      toast('success', `Waiver claim placed for ${player.name}! They'll appear on your bench.`)
    } else {
      toast('success', `${player.name} added to your bench!`)
    }
  }

  const handleDrop = (dropId: string) => {
    if (!droppingFor) return
    const dropped = roster.find(p => p.id === dropId)
    commitAdd(droppingFor, dropId)
    if (dropped) toast('info', `${dropped.name} dropped from your roster.`)
  }

  const poolBase = view === 'available'
    ? PLAYER_POOL.filter(p => p.ownership === 0 && !rosterNames.has(p.name))
    : PLAYER_POOL

  const filtered = poolBase.filter(p => {
    const matchPos = posFilter === 'All' || p.position === posFilter
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.team.toLowerCase().includes(search.toLowerCase())
    return matchPos && matchSearch
  })

  const TrendIcon = ({ trend }: { trend: AvailablePlayer['trend'] }) => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-success" />
    if (trend === 'down') return <TrendingDown className="w-3 h-3 text-danger" />
    return <Minus className="w-3 h-3 text-text-tertiary" />
  }

  return (
    <>
    <div className="space-y-3">
      {/* Roster size indicator */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-text-tertiary">Roster: <span className={`font-semibold ${roster.length >= MAX_ROSTER_SIZE ? 'text-warning' : 'text-text-secondary'}`}>{roster.length}/{MAX_ROSTER_SIZE}</span></span>
        {roster.length >= MAX_ROSTER_SIZE && (
          <span className="text-[10px] font-bold text-warning bg-warning/10 border border-warning/20 px-2 py-0.5 rounded-full">Full — must drop to add</span>
        )}
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-1 p-0.5 bg-bg-card border border-border rounded-lg">
        <button
          onClick={() => setView('available')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${view === 'available' ? 'bg-accent text-white' : 'text-text-tertiary hover:text-text-secondary'}`}
        >
          Available
        </button>
        <button
          onClick={() => setView('all')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${view === 'all' ? 'bg-accent text-white' : 'text-text-tertiary hover:text-text-secondary'}`}
        >
          All Players
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search players or teams..."
          className="w-full h-10 pl-9 pr-3 bg-bg-card border border-border rounded-xl text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none transition-colors"
        />
      </div>

      {/* Position filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
        {POSITIONS.map(pos => (
          <button
            key={pos}
            onClick={() => setPosFilter(pos)}
            className={`flex-shrink-0 h-7 px-3 rounded-full text-xs font-semibold border transition-colors ${
              posFilter === pos
                ? 'bg-accent/15 border-accent/30 text-accent-light'
                : 'bg-bg-card border-border text-text-tertiary hover:text-text-secondary'
            }`}
          >
            {pos}
          </button>
        ))}
      </div>

      {/* Player list */}
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-[1fr_52px_52px_88px] items-center px-4 py-2 border-b border-border bg-bg-secondary/50 text-[10px] text-text-tertiary uppercase tracking-wider font-medium">
          <span>Player</span>
          <span className="text-right">AVG</span>
          <span className="text-right">Last Wk</span>
          <span></span>
        </div>

        {filtered.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-sm text-text-tertiary">No players found.</p>
          </div>
        )}

        {filtered.map(player => {
          const isAdded = addedIds.has(player.id)
          const isOnMyRoster = rosterNames.has(player.name)
          const isOwned = player.ownership === 100
          return (
            <div
              key={player.id}
              className="grid grid-cols-[1fr_52px_52px_88px] items-center px-4 py-3 border-b border-border/50 last:border-0 hover:bg-white/[0.01] transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold border-2 flex-shrink-0"
                  style={{ backgroundColor: player.teamColor + '25', borderColor: player.teamColor + '45', color: player.teamColor }}
                >
                  {player.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-text-primary truncate">{player.name}</span>
                    <TrendIcon trend={player.trend} />
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-text-tertiary">
                    <span className="font-medium">{player.position}</span>
                    <span>·</span>
                    <span>{player.team}</span>
                    {player.status === 'waiver' && !isOwned && !isOnMyRoster && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-0.5 text-warning font-medium">
                          <Clock className="w-2.5 h-2.5" />{player.waiverEnds}
                        </span>
                      </>
                    )}
                    {isOwned && player.ownedBy && (
                      <>
                        <span>·</span>
                        <span className="text-text-tertiary truncate">{player.ownedBy}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <span className="text-sm font-semibold text-text-primary text-right tabular-nums">{player.avgPts}</span>

              <span className={`text-sm font-semibold text-right tabular-nums ${
                player.lastWeekPts > player.avgPts ? 'text-success' : player.lastWeekPts < player.avgPts ? 'text-danger' : 'text-text-secondary'
              }`}>{player.lastWeekPts}</span>

              <div className="flex justify-end">
                {isOwned || isOnMyRoster ? (
                  <span className="text-[10px] font-bold text-text-tertiary bg-bg-secondary border border-border px-2 py-1 rounded-lg">
                    {isOnMyRoster ? 'Yours' : 'Rostered'}
                  </span>
                ) : isAdded ? (
                  <span className="text-[10px] font-bold text-success bg-success/10 border border-success/20 px-2 py-1 rounded-lg flex items-center gap-1">
                    <Check className="w-2.5 h-2.5" /> {player.status === 'waiver' ? 'Claimed' : 'Added'}
                  </span>
                ) : (
                  <button
                    onClick={() => handleAddOrClaim(player)}
                    className={`flex items-center gap-1 h-8 px-3 text-xs font-bold rounded-lg border transition-colors ${
                      player.status === 'waiver'
                        ? 'bg-warning/10 border-warning/25 text-warning hover:bg-warning/15'
                        : 'bg-accent/10 border-accent/20 text-accent-light hover:bg-accent/15'
                    }`}
                  >
                    {player.status === 'waiver'
                      ? <><Clock className="w-3 h-3" /> Waiver</>
                      : <><Plus className="w-3 h-3" /> Add</>
                    }
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {view === 'available' && (
        <p className="text-xs text-text-tertiary text-center">
          <span className="text-warning font-medium">Waiver</span> players have a claim period. <span className="text-accent-light font-medium">Free agents</span> are added immediately.
        </p>
      )}
    </div>

    {droppingFor && (
      <DropPlayerModal
        roster={roster}
        addingPlayer={droppingFor}
        onDrop={handleDrop}
        onClose={() => setDroppingFor(null)}
      />
    )}
    </>
  )
}

/* ── League Chat Tab ── */
function LeagueChatTab() {
  const { messages, setMessages, sendMessage } = useRealtimeMessages('league-1')
  useState(() => { setMessages(getMockMessages('league-1')) })
  return (
    <div className="bg-bg-card border border-border rounded-xl overflow-hidden h-[400px] lg:h-[500px]">
      <ChatPanel messages={messages} onSend={sendMessage} placeholder="Message the league..." />
    </div>
  )
}

/* ── Main Component ── */
export default function LeagueDetail() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState<Tab>('My Team')
  const [copied, setCopied] = useState(false)
  const [selectedMatchup, setSelectedMatchup] = useState<MatchupData | null>(null)
  const [roster, setRoster] = useState<RosterPlayer[]>(rosterPlayers)
  const inviteCode = 'CLNGR-MATES-2026'

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5">
      <Link to="/leagues" className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-text-secondary transition-colors">
        <ArrowLeft className="w-4 h-4" /> My Leagues
      </Link>

      {/* League Header */}
      <div className="bg-bg-card border border-border rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/10 text-accent-light">Draft</span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-warning">
                <Crown className="w-3 h-3" /> Commissioner
              </span>
            </div>
            <h1 className="text-xl font-bold text-text-primary">Mates League 2026</h1>
            <div className="flex items-center gap-4 mt-2 text-xs text-text-tertiary">
              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 8/10 members</span>
              <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> $50 prize pool</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Week 10 of 16</span>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 h-10 px-3 bg-bg-primary border border-border rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary hover:border-accent/25 transition-colors self-start sm:self-auto"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="font-mono tracking-wider">{inviteCode}</span>
          </button>
        </div>
      </div>

      {/* Live Matchup Banner */}
      <Link
        to={`/contests/2/matchup`}
        className="flex items-center justify-between p-4 bg-success/8 border border-success/20 rounded-xl hover:bg-success/12 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-success/15 border border-success/25 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-success" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-text-primary">Week 10 Matchup</span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-success px-1.5 py-0.5 rounded-full bg-success/10">
                <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" /> LIVE
              </span>
            </div>
            <p className="text-xs text-text-tertiary mt-0.5">You <span className="text-success font-semibold">258.5</span> vs MattKellyFF <span className="text-danger font-semibold">122.4</span></p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-text-secondary transition-colors" />
      </Link>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-0.5 bg-bg-card border border-border rounded-lg overflow-x-auto">
        {TABS.map(tab => {
          const icons: Record<Tab, typeof Trophy> = {
            'My Team': UserRoundCog,
            Standings: Trophy,
            Schedule: Calendar,
            Players: Users,
            Chat: MessageSquare,
            Settings: Settings,
          }
          const Icon = icons[tab]
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors min-h-[44px] flex-1 justify-center ${
                activeTab === tab ? 'bg-accent text-white' : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'My Team' && <MyTeamTab isDraftLeague={true} roster={roster} setRoster={setRoster} />}

      {activeTab === 'Standings' && (
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-[24px_1fr_48px_72px_32px] sm:grid-cols-[32px_1fr_60px_60px_80px_48px] gap-2 sm:gap-3 items-center px-3 sm:px-4 py-2.5 border-b border-border text-[10px] text-text-tertiary uppercase tracking-wider font-medium">
            <span>#</span>
            <span>Team</span>
            <span className="text-right">W-L</span>
            <span className="text-right hidden sm:block">Streak</span>
            <span className="text-right">Pts</span>
            <span></span>
          </div>
          {members.map(m => (
            <div
              key={m.rank}
              className={`grid grid-cols-[24px_1fr_48px_72px_32px] sm:grid-cols-[32px_1fr_60px_60px_80px_48px] gap-2 sm:gap-3 items-center px-3 sm:px-4 py-3 border-b border-border/50 last:border-0 hover:bg-white/[0.01] transition-colors ${m.isYou ? 'bg-accent/[0.03]' : ''}`}
            >
              <span className={`text-sm font-bold ${m.rank <= 3 ? 'text-success' : 'text-text-tertiary'}`}>{m.rank}</span>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 flex-shrink-0"
                  style={{ backgroundColor: m.color + '20', borderColor: m.color + '40', color: m.color }}>
                  {m.initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-semibold truncate ${m.isYou ? 'text-accent-light' : 'text-text-primary'}`}>{m.name}</span>
                    {m.isCommissioner && <Crown className="w-3 h-3 text-warning flex-shrink-0" />}
                    {m.isYou && <span className="text-[9px] font-bold text-accent-light bg-accent/10 px-1.5 py-0.5 rounded flex-shrink-0">YOU</span>}
                  </div>
                </div>
              </div>
              <span className="text-sm text-text-secondary text-right font-medium">{m.wins}-{m.losses}</span>
              <span className={`text-xs text-right font-bold hidden sm:block ${m.streak.startsWith('W') ? 'text-success' : 'text-danger'}`}>{m.streak}</span>
              <span className="text-sm text-text-primary text-right font-semibold tabular-nums">{m.totalPts.toFixed(1)}</span>
              <span className="text-right">
                {m.rank <= 3 && <span className="text-[10px]">{m.rank === 1 ? '🥇' : m.rank === 2 ? '🥈' : '🥉'}</span>}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Schedule' && (
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden divide-y divide-border/50">
          {MATCHUP_DATA.map(m => {
            const myWon = m.myScore > m.oppScore
            return (
              <button
                key={m.week}
                onClick={() => setSelectedMatchup(m)}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.02] transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-tertiary font-medium w-12">Wk {m.week}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold border flex-shrink-0"
                      style={{ backgroundColor: m.oppColor + '20', borderColor: m.oppColor + '35', color: m.oppColor }}>
                      {m.oppInitials}
                    </div>
                    <span className="text-sm text-text-primary font-medium">vs {m.opponent}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {m.status === 'completed' && (
                    <>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${myWon ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                        {myWon ? 'W' : 'L'}
                      </span>
                      <span className="text-xs text-text-secondary tabular-nums">{m.myScore} – {m.oppScore}</span>
                    </>
                  )}
                  {m.status === 'live' && (
                    <span className="flex items-center gap-1 text-xs font-bold text-success">
                      <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" /> Live
                    </span>
                  )}
                  {m.status === 'upcoming' && (
                    <span className="text-xs text-text-tertiary">Projected {
                      m.myLineup.reduce((s, p) => s + (p.projected ?? 0), 0).toFixed(0)
                    } pts</span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-text-secondary transition-colors" />
                </div>
              </button>
            )
          })}
        </div>
      )}

      {activeTab === 'Players' && <PlayersTab roster={roster} setRoster={setRoster} />}

      {activeTab === 'Chat' && <LeagueChatTab />}

      {activeTab === 'Settings' && (
        <div className="bg-bg-card border border-border rounded-xl p-8 text-center">
          <Settings className="w-10 h-10 text-text-tertiary mx-auto mb-3" />
          <h3 className="text-base font-semibold text-text-primary mb-1">League Settings</h3>
          <p className="text-sm text-text-tertiary">Manage scoring, roster, and trade settings. Commissioner only.</p>
        </div>
      )}

      {selectedMatchup && (
        <MatchupModal matchup={selectedMatchup} onClose={() => setSelectedMatchup(null)} />
      )}
    </div>
  )
}
