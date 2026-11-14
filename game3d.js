// Load Three.js dynamically and make CDN failures visible instead of leaving a still canvas.
let THREE;
try {
  THREE = await import('https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js');
} catch (firstError) {
  try { THREE = await import('https://unpkg.com/three@0.164.1/build/three.module.js'); }
  catch (error) {
    const notice = document.createElement('div');
    notice.style.cssText = 'position:fixed;z-index:9999;inset:auto 16px 16px;padding:14px 18px;background:#401d20;color:white;border:1px solid #ff7954;border-radius:10px;font:14px sans-serif';
    notice.textContent = 'The 3D engine could not load. Run from a local server, check your internet connection, then refresh.';
    document.body.appendChild(notice);
    throw error;
  }
}

const canvas = document.getElementById('spaceCanvas');
const world = document.getElementById('game');
const prompt = document.getElementById('interactionPrompt');
const sidebar = document.getElementById('controlSidebar');
const objectPanel = document.getElementById('objectPanel');
if (!canvas || !world || !prompt || !sidebar || !objectPanel) throw new Error('Game interface is incomplete. Download the latest project files.');

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
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
scene.add(new THREE.HemisphereLight(0xb9c9e8, 0x392b2c, 1.5));
const sun = new THREE.DirectionalLight(0xffc28a, 2.4);
sun.position.set(-25, 40, 20); sun.castShadow = true; scene.add(sun);
const earthLight = new THREE.PointLight(0xff4b2d, 220, 100);
earthLight.position.set(-5, 12, -78); scene.add(earthLight);
const blueFill = new THREE.PointLight(0x67aaff, 90, 120);
blueFill.position.set(12, 13, 16); scene.add(blueFill);

// Starfield and dying Earth.
const starPositions = [], starColors = [];
for (let i=0;i<2400;i++) { const r=180+Math.random()*150,t=Math.random()*Math.PI*2,p=Math.acos(2*Math.random()-1),warm=Math.random()<.12;starPositions.push(r*Math.sin(p)*Math.cos(t),r*Math.cos(p),r*Math.sin(p)*Math.sin(t));starColors.push(warm?1:.65+Math.random()*.3,warm?.48:.72+Math.random()*.25,warm?.28:1); }
const starGeometry=new THREE.BufferGeometry();starGeometry.setAttribute('position',new THREE.Float32BufferAttribute(starPositions,3));starGeometry.setAttribute('color',new THREE.Float32BufferAttribute(starColors,3));
const starMaterial=new THREE.PointsMaterial({size:.8,vertexColors:true,transparent:true,opacity:.9});scene.add(new THREE.Points(starGeometry,starMaterial));
const earthGroup=new THREE.Group();earthGroup.position.set(-22,19,-115);scene.add(earthGroup);
const earth=new THREE.Mesh(new THREE.SphereGeometry(22,48,36),new THREE.MeshStandardMaterial({color:0x536273,roughness:.94,emissive:0x3c1715,emissiveIntensity:.42}));earthGroup.add(earth);
earthGroup.add(new THREE.Mesh(new THREE.SphereGeometry(23.4,40,32),new THREE.MeshBasicMaterial({color:0xff6542,side:THREE.BackSide,transparent:true,opacity:.2})));
const moon=new THREE.Mesh(new THREE.SphereGeometry(6,24,20),new THREE.MeshStandardMaterial({color:0x92939a,roughness:1}));moon.position.set(36,28,-130);scene.add(moon);

// Rocky salvage field.
const ground=new THREE.Mesh(new THREE.PlaneGeometry(420,420),new THREE.MeshStandardMaterial({color:0x25252b,roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.16;ground.receiveShadow=true;scene.add(ground);
const grid=new THREE.GridHelper(420,90,0x514438,0x292831);grid.position.y=-.14;grid.material.transparent=true;grid.material.opacity=.14;scene.add(grid);
for(let i=0;i<100;i++){const size=.25+Math.random()*1.6,a=Math.random()*Math.PI*2,d=13+Math.random()*85;const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(size),new THREE.MeshStandardMaterial({color:i%3?0x56504c:0x34343b,roughness:1}));rock.position.set(Math.cos(a)*d,size*.4,Math.sin(a)*d);rock.rotation.set(Math.random()*3,Math.random()*3,Math.random()*3);rock.scale.y=.5;rock.castShadow=true;scene.add(rock);}

function addMesh(parent,geometry,material,pos,rotation){const m=new THREE.Mesh(geometry,material);m.position.set(...pos);if(rotation)m.rotation.set(...rotation);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
const ship=new THREE.Group();ship.position.set(0,2.4,-12);scene.add(ship);
const hull=new THREE.MeshStandardMaterial({color:0xb8c1c6,metalness:.6,roughness:.35}),steel=new THREE.MeshStandardMaterial({color:0x566879,metalness:.7,roughness:.32});
addMesh(ship,new THREE.CylinderGeometry(1.6,2.2,8,12),hull,[0,0,0],[0,0,Math.PI/2]);addMesh(ship,new THREE.ConeGeometry(2.2,4,12),steel,[6,0,0],[0,0,-Math.PI/2]);addMesh(ship,new THREE.CylinderGeometry(1.7,2.1,1.5,12),steel,[-4.5,0,0],[0,0,Math.PI/2]);
for(const side of [-1,1]){addMesh(ship,new THREE.BoxGeometry(8,.16,1),steel,[0,0,side*3.2]);addMesh(ship,new THREE.BoxGeometry(8,.12,4),new THREE.MeshStandardMaterial({color:0x277cb0,emissive:0x092a48}),[-1,.1,side*5.3]);for(let j=0;j<7;j++)addMesh(ship,new THREE.BoxGeometry(.035,.025,3.8),new THREE.MeshBasicMaterial({color:0x74c9f1}),[-4.5+j*1.15,.18,side*5.3]);}
const pad=new THREE.Mesh(new THREE.CylinderGeometry(14,15,.3,40),new THREE.MeshStandardMaterial({color:0x393d43,metalness:.4,roughness:.7}));pad.position.set(0,-.05,-12);scene.add(pad);
for(let i=0;i<12;i++){const a=i/12*Math.PI*2;addMesh(scene,new THREE.BoxGeometry(.28,.18,.28),new THREE.MeshBasicMaterial({color:0xff653c}),[Math.cos(a)*12,.18,-12+Math.sin(a)*12]);}

// Third-person astronaut avatar.
const player=new THREE.Group();scene.add(player);const suit=new THREE.MeshStandardMaterial({color:0xd9e1e4,roughness:.58}),visor=new THREE.MeshStandardMaterial({color:0x3e9fc2,metalness:.7,roughness:.2,emissive:0x102e42});
addMesh(player,new THREE.CapsuleGeometry(.43,.75,5,10),suit,[0,1.08,0]);addMesh(player,new THREE.SphereGeometry(.39,18,14),suit,[0,1.87,0]);const visorMesh=addMesh(player,new THREE.SphereGeometry(.29,16,12),visor,[0,1.88,.29]);visorMesh.scale.set(1,.75,.43);addMesh(player,new THREE.BoxGeometry(.5,.62,.3),steel,[0,1.08,-.42]);
for(const side of [-1,1]){addMesh(player,new THREE.CapsuleGeometry(.13,.5,4,8),suit,[side*.48,1.06,0],[0,0,side*-.15]);addMesh(player,new THREE.BoxGeometry(.25,.3,.38),steel,[side*.19,.22,.04]);}player.position.set(0,0,4);

const clickables=[],crateObjects=new Map(),installedObjects=new Map();
const catalog=()=>window.spaceMissionGameDesign?.catalog||[];
function makeCrate(item,index){
  const group=new THREE.Group(),wood=new THREE.MeshStandardMaterial({color:index%2?0x79502f:0x93633a,roughness:.9}),iron=new THREE.MeshStandardMaterial({color:0x3e332a,metalness:.25,roughness:.7});
  addMesh(group,new THREE.BoxGeometry(1.8,1.25,1.45),wood,[0,.64,0]);
  for(const x of[-.65,.65])addMesh(group,new THREE.BoxGeometry(.13,1.35,.1),iron,[x,.64,.76]);
  for(const y of[.22,1.05])addMesh(group,new THREE.BoxGeometry(1.75,.12,.1),iron,[0,y,.76]);
  const marker=new THREE.Mesh(new THREE.BoxGeometry(.42,.2,.08),new THREE.MeshBasicMaterial({color:0x6acfff}));marker.position.set(0,1.42,0);group.add(marker);
  group.userData={kind:'crate',item};
  const positions=[[-5,0,0],[5,0,1],[-9,0,-7],[8,0,-10],[-5,0,-18],[9,0,-22],[14,0,-3],[-15,0,-12],[4,0,10],[-12,0,8]];
  group.position.set(...positions[index%positions.length]);group.rotation.y=(Math.random()-.5)*.8;scene.add(group);crateObjects.set(item.id,group);clickables.push(group);
}
function populateCrates(){for(const group of crateObjects.values())scene.remove(group);crateObjects.clear();for(let i=clickables.length-1;i>=0;i--)if(clickables[i].userData.kind==='crate')clickables.splice(i,1);catalog().forEach(makeCrate);}
function rebuildInstalled(items=[]){for(const group of installedObjects.values()){ship.remove(group);const i=clickables.indexOf(group);if(i>=0)clickables.splice(i,1);}installedObjects.clear();items.forEach((item,index)=>{const group=new THREE.Group(),color=({'composite-bus':0x5bb9db,'solar-array':0x329bd1,'battery-pack':0x50c994,'deep-space-comms':0xe9b34d,'autonomy-core':0xbc8cff,optical:0x75cfff,thermal:0xff805e,radar:0x7ee2bd,spectral:0xe2a8ff,communications:0xf3ce68})[item.id]||0x72c8ed,material=new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.14,metalness:.5,roughness:.32});addMesh(group,item.category==='instrument'?new THREE.CylinderGeometry(.3,.42,.62,12):new THREE.BoxGeometry(.78,.62,.72),material,[0,0,0],item.category==='instrument'?[Math.PI/2,0,0]:null);group.position.set(-1.9+(index%4)*1.25,1.3+Math.floor(index/4)*.85,index%2?1.4:-1.4);group.userData={kind:'installed',item};ship.add(group);installedObjects.set(item.id,group);clickables.push(group);});}

function toast(message){const el=document.getElementById('toast');el.textContent=message;el.classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('visible'),2300);}
function closeObjectPanel(){objectPanel.classList.remove('open');objectPanel.setAttribute('aria-hidden','true');}
function showObject(group){if(!group)return;const item=group.userData.item,isCrate=group.userData.kind==='crate',isInstalled=group.userData.kind==='installed',content=document.getElementById('objectPanelContent');content.innerHTML=`<span class="object-type">${isCrate?'FIELD SALVAGE':isInstalled?'INSTALLED HARDWARE':'FLIGHT VEHICLE'}</span><h2>${item?.name||'Ark spacecraft'}</h2><p class="object-description">${item?.description||'Humanity’s last chance. Build a balanced ship and prepare its flight systems.'}</p>${item?`<div class="object-stats"><div><span>Mass</span><strong>${item.mass} kg</strong></div><div><span>Power</span><strong>${item.power} kW</strong></div><div><span>Budget</span><strong>$${item.cost}M</strong></div><div><span>Data</span><strong>${item.data} GB/day</strong></div></div><button id="objectAction" class="primary-button object-action" type="button">${isInstalled?'Remove from ship':'Recover cargo'}</button>`:'<button id="objectAction" class="primary-button object-action" type="button">Open flight controls</button>'}`;
  document.getElementById('objectAction').addEventListener('click',()=>{if(!item){document.getElementById('controlToggle').click();closeObjectPanel();return;}if(isInstalled){window.spaceMissionGameDesign?.removeComponent(item.category,item.id);toast(`${item.name} removed from the ark`);}else{const recovered=window.spaceMissionGameDesign?.recoverCargo(item.category,item.id);if(recovered){const crate=crateObjects.get(item.id);if(crate){scene.remove(crate);crateObjects.delete(item.id);const i=clickables.indexOf(crate);if(i>=0)clickables.splice(i,1);}toast(`${item.name} recovered · drag its cargo slot onto the ship to install`);}else toast('Already recovered or installed.');}closeObjectPanel();});objectPanel.classList.add('open');objectPanel.setAttribute('aria-hidden','false');}
document.getElementById('closeObjectPanel').addEventListener('click',closeObjectPanel);

const raycaster=new THREE.Raycaster(),center=new THREE.Vector2(0,0),pointer=new THREE.Vector2();let yaw=0,pitch=-.12,pointerLocked=false,nearby=null;
function findTarget(ray,range=7){raycaster.setFromCamera(ray,camera);const hit=raycaster.intersectObjects(clickables,true).find(result=>result.distance<=range);if(!hit)return null;let target=hit.object;while(target&&!target.userData.kind)target=target.parent;return target||null;}
function pickAtScreen(clientX,clientY){const rect=canvas.getBoundingClientRect();pointer.set((clientX-rect.left)/rect.width*2-1,-((clientY-rect.top)/rect.height)*2+1);camera.updateMatrixWorld();return findTarget(pointer,18);}
canvas.addEventListener('click',event=>{if(sidebar.classList.contains('open')||objectPanel.classList.contains('open'))return;if(!pointerLocked){const target=pickAtScreen(event.clientX,event.clientY);if(target){showObject(target);return;}canvas.requestPointerLock?.();return;}const target=findTarget(center,18);if(target)showObject(target);});
document.addEventListener('pointerlockchange',()=>{pointerLocked=document.pointerLockElement===canvas;});
document.addEventListener('mousemove',event=>{if(!pointerLocked||sidebar.classList.contains('open')||objectPanel.classList.contains('open'))return;yaw-=event.movementX*.0022;pitch=THREE.MathUtils.clamp(pitch-event.movementY*.0018,-.55,.4);});
const keys=new Set();window.addEventListener('keydown',event=>{if(['KeyW','KeyA','KeyS','KeyD','Space'].includes(event.code))event.preventDefault();keys.add(event.code);if(event.code==='KeyE'&&!event.repeat){if(nearby)showObject(nearby);else toast('Aim at a marked crate or move closer, then press E.');}if(event.code==='Escape'&&objectPanel.classList.contains('open'))closeObjectPanel();});window.addEventListener('keyup',event=>keys.delete(event.code));window.addEventListener('blur',()=>keys.clear());

function renderHotbar(){const bar=document.getElementById('inventoryHotbar'),cargo=window.spaceMissionGameDesign?.cargo||[];if(!bar)return;bar.innerHTML=cargo.length?cargo.map((item,i)=>`<button class="inventory-slot" type="button" draggable="true" data-cargo="${item.id}"><span class="slot-number">${i+1}</span><span class="slot-icon">${item.category==='instrument'?'◉':'▰'}</span><strong>${item.name}</strong><small>${item.mass} kg</small></button>`).join(''):'<div class="empty-inventory">Explore the crates to find ship components</div>';bar.querySelectorAll('[data-cargo]').forEach(button=>button.addEventListener('dragstart',event=>{event.dataTransfer.setData('text/plain',JSON.stringify({id:button.dataset.cargo,category:'cargo'}));event.dataTransfer.effectAllowed='move';}));}
canvas.addEventListener('dragover',event=>{event.preventDefault();world.classList.add('drop-hover');});canvas.addEventListener('dragleave',()=>world.classList.remove('drop-hover'));canvas.addEventListener('drop',event=>{event.preventDefault();world.classList.remove('drop-hover');try{const data=JSON.parse(event.dataTransfer.getData('text/plain'));if(data.category!=='cargo')return;const item=window.spaceMissionGameDesign?.installCargo(data.id);if(item)toast(`${item.name} installed · ship mass updated`);else toast('Cargo is no longer available.');}catch(error){/* Ignore non-game drops. */}});
window.addEventListener('spacegameinventory',renderHotbar);window.addEventListener('spacegamecomponents',event=>rebuildInstalled(event.detail||[]));
document.getElementById('controlToggle').addEventListener('click',()=>{const open=!sidebar.classList.contains('open');sidebar.classList.toggle('open',open);sidebar.setAttribute('aria-hidden',String(!open));document.getElementById('controlToggle').setAttribute('aria-expanded',String(open));if(open&&pointerLocked)document.exitPointerLock();});document.getElementById('closeControls').addEventListener('click',()=>{sidebar.classList.remove('open');sidebar.setAttribute('aria-hidden','true');document.getElementById('controlToggle').setAttribute('aria-expanded','false');});
document.getElementById('pauseButton').addEventListener('click',()=>{document.getElementById('pauseOverlay').classList.add('open');document.getElementById('pauseOverlay').setAttribute('aria-hidden','false');if(pointerLocked)document.exitPointerLock();});document.getElementById('resumeButton').addEventListener('click',()=>{document.getElementById('pauseOverlay').classList.remove('open');document.getElementById('pauseOverlay').setAttribute('aria-hidden','true');});

function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);}window.addEventListener('resize',resize);resize();
const forward=new THREE.Vector3(),right=new THREE.Vector3(),viewDirection=new THREE.Vector3(),clock=new THREE.Clock();
function update(dt){const speed=keys.has('ShiftLeft')||keys.has('ShiftRight')?11:6;forward.set(-Math.sin(yaw),0,-Math.cos(yaw));right.set(Math.cos(yaw),0,-Math.sin(yaw));if(keys.has('KeyW'))player.position.addScaledVector(forward,speed*dt);if(keys.has('KeyS'))player.position.addScaledVector(forward,-speed*dt);if(keys.has('KeyD'))player.position.addScaledVector(right,speed*dt);if(keys.has('KeyA'))player.position.addScaledVector(right,-speed*dt);player.position.x=THREE.MathUtils.clamp(player.position.x,-85,85);player.position.z=THREE.MathUtils.clamp(player.position.z,-85,50);const moving=['KeyW','KeyA','KeyS','KeyD'].some(k=>keys.has(k));if(moving)player.rotation.y=yaw+Math.PI;player.userData.step=(player.userData.step||0)+dt*(moving?12:2);player.position.y=moving?Math.abs(Math.sin(player.userData.step))*.07:0;
  camera.position.set(player.position.x+Math.sin(yaw)*8,player.position.y+4.2+pitch*4,player.position.z+Math.cos(yaw)*8);camera.lookAt(player.position.x-Math.sin(yaw)*7,player.position.y+1.6+pitch*9,player.position.z-Math.cos(yaw)*7);camera.updateMatrixWorld();
  // Target selection has a generous aim cone so pressing E is reliable even without pixel-perfect aiming.
  const aimed=findTarget(center,8);nearby=aimed;if(!nearby){camera.getWorldDirection(viewDirection);let best=8;for(const group of clickables){const pos=group.getWorldPosition(new THREE.Vector3()),to=pos.sub(camera.position),distance=to.length(),alignment=viewDirection.dot(to.normalize());if(distance<best&&alignment>.72){best=distance;nearby=group;}}}
  prompt.classList.toggle('visible',Boolean(nearby)&&!sidebar.classList.contains('open')&&!objectPanel.classList.contains('open'));if(nearby){const item=nearby.userData.item;prompt.querySelector('span').textContent=nearby.userData.kind==='crate'?`Open crate · ${item?.name||'supplies'}`:`Inspect ${item?.name||'ship'}`;}
  const mass=window.spaceMissionGameDesign?.totalMass;if(mass){const label=document.getElementById('worldMass');if(label)label.textContent=`SHIP MASS ${mass.toLocaleString()} KG`;}}
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);update(dt);earth.rotation.y+=dt*.003;starMaterial.opacity=.84+Math.sin(clock.elapsedTime*.3)*.06;renderer.render(scene,camera);}
window.renderSpacecraft3D=rebuildInstalled;populateCrates();rebuildInstalled(window.spaceMissionGameDesign?.components||[]);renderHotbar();animate();
