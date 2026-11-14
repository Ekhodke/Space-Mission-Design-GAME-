const objectiveData = {
  earth: { id: 'earth', name: 'Earth Climate Watch', tagline: 'Monitor oceans, weather, and climate change patterns.', favored: ['optical', 'thermal', 'radar'], budget: 2600, mass: 1200, power: 1000, description: 'A rapid-response environmental mission focused on multi-band imaging and climate anomalies.' },
  moon: { id: 'moon', name: 'Lunar Resource Prospecting', tagline: 'Map ice deposits and minerals near the lunar south pole.', favored: ['spectral', 'radar', 'thermal'], budget: 2400, mass: 1100, power: 950, description: 'Low-light, resource-focused exploration designed to detect water and usable materials.' },
  mars: { id: 'mars', name: 'Mars Surface Support', tagline: 'Scout landing zones and support future human exploration.', favored: ['optical', 'spectral', 'thermal'], budget: 2800, mass: 1300, power: 1200, description: 'High-value reconnaissance balancing terrain analysis with communications and autonomy.' },
  deep: { id: 'deep', name: 'Deep Space Observatory', tagline: 'Track exoplanet signatures and distant cosmic events.', favored: ['spectral', 'optical', 'communications'], budget: 3100, mass: 1400, power: 1350, description: 'A long-duration science mission emphasizing sensitivity and stable communications.' },
  defense: { id: 'defense', name: 'Planetary Defense Watch', tagline: 'Detect near-Earth objects and hazardous debris.', favored: ['radar', 'optical', 'thermal'], budget: 2700, mass: 1250, power: 1100, description: 'A high-alert reconnaissance mission prioritizing detection speed and orbital coverage.' }
};
const busSystems = [
  { id: 'composite-bus', name: 'Composite Bus', short: 'Lightweight structure', mass: 220, power: 30, cost: 275, data: 0, comms: 15, lifetime: 2, description: 'Strong, lightweight core chassis built for efficient payload packing.' },
  { id: 'solar-array', name: 'High-Efficiency Solar Array', short: 'Power generation', mass: 150, power: 180, cost: 320, data: 0, comms: 10, lifetime: 3, description: 'Adds robust power generation and supports demanding payloads.' },
  { id: 'battery-pack', name: 'Advanced Battery Pack', short: 'Energy reserves', mass: 110, power: 90, cost: 240, data: 0, comms: 5, lifetime: 4, description: 'Improves power stability during eclipses and peak-operation bursts.' },
  { id: 'deep-space-comms', name: 'Deep-Space Communications', short: 'High-gain link', mass: 130, power: 60, cost: 420, data: 30, comms: 70, lifetime: 5, description: 'Higher bandwidth link for distant operations and large data returns.' },
  { id: 'autonomy-core', name: 'Autonomy Core', short: 'Decision support', mass: 80, power: 35, cost: 310, data: 10, comms: 15, lifetime: 4, description: 'Improves onboard analytics and reduces mission operations overhead.' }
];
const instrumentCatalog = [
  { id: 'optical', name: 'Visible Imager', short: 'High-resolution imagery', tags: ['optical'], mass: 120, power: 80, cost: 360, data: 80, comms: 20, lifetime: 1, value: 28, description: 'Excellent for mapping terrain, weather, and orbital observation.' },
  { id: 'thermal', name: 'Thermal IR Sensor', short: 'Heat and surface signature', tags: ['thermal'], mass: 95, power: 60, cost: 340, data: 70, comms: 15, lifetime: 2, value: 24, description: 'Captures thermal anomalies and helps locate volatile resources.' },
  { id: 'radar', name: 'Synthetic Aperture Radar', short: 'All-weather sensing', tags: ['radar'], mass: 150, power: 100, cost: 520, data: 90, comms: 25, lifetime: 2, value: 30, description: 'Penetrates clouds and darkness while mapping surface features.' },
  { id: 'spectral', name: 'Hyperspectral Imager', short: 'Material composition', tags: ['spectral'], mass: 140, power: 110, cost: 540, data: 110, comms: 25, lifetime: 2, value: 34, description: 'Identifies minerals, chemistries, and subtle surface changes.' },
  { id: 'communications', name: 'Relay Transceiver', short: 'High-rate data relay', tags: ['communications'], mass: 100, power: 75, cost: 390, data: 95, comms: 80, lifetime: 2, value: 22, description: 'Expands communications capacity and supports relayed science transfer.' }
];
const orbitData = [
  { id: 'leo', name: 'LEO', orbit: 'Low Earth Orbit', payload: 700, cost: 120, lifetime: 4, description: 'Fast revisit times and easier access, but limited viewing coverage.' },
  { id: 'meo', name: 'MEO', orbit: 'Medium Earth Orbit', payload: 880, cost: 170, lifetime: 6, description: 'Balanced coverage and persistence for communication-heavy missions.' },
  { id: 'lunar', name: 'Lunar Transfer', orbit: 'Cislunar Transfer', payload: 950, cost: 260, lifetime: 9, description: 'Good for lunar missions with a longer travel window and operational risk.' },
  { id: 'mars', name: 'Mars Transfer', orbit: 'Trans-Mars Transfer', payload: 980, cost: 300, lifetime: 12, description: 'Designed for deep-space exploration and extended operations.' }
];
const launchData = [
  { id: 'atlas', name: 'Atlas V', payload: 820, cost: 410, orbits: ['leo', 'meo'], description: 'Flexible medium-lift launcher for Earth-focused missions.' },
  { id: 'falcon', name: 'Falcon Heavy', payload: 980, cost: 540, orbits: ['leo', 'meo', 'lunar'], description: 'High-capacity launcher suited to heavier spacecraft and lunar flight.' },
  { id: 'aries', name: 'Ares LV', payload: 1120, cost: 700, orbits: ['leo', 'meo', 'lunar', 'mars'], description: 'Heavy-lift launch system for deep-space and larger payloads.' }
];
const difficulties = { beginner: { label: 'Beginner', budget: 1.15, mass: 1.1, power: 1.05, multiplier: 0.9 }, standard: { label: 'Standard', budget: 1, mass: 1, power: 1, multiplier: 1 }, advanced: { label: 'Advanced', budget: 0.9, mass: 0.95, power: 0.9, multiplier: 1.15 } };
const roleLabels = ['Mission Lead', 'Spacecraft Engineer', 'Scientist', 'Communications'];
const state = { objectiveId: 'earth', difficulty: 'standard', selectedOrbitId: 'leo', selectedLaunchId: 'atlas', teamSize: 2, activeRoles: new Set(['Mission Lead', 'Scientist']), selectedBus: new Set(['composite-bus', 'solar-array']), selectedInstruments: new Set(['optical', 'thermal']) };
const ui = Object.fromEntries(['objectiveList','difficultyList','roleList','busList','instrumentList','orbitList','launchList','resourceList','payloadMargin','scienceFit','riskLevel','missionReport','teamSize','simulateMission','resetMission'].map(id => [id, document.getElementById(id)]));
function getSelectedOrbit() { return orbitData.find(x => x.id === state.selectedOrbitId) || orbitData[0]; }
function getSelectedLaunch() { return launchData.find(x => x.id === state.selectedLaunchId) || launchData[0]; }
function getSelectedObjective() { return objectiveData[state.objectiveId]; }
function getCurrentDifficulty() { return difficulties[state.difficulty]; }
function getSelectedBusItems() { return busSystems.filter(x => state.selectedBus.has(x.id)); }
function getSelectedInstrumentItems() { return instrumentCatalog.filter(x => state.selectedInstruments.has(x.id)); }
function getTotals() {
  const objective = getSelectedObjective(), difficulty = getCurrentDifficulty(), busItems = getSelectedBusItems(), instrumentItems = getSelectedInstrumentItems();
  const totalMass = Math.round((objective.mass + busItems.reduce((s,x)=>s+x.mass,0) + instrumentItems.reduce((s,x)=>s+x.mass,0)) * difficulty.mass);
  const totalPower = Math.round((objective.power + busItems.reduce((s,x)=>s+x.power,0) + instrumentItems.reduce((s,x)=>s+x.power,0)) * difficulty.power);
  const totalBudget = Math.round((objective.budget - (busItems.reduce((s,x)=>s+x.cost,0) + instrumentItems.reduce((s,x)=>s+x.cost,0) + getSelectedLaunch().cost + getSelectedOrbit().cost)) * difficulty.budget);
  const totalData = busItems.reduce((s,x)=>s+x.data,0) + instrumentItems.reduce((s,x)=>s+x.data,0);
  const totalComms = busItems.reduce((s,x)=>s+x.comms,0) + instrumentItems.reduce((s,x)=>s+x.comms,0);
  const totalLifetime = Math.round(Math.max(4, getSelectedOrbit().lifetime + busItems.reduce((s,x)=>s+x.lifetime,0) + instrumentItems.reduce((s,x)=>s+x.lifetime,0)));
  return { totalMass,totalPower,totalBudget,totalData,totalComms,totalLifetime,busItems,instrumentItems,objective,difficulty };
}
function renderObjectives() {
  ui.objectiveList.innerHTML = '';
  Object.values(objectiveData).forEach(o => { const b=document.createElement('button'); b.className=`selection-button ${state.objectiveId===o.id?'selected':''}`; b.type='button'; b.innerHTML=`<strong>${o.name}</strong><small>${o.tagline}</small>`; b.addEventListener('click',()=>{state.objectiveId=o.id;renderAll();}); ui.objectiveList.appendChild(b); });
}
function renderDifficulty() {
  ui.difficultyList.innerHTML=''; Object.entries(difficulties).forEach(([key,c])=>{const b=document.createElement('button');b.type='button';b.className=`toggle-button ${state.difficulty===key?'active':''}`;b.textContent=c.label;b.addEventListener('click',()=>{state.difficulty=key;renderAll();});ui.difficultyList.appendChild(b);});
}
function renderRoles() {
  ui.roleList.innerHTML=''; roleLabels.forEach(role=>{const b=document.createElement('button');b.type='button';b.className=`toggle-button ${state.activeRoles.has(role)?'active':''}`;b.textContent=role;b.addEventListener('click',()=>{if(state.activeRoles.has(role))state.activeRoles.delete(role);else if(state.activeRoles.size<state.teamSize)state.activeRoles.add(role);renderAll();});ui.roleList.appendChild(b);});
}
function makeDraggable(button, category, item) {
  button.draggable=true; button.dataset.componentId=item.id; button.dataset.componentCategory=category;
  button.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',JSON.stringify({id:item.id,category}));e.dataTransfer.effectAllowed='copy';});
}
function renderBusSystems() {
  ui.busList.innerHTML=''; busSystems.forEach(item=>{const b=document.createElement('button');b.type='button';b.className=`config-item ${state.selectedBus.has(item.id)?'active':''}`;b.innerHTML=`<div class="meta"><strong>${item.name}</strong><span class="stats">${item.mass} kg · ${item.power} kW · $${item.cost}M</span></div><span class="item-state">${state.selectedBus.has(item.id)?'INSTALLED':'＋ ADD'}</span>`;makeDraggable(b,'bus',item);b.addEventListener('click',()=>{toggleComponent('bus',item.id);});ui.busList.appendChild(b);});
}
function renderInstruments() {
  ui.instrumentList.innerHTML=''; instrumentCatalog.forEach(item=>{const b=document.createElement('button');b.type='button';b.className=`config-item ${state.selectedInstruments.has(item.id)?'active':''}`;b.innerHTML=`<div class="meta"><strong>${item.name}</strong><span class="stats">${item.mass} kg · ${item.power} kW · ${item.data} GB/day</span></div><span class="item-state">${state.selectedInstruments.has(item.id)?'INSTALLED':'＋ ADD'}</span>`;makeDraggable(b,'instrument',item);b.addEventListener('click',()=>{toggleComponent('instrument',item.id);});ui.instrumentList.appendChild(b);});
}
function toggleComponent(category,id) { const set=category==='bus'?state.selectedBus:state.selectedInstruments; set.has(id)?set.delete(id):set.add(id);renderAll(); }
function renderOrbits() {
  ui.orbitList.innerHTML='';orbitData.forEach(o=>{const b=document.createElement('button');b.type='button';b.className=`selection-button ${state.selectedOrbitId===o.id?'selected':''}`;b.innerHTML=`<strong>${o.name}</strong><small>${o.description}</small>`;b.addEventListener('click',()=>{state.selectedOrbitId=o.id;renderAll();});ui.orbitList.appendChild(b);});
}
function renderLaunches() {
  ui.launchList.innerHTML='';launchData.forEach(v=>{const b=document.createElement('button');b.type='button';b.className=`selection-button ${state.selectedLaunchId===v.id?'selected':''}`;b.innerHTML=`<strong>${v.name}</strong><small>Payload ${v.payload} kg · $${v.cost}M</small>`;b.addEventListener('click',()=>{state.selectedLaunchId=v.id;renderAll();});ui.launchList.appendChild(b);});
}
function calculateObjectiveFit() { const selected=getSelectedInstrumentItems();if(!selected.length)return 0;return Math.min(100,Math.round(selected.filter(x=>getSelectedObjective().favored.includes(x.id)).length/selected.length*100)); }
function calculateRiskLabel() { const t=getTotals(),l=getSelectedLaunch();let risk=0;if(t.totalMass>l.payload)risk+=30;if(t.totalBudget<0)risk+=25;if(t.totalPower>1400)risk+=18;if(t.totalData>300)risk+=12;if(t.totalComms>220)risk+=8;return risk>=50?'Severe':risk>=25?'High':risk>=10?'Moderate':'Low'; }
function calculateMissionScore() {
  const t=getTotals(),launch=getSelectedLaunch(),fit=calculateObjectiveFit();let score=fit*.5;
  score+=Math.max(0,40-Math.abs(t.totalMass-launch.payload*.7)/12);score+=Math.max(0,25-Math.abs(t.totalPower-1000)/18);score+=Math.max(0,20-Math.abs(t.totalData-200)/12);score+=Math.max(0,15-Math.abs(t.totalComms-150)/10);
  if(t.totalBudget<0)score-=30;if(t.totalMass>launch.payload)score-=25;if(t.totalPower>1400)score-=15;if(t.totalData>300)score-=10;
  const finalScore=Math.max(0,Math.min(100,Math.round(score)));return {score:finalScore,passed:finalScore>=60&&t.totalMass<=launch.payload&&t.totalBudget>=0};
}
function renderResources() {
  const t=getTotals(),launch=getSelectedLaunch(),payloadMargin=launch.payload-t.totalMass;
  const resources=[{label:'Budget',value:`${Math.max(0,t.totalBudget)} M`,percent:Math.min(Math.abs(t.totalBudget)/2500*100,100),over:t.totalBudget<0},{label:'Mass',value:`${t.totalMass} / ${launch.payload} kg`,percent:Math.min(t.totalMass/launch.payload*100,100),over:t.totalMass>launch.payload},{label:'Power',value:`${t.totalPower} kW`,percent:Math.min(t.totalPower/1400*100,100),over:t.totalPower>1400},{label:'Data',value:`${t.totalData} GB/day`,percent:Math.min(t.totalData/300*100,100),over:t.totalData>300},{label:'Comms',value:`${t.totalComms} Gbps`,percent:Math.min(t.totalComms/220*100,100),over:t.totalComms>220},{label:'Lifetime',value:`${t.totalLifetime} years`,percent:Math.min(t.totalLifetime/16*100,100),over:t.totalLifetime<8}];
  ui.resourceList.innerHTML=resources.map(r=>`<div class="resource-row ${r.over?'over':''}"><div class="resource-label"><span>${r.label}</span><strong>${r.value}</strong></div><div class="resource-bar"><div class="resource-bar-fill" style="width:${r.percent}%"></div></div></div>`).join('');
  ui.payloadMargin.textContent=`${payloadMargin} kg`;ui.scienceFit.textContent=`${calculateObjectiveFit()}%`;ui.riskLevel.textContent=calculateRiskLabel();
  const score=calculateMissionScore(),o=getSelectedObjective();ui.missionReport.innerHTML=`<div class="report-header"><div class="score-pill ${score.passed?'':'fail'}">${score.score}/100</div><strong>${o.name}</strong></div><p class="report-placeholder">Configure your spacecraft, complete the control-panel checks, then simulate to generate a mission debrief.</p>`;
  const mass=document.getElementById('buildMass');if(mass)mass.textContent=`${t.totalMass.toLocaleString()} KG TOTAL MASS`;
  window.spaceMissionGameDesign={components:[...getSelectedBusItems().map(x=>({...x,category:'bus'})),...getSelectedInstrumentItems().map(x=>({...x,category:'instrument'}))],totalMass:t.totalMass,removeComponent:toggleComponent};window.renderSpacecraft3D?.(window.spaceMissionGameDesign.components);
}
function generateMissionReport() {
  const t=getTotals(),launch=getSelectedLaunch(),orbit=getSelectedOrbit(),o=getSelectedObjective(),score=calculateMissionScore(),fit=calculateObjectiveFit(),checks=taskState.completed.size;
  const result=score.passed?'Mission accepted for flight review. The design is feasible and aligns with the selected objective.':'Mission needs revision. Check the highlighted resource limits and rebalance the spacecraft before launch.';
  ui.missionReport.innerHTML=`<div class="report-header"><div class="score-pill ${score.passed?'':'fail'}">${score.score}/100</div><strong>${o.name}</strong><span class="report-caption">${calculateRiskLabel()} RISK</span></div><div class="summary-grid"><div class="summary-card"><h4>Design status</h4><p>${result}</p></div><div class="summary-card"><h4>Launch & orbit</h4><p>${launch.name} to ${orbit.orbit}</p></div><div class="summary-card"><h4>Resources</h4><p>${t.totalMass} kg · ${t.totalPower} kW · ${Math.max(0,t.totalBudget)} M remaining</p></div><div class="summary-card"><h4>Science fit</h4><p>${fit}% alignment · ${t.totalData} GB/day generated</p></div><div class="summary-card"><h4>Installed systems</h4><p>${t.busItems.map(x=>x.name).join(', ')||'Core spacecraft only'}</p></div><div class="summary-card"><h4>Science payload</h4><p>${t.instrumentItems.map(x=>x.name).join(', ')||'No instruments installed'}</p></div></div><div class="summary-card"><h4>Systems checks · ${checks}/3 complete</h4><p>${checks===3?'All control-panel tasks passed. Your crew has verified the spacecraft systems.':'Complete the power, calibration, and antenna tasks to verify the spacecraft before launch.'}</p></div>`;
}
function renderAll() { ui.teamSize.value=String(state.teamSize);renderObjectives();renderDifficulty();renderRoles();renderBusSystems();renderInstruments();renderOrbits();renderLaunches();renderResources();generateMissionReport(); }
ui.teamSize.addEventListener('change',e=>{state.teamSize=Number(e.target.value);const active=[...state.activeRoles];if(active.length>state.teamSize)state.activeRoles=new Set(active.slice(0,state.teamSize));renderAll();});
ui.simulateMission.addEventListener('click',()=>{const result=calculateMissionScore(),checks=taskState.completed.size;const message=result.passed?`Flight review passed. Mission score ${result.score}/100; ${checks}/3 crew systems checks complete.`:`Flight review flagged risk. Review mass, budget and payload limits; mission score ${result.score}/100.`;ui.missionReport.insertAdjacentHTML('beforeend',`<div class="summary-card simulation-event"><h4>Simulation debrief</h4><p>${message}</p></div>`);document.querySelector('.bottom-panel').scrollIntoView({behavior:'smooth',block:'nearest'});});
ui.resetMission.addEventListener('click',()=>{state.objectiveId='earth';state.difficulty='standard';state.selectedOrbitId='leo';state.selectedLaunchId='atlas';state.teamSize=2;state.activeRoles=new Set(['Mission Lead','Scientist']);state.selectedBus=new Set(['composite-bus','solar-array']);state.selectedInstruments=new Set(['optical','thermal']);taskState.completed.clear();taskState.powerInput=[];taskState.powerSequence=makePowerSequence();taskState.calibrationTarget=72;taskState.antennaTarget=38;document.getElementById('calibrationDial').value=50;document.getElementById('antennaDial').value=50;document.getElementById('calibrationValue').value='50°';document.getElementById('antennaValue').value='50°';renderAll();renderTasks();showTaskFeedback('Mission reset. Complete the control-panel checks when ready.');});

// Three short, keyboard-accessible control-panel tasks.
const taskState={completed:new Set(),powerInput:[],powerSequence:[],calibrationTarget:72,antennaTarget:38};
function makePowerSequence(){return [2,0,3,1];}
const taskNames={power:'Power routing',calibration:'Sensor calibration',antenna:'Antenna alignment'};
function showTaskFeedback(text,success=false){const el=document.getElementById('taskFeedback');el.textContent=text;el.classList.toggle('success',success);}
function completeTask(id,message){taskState.completed.add(id);renderTasks();renderAll();showTaskFeedback(message,true);}
function renderTasks(){
  const sequence=document.getElementById('powerSequence');sequence.innerHTML=taskState.powerSequence.map((_,i)=>`<span class="sequence-dot ${i<taskState.powerInput.length?'lit':''}">${i<taskState.powerInput.length?'✓':'•'}</span>`).join('');
  const names=['A','B','C','D'];document.getElementById('powerButtons').innerHTML=names.map((name,i)=>`<button class="circuit-button ${taskState.completed.has('power')?'completed':''}" type="button" data-circuit="${i}" aria-label="Circuit ${name}">${name}</button>`).join('');
  document.getElementById('powerButtons').querySelectorAll('[data-circuit]').forEach(button=>button.addEventListener('click',()=>{if(taskState.completed.has('power'))return;const index=Number(button.dataset.circuit);taskState.powerInput.push(index);const pos=taskState.powerInput.length-1;if(taskState.powerSequence[pos]!==index){taskState.powerInput=[];renderTasks();showTaskFeedback('Sequence reset — watch the order and try again.');return;}if(taskState.powerInput.length===taskState.powerSequence.length){completeTask('power','Power routed successfully. The spacecraft bus is energized.');return;}renderTasks();}));
  document.getElementById('taskProgress').textContent=`${taskState.completed.size} / 3 CHECKS`;document.getElementById('readinessChecks').textContent=`${taskState.completed.size} / 3`;
  document.querySelectorAll('.task-card').forEach(card=>{const id=card.dataset.task;if(id)card.classList.toggle('task-done',taskState.completed.has(id));});
  document.getElementById('calibrationConfirm').textContent=taskState.completed.has('calibration')?'Calibration verified':'Confirm calibration';document.getElementById('antennaConfirm').textContent=taskState.completed.has('antenna')?'Signal locked':'Lock signal';
}
document.querySelector('.task-card:nth-child(1)').dataset.task='power';document.querySelector('.task-card:nth-child(2)').dataset.task='calibration';document.querySelector('.task-card:nth-child(3)').dataset.task='antenna';
document.getElementById('calibrationTarget').textContent=taskState.calibrationTarget;document.getElementById('antennaTarget').textContent=taskState.antennaTarget;
for(const [dialId,outputId] of [['calibrationDial','calibrationValue'],['antennaDial','antennaValue']])document.getElementById(dialId).addEventListener('input',e=>{document.getElementById(outputId).value=`${e.target.value}°`;});
document.getElementById('calibrationConfirm').addEventListener('click',()=>{if(Math.abs(Number(document.getElementById('calibrationDial').value)-taskState.calibrationTarget)<=3)completeTask('calibration','Sensor calibrated within ±3°. Science payload is ready.');else showTaskFeedback('Not quite — bring the dial within 3° of the target.');});
document.getElementById('antennaConfirm').addEventListener('click',()=>{if(Math.abs(Number(document.getElementById('antennaDial').value)-taskState.antennaTarget)<=3)completeTask('antenna','Antenna locked within ±3°. Communications link established.');else showTaskFeedback('Signal is still off target — align within 3° and lock again.');});
const stage=document.getElementById('spacecraftStage');stage.addEventListener('dragover',e=>{e.preventDefault();stage.classList.add('drop-ready');e.dataTransfer.dropEffect='copy';});stage.addEventListener('dragleave',e=>{if(!stage.contains(e.relatedTarget))stage.classList.remove('drop-ready');});stage.addEventListener('drop',e=>{e.preventDefault();stage.classList.remove('drop-ready');try{const {id,category}=JSON.parse(e.dataTransfer.getData('text/plain'));const set=category==='bus'?state.selectedBus:state.selectedInstruments;if(!set.has(id)){toggleComponent(category,id);showStageToast('Hardware installed · mass and resources updated');}else showStageToast('That component is already installed.');}catch{showStageToast('Drag a component card into the assembly bay.');}});
let toastTimer;function showStageToast(message){const toast=document.getElementById('stageToast');toast.textContent=message;toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),2200);}
renderAll();renderTasks();
