import '../styles/OrchardHouse.css'

const teams = [
  {
    id: 1,
    name: 'Team A',
    wins: 12,
    losses: 3,
    nextGame: new Date(2026, 0, 15, 19, 0),
  },
  {
    id: 2,
    name: 'Team B',
    wins: 10,
    losses: 5,
    nextGame: new Date(2026, 0, 18, 18, 30),
  },
  {
    id: 3,
    name: 'Team C',
    wins: 8,
    losses: 7,
    nextGame: new Date(2026, 0, 22, 19, 30),
  },
  {
    id: 4,
    name: 'Team D',
    wins: 9,
    losses: 6,
    nextGame: new Date(2026, 0, 25, 17, 0),
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

export default function OrchardHouse() {
  return (
    <div className="orchard-container">
      <h2>🏀 Orchard House Basketball</h2>
      <p className="subtitle">Intramural Teams & Standings</p>

      <div className="teams-list">
        {teams.map(team => (
          <div key={team.id} className="team-card">
            <div className="team-header">
              <h3>{team.name}</h3>
              <div className="record">{team.wins}W - {team.losses}L</div>
            </div>
            <div className="next-game">
              <span className="label">Next Game:</span>
              <span className="time">{formatDate(team.nextGame)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
