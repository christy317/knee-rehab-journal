# Knee Rehab Tracker

A protocol-led knee rehabilitation tracker — built to follow Option B recovery. Tracks pain and energy levels across a structured exercise programme without obsessing over performance metrics.

## What it does

- Log workouts against a defined rehab protocol
- Track **pain level** and **energy level** per session (not performance — this is recovery, not performance tracking)
- View your rehab journey as a timeline
- Spot patterns: when pain drops, when you have energy for more, when to ease off

## Design philosophy

Recovery needs different metrics than performance. This tracker focuses on *how you feel* (pain, energy, readiness) rather than reps, weights, or times. The protocol is the structure; your observations are the data.

## Tech stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v3
- shadcn/ui components
- Lucide icons

## Run locally

```
npm install
npm run dev
```

Open `http://localhost:5173` and start logging.

## Data

Everything is stored in your browser's `localStorage` under the key `kneerehab.sessions`. Export or back up your data by copying the value from your browser's dev tools.

## Notes

This is a personal learning project — built to understand how to translate a structured recovery protocol into a usable app interface.

## License

MIT
