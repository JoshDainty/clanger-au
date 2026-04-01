import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Trophy,
  Users,
  UserCircle,
  Shirt,
  Search,
  Bell,
  MessageSquare,
  Settings,
  Wallet,
  LogOut,
  X,
} from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'
import { useState } from 'react'

const mainNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/contests', label: 'Contests', icon: Trophy },
  { to: '/leagues', label: 'Leagues', icon: Users },
  { to: '/players', label: 'Players', icon: Shirt },
  { to: '/profile', label: 'Profile', icon: UserCircle },
]

const secondaryNav = [
  { to: '/chat', label: 'Messages', icon: MessageSquare },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile/wallet', label: 'Wallet', icon: Wallet },
  { to: '/profile/settings', label: 'Settings', icon: Settings },
]

function SidebarLink({ to, label, icon: Icon }: { to: string; label: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-accent/10 text-accent-light border border-accent/15'
            : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.03] border border-transparent'
        }`
      }
    >
      <Icon className="w-[18px] h-[18px] flex-shrink-0" />
      <span>{label}</span>
    </NavLink>
  )
}

function Sidebar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const initials = user?.email?.slice(0, 2).toUpperCase() || 'JD'
  const displayEmail = user?.email || 'player@clanger.au'

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-60 flex-col bg-bg-secondary border-r border-border z-40">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-border">
        <NavLink to="/dashboard" className="flex items-center gap-1">
          <span className="text-lg font-black text-text-primary tracking-tight">CLANGER</span>
          <span className="text-sm font-bold text-text-tertiary">.au</span>
        </NavLink>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest px-3 mb-2">Main</div>
        {mainNav.map((item) => (
          <SidebarLink key={item.to} {...item} />
        ))}

        <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest px-3 mt-6 mb-2">Account</div>
        {secondaryNav.map((item) => (
          <SidebarLink key={item.to} {...item} />
        ))}
      </nav>

      {/* User card at bottom */}
      <div className="p-3 border-t border-border space-y-1.5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-bg-card border border-border">
          <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center text-xs font-bold text-accent-light">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-text-primary truncate">{displayEmail}</div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-text-tertiary hover:text-danger hover:bg-danger/5 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}

function TopBar({ onSearchOpen }: { onSearchOpen: () => void }) {
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-60 h-16 bg-bg-secondary/80 backdrop-blur-xl border-b border-border z-30 flex items-center px-4 lg:px-6 gap-3">
      {/* Mobile logo */}
      <div className="lg:hidden flex items-center gap-1 mr-auto">
        <span className="text-lg font-black text-text-primary tracking-tight">CLANGER</span>
        <span className="text-sm font-bold text-text-tertiary">.au</span>
      </div>

      {/* Search — desktop */}
      <button
        onClick={onSearchOpen}
        className="hidden lg:flex items-center gap-2 h-9 px-3 bg-bg-card border border-border rounded-lg text-sm text-text-tertiary hover:border-accent/25 transition-colors mr-auto cursor-pointer"
      >
        <Search className="w-4 h-4" />
        <span>Search players, contests...</span>
        <kbd className="ml-8 text-[10px] font-medium bg-bg-secondary border border-border rounded px-1.5 py-0.5">⌘K</kbd>
      </button>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onSearchOpen}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>

        <NavLink
          to="/notifications"
          className="relative w-10 h-10 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full" />
        </NavLink>

        <NavLink
          to="/profile"
          className="hidden lg:flex w-10 h-10 items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center text-xs font-bold text-accent-light">
            JD
          </div>
        </NavLink>
      </div>
    </header>
  )
}

function BottomTabs() {
  const location = useLocation()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-bg-secondary/95 backdrop-blur-xl border-t border-border z-40 flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
      {mainNav.map((item) => {
        const isActive = location.pathname.startsWith(item.to)
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex flex-col items-center justify-center gap-1 w-16 py-2"
          >
            <item.icon
              className={`w-5 h-5 transition-colors ${
                isActive ? 'text-accent-light' : 'text-text-tertiary'
              }`}
            />
            <span
              className={`text-[10px] font-medium transition-colors ${
                isActive ? 'text-accent-light' : 'text-text-tertiary'
              }`}
            >
              {item.label}
            </span>
            {isActive && (
              <div className="absolute bottom-0 w-8 h-0.5 bg-accent rounded-full" />
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}

function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm overlay-enter" />
      <div
        className="relative w-full max-w-lg mx-4 bg-bg-card border border-border rounded-xl shadow-2xl overflow-hidden modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 h-12 border-b border-border">
          <Search className="w-4 h-4 text-text-tertiary flex-shrink-0" />
          <input
            autoFocus
            type="text"
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none"
            placeholder="Search players, contests, leagues..."
          />
          <button onClick={onClose} className="text-text-tertiary hover:text-text-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 text-center text-sm text-text-tertiary">
          Start typing to search...
        </div>
      </div>
    </div>
  )
}

export default function Layout() {
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-svh bg-bg-primary">
      <Sidebar />
      <TopBar onSearchOpen={() => setSearchOpen(true)} />

      <main className="pt-16 pb-[72px] lg:pb-0 lg:pl-60 min-h-svh">
        <div className="p-4 lg:p-6 max-w-6xl page-enter" key={location.pathname}>
          <Outlet />
        </div>
      </main>

      <BottomTabs />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
