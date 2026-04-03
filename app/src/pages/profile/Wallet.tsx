import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Plus, TrendingUp, TrendingDown, X, CreditCard, Building2, AlertCircle } from 'lucide-react'
import { useToast } from '@/components/Toast'

interface Transaction {
  id: string
  date: string
  type: 'deposit' | 'withdrawal' | 'entry_fee' | 'prize' | 'refund'
  description: string
  amount: number
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

const DEPOSIT_AMOUNTS = [10, 25, 50, 100, 200, 500]

function DepositModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (amount: number) => void }) {
  const [selected, setSelected] = useState(50)
  const [custom, setCustom] = useState('')
  const [method, setMethod] = useState<'card' | 'bank'>('card')
  const [loading, setLoading] = useState(false)

  const amount = custom ? parseFloat(custom) : selected

  const handleDeposit = () => {
    if (!amount || amount < 5) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onSuccess(amount)
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-bg-card border border-border rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <h2 className="text-lg font-bold text-text-primary">Deposit Funds</h2>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Amount selector */}
          <div>
            <p className="text-sm font-medium text-text-secondary mb-3">Select amount (AUD)</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {DEPOSIT_AMOUNTS.map(amt => (
                <button
                  key={amt}
                  onClick={() => { setSelected(amt); setCustom('') }}
                  className={`h-11 rounded-xl text-sm font-bold transition-colors border ${
                    selected === amt && !custom
                      ? 'bg-accent text-white border-accent'
                      : 'bg-bg-secondary border-border text-text-secondary hover:border-accent/30 hover:text-text-primary'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">$</span>
              <input
                type="number"
                min="5"
                max="10000"
                value={custom}
                onChange={e => { setCustom(e.target.value); setSelected(0) }}
                placeholder="Custom amount"
                className="w-full h-11 pl-7 pr-4 bg-bg-secondary border border-border rounded-xl text-text-primary text-sm focus:border-accent focus:outline-none transition-colors placeholder:text-text-tertiary"
              />
            </div>
          </div>

          {/* Payment method */}
          <div>
            <p className="text-sm font-medium text-text-secondary mb-3">Payment method</p>
            <div className="space-y-2">
              {[
                { id: 'card' as const, label: 'Credit / Debit Card', sub: 'Visa, Mastercard', icon: CreditCard },
                { id: 'bank' as const, label: 'Bank Transfer', sub: 'PayID / BSB', icon: Building2 },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setMethod(opt.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left ${
                    method === opt.id ? 'border-accent/40 bg-accent/5' : 'border-border hover:border-accent/20'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${method === opt.id ? 'bg-accent/10' : 'bg-bg-secondary'}`}>
                    <opt.icon className={`w-4 h-4 ${method === opt.id ? 'text-accent-light' : 'text-text-tertiary'}`} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-primary">{opt.label}</div>
                    <div className="text-xs text-text-tertiary">{opt.sub}</div>
                  </div>
                  <div className={`ml-auto w-4 h-4 rounded-full border-2 ${method === opt.id ? 'border-accent bg-accent' : 'border-border'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-bg-secondary border border-border">
            <AlertCircle className="w-4 h-4 text-text-tertiary mt-0.5 shrink-0" />
            <p className="text-xs text-text-tertiary">Minimum deposit $5. Funds available instantly. Must be 18+. Play responsibly.</p>
          </div>
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={handleDeposit}
            disabled={!amount || amount < 5 || loading}
            className="w-full h-12 bg-accent hover:bg-accent-dark disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4" />
                {amount >= 5 ? `Deposit $${amount.toFixed(2)}` : 'Enter an amount'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function WithdrawModal({ balance, onClose, onSuccess }: { balance: number; onClose: () => void; onSuccess: (amount: number) => void }) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const numAmount = parseFloat(amount)
  const valid = numAmount >= 10 && numAmount <= balance

  const handleWithdraw = () => {
    if (!valid) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onSuccess(numAmount)
    }, 1400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-bg-card border border-border rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <h2 className="text-lg font-bold text-text-primary">Withdraw Funds</h2>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="p-4 rounded-xl bg-bg-secondary border border-border">
            <p className="text-xs text-text-tertiary mb-1">Available to withdraw</p>
            <p className="text-2xl font-black text-text-primary tabular-nums">
              <span className="text-accent-light">$</span>{balance.toFixed(2)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Amount (AUD)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">$</span>
              <input
                type="number"
                min="10"
                max={balance}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Minimum $10"
                className="w-full h-11 pl-7 pr-4 bg-bg-secondary border border-border rounded-xl text-text-primary text-sm focus:border-accent focus:outline-none transition-colors placeholder:text-text-tertiary"
              />
            </div>
            {numAmount > balance && (
              <p className="text-xs text-danger mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Amount exceeds available balance.
              </p>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-text-secondary mb-2">Withdraw to</p>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-accent/30 bg-accent/5">
              <Building2 className="w-4 h-4 text-accent-light" />
              <div>
                <p className="text-sm font-medium text-text-primary">ANZ Bank ••••4821</p>
                <p className="text-xs text-text-tertiary">Usually 1–3 business days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={handleWithdraw}
            disabled={!valid || loading}
            className="w-full h-12 bg-bg-secondary border border-border hover:border-accent/30 disabled:opacity-40 disabled:cursor-not-allowed text-text-primary font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-text-tertiary/30 border-t-text-secondary rounded-full animate-spin" />
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4" />
                {valid ? `Withdraw $${numAmount.toFixed(2)}` : 'Enter a valid amount'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Wallet() {
  const { toast } = useToast()
  const [balance, setBalance] = useState(842)
  const [totalWon] = useState(420)
  const [totalSpent] = useState(157)
  const [showDeposit, setShowDeposit] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [txList, setTxList] = useState(transactions)

  const handleDeposit = (amount: number) => {
    setBalance(prev => prev + amount)
    setTxList(prev => [{
      id: String(Date.now()),
      date: 'Just now',
      type: 'deposit',
      description: 'Deposit via card',
      amount,
    }, ...prev])
    setShowDeposit(false)
    toast('success', `$${amount.toFixed(2)} deposited successfully!`)
  }

  const handleWithdraw = (amount: number) => {
    setBalance(prev => prev - amount)
    setTxList(prev => [{
      id: String(Date.now()),
      date: 'Just now',
      type: 'withdrawal',
      description: 'Withdrawal to bank',
      amount: -amount,
    }, ...prev])
    setShowWithdraw(false)
    toast('success', `$${amount.toFixed(2)} withdrawal initiated. Arrives in 1–3 business days.`)
  }

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
            <button
              onClick={() => setShowDeposit(true)}
              className="flex items-center gap-2 h-10 px-5 bg-accent hover:bg-accent-dark text-white text-sm font-bold rounded-xl transition-colors"
              style={{ boxShadow: '0 0 20px rgba(59,130,246,0.2)' }}
            >
              <Plus className="w-4 h-4" /> Deposit
            </button>
            <button
              onClick={() => setShowWithdraw(true)}
              className="flex items-center gap-2 h-10 px-5 bg-bg-card border border-border text-text-secondary text-sm font-medium rounded-xl hover:text-text-primary hover:border-accent/25 transition-colors"
            >
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
          {txList.map(tx => {
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

      {showDeposit && <DepositModal onClose={() => setShowDeposit(false)} onSuccess={handleDeposit} />}
      {showWithdraw && <WithdrawModal balance={balance} onClose={() => setShowWithdraw(false)} onSuccess={handleWithdraw} />}
    </div>
  )
}
