// Interactive salvage field and explorable two-deck ark. Serve this page over HTTP/HTTPS.
let THREE;
try {
  THREE = await import('https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js');
} catch {
  try { THREE = await import('https://unpkg.com/three@0.164.1/build/three.module.js'); }
  catch (error) {
    const notice = document.createElement('div');
    notice.style.cssText = 'position:fixed;z-index:9999;inset:auto 16px 16px;padding:14px 18px;background:#401d20;color:white;border:1px solid #ff7954;border-radius:10px;font:14px sans-serif';
    notice.textContent = 'The 3D engine could not load. Run from a local server, check your internet connection, then refresh.';
    document.body.appendChild(notice);
    throw error;
  }
}

const $ = id => document.getElementById(id);
const canvas = $('spaceCanvas'), world = $('game'), prompt = $('interactionPrompt');
const sidebar = $('controlSidebar'), objectPanel = $('objectPanel');
if (!canvas || !world || !prompt || !sidebar || !objectPanel) throw new Error('Game interface is incomplete. Download the latest project files.');

const scene = new THREE.Scene();
scene.background = new THREE.Color('#070912');
scene.fog = new THREE.FogExp2('#090c18', .0055);
const camera = new THREE.PerspectiveCamera(68, innerWidth / innerHeight, .1, 500);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
scene.add(new THREE.HemisphereLight(0xb9c9e8, 0x392b2c, 1.65));
const sunlight = new THREE.DirectionalLight(0xffc28a, 2.4);
sunlight.position.set(-25, 40, 20); sunlight.castShadow = true; scene.add(sunlight);
const earthLight = new THREE.PointLight(0xff4b2d, 220, 100);
earthLight.position.set(-5, 12, -78); scene.add(earthLight);
const blueFill = new THREE.PointLight(0x67aaff, 90, 120);
blueFill.position.set(12, 13, 16); scene.add(blueFill);

// Starfield and the damaged Earth/moon backdrop.
const starPositions = [], starColors = [];
for (let i = 0; i < 2200; i++) {
  const r = 180 + Math.random() * 150, t = Math.random() * Math.PI * 2;
  const p = Math.acos(2 * Math.random() - 1), warm = Math.random() < .12;
  starPositions.push(r * Math.sin(p) * Math.cos(t), r * Math.cos(p), r * Math.sin(p) * Math.sin(t));
  starColors.push(warm ? 1 : .72, warm ? .48 : .82, warm ? .28 : 1);
}
const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
const starMaterial = new THREE.PointsMaterial({ size: .8, vertexColors: true, transparent: true, opacity: .9 });
scene.add(new THREE.Points(starGeometry, starMaterial));
const earthGroup = new THREE.Group(); earthGroup.position.set(-22, 19, -115); scene.add(earthGroup);
const earth = new THREE.Mesh(new THREE.SphereGeometry(22, 48, 36), new THREE.MeshStandardMaterial({ color: 0x536273, roughness: .94, emissive: 0x501b16, emissiveIntensity: .42 }));
earthGroup.add(earth);
earthGroup.add(new THREE.Mesh(new THREE.SphereGeometry(23.5, 40, 32), new THREE.MeshBasicMaterial({ color: 0xff6542, side: THREE.BackSide, transparent: true, opacity: .2 })));
const moon = new THREE.Mesh(new THREE.SphereGeometry(6, 24, 20), new THREE.MeshStandardMaterial({ color: 0x92939a, roughness: 1 }));
moon.position.set(36, 28, -130); scene.add(moon);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(420, 420), new THREE.MeshStandardMaterial({ color: 0x25252b, roughness: 1 }));
ground.rotation.x = -Math.PI / 2; ground.position.y = -.16; ground.receiveShadow = true; scene.add(ground);
const grid = new THREE.GridHelper(420, 90, 0x514438, 0x292831);
grid.position.y = -.14; grid.material.transparent = true; grid.material.opacity = .14; scene.add(grid);
for (let i = 0; i < 75; i++) {
  const size = .3 + Math.random() * 1.5, angle = Math.random() * Math.PI * 2, distance = 20 + Math.random() * 75;
  const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(size), new THREE.MeshStandardMaterial({ color: i % 3 ? 0x56504c : 0x34343b, roughness: 1 }));
  rock.position.set(Math.cos(angle) * distance, size * .4, Math.sin(angle) * distance);
  rock.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3); rock.scale.y = .5; rock.castShadow = true; scene.add(rock);
}

function addMesh(parent, geometry, material, position, rotation) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  if (rotation) mesh.rotation.set(...rotation);
  mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh);
  return mesh;
}

// Large open-top ark. Interior is deliberately visible from above and through broad windows.
const ship = new THREE.Group(); ship.position.set(0, 0, -18); scene.add(ship);
const hullMat = new THREE.MeshStandardMaterial({ color: 0x9caeb7, metalness: .55, roughness: .38 });
const steel = new THREE.MeshStandardMaterial({ color: 0x405668, metalness: .68, roughness: .32 });
const innerWall = new THREE.MeshStandardMaterial({ color: 0x263b4a, metalness: .3, roughness: .65 });
const deckMat = new THREE.MeshStandardMaterial({ color: 0x394751, metalness: .38, roughness: .62 });
const glass = new THREE.MeshStandardMaterial({ color: 0x4abce0, emissive: 0x0b3450, emissiveIntensity: .45, transparent: true, opacity: .3, metalness: .35, roughness: .18, side: THREE.DoubleSide });
const trim = new THREE.MeshStandardMaterial({ color: 0x62c8ee, emissive: 0x16465e, emissiveIntensity: .55 });
const partMaterials = {
  'composite-bus': 0x5bb9db, 'solar-array': 0x329bd1, 'battery-pack': 0x50c994,
  'deep-space-comms': 0xe9b34d, 'autonomy-core': 0xbc8cff, optical: 0x75cfff,
  thermal: 0xff805e, radar: 0x7ee2bd, spectral: 0xe2a8ff, communications: 0xf3ce68
};

// Hull footprint: 24 m wide x 34 m long; front airlock at z=-3, clear doorway width 6 m.
const shipWidth = 12, shipFront = -3, shipBack = -34, wallH = 10.6;
// Lower solid walls and upper glass bands make the interior readable from outside.
for (const x of [-shipWidth, shipWidth]) {
  addMesh(ship, new THREE.BoxGeometry(.48, 2.2, 31), hullMat, [x, 1.1, (shipFront + shipBack) / 2]);
  addMesh(ship, new THREE.BoxGeometry(.18, 5.3, 30.5), glass, [x, 5.0, (shipFront + shipBack) / 2]);
  for (let z = -31; z <= -5; z += 6.5) addMesh(ship, new THREE.BoxGeometry(.65, wallH, .55), steel, [x, wallH / 2, z]);
  addMesh(ship, new THREE.BoxGeometry(.5, .45, 31), steel, [x, wallH, (shipFront + shipBack) / 2]);
}
// Rear pressure wall and segmented front wall around the airlock entrance.
addMesh(ship, new THREE.BoxGeometry(24, 2.2, .5), hullMat, [0, 1.1, shipBack]);
addMesh(ship, new THREE.BoxGeometry(24, 5.3, .18), glass, [0, 5, shipBack]);
addMesh(ship, new THREE.BoxGeometry(24, .45, .55), steel, [0, wallH, shipBack]);
for (const x of [-7.5, 7.5]) {
  addMesh(ship, new THREE.BoxGeometry(9, 2.2, .5), hullMat, [x, 1.1, shipFront]);
  addMesh(ship, new THREE.BoxGeometry(9, 5.3, .18), glass, [x, 5, shipFront]);
  addMesh(ship, new THREE.BoxGeometry(.5, wallH, .55), steel, [x, wallH / 2, shipFront]);
}
// Two walkable decks with a large stair/ramp opening on starboard side.
addMesh(ship, new THREE.BoxGeometry(23.4, .45, 30.2), deckMat, [0, -.18, -18.5]);
addMesh(ship, new THREE.BoxGeometry(11.4, .48, 30.2), deckMat, [-5.7, 5, -18.5]);
addMesh(ship, new THREE.BoxGeometry(7.5, .48, 30.2), deckMat, [8.25, 5, -18.5]);
// Deck edge rails and a walkable ramp between floors.
for (const z of [-32, -5]) addMesh(ship, new THREE.BoxGeometry(23, .42, .22), steel, [0, 5.3, z]);
for (const x of [-11, -1.5, 4.5, 11]) addMesh(ship, new THREE.BoxGeometry(.2, .45, 30), steel, [x, 5.3, -18.5]);
const ramp = addMesh(ship, new THREE.BoxGeometry(4.2, .22, 12.5), deckMat, [7.6, 2.5, -12.7], [-.38, 0, 0]);
for (const x of [5.45, 9.75]) addMesh(ship, new THREE.BoxGeometry(.16, 1.2, 12.5), trim, [x, 2.9, -12.7], [-.38, 0, 0]);
// Internal rooms/frames, visible consoles, and room labels.
for (const z of [-27, -18, -8]) {
  for (const x of [-4.5, 0, 4.5]) addMesh(ship, new THREE.BoxGeometry(.12, 2.7, .12), steel, [x, 1.35, z]);
}
function addRoomLabel(text, x, y, z) {
  const canvasLabel = document.createElement('canvas'); canvasLabel.width = 512; canvasLabel.height = 96;
  const ctx = canvasLabel.getContext('2d');
  ctx.fillStyle = 'rgba(5,14,24,.82)'; ctx.fillRect(0, 0, 512, 96);
  ctx.strokeStyle = '#55c8ef'; ctx.lineWidth = 4; ctx.strokeRect(3, 3, 506, 90);
  ctx.fillStyle = '#eaf8ff'; ctx.font = 'bold 38px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 256, 49);
  const texture = new THREE.CanvasTexture(canvasLabel); texture.colorSpace = THREE.SRGBColorSpace;
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.4, .83), new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide }));
  sign.position.set(x, y, z); sign.rotation.y = Math.PI; ship.add(sign);
}
addRoomLabel('FLIGHT DECK', 0, 3.7, -32.9);
addRoomLabel('HABITAT · DECK 1', -5.8, 3.6, -20);
addRoomLabel('SCIENCE LAB · DECK 2', -5.5, 8.5, -24);
addRoomLabel('POWER & LIFE SUPPORT', 8, 8.5, -27);
// Airlock portal, lamps, launch pad, and landing lights.
for (const x of [-3.3, 3.3]) {
  addMesh(ship, new THREE.BoxGeometry(.34, 7, .42), trim, [x, 3.5, shipFront]);
  addMesh(ship, new THREE.BoxGeometry(.55, .28, .55), new THREE.MeshBasicMaterial({ color: 0x6ad7ff }), [x, 7.15, shipFront]);
}
addMesh(ship, new THREE.BoxGeometry(6.6, .32, .4), steel, [0, 7.5, shipFront]);
const pad = new THREE.Mesh(new THREE.CylinderGeometry(21, 22, .35, 48), new THREE.MeshStandardMaterial({ color: 0x393d43, metalness: .4, roughness: .7 }));
pad.position.set(0, -.15, -18); scene.add(pad);
for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; addMesh(scene, new THREE.BoxGeometry(.3, .2, .3), new THREE.MeshBasicMaterial({ color: 0xff653c }), [Math.cos(a) * 18, .16, -18 + Math.sin(a) * 18]); }

// Avatar and movement state. Position.y is the deck height (0 or 5 m).
const player = new THREE.Group(); scene.add(player);
const suit = new THREE.MeshStandardMaterial({ color: 0xd9e1e4, roughness: .58 });
const visorMat = new THREE.MeshStandardMaterial({ color: 0x3e9fc2, metalness: .7, roughness: .2, emissive: 0x102e42 });
addMesh(player, new THREE.CapsuleGeometry(.43, .75, 5, 10), suit, [0, 1.08, 0]);
addMesh(player, new THREE.SphereGeometry(.39, 18, 14), suit, [0, 1.87, 0]);
const visorMesh = addMesh(player, new THREE.SphereGeometry(.29, 16, 12), visorMat, [0, 1.88, .29]); visorMesh.scale.set(1, .75, .43);
addMesh(player, new THREE.BoxGeometry(.5, .62, .3), steel, [0, 1.08, -.42]);
for (const side of [-1, 1]) {
  addMesh(player, new THREE.CapsuleGeometry(.13, .5, 4, 8), suit, [side * .48, 1.06, 0], [0, 0, side * -.15]);
  addMesh(player, new THREE.BoxGeometry(.25, .3, .38), steel, [side * .19, .22, .04]);
}
player.position.set(0, 0, 7);

const clickables = [], crateObjects = new Map(), installedObjects = new Map(), shipParts = [];
const game = () => window.spaceMissionGameDesign;
const catalog = () => game()?.catalog || [];
const colorFor = id => partMaterials[id] || 0x72c8ed;
const cratePositions = [[-8, 0, 5], [8, 0, 6], [-12, 0, -1], [12, 0, 1], [-14, 0, -11], [14, 0, -12], [-9, 0, -40], [9, 0, -41], [-19, 0, -23], [19, 0, -24]];
function makeCrate(item, index) {
  const group = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: index % 2 ? 0x79502f : 0x93633a, roughness: .9 });
  const iron = new THREE.MeshStandardMaterial({ color: 0x3e332a, metalness: .25, roughness: .7 });
  // 3.2 x 2.25 x 2.7 m crates are intentionally large, readable, and easy to click.
  addMesh(group, new THREE.BoxGeometry(3.2, 2.15, 2.7), wood, [0, 1.08, 0]);
  for (const x of [-1.35, 1.35]) {
    addMesh(group, new THREE.BoxGeometry(.2, 2.25, .16), iron, [x, 1.08, 1.37]);
    addMesh(group, new THREE.BoxGeometry(.2, 2.25, .16), iron, [x, 1.08, -1.37]);
  }
  for (const y of [.35, 1.8]) for (const z of [-1.38, 1.38]) addMesh(group, new THREE.BoxGeometry(3.15, .16, .12), iron, [0, y, z]);
  const color = colorFor(item.id);
  const beacon = new THREE.Mesh(new THREE.BoxGeometry(1.05, .32, .12), new THREE.MeshBasicMaterial({ color }));
  beacon.position.set(0, 2.42, 0); group.add(beacon);
  const glow = new THREE.PointLight(color, 18, 9); glow.position.set(0, 2.8, 0); group.add(glow);
  group.userData = { kind: 'crate', item };
  const position = cratePositions[index % cratePositions.length];
  group.position.set(...position); group.rotation.y = (index % 2 ? 1 : -1) * .12;
  scene.add(group); crateObjects.set(item.id, group); clickables.push(group);
}
function removeCrate(id) {
  const group = crateObjects.get(id); if (!group) return;
  scene.remove(group); crateObjects.delete(id);
  const index = clickables.indexOf(group); if (index >= 0) clickables.splice(index, 1);
}
function populateCrates() { for (const id of [...crateObjects.keys()]) removeCrate(id); catalog().forEach(makeCrate); }

function makeShipPart(id, name, description, position, color, stats = {}) {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: .13, metalness: .42, roughness: .35 });
  addMesh(group, new THREE.BoxGeometry(1.1, 1.2, 1.05), mat, [0, .65, 0]);
  addMesh(group, new THREE.BoxGeometry(1.4, .12, 1.35), steel, [0, 1.28, 0]);
  const lamp = new THREE.PointLight(color, 3.5, 5); lamp.position.set(0, 1.5, 0); group.add(lamp);
  group.position.set(...position); group.userData = { kind: 'ship-part', item: { id, name, description, ...stats } };
  ship.add(group); clickables.push(group); shipParts.push(group); return group;
}
makeShipPart('flight-deck', 'Flight deck', 'The ark’s command bridge. Navigation, flight status, and launch controls are monitored here.', [0, 5, -31], 0x54cfff, { category: 'ship', power: 45, mass: 180 });
makeShipPart('habitat', 'Crew habitat', 'Pressurized living quarters with bunks, food storage, and emergency refuge for the evacuation crew.', [-8, 0, -19], 0x76e0ad, { category: 'ship', power: 65, mass: 420 });
makeShipPart('science-lab', 'Science laboratory', 'A modular workbench for operating the ark’s recovered science instruments.', [-8, 5, -24], 0xe2a8ff, { category: 'ship', power: 80, mass: 210 });
makeShipPart('life-support', 'Life support', 'Atmosphere, water recovery, and thermal regulation for a long-duration crewed mission.', [8, 5, -29], 0x7ee2bd, { category: 'ship', power: 120, mass: 360 });
makeShipPart('reactor', 'Power core', 'The central distribution unit routes stored and generated power to ship systems.', [8, 0, -27], 0xffc65c, { category: 'ship', power: 0, mass: 260 });
makeShipPart('cargo-bay', 'Cargo bay', 'Secured cargo storage on the lower deck. Recovered components can be installed from the cargo bar.', [0, 0, -9], 0x5bb9db, { category: 'ship', power: 15, mass: 120 });

function rebuildInstalled(items = []) {
  for (const group of installedObjects.values()) {
    ship.remove(group); const i = clickables.indexOf(group); if (i >= 0) clickables.splice(i, 1);
  }
  installedObjects.clear();
  items.forEach((item, index) => {
    const group = new THREE.Group(), color = colorFor(item.id);
    const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: .2, metalness: .5, roughness: .3 });
    const geometry = item.category === 'instrument' ? new THREE.CylinderGeometry(.48, .62, .8, 12) : new THREE.BoxGeometry(1.15, 1.05, 1.05);
    addMesh(group, geometry, mat, [0, .65, 0], item.category === 'instrument' ? [Math.PI / 2, 0, 0] : null);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.78, .055, 8, 24), new THREE.MeshBasicMaterial({ color }));
    ring.position.y = .7; group.add(ring);
    group.position.set(-2.2 + (index % 3) * 2.15, index < 3 ? 0 : 5, -15 - Math.floor(index / 3) * 5);
    group.userData = { kind: 'installed', item }; ship.add(group); installedObjects.set(item.id, group); clickables.push(group);
  });
}

// Compact inspection tooltip follows the hovered salvage, installed hardware, or ship system.
const hoverCard = document.createElement('div');
hoverCard.className = 'world-inspection';
hoverCard.style.cssText = 'position:fixed;z-index:9;display:none;pointer-events:none;max-width:260px;padding:10px 12px;border:1px solid rgba(128,217,255,.5);border-radius:9px;background:rgba(5,12,21,.94);color:#edf5fa;font:12px/1.45 Inter,system-ui,sans-serif;box-shadow:0 10px 30px #0008';
world.appendChild(hoverCard);
function hideHover() { hoverCard.style.display = 'none'; }
function showHover(target, x, y) {
  const item = target?.userData?.item; if (!item) return hideHover();
  hoverCard.innerHTML = `<strong style="color:#80d9ff">${item.name}</strong><br>${item.description || 'Ark system'}${Number.isFinite(item.mass) ? `<br><span style="color:#b5c5ce">${item.mass} kg · ${item.power ?? 0} kW${item.cost != null ? ` · $${item.cost}M` : ''}</span>` : ''}`;
  hoverCard.style.display = 'block';
  const rect = world.getBoundingClientRect();
  hoverCard.style.left = `${Math.min(x + 16, rect.right - 275)}px`;
  hoverCard.style.top = `${Math.min(y + 16, rect.bottom - 100)}px`;
}
function toast(message) {
  const el = $('toast'); if (!el) return;
  el.textContent = message; el.classList.add('visible'); clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('visible'), 2300);
}
function closeObjectPanel() { objectPanel.classList.remove('open'); objectPanel.setAttribute('aria-hidden', 'true'); }
function showObject(group) {
  if (!group) return;
  const item = group.userData.item, kind = group.userData.kind;
  const isCrate = kind === 'crate', isInstalled = kind === 'installed', isShipPart = kind === 'ship-part';
  const content = $('objectPanelContent');
  const type = isCrate ? 'FIELD SALVAGE' : isInstalled ? 'INSTALLED HARDWARE' : isShipPart ? 'ARK SYSTEM' : 'SHIP PART';
  content.innerHTML = `<span class="object-type">${type}</span><h2>${item.name}</h2><p class="object-description">${item.description || ''}</p>` +
    `<div class="object-stats"><div><span>Mass</span><strong>${item.mass ?? '—'}${item.mass == null ? '' : ' kg'}</strong></div><div><span>Power</span><strong>${item.power ?? '—'}${item.power == null ? '' : ' kW'}</strong></div>` +
    `${item.cost != null ? `<div><span>Budget</span><strong>$${item.cost}M</strong></div>` : ''}${item.data != null ? `<div><span>Data</span><strong>${item.data} GB/day</strong></div>` : ''}</div>` +
    `<button id="objectAction" class="primary-button object-action" type="button">${isCrate ? 'Recover cargo' : isInstalled ? 'Remove from ship' : isShipPart ? 'Close inspection' : 'Inspect'}</button>`;
  $('objectAction').addEventListener('click', () => {
    if (isCrate) {
      const recovered = game()?.recoverCargo(item.category, item.id);
      if (recovered) { removeCrate(item.id); toast(`${item.name} recovered · drag its cargo slot onto the ship to install`); }
      else toast('Already recovered or installed.');
    } else if (isInstalled) {
      game()?.removeComponent(item.category, item.id); toast(`${item.name} removed from the ark`);
    }
    closeObjectPanel();
  });
  objectPanel.classList.add('open'); objectPanel.setAttribute('aria-hidden', 'false');
}
$('closeObjectPanel').addEventListener('click', closeObjectPanel);

const raycaster = new THREE.Raycaster(), center = new THREE.Vector2(0, 0), pointer = new THREE.Vector2();
function findTarget(ray, range = 22) {
  camera.updateMatrixWorld(true); raycaster.setFromCamera(ray, camera);
  const hit = raycaster.intersectObjects(clickables, true).find(result => result.distance <= range);
  if (!hit) return null;
  let target = hit.object; while (target && !target.userData.kind) target = target.parent;
  return target || null;
}
function pointerRay(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  pointer.set((clientX - rect.left) / rect.width * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
  return pointer;
}
let yaw = 0, pitch = -.12, pointerLocked = false, nearby = null, mouse = { x: innerWidth / 2, y: innerHeight / 2 };
canvas.addEventListener('pointermove', event => {
  mouse = { x: event.clientX, y: event.clientY };
  if (pointerLocked) {
    yaw -= event.movementX * .0022;
    pitch = THREE.MathUtils.clamp(pitch - event.movementY * .0018, -.55, .4);
  }
});
document.addEventListener('pointerlockchange', () => { pointerLocked = document.pointerLockElement === canvas; });
canvas.addEventListener('click', event => {
  if (sidebar.classList.contains('open') || objectPanel.classList.contains('open')) return;
  const target = findTarget(pointerLocked ? center : pointerRay(event.clientX, event.clientY), pointerLocked ? 22 : 55);
  if (target) { showObject(target); hideHover(); return; }
  if (!pointerLocked) canvas.requestPointerLock?.();
});

// Collision rectangles are independent of render meshes, so the hull blocks walking through it.
const solidRects = [
  { minX: -12.3, maxX: -11.7, minZ: -34.3, maxZ: -2.7 },
  { minX: 11.7, maxX: 12.3, minZ: -34.3, maxZ: -2.7 },
  { minX: -12.3, maxX: 12.3, minZ: -34.4, maxZ: -33.7 },
  { minX: -12.3, maxX: -3, minZ: -3.4, maxZ: -2.6 },
  { minX: 3, maxX: 12.3, minZ: -3.4, maxZ: -2.6 }
];
function collidesAt(x, z) {
  const radius = .6;
  if (solidRects.some(r => x + radius > r.minX && x - radius < r.maxX && z + radius > r.minZ && z - radius < r.maxZ)) return true;
  for (const group of crateObjects.values()) {
    const dx = Math.abs(x - group.position.x), dz = Math.abs(z - group.position.z);
    if (dx < 2.2 && dz < 1.9) return true;
  }
  return false;
}
function floorHeight(x, z, current) {
  // A broad ramp on the right-hand side connects the lower habitat to the upper deck.
  if (x > 5.2 && x < 10 && z < -6 && z > -19) {
    const progress = THREE.MathUtils.clamp((-z - 6) / 13, 0, 1);
    return progress * 5;
  }
  // Keep each deck level when moving around its walkable footprint.
  if (current > 2.5 && x > -11 && x < 11 && z > -33 && z < -4) return 5;
  if (current <= 2.5) return 0;
  return current;
}
const keys = new Set();
window.addEventListener('keydown', event => {
  if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'].includes(event.code) && !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) event.preventDefault();
  if (!['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(document.activeElement?.tagName)) keys.add(event.code);
  if (event.code === 'KeyE' && !event.repeat) { if (nearby) showObject(nearby); else toast('Aim at a marked crate or ark system, then press E.'); }
  if (event.code === 'Escape' && objectPanel.classList.contains('open')) closeObjectPanel();
});
window.addEventListener('keyup', event => keys.delete(event.code));
window.addEventListener('blur', () => keys.clear());

function renderHotbar() {
  const bar = $('inventoryHotbar'), cargo = game()?.cargo || []; if (!bar) return;
  bar.innerHTML = cargo.length ? cargo.map((item, i) => `<button class="inventory-slot" type="button" draggable="true" data-cargo="${item.id}"><span class="slot-number">${i + 1}</span><span class="slot-icon">${item.category === 'instrument' ? '◉' : '▰'}</span><strong>${item.name}</strong><small>${item.mass} kg</small></button>`).join('') : '<div class="empty-inventory">Explore the crates to find ship components</div>';
  bar.querySelectorAll('[data-cargo]').forEach(button => button.addEventListener('dragstart', event => {
    event.dataTransfer.setData('text/plain', JSON.stringify({ id: button.dataset.cargo, category: 'cargo' })); event.dataTransfer.effectAllowed = 'move';
  }));
}
canvas.addEventListener('dragover', event => { event.preventDefault(); world.classList.add('drop-hover'); });
canvas.addEventListener('dragleave', () => world.classList.remove('drop-hover'));
canvas.addEventListener('drop', event => {
  event.preventDefault(); world.classList.remove('drop-hover');
  try {
    const data = JSON.parse(event.dataTransfer.getData('text/plain')); if (data.category !== 'cargo') return;
    const item = game()?.installCargo(data.id); if (item) toast(`${item.name} installed · ship mass updated`); else toast('Cargo is no longer available.');
  } catch { /* Ignore non-game drops. */ }
});
window.addEventListener('spacegameinventory', renderHotbar);
window.addEventListener('spacegamecomponents', event => rebuildInstalled(event.detail || []));
$('controlToggle').addEventListener('click', () => {
  const open = !sidebar.classList.contains('open'); sidebar.classList.toggle('open', open); sidebar.setAttribute('aria-hidden', String(!open));
  $('controlToggle').setAttribute('aria-expanded', String(open)); if (open && pointerLocked) document.exitPointerLock();
});
$('closeControls').addEventListener('click', () => { sidebar.classList.remove('open'); sidebar.setAttribute('aria-hidden', 'true'); $('controlToggle').setAttribute('aria-expanded', 'false'); });
$('pauseButton').addEventListener('click', () => { $('pauseOverlay').classList.add('open'); $('pauseOverlay').setAttribute('aria-hidden', 'false'); if (pointerLocked) document.exitPointerLock(); });
$('resumeButton').addEventListener('click', () => { $('pauseOverlay').classList.remove('open'); $('pauseOverlay').setAttribute('aria-hidden', 'true'); });

function resize() { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); }
window.addEventListener('resize', resize); resize();
const forward = new THREE.Vector3(), right = new THREE.Vector3(), viewDirection = new THREE.Vector3(), clock = new THREE.Clock();
function update(dt) {
  const paused = sidebar.classList.contains('open') || objectPanel.classList.contains('open') || $('pauseOverlay').classList.contains('open');
  const speed = keys.has('ShiftLeft') || keys.has('ShiftRight') ? 8 : 4.8;
  if (!paused) {
    forward.set(-Math.sin(yaw), 0, -Math.cos(yaw)); right.set(Math.cos(yaw), 0, -Math.sin(yaw));
    let dx = 0, dz = 0;
    if (keys.has('KeyW')) { dx += forward.x * speed * dt; dz += forward.z * speed * dt; }
    if (keys.has('KeyS')) { dx -= forward.x * speed * dt; dz -= forward.z * speed * dt; }
    if (keys.has('KeyD')) { dx += right.x * speed * dt; dz += right.z * speed * dt; }
    if (keys.has('KeyA')) { dx -= right.x * speed * dt; dz -= right.z * speed * dt; }
    const nextX = THREE.MathUtils.clamp(player.position.x + dx, -90, 90);
    if (!collidesAt(nextX, player.position.z)) player.position.x = nextX;
    const nextZ = THREE.MathUtils.clamp(player.position.z + dz, -90, 65);
    if (!collidesAt(player.position.x, nextZ)) player.position.z = nextZ;
    player.position.y = floorHeight(player.position.x, player.position.z, player.position.y);
    if (dx || dz) player.rotation.y = yaw + Math.PI;
  }
  camera.position.set(player.position.x + Math.sin(yaw) * 7.5, player.position.y + 4.1 + pitch * 3, player.position.z + Math.cos(yaw) * 7.5);
  camera.lookAt(player.position.x - Math.sin(yaw) * 6, player.position.y + 1.5 + pitch * 5, player.position.z - Math.cos(yaw) * 6);
  camera.updateMatrixWorld();

  nearby = findTarget(center, 16);
  if (!nearby) {
    camera.getWorldDirection(viewDirection); let best = 13;
    for (const group of clickables) {
      const pos = group.getWorldPosition(new THREE.Vector3()), to = pos.sub(camera.position), distance = to.length();
      if (distance < best && viewDirection.dot(to.normalize()) > .86) { best = distance; nearby = group; }
    }
  }
  prompt.classList.toggle('visible', Boolean(nearby) && !paused);
  if (nearby) {
    const item = nearby.userData.item;
    prompt.querySelector('span').textContent = nearby.userData.kind === 'crate' ? `Open crate · ${item.name}` : `Inspect ${item.name}`;
  }
  const mass = game()?.totalMass;
  if (mass != null && $('worldMass')) $('worldMass').textContent = `SHIP MASS ${mass.toLocaleString()} KG`;

  if (!pointerLocked && !paused && mouse.x >= 0 && mouse.y >= 0) {
    const target = findTarget(pointerRay(mouse.x, mouse.y), 60);
    if (target) showHover(target, mouse.x, mouse.y); else hideHover();
  } else hideHover();
}
function animate() {
  requestAnimationFrame(animate); const dt = Math.min(clock.getDelta(), .05); update(dt);
  earth.rotation.y += dt * .003; starMaterial.opacity = .84 + Math.sin(clock.elapsedTime * .3) * .06;
  renderer.render(scene, camera);
}
window.renderSpacecraft3D = rebuildInstalled;
populateCrates(); rebuildInstalled(game()?.components || []); renderHotbar(); animate();
