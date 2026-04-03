import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { getPlayer, getGameLog } from '@/lib/playerData'

export default function PlayerDetail() {
  const { id } = useParams()
  const player = getPlayer(id || '')
  const gameLog = getGameLog(id || '')

  if (!player) {
    return (
      <div className="py-20 text-center">
        <p className="text-text-tertiary">Player not found.</p>
        <Link to="/players" className="text-accent text-sm mt-2 inline-block">Back to players</Link>
      </div>
    )
  }

  const initials = player.name.split(' ').map(n => n[0]).join('')
  const TrendIcon = player.trending === 'up' ? TrendingUp : player.trending === 'down' ? TrendingDown : Minus
  const trendColor = player.trending === 'up' ? 'text-success' : player.trending === 'down' ? 'text-danger' : 'text-text-tertiary'

  const statCards = [
    { label: 'PPG', value: player.ppg, highlight: false },
    { label: 'RPG', value: player.rpg, highlight: false },
    { label: 'APG', value: player.apg, highlight: false },
    { label: 'FG%', value: player.fgPct, highlight: false },
    { label: 'FT%', value: player.ftPct, highlight: false },
    { label: 'Fantasy Avg', value: player.fantasyAvg, highlight: true },
  ]

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link to="/players" className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-text-secondary transition-colors">
        <ArrowLeft className="w-4 h-4" /> All Players
      </Link>

      {/* Player Header */}
      <div className="flex items-center gap-5">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-2 flex-shrink-0"
          style={{ backgroundColor: player.teamColor + '25', borderColor: player.teamColor + '50', color: player.teamColor }}
        >
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{player.name}</h1>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: player.teamColor + '18', color: player.teamColor }}>{player.team}</span>
            <span className="text-xs font-bold text-text-tertiary bg-bg-elevated px-2 py-0.5 rounded">{player.position}</span>
            <span className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
              <TrendIcon className="w-3 h-3" /> {player.trending === 'up' ? 'Trending up' : player.trending === 'down' ? 'Trending down' : 'Stable'}
            </span>
            <span className="text-xs text-text-tertiary">${(player.salary / 1000).toFixed(1)}K salary</span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map(s => (
          <div key={s.label} className={`rounded-xl p-3 border text-center ${s.highlight ? 'bg-accent/[0.06] border-accent/15' : 'bg-bg-card border-border'}`}>
            <div className={`text-xl font-bold ${s.highlight ? 'text-accent-light' : 'text-text-primary'}`}>{s.value}</div>
            <div className="text-[10px] text-text-tertiary uppercase tracking-wider mt-1 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Game Log */}
      <div>
        <h2 className="text-base font-bold text-text-primary mb-3">Recent Games</h2>
        <div className="bg-bg-card border border-border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-[10px] text-text-tertiary uppercase tracking-wider">
                <th className="text-left px-4 py-2.5 font-medium">Date</th>
                <th className="text-left px-3 py-2.5 font-medium">Opp</th>
                <th className="text-left px-3 py-2.5 font-medium hidden sm:table-cell">Result</th>
                <th className="text-right px-3 py-2.5 font-medium hidden sm:table-cell">MIN</th>
                <th className="text-right px-3 py-2.5 font-medium">PTS</th>
                <th className="text-right px-3 py-2.5 font-medium">REB</th>
                <th className="text-right px-3 py-2.5 font-medium">AST</th>
                <th className="text-right px-3 py-2.5 font-medium hidden md:table-cell">STL</th>
                <th className="text-right px-3 py-2.5 font-medium hidden md:table-cell">BLK</th>
                <th className="text-right px-3 py-2.5 font-medium hidden sm:table-cell">FG</th>
                <th className="text-right px-4 py-2.5 font-medium text-accent-light">FPTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {gameLog.map((game, i) => {
                const isWin = game.result.startsWith('W')
                return (
                  <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-4 py-2.5 text-text-secondary font-medium">{game.date}</td>
                    <td className="px-3 py-2.5 text-text-secondary">{game.opponent}</td>
                    <td className={`px-3 py-2.5 hidden sm:table-cell font-medium ${isWin ? 'text-success' : 'text-danger'}`}>{game.result}</td>
                    <td className="px-3 py-2.5 text-right text-text-tertiary hidden sm:table-cell">{game.mins}</td>
                    <td className="px-3 py-2.5 text-right text-text-primary font-semibold">{game.pts}</td>
                    <td className="px-3 py-2.5 text-right text-text-secondary">{game.reb}</td>
                    <td className="px-3 py-2.5 text-right text-text-secondary">{game.ast}</td>
                    <td className="px-3 py-2.5 text-right text-text-tertiary hidden md:table-cell">{game.stl}</td>
                    <td className="px-3 py-2.5 text-right text-text-tertiary hidden md:table-cell">{game.blk}</td>
                    <td className="px-3 py-2.5 text-right text-text-tertiary hidden sm:table-cell">{game.fgm}/{game.fga}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-accent-light">{game.fantasy}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
