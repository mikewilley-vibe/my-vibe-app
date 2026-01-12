import '../styles/screens.css';

// Full schedule from orchard-house-basketball
interface Game {
  id: number;
  date: string;
  time: string;
  opponent: string;
  venue: string;
  isHome: boolean;
  jersey?: string;
  directionsUrl?: string;
  result?: { score: string; won: boolean };
}

const SCHEDULE: Game[] = [
  {
    id: 1,
    date: "Sat 12/13",
    time: "6:00 PM",
    opponent: "St Bridget's",
    venue: "Benedictine",
    isHome: true,
    jersey: "Purple",
    directionsUrl: "https://maps.google.com/?q=Benedictine+College+Prep+Richmond+VA",
    result: { score: "22-15", won: true },
  },
  {
    id: 2,
    date: "Tue 12/16",
    time: "5:00 PM",
    opponent: "Our Lady of Lourdes",
    venue: "Our Lady of Lourdes",
    isHome: false,
    jersey: "White",
    directionsUrl: "https://maps.google.com/?q=Our+Lady+of+Lourdes+Catholic+School+Richmond+VA",
    result: { score: "12-11", won: false },
  },
  {
    id: 3,
    date: "Sat 1/10",
    time: "2:30 PM",
    opponent: "St Benedict's",
    venue: "Our Lady of Lourdes",
    isHome: false,
    jersey: "Purple",
    directionsUrl: "https://maps.google.com/?q=Our+Lady+of+Lourdes+Catholic+School+Richmond+VA",
  },
  {
    id: 4,
    date: "Sat 1/17",
    time: "3:00 PM",
    opponent: "St Bridget's",
    venue: "Veritas",
    isHome: false,
    jersey: "Purple",
    directionsUrl: "https://maps.google.com/?q=Veritas+School+Richmond+VA",
  },
  {
    id: 5,
    date: "Sat 1/24",
    time: "8:30 AM",
    opponent: "St Mary's",
    venue: "St Benedictine Main Floor",
    isHome: false,
    jersey: "Purple",
    directionsUrl: "https://maps.google.com/?q=St+Benedictine+College+Prep+Richmond+VA",
  },
  {
    id: 6,
    date: "Sat 1/31",
    time: "2:00 PM",
    opponent: "Veritas",
    venue: "Veritas",
    isHome: false,
    jersey: "Purple",
    directionsUrl: "https://maps.google.com/?q=Veritas+School+Richmond+VA",
  },
];

export default function OrchardBasketball() {
  return (
    <div className="screen-container">
      <div className="screen-header">
        <h2>🏀 OHMS Basketball</h2>
        <p className="subtitle">Full Schedule</p>
      </div>

      <div className="schedule-list">
        {SCHEDULE.map((game) => (
          <div key={game.id} className="schedule-item">
            <div className="schedule-date">
              <p className="date">{game.date}</p>
              <p className="time">{game.time}</p>
            </div>
            <div className="schedule-info">
              <h3>{game.opponent}</h3>
              <p className="location">📍 {game.venue} {game.isHome ? '(Home)' : '(Away)'}</p>
              {game.jersey && <p className="jersey">Jersey: {game.jersey}</p>}
            </div>
            {game.result ? (
              <div className={`schedule-result ${game.result.won ? 'won' : 'lost'}`}>
                {game.result.score}
              </div>
            ) : (
              <a href={game.directionsUrl} className="directions-link" target="_blank" rel="noopener noreferrer">
                Directions →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
