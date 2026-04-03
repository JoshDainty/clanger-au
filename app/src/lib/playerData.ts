export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C'

export interface Player {
  id: string
  name: string
  team: string
  teamColor: string
  position: Position
  ppg: number
  rpg: number
  apg: number
  fgPct: number
  ftPct: number
  fantasyAvg: number
  salary: number // in thousands
  trending: 'up' | 'down' | 'stable'
}

export interface GameLog {
  date: string
  opponent: string
  result: string
  mins: number
  pts: number
  reb: number
  ast: number
  stl: number
  blk: number
  fgm: number
  fga: number
  fantasy: number
}

const TEAM_COLORS: Record<string, string> = {
  DAL: '#007DC5', MIN: '#236192', BOS: '#007A33', MIL: '#00471B',
  DEN: '#0E2240', LAL: '#552583', PHX: '#E56020', GSW: '#FFC72C',
  PHI: '#006BB6', MIA: '#98002E', MEM: '#5D76A9', SAC: '#5A2D81',
  OKC: '#007AC1', CLE: '#860038', ATL: '#E03A3E', NYK: '#F58426',
  CHI: '#CE1141', SAS: '#C4CED4', IND: '#002D62', ORL: '#0077C0',
  HOU: '#CE1141', NOP: '#0C2340', TOR: '#CE1141', POR: '#E03A3E',
  CHA: '#1D1160', DET: '#C8102E', BKN: '#000000', WAS: '#002B5C',
  UTA: '#002B5C', LAC: '#C8102E',
}

export const PLAYERS: Player[] = [
  { id: '1', name: 'Luka Dončić', team: 'DAL', teamColor: TEAM_COLORS.DAL, position: 'PG', ppg: 28.4, rpg: 8.8, apg: 9.1, fgPct: 48.2, ftPct: 78.5, fantasyAvg: 58.3, salary: 11200, trending: 'up' },
  { id: '2', name: 'Nikola Jokić', team: 'DEN', teamColor: TEAM_COLORS.DEN, position: 'C', ppg: 26.8, rpg: 12.4, apg: 9.2, fgPct: 58.3, ftPct: 81.2, fantasyAvg: 62.1, salary: 12000, trending: 'up' },
  { id: '3', name: 'Shai Gilgeous-Alexander', team: 'OKC', teamColor: TEAM_COLORS.OKC, position: 'PG', ppg: 31.2, rpg: 5.5, apg: 6.1, fgPct: 53.5, ftPct: 87.4, fantasyAvg: 52.8, salary: 10800, trending: 'up' },
  { id: '4', name: 'Jayson Tatum', team: 'BOS', teamColor: TEAM_COLORS.BOS, position: 'SF', ppg: 27.1, rpg: 8.1, apg: 4.6, fgPct: 47.1, ftPct: 85.3, fantasyAvg: 48.2, salary: 10200, trending: 'stable' },
  { id: '5', name: 'Anthony Edwards', team: 'MIN', teamColor: TEAM_COLORS.MIN, position: 'SG', ppg: 26.8, rpg: 5.8, apg: 5.2, fgPct: 46.3, ftPct: 82.1, fantasyAvg: 45.6, salary: 9800, trending: 'up' },
  { id: '6', name: 'Giannis Antetokounmpo', team: 'MIL', teamColor: TEAM_COLORS.MIL, position: 'PF', ppg: 31.5, rpg: 11.8, apg: 5.7, fgPct: 61.2, ftPct: 65.8, fantasyAvg: 59.4, salary: 11500, trending: 'up' },
  { id: '7', name: 'Victor Wembanyama', team: 'SAS', teamColor: TEAM_COLORS.SAS, position: 'C', ppg: 24.8, rpg: 10.5, apg: 3.8, fgPct: 47.8, ftPct: 80.2, fantasyAvg: 50.1, salary: 9500, trending: 'up' },
  { id: '8', name: 'LeBron James', team: 'LAL', teamColor: TEAM_COLORS.LAL, position: 'SF', ppg: 24.2, rpg: 7.1, apg: 8.3, fgPct: 54.0, ftPct: 75.0, fantasyAvg: 47.8, salary: 9200, trending: 'stable' },
  { id: '9', name: 'Kevin Durant', team: 'PHX', teamColor: TEAM_COLORS.PHX, position: 'SF', ppg: 26.4, rpg: 6.5, apg: 5.2, fgPct: 52.1, ftPct: 89.2, fantasyAvg: 44.9, salary: 9600, trending: 'down' },
  { id: '10', name: 'Stephen Curry', team: 'GSW', teamColor: TEAM_COLORS.GSW, position: 'PG', ppg: 25.1, rpg: 4.5, apg: 6.3, fgPct: 45.8, ftPct: 92.1, fantasyAvg: 42.3, salary: 9400, trending: 'stable' },
  { id: '11', name: 'Joel Embiid', team: 'PHI', teamColor: TEAM_COLORS.PHI, position: 'C', ppg: 27.3, rpg: 11.1, apg: 3.6, fgPct: 52.4, ftPct: 86.7, fantasyAvg: 51.2, salary: 10400, trending: 'down' },
  { id: '12', name: 'Jalen Brunson', team: 'NYK', teamColor: TEAM_COLORS.NYK, position: 'PG', ppg: 24.6, rpg: 3.5, apg: 6.8, fgPct: 48.0, ftPct: 84.9, fantasyAvg: 40.1, salary: 8600, trending: 'up' },
  { id: '13', name: 'Jaylen Brown', team: 'BOS', teamColor: TEAM_COLORS.BOS, position: 'SG', ppg: 23.1, rpg: 5.4, apg: 3.6, fgPct: 49.2, ftPct: 76.3, fantasyAvg: 37.2, salary: 8200, trending: 'stable' },
  { id: '14', name: 'Tyrese Haliburton', team: 'IND', teamColor: TEAM_COLORS.IND, position: 'PG', ppg: 20.8, rpg: 3.9, apg: 10.4, fgPct: 47.2, ftPct: 86.1, fantasyAvg: 43.8, salary: 8800, trending: 'up' },
  { id: '15', name: 'Donovan Mitchell', team: 'CLE', teamColor: TEAM_COLORS.CLE, position: 'SG', ppg: 24.0, rpg: 4.1, apg: 4.5, fgPct: 46.8, ftPct: 85.7, fantasyAvg: 38.4, salary: 8400, trending: 'stable' },
  { id: '16', name: 'Devin Booker', team: 'PHX', teamColor: TEAM_COLORS.PHX, position: 'SG', ppg: 25.2, rpg: 4.5, apg: 5.8, fgPct: 49.1, ftPct: 87.8, fantasyAvg: 41.5, salary: 8900, trending: 'up' },
  { id: '17', name: 'Trae Young', team: 'ATL', teamColor: TEAM_COLORS.ATL, position: 'PG', ppg: 25.8, rpg: 3.0, apg: 10.8, fgPct: 43.2, ftPct: 88.5, fantasyAvg: 44.2, salary: 9000, trending: 'stable' },
  { id: '18', name: 'Ja Morant', team: 'MEM', teamColor: TEAM_COLORS.MEM, position: 'PG', ppg: 22.4, rpg: 4.8, apg: 8.1, fgPct: 47.5, ftPct: 75.2, fantasyAvg: 41.0, salary: 8500, trending: 'up' },
  { id: '19', name: 'De\'Aaron Fox', team: 'SAC', teamColor: TEAM_COLORS.SAC, position: 'PG', ppg: 24.1, rpg: 4.2, apg: 6.0, fgPct: 47.8, ftPct: 74.8, fantasyAvg: 39.8, salary: 8300, trending: 'stable' },
  { id: '20', name: 'Bam Adebayo', team: 'MIA', teamColor: TEAM_COLORS.MIA, position: 'C', ppg: 19.8, rpg: 10.4, apg: 3.9, fgPct: 54.2, ftPct: 80.1, fantasyAvg: 40.5, salary: 8100, trending: 'stable' },
  { id: '21', name: 'Domantas Sabonis', team: 'SAC', teamColor: TEAM_COLORS.SAC, position: 'PF', ppg: 19.2, rpg: 13.1, apg: 7.2, fgPct: 60.1, ftPct: 73.5, fantasyAvg: 48.6, salary: 9100, trending: 'up' },
  { id: '22', name: 'Jimmy Butler', team: 'MIA', teamColor: TEAM_COLORS.MIA, position: 'SF', ppg: 20.1, rpg: 5.8, apg: 5.0, fgPct: 49.8, ftPct: 86.4, fantasyAvg: 36.8, salary: 7800, trending: 'down' },
  { id: '23', name: 'Chet Holmgren', team: 'OKC', teamColor: TEAM_COLORS.OKC, position: 'PF', ppg: 17.5, rpg: 8.2, apg: 2.8, fgPct: 53.1, ftPct: 79.4, fantasyAvg: 35.2, salary: 7200, trending: 'up' },
  { id: '24', name: 'Paolo Banchero', team: 'ORL', teamColor: TEAM_COLORS.ORL, position: 'PF', ppg: 22.8, rpg: 6.9, apg: 5.1, fgPct: 46.5, ftPct: 73.8, fantasyAvg: 40.8, salary: 8200, trending: 'up' },
  { id: '25', name: 'Scottie Barnes', team: 'TOR', teamColor: TEAM_COLORS.TOR, position: 'SF', ppg: 20.2, rpg: 7.5, apg: 5.8, fgPct: 48.1, ftPct: 77.2, fantasyAvg: 40.1, salary: 7900, trending: 'up' },
  { id: '26', name: 'Zion Williamson', team: 'NOP', teamColor: TEAM_COLORS.NOP, position: 'PF', ppg: 22.1, rpg: 5.8, apg: 5.0, fgPct: 60.4, ftPct: 71.2, fantasyAvg: 38.2, salary: 7600, trending: 'down' },
  { id: '27', name: 'Damian Lillard', team: 'MIL', teamColor: TEAM_COLORS.MIL, position: 'PG', ppg: 24.8, rpg: 4.2, apg: 7.2, fgPct: 44.5, ftPct: 91.8, fantasyAvg: 42.0, salary: 8700, trending: 'stable' },
  { id: '28', name: 'Karl-Anthony Towns', team: 'NYK', teamColor: TEAM_COLORS.NYK, position: 'C', ppg: 22.5, rpg: 9.8, apg: 3.1, fgPct: 50.8, ftPct: 84.2, fantasyAvg: 41.8, salary: 8400, trending: 'stable' },
  { id: '29', name: 'Lauri Markkanen', team: 'UTA', teamColor: TEAM_COLORS.UTA, position: 'PF', ppg: 23.2, rpg: 8.1, apg: 2.0, fgPct: 48.5, ftPct: 88.4, fantasyAvg: 37.5, salary: 7500, trending: 'down' },
  { id: '30', name: 'Tyrese Maxey', team: 'PHI', teamColor: TEAM_COLORS.PHI, position: 'SG', ppg: 22.5, rpg: 3.4, apg: 5.5, fgPct: 45.2, ftPct: 86.8, fantasyAvg: 36.2, salary: 7400, trending: 'up' },
  { id: '31', name: 'Franz Wagner', team: 'ORL', teamColor: TEAM_COLORS.ORL, position: 'SF', ppg: 21.4, rpg: 5.8, apg: 5.2, fgPct: 47.8, ftPct: 85.1, fantasyAvg: 38.0, salary: 7600, trending: 'up' },
  { id: '32', name: 'Alperen Şengün', team: 'HOU', teamColor: TEAM_COLORS.HOU, position: 'C', ppg: 19.2, rpg: 9.2, apg: 5.0, fgPct: 54.5, ftPct: 72.8, fantasyAvg: 40.2, salary: 7800, trending: 'up' },
]

export function getPlayer(id: string): Player | undefined {
  return PLAYERS.find(p => p.id === id)
}

export function getGameLog(id: string): GameLog[] {
  const player = getPlayer(id)
  if (!player) return []

  const opponents = ['DAL', 'BOS', 'MIL', 'DEN', 'LAL', 'PHX', 'GSW', 'MIA', 'MIN', 'OKC']
  const results = ['W', 'L']

  return Array.from({ length: 10 }, (_, i) => {
    const base = player.ppg
    const pts = Math.round(base + (Math.random() - 0.5) * 16)
    const reb = Math.round(player.rpg + (Math.random() - 0.5) * 6)
    const ast = Math.round(player.apg + (Math.random() - 0.5) * 5)
    const fga = Math.round(12 + Math.random() * 12)
    const fgm = Math.round(fga * (player.fgPct / 100) + (Math.random() - 0.5) * 3)
    const result = results[Math.floor(Math.random() * 2)]
    const oppScore = Math.round(95 + Math.random() * 25)
    const teamScore = result === 'W' ? oppScore + Math.round(Math.random() * 15 + 1) : oppScore - Math.round(Math.random() * 12 + 1)

    return {
      date: `Mar ${25 - i}`,
      opponent: opponents.filter(o => o !== player.team)[i % (opponents.length - 1)],
      result: `${result} ${teamScore}-${oppScore}`,
      mins: Math.round(30 + Math.random() * 10),
      pts: Math.max(pts, 2),
      reb: Math.max(reb, 0),
      ast: Math.max(ast, 0),
      stl: Math.round(Math.random() * 3),
      blk: Math.round(Math.random() * 2),
      fgm: Math.max(fgm, 1),
      fga: Math.max(fga, fgm + 1),
      fantasy: Math.round((pts * 1 + reb * 1.2 + ast * 1.5 + Math.random() * 4) * 10) / 10,
    }
  })
}

export const ALL_TEAMS = [...new Set(PLAYERS.map(p => p.team))].sort()
export const POSITIONS: Position[] = ['PG', 'SG', 'SF', 'PF', 'C']
