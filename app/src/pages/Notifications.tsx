import { Bell, Trophy, Users, DollarSign, Megaphone, Check } from 'lucide-react'

const iconMap = [Trophy, Users, DollarSign, Megaphone, Trophy]
const colorMap = ['text-warning', 'text-accent-light', 'text-success', 'text-danger', 'text-accent-light']

export default function Notifications() {
  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight">Notifications</h1>
          <p className="text-text-secondary text-sm mt-1">Stay on top of contests, leagues, and results.</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-xs text-text-secondary hover:text-accent-light transition-colors">
          <Check className="w-3.5 h-3.5" />
          Mark all read
        </button>
      </div>

      <div className="space-y-2">
        {[0, 1, 2, 3, 4].map((i) => {
          const Icon = iconMap[i]
          const isUnread = i < 2
          return (
            <div
              key={i}
              className={`flex items-start gap-3 p-4 rounded-xl border transition-colors cursor-pointer ${
                isUnread
                  ? 'bg-bg-card border-accent/15 hover:border-accent/25'
                  : 'bg-bg-card/50 border-border hover:border-border'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                isUnread ? 'bg-accent/10 border border-accent/15' : 'bg-bg-secondary'
              }`}>
                <Icon className={`w-4 h-4 ${colorMap[i]}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="skeleton h-3.5 w-48 mb-2" />
                <div className="skeleton h-3 w-64 mb-2" />
                <div className="skeleton h-3 w-16" />
              </div>
              {isUnread && (
                <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5" />
              )}
            </div>
          )
        })}
      </div>

      <div className="text-center py-4">
        <p className="text-text-tertiary text-sm flex items-center justify-center gap-2">
          <Bell className="w-4 h-4" />
          You're all caught up.
        </p>
      </div>
    </div>
  )
}
