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

/* ─── Position coordinates — spread across each half with room for large chips ─── */
const POSITION_COORDS: Record<string, { my: { x: number; y: number }; opp: { x: number; y: number } }> = {
  PG:   { my: { x: 50, y: 43 }, opp: { x: 50, y: 57 } },
  SG:   { my: { x: 20, y: 35 }, opp: { x: 80, y: 65 } },
  SF:   { my: { x: 80, y: 35 }, opp: { x: 20, y: 65 } },
  PF:   { my: { x: 28, y: 22 }, opp: { x: 72, y: 78 } },
  C:    { my: { x: 50, y: 13 }, opp: { x: 50, y: 87 } },
  UTIL: { my: { x: 72, y: 22 }, opp: { x: 28, y: 78 } },
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
      sparkle: !!(animConfig.sparkle && intensity === 'full'),
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
      <svg viewBox="58 -4 284 508" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="courtGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#EC4899" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect width="400" height="500" fill="#0D1117" rx="16" />
        <rect width="400" height="500" fill="url(#courtGlow)" rx="16" />

        {/*
          COURT GEOMETRY — uniform 5px/ft scale so all arcs are true circles
          Court area: x=75–325 (250px=50ft wide), y=15–485 (470px=94ft long)
          Each half 235px = 47ft

          Top half (baseline y=15):
            Basket centre y = 15 + 4×5 = 35
            Key: x=160–240 (80px=16ft), y=15–110 (95px=19ft)
            FT line y=110, FT circle r=30px (6ft)
            3pt corners x=90 & x=310 (110px=22ft from basket, 3ft from sideline ✓)
            3pt corner y = 35 + √(119²−110²) ≈ 80
            3pt arc r=119px (23.75ft), peak y=154  →  96px gap to half-court line ✓
        */}

        {/* Court outline */}
        <rect x="75" y="15" width="250" height="470" rx="3" fill="none" stroke="#EC4899" strokeWidth="1.5" opacity="0.2" />

        {/* Paint fills */}
        <rect x="160" y="15" width="80" height="98" fill="#3B82F6" fillOpacity="0.04" />
        <rect x="160" y="387" width="80" height="98" fill="#EF4444" fillOpacity="0.03" />

        {/* Half-court line */}
        <line x1="75" y1="250" x2="325" y2="250" stroke="#EC4899" strokeWidth="1" opacity="0.16" />

        {/* Centre circle — compensated for 1.431x horizontal stretch: rx=30/1.431=21 */}
        <ellipse cx="200" cy="250" rx="21" ry="30" fill="none" stroke="#EC4899" strokeWidth="1" opacity="0.16" />
        <ellipse cx="200" cy="250" rx="2.1" ry="3" fill="#EC4899" opacity="0.22" />

        {/* ── TOP HALF — YOUR TEAM ── */}

        {/* Backboard — 6ft wide line just behind baseline */}
        <line x1="185" y1="18" x2="215" y2="18" stroke="#EC4899" strokeWidth="3" opacity="0.4" />

        {/* Rim — rx=9/1.431=6.3 */}
        <ellipse cx="200" cy="35" rx="6.3" ry="9" fill="none" stroke="#EC4899" strokeWidth="1.5" opacity="0.5" />

        {/* Restricted-area arc — rx=20/1.431=14, endpoints at 200±14=186,214 */}
        <path d="M 186 35 A 14 20 0 0 0 214 35" fill="none" stroke="#EC4899" strokeWidth="1" opacity="0.25" />

        {/* Key / paint outline — height matches FT line at y=113 */}
        <rect x="160" y="15" width="80" height="98" fill="none" stroke="#EC4899" strokeWidth="1" opacity="0.18" />

        {/* Lane hash marks — left */}
        <line x1="153" y1="60" x2="160" y2="60" stroke="#EC4899" strokeWidth="1.5" opacity="0.16" />
        <line x1="153" y1="79" x2="160" y2="79" stroke="#EC4899" strokeWidth="1.5" opacity="0.16" />
        <line x1="153" y1="98" x2="160" y2="98" stroke="#EC4899" strokeWidth="1.5" opacity="0.16" />

        {/* Lane hash marks — right */}
        <line x1="240" y1="60" x2="247" y2="60" stroke="#EC4899" strokeWidth="1.5" opacity="0.16" />
        <line x1="240" y1="79" x2="247" y2="79" stroke="#EC4899" strokeWidth="1.5" opacity="0.16" />
        <line x1="240" y1="98" x2="247" y2="98" stroke="#EC4899" strokeWidth="1.5" opacity="0.16" />

        {/* FT circle — rx=21, endpoints at 200±21=179,221 */}
        <path d="M 179 113 A 21 30 0 0 0 221 113" fill="none" stroke="#EC4899" strokeWidth="1" opacity="0.2" />
        <path d="M 221 113 A 21 30 0 0 0 179 113" fill="none" stroke="#EC4899" strokeWidth="1" opacity="0.1" strokeDasharray="5 4" />

        {/* Three-point line — corners extend to y=113, arc peaks at y=187 (halfway to centre circle edge) */}
        <path d="M 90 15 L 90 113 A 119 119 0 0 0 310 113 L 310 15"
              fill="none" stroke="#EC4899" strokeWidth="1.2" opacity="0.25" />

        {/* ── BOTTOM HALF — OPPONENT ── */}

        {/* Backboard */}
        <line x1="185" y1="482" x2="215" y2="482" stroke="#EC4899" strokeWidth="3" opacity="0.25" />

        {/* Rim — rx=6.3 */}
        <ellipse cx="200" cy="465" rx="6.3" ry="9" fill="none" stroke="#EC4899" strokeWidth="1.5" opacity="0.3" />

        {/* Restricted-area arc — endpoints at 200±14=186,214 */}
        <path d="M 214 465 A 14 20 0 0 0 186 465" fill="none" stroke="#EC4899" strokeWidth="1" opacity="0.16" />

        {/* Key / paint outline — height matches FT line at y=387 */}
        <rect x="160" y="387" width="80" height="98" fill="none" stroke="#EC4899" strokeWidth="1" opacity="0.14" />

        {/* Lane hash marks — left */}
        <line x1="153" y1="440" x2="160" y2="440" stroke="#EC4899" strokeWidth="1.5" opacity="0.12" />
        <line x1="153" y1="421" x2="160" y2="421" stroke="#EC4899" strokeWidth="1.5" opacity="0.12" />
        <line x1="153" y1="402" x2="160" y2="402" stroke="#EC4899" strokeWidth="1.5" opacity="0.12" />

        {/* Lane hash marks — right */}
        <line x1="240" y1="440" x2="247" y2="440" stroke="#EC4899" strokeWidth="1.5" opacity="0.12" />
        <line x1="240" y1="421" x2="247" y2="421" stroke="#EC4899" strokeWidth="1.5" opacity="0.12" />
        <line x1="240" y1="402" x2="247" y2="402" stroke="#EC4899" strokeWidth="1.5" opacity="0.12" />

        {/* FT circle — rx=21, endpoints at 179,221 */}
        <path d="M 179 387 A 21 30 0 0 1 221 387" fill="none" stroke="#EC4899" strokeWidth="1" opacity="0.15" />
        <path d="M 221 387 A 21 30 0 0 1 179 387" fill="none" stroke="#EC4899" strokeWidth="1" opacity="0.08" strokeDasharray="5 4" />

        {/* Three-point line — corners extend to y=387, arc peaks at y=313 (halfway to centre circle edge) */}
        <path d="M 90 485 L 90 387 A 119 119 0 0 1 310 387 L 310 485"
              fill="none" stroke="#EC4899" strokeWidth="1.2" opacity="0.18" />

        {/* Labels */}
        <text x="200" y="9" textAnchor="middle" fill="#3B82F6" fontSize="7" fontWeight="700" opacity="0.45" letterSpacing="3">YOUR TEAM</text>
        <text x="200" y="497" textAnchor="middle" fill="#EF4444" fontSize="7" fontWeight="700" opacity="0.3" letterSpacing="3">OPPONENT</text>
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
              className={`relative px-4 py-2.5 rounded-xl border text-center min-w-[88px] transition-shadow ${
                player.isMine
                  ? 'bg-bg-card/95 border-accent/35 backdrop-blur-sm'
                  : 'bg-bg-card/95 border-danger/30 backdrop-blur-sm'
              } ${player.isLive ? '' : 'opacity-50'}`}
              style={animStyle}
            >
              {/* Live pulse indicator */}
              {player.isLive && intensity !== 'off' && (
                <div
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: player.isMine ? '#3B82F6' : '#EF4444',
                    animation: 'court-pulse-live 2s ease-in-out infinite',
                  }}
                />
              )}

              {/* Team color bar */}
              <div
                className="absolute top-0 left-2 right-2 h-[3px] rounded-full"
                style={{ backgroundColor: player.teamColor }}
              />

              <div className="text-xs font-bold text-text-primary mt-1 leading-none truncate max-w-[90px]">
                {lastName}
              </div>
              <div className={`text-base font-black mt-1.5 leading-none tabular-nums ${
                player.isMine ? 'text-accent-light' : 'text-danger'
              }`}>
                {player.fantasyPts > 0 ? player.fantasyPts : '—'}
              </div>
              <div className="text-[10px] text-text-tertiary mt-1 font-medium">{player.position}</div>
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
