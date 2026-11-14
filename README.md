# Space Mission Design Game

Full-screen 3D salvage game set during Earth's final hours. Walk around the outpost, recover parts from wooden crates, drag recovered cargo to the spacecraft, and use the ship-systems sidebar to design and evaluate the mission.

## Run on Windows

Do not double-click `index.html`; browsers block 3D JavaScript modules opened as `file://`.

1. Download the latest repository ZIP from GitHub and extract it.
2. Open the extracted folder in VS Code. Install the **Live Server** extension and click **Go Live**. Or install Python and run `py -m http.server 8000` in the project folder.
3. Open the `http://localhost:8000` or `http://127.0.0.1:5500` address shown by the server. Keep the server running.

## Controls

- **WASD** move; **Shift** sprint.
- Point at a blue-marked crate and press **E**, or click the crate directly. A crate panel opens; choose **Recover cargo**.
- Recovered components appear in the bottom cargo bar. Drag a slot onto the 3D world to install it. Installed components update the ship resource totals; click one and choose **Remove from ship** to return it to cargo.
- Drag on the 3D scene to look around. Click **Ship systems** for objectives, resources, orbit/launcher choices, console tasks, and flight simulation.

The 3D renderer loads Three.js from a CDN, so the browser needs internet access. This learning prototype is not a flight-certified design tool or networked multiplayer game.
