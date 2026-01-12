import { useMemo } from 'react'
import '../styles/UVA.css'

const allGames = [
  // Previous games
  {
    id: 1,
    opponent: 'VMI',
    date: new Date(2025, 11, 10, 19, 0),
    location: 'home',
    note: 'Non-Conference',
    result: { score: '73-52', won: true }
  },
  {
    id: 2,
    opponent: 'Winthrop',
    date: new Date(2025, 11, 3, 18, 0),
    location: 'home',
    note: 'Non-Conference',
    result: { score: '68-61', won: true }
  },
  {
    id: 3,
    opponent: 'William & Mary',
    date: new Date(2025, 10, 26, 19, 0),
    location: 'home',
    note: 'Non-Conference',
    result: { score: '71-58', won: true }
  },
  // Upcoming games
  {
    id: 4,
    opponent: 'Duke',
    date: new Date(2026, 0, 15, 19, 0),
    location: 'home',
    note: 'ACC Game',
  },
  {
    id: 5,
    opponent: 'UNC',
    date: new Date(2026, 0, 22, 18, 0),
    location: 'away',
    note: 'Rivalry Game',
  },
  {
    id: 6,
    opponent: 'Virginia Tech',
    date: new Date(2026, 0, 29, 19, 30),
    location: 'home',
    note: 'ACC Game',
  },
  {
    id: 7,
    opponent: 'Wake Forest',
    date: new Date(2026, 1, 5, 18, 0),
    location: 'away',
    note: '',
  },
]

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export default function UVA() {
  const now = new Date()
  
  const { previousGames, upcomingGames } = useMemo(() => {
    const previous = allGames.filter(g => g.date < now).sort((a, b) => b.date.getTime() - a.date.getTime())
    const upcoming = allGames.filter(g => g.date >= now)
    return { previousGames: previous, upcomingGames: upcoming }
  }, [])

  return (
    <div className="uva-container">
      <h2>🏀 UVA Basketball</h2>
      
      <div className="uva-columns">
        {/* Left Column - Upcoming Games */}
        <div className="uva-column">
          <p className="column-subtitle">Upcoming Games</p>
          <div className="games-list">
            {upcomingGames.length > 0 ? (
              upcomingGames.map(game => (
                <div key={game.id} className="game-card">
                  <div className="game-date">
                    {formatDate(game.date)}
                  </div>
                  <div className="game-info">
                    <div className="opponent">vs {game.opponent}</div>
                    <div className={`location ${game.location}`}>
                      {game.location === 'home' ? 'HOME' : 'AWAY'}
                    </div>
                  </div>
                  {game.note && <div className="game-note">{game.note}</div>}
                </div>
              ))
            ) : (
              <p className="no-games">No upcoming games</p>
            )}
          </div>
        </div>

        {/* Right Column - Previous Games */}
        <div className="uva-column">
          <p className="column-subtitle">Game Results</p>
          <div className="games-list">
            {previousGames.length > 0 ? (
              previousGames.map(game => (
                <div key={game.id} className="game-card previous">
                  <div className="game-date">
                    {formatDate(game.date)}
                  </div>
                  <div className="game-info">
                    <div className="opponent">vs {game.opponent}</div>
                    <div className={`location ${game.location}`}>
                      {game.location === 'home' ? 'HOME' : 'AWAY'}
                    </div>
                  </div>
                  {game.note && <div className="game-note">{game.note}</div>}
                  {game.result && (
                    <div className={`game-result ${game.result.won ? 'won' : 'lost'}`}>
                      {game.result.score} {game.result.won ? 'W' : 'L'}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="no-games">No game results</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
