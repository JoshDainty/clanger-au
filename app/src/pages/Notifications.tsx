import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Trophy, Users, DollarSign, Megaphone, Check, Zap, X } from 'lucide-react'

interface Notification {
  id: string
  type: 'contest_result' | 'league_update' | 'prize' | 'announcement' | 'draft_reminder'
  title: string
  body: string
  time: string
  read: boolean
  link?: string
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'prize',
    title: 'You won $125!',
    body: 'You finished #3 of 412 in the NBA Tuesday Salary Showdown. Prize has been credited to your wallet.',
    time: '12m ago',
    read: false,
    link: '/profile/wallet',
  },
  {
    id: '2',
    type: 'draft_reminder',
    title: 'Draft starting in 30 minutes',
    body: 'High Roller Draft ($50 entry) locks at 7:00 PM AEST. Your pick order is #4.',
    time: '28m ago',
    read: false,
    link: '/contests/3',
  },
  {
    id: '3',
    type: 'contest_result',
    title: 'Best Ball Weekly results are in',
    body: 'You finished #12 of 1,240 in Best Ball Weekly #46. You won $45!',
    time: '2h ago',
    read: true,
    link: '/contests/2',
  },
  {
    id: '4',
    type: 'league_update',
    title: 'New message in Mates League 2026',
    body: 'JoshDainty: "Rematch next week, don\'t sleep on me 👀"',
    time: '3h ago',
    read: true,
    link: '/leagues/1',
  },
  {
    id: '5',
    type: 'announcement',
    title: '$25,000 Playoff Contest is LIVE',
    body: 'Australia\'s biggest NBA fantasy contest just dropped. $10 entry. Draft locks at tip-off tonight.',
    time: '5h ago',
    read: true,
    link: '/contests',
  },
  {
    id: '6',
    type: 'contest_result',
    title: 'NBA Monday Night results',
    body: 'You finished #28 of 412 in the Monday Salary Cap Contest. Better luck next time!',
    time: 'Yesterday',
    read: true,
    link: '/contests/1',
  },
  {
    id: '7',
    type: 'prize',
    title: 'Mates League Round 7 — you won!',
    body: 'You finished #1 of 10 in Mates League Round 7 and won $25.',
    time: 'Yesterday',
    read: true,
    link: '/leagues/1',
  },
]

const TYPE_CONFIG: Record<Notification['type'], { icon: typeof Trophy; iconColor: string; bgColor: string }> = {
  prize: { icon: DollarSign, iconColor: 'text-success', bgColor: 'bg-success/10 border-success/15' },
  draft_reminder: { icon: Zap, iconColor: 'text-warning', bgColor: 'bg-warning/10 border-warning/15' },
  contest_result: { icon: Trophy, iconColor: 'text-accent-light', bgColor: 'bg-accent/10 border-accent/15' },
  league_update: { icon: Users, iconColor: 'text-accent-light', bgColor: 'bg-accent/10 border-accent/15' },
  announcement: { icon: Megaphone, iconColor: 'text-danger', bgColor: 'bg-danger/10 border-danger/15' },
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const navigate = useNavigate()

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const dismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleClick = (n: Notification) => {
    markRead(n.id)
    if (n.link) navigate(n.link)
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight">Notifications</h1>
          <p className="text-text-secondary text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up.'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-3 py-2 text-xs text-text-secondary hover:text-accent-light transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-10 h-10 text-text-tertiary mx-auto mb-3" />
          <p className="text-text-secondary font-medium">No notifications yet</p>
          <p className="text-text-tertiary text-sm mt-1">We'll let you know when something happens.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const config = TYPE_CONFIG[n.type]
            const Icon = config.icon
            return (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-colors cursor-pointer group ${
                  !n.read
                    ? 'bg-bg-card border-accent/15 hover:border-accent/25'
                    : 'bg-bg-card/50 border-border hover:border-border-light hover:bg-bg-card'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${config.bgColor}`}>
                  <Icon className={`w-4 h-4 ${config.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${!n.read ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-text-tertiary mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
                  <p className="text-[11px] text-text-tertiary mt-1.5">{n.time}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 mt-0.5">
                  {!n.read && <div className="w-2 h-2 rounded-full bg-accent" />}
                  <button
                    onClick={(e) => dismiss(n.id, e)}
                    className="text-text-tertiary hover:text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {notifications.length > 0 && (
        <div className="text-center py-4">
          <p className="text-text-tertiary text-sm flex items-center justify-center gap-2">
            <Bell className="w-4 h-4" />
            That's everything for now.
          </p>
        </div>
      )}
    </div>
  )
}
