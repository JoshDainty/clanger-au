import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Plus, TrendingUp, TrendingDown } from 'lucide-react'

interface Transaction {
  id: string
  date: string
  type: 'deposit' | 'withdrawal' | 'entry_fee' | 'prize' | 'refund'
  description: string
  amount: number // positive = credit, negative = debit
  contest?: string
}

const transactions: Transaction[] = [
  { id: '1', date: 'Today', type: 'prize', description: 'Prize — NBA Tuesday Salary Showdown', amount: 125, contest: '#3 of 412' },
  { id: '2', date: 'Today', type: 'entry_fee', description: 'Entry — Best Ball Marathon', amount: -2, contest: 'Contest entry' },
  { id: '3', date: 'Yesterday', type: 'prize', description: 'Prize — Best Ball Weekly #46', amount: 45, contest: '#12 of 1240' },
  { id: '4', date: 'Yesterday', type: 'entry_fee', description: 'Entry — NBA Tuesday Showdown', amount: -5, contest: 'Contest entry' },
  { id: '5', date: 'Mar 28', type: 'prize', description: 'Prize — Mates League Round 7', amount: 25, contest: '#1 of 10' },
  { id: '6', date: 'Mar 28', type: 'entry_fee', description: 'Entry — High Roller Draft', amount: -50, contest: 'Contest entry' },
  { id: '7', date: 'Mar 27', type: 'prize', description: 'Prize — High Roller Draft', amount: 200, contest: '#2 of 10' },
  { id: '8', date: 'Mar 25', type: 'deposit', description: 'Deposit via card', amount: 100 },
  { id: '9', date: 'Mar 20', type: 'withdrawal', description: 'Withdrawal to bank', amount: -200 },
  { id: '10', date: 'Mar 18', type: 'deposit', description: 'Deposit via card', amount: 50 },
  { id: '11', date: 'Mar 15', type: 'refund', description: 'Refund — Cancelled contest', amount: 10 },
]

const TYPE_LABELS: Record<Transaction['type'], { label: string; color: string; icon: typeof ArrowUpRight }> = {
  deposit: { label: 'Deposit', color: 'text-accent-light', icon: ArrowDownLeft },
  withdrawal: { label: 'Withdrawal', color: 'text-warning', icon: ArrowUpRight },
  entry_fee: { label: 'Entry Fee', color: 'text-danger', icon: ArrowUpRight },
  prize: { label: 'Prize', color: 'text-success', icon: ArrowDownLeft },
  refund: { label: 'Refund', color: 'text-accent-light', icon: ArrowDownLeft },
}

export default function Wallet() {
  const balance = 842
  const totalWon = 420
  const totalSpent = 157

  return (
    <div className="space-y-6">
      <Link to="/profile" className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-text-secondary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Profile
      </Link>

      <h1 className="text-3xl font-black text-text-primary tracking-tight">Wallet</h1>

      {/* Balance Card */}
      <div className="relative bg-gradient-to-br from-accent/15 via-bg-card to-purple-500/10 border border-accent/20 rounded-2xl p-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-accent/[0.06] rounded-full blur-3xl" />
        <div className="relative z-10">
          <p className="text-sm text-text-secondary font-medium mb-1">Available Balance</p>
          <div className="text-4xl font-black text-text-primary tabular-nums mb-5">
            <span className="text-accent-light">$</span>{balance.toFixed(2)}
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 h-10 px-5 bg-accent hover:bg-accent-dark text-white text-sm font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(236,72,153,0.2)]">
              <Plus className="w-4 h-4" /> Deposit
            </button>
            <button className="flex items-center gap-2 h-10 px-5 bg-bg-card border border-border text-text-secondary text-sm font-medium rounded-xl hover:text-text-primary hover:border-accent/25 transition-colors">
              <ArrowUpRight className="w-4 h-4" /> Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Won / Spent */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-success" />
            </div>
            <span className="text-[11px] text-text-tertiary uppercase tracking-wide font-medium">Total Won</span>
          </div>
          <div className="text-xl font-bold text-success">${totalWon}</div>
        </div>
        <div className="bg-bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-danger/10 flex items-center justify-center">
              <TrendingDown className="w-3.5 h-3.5 text-danger" />
            </div>
            <span className="text-[11px] text-text-tertiary uppercase tracking-wide font-medium">Total Spent</span>
          </div>
          <div className="text-xl font-bold text-danger">${totalSpent}</div>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-base font-bold text-text-primary mb-3">Transaction History</h2>
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden divide-y divide-border/50">
          {transactions.map(tx => {
            const config = TYPE_LABELS[tx.type]
            const Icon = config.icon
            return (
              <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  tx.amount >= 0 ? 'bg-success/10' : 'bg-danger/10'
                }`}>
                  <Icon className={`w-4 h-4 ${tx.amount >= 0 ? 'text-success' : 'text-danger'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">{tx.description}</div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-text-tertiary">
                    <span>{tx.date}</span>
                    {tx.contest && <><span>·</span><span>{tx.contest}</span></>}
                  </div>
                </div>
                <div className={`text-sm font-bold flex-shrink-0 tabular-nums ${tx.amount >= 0 ? 'text-success' : 'text-danger'}`}>
                  {tx.amount >= 0 ? '+' : ''}{tx.amount < 0 ? '-' : ''}${Math.abs(tx.amount).toFixed(2)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
