import { useState } from 'react'
import '../styles/Shows.css'

// Your real artists data
const artists = [
  { id: 1, name: "Badfish", url: "https://www.badfish.com/tour" },
  { id: 2, name: "The Disco Biscuits", url: "https://www.discobiscuits.com/shows" },
  { id: 3, name: "Chalk Dinosaur", url: "https://chalkdinosaur.com/shows" },
  { id: 4, name: "Spafford", url: "https://www.spafford.net/tour.html" },
  { id: 5, name: "Built to Spill", url: "https://www.builttospill.com/shows" },
  { id: 6, name: "Phish", url: "https://www.ticketmaster.com/search?q=Phish" },
  { id: 7, name: "Kishi Bashi", url: "https://www.kishibashi.com/shows" },
  { id: 8, name: "Grateful Jed", url: "https://www.gratefuljed.com/tour" },
  { id: 9, name: "Sunsquabi", url: "https://www.sunsquabi.com/tour" },
  { id: 10, name: "STS9", url: "https://www.sts9.com/tour" },
  { id: 11, name: "The New Deal", url: "https://www.thenewdeal.com/tour" },
  { id: 12, name: "Lettuce", url: "https://www.lettucemusic.com/tour" },
  { id: 13, name: "Robert Randolph", url: "https://www.robertrandolph.com/tour" },
  { id: 14, name: "Goose", url: "https://www.goosemusic.com/tour" },
  { id: 15, name: "Widespread Panic", url: "https://www.widespreadpanic.com/tour" },
  { id: 16, name: "Billy Strings", url: "https://www.billystrings.com/tour" },
  { id: 17, name: "Umphrey's McGee", url: "https://www.umphreysmcgee.com/tour" },
  { id: 18, name: "STRFKR", url: "https://www.starfucker.net/tour" },
  { id: 19, name: "Galactic", url: "https://www.galacticgroove.com/tour" },
  { id: 20, name: "LCD Soundsystem", url: "https://www.lcdsoundsystem.com/tour" },
  { id: 21, name: "Tame Impala", url: "https://www.tameimpala.com/tour" },
]

// Your real venues data
const venues = [
  // Hampton Roads
  { id: 1, name: "The NorVa", url: "https://www.thenorva.com/events/", region: "Hampton Roads" },
  { id: 2, name: "The Dome", url: "https://www.ticketmaster.com/the-dome-tickets-virginia-beach/venue/9458", region: "Hampton Roads" },
  { id: 3, name: "The National", url: "https://www.thenationalva.com/events/", region: "Hampton Roads" },
  { id: 4, name: "Elevation 27", url: "https://www.elevation27.com/events", region: "Hampton Roads" },
  { id: 5, name: "The Annex", url: "https://theannexnfk.com/events/", region: "Hampton Roads" },
  { id: 6, name: "Veterans United Home Loans Amphitheater", url: "https://www.livenation.com/venue/KovZpZAE7EA/veterans-united-home-loans-amphitheater-at-virginia-beach-events", region: "Hampton Roads" },
  // Richmond
  { id: 7, name: "The Broadberry", url: "https://www.thebroadberry.com/events/", region: "Richmond" },
  { id: 8, name: "The National", url: "https://www.thenationalva.com/events/", region: "Richmond" },
  { id: 9, name: "The Camel", url: "https://thecamel.org/events/", region: "Richmond" },
  // Washington DC
  { id: 10, name: "The Anthem", url: "https://theanthemdc.com/events/", region: "Washington DC" },
  { id: 11, name: "The 9:30 Club", url: "https://www.930.com/events/", region: "Washington DC" },
  { id: 12, name: "Lincoln Theatre", url: "https://thelincolntheatre.com/events/", region: "Washington DC" },
]

export default function Shows() {
  const [tab, setTab] = useState<'artists' | 'venues'>('artists')

  return (
    <div className="shows-container">
      <h2>Shows</h2>
      
      <div className="tab-buttons">
        <button
          className={`tab-btn ${tab === 'artists' ? 'active' : ''}`}
          onClick={() => setTab('artists')}
        >
          Artists
        </button>
        <button
          className={`tab-btn ${tab === 'venues' ? 'active' : ''}`}
          onClick={() => setTab('venues')}
        >
          Venues
        </button>
      </div>

      <div className="content">
        {tab === 'artists' && (
          <div className="cards">
            {artists.map(artist => (
              <a
                key={artist.id}
                href={artist.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
              >
                <div className="card-icon">🎤</div>
                <div className="card-content">
                  <h3>{artist.name}</h3>
                  <p>View →</p>
                </div>
              </a>
            ))}
          </div>
        )}

        {tab === 'venues' && (
          <div className="cards">
            {venues.map(venue => (
              <a
                key={venue.id}
                href={venue.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
              >
                <div className="card-icon">🎭</div>
                <div className="card-content">
                  <h3>{venue.name}</h3>
                  <p>{venue.region}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
