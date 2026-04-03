import { useNavigate, useParams, Link } from 'react-router-dom'
import { Trophy, ArrowLeft, Users, DollarSign, Clock, ChevronRight, Zap, Lock, Star } from 'lucide-react'

const SAMPLE_CONTESTS: Record<string, {
  name: string
  type: string
  status: 'upcoming' | 'live' | 'completed'
  prizePool: string
  entries: string
  maxEntries: string
  entryFee: string
  startsIn: string
  prizes: { place: string; amount: string }[]
  topEntries: { rank: number; name: string; initials: string; color: string; score: string }[]
  description: string
}> = {
  '1': {
    name: 'NBA Tuesday Salary Showdown',
    type: 'Salary Cap',
    status: 'upcoming',
    prizePool: '$5,000',
    entries: '347',
    maxEntries: '500',
    entryFee: '$5',
    startsIn: '2h 14m',
    description: 'Pick 8 players within a $50K salary cap. Highest fantasy score takes the cash.',
    prizes: [
      { place: '1st', amount: '$1,500' },
      { place: '2nd', amount: '$750' },
      { place: '3rd', amount: '$500' },
      { place: '4th–10th', amount: '$150 each' },
      { place: '11th–50th', amount: '$25 each' },
    ],
    topEntries: [
      { rank: 1, name: 'SlamDunkSid', initials: 'SS', color: '#10B981', score: '312.4' },
      { rank: 2, name: 'JoshDainty', initials: 'JD', color: '#3B82F6', score: '298.1' },
      { rank: 3, name: 'BallerBrisbane', initials: 'BB', color: '#EC4899', score: '287.6' },
      { rank: 4, name: 'CourtVision', initials: 'CV', color: '#8B5CF6', score: '281.2' },
    ],
  },
  '2': {
    name: 'Best Ball Marathon',
    type: 'Best Ball',
    status: 'live',
    prizePool: '$2,000',
    entries: '1,180',
    maxEntries: '1,500',
    entryFee: '$2',
    startsIn: 'LIVE',
    description: 'Season-long best ball contest. Your highest-scoring lineup each week is automatically used.',
    prizes: [
      { place: '1st', amount: '$600' },
      { place: '2nd', amount: '$300' },
      { place: '3rd', amount: '$200' },
      { place: '4th–20th', amount: '$50 each' },
    ],
    topEntries: [
      { rank: 1, name: 'HoopsDreamer', initials: 'HD', color: '#F59E0B', score: '1,842.5' },
      { rank: 2, name: 'MattKellyFF', initials: 'MK', color: '#EF4444', score: '1,790.2' },
      { rank: 3, name: 'DraftKingAU', initials: 'DK', color: '#F97316', score: '1,755.8' },
      { rank: 4, name: 'SlamDunkSid', initials: 'SS', color: '#10B981', score: '1,712.1' },
    ],
  },
  '3': {
    name: 'High Roller Draft',
    type: 'Draft',
    status: 'upcoming',
    prizePool: '$20,000',
    entries: '8',
    maxEntries: '10',
    entryFee: '$50',
    startsIn: '45m',
    description: 'Premium 10-person snake draft contest. Winner takes $10,000.',
    prizes: [
      { place: '1st', amount: '$10,000' },
      { place: '2nd', amount: '$5,000' },
      { place: '3rd', amount: '$3,000' },
      { place: '4th', amount: '$2,000' },
    ],
    topEntries: [
      { rank: 1, name: 'JoshDainty', initials: 'JD', color: '#3B82F6', score: '—' },
      { rank: 2, name: 'CourtVision', initials: 'CV', color: '#8B5CF6', score: '—' },
      { rank: 3, name: 'SlamDunkSid', initials: 'SS', color: '#10B981', score: '—' },
    ],
  },
}

const FALLBACK = SAMPLE_CONTESTS['1']

export default function ContestDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const contest = SAMPLE_CONTESTS[id ?? ''] ?? FALLBACK

  const filledPct = Math.round(
    (parseInt(contest.entries.replace(',', '')) / parseInt(contest.maxEntries.replace(',', ''))) * 100
  )

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-bg-card border border-border text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{contest.name}</h1>
          <p className="text-text-secondary text-sm mt-0.5">{contest.type} · {contest.description}</p>
        </div>
      </div>

      {/* Status badge + key stats */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent/8 border border-accent/12 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-accent-light" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold text-text-primary">{contest.name}</span>
              {contest.status === 'live' && (
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
                  <Zap className="w-2.5 h-2.5" /> Live
                </span>
              )}
              {contest.status === 'upcoming' && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/10 text-accent-light border border-accent/20">
                  Upcoming
                </span>
              )}
            </div>
            <p className="text-xs text-text-tertiary mt-0.5">{contest.entryFee} entry · {contest.type}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: DollarSign, label: 'Prize Pool', value: contest.prizePool },
            { icon: Users, label: 'Entries', value: `${contest.entries} / ${contest.maxEntries}` },
            { icon: Clock, label: contest.status === 'live' ? 'Status' : 'Starts In', value: contest.startsIn },
          ].map((item) => (
            <div key={item.label} className="bg-bg-secondary rounded-lg p-3 text-center">
              <item.icon className="w-4 h-4 text-text-tertiary mx-auto mb-2" />
              <div className="text-sm font-bold text-text-primary">{item.value}</div>
              <div className="text-xs text-text-tertiary mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Fill bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-text-tertiary mb-1.5">
            <span>{contest.entries} entered</span>
            <span>{contest.maxEntries} max · {filledPct}% full</span>
          </div>
          <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${filledPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Prize Structure */}
      <div className="bg-bg-card border border-border rounded-xl p-5">
        <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <Star className="w-4 h-4 text-warning" /> Prize Structure
        </h2>
        <div className="space-y-0 divide-y divide-border/50">
          {contest.prizes.map((prize) => (
            <div key={prize.place} className="flex items-center justify-between py-2.5">
              <span className="text-sm text-text-secondary">{prize.place}</span>
              <span className="text-sm font-bold text-success">{prize.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Entries / Leaderboard */}
      <div className="bg-bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary">
            {contest.status === 'upcoming' ? 'Entries So Far' : 'Leaderboard'}
          </h2>
          <ChevronRight className="w-4 h-4 text-text-tertiary" />
        </div>
        <div className="space-y-2">
          {contest.topEntries.map((entry) => (
            <div key={entry.rank} className="flex items-center gap-3 p-3 rounded-xl bg-bg-secondary">
              <span className={`text-xs font-bold w-5 text-center ${entry.rank <= 3 ? 'text-warning' : 'text-text-tertiary'}`}>
                {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
              </span>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0"
                style={{ backgroundColor: entry.color + '20', borderColor: entry.color + '40', color: entry.color }}
              >
                {entry.initials}
              </div>
              <span className="flex-1 text-sm font-medium text-text-primary">{entry.name}</span>
              <span className="text-sm font-bold text-text-secondary tabular-nums">{entry.score} pts</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {contest.status !== 'completed' ? (
        <Link
          to={`/contests/${id}/draft`}
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl transition-colors"
          style={{ boxShadow: '0 0 24px rgba(59,130,246,0.25)' }}
        >
          {contest.status === 'live' ? <Zap className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
          {contest.status === 'live' ? 'Join Live Contest' : `Enter Contest · ${contest.entryFee}`}
        </Link>
      ) : (
        <button disabled className="flex items-center justify-center gap-2 w-full py-3.5 bg-bg-card border border-border text-text-tertiary font-bold rounded-xl cursor-not-allowed">
          <Lock className="w-4 h-4" /> Contest Closed
        </button>
      )}
    </div>
  )
}
