# Workout Timer (Expo)

Phone app port of the HIIT / EMOM / 30 MIN workout timer from `/workout-timer`.

## Stack

- React Native + Expo SDK 57
- TypeScript
- `expo-audio` for phase-change beeps
- `expo-haptics` for vibration feedback

## Run

```bash
cd mobile
npm start
```

Then open in Expo Go (iOS/Android) or press `w` for web.

## Modes

- **HIIT** — custom work / rest / rounds
- **EMOM** — work per minute with configurable interval
- **30 MIN** — fixed 60s work / 30s rest, choose rounds
