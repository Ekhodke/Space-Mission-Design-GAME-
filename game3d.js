import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

const canvas = document.getElementById('spaceCanvas');
const stage = document.getElementById('spacecraftStage');
if (!canvas || !stage) throw new Error('Spacecraft assembly stage is missing.');

const scene = new THREE.Scene();
scene.background = new THREE.Color('#091725');
scene.fog = new THREE.Fog('#091725', 13, 30);
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(7.5, 5.2, 9.5);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

scene.add(new THREE.HemisphereLight(0xb9e8ff, 0x162638, 2.1));
const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
keyLight.position.set(5, 9, 6);
keyLight.castShadow = true;
scene.add(keyLight);
const fillLight = new THREE.PointLight(0x55c9ff, 35, 18);
fillLight.position.set(-5, 3, 2);
scene.add(fillLight);

const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: '#0a1926', roughness: 0.88, metalness: 0.12 }));
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.02;
floor.receiveShadow = true;
scene.add(floor);
const grid = new THREE.GridHelper(28, 28, 0x1e526e, 0x15344a);
grid.position.y = 0.006;
scene.add(grid);

// A compact modular spacecraft with clickable, removable hardware.
const ship = new THREE.Group();
scene.add(ship);
const metal = new THREE.MeshStandardMaterial({ color: '#9eb6c7', metalness: 0.78, roughness: 0.3 });
const white = new THREE.MeshStandardMaterial({ color: '#e5edf1', metalness: 0.45, roughness: 0.38 });
const dark = new THREE.MeshStandardMaterial({ color: '#203c50', metalness: 0.65, roughness: 0.34 });
const gold = new THREE.MeshStandardMaterial({ color: '#f0b955', metalness: 0.55, roughness: 0.35 });
const hull = new THREE.Mesh(new THREE.BoxGeometry(2.45, 0.74, 1.28), white);
hull.castShadow = true; hull.receiveShadow = true; ship.add(hull);
const nose = new THREE.Mesh(new THREE.ConeGeometry(0.52, 1.05, 8), metal);
nose.rotation.z = -Math.PI / 2; nose.position.x = 1.72; nose.castShadow = true; ship.add(nose);
const engine = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.38, 0.72, 12), dark);
engine.rotation.z = Math.PI / 2; engine.position.x = -1.5; engine.castShadow = true; ship.add(engine);
const engineGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 0.15, 12), new THREE.MeshBasicMaterial({ color: '#57d7ff' }));
engineGlow.rotation.z = Math.PI / 2; engineGlow.position.x = -1.92; ship.add(engineGlow);
const panelMat = new THREE.MeshStandardMaterial({ color: '#236e9b', emissive: '#0c3856', metalness: 0.35, roughness: 0.42 });
for (const side of [-1, 1]) {
  const arm = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.12, 0.15), metal); arm.position.set(-0.15, 0, side * 1.1); ship.add(arm);
  const solar = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.08, 0.78), panelMat); solar.position.set(-0.15, 0.02, side * 1.75); solar.castShadow = true; ship.add(solar);
  for (let i = 0; i < 5; i++) { const line = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.012, 0.018), new THREE.MeshBasicMaterial({ color: '#60bce6' })); line.position.set(-0.15, 0.07, side * (1.43 + i * 0.16)); ship.add(line); }
}
const dish = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), white);
dish.position.set(-0.7, 0.62, 0.15); dish.rotation.x = -0.5; dish.castShadow = true; ship.add(dish);
const dishStem = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.46, 8), gold); dishStem.position.set(-0.7, 0.42, 0.15); ship.add(dishStem);
ship.position.set(0, 2.05, 0);

// Stylized 3D crew: suit, helmet, visor, oxygen pack, arms and boots.
function makeAstronaut(x, z, suitColor, visorColor, label) {
  const group = new THREE.Group();
  const suitMat = new THREE.MeshStandardMaterial({ color: suitColor, roughness: 0.58, metalness: 0.1 });
  const visorMat = new THREE.MeshStandardMaterial({ color: visorColor, metalness: 0.7, roughness: 0.18, emissive: visorColor, emissiveIntensity: 0.08 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.36, 0.66, 5, 10), suitMat); body.position.y = 1.05; body.castShadow = true; group.add(body);
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.37, 20, 16), suitMat); helmet.position.y = 1.78; helmet.castShadow = true; group.add(helmet);
  const visor = new THREE.Mesh(new THREE.SphereGeometry(0.275, 20, 12), visorMat); visor.scale.set(1, 0.76, 0.42); visor.position.set(0, 1.79, 0.28); group.add(visor);
  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.57, 0.22), dark); pack.position.set(0, 1.1, -0.34); pack.castShadow = true; group.add(pack);
  for (const side of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.45, 4, 8), suitMat); arm.position.set(side * 0.43, 1.05, 0.02); arm.rotation.z = side * -0.22; arm.castShadow = true; group.add(arm);
    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.28, 0.33), dark); boot.position.set(side * 0.18, 0.16, 0.05); boot.castShadow = true; group.add(boot);
  }
  const badge = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.035), gold); badge.position.set(0.17, 1.22, 0.345); group.add(badge);
  group.position.set(x, 0, z); group.userData.label = label; scene.add(group);
  return group;
}
const crew = [makeAstronaut(-3.2, 0.7, '#ecf2f5', '#55caff', 'Commander'), makeAstronaut(3.1, 0.45, '#e8a94b', '#a8e8ff', 'Engineer')];
crew[0].rotation.y = -0.52; crew[1].rotation.y = 0.6;

// Tool cabinets and soft studio lights make the hangar feel occupied.
for (const x of [-5.1, 5.1]) {
  const cabinet = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.5, 0.72), dark); cabinet.position.set(x, 1.25, -2.6); cabinet.castShadow = true; scene.add(cabinet);
  for (let y = 0; y < 3; y++) { const drawer = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.04, 0.74), gold); drawer.position.set(x, 0.65 + y * 0.55, -2.6); scene.add(drawer); }
}
const starGroup = new THREE.Group();
for (let i = 0; i < 100; i++) { const dot = new THREE.Mesh(new THREE.SphereGeometry(0.018 + Math.random() * 0.022, 5, 5), new THREE.MeshBasicMaterial({ color: i % 4 === 0 ? '#69d5ff' : '#b4d8e9', transparent: true, opacity: 0.45 + Math.random() * 0.5 })); dot.position.set((Math.random() - .5) * 25, 3 + Math.random() * 12, -6 - Math.random() * 15); starGroup.add(dot); }
scene.add(starGroup);

const componentMeshes = new Map();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
function componentColor(id) { return ({ 'composite-bus':'#55bde2','solar-array':'#38a8dd','battery-pack':'#50c994','deep-space-comms':'#e9b34d','autonomy-core':'#bc8cff',optical:'#75cfff',thermal:'#ff805e',radar:'#7ee2bd',spectral:'#e2a8ff',communications:'#f3ce68' })[id] || '#69c5ed'; }
function rebuildComponents(items = []) {
  for (const mesh of componentMeshes.values()) { ship.remove(mesh); mesh.geometry.dispose(); }
  componentMeshes.clear();
  items.forEach((item, index) => {
    const material = new THREE.MeshStandardMaterial({ color: componentColor(item.id), emissive: componentColor(item.id), emissiveIntensity: 0.12, metalness: 0.52, roughness: 0.3 });
    const instrument = item.category === 'instrument';
    let geometry = instrument ? new THREE.CylinderGeometry(0.22, 0.28, 0.48, 12) : new THREE.BoxGeometry(0.55, 0.42, 0.5);
    const part = new THREE.Mesh(geometry, material);
    const slot = index % 5;
    part.position.set(-0.8 + slot * 0.4, 0.58 + Math.floor(index / 5) * 0.43, index % 2 ? -0.28 : 0.28);
    part.castShadow = true; part.userData.componentId = item.id; part.userData.category = item.category; part.userData.name = item.name;
    ship.add(part); componentMeshes.set(item.id, part);
  });
}
canvas.addEventListener('click', event => {
  const rect = canvas.getBoundingClientRect(); pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1; pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects([...componentMeshes.values()], false)[0];
  if (!hit) return;
  const { componentId, category, name } = hit.object.userData;
  window.spaceMissionGameDesign?.removeComponent(category, componentId);
  const toast = document.getElementById('stageToast'); toast.textContent = `${name} removed · mass and resources updated`; toast.classList.add('visible'); setTimeout(() => toast.classList.remove('visible'), 2200);
});
canvas.addEventListener('pointermove', event => {
  const rect = canvas.getBoundingClientRect(); pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1; pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera); canvas.style.cursor = raycaster.intersectObjects([...componentMeshes.values()], false).length ? 'pointer' : 'grab';
});
let dragging = false, previous = { x: 0, y: 0 }, userMoved = false;
canvas.addEventListener('pointerdown', e => { dragging = true; previous = { x: e.clientX, y: e.clientY }; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointerup', () => { dragging = false; });
canvas.addEventListener('pointermove', e => { if (!dragging || e.buttons !== 1) return; const dx=e.clientX-previous.x, dy=e.clientY-previous.y; previous={x:e.clientX,y:e.clientY}; if(Math.abs(dx)+Math.abs(dy)>1)userMoved=true; camera.position.applyAxisAngle(new THREE.Vector3(0,1,0),-dx*.006); camera.position.y=Math.max(2.8,Math.min(9,camera.position.y+dy*.018)); camera.lookAt(0,1.15,0); });
function resize() { const rect=stage.getBoundingClientRect(); const width=Math.max(1,rect.width), height=Math.max(250,Math.min(440,width*.45)); renderer.setSize(width,height,false); camera.aspect=width/height;camera.updateProjectionMatrix(); }
new ResizeObserver(resize).observe(stage);resize();camera.lookAt(0,1.1,0);
window.renderSpacecraft3D = rebuildComponents;
if (window.spaceMissionGameDesign) rebuildComponents(window.spaceMissionGameDesign.components);
const clock = new THREE.Clock();
function animate() { requestAnimationFrame(animate); const time=clock.getElapsedTime(); ship.rotation.y=userMoved?ship.rotation.y:Math.sin(time*.22)*.13; crew[0].rotation.y=-.52+Math.sin(time*.8)*.04; crew[1].rotation.y=.6-Math.sin(time*.8)*.04; renderer.render(scene,camera); }
animate();
