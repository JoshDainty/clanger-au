import { Trophy, ArrowLeft, Users, DollarSign, Clock, ChevronRight } from 'lucide-react'

export default function ContestDetail() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-bg-card border border-border text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Contest Details</h1>
          <p className="text-text-secondary text-sm mt-1">View contest info, entries, and prizes.</p>
        </div>
      </div>

      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent/8 border border-accent/12 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-accent-light" />
          </div>
          <div className="flex-1">
            <div className="skeleton h-5 w-48 mb-2" />
            <div className="skeleton h-3 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: DollarSign, label: 'Prize Pool' },
            { icon: Users, label: 'Entries' },
            { icon: Clock, label: 'Starts In' },
          ].map((item) => (
            <div key={item.label} className="bg-bg-secondary rounded-lg p-3 text-center">
              <item.icon className="w-4 h-4 text-text-tertiary mx-auto mb-2" />
              <div className="skeleton h-5 w-16 mx-auto mb-1" />
              <div className="text-xs text-text-tertiary">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-bg-card border border-border rounded-xl p-5">
        <h2 className="text-lg font-bold text-text-primary mb-4">Prize Structure</h2>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary">Entries</h2>
          <ChevronRight className="w-4 h-4 text-text-tertiary" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-12 w-full" />
          ))}
        </div>
      </div>

      <button className="w-full py-3 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl transition-colors">
        Enter Contest
      </button>
    </div>
  )
}
