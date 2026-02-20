const families = {
  cardio: { label: 'Cardio training', description: 'Burpees, corde, sprint, montées de genoux.' },
  lower: { label: 'Membres inférieurs', description: 'Squats, fentes, sauts, box step.' },
  upper: { label: 'Membres supérieurs', description: 'Pompes, dips, tirages.' },
  core: { label: 'Gainage / Abdominaux', description: 'Crunch, hollow, planche, rameur statique.' },
};

const familyVisualSwatches = {
  cardio: { background: '#fee4e2', accent: '#fb7185', text: '#b91c1c' },
  lower: { background: '#dcfce7', accent: '#22c55e', text: '#166534' },
  upper: { background: '#e0f2fe', accent: '#38bdf8', text: '#0f172a' },
  core: { background: '#fef3c7', accent: '#f97316', text: '#92400e' },
};

const exerciseVisuals = {
  burpees: 'assets/exercises/burpees.jpg',
  corde: 'assets/exercises/corde.jpg',
  shadow: 'assets/exercises/shadow.jpg',
  jumping: 'assets/exercises/jumping.jpg',
  mountain: 'assets/exercises/mountain.jpg',
  squat: 'assets/exercises/squat.jpg',
  fentes: 'assets/exercises/fentes.jpg',
  saut: 'assets/exercises/saut.jpg',
  pompes: 'assets/exercises/pompes.jpg',
  dips: 'assets/exercises/dips.jpg',
  rameur: 'assets/exercises/rameur.jpg',
  crunch: 'assets/exercises/crunch.jpg',
  hollow: 'assets/exercises/hollow.jpg',
  planche: 'assets/exercises/planche.png',
};
const generatedVisualCache = {};

const SKILL_LIBRARY_FALLBACK = [
  { name: 'Montée de genoux', difficulty: 1, points: 10 },
  { name: 'Lunge G&D', difficulty: 1, points: 10 },
  { name: 'Burpees rebond', difficulty: 1, points: 10 },
  { name: 'Mountain climber décomposé G&D', difficulty: 1, points: 10 },
  { name: 'Push up genoux', difficulty: 1, points: 10 },
  { name: 'Dips jambes pliées', difficulty: 1, points: 10 },
  { name: 'Crunch', difficulty: 1, points: 10 },
  { name: 'Jumping jack sans les bras', difficulty: 1, points: 10 },
  { name: 'Rameur statique', difficulty: 1, points: 10 },
  { name: 'Squat', difficulty: 1, points: 10 },
  { name: 'Saut groupé', difficulty: 2, points: 20 },
  { name: 'Jump lunge G&D', difficulty: 2, points: 20 },
  { name: 'Burpees', difficulty: 2, points: 20 },
  { name: 'Mountain climber G&D', difficulty: 2, points: 20 },
  { name: 'Push up', difficulty: 2, points: 20 },
  { name: 'Dips jambes tendues', difficulty: 2, points: 20 },
  { name: 'AB Bikes', difficulty: 2, points: 20 },
  { name: 'Jumping jack', difficulty: 2, points: 20 },
  { name: 'Rameur dynamique', difficulty: 2, points: 20 },
  { name: 'Jumping squat', difficulty: 2, points: 20 },
];

let skillLibraryDataset = [];

const STORAGE_MODE = 'localStorage';
const STORAGE_KEY = 'CT_APP_STATE_V1';
const STORAGE_VERSION = 1;
const LEGACY_STORAGE_KEY = 'crossTrainingCarnet';
const QR_PAYLOAD_LIMIT = 2800;
const QR_TRIM_ORDER = ['notes', 'evaluation', 'skill', 'training'];
const MAX_QR_TRAINING_FIELDS = 3;
const MAX_QR_SKILL_EXERCISES = 4;

function buildIconSvg(letter, family) {
  const palette = familyVisualSwatches[family] || { background: '#e2e8f0', accent: '#94a3b8', text: '#0f172a' };
  const safeLetter = (letter || '?').slice(0, 2).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="160" viewBox="0 0 220 160"><rect width="220" height="160" rx="28" fill="${palette.background}"/><path d="M24 122H196" stroke="${palette.accent}" stroke-width="6" stroke-linecap="round" opacity="0.35"/><circle cx="36" cy="34" r="10" fill="${palette.accent}" opacity="0.4"/><circle cx="70" cy="24" r="6" fill="${palette.accent}" opacity="0.25"/><circle cx="182" cy="38" r="8" fill="${palette.accent}" opacity="0.25"/><text x="110" y="105" text-anchor="middle" font-family="'Inter','Segoe UI',sans-serif" font-size="72" font-weight="700" fill="${palette.text}">${safeLetter}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function getExerciseVisual(id, letter, family) {
  if (exerciseVisuals[id]) {
    return exerciseVisuals[id];
  }
  if (!generatedVisualCache[id]) {
    generatedVisualCache[id] = buildIconSvg(letter, family);
  }
  return generatedVisualCache[id];
}

const exercises = [
  {
    id: 'burpees',
    name: 'Burpees',
    family: 'cardio',
    description: 'Combinaison de squat, planche puis saut bras levés.',
    steps: ['Descends en squat', 'Planches gainée', 'Retour + saut'],
    safety: ['Garde la colonne alignée en planche.', 'Amortir sur la plante des pieds.'],
    levels: [
      { tier: 1, label: 'Décomposé', detail: 'Sans saut final.', visual: getExerciseVisual('burpees', 'B', 'cardio') },
      { tier: 2, label: 'Standard', detail: 'Burpee complet.', visual: getExerciseVisual('burpees', 'B', 'cardio') },
    ],
  },
  {
    id: 'corde',
    name: 'Corde à sauter',
    family: 'cardio',
    description: 'Coordination, rythme et proprioception.',
    steps: ['Poignets actifs', 'Sauts sur la pointe', 'Respiration contrôlée'],
    safety: ['Absorbe avec des genoux souples.', 'Regarde loin devant.'],
    levels: [
      { tier: 1, label: 'Basique', detail: 'Pas alternés ou doubles petits.', visual: getExerciseVisual('corde', 'C', 'cardio') },
      { tier: 2, label: 'Standard', detail: 'Un saut par tour.', visual: getExerciseVisual('corde', 'C', 'cardio') },
    ],
  },
  {
    id: 'shadow',
    name: 'Sprint sur place',
    family: 'cardio',
    description: 'Relances rapides, genoux hauts.',
    steps: ['Bras toniques', 'Genoux au-dessus des hanches', 'Cadence dynamique'],
    safety: ['Maintiens l’axe tête-hanches.', 'Pose souple les pieds.'],
    levels: [
      { tier: 1, label: 'Fluide', detail: 'Cadence régulière.', visual: getExerciseVisual('shadow', 'S', 'cardio') },
      { tier: 2, label: 'Intervalles', detail: '10 s rapide / 10 s plus lent.', visual: getExerciseVisual('shadow', 'S', 'cardio') },
    ],
  },
  {
    id: 'jumping',
    name: 'Jumping jacks',
    family: 'cardio',
    description:
      'Saut complet bras/jambes sollicitant adducteurs, abducteurs, deltoïde et tenseur du fascia lata pour faire monter le cardio.',
    steps: [
      'Debout, les bras le long du corps.',
      'Sauter en écartant les pieds et en levant les bras sur les côtés au-dessus de la tête.',
      'Toucher les mains en gardant le corps droit.',
      'Sauter à nouveau pour revenir bras le long du corps et pieds regroupés.',
    ],
    safety: ['Corps droit et gainé.', 'Amortir sur la pointe des pieds (pas de talon).'],
    levels: [
      { tier: 1, label: 'Basique', detail: 'Amplitude réduite.', visual: getExerciseVisual('jumping', 'J', 'cardio') },
      { tier: 2, label: 'Standard', detail: 'Bras au-dessus de la tête.', visual: getExerciseVisual('jumping', 'J', 'cardio') },
    ],
  },
  {
    id: 'mountain',
    name: 'Mountain climbers',
    family: 'cardio',
    description: 'Travail cardio-gainage en position de planche avec montées de genoux rapides.',
    steps: [
      'Départ en position de pompe.',
      'Ramener le genou droit contre le coude droit.',
      'Alterner avec le genou gauche contre le coude gauche.',
    ],
    safety: ['Corps gainé et droit, ne pas cambrer le dos.', 'Rester dans l’axe sans basculer les épaules ni les hanches.'],
    levels: [
      { tier: 1, label: 'Décomposé', detail: 'Montées de genoux lentes, retour contrôlé.', visual: getExerciseVisual('mountain', 'M', 'cardio') },
      { tier: 2, label: 'Standard', detail: 'Alternance continue à vitesse modérée.', visual: getExerciseVisual('mountain', 'M', 'cardio') },
    ],
  },
  {
    id: 'squat',
    name: 'Squat',
    family: 'lower',
    description: 'Hanches vers l’arrière, genoux alignés.',
    steps: [
      'Debout, jambes un peu plus larges que le bassin.',
      'Poids du corps sur les talons (orteils peuvent se décoller).',
      'Pousser les fesses vers l’arrière comme si on s’asseyait, genoux sans dépasser les pointes.',
    ],
    safety: [
      'Buste droit (ne pas basculer vers l’avant) et regard loin.',
      'Bras équilibrateurs tendus devant, alignés avec les genoux.',
      'Ne descends pas sous les genoux et pousse les genoux légèrement vers l’extérieur.',
    ],
    levels: [
      { tier: 1, label: 'Air squat', detail: 'Amplitude contrôlée.', visual: getExerciseVisual('squat', 'Sq', 'lower') },
      { tier: 2, label: 'Tempo', detail: 'Descente 3 s.', visual: getExerciseVisual('squat', 'Sq', 'lower') },
    ],
  },
  {
    id: 'fentes',
    name: 'Fentes avant/arrière',
    family: 'lower',
    description: 'Déplacement contrôle, buste droit.',
    steps: [
      'Debout, jambes écartées largeur bassin, dos droit.',
      'Faire un grand pas en avant (ou arrière) et fléchir sur un axe vertical (90° au genou avant).',
      'Dans cette position, talon à l’aplomb du genou, jambe arrière parallèle au sol en appui pointe, puis pousser pour revenir.',
    ],
    safety: [
      'Flexion sur axe vertical (surtout pas vers l’avant).',
      'Appui sur le talon du pied avant, dos droit, regard devant.',
    ],
    levels: [
      { tier: 1, label: 'Alternées', detail: 'Sans déplacement.', visual: getExerciseVisual('fentes', 'F', 'lower') },
      { tier: 2, label: 'Walking lunge', detail: 'En déplacement.', visual: getExerciseVisual('fentes', 'F', 'lower') },
    ],
  },
  {
    id: 'saut',
    name: 'Saut groupé',
    family: 'lower',
    description: 'Saut vertical groupé pour travailler la puissance des membres inférieurs.',
    steps: [
      'Debout, réaliser un saut vertical.',
      'Se grouper en ramenant les genoux vers la poitrine au moment de l’impulsion.',
      'Dégrouper en veillant à reprendre contact par la pointe du pied.',
    ],
    safety: ['Dos droit et gainé.', 'Bras équilibrateurs pour aider à l’impulsion.', 'Amorti sur la pointe du pied, pas le talon.'],
    levels: [
      { tier: 1, label: 'Contrôlé', detail: 'Genoux mi-hauteur.', visual: getExerciseVisual('saut', 'S', 'lower') },
      { tier: 2, label: 'Groupé complet', detail: 'Genoux poitrine.', visual: getExerciseVisual('saut', 'S', 'lower') },
    ],
  },
  {
    id: 'pompes',
    name: 'Pompes',
    family: 'upper',
    description: 'Poussée bras, corps gainé.',
    steps: [
      'Placer les mains au sol un peu plus écartées que les épaules.',
      'Bras et jambes tendus, pieds joints, épaules au-dessus des mains.',
      'Fléchir pour amener menton, poitrine et hanches ensemble vers le sol.',
      'Pousser sur les bras en maintenant tout le corps verrouillé jusqu’en haut.',
    ],
    safety: [
      'Alignement tête-bassin-chevilles, corps gainé sans cambrer.',
      'Ne pas baisser ni monter exagérément les fesses (éviter le V inversé).',
      'Coudes proches du corps, pas écartés.',
    ],
    levels: [
      { tier: 1, label: 'Genoux', detail: 'Pieds au sol.', visual: getExerciseVisual('pompes', 'P', 'upper') },
      { tier: 2, label: 'Standard', detail: 'Poitrine touche le sol.', visual: getExerciseVisual('pompes', 'P', 'upper') },
    ],
  },
  {
    id: 'dips',
    name: 'Dips sur banc',
    family: 'upper',
    description: 'Triceps/épaules.',
    steps: [
      'Assis sur un rebord, mains de chaque côté des fessiers.',
      'Avancer légèrement les pieds (genoux au-dessus des talons), décoller les fesses.',
      'Plier les coudes en gardant le dos vertical puis pousser sur les mains pour remonter bras tendus.',
    ],
    safety: ['Buste droit (ne pas pencher vers l’avant).', 'Regard loin devant.'],
    levels: [
      { tier: 1, label: 'Jambes pliées', detail: 'Charge légère.', visual: getExerciseVisual('dips', 'D', 'upper') },
      { tier: 2, label: 'Jambes tendues', detail: 'Appui talons.', visual: getExerciseVisual('dips', 'D', 'upper') },
    ],
  },
  {
    id: 'rameur',
    name: 'Tirage rameur',
    family: 'upper',
    description: 'Allongé sur le dos, monter le torse vers les genoux comme sur un rameur statique.',
    steps: [
      'Allonge-toi, ramène les pieds près des fessiers.',
      'Contracte les abdos pour monter le torse le plus haut possible vers les genoux.',
      'Redescends en déroulant le dos sans relâcher la contraction.',
    ],
    safety: ['Dos droit, bassin en antéversion, fesses en arrière.', 'Bras équilibrateurs pour stabiliser.'],
    levels: [
      { tier: 1, label: 'Sans charge', detail: 'Élastique léger.', visual: getExerciseVisual('rameur', 'R', 'upper') },
      { tier: 2, label: 'Charge moyenne', detail: 'Élastique fort.', visual: getExerciseVisual('rameur', 'R', 'upper') },
    ],
  },
  {
    id: 'crunch',
    name: 'Crunch',
    family: 'core',
    description: 'Abdos.',
    steps: [
      'Allongé sur le dos, décoller les pieds du sol.',
      'Contracter les abdos pour monter le torse vers les genoux.',
      'Redescendre doucement en déroulant le dos en gardant la contraction.',
    ],
    safety: [
      'Ne tire pas sur la nuque, garde le menton à la distance d’un poing.',
      'Dos droit et contrôle constant en montée/descente.',
    ],
    levels: [
      { tier: 1, label: 'Demi amplitude', detail: 'Omoplates effleurent.', visual: getExerciseVisual('crunch', 'C', 'core') },
      { tier: 2, label: 'Complet', detail: 'Coudes vers les genoux.', visual: getExerciseVisual('crunch', 'C', 'core') },
    ],
  },
  {
    id: 'hollow',
    name: 'Hollow body',
    family: 'core',
    description: 'Gainage BANANE.',
    steps: ['Lombaires au sol', 'Bras/tête/pieds décollés', 'Respire sans relâcher'],
    safety: ['Évite d’arquer le bas du dos.', 'Active les fessiers.'],
    levels: [
      { tier: 1, label: 'Genoux pliés', detail: 'Levier réduit.', visual: getExerciseVisual('hollow', 'H', 'core') },
      { tier: 2, label: 'Bras tête', detail: 'Bras derrière la tête.', visual: getExerciseVisual('hollow', 'H', 'core') },
    ],
  },
  {
    id: 'planche',
    name: 'Planche ventrale',
    family: 'core',
    description: 'Gainage statique.',
    steps: ['Coudes sous les épaules', 'Serre abdos/fessiers', 'Respire calmement'],
    safety: ['Épaules éloignées des oreilles.', 'Pas de dos creux.'],
    levels: [
      { tier: 1, label: 'Genoux', detail: 'Appui genoux.', visual: getExerciseVisual('planche', 'Pl', 'core') },
      { tier: 2, label: 'Standard', detail: '30 s sur les pieds.', visual: getExerciseVisual('planche', 'Pl', 'core') },
    ],
  },
];

const trainingVisualOverrides = { ...exerciseVisuals };

const exerciseDocuments = {};

const courseOptions = [
  { value: '40', label: '40 m aller-retour', note: 'Aller-retour linéaire.' },
  { value: '60', label: '60 m aller-retour', note: '2 x 30 m (aller et retour).' },
  { value: '80', label: '80 m aller-retour', note: '4 x 20 m en aller-retour.' },
];

const studentIds = ['A', 'B'];
const studentActiveRadios = {};
const studentAccentMap = {
  A: 'student-a',
  B: 'student-b',
};

function getSkillById(id) {
  if (!id) return null;
  return state.skills.find((skill) => skill.id === id) || null;
}

function getSkillsForStudent(id) {
  return state.skills.filter((skill) => (skill.owner || 'A') === id);
}

function syncStudentSkillSelections() {
  if (!state.studentSkills) state.studentSkills = { A: null, B: null };
  studentIds.forEach((id) => {
    const selectedId = state.studentSkills[id];
    if (selectedId && getSkillById(selectedId)) return;
    const fallback = getSkillsForStudent(id)[0]?.id || state.skills[0]?.id || null;
    state.studentSkills[id] = fallback;
  });
  if (!state.selectedSkill || !getSkillById(state.selectedSkill)) {
    state.selectedSkill = state.studentSkills[state.activeStudent] || state.skills[0]?.id || null;
  }
}

function getSelectedSkillId(studentId = state.activeStudent) {
  syncStudentSkillSelections();
  return state.studentSkills?.[studentId] || state.selectedSkill || null;
}

function handleStudentSkillAction(studentId, skillId, options = {}) {
  if (!skillId) return;
  const skill = getSkillById(skillId);
  if (!skill) {
    showToast('Skill introuvable.');
    return;
  }
  if (!state.studentSkills) state.studentSkills = { A: null, B: null };
  state.studentSkills[studentId] = skillId;
  if (options.launch && state.students[studentId]?.enabled) {
    setActiveStudent(studentId, true);
    state.selectedSkill = skillId;
  } else if (studentId === state.activeStudent) {
    state.selectedSkill = skillId;
  } else {
    state.selectedSkill = getSelectedSkillId();
  }
  saveState();
  renderSkillRoster();
  renderSkillDetails();
  renderSkillLibrary();
  renderSkillList();
  renderRunnerSelect();
  if (elements.skillSelect) {
    elements.skillSelect.value = skillId;
  }
  if (elements.runnerSkillSelect) {
    elements.runnerSkillSelect.value = skillId;
  }
  if (options.launch) {
    state.timerMode = 'examen';
    saveState();
    elements.modeButtons?.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.timerMode === state.timerMode);
    });
    setActivePage('runner');
    showToast('Mode examen prêt.');
  } else {
    showToast('Skill sélectionné.');
  }
}

const defaultState = {
  students: {
    A: { enabled: true, prenom: '', nom: '', classe: '' },
    B: { enabled: true, prenom: '', nom: '', classe: '' },
  },
  studentMode: 'solo',
  activeStudent: 'A',
  builderOwner: 'A',
  studentSkills: { A: null, B: null },
  skills: [],
  assignedChallenges: { A: null, B: null },
  course: courseOptions[0],
  trainingTests: [],
  sessionMinutes: 20,
  restSeconds: 30,
  manualRestSeconds: 0,
  workSeconds: 120,
  restEnabled: true,
  generalMode: 'countdown',
  timerMode: 'entrainement',
  results: [],
  archives: [],
  evaluation: { cardio: null, lower: null, upper: null, core: null },
  profUnlocked: false,
  finalized: false,
  finalizedAt: null,
  notes: { A: '', B: '', prof: '' },
  qrOptions: { identity: true, skill: true, training: true, evaluation: true, notes: true },
  observer: '',
};

let state = loadState();
state.studentSkills = state.studentSkills || { A: null, B: null };
state.notes = state.notes || clone(defaultState.notes);
state.assignedChallenges = state.assignedChallenges || { A: null, B: null };
studentIds.forEach((id) => {
  if (!state.notes[id] && typeof state.students[id]?.notes === 'string') {
    state.notes[id] = state.students[id].notes;
  }
  if (state.students[id] && Object.prototype.hasOwnProperty.call(state.students[id], 'notes')) {
    delete state.students[id].notes;
  }
});
state.skills = (state.skills || []).map((skill) => ({ ...skill, owner: skill.owner || 'A' }));
if (!state.selectedSkill && state.skills.length) {
  state.selectedSkill = state.skills[0].id;
}
let builderOwner = state.builderOwner || state.activeStudent || 'A';
syncStudentSkillSelections();
state.builderOwner = builderOwner;
saveState();

const elements = {
  navButtons: document.querySelectorAll('[data-target]'),
  sections: document.querySelectorAll('[data-page]'),
  exerciseList: document.getElementById('exercise-list'),
  homeQuickButtons: document.querySelectorAll('[data-go]'),
  builderSlots: document.getElementById('builder-slots'),
  builderStatus: document.getElementById('builder-status'),
  builderOwnerInputs: document.querySelectorAll('input[name="builder-owner"]'),
  skillList: document.getElementById('skill-list'),
  skillNameInput: document.getElementById('skill-name'),
  skillRoster: document.getElementById('skill-roster'),
  courseSelect: document.getElementById('course-select'),
  saveSkillBtn: document.getElementById('save-skill'),
  skillLibrary: document.getElementById('skill-detail-log'),
  restDurationInput: document.getElementById('rest-duration'),
  observerInput: document.getElementById('observer-name-input'),
  observerBlock: document.getElementById('observer-block'),
  openRunnerButtons: document.querySelectorAll('.open-runner'),
  trainingExerciseSelect: document.getElementById('training-exercise'),
  trainingLevelSelect: document.getElementById('training-level'),
  trainingInfoBtn: document.getElementById('training-info-btn'),
  trainingDisplay: document.getElementById('training-display'),
  trainingStartBtn: document.getElementById('training-start'),
  trainingResetBtn: document.getElementById('training-reset'),
  trainingRepsBlock: document.getElementById('training-reps-block'),
  trainingSaveBtn: document.getElementById('training-save'),
  trainingHistory: document.getElementById('training-history'),
  trainingVisual: document.getElementById('training-visual'),
  trainingVisualImg: document.getElementById('training-visual-img'),
  trainingQrBtn: document.getElementById('training-qr-btn'),
  trainingCsvBtn: document.getElementById('training-csv-btn'),
  trainingPdfBtn: document.getElementById('training-pdf-btn'),
  trainingClearBtn: document.getElementById('training-clear-btn'),
  trainingQrOutput: document.getElementById('training-qr-output'),
  skillSelect: document.getElementById('skill-select'),
  sessionSlider: document.getElementById('session-duration'),
  sessionLabel: document.getElementById('session-duration-label'),
  sessionBlocks: document.getElementById('session-blocks-label'),
  generalDisplay: document.getElementById('general-display'),
  generalModeInputs: document.querySelectorAll('input[name="general-mode"]'),
  skillPhaseLabel: document.getElementById('skill-phase-label'),
  skillTimerDisplay: document.getElementById('skill-timer-display'),
  skillPhaseDetail: document.getElementById('skill-phase-detail'),
  skillPlanName: document.getElementById('skill-plan-name'),
  skillPlanList: document.getElementById('skill-plan-list'),
  skillPlanCourse: document.getElementById('skill-plan-course'),
  modeButtons: document.querySelectorAll('[data-timer-mode]'),
  skillRunStart: document.getElementById('skill-run-start'),
  skillRunStop: document.getElementById('skill-run-stop'),
  overlay: document.getElementById('overlay'),
  overlayCount: document.getElementById('overlay-count'),
  overlaySkill: document.getElementById('overlay-skill'),
  overlayPhase: document.getElementById('overlay-phase'),
  overlayTimer: document.getElementById('overlay-timer'),
  overlayGeneral: document.getElementById('overlay-general'),
  overlayRestPanel: document.getElementById('overlay-rest-panel'),
  overlayRestTimer: document.getElementById('overlay-rest-timer'),
  overlayToRest: document.getElementById('overlay-to-rest'),
  overlayClose: document.getElementById('overlay-close'),
  overlayMessage: document.getElementById('overlay-message'),
  overlaySummary: document.getElementById('overlay-summary'),
  overlayObserver: document.getElementById('overlay-observer'),
  runnerSkillSelect: document.getElementById('runner-skill-select'),
  runnerObserverInput: document.getElementById('runner-observer-input'),
  runnerTotalInput: document.getElementById('runner-total-input'),
  runnerDurationLabel: document.getElementById('runner-duration-label'),
  runnerModeLabel: document.getElementById('runner-mode-label'),
  runnerWorkInput: document.getElementById('runner-work-input'),
  runnerRestToggle: document.getElementById('runner-rest-toggle'),
  runnerManualBlock: document.getElementById('runner-manual-block'),
  runnerManualRestInput: document.getElementById('runner-manual-rest-input'),
  runnerModeRadios: document.querySelectorAll('input[name="runner-mode"]'),
  runnerStartBtn: document.getElementById('runner-start'),
  runnerStopBtn: document.getElementById('runner-stop'),
  runnerRestBtn: document.getElementById('runner-rest-btn'),
  runnerGeneralDisplay: document.getElementById('runner-general-display'),
  runnerWorkDisplay: document.getElementById('runner-work-display'),
  runnerRestDisplay: document.getElementById('runner-rest-display'),
  runnerWorkLabel: document.getElementById('runner-work-label'),
  runnerRestBlock: document.querySelector('.runner-rest'),
  runnerPhaseLabel: document.getElementById('runner-phase-label'),
  runnerMessage: document.getElementById('runner-message'),
  runnerRepsPanel: document.getElementById('runner-reps-panel'),
  runnerRepsList: document.getElementById('runner-reps-list'),
  runnerRepsReset: document.getElementById('runner-reps-reset'),
  runnerSummary: document.getElementById('runner-summary'),
  runnerResetBtn: document.getElementById('runner-reset'),
  sessionSummary: document.getElementById('session-summary'),
  historyList: document.getElementById('history-list'),
  archiveList: document.getElementById('archive-list'),
  summaryActions: document.getElementById('summary-actions'),
  correctionBtn: document.getElementById('correction-mode-btn'),
  correctionStatus: document.getElementById('correction-status'),
  notesArea: document.getElementById('prof-notes'),
  finalizeBtn: document.getElementById('finalize-session'),
  qrBtn: document.getElementById('generate-qr'),
  pdfBtn: document.getElementById('export-pdf'),
  resetBtn: document.getElementById('reset-carnet'),
  qrContainer: document.getElementById('qr-output'),
  qrOptions: document.querySelectorAll('[data-qr-option]'),
  historyCards: document.getElementById('history-list'),
  skillResults: document.getElementById('skill-results'),
  challengeLibrary: document.getElementById('challenge-library'),
  challengeList: document.getElementById('challenge-list'),
  challengeFilter: document.getElementById('challenge-filter'),
};

function refreshOverlayRefs() {
  elements.overlay = document.getElementById('overlay');
  elements.overlayCount = document.getElementById('overlay-count');
  elements.overlaySkill = document.getElementById('overlay-skill');
  elements.overlayPhase = document.getElementById('overlay-phase');
  elements.overlayTimer = document.getElementById('overlay-timer');
  elements.overlayGeneral = document.getElementById('overlay-general');
  elements.overlayRestPanel = document.getElementById('overlay-rest-panel');
  elements.overlayRestTimer = document.getElementById('overlay-rest-timer');
  elements.overlayToRest = document.getElementById('overlay-to-rest');
  elements.overlayClose = document.getElementById('overlay-close');
  elements.overlayMessage = document.getElementById('overlay-message');
  elements.overlaySummary = document.getElementById('overlay-summary');
  elements.overlayObserver = document.getElementById('overlay-observer');
}

function ensureOverlayLayer() {
  if (!document.getElementById('overlay')) {
    const template = document.getElementById('overlay-template');
    if (template?.content) {
      document.body.appendChild(template.content.cloneNode(true));
    }
  }
  refreshOverlayRefs();
  if (elements.overlay) {
    elements.overlay.setAttribute('aria-hidden', 'true');
    elements.overlay.setAttribute('hidden', '');
    elements.overlay.style.display = 'none';
    elements.overlay.classList.add('hidden');
  }
}

const builderSelection = { cardio: null, lower: null, upper: null, core: null };
const exercisePreviewLevels = {};
const trainingRepsInputs = {};
const trainingRepsLabels = {};
const trainingHistoryColumns = {};
let trainingTimerId;
let trainingTimerDeadline = null;
let trainingTimerBlink = false;
let trainingQrInstance = null;
let sessionTimerId;
let phaseTimerId;
let runnerGeneralTimerId;
let runnerPhaseTimerId;
let phaseDeadline = 0;
let sessionRemainingMs = state.sessionMinutes * 60000;
let sessionRunning = false;
let skillRunActive = false;
let skillPhase = 'work';
let currentCycle = null;
let plannedCycles = 1;
const cycleColors = ['#e0f2fe', '#dcfce7', '#fef3c7', '#fee2d3', '#ede9fe', '#f0fdf4'];
const encouragements = [
  'Super, on repart !',
  'Garde le rythme, encore un effort !',
  'Allez, on y retourne en puissance !',
  'Respire, tu es presque au bout !',
  'Encore une tranche et c’est gagné !',
];
let runnerActive = false;
let runnerPhase = 'idle';
let runnerCurrentCycle = null;
let runnerDeadline = 0;
let runnerPhaseDeadline = 0;
let runnerCycles = [];
let runnerSkillId = null;
let runnerGeneralRemainingMs = state.sessionMinutes * 60000;
let runnerRestRemaining = 0;
let runnerManualReps = {};
let runnerPendingManualReps = null;
let runnerWorkWarningShown = false;
let runnerRestWarningShown = false;
let overlayWorkWarningShown = false;
let overlayRestWarningShown = false;

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function getStorageEngine() {
  if (typeof window === 'undefined') return null;
  try {
    if (window[STORAGE_MODE]) {
      return window[STORAGE_MODE];
    }
  } catch (error) {
    console.warn('Storage mode fallback', error);
  }
  try {
    return window.localStorage || window.sessionStorage || null;
  } catch (error) {
    console.warn('Storage unavailable', error);
    return null;
  }
}

function normalizeStudents(baseStudents, snapshotStudents) {
  const merged = clone(baseStudents);
  if (!snapshotStudents) return merged;
  studentIds.forEach((id) => {
    if (!merged[id]) merged[id] = { enabled: true, prenom: '', nom: '', classe: '' };
    merged[id] = { ...merged[id], ...(snapshotStudents[id] || {}) };
  });
  return merged;
}

function migrateLegacyNotes(snapshot) {
  const notes = { ...clone(defaultState.notes) };
  if (!snapshot?.students) return notes;
  studentIds.forEach((id) => {
    const legacy = snapshot.students[id];
    if (legacy && typeof legacy.notes === 'string') {
      notes[id] = legacy.notes;
    }
  });
  return notes;
}

function hydrateFromSnapshot(snapshot) {
  const base = clone(defaultState);
  if (!snapshot || typeof snapshot !== 'object') return base;
  const merged = { ...base, ...snapshot };
  merged.students = normalizeStudents(base.students, snapshot.students);
  merged.notes = snapshot.notes ? { ...base.notes, ...snapshot.notes } : migrateLegacyNotes(snapshot);
  merged.qrOptions = { ...base.qrOptions, ...(snapshot.qrOptions || {}) };
  merged.trainingTests = Array.isArray(snapshot.trainingTests) ? snapshot.trainingTests : [];
  merged.results = Array.isArray(snapshot.results) ? snapshot.results : [];
  merged.skills = Array.isArray(snapshot.skills) ? snapshot.skills : [];
  merged.archives = Array.isArray(snapshot.archives) ? snapshot.archives : [];
  merged.studentSkills = snapshot.studentSkills || clone(base.studentSkills);
  merged.evaluation = { ...base.evaluation, ...(snapshot.evaluation || {}) };
  merged.assignedChallenges = snapshot.assignedChallenges
    ? { A: snapshot.assignedChallenges.A || null, B: snapshot.assignedChallenges.B || null }
    : clone(base.assignedChallenges);
  if (!merged.notes.prof && typeof snapshot.profNotes === 'string') {
    merged.notes.prof = snapshot.profNotes;
  }
  return merged;
}

function normalizeTrainingFromBucket(bucket) {
  if (!bucket || typeof bucket !== 'object') return [];
  const normalized = [];
  studentIds.forEach((id) => {
    const list = Array.isArray(bucket[id]) ? bucket[id] : [];
    list.forEach((entry) => {
      normalized.push({ ...entry, student: id });
    });
  });
  return normalized;
}

function hydrateFromEnvelope(envelope) {
  if (!envelope || typeof envelope !== 'object') return clone(defaultState);
  if (envelope.snapshot) return hydrateFromSnapshot(envelope.snapshot);
  // Treat envelope as a minimal persisted bucket.
  const base = clone(defaultState);
  base.students = normalizeStudents(base.students, envelope.students);
  base.studentMode = envelope.mode?.studentMode || envelope.studentMode || base.studentMode;
  base.activeStudent = envelope.mode?.active || envelope.activeStudent || base.activeStudent;
  base.observer = envelope.mode?.observer || envelope.observer || base.observer;
  base.trainingTests = normalizeTrainingFromBucket(envelope.training);
  base.notes = envelope.notes ? { ...base.notes, ...envelope.notes } : base.notes;
  base.evaluation = { ...base.evaluation, ...(envelope.evaluation || {}) };
  base.assignedChallenges = envelope.assignedChallenges
    ? { A: envelope.assignedChallenges.A || null, B: envelope.assignedChallenges.B || null }
    : base.assignedChallenges;
  base.archives = Array.isArray(envelope.archives) ? envelope.archives : base.archives;
  if (Array.isArray(envelope.results)) base.results = envelope.results;
  if (Array.isArray(envelope.skillsSnapshot)) base.skills = envelope.skillsSnapshot;
  if (envelope.snapshotState) {
    return hydrateFromSnapshot(envelope.snapshotState);
  }
  return base;
}

function loadState() {
  const storage = getStorageEngine();
  if (!storage) return clone(defaultState);
  const raw =
    storage.getItem(STORAGE_KEY) ||
    storage.getItem(LEGACY_STORAGE_KEY);
  if (!raw) return clone(defaultState);
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return clone(defaultState);
    if (parsed.snapshot || parsed.training || parsed.mode) {
      return hydrateFromEnvelope(parsed);
    }
    return hydrateFromSnapshot(parsed);
  } catch (error) {
    console.warn('State load error', error);
    return clone(defaultState);
  }
}

function buildTrainingBucketFromState() {
  const bucket = {};
  studentIds.forEach((id) => {
    bucket[id] = state.trainingTests
      .filter((test) => test.student === id)
      .map((test) => ({
        exercise: test.exercise,
        level: test.level ?? null,
        reps: Number.isFinite(test.reps) ? test.reps : null,
        timestamp: test.timestamp || null,
      }));
  });
  return bucket;
}

function buildSkillsBucketFromState() {
  const bucket = { A: [], B: [] };
  (state.skills || []).forEach((skill) => {
    const owner = skill.owner === 'B' ? 'B' : 'A';
    if (!bucket[owner]) bucket[owner] = [];
    bucket[owner].push({
      id: skill.id,
      name: skill.name,
      course: skill.course?.label || '',
      exercises: (skill.exercises || []).map((exercise) => ({
        id: exercise.id,
        level: exercise.level,
        reps: exercise.reps,
      })),
      createdAt: skill.createdAt || null,
    });
  });
  return bucket;
}

function buildPersistenceEnvelope() {
  return {
    v: STORAGE_VERSION,
    updatedAt: new Date().toISOString(),
    students: normalizeStudents(defaultState.students, state.students),
    mode: { studentMode: state.studentMode, active: state.activeStudent, observer: state.observer || '' },
    training: buildTrainingBucketFromState(),
    skills: buildSkillsBucketFromState(),
    evaluation: { ...state.evaluation },
    notes: { ...state.notes },
    assignedChallenges: { ...state.assignedChallenges },
    archives: Array.isArray(state.archives) ? state.archives.slice(0, 20) : [],
    snapshot: clone(state),
  };
}

function saveState() {
  const storage = getStorageEngine();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(buildPersistenceEnvelope()));
    if (LEGACY_STORAGE_KEY) {
      storage.removeItem(LEGACY_STORAGE_KEY);
    }
  } catch (error) {
    console.warn('State save error', error);
  }
}

function clearStoredState() {
  const storage = getStorageEngine();
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
    if (LEGACY_STORAGE_KEY) storage.removeItem(LEGACY_STORAGE_KEY);
  } catch (error) {
    console.warn('State reset error', error);
  }
}

function resetState({ reload = false } = {}) {
  clearStoredState();
  state = clone(defaultState);
  if (reload) {
    window.location.reload();
    return;
  }
  saveState();
}

function formatTime(ms) {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}’${secs.toString().padStart(2, '0')}`;
}

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getRestDurationMs() {
  return Math.max(5, Number(state.restSeconds) || 30) * 1000;
}

function getManualRestInputMs() {
  return Math.max(0, Number(state.manualRestSeconds) || 0) * 1000;
}

function getWorkDurationMs() {
  return Math.max(30, Number(state.workSeconds) || 120) * 1000;
}

function getEncouragement() {
  return encouragements[Math.floor(Math.random() * encouragements.length)];
}

function formatWorkLabel() {
  const mins = state.workSeconds / 60;
  if (Number.isInteger(mins)) return `${mins}’`;
  return `${mins.toFixed(1)}’`;
}

function computeManualRest(workMs, workedMs) {
  return Math.max(0, workMs - workedMs);
}

function formatStudentDisplay(student) {
  if (!student) return '';
  const first = student.prenom?.trim() || '';
  const initial = student.nom && student.nom.trim().length ? ` ${student.nom.trim().charAt(0).toUpperCase()}.` : '';
  const classe = student.classe ? ` — ${student.classe}` : '';
  return `${first}${initial}${classe}`.trim();
}

function formatShortStudent(student) {
  if (!student) return '';
  const parts = [];
  if (student.prenom?.trim()) parts.push(student.prenom.trim());
  if (student.classe?.trim()) parts.push(student.classe.trim());
  return parts.join(' • ');
}

function getSkillLibrary() {
  return skillLibraryDataset.slice();
}

function cloneFallbackSkillDataset() {
  return SKILL_LIBRARY_FALLBACK.map((entry) => ({ ...entry }));
}

function parseSkillCsv(text) {
  if (!text) return [];
  const rows = [];
  const sanitized = text.replace(/\r\n/g, '\n').split('\n');
  sanitized.forEach((line, index) => {
    if (!line) return;
    const trimmed = line.trim().replace(/^\uFEFF/, '');
    if (!trimmed) return;
    if (index === 0 && trimmed.toLowerCase().startsWith('name,')) return;
    const [name = '', difficulty = '0', points = '0'] = trimmed.split(',');
    rows.push({
      name: name.trim() || `Skill ${rows.length + 1}`,
      difficulty: Number(difficulty) || 0,
      points: Number(points) || 0,
    });
  });
  return rows;
}

function loadSkillLibraryDataset() {
  if (typeof fetch !== 'function' || typeof window === 'undefined') {
    return Promise.resolve(cloneFallbackSkillDataset());
  }
  return fetch('data/skills.csv', { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`CSV introuvable (${response.status})`);
      }
      return response.text();
    })
    .then((csvText) => {
      const parsed = parseSkillCsv(csvText);
      if (!parsed.length) {
        throw new Error('CSV vide');
      }
      return parsed;
    })
    .catch((error) => {
      console.warn('Lecture CSV impossible, fallback local utilisé.', error);
      return cloneFallbackSkillDataset();
    });
}

function getChallengeByName(name) {
  if (!name) return null;
  const trimmed = name.trim();
  if (!trimmed) return null;
  return getSkillLibrary().find((entry) => entry.name === trimmed) || null;
}

function getAssignedChallenge(studentId) {
  if (!state.assignedChallenges) return null;
  return state.assignedChallenges[studentId] || null;
}

function assignChallengeToStudent(studentId, challengeName) {
  if (!studentIds.includes(studentId)) return;
  const challenge = getChallengeByName(challengeName);
  if (!challenge) {
    showToast('Challenge introuvable.');
    return;
  }
  if (!state.assignedChallenges) state.assignedChallenges = { ...defaultState.assignedChallenges };
  state.assignedChallenges[studentId] = { ...challenge };
  saveState();
  renderSkillRoster();
  renderChallengeLibrary();
  showToast(`Challenge « ${challenge.name} » pour élève ${studentId}`);
}

function clearAssignedChallenge(studentId) {
  if (!studentIds.includes(studentId) || !state.assignedChallenges?.[studentId]) return;
  state.assignedChallenges[studentId] = null;
  saveState();
  renderSkillRoster();
  renderChallengeLibrary();
}

function setActivePage(page) {
  elements.sections.forEach((section) => section.classList.toggle('is-active', section.dataset.page === page));
  elements.navButtons.forEach((btn) => btn.classList.toggle('is-active', btn.dataset.target === page));
}

elements.navButtons.forEach((btn) => {
  btn.addEventListener('click', () => setActivePage(btn.dataset.target));
});

elements.homeQuickButtons.forEach((btn) => {
  btn.addEventListener('click', () => setActivePage(btn.dataset.go));
});

function initStudents() {
  studentIds.forEach((id) => {
    const prenom = document.getElementById(`student${id}-first`);
    const classe = document.getElementById(`student${id}-class`);
    const radio = document.querySelector(`input[name="active-student"][value="${id}"]`);
    if (prenom) {
      prenom.value = state.students[id].prenom;
      prenom.addEventListener('input', () => {
        state.students[id].prenom = prenom.value;
        saveState();
        updateTrainingRepsUI();
        updateTrainingHistoryUI();
        renderSkillRoster();
      });
    }
    if (classe) {
      classe.value = state.students[id].classe;
      classe.addEventListener('input', () => {
        state.students[id].classe = classe.value;
        saveState();
        updateTrainingRepsUI();
        updateTrainingHistoryUI();
        renderSkillRoster();
      });
    }
    if (radio) {
      studentActiveRadios[id] = radio;
      radio.checked = state.activeStudent === id;
      radio.addEventListener('change', () => {
        if (!radio.checked) return;
        setActiveStudent(id);
      });
    }
  });
  updateActiveStudentRadios();
  initStudentMode();
  applyStudentModeEffects();
  notesUpdate();
}

function initStudentMode() {
  const radios = document.querySelectorAll('input[name="student-mode"]');
  elements.studentModeRadios = radios;
  radios.forEach((radio) => {
    radio.checked = state.studentMode === radio.value;
    radio.addEventListener('change', () => {
      if (!radio.checked) return;
      state.studentMode = radio.value;
      saveState();
      applyStudentModeEffects();
    });
  });
  applyStudentModeEffects();
}

function applyStudentModeEffects() {
  const isAltern = state.studentMode === 'altern';
  state.students.A.enabled = true;
  state.students.B.enabled = isAltern;
  const studentBCard = document.querySelector('.identity-card[data-student="B"]');
  if (studentBCard) studentBCard.classList.toggle('is-hidden', !isAltern);
  if (!isAltern) {
    setActiveStudent('A', true);
  } else if (!state.students[state.activeStudent]?.enabled) {
    setActiveStudent('A', true);
  }
  studentIds.forEach((id) => {
    if (studentActiveRadios[id]) {
      studentActiveRadios[id].disabled = false;
    }
  });
  updateActiveStudentRadios();
  updateObserverFromMode();
  updateRunnerRestButtonLabel();
  updateTrainingRepsUI();
  updateTrainingHistoryUI();
  renderSkillRoster();
  renderSkillDetails();
  updateBuilderOwnerRadios();
  syncStudentSkillSelections();
  saveState();
}

function refreshNotesArea() {
  if (!elements.notesArea) return;
  elements.notesArea.value = state.notes?.[state.activeStudent] || '';
}

function notesUpdate() {
  if (!elements.notesArea) return;
  refreshNotesArea();
  elements.notesArea.addEventListener('input', () => {
    state.notes[state.activeStudent] = elements.notesArea.value;
    saveState();
  });
}

function setActiveStudent(id, skipSave) {
  if (!state.students[id]?.enabled) return;
  state.activeStudent = id;
  updateActiveStudentRadios();
  updateObserverFromMode();
  refreshNotesArea();
  renderSkillDetails();
  renderSkillRoster();
  renderSkillLibrary();
  renderRunnerSelect();
  if (!skipSave) {
    saveState();
  }
}

function updateActiveStudentRadios() {
  studentIds.forEach((id) => {
    if (studentActiveRadios[id]) {
      studentActiveRadios[id].checked = state.activeStudent === id;
    }
  });
  updateTrainingHistoryUI();
}

function updateObserverFromMode() {
  if (state.studentMode === 'altern') {
    const other = state.activeStudent === 'A' ? 'B' : 'A';
    const otherStudent = state.students[other];
    state.observer = formatStudentDisplay(otherStudent);
  }
  if (elements.observerBlock) {
    elements.observerBlock.hidden = state.studentMode === 'altern';
  }
  if (elements.observerInput) {
    elements.observerInput.value = state.observer || '';
    elements.observerInput.disabled = state.studentMode === 'altern';
  }
  if (elements.runnerObserverInput) {
    elements.runnerObserverInput.value = state.observer || '';
    elements.runnerObserverInput.disabled = state.studentMode === 'altern';
  }
}

function updateTrainingRepsUI() {
  if (!elements.trainingRepsBlock) return;
  const isAltern = state.studentMode === 'altern';
  studentIds.forEach((id) => {
    const row = elements.trainingRepsBlock.querySelector(`[data-training-student="${id}"]`);
    if (!row) return;
    const label = trainingRepsLabels[id];
    if (label) {
      const info = formatShortStudent(state.students[id]);
      label.textContent = info ? `(${info})` : '';
    }
    const input = trainingRepsInputs[id];
    if (!input) return;
    if (id === 'B' && !isAltern) {
      row.hidden = true;
      input.value = '';
      input.disabled = true;
    } else {
      row.hidden = false;
      input.disabled = false;
    }
  });
}

function rotateActiveStudentIfNeeded() {
  if (state.studentMode !== 'altern') return;
  const next = state.activeStudent === 'A' ? 'B' : 'A';
  setActiveStudent(next, true);
  updateObserverFromMode();
  saveState();
}


function initNav() {
  setActivePage('home');
}

function renderExercises() {
  if (!elements.exerciseList) return;
  const selectedFamilies = new Set(Object.entries(builderSelection).filter(([, slot]) => Boolean(slot)).map(([family]) => family));
  const builderComplete = selectedFamilies.size === Object.keys(families).length;
  if (builderComplete) {
    elements.exerciseList.innerHTML = '<div class="repertoire-empty">Skill complet — ajuste tes répétitions puis enregistre.</div>';
    return;
  }
  const availableExercises = exercises.filter((exercise) => !selectedFamilies.has(exercise.family));
  if (!availableExercises.length) {
    elements.exerciseList.innerHTML = '<div class="repertoire-empty">Choisis un exercice pour démarrer.</div>';
    return;
  }
  elements.exerciseList.innerHTML = availableExercises
    .map((exercise) => {
      const level = getPreviewLevel(exercise);
      return `
        <article class="exercise-card" data-family="${exercise.family}">
          <button class="exercise-visual" type="button" data-open="${exercise.id}" aria-label="Voir ${exercise.name}">
            ${level.visual ? `<img src="${level.visual}" alt="Visuel ${exercise.name}" />` : `<span class="exercise-placeholder">${exercise.name}</span>`}
          </button>
          <button class="exercise-name" type="button" data-open="${exercise.id}">${exercise.name}</button>
          <div class="exercise-mini-actions">
            <button class="btn ghost mini-info" data-open="${exercise.id}">Voir la fiche</button>
            <button class="btn primary mini-add" data-add="${exercise.id}">Ajouter</button>
          </div>
        </article>
      `;
    })
    .join('');
  elements.exerciseList.querySelectorAll('[data-open]').forEach((btn) => {
    const exercise = exercises.find((ex) => ex.id === btn.dataset.open);
    btn.addEventListener('click', () => openExerciseModal(exercise));
  });
  elements.exerciseList.querySelectorAll('[data-add]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const exercise = exercises.find((ex) => ex.id === btn.dataset.add);
      if (builderSelection[exercise.family]) {
        showToast('Famille déjà sélectionnée.');
        return;
      }
      builderSelection[exercise.family] = { id: exercise.id, level: 1, reps: 10 };
      renderBuilderSlots();
      renderExercises();
    });
  });
}

function getPreviewLevel(exercise) {
  const tier = exercisePreviewLevels[exercise.id] || exercise.levels[0].tier;
  return exercise.levels.find((lvl) => lvl.tier === tier) || exercise.levels[0];
}

function escapeHtml(text) {
  if (text == null) return '';
  return String(text).replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return char;
    }
  });
}

function buildExercisePopupHtml(exercise) {
  const steps = (exercise.steps && exercise.steps.length ? exercise.steps : ['Aucun critère précisé.'])
    .map((step) => `<li>${escapeHtml(step)}</li>`)
    .join('');
  const safety = (exercise.safety && exercise.safety.length ? exercise.safety : ['Aucun repère de sécurité.'])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');
  const levels = (exercise.levels || [])
    .map(
      (level) => `
        <li>
          <strong>Niveau ${level.tier} — ${escapeHtml(level.label)}</strong>
          <p>${escapeHtml(level.detail || '')}</p>
        </li>
      `,
    )
    .join('') || '<li>Aucun niveau défini.</li>';
  const preview = getPreviewLevel(exercise);
  const visual = preview?.visual
    ? `<img src="${preview.visual}" alt="Visuel ${escapeHtml(exercise.name)}" class="popup-visual" />`
    : '';
  const docInfo = exerciseDocuments[exercise.id];
  const docLink = docInfo
    ? `<p class="popup-doc"><a href="${docInfo.src}" target="_blank" rel="noopener">Consulter le document</a></p>`
    : '';
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <title>${escapeHtml(exercise.name)}</title>
        <style>
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 1.2rem; background: #f8fafc; color: #0f172a; }
          h1 { margin-top: 0; font-size: 1.6rem; }
          .popup-desc { color: #475569; margin-bottom: 1rem; }
          .popup-section { margin-bottom: 1rem; }
          .popup-section h2 { font-size: 1rem; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 0.4rem; }
          ul { margin: 0; padding-left: 1.2rem; }
          li { margin-bottom: 0.3rem; }
          .popup-visual { width: 100%; max-width: 320px; display: block; margin: 0 auto 1rem; border-radius: 12px; }
          .popup-actions { margin-top: 1.2rem; text-align: center; }
          button { background: #2563eb; color: #fff; border: none; border-radius: 999px; padding: 0.5rem 1.5rem; font-size: 1rem; cursor: pointer; }
          .popup-doc a { color: #2563eb; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(exercise.name)}</h1>
        <p class="popup-desc">${escapeHtml(exercise.description || '')}</p>
        ${visual}
        ${docLink}
        <section class="popup-section">
          <h2>Critères de réalisation</h2>
          <ul>${steps}</ul>
        </section>
        <section class="popup-section">
          <h2>Critères de sécurité</h2>
          <ul>${safety}</ul>
        </section>
        <section class="popup-section">
          <h2>Niveaux</h2>
          <ul>${levels}</ul>
        </section>
        <div class="popup-actions">
          <button type="button" onclick="window.close()">Fermer</button>
        </div>
      </body>
    </html>
  `;
}

function openExerciseModal(exercise) {
  if (!exercise) return;
  const popup = window.open('', '_blank', 'width=520,height=720');
  if (!popup) {
    showToast('Autorise les pop-up pour voir la fiche.');
    return;
  }
  popup.document.write(buildExercisePopupHtml(exercise));
  popup.document.close();
}

function renderBuilderSlots() {
  const list = Object.entries(families)
    .map(([family, info]) => {
      const slot = builderSelection[family];
      if (!slot) {
        return `
          <div class="builder-slot" data-family="${family}">
            <strong>${info.label}</strong>
            <p>Sélectionne un exercice ${info.label.toLowerCase()}.</p>
          </div>
        `;
      }
      const exercise = exercises.find((ex) => ex.id === slot.id);
      return `
        <div class="builder-slot" data-family="${family}">
          <strong>${info.label}</strong>
          <p>${exercise?.name || 'Exercice'}</p>
          <label>Répétitions prévues</label>
          <input type="number" min="1" max="50" value="${slot.reps}" data-reps="${family}" />
          <label>Niveau</label>
          <select data-level="${family}">
            ${exercise.levels
              .map(
                (level) => `<option value="${level.tier}" ${level.tier === slot.level ? 'selected' : ''}>Niveau ${level.tier}</option>`,
              )
              .join('')}
          </select>
          <button class="btn ghost small" data-remove="${family}">Changer</button>
        </div>
      `;
    })
    .join('');
  elements.builderSlots.innerHTML = list;
  elements.builderSlots.querySelectorAll('[data-reps]').forEach((input) => {
    input.addEventListener('input', () => {
      builderSelection[input.dataset.reps].reps = Math.max(1, Number(input.value) || 1);
    });
  });
  elements.builderSlots.querySelectorAll('[data-level]').forEach((select) => {
    select.addEventListener('change', () => {
      builderSelection[select.dataset.level].level = Number(select.value);
    });
  });
  elements.builderSlots.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      builderSelection[btn.dataset.remove] = null;
      renderBuilderSlots();
      renderExercises();
    });
  });
  updateBuilderStatus();
}

function updateBuilderStatus() {
  if (!elements.builderStatus) return;
  const missing = Object.entries(builderSelection)
    .filter(([, slot]) => !slot)
    .map(([family]) => families[family].label);
  if (missing.length) {
    elements.builderStatus.textContent = `Reste : ${missing.join(' • ')}`;
    elements.builderStatus.classList.add('warn');
    elements.builderStatus.classList.remove('ok');
    return;
  }
  elements.builderStatus.textContent = 'Skill prêt.';
  elements.builderStatus.classList.add('ok');
  elements.builderStatus.classList.remove('warn');
}

function initBuilderOwner() {
  if (!elements.builderOwnerInputs?.length) return;
  updateBuilderOwnerRadios();
  elements.builderOwnerInputs.forEach((input) => {
    input.checked = input.value === builderOwner;
    input.addEventListener('change', () => {
      if (!input.checked) return;
      builderOwner = input.value;
      state.builderOwner = builderOwner;
      saveState();
    });
  });
  updateBuilderOwnerRadios();
}

function updateBuilderOwnerRadios() {
  if (!elements.builderOwnerInputs?.length) return;
  const duo = state.studentMode === 'altern';
  elements.builderOwnerInputs.forEach((input) => {
    if (input.value === 'B') {
      input.disabled = !duo;
    }
    if (input.value === builderOwner) {
      input.checked = true;
    }
  });
  if (!duo && builderOwner === 'B') {
    builderOwner = 'A';
    state.builderOwner = builderOwner;
    elements.builderOwnerInputs.forEach((input) => {
      input.checked = input.value === 'A';
    });
    saveState();
  }
}

function saveSkill() {
  const incomplete = Object.values(builderSelection).some((slot) => !slot);
  if (incomplete) {
    showToast('Prévois un exercice par famille.');
    return;
  }
  const name = elements.skillNameInput?.value.trim() || `Skill ${state.skills.length + 1}`;
  const owner = builderOwner || 'A';
  const newSkill = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    exercises: Object.entries(builderSelection).map(([family, slot]) => ({ ...slot, family })),
    course: state.course,
    owner,
  };
  state.skills.unshift(newSkill);
  if (!state.studentSkills) state.studentSkills = { A: null, B: null };
  state.studentSkills[owner] = newSkill.id;
  state.selectedSkill = newSkill.id;
  Object.keys(builderSelection).forEach((family) => (builderSelection[family] = null));
  if (elements.skillNameInput) elements.skillNameInput.value = '';
  saveState();
  renderBuilderSlots();
  renderSkillList();
  renderSkillDetails();
  renderSkillLibrary();
  renderSkillRoster();
  renderExercises();
}

function renderSkillList() {
  if (!state.skills.length) {
    elements.skillList.innerHTML = '<p>Aucun skill.</p>';
    elements.skillSelect.innerHTML = '<option value="">Aucun skill</option>';
    renderRunnerSelect();
    renderSkillLibrary();
    renderSkillRoster();
    return;
  }
  const sorted = [...state.skills].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const selectedId = getSelectedSkillId();
  elements.skillList.innerHTML = sorted
    .map(
      (skill) => `
        <div class="skill-card ${selectedId === skill.id ? 'is-active' : ''}">
          <div>
            <strong>${skill.name}</strong>
            <p>${skill.exercises.map((item) => exercises.find((ex) => ex.id === item.id)?.name || '').join(' • ')} • Course ${
              skill.course.label
            }</p>
            <span class="skill-owner-badge">Élève ${skill.owner || 'A'}</span>
          </div>
          <button class="btn ghost" data-remove="${skill.id}">Supprimer</button>
        </div>
      `,
    )
    .join('');
  elements.skillList.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      deleteSkill(btn.dataset.remove);
    });
  });
  const available = getSkillsForStudent(state.activeStudent);
  if (!available.length) {
    elements.skillSelect.innerHTML = '<option value="">Aucun skill</option>';
    elements.skillSelect.value = '';
  } else {
    elements.skillSelect.innerHTML = available.map((skill) => `<option value="${skill.id}">${skill.name}</option>`).join('');
    const preferred = getSelectedSkillId() || available[0].id;
    elements.skillSelect.value = available.some((skill) => skill.id === preferred) ? preferred : available[0].id;
  }
  renderRunnerSelect();
  renderSkillLibrary();
  renderSkillRoster();
}

function renderSkillRoster() {
  if (!elements.skillRoster) return;
  const visibleStudents = state.studentMode === 'altern' ? studentIds : ['A'];
  elements.skillRoster.innerHTML = visibleStudents
    .map((id) => {
      const student = state.students[id];
      const display = formatStudentDisplay(student) || `Élève ${id}`;
      const skills = getSkillsForStudent(id);
      const selectedId = state.studentSkills?.[id] || skills[0]?.id || null;
      const selectedSkill = getSkillById(selectedId);
      const challenge = getAssignedChallenge(id);
      const colorClass = studentAccentMap[id] || '';
      const summary = selectedSkill
        ? selectedSkill.exercises
            .map((item) => {
              const exercise = exercises.find((ex) => ex.id === item.id);
              return `${exercise?.name || 'Exercice'} • N${item.level} • ${item.reps} reps`;
            })
            .join(' / ')
        : '';
      const selectBlock =
        skills.length > 1
          ? `
          <label class="skill-roster-select">
            Skill enregistré
            <select data-roster-select="${id}">
              ${skills
                .map((skill) => `<option value="${skill.id}" ${skill.id === selectedId ? 'selected' : ''}>${skill.name}</option>`)
                .join('')}
            </select>
          </label>
        `
          : '';
      const actionBlock = selectedSkill
        ? `
          <div class="skill-roster-actions">
            <button class="btn secondary small" data-roster-edit="${selectedSkill.id}" data-student="${id}">Modifier</button>
            <button class="btn primary small" data-roster-exam="${selectedSkill.id}" data-student="${id}">Mode examen</button>
          </div>
        `
        : `
          <div class="skill-roster-actions">
            <button class="btn secondary small" data-roster-create="${id}">Construire un skill</button>
          </div>
        `;
      const content = selectedSkill
        ? `
          ${selectBlock}
          <article class="skill-roster-item is-selected">
            <div>
              <strong>${selectedSkill.name}</strong>
              <p>${summary}</p>
            </div>
            ${actionBlock}
          </article>
        `
        : `
          <p class="skill-roster-empty">Aucun skill enregistré pour cet élève.</p>
          ${selectBlock}
          ${actionBlock}
        `;
      return `
        <article class="skill-roster-card ${colorClass}" data-student="${id}">
          <div class="skill-roster-head">
            <div>
              <p>${id === 'A' ? 'Élève A' : 'Élève B'}</p>
              <strong>${display}</strong>
            </div>
            <span class="skill-roster-pill">${selectedSkill ? 'Skill prêt' : 'À définir'}</span>
          </div>
          <div class="skill-roster-list">${content}</div>
          ${
            challenge
              ? `<div class="challenge-tag">Challenge : ${escapeHtml(challenge.name)} • ${challenge.points} pts <button data-clear-challenge="${id}" type="button">×</button></div>`
              : '<div class="challenge-tag challenge-tag--empty">Aucun challenge attribué</div>'
          }
        </article>
      `;
    })
    .join('');
  elements.skillRoster.querySelectorAll('[data-roster-select]').forEach((select) => {
    select.addEventListener('change', () => {
      handleStudentSkillAction(select.dataset.rosterSelect, select.value);
    });
  });
  elements.skillRoster.querySelectorAll('[data-roster-edit]').forEach((btn) => {
    btn.addEventListener('click', () => openSkillEditModal(btn.dataset.rosterEdit, btn.dataset.student));
  });
  elements.skillRoster.querySelectorAll('[data-roster-exam]').forEach((btn) => {
    btn.addEventListener('click', () => handleStudentSkillAction(btn.dataset.student, btn.dataset.rosterExam, { launch: true }));
  });
  elements.skillRoster.querySelectorAll('[data-roster-create]').forEach((btn) => {
    btn.addEventListener('click', () => {
      builderOwner = btn.dataset.rosterCreate;
      state.builderOwner = builderOwner;
      updateBuilderOwnerRadios();
      saveState();
      setActivePage('repertoire');
      showToast('Ouvre le répertoire et construis ton skill.');
    });
  });
  elements.skillRoster.querySelectorAll('[data-clear-challenge]').forEach((btn) => {
    btn.addEventListener('click', () => clearAssignedChallenge(btn.dataset.clearChallenge));
  });
}

function renderChallengeLibrary() {
  if (!elements.challengeList) return;
  const dataset = getSkillLibrary();
  const filterValue = elements.challengeFilter?.value || '';
  const filtered = dataset
    .filter((entry) => (!filterValue ? true : String(entry.difficulty) === filterValue))
    .sort((a, b) => a.difficulty - b.difficulty || a.name.localeCompare(b.name, 'fr'));
  if (!filtered.length) {
    elements.challengeList.innerHTML = '<p>Aucun challenge disponible.</p>';
    return;
  }
  elements.challengeList.innerHTML = filtered
    .map((entry) => {
      const encoded = encodeURIComponent(entry.name);
      const assignedStudents = studentIds.filter((id) => getAssignedChallenge(id)?.name === entry.name);
      const assignedHtml = assignedStudents.length
        ? `<div class="challenge-assigned">${assignedStudents
            .map((id) => `<span>Attribué ${id}</span>`)
            .join('')}</div>`
        : '';
      return `
        <div class="challenge-card">
          <div>
            <h4>${escapeHtml(entry.name)}</h4>
            <p class="challenge-meta">Difficulté ${entry.difficulty} • ${entry.points} pts</p>
          </div>
          ${assignedHtml}
          <div class="challenge-actions">
            <button class="btn secondary" data-assign-challenge data-student="A" data-challenge="${encoded}">Assigner à l’élève A</button>
            <button class="btn secondary" data-assign-challenge data-student="B" data-challenge="${encoded}">Assigner à l’élève B</button>
          </div>
        </div>
      `;
    })
    .join('');
  elements.challengeList.querySelectorAll('[data-assign-challenge]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const challengeName = decodeURIComponent(btn.dataset.challenge || '');
      assignChallengeToStudent(btn.dataset.student, challengeName);
    });
  });
}

function openSkillEditModal(skillId, studentId) {
  const skill = getSkillById(skillId);
  if (!skill) {
    showToast('Skill introuvable.');
    return;
  }
  const modal = document.createElement('div');
  modal.className = 'skill-edit-modal';
  const currentCourseValue = skill.course?.value || skill.course?.label || courseOptions[0].value;
  const courseOptionsHtml = courseOptions
    .map((option) => `<option value="${option.value}" ${option.value === currentCourseValue ? 'selected' : ''}>${option.label}</option>`)
    .join('');
  const exercisesHtml = skill.exercises
    .map((item, idx) => {
      const exercise = exercises.find((ex) => ex.id === item.id);
      const levelOptions = exercise?.levels
        ?.map((level) => `<option value="${level.tier}" ${level.tier === item.level ? 'selected' : ''}>Niveau ${level.tier}</option>`)
        .join('');
      return `
        <div class="skill-edit-row">
          <div>
            <strong>${exercise?.name || 'Exercice'}</strong>
            <p>${families[item.family]?.label || ''}</p>
          </div>
          <label>
            Niveau
            <select name="level-${idx}">${levelOptions || ''}</select>
          </label>
          <label>
            Répétitions
            <input type="number" name="reps-${idx}" min="1" value="${item.reps}" />
          </label>
        </div>
      `;
    })
    .join('');
  modal.innerHTML = `
    <div class="skill-edit-dialog" role="dialog" aria-modal="true">
      <header class="skill-edit-head">
        <div>
          <p>Élève ${studentId}</p>
          <h3>Modifier ${skill.name}</h3>
        </div>
        <button class="skill-edit-close" aria-label="Fermer">×</button>
      </header>
      <form class="skill-edit-form">
        <label>
          Nom du skill
          <input type="text" name="skill-name" value="${skill.name}" />
        </label>
        <label>
          Course
          <select name="skill-course">${courseOptionsHtml}</select>
        </label>
        <div class="skill-edit-list">
          ${exercisesHtml}
        </div>
        <div class="skill-edit-actions">
          <button type="button" class="btn ghost" data-close>Annuler</button>
          <button type="submit" class="btn primary">Enregistrer</button>
        </div>
      </form>
    </div>
  `;
  const removeModal = () => {
    modal.remove();
  };
  modal.querySelector('.skill-edit-close')?.addEventListener('click', removeModal);
  modal.querySelector('[data-close]')?.addEventListener('click', removeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) removeModal();
  });
  modal.querySelector('.skill-edit-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const nameInput = form.querySelector('input[name="skill-name"]');
    const courseSelect = form.querySelector('select[name="skill-course"]');
    const nextName = nameInput.value.trim() || skill.name;
    const nextCourse = courseOptions.find((option) => option.value === courseSelect.value) || skill.course;
    const updatedExercises = skill.exercises.map((item, idx) => {
      const levelField = form.querySelector(`select[name="level-${idx}"]`);
      const repsField = form.querySelector(`input[name="reps-${idx}"]`);
      const nextLevel = Number(levelField?.value) || item.level;
      const nextReps = Math.max(1, Number(repsField?.value) || item.reps);
      return { ...item, level: nextLevel, reps: nextReps };
    });
    skill.name = nextName;
    skill.course = nextCourse;
    skill.exercises = updatedExercises;
    saveState();
    renderSkillPlan();
    renderSkillList();
    renderSkillRoster();
    renderSkillLibrary();
    showToast('Skill mis à jour.');
    removeModal();
  });
  document.body.appendChild(modal);
}

function deleteSkill(skillId) {
  state.skills = state.skills.filter((skill) => skill.id !== skillId);
  if (state.selectedSkill === skillId) {
    state.selectedSkill = state.skills[0]?.id || null;
  }
  if (state.studentSkills) {
    studentIds.forEach((id) => {
      if (state.studentSkills[id] === skillId) {
        state.studentSkills[id] = null;
      }
    });
  }
  syncStudentSkillSelections();
  saveState();
  renderSkillList();
  renderSkillDetails();
  renderSkillLibrary();
  renderSkillRoster();
  renderExercises();
}

function selectSkill(skillId, studentId = state.activeStudent) {
  if (!skillId) return;
  const skill = getSkillById(skillId);
  if (!skill) return;
  if (!state.studentSkills) state.studentSkills = { A: null, B: null };
  if (state.students[studentId]?.enabled) {
    state.studentSkills[studentId] = skillId;
  }
  state.selectedSkill = skillId;
  saveState();
  if (elements.skillSelect) elements.skillSelect.value = skillId;
  if (elements.runnerSkillSelect) elements.runnerSkillSelect.value = skillId;
  renderSkillDetails();
  renderSkillLibrary();
  renderSkillRoster();
}

function initCourse() {
  elements.courseSelect.innerHTML = courseOptions.map((option) => `<option value="${option.value}">${option.label}</option>`).join('');
  elements.courseSelect.value = state.course.value;
  elements.courseSelect.addEventListener('change', () => {
    state.course = courseOptions.find((opt) => opt.value === elements.courseSelect.value) || courseOptions[0];
    saveState();
    renderSkillPlan();
  });
  if (elements.restDurationInput) {
    elements.restDurationInput.value = state.restSeconds;
    elements.restDurationInput.addEventListener('input', () => {
      const next = Math.min(180, Math.max(5, Number(elements.restDurationInput.value) || 5));
      state.restSeconds = next;
      elements.restDurationInput.value = next;
      saveState();
      updateRunnerLabels();
    });
  }
  if (elements.observerInput) {
    elements.observerInput.value = state.observer || '';
    if (elements.overlayObserver) elements.overlayObserver.textContent = state.observer || '—';
    elements.observerInput.addEventListener('input', () => {
      state.observer = elements.observerInput.value;
      saveState();
      if (elements.runnerObserverInput) elements.runnerObserverInput.value = state.observer;
      if (elements.overlayObserver) elements.overlayObserver.textContent = state.observer || '—';
    });
  }
}

function initSessionInputs() {
  if (elements.sessionSlider) {
    elements.sessionSlider.value = state.sessionMinutes;
    const updateSlider = () => {
      state.sessionMinutes = Math.max(2, Number(elements.sessionSlider.value) || 2);
      sessionRemainingMs = state.sessionMinutes * 60000;
      runnerGeneralRemainingMs = state.sessionMinutes * 60000;
      if (elements.sessionLabel) elements.sessionLabel.textContent = `${state.sessionMinutes} min`;
      if (elements.sessionBlocks) {
        const blocks = Math.max(1, Math.floor((state.sessionMinutes * 60) / state.workSeconds));
        elements.sessionBlocks.textContent = `${blocks} cycles de ${formatWorkLabel()}`;
      }
      plannedCycles = Math.max(1, Math.floor((state.sessionMinutes * 60) / state.workSeconds) || 1);
      updateRunnerLabels();
      updateRunnerGeneralDisplay();
      saveState();
    };
    elements.sessionSlider.addEventListener('input', updateSlider);
    updateSlider();
  }
  elements.generalModeInputs.forEach((input) => {
    input.checked = state.generalMode === input.value;
    input.addEventListener('change', () => {
      if (input.checked) {
        state.generalMode = input.value;
        saveState();
        updateRunnerLabels();
        runnerGeneralRemainingMs = state.sessionMinutes * 60000;
        updateRunnerGeneralDisplay();
      }
    });
  });
}

function renderSkillPlan() {
  const skillId = getSelectedSkillId();
  const skill = getSkillById(skillId);
  if (!skill || !elements.skillPlanList) {
    elements.skillPlanName.textContent = 'Aucun skill sélectionné';
    elements.skillPlanCourse.textContent = 'Ajoute un skill.';
    if (elements.skillPlanList) elements.skillPlanList.innerHTML = '';
    return;
  }
  elements.skillPlanName.textContent = skill.name;
  elements.skillPlanCourse.textContent = `Course : ${skill.course.label} (${skill.course.note})`;
  elements.skillPlanList.innerHTML = skill.exercises
    .map((item, idx) => {
      const exercise = exercises.find((ex) => ex.id === item.id);
      return `
        <article class="skill-plan-exercise">
          <div>
            <strong>${exercise?.name || 'Exercice'}</strong>
            <p>${families[item.family].label} • Niveau ${item.level}</p>
            <p>${exercise?.description || ''}</p>
          </div>
          <label>
            Niveau
            <select data-plan-level="${idx}">
              ${exercise.levels
                .map(
                  (level) =>
                    `<option value="${level.tier}" ${level.tier === item.level ? 'selected' : ''}>Niveau ${level.tier}</option>`,
                )
                .join('')}
            </select>
          </label>
          <label>
            Répétitions
            <input type="number" min="1" value="${item.reps}" data-plan-reps="${idx}" ${skillRunActive ? 'readonly' : ''} />
          </label>
        </article>
      `;
    })
    .join('');
  elements.skillPlanList.querySelectorAll('[data-plan-level]').forEach((select) => {
    select.addEventListener('change', (event) => {
      const idx = Number(event.target.dataset.planLevel);
      const targetSkill = getSkillById(getSelectedSkillId());
      if (!targetSkill) return;
      targetSkill.exercises[idx].level = Number(event.target.value);
      saveState();
      renderSkillPlan();
    });
  });
  elements.skillPlanList.querySelectorAll('[data-plan-reps]').forEach((input) => {
    input.addEventListener('input', (event) => {
      const idx = Number(event.target.dataset.planReps);
      const targetSkill = getSkillById(getSelectedSkillId());
      if (!targetSkill) return;
      targetSkill.exercises[idx].reps = Math.max(1, Number(event.target.value) || 1);
      saveState();
    });
  });
}

function renderSkillLibrary() {
  if (!elements.skillLibrary) return;
  if (!state.skills.length) {
    elements.skillLibrary.innerHTML = '<p class="skill-library-empty">Aucun skill enregistré.</p>';
    return;
  }
  const selectedId = getSelectedSkillId();
  elements.skillLibrary.innerHTML = state.skills
    .map((skill) => {
      const summary = skill.exercises
        .map((item) => {
          const exercise = exercises.find((ex) => ex.id === item.id);
          return `${families[item.family].label}: ${exercise?.name || ''} (N${item.level}, ${item.reps} reps)`;
        })
        .join(' • ');
      const active = selectedId === skill.id ? 'is-active' : '';
      return `
        <article class="skill-library-card ${active}">
          <div class="skill-library-head">
            <div>
              <h4>${skill.name}</h4>
              <p>${skill.course.label}</p>
            </div>
            <small>${new Date(skill.createdAt).toLocaleDateString('fr-FR')}</small>
          </div>
          <p class="skill-library-summary">${summary}</p>
          <div class="skill-library-actions">
            <button class="btn primary" data-run-skill="${skill.id}">Lancer le travail</button>
            <button class="btn ghost" data-remove-skill="${skill.id}">Supprimer</button>
          </div>
        </article>
      `;
    })
    .join('');
  elements.skillLibrary.querySelectorAll('[data-run-skill]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectSkill(btn.dataset.runSkill, state.activeStudent);
      if (elements.runnerSkillSelect) {
        elements.runnerSkillSelect.value = btn.dataset.runSkill;
      }
      setActivePage('runner');
      showToast('Skill prêt sur la page chrono.');
    });
  });
  elements.skillLibrary.querySelectorAll('[data-remove-skill]').forEach((btn) => {
    btn.addEventListener('click', () => deleteSkill(btn.dataset.removeSkill));
  });
}

function renderOverlaySummary() {
  if (!elements.overlaySummary) return;
  if (!state.results.length) {
    elements.overlaySummary.innerHTML = '<p>Aucune tranche enregistrée pour l’instant.</p>';
    return;
  }
  elements.overlaySummary.innerHTML = state.results
    .map(
      (cycle) => `
        <div class="summary-row">
          <span>Tranche ${cycle.cycle}</span>
          <span>${formatDuration(cycle.work)} travail • ${formatDuration(cycle.rest)} récup${formatManualSummary(cycle.manualReps)}</span>
        </div>
      `,
    )
    .join('');
}

function renderRunnerSelect() {
  if (!elements.runnerSkillSelect) return;
  if (!state.skills.length) {
    elements.runnerSkillSelect.innerHTML = '<option value="">Aucun skill</option>';
    return;
  }
  elements.runnerSkillSelect.innerHTML = state.skills.map((skill) => `<option value="${skill.id}">${skill.name}</option>`).join('');
  const current = getSelectedSkillId() || state.skills[0]?.id || '';
  elements.runnerSkillSelect.value = current || '';
}

function updateRunnerLabels() {
  if (elements.runnerDurationLabel) elements.runnerDurationLabel.textContent = `${state.sessionMinutes} min`;
  if (elements.runnerModeLabel) elements.runnerModeLabel.textContent = state.generalMode === 'chrono' ? 'Chrono' : 'Compte à rebours';
  if (elements.runnerManualBlock) elements.runnerManualBlock.hidden = state.restEnabled;
  if (elements.runnerManualRestInput) {
    elements.runnerManualRestInput.value = state.manualRestSeconds;
    elements.runnerManualRestInput.disabled = state.restEnabled;
  }
  if (elements.runnerWorkInput) {
    elements.runnerWorkInput.value = state.workSeconds;
  }
  if (elements.runnerWorkLabel) elements.runnerWorkLabel.textContent = formatWorkLabel();
  if (elements.runnerRestToggle) {
    elements.runnerRestToggle.checked = state.restEnabled;
  }
  updateRunnerRestButtonLabel();
  if (elements.runnerObserverInput) elements.runnerObserverInput.value = state.observer || '';
  if (elements.runnerTotalInput) elements.runnerTotalInput.value = state.sessionMinutes;
  elements.runnerModeRadios?.forEach((radio) => {
    radio.checked = state.generalMode === radio.value;
  });
  updateRunnerWorkDisplay(getWorkDurationMs());
  if (elements.overlayToRest) {
    elements.overlayToRest.style.display = state.restEnabled ? '' : 'none';
    elements.overlayToRest.disabled = !state.restEnabled;
  }
  renderRunnerManualReps();
}

function updateRunnerRestButtonLabel() {
  if (!elements.runnerRestBtn) return;
  elements.runnerRestBtn.textContent = state.restEnabled ? 'Pause / Récup' : 'Pause';
  elements.runnerRestBtn.disabled = !runnerActive || runnerPhase === 'rest';
}

function renderRunnerSummary() {
  if (!elements.runnerSummary) return;
  if (!runnerCycles.length) {
    elements.runnerSummary.classList.add('runner-summary--empty');
    elements.runnerSummary.innerHTML = '<p>Aucune tranche enregistrée pour l’instant.</p>';
    return;
  }
  elements.runnerSummary.classList.remove('runner-summary--empty');
  elements.runnerSummary.innerHTML = runnerCycles
    .map(
      (cycle) => `
        <div class="summary-row">
          <span>Tranche ${cycle.cycle}</span>
          <span>${formatDuration(cycle.work)} travail • ${formatDuration(cycle.rest)} récup${formatManualSummary(cycle.manualReps)}</span>
        </div>
      `,
    )
    .join('');
}

function getRunnerSkill() {
  const id = runnerSkillId || getSelectedSkillId();
  return state.skills.find((sk) => sk.id === id);
}

function resetRunnerManualReps() {
  runnerManualReps = {};
  const skill = getRunnerSkill();
  if (skill?.exercises?.length) {
    skill.exercises.forEach((exercise) => {
      runnerManualReps[exercise.id] = 0;
    });
  }
  renderRunnerManualReps();
}

function renderRunnerManualReps() {
  if (!elements.runnerRepsPanel || !elements.runnerRepsList) return;
  if (state.restEnabled) {
    elements.runnerRepsPanel.hidden = true;
    elements.runnerRepsList.innerHTML = '';
    if (elements.runnerRepsReset) elements.runnerRepsReset.disabled = true;
    return;
  }
  const skill = getSkillById(runnerSkillId || getSelectedSkillId());
  elements.runnerRepsPanel.hidden = false;
  if (!skill || !skill.exercises.length) {
    elements.runnerRepsList.innerHTML = '<p>Aucun skill sélectionné.</p>';
    if (elements.runnerRepsReset) elements.runnerRepsReset.disabled = true;
    return;
  }
  if (elements.runnerRepsReset) elements.runnerRepsReset.disabled = false;
  skill.exercises.forEach((exercise) => {
    if (typeof runnerManualReps[exercise.id] !== 'number') runnerManualReps[exercise.id] = 0;
  });
  elements.runnerRepsList.innerHTML = skill.exercises
    .map((exercise, index) => {
      const baseExercise = exercises.find((ex) => ex.id === exercise.id);
      const label = baseExercise?.name || `Exercice ${index + 1}`;
      return `
        <div class="runner-rep-row" data-family="${exercise.family}">
          <div>
            <strong>${label}</strong>
            <span class="runner-rep-row-count">${runnerManualReps[exercise.id]} reps</span>
          </div>
          <button type="button" class="btn secondary runner-rep-plus" data-rep-plus="${exercise.id}">+1 rép</button>
        </div>
      `;
    })
    .join('');
  elements.runnerRepsList.querySelectorAll('[data-rep-plus]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.repPlus;
      runnerManualReps[id] = (runnerManualReps[id] || 0) + 1;
      renderRunnerManualReps();
    });
  });
}

function getManualRepsSnapshot() {
  const skill = getRunnerSkill();
  if (!skill || !skill.exercises.length) return null;
  const snapshot = skill.exercises.map((exercise) => ({
    id: exercise.id,
    name: exercise.name,
    reps: runnerManualReps[exercise.id] || 0,
  }));
  return snapshot;
}

function formatManualSummary(manualReps) {
  if (!manualReps || !manualReps.length) return '';
  const filtered = manualReps.filter((entry) => entry.reps > 0);
  if (!filtered.length) return '';
  const labels = filtered.map((entry) => `${entry.name || entry.id} ${entry.reps}`).join(' • ');
  return labels ? ` • ${labels}` : '';
}

function syncRunnerCyclesFromState() {
  runnerCycles = (state.results || []).map((cycle) => ({
    cycle: cycle.cycle,
    work: cycle.work,
    rest: cycle.rest,
    manualReps: cycle.manualReps || null,
  }));
  renderRunnerSummary();
}

function initRunnerPage() {
  if (!elements.runnerStartBtn) return;
  runnerCycles = (state.results || []).map((item) => ({
    cycle: item.cycle,
    work: item.work,
    rest: item.rest,
    manualReps: item.manualReps || null,
  }));
  elements.runnerStartBtn.addEventListener('click', startRunnerSessionFromPage);
  elements.runnerStopBtn?.addEventListener('click', () => stopRunnerSession(false));
  elements.runnerResetBtn?.addEventListener('click', resetRunnerPage);
  elements.runnerRestBtn?.addEventListener('click', () => {
    if (!runnerActive) {
      showToast('Lance la séance d’abord.');
      return;
    }
    if (runnerPhase === 'rest') {
      showToast('Récupération déjà en cours.');
      return;
    }
    if (!state.restEnabled) {
      showToast('Attends la fin de la tranche pour lancer la récup saisie.');
      return;
    }
    runnerBeginRest(true);
  });
  elements.runnerRepsReset?.addEventListener('click', resetRunnerManualReps);
  if (elements.runnerManualRestInput) {
    elements.runnerManualRestInput.addEventListener('input', () => {
      const next = Math.max(0, Number(elements.runnerManualRestInput.value) || 0);
      state.manualRestSeconds = next;
      elements.runnerManualRestInput.value = next;
      saveState();
    });
  }
  if (elements.runnerWorkInput) {
    elements.runnerWorkInput.addEventListener('input', () => {
      const next = Math.min(300, Math.max(30, Number(elements.runnerWorkInput.value) || 120));
      state.workSeconds = next;
      elements.runnerWorkInput.value = next;
      saveState();
      updateRunnerLabels();
      const blocks = Math.max(1, Math.floor((state.sessionMinutes * 60) / state.workSeconds));
      if (elements.sessionBlocks) elements.sessionBlocks.textContent = `${blocks} cycles de ${formatWorkLabel()}`;
    });
  }
  if (elements.runnerRestToggle) {
    elements.runnerRestToggle.addEventListener('change', () => {
      state.restEnabled = elements.runnerRestToggle.checked;
      updateRunnerLabels();
      saveState();
      if (!state.restEnabled) {
        resetRunnerManualReps();
      } else {
        runnerManualReps = {};
        renderRunnerManualReps();
      }
    });
  }
  if (elements.runnerTotalInput) {
    elements.runnerTotalInput.addEventListener('input', () => {
      const next = Math.min(60, Math.max(2, Number(elements.runnerTotalInput.value) || state.sessionMinutes));
      state.sessionMinutes = next;
      if (elements.sessionSlider) elements.sessionSlider.value = next;
      saveState();
      updateRunnerLabels();
      const blocks = Math.max(1, Math.floor((state.sessionMinutes * 60) / state.workSeconds));
      if (elements.sessionLabel) elements.sessionLabel.textContent = `${state.sessionMinutes} min`;
      if (elements.sessionBlocks) elements.sessionBlocks.textContent = `${blocks} cycles de ${formatWorkLabel()}`;
      runnerGeneralRemainingMs = state.sessionMinutes * 60000;
      updateRunnerGeneralDisplay();
    });
  }
  elements.runnerModeRadios?.forEach((radio) => {
    radio.checked = state.generalMode === radio.value;
    radio.addEventListener('change', () => {
      if (radio.checked) {
        state.generalMode = radio.value;
        elements.generalModeInputs.forEach((input) => {
          input.checked = input.value === radio.value;
        });
        saveState();
        updateRunnerLabels();
      }
    });
  });
  if (elements.runnerObserverInput) {
    elements.runnerObserverInput.addEventListener('input', () => {
      state.observer = elements.runnerObserverInput.value;
      saveState();
      if (elements.observerInput) elements.observerInput.value = state.observer;
      if (elements.overlayObserver) elements.overlayObserver.textContent = state.observer || '—';
    });
  }
  renderRunnerSelect();
  updateRunnerLabels();
  updateRunnerGeneralDisplay();
  renderRunnerSummary();
}

function startRunnerSessionFromPage() {
  const skillId = elements.runnerSkillSelect?.value || getSelectedSkillId();
  if (!skillId) {
    showToast('Choisis un skill.');
    return;
  }
  const skill = getSkillById(skillId);
  if (!skill) {
    showToast('Skill introuvable.');
    return;
  }
  if (runnerActive) {
    showToast('Séance déjà en cours.');
    return;
  }
  runnerActive = true;
  updateRunnerLabels();
  runnerSkillId = skill.id;
  if (!state.studentSkills) state.studentSkills = { A: null, B: null };
  state.studentSkills[state.activeStudent] = skill.id;
  state.selectedSkill = skill.id;
  runnerCycles = [];
  runnerCurrentCycle = null;
  state.results = [];
  plannedCycles = Math.max(1, Math.floor((state.sessionMinutes * 60) / state.workSeconds) || 1);
  runnerPhase = 'work';
  runnerRestRemaining = 0;
  saveState();
  renderSkillDetails();
  renderRunnerSummary();
  elements.runnerMessage.textContent = '';
  elements.runnerRestDisplay.textContent = '00:00';
  elements.runnerPhaseLabel.textContent = 'Travail';
  updateRunnerRestButtonLabel();
  startRunnerGeneralTimer();
  startRunnerWorkPhase();
}

function startRunnerGeneralTimer(initialMs) {
  clearInterval(runnerGeneralTimerId);
  const durationMs = typeof initialMs === 'number' ? initialMs : state.sessionMinutes * 60000;
  if (state.generalMode === 'chrono') {
    runnerGeneralRemainingMs = typeof initialMs === 'number' ? initialMs : 0;
    runnerGeneralTimerId = setInterval(() => {
      runnerGeneralRemainingMs += 1000;
      updateRunnerGeneralDisplay();
    }, 1000);
  } else {
    let deadline = performance.now() + durationMs;
    runnerGeneralRemainingMs = durationMs;
    runnerGeneralTimerId = setInterval(() => {
      runnerGeneralRemainingMs = Math.max(0, deadline - performance.now());
      updateRunnerGeneralDisplay();
      if (runnerGeneralRemainingMs <= 0) {
        stopRunnerSession(true);
      }
    }, 250);
  }
  updateRunnerGeneralDisplay();
}

function updateRunnerGeneralDisplay() {
  if (elements.runnerGeneralDisplay) elements.runnerGeneralDisplay.textContent = formatTime(runnerGeneralRemainingMs);
}

function startRunnerWorkPhase() {
  runnerPhase = 'work';
  runnerPendingManualReps = null;
  runnerWorkWarningShown = false;
  runnerRestWarningShown = false;
  if (!state.restEnabled) {
    resetRunnerManualReps();
  } else {
    runnerManualReps = {};
    renderRunnerManualReps();
  }
  updateRunnerRestButtonLabel();
  elements.runnerPhaseLabel.textContent = 'Travail';
  elements.runnerMessage.textContent = '';
  runnerCurrentCycle = { workMs: 0, restMs: 0 };
  const workMs = getWorkDurationMs();
  runnerPhaseDeadline = performance.now() + workMs;
  updateRunnerWorkDisplay(workMs);
  clearInterval(runnerPhaseTimerId);
  runnerPhaseTimerId = setInterval(() => {
    const remaining = Math.max(0, runnerPhaseDeadline - performance.now());
    runnerCurrentCycle.workMs = workMs - remaining;
    updateRunnerWorkDisplay(remaining);
    if (remaining <= 5000 && !runnerWorkWarningShown) {
      elements.runnerMessage.textContent = '5 s – termine ton travail.';
      runnerWorkWarningShown = true;
    }
    if (remaining <= 0) {
      clearInterval(runnerPhaseTimerId);
      runnerBeginRest(false);
    }
  }, 100);
}

function resumeRunnerWorkPhase(remainingMs, workedMs) {
  runnerPhase = 'work';
  runnerWorkWarningShown = false;
  updateRunnerRestButtonLabel();
  elements.runnerPhaseLabel.textContent = 'Travail';
  const workMs = getWorkDurationMs();
  if (runnerCurrentCycle) runnerCurrentCycle.workMs = workedMs;
  runnerPhaseDeadline = performance.now() + remainingMs;
  clearInterval(runnerPhaseTimerId);
  runnerPhaseTimerId = setInterval(() => {
    const remaining = Math.max(0, runnerPhaseDeadline - performance.now());
    runnerCurrentCycle.workMs = workMs - remaining;
    updateRunnerWorkDisplay(remaining);
    if (remaining <= 5000 && !runnerWorkWarningShown) {
      elements.runnerMessage.textContent = '5 s – termine ton travail.';
      runnerWorkWarningShown = true;
    }
    if (remaining <= 0) {
      clearInterval(runnerPhaseTimerId);
      runnerBeginRest(false);
    }
  }, 100);
}

function resumeRunnerRestPhase(remainingMs) {
  runnerPhase = 'rest';
  updateRunnerRestButtonLabel();
  runnerRestWarningShown = false;
  runnerRestRemaining = remainingMs;
  updateRunnerRestDisplay(remainingMs);
  runnerPhaseDeadline = performance.now() + remainingMs;
  clearInterval(runnerPhaseTimerId);
  runnerPhaseTimerId = setInterval(() => {
    const rem = Math.max(0, runnerPhaseDeadline - performance.now());
    runnerRestRemaining = rem;
    updateRunnerRestDisplay(rem);
    if (rem <= 5000 && !runnerRestWarningShown) {
      elements.runnerMessage.textContent = getEncouragement();
      runnerRestWarningShown = true;
      elements.runnerRestDisplay.classList.add('blink');
    } else {
      elements.runnerRestDisplay.classList.remove('blink');
    }
    if (rem <= 0) {
      clearInterval(runnerPhaseTimerId);
      runnerFinishCycle();
    }
  }, 100);
}

function updateRunnerWorkDisplay(ms) {
  if (!elements.runnerWorkDisplay) return;
  elements.runnerWorkDisplay.textContent = formatTime(ms);
}

function runnerBeginRest(manual) {
  if (!runnerActive || runnerPhase === 'rest') return;
  if (!state.restEnabled && manual) {
    showToast('La récup manuelle démarre à la fin de la tranche.');
    return;
  }
  if (!state.restEnabled) {
    if (!manual) {
      runnerPendingManualReps = getManualRepsSnapshot();
    }
  } else {
    runnerPendingManualReps = null;
  }
  clearInterval(runnerPhaseTimerId);
  const workMs = getWorkDurationMs();
  const workedMs = manual ? Math.max(1000, workMs - Math.max(0, runnerPhaseDeadline - performance.now())) : workMs;
  if (runnerCurrentCycle) runnerCurrentCycle.workMs = workedMs;
  let baseRest;
  if (state.restEnabled) {
    baseRest = manual ? computeManualRest(workMs, workedMs) : getRestDurationMs();
  } else {
    baseRest = getManualRestInputMs();
  }
  if (baseRest <= 0) {
    runnerCurrentCycle.restMs = 0;
    runnerFinishCycle();
    return;
  }
  runnerPhase = 'rest';
  runnerRestWarningShown = false;
  elements.runnerPhaseLabel.textContent = 'Récupération';
  elements.runnerMessage.textContent = '';
  runnerRestRemaining = baseRest;
  if (runnerCurrentCycle) runnerCurrentCycle.restMs = baseRest;
  updateRunnerRestDisplay(runnerRestRemaining);
  runnerPhaseDeadline = performance.now() + runnerRestRemaining;
  runnerPhaseTimerId = setInterval(() => {
    const remaining = Math.max(0, runnerPhaseDeadline - performance.now());
    runnerRestRemaining = remaining;
    updateRunnerRestDisplay(remaining);
    if (remaining <= 5000 && !runnerRestWarningShown) {
      elements.runnerMessage.textContent = getEncouragement();
      runnerRestWarningShown = true;
      elements.runnerRestDisplay.classList.add('blink');
    } else {
      elements.runnerRestDisplay.classList.remove('blink');
    }
    if (remaining <= 0) {
      clearInterval(runnerPhaseTimerId);
      runnerFinishCycle();
    }
  }, 100);
}

function updateRunnerRestDisplay(ms) {
  if (!elements.runnerRestDisplay) return;
  elements.runnerRestDisplay.textContent = formatTime(ms);
}

function runnerFinishCycle() {
  elements.runnerRestDisplay.classList.remove('blink');
  if (!runnerCurrentCycle) runnerCurrentCycle = { workMs: 0, restMs: 0 };
  const skill = state.skills.find((sk) => sk.id === runnerSkillId);
  const manualSnapshot = runnerPendingManualReps ? runnerPendingManualReps.map((entry) => ({ ...entry })) : null;
  const manualMap = {};
  manualSnapshot?.forEach((entry) => {
    manualMap[entry.id] = entry.reps;
  });
  const cycle = {
    cycle: runnerCycles.length + 1,
    work: Math.max(1, Math.round((runnerCurrentCycle.workMs || 0) / 1000)),
    rest: Math.max(0, Math.round((runnerCurrentCycle.restMs || 0) / 1000)),
    manualReps: manualSnapshot,
  };
  runnerCycles.push(cycle);
  runnerPendingManualReps = null;
  if (!state.restEnabled) {
    resetRunnerManualReps();
  } else {
    runnerManualReps = {};
    renderRunnerManualReps();
  }
  state.results = runnerCycles.map((item) => ({
    cycle: item.cycle,
    work: item.work,
    rest: item.rest,
    manualReps: item.manualReps || null,
    exercises: (skill?.exercises || []).map((exercise) => ({
      ...exercise,
      name: exercises.find((ex) => ex.id === exercise.id)?.name || '',
      actualReps: item.manualReps?.find((entry) => entry.id === exercise.id)?.reps ?? null,
    })),
    timestamp: new Date().toISOString(),
  }));
  saveState();
  renderRunnerSummary();
  renderSkillResults();
  renderHistory();
  renderSummary();
  syncRunnerCyclesFromState();
  renderOverlaySummary();
  if (runnerCycles.length >= plannedCycles) {
    stopRunnerSession(true);
  } else {
    startRunnerWorkPhase();
  }
  rotateActiveStudentIfNeeded();
}

function stopRunnerSession(completed) {
  clearInterval(runnerGeneralTimerId);
  clearInterval(runnerPhaseTimerId);
  runnerActive = false;
  runnerPhase = 'idle';
  runnerCurrentCycle = null;
  elements.runnerMessage.textContent = completed ? 'Séance terminée.' : 'Séance arrêtée.';
  elements.runnerPhaseLabel.textContent = 'Prêt';
  runnerGeneralRemainingMs = state.sessionMinutes * 60000;
  updateRunnerGeneralDisplay();
  updateRunnerWorkDisplay(getWorkDurationMs());
  updateRunnerRestDisplay(0);
  elements.runnerRestDisplay.classList.remove('blink');
  if (runnerCycles.length) {
    const skill = state.skills.find((sk) => sk.id === runnerSkillId);
    state.archives.unshift({
      timestamp: new Date().toISOString(),
      planSummary: formatSkillSummary(skill),
      totalWork: runnerCycles.reduce((sum, item) => sum + item.work, 0),
      totalRest: runnerCycles.reduce((sum, item) => sum + item.rest, 0),
      observer: state.observer || '',
    });
    state.archives = state.archives.slice(0, 10);
  }
  renderRunnerSummary();
  renderSkillResults();
  renderHistory();
  renderArchive();
  renderSummary();
  renderOverlaySummary();
  showToast(completed ? 'Séance terminée.' : 'Séance arrêtée.');
  syncRunnerCyclesFromState();
  updateRunnerRestButtonLabel();
  runnerPendingManualReps = null;
  runnerManualReps = {};
  renderRunnerManualReps();
  updateRunnerLabels();
}

function resetRunnerPage() {
  clearInterval(runnerGeneralTimerId);
  clearInterval(runnerPhaseTimerId);
  runnerActive = false;
  runnerPhase = 'idle';
  runnerCurrentCycle = null;
  runnerCycles = [];
  runnerGeneralRemainingMs = state.sessionMinutes * 60000;
  runnerRestRemaining = 0;
  state.results = [];
  saveState();
  renderRunnerSummary();
  renderSummary();
  renderOverlaySummary();
  elements.runnerPhaseLabel.textContent = 'Prêt';
  elements.runnerMessage.textContent = '';
  updateRunnerGeneralDisplay();
  updateRunnerWorkDisplay(getWorkDurationMs());
  updateRunnerRestDisplay(0);
  elements.runnerRestDisplay.classList.remove('blink');
  runnerPendingManualReps = null;
  runnerManualReps = {};
  renderRunnerManualReps();
  updateRunnerRestButtonLabel();
  updateRunnerLabels();
}

function initTrainingRepsInputs() {
  if (!elements.trainingRepsBlock) return;
  elements.trainingRepsBlock.querySelectorAll('[data-training-student]').forEach((row) => {
    const student = row.dataset.trainingStudent;
    const input = row.querySelector('[data-training-input]');
    const label = row.querySelector('[data-training-label]');
    if (input) {
      trainingRepsInputs[student] = input;
    }
    if (label) {
      trainingRepsLabels[student] = label;
    }
  });
  updateTrainingRepsUI();
}

function initTrainingHistoryUI() {
  if (!elements.trainingHistory) return;
  studentIds.forEach((id) => {
    const col = elements.trainingHistory.querySelector(`[data-training-history-col="${id}"]`);
    if (!col) return;
    trainingHistoryColumns[id] = {
      col,
      list: col.querySelector('[data-training-history-list]'),
      label: col.querySelector('[data-training-history-label]'),
    };
  });
  updateTrainingHistoryUI();
}

function updateTrainingHistoryUI() {
  if (!elements.trainingHistory) return;
  const isAltern = state.studentMode === 'altern';
  studentIds.forEach((id) => {
    const column = trainingHistoryColumns[id];
    if (!column || !column.col) return;
    const info = formatShortStudent(state.students[id]);
    if (column.label) {
      column.label.textContent = info ? `(${info})` : '';
    }
    if (id === 'B' && !isAltern) {
      column.col.hidden = true;
    } else {
      column.col.hidden = false;
    }
  });
}

function collectTrainingEntries() {
  const entries = [];
  const isAltern = state.studentMode === 'altern';
  const levelValue = getSelectedTrainingLevel();
  if (isAltern) {
    studentIds.forEach((id) => {
      const input = trainingRepsInputs[id];
      if (!input || input.disabled) return;
      const reps = Number(input.value);
      if (Number.isFinite(reps) && reps > 0) {
          entries.push({ student: id, reps, level: levelValue });
      }
    });
  } else {
    const active = state.activeStudent;
    const input = trainingRepsInputs[active] || trainingRepsInputs.A;
    if (input) {
      const reps = Number(input.value);
      if (Number.isFinite(reps) && reps > 0) {
        entries.push({ student: active, reps, level: levelValue });
      }
    }
  }
  return entries;
}

function getSelectedTrainingLevel() {
  if (!elements.trainingLevelSelect) return null;
  const value = Number(elements.trainingLevelSelect.value);
  return Number.isFinite(value) ? value : null;
}

function updateTrainingInfoAvailability() {
  if (!elements.trainingInfoBtn || !elements.trainingExerciseSelect) return;
  elements.trainingInfoBtn.disabled = !elements.trainingExerciseSelect.value;
  updateTrainingVisual();
}

function initTrainingExports() {
  elements.trainingQrBtn?.addEventListener('click', () => {
    const eligible = getEligibleQrStudents({ requireTraining: true });
    if (!eligible.length) {
      const hasTests = Boolean(state.trainingTests.length);
      showToast(hasTests ? 'Complète l’identité pour générer le QR.' : 'Aucun test en mode entraînement.');
      return;
    }
    if (typeof QRCode !== 'function') {
      showToast('QR code indisponible.');
      return;
    }
    const options = { identity: true, training: true, skill: false, evaluation: false, notes: false };
    renderStudentQrList(elements.trainingQrOutput, eligible, options, { scope: 'training' });
  });
  elements.trainingCsvBtn?.addEventListener('click', exportTrainingCsv);
  elements.trainingPdfBtn?.addEventListener('click', exportTrainingPdf);
}

function formatTrainingTestLine(test, index) {
  const exercise = exercises.find((ex) => ex.id === test.exercise);
  const studentLabel = formatStudentDisplay(state.students[test.student]) || `Élève ${test.student}`;
  const when = new Date(test.timestamp).toLocaleString('fr-FR');
  return `${index + 1}. ${exercise?.name || test.exercise} • ${test.reps} rép • ${studentLabel} • ${when}`;
}

function promptTrainingClearScope() {
  const groups = studentIds
    .map((id) => {
      const tests = state.trainingTests.filter((test) => test.student === id);
      return { id, tests, label: formatStudentDisplay(state.students[id]) || `Élève ${id}` };
    })
    .filter((item) => item.tests.length);
  if (!groups.length) return null;
  const list = groups
    .map((group, idx) => `${idx + 1}. ${group.label} (${group.tests.length} test${group.tests.length > 1 ? 's' : ''})`)
    .join('\n');
  const choice = window.prompt(
    `Choisis l'élève concerné.\nTape "TOUS" pour gérer l'historique complet.\n\n${list}`,
  );
  if (choice == null) return null;
  const trimmed = choice.trim().toUpperCase();
  if (trimmed === 'TOUS') return 'ALL';
  const index = Number.parseInt(choice.trim(), 10) - 1;
  if (Number.isNaN(index) || index < 0 || index >= groups.length) {
    showToast('Choix invalide.');
    return null;
  }
  return groups[index].id;
}

function initTrainingClearButton() {
  elements.trainingClearBtn?.addEventListener('click', () => {
    if (!state.trainingTests.length) {
      showToast('Aucun test à supprimer.');
      return;
    }
    const code = window.prompt("Demande l’autorisation à ton prof de supprimer ton historique d’exercices.\nEntre le code professeur :");
    if (code == null) return;
    if (code.trim() !== '57') {
      showToast('Code incorrect.');
      return;
    }
    const scope = promptTrainingClearScope();
    if (!scope) return;
    const dataset = state.trainingTests
      .map((test, index) => ({ ...test, index }))
      .filter((item) => scope === 'ALL' || item.student === scope);
    if (!dataset.length) {
      showToast('Aucun test à supprimer.');
      return;
    }
    const summary = dataset.map((test, index) => formatTrainingTestLine(test, index)).join('\n');
    const choice = window.prompt(
      `Tape "TOUT" pour supprimer ${
        scope === 'ALL' ? "tout l’historique" : 'tous les tests de cet élève'
      }.\nSinon, entre le numéro du test à effacer :\n\n${summary}`,
    );
    if (choice == null) return;
    const trimmed = choice.trim().toUpperCase();
    if (trimmed === 'TOUT') {
      if (!window.confirm('Tout supprimer ?')) return;
      if (scope === 'ALL') {
        state.trainingTests = [];
      } else {
        state.trainingTests = state.trainingTests.filter((test) => test.student !== scope);
      }
      saveState();
      renderTrainingHistory();
      showToast(scope === 'ALL' ? 'Historique effacé.' : 'Tests de l’élève effacés.');
      return;
    }
    const numericChoice = Number.parseInt(choice.trim(), 10);
    if (!Number.isFinite(numericChoice)) {
      showToast('Numéro invalide.');
      return;
    }
    const index = numericChoice - 1;
    if (index < 0 || index >= dataset.length) {
      showToast('Numéro invalide.');
      return;
    }
    const target = dataset[index];
    state.trainingTests.splice(target.index, 1);
    saveState();
    renderTrainingHistory();
    showToast('Test supprimé.');
  });
}

function getEligibleQrStudents({ requireTraining = false } = {}) {
  return studentIds.filter((id) => {
    const student = state.students[id];
    if (!student?.enabled) return false;
    const identity = getStudentIdentity(id);
    if (!identity.prenom || !identity.classe) return false;
    if (requireTraining) {
      const hasTraining = state.trainingTests.some((test) => test.student === id);
      if (!hasTraining) return false;
    }
    return true;
  });
}

function getStudentIdentity(studentId) {
  const student = state.students[studentId] || {};
  return {
    prenom: (student.prenom || '').trim(),
    nom: (student.nom || '').trim() || '-',
    classe: normalizeClass((student.classe || '').trim()) || '',
  };
}

function getQrOptionSelections() {
  const current = { ...state.qrOptions };
  elements.qrOptions?.forEach?.((input) => {
    if (input.dataset.qrOption) {
      current[input.dataset.qrOption] = input.checked;
    }
  });
  return current;
}

function createQrTracker() {
  return {
    labels: {},
    groups: {
      training: [],
      skill: [],
      evaluation: [],
      notes: [],
    },
  };
}

function addQrField(payload, tracker, group, key, value, label) {
  if (value === null || value === undefined) return;
  if (typeof value === 'string' && !value.trim()) return;
  payload[key] = value;
  if (label) tracker.labels[key] = label;
  if (!tracker.groups[group]) tracker.groups[group] = [];
  tracker.groups[group].push(key);
}

function finalizeQrPayload(payload, tracker) {
  if (Object.keys(tracker.labels).length) {
    payload.__labels = tracker.labels;
  } else if (payload.__labels) {
    delete payload.__labels;
  }
  let jsonLength = JSON.stringify(payload).length;
  if (jsonLength <= QR_PAYLOAD_LIMIT) return payload;
  for (const section of QR_TRIM_ORDER) {
    const keys = tracker.groups[section] || [];
    if (!keys.length) continue;
    let trimmed = false;
    keys.forEach((key) => {
      if (key in payload) {
        delete payload[key];
        trimmed = true;
      }
      if (tracker.labels[key]) {
        delete tracker.labels[key];
      }
    });
    if (trimmed) {
      if (Object.keys(tracker.labels).length) {
        payload.__labels = tracker.labels;
      } else {
        delete payload.__labels;
      }
      jsonLength = JSON.stringify(payload).length;
      console.warn(`QR payload trimmed (${section}) → ${jsonLength} caractères`);
    }
    if (jsonLength <= QR_PAYLOAD_LIMIT) break;
  }
  if (jsonLength > QR_PAYLOAD_LIMIT) {
    console.warn(`QR payload toujours trop volumineux (${jsonLength} caractères).`);
  }
  return payload;
}

function buildTrainingFieldset(studentKey) {
  const entries = state.trainingTests.filter((test) => test.student === studentKey);
  if (!entries.length) return [];
  const recent = entries.slice(-MAX_QR_TRAINING_FIELDS);
  return recent
    .map((entry, index) => {
      const exercise = exercises.find((ex) => ex.id === entry.exercise);
      const title = exercise?.name || entry.exercise;
      const level = entry.level ? `N${entry.level}` : '';
      const reps = Number(entry.reps);
      if (!Number.isFinite(reps)) return null;
      return {
        key: `ct_t${index + 1}`,
        value: reps,
        label: level ? `${title} (${level}) — répétitions` : `${title} — répétitions`,
      };
    })
    .filter(Boolean);
}

function buildSkillFieldset(studentKey) {
  const fields = [];
  const skillId = state.studentSkills?.[studentKey] || null;
  const skill = getSkillById(skillId);
  if (!skill) return fields;
  if (skill.name) {
    fields.push({ key: 'ct_skill', value: skill.name, label: "Skill 2' — nom" });
  }
  if (skill.course?.label) {
    fields.push({ key: 'ct_skill_course', value: skill.course.label, label: 'Parcours' });
  }
  const focus = (skill.exercises || [])
    .slice(0, MAX_QR_SKILL_EXERCISES)
    .map((item) => exercises.find((ex) => ex.id === item.id)?.name || item.id)
    .join(' / ');
  if (focus) {
    fields.push({ key: 'ct_skill_focus', value: focus, label: 'Exercices retenus' });
  }
  const challenge = getAssignedChallenge(studentKey);
  if (challenge) {
    fields.push({ key: 'ct_challenge', value: challenge.name, label: 'Challenge Cross Training' });
    fields.push({ key: 'ct_challenge_pts', value: challenge.points, label: 'Points challenge' });
    fields.push({ key: 'ct_challenge_diff', value: challenge.difficulty, label: 'Difficulté challenge' });
  }
  if (state.results?.length) {
    fields.push({ key: 'ct_cycles', value: state.results.length, label: 'Tranches complétées' });
  }
  return fields;
}

function buildEvaluationFieldset() {
  const labels = {
    cardio: 'Cardio',
    lower: 'Membres inf.',
    upper: 'Membres sup.',
    core: 'Gainage',
  };
  const fields = [];
  Object.entries(labels).forEach(([key, label]) => {
    const value = state.evaluation?.[key];
    if (value === null || value === undefined || value === '') return;
    fields.push({ key: `ct_lvl_${key}`, value, label: `Niveau ${label}` });
  });
  return fields;
}

function buildScanProfExport(studentKey, options = {}) {
  const identity = getStudentIdentity(studentKey);
  if (!identity.prenom || !identity.classe) return null;
  const payload = {
    nom: identity.nom || '-',
    prenom: identity.prenom,
    classe: identity.classe,
    groupe: studentKey,
  };
  const tracker = createQrTracker();
  if (options.training !== false) {
    buildTrainingFieldset(studentKey).forEach((field) =>
      addQrField(payload, tracker, 'training', field.key, field.value, field.label),
    );
  }
  if (options.skill !== false) {
    buildSkillFieldset(studentKey).forEach((field) =>
      addQrField(payload, tracker, 'skill', field.key, field.value, field.label),
    );
  }
  if (options.evaluation !== false) {
    buildEvaluationFieldset().forEach((field) =>
      addQrField(payload, tracker, 'evaluation', field.key, field.value, field.label),
    );
  }
  if (options.notes !== false) {
    const note = (state.notes?.[studentKey] || '').trim();
    if (note) {
      addQrField(payload, tracker, 'notes', 'ct_note', note.slice(0, 280), 'Note professeur');
    }
  }
  finalizeQrPayload(payload, tracker);
  return payload;
}

function renderQr(container, jsonObject) {
  if (!container) return 0;
  container.innerHTML = '';
  const jsonString = JSON.stringify(jsonObject);
  if (jsonString.length > QR_PAYLOAD_LIMIT) {
    console.warn(`QR généré (${jsonString.length} caractères) au-delà du seuil recommandé (${QR_PAYLOAD_LIMIT}).`);
  }
  if (typeof QRCode !== 'function') {
    container.textContent = 'QR code indisponible.';
    return jsonString.length;
  }
  try {
    const correctLevel = QRCode.CorrectLevel?.L ?? undefined;
    const instance = new QRCode(container, {
      width: 220,
      height: 220,
      ...(correctLevel ? { correctLevel } : {}),
    });
    instance.makeCode(jsonString);
  } catch (error) {
    console.error('QR error', error);
    container.textContent = 'QR indisponible.';
  }
  return jsonString.length;
}

function renderStudentQrList(container, studentIds, options, context = {}) {
  if (!container) return;
  container.innerHTML = '';
  if (!studentIds.length) {
    container.innerHTML = '<p class="qr-empty">Aucun élève prêt pour le QR.</p>';
    return;
  }
  const fragment = document.createDocumentFragment();
  studentIds.forEach((id) => {
    const payload = buildScanProfExport(id, options, context);
    if (!payload) return;
    const display = formatStudentDisplay(state.students[id]) || `Élève ${id}`;
    const card = document.createElement('div');
    card.className = 'qr-card';
    card.innerHTML = `
      <p class="qr-student-label">Élève ${id} — ${display}</p>
      <div class="qr-view"></div>
    `;
    const qrBox = card.querySelector('.qr-view');
    renderQr(qrBox, payload);
    fragment.appendChild(card);
  });
  if (!fragment.childNodes.length) {
    container.innerHTML = '<p class="qr-empty">Aucune donnée exportable.</p>';
    return;
  }
  container.appendChild(fragment);
}

function normalizeClass(classe) {
  if (!classe) return '';
  const normalized = classe
    .toLowerCase()
    .replace(/[éèê]/g, 'e')
    .replace(/\s+/g, '')
    .replace(/ème|eme/g, '')
    .replace(/[^0-9a-z]/g, '');
  const match = normalized.match(/(\d+)([a-z])/);
  if (!match) return classe.toUpperCase();
  const [, num, letter] = match;
  return `${num}${letter.toUpperCase()}`;
}

function exportTrainingCsv() {
  if (!state.trainingTests.length) {
    showToast('Aucun test à exporter.');
    return;
  }
  const header = 'Exercice;Niveau;Répétitions;Élève;Horodatage';
  const rows = state.trainingTests.map((test) => {
    const exercise = exercises.find((ex) => ex.id === test.exercise);
    const studentLabel = formatStudentDisplay(state.students[test.student]) || test.student;
    const level = test.level ? `N${test.level}` : '';
    const date = new Date(test.timestamp).toLocaleString('fr-FR');
    return [
      (exercise?.name || test.exercise).replace(/;/g, ','),
      level,
      test.reps,
      studentLabel.replace(/;/g, ','),
      date,
    ].join(';');
  });
  const content = [header, ...rows].join('\n');
  downloadFile('entrainement.csv', content, 'text/csv;charset=utf-8;');
  showToast('CSV téléchargé.');
}

function exportTrainingPdf() {
  if (!state.trainingTests.length) {
    showToast('Aucun test à exporter.');
    return;
  }
  if (!window.jspdf || !window.jspdf.jsPDF) {
    showToast('jsPDF indisponible.');
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text('Mode entraînement', 14, 20);
  doc.text(`Date : ${new Date().toLocaleString('fr-FR')}`, 14, 30);
  let cursor = 40;
  state.trainingTests.forEach((test, index) => {
    const exercise = exercises.find((ex) => ex.id === test.exercise);
    const studentLabel = formatStudentDisplay(state.students[test.student]) || test.student;
    const level = test.level ? `N${test.level}` : 'N/A';
    const line = `${index + 1}. ${exercise?.name || test.exercise} — ${test.reps} reps • ${level} • ${studentLabel}`;
    doc.text(line, 14, cursor);
    cursor += 7;
    if (cursor > 270) {
      doc.addPage();
      cursor = 20;
    }
  });
  doc.save('entrainement.pdf');
  showToast('PDF exporté.');
}

function updateTrainingVisual() {
  if (!elements.trainingVisual) return;
  const exercise = exercises.find((ex) => ex.id === elements.trainingExerciseSelect?.value);
  if (!exercise || !elements.trainingVisualImg) {
    elements.trainingVisual.hidden = true;
    elements.trainingVisualImg?.removeAttribute('src');
    elements.trainingVisualImg?.removeAttribute('alt');
    return;
  }
  const override = trainingVisualOverrides[exercise.id];
  const preview = override ? { visual: override } : getPreviewLevel(exercise);
  if (preview?.visual) {
    elements.trainingVisualImg.src = preview.visual;
    elements.trainingVisualImg.alt = `Visuel ${exercise.name}`;
    elements.trainingVisual.hidden = false;
  } else {
    elements.trainingVisual.hidden = true;
    elements.trainingVisualImg.removeAttribute('src');
    elements.trainingVisualImg.removeAttribute('alt');
  }
}

function initTrainingControls() {
  elements.trainingExerciseSelect.innerHTML = exercises.map((ex) => `<option value="${ex.id}">${ex.name}</option>`).join('');
  updateTrainingInfoAvailability();
  updateTrainingLevelOptions();
  elements.trainingExerciseSelect.addEventListener('change', () => {
    updateTrainingInfoAvailability();
    updateTrainingLevelOptions();
  });
  if (elements.trainingInfoBtn) {
    elements.trainingInfoBtn.addEventListener('click', () => {
      const id = elements.trainingExerciseSelect.value;
      const exercise = exercises.find((ex) => ex.id === id);
      if (exercise) {
        openExerciseModal(exercise);
      }
    });
  }
  elements.trainingStartBtn.addEventListener('click', () => {
    clearInterval(trainingTimerId);
    trainingTimerBlink = false;
    elements.trainingDisplay.classList.remove('blink');
    trainingTimerDeadline = Date.now() + 60000;
    trainingTimerId = setInterval(() => {
      const remaining = Math.max(0, trainingTimerDeadline - Date.now());
      elements.trainingDisplay.textContent = formatTime(remaining);
      if (remaining <= 10000 && !trainingTimerBlink) {
        trainingTimerBlink = true;
        elements.trainingDisplay.classList.add('blink');
      }
      if (remaining <= 0) {
        clearInterval(trainingTimerId);
        elements.trainingDisplay.classList.remove('blink');
        trainingTimerBlink = false;
        elements.trainingDisplay.textContent = '00:00';
        trainingTimerDeadline = null;
        showToast('Temps terminé');
      }
    }, 200);
  });
  elements.trainingResetBtn.addEventListener('click', () => {
    clearInterval(trainingTimerId);
    elements.trainingDisplay.textContent = '01:00';
    elements.trainingDisplay.classList.remove('blink');
    trainingTimerBlink = false;
    trainingTimerDeadline = null;
  });
  elements.trainingSaveBtn.addEventListener('click', () => {
    const entries = collectTrainingEntries();
    if (!entries.length) {
      showToast('Ajoute un nombre de répétitions');
      return;
    }
    elements.trainingDisplay.classList.remove('blink');
    trainingTimerBlink = false;
    const defaultLevel = getSelectedTrainingLevel();
    entries.forEach(({ student, reps, level }) => {
      state.trainingTests.push({
        exercise: elements.trainingExerciseSelect.value,
        reps,
        level: level ?? defaultLevel,
        student,
        timestamp: new Date().toISOString(),
      });
      const input = trainingRepsInputs[student];
      if (input) input.value = '';
    });
    saveState();
    renderTrainingHistory();
    renderSummary();
    rotateActiveStudentIfNeeded();
  });
}

function renderTrainingHistory() {
  if (!elements.trainingHistory) return;
  const grouped = { A: [], B: [] };
  state.trainingTests.forEach((test) => {
    const student = studentIds.includes(test.student) ? test.student : 'A';
    grouped[student].push(test);
  });
  studentIds.forEach((id) => {
    const column = trainingHistoryColumns[id];
    if (!column || !column.list) return;
    const tests = grouped[id];
    if (!tests.length) {
      column.list.innerHTML = '<p class="history-empty">Aucun test.</p>';
      return;
    }
    column.list.innerHTML = tests
      .map((test) => {
        const exercise = exercises.find((ex) => ex.id === test.exercise);
        const levelLabel = test.level ? ` • N${test.level}` : '';
        return `
          <div class="training-history-item">
            <strong>${exercise?.name || 'Exercice'}</strong>
            <p>${test.reps} répétitions${levelLabel} • ${new Date(test.timestamp).toLocaleString('fr-FR')}</p>
          </div>
        `;
      })
      .join('');
  });
  updateTrainingHistoryUI();
  if (elements.trainingQrOutput && !state.trainingTests.length) {
    elements.trainingQrOutput.hidden = true;
    elements.trainingQrOutput.innerHTML = '';
    elements.trainingQrOutput.classList.remove('qr-inline');
  }
}

function renderSkillDetails() {
  renderSkillPlan();
  renderSummary();
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, 2200);
}

function initModeButtons() {
  elements.modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.timerMode = btn.dataset.timerMode;
      saveState();
      elements.modeButtons.forEach((item) => item.classList.toggle('active', item.dataset.timerMode === state.timerMode));
    });
    btn.classList.toggle('active', state.timerMode === btn.dataset.timerMode);
  });
}

function initSkillSelect() {
  elements.skillSelect.addEventListener('change', () => {
    selectSkill(elements.skillSelect.value);
  });
  elements.openRunnerButtons?.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (getSelectedSkillId()) {
        renderRunnerSelect();
      }
      setActivePage('runner');
      showToast('Configure le chrono et lance ta séance.');
    });
  });
}

function startSkillSession() {
  if (skillRunActive) {
    showToast('Séance déjà en cours.');
    return;
  }
  const skillId = getSelectedSkillId();
  if (!skillId) {
    showToast('Ajoute un skill.');
    return;
  }
  const skill = getSkillById(skillId);
  if (!skill) {
    showToast('Skill introuvable.');
    return;
  }
  state.results = [];
  renderOverlaySummary();
  runnerCycles = [];
  renderRunnerSummary();
  sessionRemainingMs = state.sessionMinutes * 60000;
  if (!sessionRemainingMs) sessionRemainingMs = skill.exercises.length * 120000;
  plannedCycles = Math.max(1, Math.floor((state.sessionMinutes * 60) / state.workSeconds) || 1);
  skillRunActive = true;
  skillPhase = 'work';
  currentCycle = { workMs: 0, restMs: 0 };
  saveState();
  renderSkillDetails();
  renderSkillResults();
  ensureOverlayLayer();
  if (!elements.overlay) return;
  if (elements.overlaySkill) elements.overlaySkill.textContent = skill.name;
  if (elements.overlayCount) elements.overlayCount.textContent = `Tranche 1 / ${plannedCycles}`;
  if (elements.observerInput) elements.observerInput.value = state.observer || '';
  if (elements.overlayObserver) elements.overlayObserver.textContent = state.observer || '—';
  if (elements.overlayMessage) elements.overlayMessage.textContent = '';
  elements.overlayRestPanel?.classList.add('hidden');
  if (elements.overlayToRest) elements.overlayToRest.disabled = false;
  updateGeneralDisplays(state.generalMode === 'chrono' ? 0 : sessionRemainingMs);
  startGeneralTimer();
  startWorkPhase();
  elements.overlay.removeAttribute('hidden');
  elements.overlay.style.display = 'flex';
  elements.overlay.setAttribute('aria-hidden', 'false');
  elements.overlay.classList.remove('hidden');
  elements.overlay.classList.add('show');
  document.body.classList.add('modal-open');
}

function startGeneralTimer() {
  clearInterval(sessionTimerId);
  if (state.generalMode === 'chrono') {
    sessionRemainingMs = 0;
    elements.generalDisplay.textContent = '00:00';
    sessionTimerId = setInterval(() => {
      sessionRemainingMs += 1000;
      updateGeneralDisplays(sessionRemainingMs);
    }, 1000);
  } else {
    const deadline = performance.now() + sessionRemainingMs;
    sessionTimerId = setInterval(() => {
      sessionRemainingMs = Math.max(0, deadline - performance.now());
      updateGeneralDisplays(sessionRemainingMs);
      if (sessionRemainingMs <= 0) stopSkillSession();
    }, 250);
  }
  sessionRunning = true;
}

function updateGeneralDisplays(valueMs) {
  if (elements.generalDisplay) elements.generalDisplay.textContent = formatTime(valueMs);
  if (elements.overlayGeneral) elements.overlayGeneral.textContent = formatTime(valueMs);
}

function startWorkPhase() {
  if (!elements.skillTimerDisplay) return;
  const skill = getSkillById(getSelectedSkillId());
  const trancheIndex = state.results.length + 1;
  skillPhase = 'work';
  overlayWorkWarningShown = false;
  overlayRestWarningShown = false;
  skillPhaseLabel.textContent = 'Travail';
  elements.overlayPhase.textContent = 'Travail';
  elements.overlayRestPanel?.classList.add('hidden');
  elements.overlayMessage.textContent = '';
  if (elements.overlayToRest) {
    elements.overlayToRest.disabled = !state.restEnabled;
    elements.overlayToRest.style.display = state.restEnabled ? '' : 'none';
  }
  if (elements.overlayCount) elements.overlayCount.textContent = `Tranche ${trancheIndex} / ${plannedCycles}`;
  if (elements.overlaySkill && skill) elements.overlaySkill.textContent = skill.name;
  currentCycle = { workMs: 0, restMs: 0 };
  startPhaseTimer(getWorkDurationMs(), 'work');
}

function startPhaseTimer(duration, mode) {
  clearInterval(phaseTimerId);
  phaseDeadline = performance.now() + duration;
  phaseTimerId = setInterval(() => {
    const remaining = Math.max(0, phaseDeadline - performance.now());
    if (mode === 'rest') {
      elements.overlayRestTimer.textContent = formatTime(remaining);
      if (remaining <= 5000 && !overlayRestWarningShown) {
        elements.overlayMessage.textContent = getEncouragement();
        overlayRestWarningShown = true;
      }
    } else {
      elements.skillTimerDisplay.textContent = formatTime(remaining);
      if (remaining <= 5000 && !overlayWorkWarningShown) {
        elements.overlayMessage.textContent = '5 s – termine ton travail.';
        overlayWorkWarningShown = true;
      }
    }
    if (remaining <= 0) {
      clearInterval(phaseTimerId);
      if (mode === 'work') {
        currentCycle.workMs = getWorkDurationMs();
        beginRestPhase();
      } else {
        finishCycle();
      }
    }
  }, 200);
}

function switchToRestPhase() {
  if (skillPhase !== 'work') return;
  beginRestPhase(true);
}

function beginRestPhase(manual = false) {
  if (skillPhase === 'rest') return;
  clearInterval(phaseTimerId);
  const workMs = getWorkDurationMs();
  const elapsed = Math.max(0, workMs - Math.max(0, phaseDeadline - performance.now()));
  currentCycle.workMs = manual ? Math.max(1000, elapsed) : workMs;
  if (!state.restEnabled) {
    currentCycle.restMs = 0;
    finishCycle();
    return;
  }
  skillPhase = 'rest';
  overlayRestWarningShown = false;
  elements.overlayPhase.textContent = 'Récupération';
  elements.overlayRestPanel?.classList.remove('hidden');
  elements.overlayMessage.textContent = '';
  elements.overlayToRest.disabled = true;
  const restMs = manual ? computeManualRest(workMs, currentCycle.workMs) : getRestDurationMs();
  currentCycle.restMs = restMs;
  startPhaseTimer(restMs, 'rest');
}

function finishCycle() {
  const skill = getSkillById(getSelectedSkillId());
  if (!skill) return;
  const cycleIndex = state.results.length + 1;
  state.results.push({
    cycle: cycleIndex,
    work: Math.max(1, Math.round((currentCycle.workMs || 0) / 1000)),
    rest: Math.max(0, Math.round((currentCycle.restMs || 0) / 1000)),
    manualReps: null,
    exercises: skill.exercises.map((item) => ({
      ...item,
      name: exercises.find((ex) => ex.id === item.id)?.name || '',
      actualReps: null,
    })),
    timestamp: new Date().toISOString(),
  });
  saveState();
  renderSkillResults();
  renderHistory();
  renderSummary();
  syncRunnerCyclesFromState();
  renderOverlaySummary();
  elements.overlayRestPanel?.classList.add('hidden');
  elements.overlayToRest.disabled = false;
  if (state.results.length >= plannedCycles || (state.generalMode === 'countdown' && sessionRemainingMs <= 0)) {
    stopSkillSession();
  } else {
    startWorkPhase();
  }
  rotateActiveStudentIfNeeded();
}

function stopSkillSession() {
  clearInterval(sessionTimerId);
  clearInterval(phaseTimerId);
  sessionRunning = false;
  skillRunActive = false;
  if (elements.overlay) {
    elements.overlay.classList.remove('show');
    elements.overlay.setAttribute('aria-hidden', 'true');
    elements.overlay.setAttribute('hidden', '');
    elements.overlay.style.display = 'none';
    elements.overlay.classList.add('hidden');
  }
  document.body.classList.remove('modal-open');
  if (elements.overlayRestPanel) elements.overlayRestPanel.classList.add('hidden');
  state.archives.unshift({
    timestamp: new Date().toISOString(),
    planSummary: formatSkillSummary(getSkillById(getSelectedSkillId())),
    totalWork: state.results.reduce((sum, item) => sum + item.work, 0),
    totalRest: state.results.reduce((sum, item) => sum + item.rest, 0),
    observer: state.observer || '',
  });
  state.archives = state.archives.slice(0, 10);
  saveState();
  renderArchive();
  renderSummary();
  syncRunnerCyclesFromState();
  renderOverlaySummary();
  showToast('Séance terminée.');
  setActivePage('summary');
}

function formatSkillSummary(skill) {
  if (!skill) return 'Skill vide.';
  return skill.exercises
    .map((item) => `${families[item.family].label}: ${exercises.find((ex) => ex.id === item.id)?.name || ''} (N${item.level}, ${item.reps} reps)`)
    .concat(`Course: ${skill.course.label}`)
    .join(' • ');
}

function renderHistory() {
  if (!elements.historyList) return;
  if (!state.results.length) {
    elements.historyList.innerHTML = '<p>Aucune séance.</p>';
    return;
  }
  elements.historyList.innerHTML = state.results
    .map((cycle) => {
      const color = cycleColors[(cycle.cycle - 1) % cycleColors.length];
      const repsLine = cycle.exercises
        .map((exercise) => {
          const repValue =
            typeof exercise.actualReps === 'number'
              ? exercise.actualReps
              : typeof exercise.reps === 'number'
              ? exercise.reps
              : '-';
          return `${exercise.name}: ${repValue} reps`;
        })
        .join(' • ');
      return `
        <div class="history-row" style="background:${color}">
          <strong>Cycle ${cycle.cycle}</strong>
          <p>Travail : ${formatDuration(cycle.work)} • Récup : ${formatDuration(cycle.rest)}${formatManualSummary(
            cycle.manualReps,
          )}</p>
          <p>${repsLine}</p>
        </div>
      `;
    })
    .join('');
}

function renderArchive() {
  if (!elements.archiveList) return;
  if (!state.archives.length) {
    elements.archiveList.innerHTML = '<p>Aucune archive.</p>';
    return;
  }
  elements.archiveList.innerHTML = state.archives
    .map(
      (session) => `
        <div class="history-row">
          <strong>${new Date(session.timestamp).toLocaleString('fr-FR')}</strong>
          <p>${session.planSummary}</p>
          <p>Total : ${formatDuration(session.totalWork || 0)} travail • ${formatDuration(session.totalRest || 0)} récup</p>
        </div>
      `,
    )
    .join('');
}

function renderSkillResults() {
  if (!elements.skillResults) return;
  if (!state.results.length) {
    elements.skillResults.innerHTML = '<p>Pas encore de skill enregistré.</p>';
    return;
  }
  elements.skillResults.innerHTML = state.results
    .map(
      (cycle) => `
        <div class="skill-entry cycle-color">
          <strong>Cycle ${cycle.cycle}</strong>
          <p>Travail : ${formatDuration(cycle.work)} • Récup : ${formatDuration(cycle.rest)}${formatManualSummary(
            cycle.manualReps,
          )}</p>
          <p>${cycle.exercises
            .map((exercise) => {
              const repValue =
                typeof exercise.actualReps === 'number'
                  ? exercise.actualReps
                  : typeof exercise.reps === 'number'
                  ? exercise.reps
                  : '-';
              return `${exercise.name}: ${repValue} reps`;
            })
            .join(' • ')}</p>
        </div>
      `,
    )
    .join('');
}

function renderSummary() {
  const student = state.students[state.activeStudent];
  const studentLabel = formatStudentDisplay(student) || 'Non défini';
  const skill = getSkillById(getSelectedSkillId());
  const plan = formatSkillSummary(skill);
  const totalWork = state.results.reduce((sum, item) => sum + item.work, 0);
  const totalRest = state.results.reduce((sum, item) => sum + item.rest, 0);
  const cycleDetails = state.results.length
    ? state.results
        .map(
          (cycle) => `
        <li class="session-cycle">
          <div class="session-cycle__head">
            <span>Tranche ${cycle.cycle}</span>
            <span>${formatDuration(cycle.work)} travail • ${formatDuration(cycle.rest)} récup${formatManualSummary(
              cycle.manualReps,
            )}</span>
          </div>
          <div class="session-cycle__body">
            ${cycle.exercises
              .map((exercise) => {
                const repValue =
                  typeof exercise.actualReps === 'number'
                    ? exercise.actualReps
                    : typeof exercise.reps === 'number'
                    ? exercise.reps
                    : '-';
                return `<span>${exercise.name}: ${repValue} reps</span>`;
              })
              .join('')}
          </div>
        </li>
      `,
        )
        .join('')
    : '<li class="session-cycle session-cycle--empty">Aucune tranche enregistrée pour l’instant.</li>';
  elements.sessionSummary.innerHTML = `
    <p><strong>${new Date().toLocaleString('fr-FR')}</strong></p>
    <p><strong>Élève :</strong> ${studentLabel}</p>
    <p><strong>Skill :</strong> ${skill?.name || 'Aucun'}</p>
    <p><strong>Plan :</strong><br>${plan}</p>
    <p><strong>Cycles :</strong> ${state.results.length}</p>
    <div class="session-detail">
      <h4>Détail des tranches</h4>
      <ol class="session-cycle-list">${cycleDetails}</ol>
      <p class="session-total"><strong>Bilan pratique :</strong> ${formatDuration(totalWork)} travail • ${formatDuration(totalRest)} récup</p>
    </div>
  `;
  renderHistory();
}

function updateCorrectionStatus() {
  elements.correctionStatus.textContent = state.profUnlocked ? 'Actif' : 'Inactif';
  elements.correctionStatus.classList.toggle('active', state.profUnlocked);
}

function initCorrection() {
  elements.correctionBtn.addEventListener('click', () => {
    if (!state.profUnlocked) {
      const code = window.prompt('Code prof ?');
      if (code !== '57') {
        showToast('Code incorrect');
        return;
      }
      state.profUnlocked = true;
    } else {
      state.profUnlocked = false;
    }
    saveState();
    updateCorrectionStatus();
    renderSkillResults();
  });
}

function initQrOptions() {
  elements.qrOptions.forEach((input) => {
    const key = input.dataset.qrOption;
    input.checked = state.qrOptions?.[key] ?? true;
    input.addEventListener('change', () => {
      state.qrOptions[key] = input.checked;
      saveState();
    });
  });
}

function initQr() {
  if (!elements.qrBtn) return;
  elements.qrBtn.disabled = false;
  elements.qrBtn.addEventListener('click', () => {
    const students = getEligibleQrStudents();
    if (!students.length) {
      showToast('Renseigne au moins un élève pour générer le QR.');
      return;
    }
    if (typeof QRCode !== 'function') {
      showToast('QR code indisponible.');
      return;
    }
    const options = getQrOptionSelections();
    renderStudentQrList(elements.qrContainer, students, options, { scope: 'summary' });
  });
  elements.pdfBtn.addEventListener('click', () => {
    if (!state.results.length) {
      showToast('Aucun cycle à exporter.');
      return;
    }
    if (!window.jspdf || !window.jspdf.jsPDF) {
      showToast('jsPDF indisponible.');
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Carnet Cross Training', 14, 20);
    doc.text(`Élève : ${formatActiveStudent()}`, 14, 30);
    doc.text(`Date : ${new Date().toLocaleString('fr-FR')}`, 14, 40);
    let cursor = 50;
    state.results.forEach((cycle) => {
      doc.text(`Cycle ${cycle.cycle} — Travail ${formatDuration(cycle.work)} • Récup ${formatDuration(cycle.rest)}`, 14, cursor);
      cursor += 6;
      cycle.exercises.forEach((exercise) => {
        doc.text(`  ${exercise.name}: ${exercise.reps} reps`, 14, cursor);
        cursor += 5;
      });
      cursor += 4;
    });
    doc.save('carnet.pdf');
  });
}

function initSessionControls() {
  elements.overlayToRest?.addEventListener('click', switchToRestPhase);
  elements.overlayClose?.addEventListener('click', () => {
    if (skillRunActive) {
      showToast('Termine la séance.');
      return;
    }
    if (!elements.overlay) return;
    elements.overlay.classList.remove('show');
    elements.overlay.setAttribute('aria-hidden', 'true');
    elements.overlay.setAttribute('hidden', '');
    elements.overlay.style.display = 'none';
    elements.overlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
  });
  elements.skillRunStart?.addEventListener('click', startSkillSession);
  elements.skillRunStop?.addEventListener('click', stopSkillSession);
}

function formatActiveStudent() {
  const student = state.students[state.activeStudent];
  return formatStudentDisplay(student);
}

function initFinalize() {
  elements.finalizeBtn.addEventListener('click', () => {
    const skill = getSkillById(getSelectedSkillId());
    const archiveEntry = {
      timestamp: new Date().toISOString(),
      planSummary: formatSkillSummary(skill),
      totalWork: state.results.reduce((sum, item) => sum + (item.work || 0), 0),
      totalRest: state.results.reduce((sum, item) => sum + (item.rest || 0), 0),
      observer: state.observer || '',
      snapshot: {
        studentMode: state.studentMode,
        results: state.results,
        trainingTests: state.trainingTests,
      },
    };
    state.archives.unshift(archiveEntry);
    state.archives = state.archives.slice(0, 10);
    state.finalized = true;
    state.finalizedAt = new Date().toISOString();
    saveState();
    renderArchive();
    renderSummary();
    showToast('Séance enregistrée.');
  });
  elements.resetBtn.addEventListener('click', () => {
    if (!window.confirm('Tout réinitialiser ?')) return;
    resetState({ reload: true });
  });
}

function init() {
  ensureOverlayLayer();
  if (elements.overlayObserver) elements.overlayObserver.textContent = state.observer || '—';
  initStudents();
  initNav();
  renderExercises();
  renderBuilderSlots();
  initBuilderOwner();
  renderSkillList();
  renderSkillLibrary();
  initCourse();
  initSessionInputs();
  renderSkillDetails();
  renderSkillRoster();
  renderChallengeLibrary();
  initRunnerPage();
  initTrainingRepsInputs();
  initTrainingHistoryUI();
  initTrainingControls();
  initTrainingExports();
  initTrainingClearButton();
  renderTrainingHistory();
  initModeButtons();
  initSkillSelect();
  initSessionControls();
  initCorrection();
  initQrOptions();
  initQr();
  initFinalize();
  renderHistory();
  renderArchive();
  updateCorrectionStatus();
  renderOverlaySummary();
  setActivePage('home');

  if (elements.saveSkillBtn) {
    elements.saveSkillBtn.addEventListener('click', saveSkill);
  }
  elements.challengeFilter?.addEventListener('change', renderChallengeLibrary);
}

elements.trainingHistory && elements.trainingHistory;

function bootstrapApplication() {
  loadSkillLibraryDataset()
    .then((dataset) => {
      skillLibraryDataset = dataset;
    })
    .finally(() => {
      if (typeof window !== 'undefined') {
        window.crossTrainingSkills = getSkillLibrary;
      }
      init();
    });
}

bootstrapApplication();
  if (elements.runnerSkillSelect) {
    elements.runnerSkillSelect.addEventListener('change', () => {
      if (!elements.runnerSkillSelect.value) return;
      selectSkill(elements.runnerSkillSelect.value);
      if (!state.restEnabled) {
        resetRunnerManualReps();
      } else {
        renderRunnerManualReps();
      }
    });
  }
function updateTrainingLevelOptions() {
  if (!elements.trainingLevelSelect || !elements.trainingExerciseSelect) return;
  const exercise = exercises.find((ex) => ex.id === elements.trainingExerciseSelect.value);
  if (!exercise) {
    elements.trainingLevelSelect.innerHTML = '<option value="">Choisis un exercice</option>';
    elements.trainingLevelSelect.disabled = true;
    return;
  }
  const levels = (exercise.levels || []).slice(0, 2);
  elements.trainingLevelSelect.innerHTML = levels
    .map((level) => `<option value="${level.tier}">Niveau ${level.tier}</option>`)
    .join('');
  elements.trainingLevelSelect.disabled = !levels.length;
  if (levels.length) {
    elements.trainingLevelSelect.value = levels[0].tier;
  }
}
