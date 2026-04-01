/**
 * Demo page to showcase all loading, empty, and error states.
 * Navigate to /states-demo to view.
 */
import { useState } from 'react'
import { Trophy, Users, MessageSquare, Shirt, LayoutDashboard, Wallet } from 'lucide-react'
import ErrorState from '@/components/ErrorState'
import EmptyState from '@/components/EmptyState'
import {
  DashboardSkeleton,
  ContestsListSkeleton,
  PlayersListSkeleton,
  LeaguesListSkeleton,
  ProfileSkeleton,
  WalletSkeleton,
} from '@/components/Skeletons'

type ViewState = 'loading' | 'empty' | 'error'
type DemoPage = 'dashboard' | 'contests' | 'players' | 'leagues' | 'profile' | 'wallet'

const DEMO_PAGES: { key: DemoPage; label: string; icon: typeof Trophy }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'contests', label: 'Contests', icon: Trophy },
  { key: 'players', label: 'Players', icon: Shirt },
  { key: 'leagues', label: 'Leagues', icon: Users },
  { key: 'profile', label: 'Profile', icon: Users },
  { key: 'wallet', label: 'Wallet', icon: Wallet },
]

const SKELETONS: Record<DemoPage, () => JSX.Element> = {
  dashboard: DashboardSkeleton,
  contests: ContestsListSkeleton,
  players: PlayersListSkeleton,
  leagues: LeaguesListSkeleton,
  profile: ProfileSkeleton,
  wallet: WalletSkeleton,
}

const EMPTY_STATES: Record<DemoPage, { icon: typeof Trophy; title: string; message: string; actionLabel: string; actionTo: string }> = {
  dashboard: { icon: LayoutDashboard, title: 'Welcome to Clanger.au!', message: 'Join your first contest to get started. Your dashboard will come alive with live scores, stats, and activity.', actionLabel: 'Browse Contests', actionTo: '/contests' },
  contests: { icon: Trophy, title: 'No contests found', message: 'No contests match your current filters. Try broadening your search or create your own league!', actionLabel: 'Create a League', actionTo: '/leagues/create' },
  players: { icon: Shirt, title: 'No players found', message: 'No players match your search. Try a different name, team, or position filter.', actionLabel: 'Clear Filters', actionTo: '/players' },
  leagues: { icon: Users, title: 'No leagues yet', message: 'You haven\'t joined any leagues yet. Create one and invite your mates, or browse public leagues.', actionLabel: 'Create a League', actionTo: '/leagues/create' },
  profile: { icon: Users, title: 'No contest history', message: 'You haven\'t completed any contests yet. Enter one to start building your track record!', actionLabel: 'Find a Contest', actionTo: '/contests' },
  wallet: { icon: Wallet, title: 'No transactions', message: 'Your transaction history is empty. Deposit funds or enter a contest to get started.', actionLabel: 'Deposit Funds', actionTo: '/profile/wallet' },
}

export default function StatesDemo() {
  const [viewState, setViewState] = useState<ViewState>('loading')
  const [demoPage, setDemoPage] = useState<DemoPage>('dashboard')

  const Skeleton = SKELETONS[demoPage]
  const empty = EMPTY_STATES[demoPage]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">UI States Demo</h1>
        <p className="text-text-secondary text-sm mt-1">Preview loading, empty, and error states for every page.</p>
      </div>

      {/* State type toggle */}
      <div className="flex items-center gap-1 p-1 bg-bg-card border border-border rounded-xl w-fit">
        {(['loading', 'empty', 'error'] as ViewState[]).map(state => (
          <button
            key={state}
            onClick={() => setViewState(state)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              viewState === state ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {state}
          </button>
        ))}
      </div>

      {/* Page selector */}
      {viewState !== 'error' && (
        <div className="flex items-center gap-2 flex-wrap">
          {DEMO_PAGES.map(p => (
            <button
              key={p.key}
              onClick={() => setDemoPage(p.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                demoPage === p.key ? 'bg-accent/15 text-accent-light border border-accent/20' : 'bg-bg-card text-text-tertiary border border-border hover:text-text-secondary'
              }`}
            >
              <p.icon className="w-3.5 h-3.5" /> {p.label}
            </button>
          ))}
        </div>
      )}

      {/* Rendered state */}
      <div className="bg-bg-secondary border border-border rounded-2xl p-5 min-h-[400px]">
        {viewState === 'loading' && <Skeleton />}
        {viewState === 'empty' && (
          <EmptyState icon={empty.icon} title={empty.title} message={empty.message} actionLabel={empty.actionLabel} actionTo={empty.actionTo} />
        )}
        {viewState === 'error' && (
          <ErrorState onRetry={() => alert('Retry clicked!')} />
        )}
      </div>
    </div>
  )
}
