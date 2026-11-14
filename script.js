const objectiveData = {
  earth: {
    id: 'earth',
    name: 'Earth Climate Watch',
    tagline: 'Monitor oceans, weather, and climate change patterns.',
    favored: ['optical', 'thermal', 'radar'],
    budget: 2600,
    mass: 1200,
    power: 1000,
    description: 'A rapid-response environmental mission focused on multi-band imaging and climate anomalies.'
  },
  moon: {
    id: 'moon',
    name: 'Lunar Resource Prospecting',
    tagline: 'Map ice deposits and mineral resources near the lunar south pole.',
    favored: ['spectral', 'radar', 'thermal'],
    budget: 2400,
    mass: 1100,
    power: 950,
    description: 'Low-light, resource-focused exploration designed to detect water and usable materials.'
  },
  mars: {
    id: 'mars',
    name: 'Mars Surface Support',
    tagline: 'Scout landing zones and support future human exploration of Mars.',
    favored: ['optical', 'spectral', 'thermal'],
    budget: 2800,
    mass: 1300,
    power: 1200,
    description: 'High-value reconnaissance mission balancing terrain analysis with communications and autonomy.'
  },
  deep: {
    id: 'deep',
    name: 'Deep Space Observatory',
    tagline: 'Track exoplanet signatures and study distant cosmic events.',
    favored: ['spectral', 'optical', 'communications'],
    budget: 3100,
    mass: 1400,
    power: 1350,
    description: 'A long-duration science mission emphasizing sensitivity, precision, and stable deep-space communications.'
  },
  defense: {
    id: 'defense',
    name: 'Planetary Defense Watch',
    tagline: 'Detect and characterize near-Earth objects and hazardous debris.',
    favored: ['radar', 'optical', 'thermal'],
    budget: 2700,
    mass: 1250,
    power: 1100,
    description: 'A high-alert reconnaissance mission prioritizing detection speed and orbital coverage.'
  }
};

const busSystems = [
  {
    id: 'composite-bus',
    name: 'Composite Bus',
    short: 'Lightweight structure',
    mass: 220,
    power: 30,
    cost: 275,
    data: 0,
    comms: 15,
    lifetime: 2,
    description: 'Strong, lightweight core chassis built for efficient payload packing.'
  },
  {
    id: 'solar-array',
    name: 'High-Efficiency Solar Array',
    short: 'Power generation',
    mass: 150,
    power: 180,
    cost: 320,
    data: 0,
    comms: 10,
    lifetime: 3,
    description: 'Adds robust power generation and supports more demanding payloads.'
  },
  {
    id: 'battery-pack',
    name: 'Advanced Battery Pack',
    short: 'Energy reserves',
    mass: 110,
    power: 90,
    cost: 240,
    data: 0,
    comms: 5,
    lifetime: 4,
    description: 'Improves power stability during eclipses and peak-operating bursts.'
  },
  {
    id: 'deep-space-comms',
    name: 'Deep-Space Communications',
    short: 'High-gain link',
    mass: 130,
    power: 60,
    cost: 420,
    data: 30,
    comms: 70,
    lifetime: 5,
    description: 'Higher bandwidth link for distant operations and large data returns.'
  },
  {
    id: 'autonomy-core',
    name: 'Autonomy Core',
    short: 'Decision support',
    mass: 80,
    power: 35,
    cost: 310,
    data: 10,
    comms: 15,
    lifetime: 4,
    description: 'Improves onboard analytics and reduces mission operations overhead.'
  }
];

const instrumentCatalog = [
  {
    id: 'optical',
    name: 'Visible Imager',
    short: 'High-resolution imagery',
    tags: ['optical'],
    mass: 120,
    power: 80,
    cost: 360,
    data: 80,
    comms: 20,
    lifetime: 1,
    value: 28,
    description: 'Excellent for mapping terrain, weather, and orbital observation.'
  },
  {
    id: 'thermal',
    name: 'Thermal IR Sensor',
    short: 'Heat and surface signature',
    tags: ['thermal'],
    mass: 95,
    power: 60,
    cost: 340,
    data: 70,
    comms: 15,
    lifetime: 2,
    value: 24,
    description: 'Captures thermal anomalies and helps locate volatile resources.'
  },
  {
    id: 'radar',
    name: 'Synthetic Aperture Radar',
    short: 'All-weather sensing',
    tags: ['radar'],
    mass: 150,
    power: 100,
    cost: 520,
    data: 90,
    comms: 25,
    lifetime: 2,
    value: 30,
    description: 'Penetrates clouds and darkness while mapping surface features.'
  },
  {
    id: 'spectral',
    name: 'Hyperspectral Imager',
    short: 'Material composition',
    tags: ['spectral'],
    mass: 140,
    power: 110,
    cost: 540,
    data: 110,
    comms: 25,
    lifetime: 2,
    value: 34,
    description: 'Identifies minerals, chemistries, and subtle surface changes.'
  },
  {
    id: 'communications',
    name: 'Relay Transceiver',
    short: 'High-rate data relay',
    tags: ['communications'],
    mass: 100,
    power: 75,
    cost: 390,
    data: 95,
    comms: 80,
    lifetime: 2,
    value: 22,
    description: 'Expands communications capacity and supports relayed science transfer.'
  }
];

const orbitData = [
  {
    id: 'leo',
    name: 'LEO',
    orbit: 'Low Earth Orbit',
    payload: 700,
    cost: 120,
    lifetime: 4,
    description: 'Fast revisit times and easier access, but limited viewing coverage.'
  },
  {
    id: 'meo',
    name: 'MEO',
    orbit: 'Medium Earth Orbit',
    payload: 880,
    cost: 170,
    lifetime: 6,
    description: 'Balanced coverage and persistence for communication-heavy missions.'
  },
  {
    id: 'lunar',
    name: 'Lunar Transfer',
    orbit: 'Cislunar Transfer',
    payload: 950,
    cost: 260,
    lifetime: 9,
    description: 'Good for lunar missions with a longer travel window and operational risk.'
  },
  {
    id: 'mars',
    name: 'Mars Transfer',
    orbit: 'Trans-Mars Transfer',
    payload: 980,
    cost: 300,
    lifetime: 12,
    description: 'Designed for deep-space exploration and extended mission operations.'
  }
];

const launchData = [
  {
    id: 'atlas',
    name: 'Atlas V',
    payload: 820,
    cost: 410,
    orbits: ['leo', 'meo'],
    description: 'Flexible medium-lift launcher for Earth-focused missions.'
  },
  {
    id: 'falcon',
    name: 'Falcon Heavy',
    payload: 980,
    cost: 540,
    orbits: ['leo', 'meo', 'lunar'],
    description: 'High-capacity launcher well-suited to heavier spacecraft and lunar flight.'
  },
  {
    id: 'aries',
    name: 'Ares LV',
    payload: 1120,
    cost: 700,
    orbits: ['leo', 'meo', 'lunar', 'mars'],
    description: 'Heavy-lift launch system for deep-space and larger exploration payloads.'
  }
];

const difficulties = {
  beginner: {
    label: 'Beginner',
    budget: 1.15,
    mass: 1.1,
    power: 1.05,
    multiplier: 0.9
  },
  standard: {
    label: 'Standard',
    budget: 1,
    mass: 1,
    power: 1,
    multiplier: 1
  },
  advanced: {
    label: 'Advanced',
    budget: 0.9,
    mass: 0.95,
    power: 0.9,
    multiplier: 1.15
  }
};

const roleLabels = ['Mission Lead', 'Spacecraft Engineer', 'Scientist', 'Communications'];

const state = {
  objectiveId: 'earth',
  difficulty: 'standard',
  selectedOrbitId: 'leo',
  selectedLaunchId: 'atlas',
  teamSize: 2,
  activeRoles: new Set(['Mission Lead', 'Scientist']),
  selectedBus: new Set(['composite-bus', 'solar-array']),
  selectedInstruments: new Set(['optical', 'thermal'])
};

const ui = {
  objectiveList: document.getElementById('objectiveList'),
  difficultyList: document.getElementById('difficultyList'),
  roleList: document.getElementById('roleList'),
  busList: document.getElementById('busList'),
  instrumentList: document.getElementById('instrumentList'),
  orbitList: document.getElementById('orbitList'),
  launchList: document.getElementById('launchList'),
  resourceList: document.getElementById('resourceList'),
  payloadMargin: document.getElementById('payloadMargin'),
  scienceFit: document.getElementById('scienceFit'),
  riskLevel: document.getElementById('riskLevel'),
  missionReport: document.getElementById('missionReport'),
  teamSize: document.getElementById('teamSize'),
  simulateMission: document.getElementById('simulateMission'),
  resetMission: document.getElementById('resetMission')
};

function getSelectedOrbit() {
  return orbitData.find((orbit) => orbit.id === state.selectedOrbitId) || orbitData[0];
}

function getSelectedLaunch() {
  return launchData.find((launch) => launch.id === state.selectedLaunchId) || launchData[0];
}

function getSelectedObjective() {
  return objectiveData[state.objectiveId];
}

function getCurrentDifficulty() {
  return difficulties[state.difficulty];
}

function getSelectedBusItems() {
  return busSystems.filter((item) => state.selectedBus.has(item.id));
}

function getSelectedInstrumentItems() {
  return instrumentCatalog.filter((item) => state.selectedInstruments.has(item.id));
}

function getTotals() {
  const objective = getSelectedObjective();
  const difficulty = getCurrentDifficulty();
  const busItems = getSelectedBusItems();
  const instrumentItems = getSelectedInstrumentItems();

  const totalMass = Math.round(
    (objective.mass + busItems.reduce((sum, item) => sum + item.mass, 0) + instrumentItems.reduce((sum, item) => sum + item.mass, 0)) * difficulty.mass
  );

  const totalPower = Math.round(
    (objective.power + busItems.reduce((sum, item) => sum + item.power, 0) + instrumentItems.reduce((sum, item) => sum + item.power, 0)) * difficulty.power
  );

  const totalBudget = Math.round(
    (objective.budget - (busItems.reduce((sum, item) => sum + item.cost, 0) + instrumentItems.reduce((sum, item) => sum + item.cost, 0) + getSelectedLaunch().cost + getSelectedOrbit().cost)) * difficulty.budget
  );

  const totalData = Math.round(
    busItems.reduce((sum, item) => sum + item.data, 0) + instrumentItems.reduce((sum, item) => sum + item.data, 0)
  );

  const totalComms = Math.round(
    busItems.reduce((sum, item) => sum + item.comms, 0) + instrumentItems.reduce((sum, item) => sum + item.comms, 0)
  );

  const totalLifetime = Math.round(
    Math.max(4, getSelectedOrbit().lifetime + busItems.reduce((sum, item) => sum + item.lifetime, 0) + instrumentItems.reduce((sum, item) => sum + item.lifetime, 0))
  );

  return {
    totalMass,
    totalPower,
    totalBudget,
    totalData,
    totalComms,
    totalLifetime,
    busItems,
    instrumentItems,
    objective,
    difficulty
  };
}

function renderObjectives() {
  ui.objectiveList.innerHTML = '';

  Object.values(objectiveData).forEach((objective) => {
    const button = document.createElement('button');
    button.className = `selection-button ${state.objectiveId === objective.id ? 'selected' : ''}`;
    button.type = 'button';
    button.innerHTML = `
      <strong>${objective.name}</strong>
      <small>${objective.tagline}</small>
    `;
    button.addEventListener('click', () => {
      state.objectiveId = objective.id;
      renderAll();
    });
    ui.objectiveList.appendChild(button);
  });
}

function renderDifficulty() {
  ui.difficultyList.innerHTML = '';

  Object.entries(difficulties).forEach(([key, config]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `toggle-button ${state.difficulty === key ? 'active' : ''}`;
    button.textContent = config.label;
    button.addEventListener('click', () => {
      state.difficulty = key;
      renderAll();
    });
    ui.difficultyList.appendChild(button);
  });
}

function renderRoles() {
  ui.roleList.innerHTML = '';

  roleLabels.forEach((role) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `toggle-button ${state.activeRoles.has(role) ? 'active' : ''}`;
    button.textContent = role;
    button.addEventListener('click', () => {
      if (state.activeRoles.has(role)) {
        state.activeRoles.delete(role);
      } else if (state.activeRoles.size < 4) {
        state.activeRoles.add(role);
      }
      renderAll();
    });
    ui.roleList.appendChild(button);
  });
}

function renderBusSystems() {
  ui.busList.innerHTML = '';

  busSystems.forEach((system) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `config-item ${state.selectedBus.has(system.id) ? 'active' : ''}`;
    button.innerHTML = `
      <div class="meta">
        <strong>${system.name}</strong>
        <span class="stats">Mass ${system.mass} kg · Power ${system.power} kW · Cost $${system.cost}M</span>
      </div>
      <div class="stats">${system.short}</div>
    `;
    button.addEventListener('click', () => {
      if (state.selectedBus.has(system.id)) {
        state.selectedBus.delete(system.id);
      } else {
        state.selectedBus.add(system.id);
      }
      renderAll();
    });
    ui.busList.appendChild(button);
  });
}

function renderInstruments() {
  ui.instrumentList.innerHTML = '';

  instrumentCatalog.forEach((instrument) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `config-item ${state.selectedInstruments.has(instrument.id) ? 'active' : ''}`;
    button.innerHTML = `
      <div class="meta">
        <strong>${instrument.name}</strong>
        <span class="stats">Mass ${instrument.mass} kg · Power ${instrument.power} kW · Data ${instrument.data} GB/day</span>
      </div>
      <div class="stats">Value ${instrument.value}</div>
    `;
    button.addEventListener('click', () => {
      if (state.selectedInstruments.has(instrument.id)) {
        state.selectedInstruments.delete(instrument.id);
      } else {
        state.selectedInstruments.add(instrument.id);
      }
      renderAll();
    });
    ui.instrumentList.appendChild(button);
  });
}

function renderOrbits() {
  ui.orbitList.innerHTML = '';

  orbitData.forEach((orbit) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `selection-button ${state.selectedOrbitId === orbit.id ? 'selected' : ''}`;
    button.innerHTML = `
      <strong>${orbit.name}</strong>
      <small>${orbit.description}</small>
    `;
    button.addEventListener('click', () => {
      state.selectedOrbitId = orbit.id;
      renderAll();
    });
    ui.orbitList.appendChild(button);
  });
}

function renderLaunches() {
  ui.launchList.innerHTML = '';

  launchData.forEach((vehicle) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `selection-button ${state.selectedLaunchId === vehicle.id ? 'selected' : ''}`;
    button.innerHTML = `
      <strong>${vehicle.name}</strong>
      <small>Payload ${vehicle.payload} kg · $${vehicle.cost}M</small>
    `;
    button.addEventListener('click', () => {
      state.selectedLaunchId = vehicle.id;
      renderAll();
    });
    ui.launchList.appendChild(button);
  });
}

function renderResources() {
  const totals = getTotals();
  const launch = getSelectedLaunch();
  const orbit = getSelectedOrbit();
  const objective = getSelectedObjective();
  const payloadMargin = launch.payload - totals.totalMass;
  const powerRatio = Math.min((totals.totalPower / 1400) * 100, 100);
  const massRatio = Math.min((totals.totalMass / launch.payload) * 100, 100);
  const budgetRatio = Math.min((Math.abs(totals.totalBudget) / 2500) * 100, 100);
  const dataRatio = Math.min((totals.totalData / 300) * 100, 100);
  const commsRatio = Math.min((totals.totalComms / 220) * 100, 100);

  const resources = [
    { label: 'Budget', value: `${Math.max(0, totals.totalBudget)} M`, percent: budgetRatio, over: totals.totalBudget < 0 },
    { label: 'Mass', value: `${totals.totalMass} / ${launch.payload} kg`, percent: massRatio, over: totals.totalMass > launch.payload },
    { label: 'Power', value: `${totals.totalPower} kW`, percent: powerRatio, over: totals.totalPower > 1400 },
    { label: 'Data', value: `${totals.totalData} GB/day`, percent: dataRatio, over: totals.totalData > 300 },
    { label: 'Comms', value: `${totals.totalComms} Gbps`, percent: commsRatio, over: totals.totalComms > 220 },
    { label: 'Lifetime', value: `${totals.totalLifetime} years`, percent: Math.min((totals.totalLifetime / 16) * 100, 100), over: totals.totalLifetime < 8 }
  ];

  ui.resourceList.innerHTML = resources
    .map(
      (resource) => `
        <div class="resource-row ${resource.over ? 'over' : ''}">
          <div class="resource-label">
            <span>${resource.label}</span>
            <strong>${resource.value}</strong>
          </div>
          <div class="resource-bar">
            <div class="resource-bar-fill" style="width: ${Math.min(resource.percent, 100)}%"></div>
          </div>
        </div>
      `
    )
    .join('');

  ui.payloadMargin.textContent = `${payloadMargin} kg`;
  ui.scienceFit.textContent = `${calculateObjectiveFit()}%`;
  ui.riskLevel.textContent = calculateRiskLabel();

  const objectiveSummary = `${objective.name} • ${orbit.orbit} • ${launch.name}`;
  ui.missionReport.innerHTML = `<div class="report-header"><div class="score-pill ${calculateMissionScore().passed ? '' : 'fail'}">${calculateMissionScore().score}/100</div><strong>${objectiveSummary}</strong></div>`;
}

function calculateObjectiveFit() {
  const objective = getSelectedObjective();
  const selected = getSelectedInstrumentItems();

  if (!selected.length) {
    return 0;
  }

  const matchCount = selected.reduce((sum, instrument) => {
    return sum + (objective.favored.includes(instrument.id) ? 1 : 0);
  }, 0);

  return Math.min(100, Math.round((matchCount / selected.length) * 100));
}

function calculateRiskLabel() {
  const totals = getTotals();
  const launch = getSelectedLaunch();
  let risk = 0;

  if (totals.totalMass > launch.payload) risk += 30;
  if (totals.totalBudget < 0) risk += 25;
  if (totals.totalPower > 1400) risk += 18;
  if (totals.totalData > 300) risk += 12;
  if (totals.totalComms > 220) risk += 8;

  if (risk >= 50) return 'Severe';
  if (risk >= 25) return 'High';
  if (risk >= 10) return 'Moderate';
  return 'Low';
}

function calculateMissionScore() {
  const totals = getTotals();
  const launch = getSelectedLaunch();
  const orbit = getSelectedOrbit();
  const objective = getSelectedObjective();
  const fit = calculateObjectiveFit();

  let score = fit * 0.5;
  score += Math.max(0, 40 - Math.abs(totals.totalMass - (launch.payload * 0.7)) / 12);
  score += Math.max(0, 25 - Math.abs(totals.totalPower - 1000) / 18);
  score += Math.max(0, 20 - Math.abs(totals.totalData - 200) / 12);
  score += Math.max(0, 15 - Math.abs(totals.totalComms - 150) / 10);

  if (totals.totalBudget < 0) score -= 30;
  if (totals.totalMass > launch.payload) score -= 25;
  if (totals.totalPower > 1400) score -= 15;
  if (totals.totalData > 300) score -= 10;

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score: finalScore,
    passed: finalScore >= 60 && totals.totalMass <= launch.payload && totals.totalBudget >= 0
  };
}

function generateMissionReport() {
  const totals = getTotals();
  const launch = getSelectedLaunch();
  const orbit = getSelectedOrbit();
  const objective = getSelectedObjective();
  const score = calculateMissionScore();
  const risk = calculateRiskLabel();
  const fit = calculateObjectiveFit();
  const selectedInstruments = getSelectedInstrumentItems();
  const selectedBus = getSelectedBusItems();

  const completionText = score.passed
    ? 'Mission accepted for flight review. The design is feasible and aligns well with the mission objective.'
    : 'Mission needs revision. The design breaches a key constraint or underperforms the ideal science target.';

  const recommendation =
    score.passed
      ? 'Continue with the current configuration, but monitor data volume and power draw during system validation.'
      : `Reduce mass or power by trimming ${selectedInstruments.length > 1 ? 'one payload option' : 'the least valuable instrument'} and rebalance the spacecraft bus for launch compatibility.`;

  ui.missionReport.innerHTML = `
    <div class="report-header">
      <div class="score-pill ${score.passed ? '' : 'fail'}">${score.score}/100</div>
      <strong>${objective.name}</strong>
    </div>

    <div class="summary-grid">
      <div class="summary-card">
        <h4>Result</h4>
        <p>${completionText}</p>
      </div>
      <div class="summary-card">
        <h4>Launch & Orbit</h4>
        <p>${launch.name} to ${orbit.orbit}</p>
      </div>
      <div class="summary-card">
        <h4>Risk</h4>
        <p>${risk}</p>
      </div>
      <div class="summary-card">
        <h4>Science Fit</h4>
        <p>${fit}% alignment with the objective</p>
      </div>
      <div class="summary-card">
        <h4>Spacecraft</h4>
        <p>${selectedBus.map((item) => item.name).join(', ') || 'No bus systems selected'}</p>
      </div>
      <div class="summary-card">
        <h4>Payload</h4>
        <p>${selectedInstruments.map((item) => item.name).join(', ') || 'No instruments selected'}</p>
      </div>
    </div>

    <div class="summary-card">
      <h4>Recommendation</h4>
      <p>${recommendation}</p>
    </div>
  `;
}

function renderAll() {
  ui.teamSize.value = String(state.teamSize);
  renderObjectives();
  renderDifficulty();
  renderRoles();
  renderBusSystems();
  renderInstruments();
  renderOrbits();
  renderLaunches();
  renderResources();
  generateMissionReport();
}

ui.teamSize.addEventListener('change', (event) => {
  state.teamSize = Number(event.target.value);
  const active = Array.from(state.activeRoles);
  if (active.length > state.teamSize) {
    state.activeRoles = new Set(active.slice(0, state.teamSize));
  }
  renderAll();
});

ui.simulateMission.addEventListener('click', () => {
  const result = calculateMissionScore();
  const roleSummary = Array.from(state.activeRoles).join(', ') || 'No team assigned';
  const message = result.passed
    ? `Simulation successful. ${state.teamSize}-person mission team coordinated effectively: ${roleSummary}.`
    : `Simulation flagged risk. The mission requires adjustments before launch: ${roleSummary}.`;

  ui.missionReport.insertAdjacentHTML(
    'beforeend',
    `<div class="summary-card"><h4>Simulation Event</h4><p>${message}</p></div>`
  );
});

ui.resetMission.addEventListener('click', () => {
  state.objectiveId = 'earth';
  state.difficulty = 'standard';
  state.selectedOrbitId = 'leo';
  state.selectedLaunchId = 'atlas';
  state.teamSize = 2;
  state.activeRoles = new Set(['Mission Lead', 'Scientist']);
  state.selectedBus = new Set(['composite-bus', 'solar-array']);
  state.selectedInstruments = new Set(['optical', 'thermal']);
  renderAll();
});

renderAll();
