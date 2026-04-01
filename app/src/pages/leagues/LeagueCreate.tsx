import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, ChevronRight, Trophy, Users, Calendar, DollarSign, Zap } from 'lucide-react'

type ContestType = 'Draft' | 'Salary Cap' | 'Best Ball'
type ScoringType = 'Standard' | 'PPR' | 'Half PPR'

interface LeagueForm {
  name: string
  type: ContestType
  maxMembers: number
  entryFee: number
  scoringType: ScoringType
  draftDate: string
  isPrivate: boolean
}

const STEPS = ['Basics', 'Settings', 'Review'] as const

export default function LeagueCreate() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<LeagueForm>({
    name: '',
    type: 'Draft',
    maxMembers: 10,
    entryFee: 5,
    scoringType: 'Standard',
    draftDate: '',
    isPrivate: true,
  })

  const updateForm = (updates: Partial<LeagueForm>) => setForm(prev => ({ ...prev, ...updates }))
  const canProceed = step === 0 ? form.name.trim().length >= 3 : step === 1 ? form.draftDate !== '' : true

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Link to="/leagues" className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-text-secondary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Leagues
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-text-primary">Create a League</h1>
        <p className="text-text-secondary text-sm mt-1">Set up your own private or public league.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center gap-2 ${i <= step ? '' : 'opacity-40'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                i < step ? 'bg-success/15 border-success/30 text-success'
                : i === step ? 'bg-accent/15 border-accent/30 text-accent-light'
                : 'bg-bg-card border-border text-text-tertiary'
              }`}>
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:inline ${i === step ? 'text-text-primary' : 'text-text-tertiary'}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-success/30' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-5">
        {/* Step 1: Basics */}
        {step === 0 && (
          <>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">League Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => updateForm({ name: e.target.value })}
                className="w-full h-11 px-4 bg-bg-primary border border-border rounded-xl text-text-primary text-sm placeholder:text-text-tertiary focus:border-accent focus:outline-none transition-colors"
                placeholder="e.g. Mates League 2026"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Contest Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Draft', 'Salary Cap', 'Best Ball'] as ContestType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => updateForm({ type })}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      form.type === type
                        ? 'border-accent/30 bg-accent/[0.06] ring-1 ring-accent/10'
                        : 'border-border bg-bg-primary hover:border-border-light'
                    }`}
                  >
                    <div className="text-sm font-semibold text-text-primary">{type}</div>
                    <div className="text-[10px] text-text-tertiary mt-1">
                      {type === 'Draft' ? 'Snake draft' : type === 'Salary Cap' ? 'Build under cap' : 'Auto-optimize'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Sport</label>
              <div className="flex items-center gap-2 p-3 rounded-xl border border-accent/20 bg-accent/[0.04]">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-base">🏀</div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">NBA</div>
                  <div className="text-[10px] text-text-tertiary">2025-26 Season</div>
                </div>
                <Check className="w-4 h-4 text-accent-light ml-auto" />
              </div>
            </div>
          </>
        )}

        {/* Step 2: Settings */}
        {step === 1 && (
          <>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Max Members</label>
              <div className="flex items-center gap-2">
                {[4, 6, 8, 10, 12, 16].map(n => (
                  <button
                    key={n}
                    onClick={() => updateForm({ maxMembers: n })}
                    className={`flex-1 h-10 rounded-lg text-sm font-medium transition-colors ${
                      form.maxMembers === n
                        ? 'bg-accent text-white'
                        : 'bg-bg-primary border border-border text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Entry Fee</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input
                  type="number"
                  value={form.entryFee}
                  onChange={e => updateForm({ entryFee: Math.max(0, parseInt(e.target.value) || 0) })}
                  className="w-full h-11 pl-9 pr-4 bg-bg-primary border border-border rounded-xl text-text-primary text-sm focus:border-accent focus:outline-none transition-colors"
                  min="0"
                />
              </div>
              <p className="text-[11px] text-text-tertiary mt-1">Prize pool: ${form.entryFee * form.maxMembers} (set to $0 for free league)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Scoring</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Standard', 'PPR', 'Half PPR'] as ScoringType[]).map(s => (
                  <button
                    key={s}
                    onClick={() => updateForm({ scoringType: s })}
                    className={`h-10 rounded-lg text-xs font-medium transition-colors ${
                      form.scoringType === s
                        ? 'bg-accent text-white'
                        : 'bg-bg-primary border border-border text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Draft Date</label>
              <input
                type="datetime-local"
                value={form.draftDate}
                onChange={e => updateForm({ draftDate: e.target.value })}
                className="w-full h-11 px-4 bg-bg-primary border border-border rounded-xl text-text-primary text-sm focus:border-accent focus:outline-none transition-colors [color-scheme:dark]"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-bg-primary">
              <div>
                <div className="text-sm font-medium text-text-primary">Private League</div>
                <div className="text-[11px] text-text-tertiary">Invite-only, not listed publicly</div>
              </div>
              <button
                onClick={() => updateForm({ isPrivate: !form.isPrivate })}
                className={`w-11 h-6 rounded-full transition-colors relative ${form.isPrivate ? 'bg-accent' : 'bg-border'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.isPrivate ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
          </>
        )}

        {/* Step 3: Review */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-accent-light" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Ready to create</h3>
            </div>

            {[
              { label: 'League Name', value: form.name, icon: Trophy },
              { label: 'Type', value: form.type, icon: Zap },
              { label: 'Max Members', value: `${form.maxMembers} teams`, icon: Users },
              { label: 'Entry Fee', value: form.entryFee === 0 ? 'Free' : `$${form.entryFee}`, icon: DollarSign },
              { label: 'Prize Pool', value: `$${form.entryFee * form.maxMembers}`, icon: Trophy },
              { label: 'Draft Date', value: form.draftDate ? new Date(form.draftDate).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Not set', icon: Calendar },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <span className="flex items-center gap-2 text-sm text-text-tertiary">
                  <item.icon className="w-4 h-4" /> {item.label}
                </span>
                <span className="text-sm font-medium text-text-primary">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="h-11 px-5 bg-bg-card border border-border text-text-secondary text-sm font-medium rounded-xl hover:text-text-primary transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={() => {
            if (step < 2) setStep(s => s + 1)
            else navigate('/leagues')
          }}
          disabled={!canProceed}
          className="flex-1 h-11 bg-accent hover:bg-accent-dark disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] flex items-center justify-center gap-2"
        >
          {step === 2 ? 'Create League' : 'Continue'} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
