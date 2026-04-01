import { useState, useEffect, useCallback, useRef } from 'react'

/* ─── Types ─── */
export type AnimationIntensity = 'full' | 'reduced' | 'off'

export type StatEventType = 'two' | 'three' | 'assist' | 'rebound' | 'steal' | 'block' | 'turnover'

export interface CourtPlayer {
  id: string
  name: string        // Full name — we'll show last name on chip
  team: string
  teamColor: string
  position: string    // PG, SG, SF, PF, C, UTIL
  fantasyPts: number
  isLive: boolean
  isMine: boolean     // true = my team, false = opponent
}

export interface StatEvent {
  playerId: string
  type: StatEventType
  points: number
  label: string      // "+3", "+2", "AST", "REB", etc.
}

/* ─── Position coordinates on half-court (percentage-based) ─── */
const POSITION_COORDS: Record<string, { my: { x: number; y: number }; opp: { x: number; y: number } }> = {
  PG:   { my: { x: 50, y: 18 }, opp: { x: 50, y: 82 } },
  SG:   { my: { x: 22, y: 30 }, opp: { x: 78, y: 70 } },
  SF:   { my: { x: 78, y: 30 }, opp: { x: 22, y: 70 } },
  PF:   { my: { x: 30, y: 50 }, opp: { x: 70, y: 50 } },
  C:    { my: { x: 50, y: 55 }, opp: { x: 50, y: 45 } },
  UTIL: { my: { x: 68, y: 50 }, opp: { x: 32, y: 50 } },
}

/* ─── Animation CSS (injected once) ─── */
const COURT_STYLES = `
@keyframes court-float-up {
  0% { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-32px) scale(0.8); }
}
@keyframes court-bounce {
  0%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
  60% { transform: translateY(-2px); }
}
@keyframes court-flash-green {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); }
  50% { box-shadow: 0 0 16px 4px rgba(16, 185, 129, 0.4); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}
@keyframes court-flash-red {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
  50% { box-shadow: 0 0 16px 4px rgba(239, 68, 68, 0.4); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}
@keyframes court-flash-blue {
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.6); }
  50% { box-shadow: 0 0 16px 4px rgba(59, 130, 246, 0.4); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}
@keyframes court-sparkle {
  0% { opacity: 1; transform: scale(0.5) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
  100% { opacity: 0; transform: scale(0.3) rotate(360deg); }
}
@keyframes court-pulse-live {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
`

/* ─── Event → Animation mapping ─── */
const EVENT_ANIMS: Record<StatEventType, {
  chipAnim: string
  chipDuration: number
  floatLabel: string
  floatColor: string
  sparkle?: boolean
}> = {
  two:      { chipAnim: 'court-flash-green', chipDuration: 300, floatLabel: '+2', floatColor: '#F9FAFB', },
  three:    { chipAnim: 'court-flash-blue', chipDuration: 300, floatLabel: '+3', floatColor: '#60A5FA', sparkle: true },
  assist:   { chipAnim: 'court-flash-green', chipDuration: 250, floatLabel: 'AST', floatColor: '#10B981' },
  rebound:  { chipAnim: 'court-bounce', chipDuration: 300, floatLabel: 'REB', floatColor: '#9CA3AF' },
  steal:    { chipAnim: 'court-flash-blue', chipDuration: 250, floatLabel: 'STL', floatColor: '#A78BFA' },
  block:    { chipAnim: 'court-flash-blue', chipDuration: 300, floatLabel: 'BLK', floatColor: '#F59E0B' },
  turnover: { chipAnim: 'court-flash-red', chipDuration: 250, floatLabel: 'TO', floatColor: '#EF4444' },
}

/* ─── Component ─── */
interface CourtViewProps {
  myPlayers: CourtPlayer[]
  oppPlayers: CourtPlayer[]
  intensity: AnimationIntensity
  onEvent?: (event: StatEvent) => void
}

export default function CourtView({ myPlayers, oppPlayers, intensity }: CourtViewProps) {
  const [activeAnims, setActiveAnims] = useState<Map<string, { type: StatEventType; id: number }>>(new Map())
  const [floats, setFloats] = useState<{ id: number; playerId: string; label: string; color: string; x: number; y: number; sparkle: boolean }[]>([])
  const floatIdRef = useRef(0)
  const styleInjectedRef = useRef(false)

  // Inject animation styles once
  useEffect(() => {
    if (styleInjectedRef.current) return
    const style = document.createElement('style')
    style.textContent = COURT_STYLES
    document.head.appendChild(style)
    styleInjectedRef.current = true
    return () => { document.head.removeChild(style) }
  }, [])

  // Trigger a stat event animation on a player
  const triggerEvent = useCallback((event: StatEvent) => {
    if (intensity === 'off') return

    const animConfig = EVENT_ANIMS[event.type]
    const animId = ++floatIdRef.current

    // Find player position
    const allPlayers = [...myPlayers, ...oppPlayers]
    const player = allPlayers.find(p => p.id === event.playerId)
    if (!player) return

    const pos = player.position in POSITION_COORDS ? player.position : 'UTIL'
    const coords = POSITION_COORDS[pos]
    const { x, y } = player.isMine ? coords.my : coords.opp

    // Chip animation
    setActiveAnims(prev => new Map(prev).set(event.playerId, { type: event.type, id: animId }))
    setTimeout(() => {
      setActiveAnims(prev => {
        const next = new Map(prev)
        if (next.get(event.playerId)?.id === animId) next.delete(event.playerId)
        return next
      })
    }, animConfig.chipDuration)

    // Float label (skip in reduced mode for minor events)
    if (intensity === 'reduced' && ['rebound', 'assist'].includes(event.type)) return

    setFloats(prev => [...prev, {
      id: animId,
      playerId: event.playerId,
      label: event.label || animConfig.floatLabel,
      color: animConfig.floatColor,
      x, y,
      sparkle: animConfig.sparkle && intensity === 'full',
    }])

    setTimeout(() => {
      setFloats(prev => prev.filter(f => f.id !== animId))
    }, 600)
  }, [intensity, myPlayers, oppPlayers])

  // Demo: auto-fire events every few seconds
  useEffect(() => {
    if (intensity === 'off') return
    const livePlayerIds = [...myPlayers, ...oppPlayers].filter(p => p.isLive).map(p => p.id)
    if (livePlayerIds.length === 0) return

    const eventTypes: StatEventType[] = ['two', 'three', 'assist', 'rebound', 'steal', 'block']
    const interval = setInterval(() => {
      const playerId = livePlayerIds[Math.floor(Math.random() * livePlayerIds.length)]
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)]
      const pts = type === 'three' ? 4.5 : type === 'two' ? 3 : type === 'assist' ? 1.5 : type === 'steal' ? 2 : type === 'block' ? 3 : 1.2
      triggerEvent({ playerId, type, points: pts, label: EVENT_ANIMS[type].floatLabel })
    }, 3000 + Math.random() * 2000)

    return () => clearInterval(interval)
  }, [intensity, myPlayers, oppPlayers, triggerEvent])

  const allPlayers = [...myPlayers.map(p => ({ ...p, isMine: true })), ...oppPlayers.map(p => ({ ...p, isMine: false }))]

  return (
    <div className="relative w-full" style={{ aspectRatio: '4 / 5' }}>
      {/* SVG Court */}
      <svg viewBox="0 0 400 500" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="courtGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width="400" height="500" fill="#0D1117" rx="16" />
        <rect width="400" height="500" fill="url(#courtGlow)" rx="16" />

        {/* Court outline */}
        <rect x="30" y="30" width="340" height="440" rx="4" fill="none" stroke="#3B82F6" strokeWidth="1.5" opacity="0.15" />

        {/* Half court line */}
        <line x1="30" y1="250" x2="370" y2="250" stroke="#3B82F6" strokeWidth="1" opacity="0.12" />

        {/* Center circle */}
        <circle cx="200" cy="250" r="50" fill="none" stroke="#3B82F6" strokeWidth="1" opacity="0.12" />
        <circle cx="200" cy="250" r="4" fill="#3B82F6" opacity="0.15" />

        {/* Top key (paint area) */}
        <rect x="130" y="30" width="140" height="140" rx="0" fill="none" stroke="#3B82F6" strokeWidth="1" opacity="0.1" />
        {/* Top free throw circle */}
        <circle cx="200" cy="170" r="50" fill="none" stroke="#3B82F6" strokeWidth="1" opacity="0.08" strokeDasharray="4 4" />
        {/* Top three-point arc */}
        <path d="M 60 30 L 60 120 Q 60 250 200 250 Q 340 250 340 120 L 340 30" fill="none" stroke="#3B82F6" strokeWidth="1" opacity="0.1" />
        {/* Top rim */}
        <circle cx="200" cy="60" r="8" fill="none" stroke="#3B82F6" strokeWidth="1.5" opacity="0.2" />
        {/* Top backboard */}
        <line x1="180" y1="45" x2="220" y2="45" stroke="#3B82F6" strokeWidth="2" opacity="0.15" />

        {/* Bottom key */}
        <rect x="130" y="330" width="140" height="140" rx="0" fill="none" stroke="#3B82F6" strokeWidth="1" opacity="0.1" />
        {/* Bottom free throw circle */}
        <circle cx="200" cy="330" r="50" fill="none" stroke="#3B82F6" strokeWidth="1" opacity="0.08" strokeDasharray="4 4" />
        {/* Bottom three-point arc */}
        <path d="M 60 470 L 60 380 Q 60 250 200 250 Q 340 250 340 380 L 340 470" fill="none" stroke="#3B82F6" strokeWidth="1" opacity="0.1" />
        {/* Bottom rim */}
        <circle cx="200" cy="440" r="8" fill="none" stroke="#3B82F6" strokeWidth="1.5" opacity="0.2" />
        {/* Bottom backboard */}
        <line x1="180" y1="455" x2="220" y2="455" stroke="#3B82F6" strokeWidth="2" opacity="0.15" />

        {/* "MY TEAM" / "OPPONENT" labels */}
        <text x="200" y="20" textAnchor="middle" fill="#3B82F6" fontSize="8" fontWeight="700" opacity="0.25" letterSpacing="3">YOUR TEAM</text>
        <text x="200" y="492" textAnchor="middle" fill="#EF4444" fontSize="8" fontWeight="700" opacity="0.2" letterSpacing="3">OPPONENT</text>
      </svg>

      {/* Player Chips */}
      {allPlayers.map(player => {
        const pos = player.position in POSITION_COORDS ? player.position : 'UTIL'
        const coords = POSITION_COORDS[pos]
        const { x, y } = player.isMine ? coords.my : coords.opp
        const lastName = player.name.split(' ').pop() || player.name
        const activeAnim = activeAnims.get(player.id)
        const animStyle = activeAnim && intensity !== 'off'
          ? { animation: `${EVENT_ANIMS[activeAnim.type].chipAnim} ${EVENT_ANIMS[activeAnim.type].chipDuration}ms ease-out` }
          : {}

        return (
          <div
            key={player.id}
            className="absolute flex flex-col items-center"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Chip */}
            <div
              className={`relative px-2.5 py-1.5 rounded-lg border text-center min-w-[64px] transition-shadow ${
                player.isMine
                  ? 'bg-bg-card/90 border-accent/25 backdrop-blur-sm'
                  : 'bg-bg-card/90 border-danger/20 backdrop-blur-sm'
              } ${player.isLive ? '' : 'opacity-50'}`}
              style={animStyle}
            >
              {/* Live pulse indicator */}
              {player.isLive && intensity !== 'off' && (
                <div
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: player.isMine ? '#3B82F6' : '#EF4444',
                    animation: 'court-pulse-live 2s ease-in-out infinite',
                  }}
                />
              )}

              {/* Team color bar */}
              <div
                className="absolute top-0 left-1.5 right-1.5 h-[2px] rounded-full"
                style={{ backgroundColor: player.teamColor }}
              />

              <div className="text-[10px] font-bold text-text-primary mt-0.5 leading-none truncate max-w-[70px]">
                {lastName}
              </div>
              <div className={`text-xs font-black mt-1 leading-none tabular-nums ${
                player.isMine ? 'text-accent-light' : 'text-danger'
              }`}>
                {player.fantasyPts > 0 ? player.fantasyPts : '—'}
              </div>
              <div className="text-[8px] text-text-tertiary mt-0.5 font-medium">{player.position}</div>
            </div>
          </div>
        )
      })}

      {/* Float-up labels */}
      {floats.map(f => (
        <div
          key={f.id}
          className="absolute pointer-events-none flex flex-col items-center"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            transform: 'translate(-50%, -100%)',
            marginTop: '-28px',
          }}
        >
          <span
            className="text-sm font-black"
            style={{
              color: f.color,
              animation: 'court-float-up 600ms ease-out forwards',
              textShadow: '0 1px 4px rgba(0,0,0,0.5)',
            }}
          >
            {f.label}
          </span>
          {f.sparkle && (
            <>
              <span
                className="absolute text-[8px]"
                style={{
                  top: '-2px',
                  left: '-8px',
                  animation: 'court-sparkle 400ms ease-out forwards',
                  animationDelay: '50ms',
                  color: f.color,
                }}
              >✦</span>
              <span
                className="absolute text-[8px]"
                style={{
                  top: '-4px',
                  right: '-6px',
                  animation: 'court-sparkle 400ms ease-out forwards',
                  animationDelay: '100ms',
                  color: f.color,
                }}
              >✦</span>
              <span
                className="absolute text-[6px]"
                style={{
                  bottom: '2px',
                  right: '-10px',
                  animation: 'court-sparkle 400ms ease-out forwards',
                  animationDelay: '150ms',
                  color: f.color,
                }}
              >✦</span>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
