// Full-screen interactive salvage world. Three.js is loaded from a CDN, so serve this
// page from localhost (not file://) and keep an internet connection available.
let THREE;
try {
  THREE = await import('https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js');
} catch {
  THREE = await import('https://unpkg.com/three@0.164.1/build/three.module.js');
}

const $ = (id) => document.getElementById(id);
const canvas = $('spaceCanvas'), world = $('game'), sidebar = $('controlSidebar');
const objectPanel = $('objectPanel'), prompt = $('interactionPrompt');
if (!canvas || !world || !sidebar || !objectPanel || !prompt) {
  throw new Error('The game HTML and JavaScript are from different versions. Download the latest repository ZIP.');
}
const scene = new THREE.Scene();
scene.background = new THREE.Color('#070912');
scene.fog = new THREE.FogExp2('#090c18', .008);
const camera = new THREE.PerspectiveCamera(68, innerWidth / innerHeight, .1, 500);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = true;
scene.add(new THREE.HemisphereLight(0xb9c9e8, 0x392b2c, 1.5));
const sunlight = new THREE.DirectionalLight(0xffc28a, 2.4);
sunlight.position.set(-25, 40, 20); sunlight.castShadow = true; scene.add(sunlight);
const redLight = new THREE.PointLight(0xff4b2d, 220, 100);
redLight.position.set(-5, 12, -78); scene.add(redLight);

// A deep star field, a damaged Earth, and a lunar destination.
const starPositions = [], starColors = [];
for (let i=0;i<2200;i++) {
  const r=180+Math.random()*150,t=Math.random()*Math.PI*2,p=Math.acos(2*Math.random()-1),warm=Math.random()<.12;
  starPositions.push(r*Math.sin(p)*Math.cos(t),r*Math.cos(p),r*Math.sin(p)*Math.sin(t));
  starColors.push(warm?1:.7,warm?.48:.8,warm?.28:1);
}
const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.Float32BufferAttribute(starPositions,3));starGeo.setAttribute('color',new THREE.Float32BufferAttribute(starColors,3));
const starMat=new THREE.PointsMaterial({size:.8,vertexColors:true,transparent:true,opacity:.9});scene.add(new THREE.Points(starGeo,starMat));
const earthGroup=new THREE.Group();earthGroup.position.set(-22,19,-115);scene.add(earthGroup);
earthGroup.add(new THREE.Mesh(new THREE.SphereGeometry(22,48,36),new THREE.MeshStandardMaterial({color:0x536273,roughness:.94,emissive:0x501b16,emissiveIntensity:.42})));
earthGroup.add(new THREE.Mesh(new THREE.SphereGeometry(23.5,40,32),new THREE.MeshBasicMaterial({color:0xff6542,side:THREE.BackSide,transparent:true,opacity:.2})));
const moon=new THREE.Mesh(new THREE.SphereGeometry(6,24,20),new THREE.MeshStandardMaterial({color:0x92939a,roughness:1}));moon.position.set(36,28,-130);scene.add(moon);

const ground=new THREE.Mesh(new THREE.PlaneGeometry(420,420),new THREE.MeshStandardMaterial({color:0x25252b,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.16;ground.receiveShadow=true;scene.add(ground);
const grid=new THREE.GridHelper(420,90,0x514438,0x292831);grid.position.y=-.14;grid.material.transparent=true;grid.material.opacity=.14;scene.add(grid);
for(let i=0;i<80;i++){const size=.3+Math.random()*1.5,a=Math.random()*Math.PI*2,d=13+Math.random()*75;const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(size),new THREE.MeshStandardMaterial({color:i%3?0x56504c:0x34343b,roughness:1}));rock.position.set(Math.cos(a)*d,size*.4,Math.sin(a)*d);rock.scale.y=.5;rock.rotation.set(Math.random()*3,Math.random()*3,Math.random()*3);scene.add(rock);}
function addMesh(parent,geometry,material,pos,rotation){const m=new THREE.Mesh(geometry,material);m.position.set(...pos);if(rotation)m.rotation.set(...rotation);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}

// The ark and launch pad.
const ship=new THREE.Group();ship.position.set(0,2.4,-12);scene.add(ship);
const hullMat=new THREE.MeshStandardMaterial({color:0xb8c1c6,metalness:.6,roughness:.35}),steel=new THREE.MeshStandardMaterial({color:0x566879,metalness:.7,roughness:.32});
addMesh(ship,new THREE.CylinderGeometry(1.6,2.2,8,12),hullMat,[0,0,0],[0,0,Math.PI/2]);addMesh(ship,new THREE.ConeGeometry(2.2,4,12),steel,[6,0,0],[0,0,-Math.PI/2]);addMesh(ship,new THREE.CylinderGeometry(1.7,2.1,1.5,12),steel,[-4.5,0,0],[0,0,Math.PI/2]);
for(const side of [-1,1]){addMesh(ship,new THREE.BoxGeometry(8,.16,1),steel,[0,0,side*3.2]);addMesh(ship,new THREE.BoxGeometry(8,.12,4),new THREE.MeshStandardMaterial({color:0x277cb0,emissive:0x092a48}),[-1,.1,side*5.3]);}
const pad=new THREE.Mesh(new THREE.CylinderGeometry(14,15,.3,40),new THREE.MeshStandardMaterial({color:0x393d43,metalness:.4,roughness:.7}));pad.position.set(0,-.05,-12);scene.add(pad);

// Player astronaut. WASD moves; dragging the scene rotates the view.
const player=new THREE.Group();scene.add(player);
const suit=new THREE.MeshStandardMaterial({color:0xd9e1e4,roughness:.58}),visorMat=new THREE.MeshStandardMaterial({color:0x3e9fc2,metalness:.7,roughness:.2,emissive:0x102e42});
addMesh(player,new THREE.CapsuleGeometry(.43,.75,5,10),suit,[0,1.08,0]);addMesh(player,new THREE.SphereGeometry(.39,18,14),suit,[0,1.87,0]);const visor=addMesh(player,new THREE.SphereGeometry(.29,16,12),visorMat,[0,1.88,.29]);visor.scale.set(1,.75,.43);player.position.set(0,0,4);

const clickables=[],crates=new Map(),installed=new Map();
const game=()=>window.spaceMissionGameDesign;
const colorFor=id=>({'composite-bus':0x5bb9db,'solar-array':0x329bd1,'battery-pack':0x50c994,'deep-space-comms':0xe9b34d,'autonomy-core':0xbc8cff,optical:0x75cfff,thermal:0xff805e,radar:0x7ee2bd,spectral:0xe2a8ff,communications:0xf3ce68}[id]||0x72c8ed);
function createCrate(item,index){
  const group=new THREE.Group(),wood=new THREE.MeshStandardMaterial({color:index%2?0x79502f:0x93633a,roughness:.92}),iron=new THREE.MeshStandardMaterial({color:0x3e332a,metalness:.25,roughness:.7});
  addMesh(group,new THREE.BoxGeometry(1.8,1.25,1.45),wood,[0,.64,0]);
  for(const x of[-.65,.65])addMesh(group,new THREE.BoxGeometry(.13,1.35,.1),iron,[x,.64,.76]);
  for(const y of[.22,1.05])addMesh(group,new THREE.BoxGeometry(1.75,.12,.1),iron,[0,y,.76]);
  const marker=new THREE.Mesh(new THREE.BoxGeometry(.5,.2,.08),new THREE.MeshBasicMaterial({color:0x68d5ff}));marker.position.set(0,1.43,0);group.add(marker);
  group.userData={kind:'crate',item};
  const positions=[[-5,0,0],[5,0,1],[-9,0,-7],[8,0,-10],[-5,0,-18],[9,0,-22],[14,0,-3],[-15,0,-12],[4,0,10],[-12,0,8]];
  group.position.set(...positions[index%positions.length]);group.rotation.y=(Math.random()-.5)*.8;scene.add(group);crates.set(item.id,group);clickables.push(group);
}
function removeCrate(id){const crate=crates.get(id);if(!crate)return;scene.remove(crate);crates.delete(id);const i=clickables.indexOf(crate);if(i>=0)clickables.splice(i,1);}
function populateCrates(){for(const id of [...crates.keys()])removeCrate(id);(game()?.catalog||[]).forEach(createCrate);}
function rebuildInstalled(items=[]){for(const [id,g] of installed){ship.remove(g);const i=clickables.indexOf(g);if(i>=0)clickables.splice(i,1);}installed.clear();items.forEach((item,index)=>{const group=new THREE.Group(),color=colorFor(item.id),mat=new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.15,metalness:.5,roughness:.32});addMesh(group,item.category==='instrument'?new THREE.CylinderGeometry(.3,.42,.62,12):new THREE.BoxGeometry(.78,.62,.72),mat,[0,0,0],item.category==='instrument'?[Math.PI/2,0,0]:null);group.position.set(-1.9+(index%4)*1.25,1.3+Math.floor(index/4)*.85,index%2?1.4:-1.4);group.userData={kind:'installed',item};ship.add(group);installed.set(item.id,group);clickables.push(group);});}

function toast(text){const el=$('toast');if(!el)return;el.textContent=text;el.classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('visible'),2300);}
function closeObjectPanel(){objectPanel.classList.remove('open');objectPanel.setAttribute('aria-hidden','true');}
function showObject(group){
  if(!group)return;
  const item=group.userData.item,kind=group.userData.kind,isCrate=kind==='crate',isInstalled=kind==='installed';
  const content=$('objectPanelContent');
  content.innerHTML=`<span class="object-type">${isCrate?'FIELD SALVAGE':'INSTALLED HARDWARE'}</span><h2>${item.name}</h2><p class="object-description">${item.description}</p><div class="object-stats"><div><span>Mass</span><strong>${item.mass} kg</strong></div><div><span>Power</span><strong>${item.power} kW</strong></div><div><span>Budget</span><strong>$${item.cost}M</strong></div><div><span>Science data</span><strong>${item.data} GB/day</strong></div></div><button id="objectAction" class="primary-button object-action" type="button">${isCrate?'Recover cargo':'Remove from ship'}</button>`;
  $('objectAction').addEventListener('click',()=>{
    const result=isCrate?game()?.recoverCargo(item.category,item.id):game()?.removeComponent(item.category,item.id);
    if(result){removeCrate(item.id);toast(isCrate?`${item.name} recovered · drag its cargo slot onto the ark`:`${item.name} removed and returned to cargo`);}
    else toast('This component is already in cargo or installed.');
    closeObjectPanel();
  });
  objectPanel.classList.add('open');objectPanel.setAttribute('aria-hidden','false');
}
$('closeObjectPanel').addEventListener('click',closeObjectPanel);

// One shared raycast path powers click, crosshair prompt, and E-to-interact.
const raycaster=new THREE.Raycaster(),center=new THREE.Vector2(0,0),pointer=new THREE.Vector2();
function targetAt(ray,maxDistance=18){camera.updateMatrixWorld(true);raycaster.setFromCamera(ray,camera);const hit=raycaster.intersectObjects(clickables,true).find(h=>h.distance<=maxDistance);if(!hit)return null;let target=hit.object;while(target&&!target.userData.kind)target=target.parent;return target||null;}
function targetFromScreen(x,y){const r=canvas.getBoundingClientRect();pointer.set((x-r.left)/r.width*2-1,-((y-r.top)/r.height)*2+1);return targetAt(pointer);}
let yaw=0,pitch=-.12,nearby=null,dragging=false,last={x:0,y:0};
canvas.addEventListener('pointerdown',e=>{if(e.button!==0||sidebar.classList.contains('open')||objectPanel.classList.contains('open'))return;dragging=true;last={x:e.clientX,y:e.clientY};canvas.setPointerCapture?.(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-last.x,dy=e.clientY-last.y;last={x:e.clientX,y:e.clientY};yaw-=dx*.004;pitch=THREE.MathUtils.clamp(pitch-dy*.003,-.5,.35);});
canvas.addEventListener('pointerup',e=>{if(!dragging)return;dragging=false;const moved=Math.abs(e.clientX-last.x)+Math.abs(e.clientY-last.y);if(moved>8)return;if(sidebar.classList.contains('open')||objectPanel.classList.contains('open'))return;const hit=targetFromScreen(e.clientX,e.clientY);if(hit)showObject(hit);});
canvas.addEventListener('pointercancel',()=>{dragging=false;});
window.addEventListener('keydown',e=>{if(['KeyW','KeyA','KeyS','KeyD','ShiftLeft','ShiftRight'].includes(e.code)&&!['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName))e.preventDefault();if(e.code==='KeyE'&&!e.repeat){if(nearby)showObject(nearby);else toast('Aim at a blue-marked crate, or click it directly.');}if(e.code==='Escape'&&objectPanel.classList.contains('open'))closeObjectPanel();});
const keys=new Set();window.addEventListener('keydown',e=>keys.add(e.code));window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>keys.clear());

// Recovered cargo is draggable. Dropping anywhere on the 3D world installs it.
function renderHotbar(){const bar=$('inventoryHotbar');if(!bar)return;const cargo=game()?.cargo||[];bar.innerHTML=cargo.length?cargo.map((x,i)=>`<button class="inventory-slot" type="button" draggable="true" data-cargo="${x.id}"><span class="slot-number">${i+1}</span><span class="slot-icon">${x.category==='instrument'?'◉':'▰'}</span><strong>${x.name}</strong><small>${x.mass} kg</small></button>`).join(''):'<div class="empty-inventory">Explore the crates to find ship components</div>';bar.querySelectorAll('[data-cargo]').forEach(b=>b.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',JSON.stringify({id:b.dataset.cargo}));e.dataTransfer.effectAllowed='move';}));}
canvas.addEventListener('dragover',e=>{e.preventDefault();world.classList.add('drop-hover');});canvas.addEventListener('dragleave',()=>world.classList.remove('drop-hover'));canvas.addEventListener('drop',e=>{e.preventDefault();world.classList.remove('drop-hover');try{const data=JSON.parse(e.dataTransfer.getData('text/plain')),item=game()?.installCargo(data.id);if(item){removeCrate(item.id);toast(`${item.name} installed · ship mass updated`);}else toast('Cargo could not be installed.');}catch{}});
window.addEventListener('spacegameinventory',renderHotbar);window.addEventListener('spacegamecomponents',e=>rebuildInstalled(e.detail||[]));
$('controlToggle').addEventListener('click',()=>{const open=!sidebar.classList.contains('open');sidebar.classList.toggle('open',open);sidebar.setAttribute('aria-hidden',String(!open));$('controlToggle').setAttribute('aria-expanded',String(open));});
$('closeControls').addEventListener('click',()=>{sidebar.classList.remove('open');sidebar.setAttribute('aria-hidden','true');$('controlToggle').setAttribute('aria-expanded','false');});
$('pauseButton').addEventListener('click',()=>{$('pauseOverlay').classList.add('open');$('pauseOverlay').setAttribute('aria-hidden','false');});
$('resumeButton').addEventListener('click',()=>{$('pauseOverlay').classList.remove('open');$('pauseOverlay').setAttribute('aria-hidden','true');});

function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);}window.addEventListener('resize',resize);resize();
const clock=new THREE.Clock(),forward=new THREE.Vector3(),right=new THREE.Vector3();
function frame(dt){const speed=keys.has('ShiftLeft')||keys.has('ShiftRight')?10:5.5;forward.set(-Math.sin(yaw),0,-Math.cos(yaw));right.set(Math.cos(yaw),0,-Math.sin(yaw));if(keys.has('KeyW'))player.position.addScaledVector(forward,speed*dt);if(keys.has('KeyS'))player.position.addScaledVector(forward,-speed*dt);if(keys.has('KeyD'))player.position.addScaledVector(right,speed*dt);if(keys.has('KeyA'))player.position.addScaledVector(right,-speed*dt);player.position.x=THREE.MathUtils.clamp(player.position.x,-80,80);player.position.z=THREE.MathUtils.clamp(player.position.z,-80,45);
  camera.position.set(player.position.x+Math.sin(yaw)*8,player.position.y+4.1+pitch*3,player.position.z+Math.cos(yaw)*8);camera.lookAt(player.position.x-Math.sin(yaw)*7,player.position.y+1.5+pitch*7,player.position.z-Math.cos(yaw)*7);camera.updateMatrixWorld(true);
  // If the crosshair misses slightly, select the closest crate in a broad forward cone.
  nearby=targetAt(center,10);if(!nearby){const direction=new THREE.Vector3();camera.getWorldDirection(direction);let closest=10;for(const group of clickables){const delta=group.getWorldPosition(new THREE.Vector3()).sub(camera.position),distance=delta.length();if(distance<closest&&direction.dot(delta.normalize())>.68){nearby=group;closest=distance;}}}
  prompt.classList.toggle('visible',Boolean(nearby)&&!sidebar.classList.contains('open')&&!objectPanel.classList.contains('open'));if(nearby){const item=nearby.userData.item;prompt.querySelector('span').textContent=nearby.userData.kind==='crate'?`Open crate · ${item.name}`:`Inspect ${item.name}`;}
  const mass=game()?.totalMass;if(mass&&$('worldMass'))$('worldMass').textContent=`SHIP MASS ${mass.toLocaleString()} KG`;
}
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);frame(dt);earth.rotation.y+=dt*.003;starMat.opacity=.84+Math.sin(clock.elapsedTime*.3)*.06;renderer.render(scene,camera);}
window.renderSpacecraft3D=rebuildInstalled;
populateCrates();rebuildInstalled(game()?.components||[]);renderHotbar();animate();
