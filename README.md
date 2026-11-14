# Space Mission Design Game

A browser-based mission-design game where players assemble a spacecraft, balance real engineering trade-offs, complete hands-on control-panel tasks, and simulate a mission. The hangar includes an interactive Three.js scene with a spacecraft and 3D astronaut crew.

## Play

Open `index.html` in a modern browser with an internet connection (the 3D view loads Three.js from jsDelivr). Or serve the folder locally:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Game features

- Select from five mission objectives and three difficulty settings.
- Configure a team of one to four players and assign crew roles.
- **Build by hand:** drag a bus system or science instrument into the 3D assembly bay. Installed parts appear on the spacecraft; click a part to remove it. You can also click component cards to toggle hardware.
- Rotate the 3D view by dragging, and inspect the astronaut crew in the hangar.
- Watch mass, power, budget, science data, communications, lifetime, payload margin, and mission risk update as the design changes.
- Complete three control-panel tasks: route a circuit sequence, calibrate a sensor dial, and align the antenna bearing.
- Choose an orbit and compatible launch vehicle, then run the mission simulation for a design-review score and debrief.

All mission values are simplified for learning and are not flight-certified. The application is front-end only; team size and roles are local game setup rather than networked multiplayer.
