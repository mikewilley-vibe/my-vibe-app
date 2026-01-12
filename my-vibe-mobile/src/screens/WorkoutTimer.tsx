import { useState, useEffect } from 'react'
import '../styles/WorkoutTimer.css'

type Mode = 'hiit' | 'emom' | 'thirty'
type Phase = 'idle' | 'work' | 'rest' | 'finished'

const playBeep = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.value = 800
  oscillator.type = 'sine'

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.2)
}

export default function WorkoutTimer() {
  const [mode, setMode] = useState<Mode>('hiit')
  const [config, setConfig] = useState({
    workSeconds: 20,
    restSeconds: 10,
    rounds: 8,
    emomMinutes: 10,
    emomWorkSeconds: 40,
    emomIntervalSeconds: 60,
    thirtyMinutes: 20,
    thirtyWorkSeconds: 60,
    thirtyRestSeconds: 30,
  })

  const [timer, setTimer] = useState({
    phase: 'idle' as Phase,
    isRunning: false,
    remainingSeconds: 0,
    currentRound: 0,
  })

  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!timer.isRunning) return

    const id = setInterval(() => {
      setTimer(prev => {
        let newTimer = { ...prev, remainingSeconds: Math.max(0, prev.remainingSeconds - 1) }

        if (newTimer.remainingSeconds === 0) {
          playBeep()
          // Phase transitions
          if (mode === 'hiit') {
            if (prev.phase === 'work' && prev.currentRound < config.rounds) {
              newTimer = { ...newTimer, phase: 'rest', remainingSeconds: config.restSeconds }
            } else if (prev.phase === 'rest' && prev.currentRound < config.rounds) {
              newTimer = { ...newTimer, phase: 'work', remainingSeconds: config.workSeconds, currentRound: prev.currentRound + 1 }
            } else {
              newTimer = { ...newTimer, phase: 'finished', isRunning: false }
            }
          }
        }

        return newTimer
      })
    }, 1000)

    setIntervalId(id)
    return () => clearInterval(id)
  }, [timer.isRunning, mode, config])

  const startTimer = () => {
    if (mode === 'hiit') {
      setTimer({
        phase: 'work',
        isRunning: true,
        remainingSeconds: config.workSeconds,
        currentRound: 1,
      })
    }
  }

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: false }))
  }

  const resetTimer = () => {
    if (intervalId) clearInterval(intervalId)
    setTimer({ phase: 'idle', isRunning: false, remainingSeconds: 0, currentRound: 0 })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="timer-container">
      <h2>Workout Timer</h2>
      
      <div className="mode-buttons">
        {(['hiit', 'emom', 'thirty'] as const).map(m => (
          <button
            key={m}
            className={`mode-btn ${mode === m ? 'active' : ''}`}
            onClick={() => { setMode(m); resetTimer() }}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      {mode === 'hiit' && (
        <div className="config-inputs">
          <label>
            Work (sec):
            <input
              type="number"
              value={config.workSeconds}
              onChange={(e) => setConfig({ ...config, workSeconds: parseInt(e.target.value) || 0 })}
            />
          </label>
          <label>
            Rest (sec):
            <input
              type="number"
              value={config.restSeconds}
              onChange={(e) => setConfig({ ...config, restSeconds: parseInt(e.target.value) || 0 })}
            />
          </label>
          <label>
            Rounds:
            <input
              type="number"
              value={config.rounds}
              onChange={(e) => setConfig({ ...config, rounds: parseInt(e.target.value) || 0 })}
            />
          </label>
        </div>
      )}

      <div className="timer-display">
        <div className="time">{formatTime(timer.remainingSeconds)}</div>
        <div className="phase">{timer.phase}</div>
        {timer.currentRound > 0 && <div className="round">Round {timer.currentRound} of {config.rounds}</div>}
      </div>

      <div className="controls">
        <button className="ctrl-btn" onClick={startTimer} disabled={timer.isRunning}>
          Start
        </button>
        <button className="ctrl-btn" onClick={pauseTimer} disabled={!timer.isRunning}>
          Pause
        </button>
        <button className="ctrl-btn" onClick={resetTimer}>
          Reset
        </button>
      </div>
    </div>
  )
}
