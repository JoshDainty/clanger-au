import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Crown, Users, Trophy, Copy, Check, Calendar, Settings, MessageSquare } from 'lucide-react'
import { getMockMessages, useRealtimeMessages } from '@/lib/messages'
import ChatPanel from '@/components/ChatPanel'

const TABS = ['Standings', 'Schedule', 'Chat', 'Settings'] as const
type Tab = typeof TABS[number]

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
  { rank: 1, name: 'JoshDainty', initials: 'JD', color: '#3B82F6', wins: 8, losses: 2, totalPts: 1452.3, isCommissioner: true, isYou: true, streak: 'W4' },
  { rank: 2, name: 'SlamDunkSid', initials: 'SS', color: '#10B981', wins: 7, losses: 3, totalPts: 1388.1, isCommissioner: false, isYou: false, streak: 'W2' },
  { rank: 3, name: 'HoopsDreamer', initials: 'HD', color: '#F59E0B', wins: 7, losses: 3, totalPts: 1365.8, isCommissioner: false, isYou: false, streak: 'L1' },
  { rank: 4, name: 'MattKellyFF', initials: 'MK', color: '#EF4444', wins: 6, losses: 4, totalPts: 1312.4, isCommissioner: false, isYou: false, streak: 'W1' },
  { rank: 5, name: 'CourtVision', initials: 'CV', color: '#8B5CF6', wins: 5, losses: 5, totalPts: 1278.6, isCommissioner: false, isYou: false, streak: 'L2' },
  { rank: 6, name: 'BallerBrisbane', initials: 'BB', color: '#EC4899', wins: 4, losses: 6, totalPts: 1201.2, isCommissioner: false, isYou: false, streak: 'L1' },
  { rank: 7, name: 'RimProtector', initials: 'RP', color: '#14B8A6', wins: 3, losses: 7, totalPts: 1145.8, isCommissioner: false, isYou: false, streak: 'L3' },
  { rank: 8, name: 'DraftKingAU', initials: 'DK', color: '#F97316', wins: 2, losses: 8, totalPts: 1098.5, isCommissioner: false, isYou: false, streak: 'W1' },
]

const schedule = [
  { week: 8, opponent: 'SlamDunkSid', result: 'W 145.2 - 132.7', status: 'completed' as const },
  { week: 9, opponent: 'CourtVision', result: 'W 158.4 - 141.2', status: 'completed' as const },
  { week: 10, opponent: 'MattKellyFF', result: null, status: 'live' as const },
  { week: 11, opponent: 'BallerBrisbane', result: null, status: 'upcoming' as const },
  { week: 12, opponent: 'RimProtector', result: null, status: 'upcoming' as const },
]

function LeagueChatTab() {
  const { messages, setMessages, sendMessage } = useRealtimeMessages('league-1')

  // Load mock messages on mount
  useState(() => { setMessages(getMockMessages('league-1')) })

  return (
    <div className="bg-bg-card border border-border rounded-xl overflow-hidden h-[400px] lg:h-[500px]">
      <ChatPanel messages={messages} onSend={sendMessage} placeholder="Message the league..." />
    </div>
  )
}

export default function LeagueDetail() {
  const [activeTab, setActiveTab] = useState<Tab>('Standings')
  const [copied, setCopied] = useState(false)
  const inviteCode = 'CLNGR-MATES-2026'

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-7">
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

          {/* Invite code */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 h-10 px-3 bg-bg-primary border border-border rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary hover:border-accent/25 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="font-mono tracking-wider">{inviteCode}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-0.5 bg-bg-card border border-border rounded-lg overflow-x-auto">
        {TABS.map(tab => {
          const icons: Record<Tab, typeof Trophy> = { Standings: Trophy, Schedule: Calendar, Chat: MessageSquare, Settings: Settings }
          const Icon = icons[tab]
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors min-h-[44px] ${
                activeTab === tab ? 'bg-accent text-white' : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {tab}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'Standings' && (
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
          {/* Table header */}
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
              className={`grid grid-cols-[24px_1fr_48px_72px_32px] sm:grid-cols-[32px_1fr_60px_60px_80px_48px] gap-2 sm:gap-3 items-center px-3 sm:px-4 py-3 border-b border-border/50 last:border-0 hover:bg-white/[0.01] transition-colors ${
                m.isYou ? 'bg-accent/[0.03]' : ''
              }`}
            >
              <span className={`text-sm font-bold ${m.rank <= 3 ? 'text-success' : 'text-text-tertiary'}`}>
                {m.rank}
              </span>
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 flex-shrink-0"
                  style={{ backgroundColor: m.color + '20', borderColor: m.color + '40', color: m.color }}
                >
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
          {schedule.map(s => (
            <div key={s.week} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-tertiary font-medium w-12">Wk {s.week}</span>
                <span className="text-sm text-text-primary font-medium">vs {s.opponent}</span>
              </div>
              <div>
                {s.status === 'completed' && (
                  <span className={`text-xs font-medium ${s.result?.startsWith('W') ? 'text-success' : 'text-danger'}`}>{s.result}</span>
                )}
                {s.status === 'live' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-success">
                    <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" /> Live Now
                  </span>
                )}
                {s.status === 'upcoming' && <span className="text-xs text-text-tertiary">Upcoming</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Chat' && (
        <LeagueChatTab />
      )}

      {activeTab === 'Settings' && (
        <div className="bg-bg-card border border-border rounded-xl p-8 text-center">
          <Settings className="w-10 h-10 text-text-tertiary mx-auto mb-3" />
          <h3 className="text-base font-semibold text-text-primary mb-1">League Settings</h3>
          <p className="text-sm text-text-tertiary">Manage scoring, roster, and trade settings. Commissioner only.</p>
        </div>
      )}
    </div>
  )
}
