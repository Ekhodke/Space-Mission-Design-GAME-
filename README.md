# Space Mission Design Game

A browser-based interactive strategy game where players plan a complete space mission by balancing scientific objectives, spacecraft design, orbit choices, and mission resources.

## Features

- Mission objective selection with different mission profiles
- Spacecraft bus and payload configuration
- Scientific instrument trade-offs
- Orbit and launch vehicle compatibility checks
- Resource management for budget, mass, power, data, communication, and lifetime
- Team role setup for up to four players
- Mission scoring and post-simulation report
- No build step required; open `index.html` in a browser

## Run locally

Open `index.html` directly in any modern browser.

If you prefer a local server:

```bash
cd /path/to/Space-Mission-Design-GAME-
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## How to play

1. Pick a mission objective.
2. Choose a difficulty level.
3. Configure the spacecraft with components and instruments.
4. Select an orbit and launch vehicle.
5. Assign team roles if playing cooperatively.
6. Click `Simulate Mission` to evaluate the mission.
7. Review the score, risk analysis, and recommendations.

## Mission concepts included

- Earth climate monitoring
- Lunar resource prospecting
- Mars sample return support
- Deep space observatory
- Planetary defense early warning

## Files

- `index.html` — game interface
- `style.css` — mission UI styling
- `script.js` — game logic and simulation
