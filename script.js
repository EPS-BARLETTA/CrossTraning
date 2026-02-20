'use strict';

const STUDENTS = ['A', 'B'];
const STORAGE_MODE = 'localStorage';
const STORAGE_KEY = 'CT_APP_STATE_V1';
const STORAGE_VERSION = 1;
const MAX_QR_BYTES = 2800;
const QR_TRIM_ORDER = ['notes', 'evaluation', 'skill', 'training'];
const TRAINING_HISTORY_LIMIT = 32;
const SKILL_HISTORY_LIMIT = 20;

const defaultState = {
  v: STORAGE_VERSION,
  updatedAt: null,
  students: {
    A: { prenom: '', nom: '', classe: '', sexe: '', groupe: '' },
    B: { prenom: '', nom: '', classe: '', sexe: '', groupe: '' },
  },
  mode: { studentMode: 'solo', active: 'A', observer: '' },
  training: { A: [], B: [] },
  skills: { A: [], B: [] },
  evaluation: {
    A: { level: '', comment: '' },
    B: { level: '', comment: '' },
  },
  notes: { A: '', B: '', prof: '' },
  archives: [],
};

let state = loadState();

const elements = {};

document.addEventListener('DOMContentLoaded', () => {
  cacheElements();
  bindIdentityInputs();
  bindModeControls();
  bindTrainingForm();
  bindSkillForm();
  bindEvaluationInputs();
  bindNotes();
  bindSummaryActions();
  renderAll();
});

function cacheElements() {
  elements.status = document.getElementById('status-indicator');
  elements.observerInput = document.getElementById('observer-input');
  elements.trainingForm = document.getElementById('training-form');
  elements.trainingLog = {
    A: document.getElementById('training-log-A'),
    B: document.getElementById('training-log-B'),
  };
  elements.skillForm = document.getElementById('skill-form');
  elements.skillLog = {
    A: document.getElementById('skill-log-A'),
    B: document.getElementById('skill-log-B'),
  };
  elements.evalSelect = {
    A: document.getElementById('eval-level-A'),
    B: document.getElementById('eval-level-B'),
  };
  elements.notes = {
    A: document.getElementById('notes-A'),
    B: document.getElementById('notes-B'),
    prof: document.getElementById('prof-notes'),
  };
  elements.qrOptions = document.querySelectorAll('[data-qr-option]');
  elements.qrWarning = document.getElementById('qr-warning');
  elements.qrOutput = document.getElementById('qr-output');
  elements.trainingQrOutput = document.getElementById('training-qr-output');
  elements.archiveList = document.getElementById('archive-list');
  elements.generateQrBtn = document.getElementById('generate-qr');
  elements.trainingQrBtn = document.getElementById('training-qr-btn');
  elements.finalizeBtn = document.getElementById('finalize-session');
  elements.resetBtn = document.getElementById('reset-carnet');
}

function bindIdentityInputs() {
  STUDENTS.forEach((id) => {
    bindTextInput(`student${id}-first`, (value) => {
      state.students[id].prenom = value;
      persistAndRender();
    });
    bindTextInput(`student${id}-last`, (value) => {
      state.students[id].nom = value;
      persistAndRender();
    });
    bindTextInput(`student${id}-class`, (value) => {
      state.students[id].classe = value;
      persistAndRender();
    });
    bindTextInput(`student${id}-group`, (value) => {
      state.students[id].groupe = value;
      persistAndRender();
    });
  });
}

function bindModeControls() {
  document.querySelectorAll('input[name="student-mode"]').forEach((radio) => {
    radio.checked = state.mode.studentMode === radio.value;
    radio.addEventListener('change', () => {
      if (!radio.checked) return;
      state.mode.studentMode = radio.value;
      ensureActiveStudent();
      persistAndRender();
    });
  });
  document.querySelectorAll('input[name="active-student"]').forEach((radio) => {
    radio.checked = state.mode.active === radio.value;
    radio.addEventListener('change', () => {
      if (!radio.checked) return;
      state.mode.active = radio.value;
      persistAndRender();
    });
  });
  if (elements.observerInput) {
    elements.observerInput.value = state.mode.observer || '';
    elements.observerInput.addEventListener('input', () => {
      state.mode.observer = elements.observerInput.value.trim();
      persistState();
    });
  }
}

function bindTrainingForm() {
  if (!elements.trainingForm) return;
  elements.trainingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const student = document.getElementById('training-student').value;
    const exercise = document.getElementById('training-exercise').value.trim();
    const level = document.getElementById('training-level').value.trim();
    const reps = Number(document.getElementById('training-reps').value);
    if (!STUDENTS.includes(student) || !exercise || !Number.isFinite(reps)) return;
    const entry = {
      id: cryptoRandomId(),
      exercise,
      level,
      reps,
      timestamp: Date.now(),
    };
    const list = state.training[student] || [];
    list.push(entry);
    state.training[student] = list.slice(-TRAINING_HISTORY_LIMIT);
    elements.trainingForm.reset();
    persistAndRender();
  });
}

function bindSkillForm() {
  if (!elements.skillForm) return;
  elements.skillForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const student = document.getElementById('skill-student').value;
    const label = document.getElementById('skill-label').value.trim();
    const duration = Number(document.getElementById('skill-duration').value);
    const blocks = Number(document.getElementById('skill-blocks').value);
    if (!STUDENTS.includes(student) || !label) return;
    const entry = {
      id: cryptoRandomId(),
      label,
      duration: Number.isFinite(duration) ? duration : null,
      blocks: Number.isFinite(blocks) ? blocks : null,
      timestamp: Date.now(),
    };
    const list = state.skills[student] || [];
    list.push(entry);
    state.skills[student] = list.slice(-SKILL_HISTORY_LIMIT);
    elements.skillForm.reset();
    persistAndRender();
  });
}

function bindEvaluationInputs() {
  Object.entries(elements.evalSelect).forEach(([student, select]) => {
    if (!select) return;
    select.value = state.evaluation[student]?.level ?? '';
    select.addEventListener('change', () => {
      state.evaluation[student].level = select.value;
      persistAndRender();
    });
  });
}

function bindNotes() {
  Object.entries(elements.notes).forEach(([key, textarea]) => {
    if (!textarea) return;
    textarea.value = state.notes[key] || '';
    textarea.addEventListener('input', () => {
      state.notes[key] = textarea.value;
      persistState();
    });
  });
}

function bindSummaryActions() {
  elements.generateQrBtn?.addEventListener('click', () => {
    renderQrBlocks(elements.qrOutput, getQrOptions());
  });
  elements.trainingQrBtn?.addEventListener('click', () => {
    renderQrBlocks(elements.trainingQrOutput, {
      identity: true,
      training: true,
      skill: false,
      evaluation: false,
      notes: false,
    });
  });
  elements.finalizeBtn?.addEventListener('click', () => {
    const snapshot = {
      id: cryptoRandomId(),
      date: new Date().toISOString(),
      students: clone(state.students),
      training: clone(state.training),
      skills: clone(state.skills),
    };
    state.archives.unshift(snapshot);
    state.archives = state.archives.slice(0, 12);
    persistAndRender();
  });
  elements.resetBtn?.addEventListener('click', () => {
    if (!window.confirm('Supprimer toutes les données locales ?')) return;
    clearStorage();
    state = clone(defaultState);
    renderAll();
  });
}

function renderAll() {
  renderIdentity();
  renderTrainingLogs();
  renderSkillLogs();
  renderEvaluation();
  renderNotes();
  renderArchives();
  updateStatus();
}

function renderIdentity() {
  STUDENTS.forEach((id) => {
    setInputValue(`student${id}-first`, state.students[id].prenom);
    setInputValue(`student${id}-last`, state.students[id].nom);
    setInputValue(`student${id}-class`, state.students[id].classe);
    setInputValue(`student${id}-group`, state.students[id].groupe);
    const activeRadio = document.querySelector(`input[name="active-student"][value="${id}"]`);
    if (activeRadio) activeRadio.checked = state.mode.active === id;
  });
  document.querySelectorAll('input[name="student-mode"]').forEach((radio) => {
    radio.checked = radio.value === state.mode.studentMode;
  });
  if (elements.observerInput) {
    elements.observerInput.value = state.mode.observer || '';
  }
}

function renderTrainingLogs() {
  STUDENTS.forEach((id) => {
    const container = elements.trainingLog[id];
    if (!container) return;
    const entries = state.training[id] || [];
    if (!entries.length) {
      container.innerHTML = '<li>Aucun test</li>';
      return;
    }
    container.innerHTML = entries
      .slice()
      .reverse()
      .map((entry) => `<li><strong>${entry.exercise}</strong> (${entry.level || 'N/A'}) — ${entry.reps} reps · ${formatShortDate(entry.timestamp)}</li>`)
      .join('');
  });
}

function renderSkillLogs() {
  STUDENTS.forEach((id) => {
    const container = elements.skillLog[id];
    if (!container) return;
    const entries = state.skills[id] || [];
    if (!entries.length) {
      container.innerHTML = '<li>Aucun run</li>';
      return;
    }
    container.innerHTML = entries
      .slice()
      .reverse()
      .map((entry) => {
        const parts = [];
        if (Number.isFinite(entry.duration)) parts.push(`${entry.duration} min`);
        if (Number.isFinite(entry.blocks)) parts.push(`${entry.blocks} blocs`);
        return `<li><strong>${entry.label}</strong> — ${parts.join(' • ') || 'statut'} · ${formatShortDate(entry.timestamp)}</li>`;
      })
      .join('');
  });
}

function renderEvaluation() {
  Object.entries(elements.evalSelect).forEach(([student, select]) => {
    if (!select) return;
    select.value = state.evaluation[student]?.level ?? '';
  });
}

function renderNotes() {
  Object.entries(elements.notes).forEach(([key, textarea]) => {
    if (!textarea) return;
    textarea.value = state.notes[key] || '';
  });
}

function renderArchives() {
  if (!elements.archiveList) return;
  if (!state.archives.length) {
    elements.archiveList.innerHTML = '<li>Aucune archive pour le moment.</li>';
    return;
  }
  elements.archiveList.innerHTML = state.archives
    .map((item) => {
      const labelA = formatStudent(state.students.A);
      const labelB = formatStudent(state.students.B);
      return `<li><strong>${formatShortDate(item.date || item.timestamp)}</strong> — ${labelA} / ${labelB}</li>`;
    })
    .join('');
}

function updateStatus() {
  if (!elements.status) return;
  const ts = state.updatedAt ? new Date(state.updatedAt).toLocaleString('fr-FR') : 'Jamais';
  elements.status.textContent = `Sauvegarde : ${ts}`;
}

function renderQrBlocks(container, options) {
  if (!container) return;
  const students = getEligibleStudents();
  if (!students.length) {
    container.innerHTML = '<p class="hint">Complète prénom + classe pour générer un QR.</p>';
    setWarning('');
    return;
  }
  if (typeof QRCode !== 'function') {
    container.innerHTML = '<p class="hint">Librairie QR manquante.</p>';
    setWarning('');
    return;
  }
  const fragments = document.createDocumentFragment();
  let warningMsg = '';
  students.forEach((id) => {
    const { payload, bytes, trimmedSections } = buildStudentPayload(id, options);
    const card = document.createElement('div');
    card.className = 'qr-card';
    card.innerHTML = `
      <h4>Élève ${id} — ${formatStudent(state.students[id])}</h4>
      <div class="qr-view"></div>
      <p>${bytes} octets</p>
      ${trimmedSections.length ? `<p class="hint">Contenu réduit : ${trimmedSections.join(' → ')}</p>` : ''}
    `;
    const canvas = card.querySelector('.qr-view');
    renderQrInto(canvas, payload);
    fragments.appendChild(card);
    if (bytes > MAX_QR_BYTES && !warningMsg) {
      warningMsg = 'QR volumineux, sections optionnelles supprimées.';
    }
  });
  container.innerHTML = '';
  container.appendChild(fragments);
  setWarning(warningMsg);
}

function buildStudentPayload(student, options = {}) {
  const identity = state.students[student];
  const payload = {
    app: 'carnet-ct',
    appName: 'Carnet Cross Training',
    appVersion: '1.0.0',
    type: 'scanprof/app',
    generatedAt: new Date().toISOString(),
    nom: identity.nom?.trim() || '-',
    prenom: identity.prenom?.trim() || '',
    classe: normalizeClass(identity.classe || ''),
    groupe: identity.groupe?.trim() || student,
  };
  const labels = {};
  const sectionKeys = { training: [], skill: [], evaluation: [], notes: [] };
  if (options.training !== false) {
    const entries = (state.training[student] || []).slice(-3);
    entries.forEach((entry, index) => {
      const key = `ct_t${index + 1}`;
      payload[key] = entry.reps;
      labels[key] = `${entry.exercise}${entry.level ? ` (${entry.level})` : ''}`;
      sectionKeys.training.push(key);
    });
  }
  if (options.skill !== false) {
    const entries = (state.skills[student] || []).slice(-2);
    entries.forEach((entry, index) => {
      const key = `ct_s${index + 1}`;
      const details = [];
      if (Number.isFinite(entry.blocks)) details.push(`${entry.blocks} blocs`);
      if (Number.isFinite(entry.duration)) details.push(`${entry.duration} min`);
      payload[key] = entry.blocks ?? entry.duration ?? index + 1;
      labels[key] = `${entry.label}${details.length ? ` — ${details.join(' / ')}` : ''}`;
      sectionKeys.skill.push(key);
    });
  }
  if (options.evaluation !== false) {
    const level = state.evaluation[student]?.level;
    if (level !== undefined && level !== null && `${level}`.length) {
      payload.ct_lvl = level;
      labels.ct_lvl = 'Niveau atteint';
      sectionKeys.evaluation.push('ct_lvl');
    }
  }
  if (options.notes !== false) {
    const note = (state.notes[student] || state.notes.prof || '').trim();
    if (note) {
      payload.ct_note = note.slice(0, 280);
      labels.ct_note = 'Note prof';
      sectionKeys.notes.push('ct_note');
    }
  }
  if (Object.keys(labels).length) {
    payload.__labels = labels;
  }
  let json = JSON.stringify(payload);
  const trimmedSections = [];
  if (json.length > MAX_QR_BYTES) {
    QR_TRIM_ORDER.forEach((section) => {
      if (json.length <= MAX_QR_BYTES) return;
      const keys = sectionKeys[section] || [];
      if (!keys.length) return;
      keys.forEach((key) => {
        delete payload[key];
        delete labels[key];
      });
      if (!Object.keys(labels).length) delete payload.__labels;
      json = JSON.stringify(payload);
      trimmedSections.push(section);
    });
  }
  return { payload, bytes: json.length, trimmedSections };
}

function renderQrInto(container, payload) {
  if (!container) return;
  container.innerHTML = '';
  try {
    const instance = new QRCode(container, {
      width: 210,
      height: 210,
      colorDark: '#0f172a',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel?.M ?? undefined,
    });
    instance.makeCode(JSON.stringify(payload));
  } catch (error) {
    console.error('QR error', error);
    container.textContent = 'Erreur QR';
  }
}

function getQrOptions() {
  const options = { identity: true, training: true, skill: true, evaluation: true, notes: true };
  elements.qrOptions?.forEach?.((input) => {
    const key = input.dataset.qrOption;
    if (!key) return;
    options[key] = input.checked;
  });
  // ScanProf exige toujours l'identité pour dédupliquer.
  options.identity = true;
  return options;
}

function getEligibleStudents() {
  return STUDENTS.filter((id) => {
    const student = state.students[id];
    return Boolean(student?.prenom?.trim() && student?.classe?.trim());
  });
}

function ensureActiveStudent() {
  if (state.mode.studentMode === 'solo') {
    state.mode.active = 'A';
  }
}

function bindTextInput(id, handler) {
  const input = document.getElementById(id);
  if (!input) return;
  input.value = input.value || '';
  input.addEventListener('input', () => handler(input.value.trimStart()));
}

function setInputValue(id, value) {
  const input = document.getElementById(id);
  if (!input) return;
  if (document.activeElement === input) return;
  input.value = value ?? '';
}

function persistAndRender() {
  persistState();
  renderAll();
}

function persistState() {
  const storage = getStorage();
  const snapshot = clone(state);
  snapshot.v = STORAGE_VERSION;
  snapshot.updatedAt = new Date().toISOString();
  if (storage) {
    storage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }
  state = snapshot;
}

function loadState() {
  const storage = getStorage();
  if (!storage) return clone(defaultState);
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return clone(defaultState);
    const parsed = JSON.parse(raw);
    return mergeState(parsed);
  } catch (error) {
    console.warn('State load', error);
    return clone(defaultState);
  }
}

function mergeState(partial) {
  const merged = clone(defaultState);
  merged.updatedAt = partial.updatedAt || null;
  merged.v = partial.v || STORAGE_VERSION;
  STUDENTS.forEach((id) => {
    merged.students[id] = { ...merged.students[id], ...(partial.students?.[id] || {}) };
    merged.training[id] = Array.isArray(partial.training?.[id]) ? partial.training[id] : [];
    merged.skills[id] = Array.isArray(partial.skills?.[id]) ? partial.skills[id] : [];
    merged.evaluation[id] = { ...merged.evaluation[id], ...(partial.evaluation?.[id] || {}) };
  });
  merged.mode = { ...merged.mode, ...(partial.mode || {}) };
  merged.notes = { ...merged.notes, ...(partial.notes || {}) };
  merged.archives = Array.isArray(partial.archives) ? partial.archives : [];
  return merged;
}

function clearStorage() {
  const storage = getStorage();
  storage?.removeItem(STORAGE_KEY);
}

function getStorage() {
  try {
    return window[STORAGE_MODE] || window.localStorage || null;
  } catch (error) {
    console.warn('Storage unavailable', error);
    return null;
  }
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function formatShortDate(value) {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
}

function formatStudent(student) {
  if (!student) return '';
  const bits = [];
  if (student.prenom) bits.push(student.prenom.trim());
  if (student.nom) bits.push(student.nom.trim().charAt(0).toUpperCase() + '.');
  if (student.classe) bits.push(student.classe.trim());
  return bits.join(' · ');
}

function cryptoRandomId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `id-${Math.random().toString(16).slice(2, 10)}`;
}

function normalizeClass(value) {
  if (!value) return '';
  return value
    .trim()
    .replace(/\s+/g, '')
    .replace(/ème|eme/gi, '')
    .toUpperCase();
}

function setWarning(message) {
  if (!elements.qrWarning) return;
  elements.qrWarning.textContent = message || '';
}
