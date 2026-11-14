# Space Mission Design Game

Full-screen 3D salvage game set during Earth's final hours. Walk around the outpost, recover parts from wooden crates, drag recovered cargo to the spacecraft, and use the ship-systems sidebar to design and evaluate the mission.

## Run on Windows

Do not double-click `index.html`; browsers block 3D JavaScript modules opened as `file://`.

1. Download the latest repository ZIP and extract it.
2. Open the extracted folder in VS Code. Install the **Live Server** extension and click **Go Live**. Or install Python and run `py -m http.server 8000` in the project folder.
3. Open the `http://localhost:8000` or `http://127.0.0.1:5500` address shown by the server. Keep the server running.

## Controls

- **WASD** move; **Shift** sprint; drag the 3D view to look around.
- Point at a blue-marked crate and press **E**, or click the crate directly. In its panel choose **Recover cargo**.
- Recovered parts appear in the bottom cargo bar. Drag a slot onto the 3D world to install it. Installed components update mass and resource totals. Click an installed part in the sidebar to return it to cargo.
- Click **Ship systems** for objectives, resources, orbit and launch choices, console tasks, and flight simulation.

Three.js loads from a CDN, so an internet connection is required. This is a learning prototype, not a flight-certified design tool or networked multiplayer game.
