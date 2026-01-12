import { useState } from 'react'
import './App.css'
import WorkoutTimer from './screens/WorkoutTimer'
import Shows from './screens/Shows'
import UVA from './screens/UVA'
import OrchardBasketball from './screens/OrchardBasketball'

type Screen = 'home' | 'timer' | 'shows' | 'uva' | 'orchard-basketball'

function App() {
  const [screen, setScreen] = useState<Screen>('home')

  return (
    <div className="app-container">
      {screen === 'home' && (
        <div className="home-screen">
          <header className="header">
            <h1>My Vibe</h1>
            <p>Mobile App</p>
          </header>
          <nav className="nav-buttons">
            <button className="nav-btn" onClick={() => setScreen('timer')}>
              ⏱️ Workout Timer
            </button>
            <button className="nav-btn" onClick={() => setScreen('shows')}>
              🎵 Shows
            </button>
            <button className="nav-btn" onClick={() => setScreen('uva')}>
              🏀 UVA Basketball
            </button>
            <button className="nav-btn" onClick={() => setScreen('orchard-basketball')}>
              🏀 OHMS Basketball
            </button>
          </nav>
        </div>
      )}

      {screen === 'timer' && (
        <div className="screen">
          <button className="back-btn" onClick={() => setScreen('home')}>← Back</button>
          <WorkoutTimer />
        </div>
      )}

      {screen === 'shows' && (
        <div className="screen">
          <button className="back-btn" onClick={() => setScreen('home')}>← Back</button>
          <Shows />
        </div>
      )}

      {screen === 'uva' && (
        <div className="screen">
          <button className="back-btn" onClick={() => setScreen('home')}>← Back</button>
          <UVA />
        </div>
      )}

      {screen === 'orchard-basketball' && (
        <div className="screen">
          <button className="back-btn" onClick={() => setScreen('home')}>← Back</button>
          <OrchardBasketball />
        </div>
      )}
    </div>
  )
}

export default App
