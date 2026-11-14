# Space Mission Design Game

A full-screen 3D salvage and mission-design prototype set during Earth's final hours. Explore the outpost, recover parts from large marked crates, tour the ark's two decks, inspect ship systems and components, and plan the mission from the flight console.

## Run on Windows

Do not double-click `index.html`; browsers block 3D JavaScript modules opened as `file://`.

1. Download the latest repository ZIP from GitHub and extract it.
2. Open the extracted project folder in VS Code and install the **Live Server** extension, then click **Go Live**. Or install Python and run `py -m http.server 8000` in the project folder.
3. Open the `http://localhost:8000` or `http://127.0.0.1:5500` address shown by the server. Keep the server running.

## Controls and exploration

- **WASD** move; **Shift** sprint. Click empty space to enable mouse-look; press **Esc** to release the mouse.
- Point the crosshair at a blue-marked crate and press **E**, or click the crate directly. Move closer if the interaction prompt is not shown.
- In the crate panel choose **Recover cargo**. Recovered hardware appears in the bottom cargo bar. Drag a cargo slot onto the 3D world/ship to install it.
- Enter the ark through the wide front airlock. Explore the lower habitat deck and use the starboard ramp to reach the upper science and systems deck.
- Hover over crates, installed components, or highlighted ship systems to preview information. Click or aim and press **E** to open the full inspection panel.
- Click **Ship systems** for objectives, live constraints, orbit/launcher choices, console tasks, and flight simulation.

The 3D renderer loads Three.js from a CDN, so the browser needs internet access. This learning prototype is not a flight-certified design tool or networked multiplayer game.
