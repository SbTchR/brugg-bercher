"use strict";

const STORAGE_KEY = "bbcal-state-v1";
const FIREBASE_DOC_PATH = ["bbcal", "shared-state"];
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD1fgN-1eYacn-Earewjn95MlgZ_kzsvQM",
  authDomain: "bbcal-e3d73.firebaseapp.com",
  projectId: "bbcal-e3d73",
  storageBucket: "bbcal-e3d73.firebasestorage.app",
  messagingSenderId: "49321382886",
  appId: "1:49321382886:web:b70fb41fa125b2946dfc27",
  measurementId: "G-DEDYNMH34G"
};

const DAYS = [
  { id: "mon", fr: "Lundi", de: "Montag" },
  { id: "tue", fr: "Mardi", de: "Dienstag" },
  { id: "wed", fr: "Mercredi", de: "Mittwoch" },
  { id: "thu", fr: "Jeudi", de: "Donnerstag" },
  { id: "fri", fr: "Vendredi", de: "Freitag" }
];

const I18N = {
  fr: {
    title: "BBCal - Disponibilités Bercher-Brugg",
    brandSubtitle: "Disponibilités communes Bercher-Brugg",
    navCompare: "Comparer",
    navAvailability: "Disponibilités",
    navSchedules: "Horaires",
    navSettings: "Paramètres",
    compareTitle: "Comparer les disponibilités",
    compareLead: "Choisissez une classe, puis une ou plusieurs classes partenaires. Les chevauchements sont calculés avec les heures des périodes.",
    autosaved: "Enregistré automatiquement",
    firebaseConnecting: "Connexion aux données partagées...",
    firebaseOnline: "Données partagées synchronisées",
    firebaseOffline: "Mode local, Firebase indisponible",
    firebaseSaving: "Sauvegarde en ligne...",
    selection: "Sélection",
    baseClass: "Classe de départ",
    partnerClasses: "Classes partenaires",
    checkAvailability: "Cocher les disponibilités",
    editPartnerships: "Modifier les partenariats",
    commonSlot: "créneau commun",
    commonSlots: "créneaux communs",
    checkedPeriodForBase: "période cochée pour la classe de départ",
    checkedPeriodsForBase: "périodes cochées pour la classe de départ",
    comparedPartner: "classe partenaire comparée",
    comparedPartners: "classes partenaires comparées",
    noPartnership: "Aucun partenariat pour cette classe",
    addPartnerHint: "Ajoutez une classe partenaire dans les paramètres pour lancer la comparaison.",
    openSettings: "Ouvrir les paramètres",
    selectPartner: "Sélectionnez au moins une classe partenaire",
    resultAfterPartner: "Le résultat apparaîtra ici dès qu'une classe partenaire est activée.",
    noOverlap: "Aucun chevauchement trouvé",
    noOverlapHint: "Essayez de cocher plus de périodes disponibles ou vérifiez les heures des horaires d'école.",
    commonSlotsLabel: "Créneaux communs",
    overlap: "chevauchement",
    overlaps: "chevauchements",
    common: "Commun",
    classes: "classes",
    availabilityTitle: "Disponibilités des classes",
    availabilityLead: "Cochez les périodes où la classe peut participer à une visioconférence.",
    localSave: "Sauvegarde locale",
    classToFill: "Classe à remplir",
    school: "Établissement",
    class: "Classe",
    selectAll: "Tout cocher",
    clearAll: "Tout décocher",
    usedSchedule: "Horaire utilisé",
    dayAvailable: "Jour disponible",
    dayUnavailable: "Jour indisponible",
    available: "disponible",
    noPeriodToday: "Aucune période pour ce jour",
    addPeriodsInSchedules: "Ajoutez des périodes dans l'onglet Horaires.",
    schedulesTitle: "Horaires d'école",
    schedulesLead: "Chaque établissement peut avoir son propre nombre de périodes et ses propres heures.",
    editableAnytime: "Modifiable à tout moment",
    scheduleToEdit: "Horaire à modifier",
    checkedStay: "Les disponibilités déjà cochées restent en place lorsque vous ajustez les heures.",
    period: "période",
    periods: "périodes",
    copyWeek: "Copier vers la semaine",
    addPeriod: "Ajouter une période",
    start: "Début",
    end: "Fin",
    noPeriod: "Aucune période",
    addPeriodForTeachers: "Ajoutez une période pour permettre aux profs de cocher ce jour.",
    deletePeriod: "Supprimer la période",
    settingsTitle: "Paramètres",
    settingsLead: "Modifiez les listes de classes et les partenariats utilisés dans la comparaison.",
    browserData: "Données dans ce navigateur",
    classLists: "Listes de classes",
    oneClassPerLine: "Une classe par ligne",
    saveList: "Enregistrer la liste",
    resetExamples: "Réinitialiser les exemples",
    partnerships: "Partenariats",
    classToLink: "Classe à relier",
    belongsTo: "appartient à",
    checkPartners: "Cochez les classes partenaires.",
    scheduleCopied: "Horaire copié sur la semaine.",
    resetConfirm: "Réinitialiser horaires, classes, partenariats et disponibilités ?",
    examplesRestored: "Données d'exemple restaurées.",
    addOneClass: "Ajoutez au moins une classe.",
    classListSaved: "Liste de classes enregistrée."
  },
  de: {
    title: "BBCal - Gemeinsame Zeitfenster Bercher-Brugg",
    brandSubtitle: "Gemeinsame Zeitfenster Bercher-Brugg",
    navCompare: "Vergleichen",
    navAvailability: "Verfügbarkeiten",
    navSchedules: "Stundenpläne",
    navSettings: "Einstellungen",
    compareTitle: "Verfügbarkeiten vergleichen",
    compareLead: "Wählen Sie eine Klasse und eine oder mehrere Partnerklassen. Die Überschneidungen werden anhand der tatsächlichen Lektionenzeiten berechnet.",
    autosaved: "Automatisch gespeichert",
    firebaseConnecting: "Verbindung zu den gemeinsamen Daten...",
    firebaseOnline: "Gemeinsame Daten synchronisiert",
    firebaseOffline: "Lokaler Modus, Firebase nicht verfügbar",
    firebaseSaving: "Online speichern...",
    selection: "Auswahl",
    baseClass: "Ausgangsklasse",
    partnerClasses: "Partnerklassen",
    checkAvailability: "Verfügbarkeiten eintragen",
    editPartnerships: "Partnerschaften bearbeiten",
    commonSlot: "gemeinsames Zeitfenster",
    commonSlots: "gemeinsame Zeitfenster",
    checkedPeriodForBase: "markierte Lektion der Ausgangsklasse",
    checkedPeriodsForBase: "markierte Lektionen der Ausgangsklasse",
    comparedPartner: "verglichene Partnerklasse",
    comparedPartners: "verglichene Partnerklassen",
    noPartnership: "Keine Partnerschaft für diese Klasse",
    addPartnerHint: "Fügen Sie in den Einstellungen eine Partnerklasse hinzu, um den Vergleich zu starten.",
    openSettings: "Einstellungen öffnen",
    selectPartner: "Wählen Sie mindestens eine Partnerklasse",
    resultAfterPartner: "Das Ergebnis erscheint hier, sobald eine Partnerklasse aktiviert ist.",
    noOverlap: "Keine Überschneidung gefunden",
    noOverlapHint: "Markieren Sie mehr verfügbare Lektionen oder prüfen Sie die Zeiten der Stundenpläne.",
    commonSlotsLabel: "Gemeinsame Zeitfenster",
    overlap: "Überschneidung",
    overlaps: "Überschneidungen",
    common: "Gemeinsam",
    classes: "Klassen",
    availabilityTitle: "Verfügbarkeiten der Klassen",
    availabilityLead: "Markieren Sie die Lektionen, in denen die Klasse an einer Videokonferenz teilnehmen kann.",
    localSave: "Lokal gespeichert",
    classToFill: "Klasse bearbeiten",
    school: "Schule",
    class: "Klasse",
    selectAll: "Alles markieren",
    clearAll: "Alles entfernen",
    usedSchedule: "Verwendeter Stundenplan",
    dayAvailable: "Ganzer Tag verfügbar",
    dayUnavailable: "Ganzer Tag nicht verfügbar",
    available: "verfügbar",
    noPeriodToday: "Keine Lektion für diesen Tag",
    addPeriodsInSchedules: "Fügen Sie im Tab Stundenpläne Lektionen hinzu.",
    schedulesTitle: "Stundenpläne",
    schedulesLead: "Jede Schule kann eine eigene Anzahl Lektionen und eigene Zeiten haben.",
    editableAnytime: "Jederzeit anpassbar",
    scheduleToEdit: "Stundenplan bearbeiten",
    checkedStay: "Bereits markierte Verfügbarkeiten bleiben erhalten, wenn Sie die Zeiten anpassen.",
    period: "Lektion",
    periods: "Lektionen",
    copyWeek: "Auf die Woche kopieren",
    addPeriod: "Lektion hinzufügen",
    start: "Beginn",
    end: "Ende",
    noPeriod: "Keine Lektion",
    addPeriodForTeachers: "Fügen Sie eine Lektion hinzu, damit Lehrpersonen diesen Tag markieren können.",
    deletePeriod: "Lektion löschen",
    settingsTitle: "Einstellungen",
    settingsLead: "Bearbeiten Sie Klassenlisten und Partnerschaften für den Vergleich.",
    browserData: "Daten in diesem Browser",
    classLists: "Klassenlisten",
    oneClassPerLine: "Eine Klasse pro Zeile",
    saveList: "Liste speichern",
    resetExamples: "Beispiele zurücksetzen",
    partnerships: "Partnerschaften",
    classToLink: "Klasse verknüpfen",
    belongsTo: "gehört zu",
    checkPartners: "Markieren Sie die Partnerklassen.",
    scheduleCopied: "Stundenplan auf die Woche kopiert.",
    resetConfirm: "Stundenpläne, Klassen, Partnerschaften und Verfügbarkeiten zurücksetzen?",
    examplesRestored: "Beispieldaten wiederhergestellt.",
    addOneClass: "Fügen Sie mindestens eine Klasse hinzu.",
    classListSaved: "Klassenliste gespeichert."
  }
};

const SCHOOL_ORDER = ["bercher", "sekundar", "bezirk"];

const DEFAULT_CLASSES = {
  bercher: [
    "9VG1", "0VG2", "9VG3", "9VG4", "9VP1", "9VP2",
    "10VG1", "10VG2", "10VG3", "10VG4", "10VP1", "10VP2",
    "11VG1", "11VG2", "11VG3", "11VG4", "11VP1", "11VP2"
  ],
  sekundar: ["S1a", "S1b", "S1c", "S2a", "S2b", "S2c", "S3a", "S3b", "S3c"],
  bezirk: ["B1a", "B1b", "B1c", "B1d", "B2a", "B2b", "B2c", "B3a", "B3b", "B3c", "B3d"]
};

const DEFAULT_SCHOOL_META = {
  bercher: {
    id: "bercher",
    name: "Horaire Bercher",
    shortName: "Bercher",
    color: "#2563eb"
  },
  sekundar: {
    id: "sekundar",
    name: "Stundenplan Sekundarschule",
    shortName: "Sekundarschule",
    color: "#bd2b92"
  },
  bezirk: {
    id: "bezirk",
    name: "Stundenplan Bezirksschule",
    shortName: "Bezirksschule",
    color: "#168064"
  }
};

const DEFAULT_PERIODS = {
  bercher: [
    ["08:15", "09:00"],
    ["09:05", "09:50"],
    ["10:10", "10:55"],
    ["11:00", "11:45"],
    ["13:30", "14:15"],
    ["14:20", "15:05"],
    ["15:20", "16:05"]
  ],
  sekundar: [
    ["07:35", "08:20"],
    ["08:25", "09:10"],
    ["09:30", "10:15"],
    ["10:20", "11:05"],
    ["11:10", "11:55"],
    ["13:30", "14:15"],
    ["14:20", "15:05"],
    ["15:20", "16:05"]
  ],
  bezirk: [
    ["07:40", "08:25"],
    ["08:30", "09:15"],
    ["09:35", "10:20"],
    ["10:25", "11:10"],
    ["11:15", "12:00"],
    ["13:35", "14:20"],
    ["14:25", "15:10"],
    ["15:25", "16:10"]
  ]
};

const app = document.querySelector("#app");
let state = loadState();
let ui = {
  view: "compare",
  lang: localStorage.getItem("bbcal-lang") === "de" ? "de" : "fr",
  syncStatus: "connecting",
  compareBase: classKey("bercher", "9VG1"),
  comparePartners: [],
  availabilitySchool: "bercher",
  availabilityClass: classKey("bercher", "9VG1"),
  scheduleSchool: "bercher",
  settingsSchool: "bercher",
  partnershipBase: classKey("bercher", "9VG1")
};
let toastTimer = null;
let firebaseDb = null;
let firebaseDocRef = null;
let remoteSaveTimer = null;
let applyingRemoteState = false;
let lastRemoteJson = "";

document.addEventListener("click", handleClick);
document.addEventListener("change", handleChange);
document.addEventListener("input", handleInput);

render();
initFirebaseSync();

function createDefaultState() {
  const schools = {};

  SCHOOL_ORDER.forEach((schoolId) => {
    schools[schoolId] = {
      ...DEFAULT_SCHOOL_META[schoolId],
      classes: [...DEFAULT_CLASSES[schoolId]],
      schedule: createDefaultSchedule(schoolId)
    };
  });

  return {
    schools,
    availability: {},
    partnershipLinks: createDefaultPartnerships()
  };
}

function createDefaultSchedule(schoolId) {
  const periods = DEFAULT_PERIODS[schoolId].map(([start, end]) => ({ start, end }));
  const schedule = {};
  DAYS.forEach((day) => {
    schedule[day.id] = clonePeriods(periods);
  });
  return schedule;
}

function createDefaultPartnerships() {
  const links = new Set();
  ["11VG1", "11VG2", "11VG3", "11VG4"].forEach((bercherClass) => {
    ["S3a", "S3b", "S3c"].forEach((sekClass) => {
      links.add(linkId(classKey("bercher", bercherClass), classKey("sekundar", sekClass)));
    });
  });
  links.add(linkId(classKey("bercher", "9VG1"), classKey("bezirk", "B1d")));
  return [...links];
}

function loadState() {
  const fallback = createDefaultState();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return fallback;
    return normalizeState(JSON.parse(stored));
  } catch (error) {
    console.warn("Impossible de charger les données BBCal.", error);
    return fallback;
  }
}

function normalizeState(raw) {
  const base = createDefaultState();
  const schools = {};

  SCHOOL_ORDER.forEach((schoolId) => {
    const incoming = raw?.schools?.[schoolId] || {};
    const meta = DEFAULT_SCHOOL_META[schoolId];
    const classes = Array.isArray(incoming.classes) && incoming.classes.length
      ? cleanClassList(incoming.classes)
      : [...DEFAULT_CLASSES[schoolId]];

    schools[schoolId] = {
      ...meta,
      name: typeof incoming.name === "string" && incoming.name.trim() ? incoming.name.trim() : meta.name,
      shortName: meta.shortName,
      color: meta.color,
      classes,
      schedule: normalizeSchedule(incoming.schedule, base.schools[schoolId].schedule)
    };
  });

  const knownKeys = new Set(getAllClassKeys({ schools }));
  const availability = {};
  Object.entries(raw?.availability || {}).forEach(([key, value]) => {
    if (!knownKeys.has(key)) return;
    availability[key] = {};
    DAYS.forEach((day) => {
      const indexes = Array.isArray(value?.[day.id]) ? value[day.id] : [];
      availability[key][day.id] = [...new Set(indexes)]
        .map((item) => Number(item))
        .filter((item) => Number.isInteger(item) && item >= 0);
    });
  });

  const partnershipLinks = Array.isArray(raw?.partnershipLinks)
    ? raw.partnershipLinks.filter((link) => {
      const [a, b] = String(link).split("|");
      return knownKeys.has(a) && knownKeys.has(b) && a !== b;
    })
    : base.partnershipLinks;

  return { schools, availability, partnershipLinks: [...new Set(partnershipLinks)] };
}

function normalizeSchedule(incomingSchedule, fallbackSchedule) {
  const schedule = {};
  DAYS.forEach((day) => {
    const rows = Array.isArray(incomingSchedule?.[day.id])
      ? incomingSchedule[day.id]
      : fallbackSchedule[day.id];
    schedule[day.id] = rows
      .map((period) => ({
        start: normalizeTime(period.start),
        end: normalizeTime(period.end)
      }))
      .filter((period) => period.start && period.end);
  });
  return schedule;
}

function normalizeTime(value) {
  return typeof value === "string" && /^\d{2}:\d{2}$/.test(value) ? value : "";
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  scheduleRemoteSave();
}

async function initFirebaseSync() {
  try {
    const [{ initializeApp }, { initializeFirestore, doc, getDoc, onSnapshot, setDoc, serverTimestamp }] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js")
    ]);

    const firebaseApp = initializeApp(FIREBASE_CONFIG);
    firebaseDb = initializeFirestore(firebaseApp, {
      experimentalAutoDetectLongPolling: true
    });
    firebaseDocRef = doc(firebaseDb, ...FIREBASE_DOC_PATH);
    window.bbcalFirebaseSetDoc = setDoc;
    window.bbcalFirebaseServerTimestamp = serverTimestamp;

    const firstSnapshot = await withTimeout(getDoc(firebaseDocRef), 8000);
    if (firstSnapshot.exists() && firstSnapshot.data()?.state) {
      applyRemoteState(firstSnapshot.data().state);
    } else {
      await writeRemoteState();
    }

    onSnapshot(firebaseDocRef, (snapshot) => {
      const remoteState = snapshot.data()?.state;
      if (!remoteState) return;
      applyRemoteState(remoteState);
      ui.syncStatus = "online";
      render();
    }, (error) => {
      console.warn("Synchronisation Firestore interrompue.", error);
      ui.syncStatus = "offline";
      render();
    });

    ui.syncStatus = "online";
    render();
  } catch (error) {
    console.warn("Firebase indisponible, l'app continue en mode local.", error);
    ui.syncStatus = "offline";
    render();
  }
}

function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error("Firebase timeout")), timeoutMs);
    })
  ]);
}

function applyRemoteState(remoteState) {
  const normalized = normalizeState(remoteState);
  const remoteJson = JSON.stringify(normalized);
  if (remoteJson === lastRemoteJson || remoteJson === JSON.stringify(state)) return;

  applyingRemoteState = true;
  state = normalized;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  lastRemoteJson = remoteJson;
  applyingRemoteState = false;
}

function scheduleRemoteSave() {
  if (applyingRemoteState || !firebaseDocRef) return;
  ui.syncStatus = "saving";
  window.clearTimeout(remoteSaveTimer);
  remoteSaveTimer = window.setTimeout(async () => {
    try {
      await writeRemoteState();
      ui.syncStatus = "online";
      render();
    } catch (error) {
      console.warn("Impossible d'enregistrer dans Firestore.", error);
      ui.syncStatus = "offline";
      render();
    }
  }, 450);
}

async function writeRemoteState() {
  if (!firebaseDocRef || !window.bbcalFirebaseSetDoc) return;
  const payload = normalizeState(state);
  lastRemoteJson = JSON.stringify(payload);
  await window.bbcalFirebaseSetDoc(firebaseDocRef, {
    state: payload,
    updatedAt: window.bbcalFirebaseServerTimestamp ? window.bbcalFirebaseServerTimestamp() : new Date().toISOString()
  }, { merge: true });
}

function render() {
  ensureSelections();
  updateShellLanguage();
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === ui.view);
  });
  document.querySelectorAll(".lang-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === ui.lang);
  });

  if (ui.view === "compare") renderCompareView();
  if (ui.view === "availability") renderAvailabilityView();
  if (ui.view === "schedules") renderSchedulesView();
  if (ui.view === "settings") renderSettingsView();
}

function t(key) {
  return I18N[ui.lang][key] || I18N.fr[key] || key;
}

function dayLabel(day) {
  return day[ui.lang] || day.fr;
}

function updateShellLanguage() {
  document.documentElement.lang = ui.lang;
  document.title = t("title");
  const brandSubtitle = document.querySelector(".brand small");
  if (brandSubtitle) brandSubtitle.textContent = t("brandSubtitle");
  document.querySelector(".brand")?.setAttribute("aria-label", ui.lang === "de" ? "Zum Vergleich" : "Aller à la comparaison");
  document.querySelector(".main-nav")?.setAttribute("aria-label", ui.lang === "de" ? "Hauptnavigation" : "Navigation principale");
  document.querySelector(".language-switch")?.setAttribute("aria-label", ui.lang === "de" ? "Sprache" : "Langue");
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
}

function schoolName(school) {
  if (ui.lang === "de" && school.id === "bercher" && school.name === DEFAULT_SCHOOL_META.bercher.name) {
    return "Stundenplan Bercher";
  }
  return school.name;
}

function syncStatusText() {
  if (ui.syncStatus === "online") return t("firebaseOnline");
  if (ui.syncStatus === "offline") return t("firebaseOffline");
  if (ui.syncStatus === "saving") return t("firebaseSaving");
  return t("firebaseConnecting");
}

function ensureSelections() {
  const allKeys = getAllClassKeys(state);
  const firstKey = allKeys[0] || "";
  if (!allKeys.includes(ui.compareBase)) ui.compareBase = firstKey;
  if (!SCHOOL_ORDER.includes(ui.availabilitySchool)) ui.availabilitySchool = SCHOOL_ORDER[0];
  if (!SCHOOL_ORDER.includes(ui.scheduleSchool)) ui.scheduleSchool = SCHOOL_ORDER[0];
  if (!SCHOOL_ORDER.includes(ui.settingsSchool)) ui.settingsSchool = SCHOOL_ORDER[0];

  const availabilityKeys = schoolClassKeys(ui.availabilitySchool);
  if (!availabilityKeys.includes(ui.availabilityClass)) ui.availabilityClass = availabilityKeys[0] || firstKey;
  if (!allKeys.includes(ui.partnershipBase)) ui.partnershipBase = firstKey;

  const allowedPartners = getPartnerKeys(ui.compareBase);
  ui.comparePartners = ui.comparePartners.filter((key) => allowedPartners.includes(key));
  if (allowedPartners.length && ui.comparePartners.length === 0) {
    ui.comparePartners = [allowedPartners[0]];
  }
}

function renderCompareView() {
  const partnerKeys = getPartnerKeys(ui.compareBase);
  const compareKeys = [ui.compareBase, ...ui.comparePartners];
  const slots = ui.comparePartners.length ? computeCommonSlots(compareKeys) : [];
  const availableCount = countAvailablePeriods(ui.compareBase);

  app.innerHTML = `
    <div class="view-head">
      <div>
        <h1 class="view-title">${t("compareTitle")}</h1>
        <p class="view-lede">${t("compareLead")}</p>
      </div>
      <span class="status-pill">${syncStatusText()}</span>
    </div>

    <div class="layout-grid">
      <aside class="surface panel-pad">
        <h2 class="section-title">${t("selection")}</h2>
        <div class="field-stack">
          <div class="field">
            <label for="compare-base">${t("baseClass")}</label>
            <select id="compare-base" class="select" data-action="set-compare-base">
              ${classOptions(ui.compareBase)}
            </select>
          </div>

          <div class="field">
            <span class="field-label">${t("partnerClasses")}</span>
            ${renderPartnerPicker(partnerKeys)}
          </div>

          <div class="button-row">
            <button type="button" class="btn subtle" data-action="go-view" data-view="availability">${t("checkAvailability")}</button>
            <button type="button" class="btn" data-action="go-view" data-view="settings">${t("editPartnerships")}</button>
          </div>
        </div>
      </aside>

      <section class="surface">
        <div class="summary-strip">
          <div class="summary-item">
            <strong>${slots.length}</strong>
            <span>${slots.length > 1 ? t("commonSlots") : t("commonSlot")}</span>
          </div>
          <div class="summary-item">
            <strong>${availableCount}</strong>
            <span>${availableCount > 1 ? t("checkedPeriodsForBase") : t("checkedPeriodForBase")}</span>
          </div>
          <div class="summary-item">
            <strong>${ui.comparePartners.length}</strong>
            <span>${ui.comparePartners.length > 1 ? t("comparedPartners") : t("comparedPartner")}</span>
          </div>
        </div>
        ${renderSlotList(slots, partnerKeys)}
      </section>
    </div>

    <section class="timeline-stack" aria-label="Vue par jour" style="margin-top: 20px;">
      ${ui.comparePartners.length ? DAYS.map((day) => renderTimelineDay(day, compareKeys)).join("") : ""}
    </section>
  `;
}

function renderPartnerPicker(partnerKeys) {
  if (!partnerKeys.length) {
    return `
      <div class="empty-state">
        <div>
          <strong>${t("noPartnership")}</strong>
          <p>${t("addPartnerHint")}</p>
          <button type="button" class="btn primary" data-action="go-view" data-view="settings">${t("openSettings")}</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="partner-list">
      ${partnerKeys.map((key) => {
    const parsed = parseClassKey(key);
    const school = state.schools[parsed.schoolId];
    const selected = ui.comparePartners.includes(key);
    return `
          <button type="button" class="partner-chip ${selected ? "is-selected" : ""}" data-action="toggle-compare-partner" data-key="${escapeAttr(key)}">
            <span>
              <strong>${escapeHtml(parsed.className)}</strong>
              <small>${escapeHtml(schoolName(school))}</small>
            </span>
            <span class="check-dot" aria-hidden="true">OK</span>
          </button>
        `;
  }).join("")}
    </div>
  `;
}

function renderSlotList(slots, partnerKeys) {
  if (!partnerKeys.length) return "";
  if (!ui.comparePartners.length) {
    return `
      <div class="empty-state">
        <div>
          <strong>${t("selectPartner")}</strong>
          <p>${t("resultAfterPartner")}</p>
        </div>
      </div>
    `;
  }
  if (!slots.length) {
    return `
      <div class="empty-state">
        <div>
          <strong>${t("noOverlap")}</strong>
          <p>${t("noOverlapHint")}</p>
        </div>
      </div>
    `;
  }

  return `
    <div class="result-list" aria-label="${t("commonSlotsLabel")}">
      ${slots.map((slot) => `
        <div class="slot-item">
          <span class="slot-day">${escapeHtml(dayLabel(slot.day))}</span>
          <span class="slot-time">${formatMinutes(slot.start)}-${formatMinutes(slot.end)}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderTimelineDay(day, classKeys) {
  const common = getCommonIntervals(classKeys, day.id);
  const range = getTimelineRange(classKeys, day.id, common);
  const marks = createScaleMarks(range.start, range.end);

  return `
    <article class="timeline-day">
      <header class="timeline-day-header">
        <h3>${escapeHtml(dayLabel(day))}</h3>
        <span class="timeline-count">${common.length ? `${common.length} ${common.length > 1 ? t("overlaps") : t("overlap")}` : t("noOverlap")}</span>
      </header>
      <div class="timeline-scroll">
        <div class="timeline-inner">
          <div class="timeline-scale" aria-hidden="true">
            <span></span>
            <div class="scale-track">
              ${marks.map((mark) => `<span class="scale-mark" style="left:${mark.left}%">${formatMinutes(mark.minute)}</span>`).join("")}
            </div>
          </div>
          <div class="timeline-row">
            <div class="timeline-label">${t("common")}<small>${classKeys.length} ${t("classes")}</small></div>
            <div class="timeline-track">
              ${common.map((block) => renderTimelineBlock(block, range, "common", t("common"))).join("")}
            </div>
          </div>
          ${classKeys.map((key) => renderClassTimelineRow(key, day.id, range)).join("")}
        </div>
      </div>
    </article>
  `;
}

function renderClassTimelineRow(key, dayId, range) {
  const parsed = parseClassKey(key);
  const school = state.schools[parsed.schoolId];
  const blocks = getAvailableBlocks(key, dayId);

  return `
    <div class="timeline-row">
      <div class="timeline-label" title="${escapeAttr(parsed.className)}">
        ${escapeHtml(parsed.className)}
        <small style="--school-color:${school.color}">${escapeHtml(school.shortName)}</small>
      </div>
      <div class="timeline-track" style="--school-color:${school.color}">
        ${blocks.map((block) => renderTimelineBlock(block, range, "available", `P${block.index + 1}`)).join("")}
      </div>
    </div>
  `;
}

function renderTimelineBlock(block, range, className, label) {
  const span = Math.max(1, range.end - range.start);
  const left = ((block.start - range.start) / span) * 100;
  const width = ((block.end - block.start) / span) * 100;
  return `
    <span
      class="timeline-block ${className}"
      style="left:${clamp(left, 0, 100)}%; width:${clamp(width, 0.8, 100)}%;"
      title="${formatMinutes(block.start)}-${formatMinutes(block.end)}"
    >${escapeHtml(label)}</span>
  `;
}

function renderAvailabilityView() {
  const key = ui.availabilityClass;
  const parsed = parseClassKey(key);
  const school = state.schools[parsed.schoolId] || state.schools[ui.availabilitySchool];

  app.innerHTML = `
    <div class="view-head">
      <div>
        <h1 class="view-title">${t("availabilityTitle")}</h1>
        <p class="view-lede">${t("availabilityLead")}</p>
      </div>
      <span class="status-pill">${syncStatusText()}</span>
    </div>

    <div class="layout-grid wide-left">
      <aside class="surface panel-pad">
        <h2 class="section-title">${t("classToFill")}</h2>
        <div class="field-stack">
          <div class="field">
            <label for="availability-school">${t("school")}</label>
            <select id="availability-school" class="select" data-action="set-availability-school">
              ${schoolOptions(ui.availabilitySchool)}
            </select>
          </div>
          <div class="field">
            <label for="availability-class">${t("class")}</label>
            <select id="availability-class" class="select" data-action="set-availability-class">
              ${schoolClassOptions(ui.availabilitySchool, ui.availabilityClass)}
            </select>
          </div>
          <div class="button-row">
            <button type="button" class="btn primary" data-action="select-all-week" data-key="${escapeAttr(key)}">${t("selectAll")}</button>
            <button type="button" class="btn" data-action="clear-all-week" data-key="${escapeAttr(key)}">${t("clearAll")}</button>
          </div>
          <p class="field-hint">${t("usedSchedule")} : ${escapeHtml(schoolName(school))}.</p>
        </div>
      </aside>

      <section class="availability-days">
        ${DAYS.map((day) => renderAvailabilityDay(key, day)).join("")}
      </section>
    </div>
  `;
}

function renderAvailabilityDay(key, day) {
  const parsed = parseClassKey(key);
  const periods = state.schools[parsed.schoolId]?.schedule?.[day.id] || [];
  const selected = new Set(state.availability[key]?.[day.id] || []);

  return `
    <article class="day-panel">
      <header class="day-panel-head">
        <h3>${escapeHtml(dayLabel(day))}</h3>
        <div class="button-row">
          <button type="button" class="btn subtle" data-action="select-day" data-key="${escapeAttr(key)}" data-day="${day.id}">${t("dayAvailable")}</button>
          <button type="button" class="btn" data-action="clear-day" data-key="${escapeAttr(key)}" data-day="${day.id}">${t("dayUnavailable")}</button>
        </div>
      </header>
      ${periods.length ? `
        <div class="period-grid">
          ${periods.map((period, index) => {
    const isSelected = selected.has(index);
    return `
              <button type="button" class="period-toggle ${isSelected ? "is-selected" : ""}" data-action="toggle-availability" data-key="${escapeAttr(key)}" data-day="${day.id}" data-index="${index}">
                <strong>P${index + 1}${isSelected ? ` - ${t("available")}` : ""}</strong>
                <span>${escapeHtml(period.start)}-${escapeHtml(period.end)}</span>
              </button>
            `;
  }).join("")}
        </div>
      ` : `
        <div class="empty-state">
          <div>
            <strong>${t("noPeriodToday")}</strong>
            <p>${t("addPeriodsInSchedules")}</p>
          </div>
        </div>
      `}
    </article>
  `;
}

function renderSchedulesView() {
  const school = state.schools[ui.scheduleSchool];

  app.innerHTML = `
    <div class="view-head">
      <div>
        <h1 class="view-title">${t("schedulesTitle")}</h1>
        <p class="view-lede">${t("schedulesLead")}</p>
      </div>
      <span class="status-pill">${t("editableAnytime")}</span>
    </div>

    <div class="layout-grid">
      <aside class="surface panel-pad">
        <h2 class="section-title">${t("school")}</h2>
        <div class="field-stack">
          <div class="field">
            <label for="schedule-school">${t("scheduleToEdit")}</label>
            <select id="schedule-school" class="select" data-action="set-schedule-school">
              ${schoolOptions(ui.scheduleSchool)}
            </select>
          </div>
          <p class="field-hint">${t("checkedStay")}</p>
        </div>
      </aside>

      <section class="schedule-days">
        ${DAYS.map((day) => renderScheduleDay(school, day)).join("")}
      </section>
    </div>
  `;
}

function renderScheduleDay(school, day) {
  const periods = school.schedule[day.id] || [];

  return `
    <article class="day-panel">
      <header class="day-panel-head">
        <h3>${escapeHtml(dayLabel(day))} <span class="timeline-count">${periods.length} ${periods.length > 1 ? t("periods") : t("period")}</span></h3>
        <div class="button-row">
          <button type="button" class="btn subtle" data-action="copy-day-schedule" data-school="${school.id}" data-day="${day.id}">${t("copyWeek")}</button>
          <button type="button" class="btn primary" data-action="add-period" data-school="${school.id}" data-day="${day.id}">${t("addPeriod")}</button>
        </div>
      </header>
      ${periods.length ? `
        <table class="schedule-table">
          <thead>
            <tr>
              <th>${t("period")}</th>
              <th>${t("start")}</th>
              <th>${t("end")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${periods.map((period, index) => renderScheduleRow(school.id, day.id, period, index)).join("")}
          </tbody>
        </table>
      ` : `
        <div class="empty-state">
          <div>
            <strong>${t("noPeriod")}</strong>
            <p>${t("addPeriodForTeachers")}</p>
          </div>
        </div>
      `}
    </article>
  `;
}

function renderScheduleRow(schoolId, dayId, period, index) {
  const invalid = parseTime(period.start) !== null && parseTime(period.end) !== null && parseTime(period.end) <= parseTime(period.start);
  return `
    <tr class="schedule-row ${invalid ? "is-invalid" : ""}">
      <td class="period-label">P${index + 1}</td>
      <td>
        <input class="input time-input" type="time" value="${escapeAttr(period.start)}" data-action="update-period-time" data-school="${schoolId}" data-day="${dayId}" data-index="${index}" data-field="start" aria-label="${t("start")} ${t("period")} ${index + 1}">
      </td>
      <td>
        <input class="input time-input" type="time" value="${escapeAttr(period.end)}" data-action="update-period-time" data-school="${schoolId}" data-day="${dayId}" data-index="${index}" data-field="end" aria-label="${t("end")} ${t("period")} ${index + 1}">
      </td>
      <td>
        <button type="button" class="btn icon-only danger" data-action="remove-period" data-school="${schoolId}" data-day="${dayId}" data-index="${index}" aria-label="${t("deletePeriod")} ${index + 1}">X</button>
      </td>
    </tr>
  `;
}

function renderSettingsView() {
  const classList = state.schools[ui.settingsSchool].classes.join("\n");
  const base = parseClassKey(ui.partnershipBase);
  const baseSchool = state.schools[base.schoolId];

  app.innerHTML = `
    <div class="view-head">
      <div>
        <h1 class="view-title">${t("settingsTitle")}</h1>
        <p class="view-lede">${t("settingsLead")}</p>
      </div>
      <span class="status-pill">${syncStatusText()}</span>
    </div>

    <div class="settings-grid">
      <section class="surface panel-pad">
        <h2 class="section-title">${t("classLists")}</h2>
        <div class="field-stack">
          <div class="field">
            <label for="settings-school">${t("school")}</label>
            <select id="settings-school" class="select" data-action="set-settings-school">
              ${schoolOptions(ui.settingsSchool)}
            </select>
          </div>
          <div class="field">
            <label for="class-list">${t("oneClassPerLine")}</label>
            <textarea id="class-list" class="textarea" data-role="class-list">${escapeHtml(classList)}</textarea>
          </div>
          <div class="button-row">
            <button type="button" class="btn primary" data-action="save-class-list">${t("saveList")}</button>
            <button type="button" class="btn" data-action="reset-data">${t("resetExamples")}</button>
          </div>
        </div>
      </section>

      <section class="surface panel-pad">
        <h2 class="section-title">${t("partnerships")}</h2>
        <div class="field-stack">
          <div class="field">
            <label for="partnership-base">${t("classToLink")}</label>
            <select id="partnership-base" class="select" data-action="set-partnership-base">
              ${classOptions(ui.partnershipBase)}
            </select>
          </div>
          <p class="field-hint">
            ${escapeHtml(base.className)} ${t("belongsTo")} ${escapeHtml(baseSchool ? schoolName(baseSchool) : "")}. ${t("checkPartners")}
          </p>
          <div class="checkbox-group">
            ${renderPartnershipCheckboxes(ui.partnershipBase)}
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderPartnershipCheckboxes(baseKey) {
  if (!baseKey) return "";
  const base = parseClassKey(baseKey);
  return SCHOOL_ORDER
    .filter((schoolId) => schoolId !== base.schoolId)
    .map((schoolId) => {
      const school = state.schools[schoolId];
      return `
        <div class="partner-group">
          <h3><span class="school-tag" style="--school-color:${school.color}">${escapeHtml(schoolName(school))}</span></h3>
          ${school.classes.map((className) => {
        const key = classKey(schoolId, className);
        const checked = hasPartnership(baseKey, key);
        return `
              <label class="check-row">
                <input type="checkbox" ${checked ? "checked" : ""} data-action="toggle-partnership" data-base="${escapeAttr(baseKey)}" data-partner="${escapeAttr(key)}">
                <span>${escapeHtml(className)}</span>
              </label>
            `;
      }).join("")}
        </div>
      `;
    })
    .join("");
}

function handleClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;

  const action = target.dataset.action;

  if (action === "go-view") {
    event.preventDefault();
    ui.view = target.dataset.view;
    render();
    app.focus({ preventScroll: true });
    return;
  }

  if (action === "set-language") {
    ui.lang = target.dataset.lang === "de" ? "de" : "fr";
    localStorage.setItem("bbcal-lang", ui.lang);
    render();
    return;
  }

  if (action === "toggle-compare-partner") {
    const key = target.dataset.key;
    if (ui.comparePartners.includes(key)) {
      ui.comparePartners = ui.comparePartners.filter((item) => item !== key);
    } else {
      ui.comparePartners = [...ui.comparePartners, key];
    }
    render();
    return;
  }

  if (action === "toggle-availability") {
    toggleAvailability(target.dataset.key, target.dataset.day, Number(target.dataset.index));
    saveState();
    render();
    return;
  }

  if (action === "select-day" || action === "clear-day") {
    setDayAvailability(target.dataset.key, target.dataset.day, action === "select-day");
    saveState();
    render();
    return;
  }

  if (action === "select-all-week" || action === "clear-all-week") {
    setWeekAvailability(target.dataset.key, action === "select-all-week");
    saveState();
    render();
    return;
  }

  if (action === "add-period") {
    addPeriod(target.dataset.school, target.dataset.day);
    saveState();
    render();
    return;
  }

  if (action === "remove-period") {
    removePeriod(target.dataset.school, target.dataset.day, Number(target.dataset.index));
    saveState();
    render();
    return;
  }

  if (action === "copy-day-schedule") {
    copyDaySchedule(target.dataset.school, target.dataset.day);
    saveState();
    render();
    showToast(t("scheduleCopied"));
    return;
  }

  if (action === "save-class-list") {
    saveClassList();
    return;
  }

  if (action === "reset-data") {
    const confirmed = window.confirm(t("resetConfirm"));
    if (!confirmed) return;
    state = createDefaultState();
    ui.compareBase = classKey("bercher", "9VG1");
    ui.comparePartners = [];
    ui.availabilitySchool = "bercher";
    ui.availabilityClass = classKey("bercher", "9VG1");
    ui.scheduleSchool = "bercher";
    ui.settingsSchool = "bercher";
    ui.partnershipBase = classKey("bercher", "9VG1");
    saveState();
    render();
    showToast(t("examplesRestored"));
  }
}

function handleChange(event) {
  const target = event.target;
  const action = target.dataset.action;
  if (!action) return;

  if (action === "set-compare-base") {
    ui.compareBase = target.value;
    ui.comparePartners = [];
    render();
    return;
  }

  if (action === "set-availability-school") {
    ui.availabilitySchool = target.value;
    ui.availabilityClass = schoolClassKeys(ui.availabilitySchool)[0] || "";
    render();
    return;
  }

  if (action === "set-availability-class") {
    ui.availabilityClass = target.value;
    render();
    return;
  }

  if (action === "set-schedule-school") {
    ui.scheduleSchool = target.value;
    render();
    return;
  }

  if (action === "set-settings-school") {
    ui.settingsSchool = target.value;
    render();
    return;
  }

  if (action === "set-partnership-base") {
    ui.partnershipBase = target.value;
    render();
    return;
  }

  if (action === "toggle-partnership") {
    setPartnership(target.dataset.base, target.dataset.partner, target.checked);
    saveState();
    render();
    return;
  }
}

function handleInput(event) {
  const target = event.target;
  if (target.dataset.action !== "update-period-time") return;

  const school = state.schools[target.dataset.school];
  const periods = school?.schedule?.[target.dataset.day];
  const index = Number(target.dataset.index);
  if (!periods || !periods[index]) return;

  periods[index][target.dataset.field] = target.value;
  saveState();
  target.closest("tr")?.classList.toggle("is-invalid", isInvalidPeriod(periods[index]));
}

function saveClassList() {
  const textarea = document.querySelector("[data-role='class-list']");
  const nextClasses = cleanClassList((textarea?.value || "").split(/\n/));
  if (!nextClasses.length) {
    showToast(t("addOneClass"));
    return;
  }

  state.schools[ui.settingsSchool].classes = nextClasses;
  cleanupAfterClassListChange();
  saveState();
  render();
  showToast(t("classListSaved"));
}

function cleanupAfterClassListChange() {
  const knownKeys = new Set(getAllClassKeys(state));
  Object.keys(state.availability).forEach((key) => {
    if (!knownKeys.has(key)) delete state.availability[key];
  });
  state.partnershipLinks = state.partnershipLinks.filter((link) => {
    const [a, b] = link.split("|");
    return knownKeys.has(a) && knownKeys.has(b);
  });
  ensureSelections();
}

function toggleAvailability(key, dayId, index) {
  ensureAvailability(key);
  const selected = new Set(state.availability[key][dayId] || []);
  if (selected.has(index)) selected.delete(index);
  else selected.add(index);
  state.availability[key][dayId] = [...selected].sort((a, b) => a - b);
}

function setDayAvailability(key, dayId, available) {
  ensureAvailability(key);
  const schoolId = parseClassKey(key).schoolId;
  const periods = state.schools[schoolId]?.schedule?.[dayId] || [];
  state.availability[key][dayId] = available ? periods.map((_, index) => index) : [];
}

function setWeekAvailability(key, available) {
  DAYS.forEach((day) => setDayAvailability(key, day.id, available));
}

function ensureAvailability(key) {
  if (!state.availability[key]) state.availability[key] = {};
  DAYS.forEach((day) => {
    if (!Array.isArray(state.availability[key][day.id])) state.availability[key][day.id] = [];
  });
}

function addPeriod(schoolId, dayId) {
  const periods = state.schools[schoolId].schedule[dayId];
  const previous = periods[periods.length - 1];
  if (!previous || parseTime(previous.end) === null) {
    periods.push({ start: "08:00", end: "08:45" });
    return;
  }

  const start = parseTime(previous.end) + 5;
  const end = start + 45;
  periods.push({ start: formatMinutes(start), end: formatMinutes(end) });
}

function removePeriod(schoolId, dayId, index) {
  state.schools[schoolId].schedule[dayId].splice(index, 1);
  const schoolKeys = schoolClassKeys(schoolId);
  schoolKeys.forEach((key) => {
    ensureAvailability(key);
    state.availability[key][dayId] = state.availability[key][dayId]
      .filter((periodIndex) => periodIndex !== index)
      .map((periodIndex) => periodIndex > index ? periodIndex - 1 : periodIndex);
  });
}

function copyDaySchedule(schoolId, sourceDayId) {
  const source = clonePeriods(state.schools[schoolId].schedule[sourceDayId] || []);
  DAYS.forEach((day) => {
    state.schools[schoolId].schedule[day.id] = clonePeriods(source);
  });
}

function isInvalidPeriod(period) {
  const start = parseTime(period.start);
  const end = parseTime(period.end);
  return start !== null && end !== null && end <= start;
}

function classOptions(selectedKey) {
  return SCHOOL_ORDER.map((schoolId) => {
    const school = state.schools[schoolId];
    const options = school.classes.map((className) => {
      const key = classKey(schoolId, className);
      return `<option value="${escapeAttr(key)}" ${key === selectedKey ? "selected" : ""}>${escapeHtml(className)}</option>`;
    }).join("");
    return `<optgroup label="${escapeAttr(schoolName(school))}">${options}</optgroup>`;
  }).join("");
}

function schoolOptions(selectedSchool) {
  return SCHOOL_ORDER.map((schoolId) => {
    const school = state.schools[schoolId];
    return `<option value="${schoolId}" ${schoolId === selectedSchool ? "selected" : ""}>${escapeHtml(schoolName(school))}</option>`;
  }).join("");
}

function schoolClassOptions(schoolId, selectedKey) {
  const school = state.schools[schoolId];
  return school.classes.map((className) => {
    const key = classKey(schoolId, className);
    return `<option value="${escapeAttr(key)}" ${key === selectedKey ? "selected" : ""}>${escapeHtml(className)}</option>`;
  }).join("");
}

function schoolClassKeys(schoolId) {
  const school = state.schools[schoolId];
  return school ? school.classes.map((className) => classKey(schoolId, className)) : [];
}

function getAllClassKeys(sourceState) {
  return SCHOOL_ORDER.flatMap((schoolId) => {
    const classes = sourceState.schools[schoolId]?.classes || [];
    return classes.map((className) => classKey(schoolId, className));
  });
}

function countAvailablePeriods(key) {
  ensureAvailability(key);
  return DAYS.reduce((total, day) => total + (state.availability[key][day.id] || []).length, 0);
}

function computeCommonSlots(classKeys) {
  return DAYS.flatMap((day) => {
    return getCommonIntervals(classKeys, day.id).map((interval) => ({ ...interval, day }));
  });
}

function getCommonIntervals(classKeys, dayId) {
  if (!classKeys.length) return [];
  const intervalSets = classKeys.map((key) => getAvailableIntervals(key, dayId));
  if (intervalSets.some((intervals) => intervals.length === 0)) return [];

  return intervalSets.slice(1).reduce((common, intervals) => {
    return intersectIntervalSets(common, intervals);
  }, intervalSets[0]);
}

function getAvailableIntervals(key, dayId) {
  return normalizeIntervals(getAvailableBlocks(key, dayId).map((block) => ({
    start: block.start,
    end: block.end
  })));
}

function getAvailableBlocks(key, dayId) {
  ensureAvailability(key);
  const parsed = parseClassKey(key);
  const periods = state.schools[parsed.schoolId]?.schedule?.[dayId] || [];
  const selected = new Set(state.availability[key]?.[dayId] || []);

  return periods
    .map((period, index) => {
      const start = parseTime(period.start);
      const end = parseTime(period.end);
      if (!selected.has(index) || start === null || end === null || end <= start) return null;
      return { start, end, index };
    })
    .filter(Boolean);
}

function intersectIntervalSets(first, second) {
  const intersections = [];
  first.forEach((a) => {
    second.forEach((b) => {
      const start = Math.max(a.start, b.start);
      const end = Math.min(a.end, b.end);
      if (end > start) intersections.push({ start, end });
    });
  });
  return normalizeIntervals(intersections);
}

function normalizeIntervals(intervals) {
  const sorted = intervals
    .filter((interval) => Number.isFinite(interval.start) && Number.isFinite(interval.end) && interval.end > interval.start)
    .sort((a, b) => a.start - b.start || a.end - b.end);

  const merged = [];
  sorted.forEach((interval) => {
    const previous = merged[merged.length - 1];
    if (!previous || interval.start > previous.end) {
      merged.push({ ...interval });
    } else {
      previous.end = Math.max(previous.end, interval.end);
    }
  });
  return merged;
}

function getTimelineRange(classKeys, dayId, common) {
  const intervals = [];
  classKeys.forEach((key) => {
    const parsed = parseClassKey(key);
    const periods = state.schools[parsed.schoolId]?.schedule?.[dayId] || [];
    periods.forEach((period) => {
      const start = parseTime(period.start);
      const end = parseTime(period.end);
      if (start !== null && end !== null && end > start) intervals.push({ start, end });
    });
  });
  intervals.push(...common);

  if (!intervals.length) return { start: 8 * 60, end: 17 * 60 };

  const rawStart = Math.min(...intervals.map((interval) => interval.start));
  const rawEnd = Math.max(...intervals.map((interval) => interval.end));
  return {
    start: Math.floor(rawStart / 30) * 30,
    end: Math.ceil(rawEnd / 30) * 30
  };
}

function createScaleMarks(start, end) {
  const marks = [];
  const firstHour = Math.ceil(start / 60) * 60;
  for (let minute = firstHour; minute <= end; minute += 60) {
    marks.push({
      minute,
      left: ((minute - start) / Math.max(1, end - start)) * 100
    });
  }
  return marks;
}

function parseTime(value) {
  if (typeof value !== "string" || !/^\d{2}:\d{2}$/.test(value)) return null;
  const [hours, minutes] = value.split(":").map(Number);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

function formatMinutes(totalMinutes) {
  const minutesInDay = 24 * 60;
  const normalized = ((Math.round(totalMinutes) % minutesInDay) + minutesInDay) % minutesInDay;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function getPartnerKeys(key) {
  return state.partnershipLinks
    .map((link) => link.split("|"))
    .filter(([a, b]) => a === key || b === key)
    .map(([a, b]) => a === key ? b : a)
    .filter((partnerKey) => getAllClassKeys(state).includes(partnerKey));
}

function hasPartnership(a, b) {
  return state.partnershipLinks.includes(linkId(a, b));
}

function setPartnership(a, b, enabled) {
  const id = linkId(a, b);
  const links = new Set(state.partnershipLinks);
  if (enabled) links.add(id);
  else links.delete(id);
  state.partnershipLinks = [...links];
}

function linkId(a, b) {
  return [a, b].sort().join("|");
}

function classKey(schoolId, className) {
  return `${schoolId}::${className}`;
}

function parseClassKey(key) {
  const parts = String(key || "").split("::");
  const schoolId = parts.shift() || "";
  return { schoolId, className: parts.join("::") };
}

function cleanClassList(items) {
  const seen = new Set();
  return items
    .map((item) => String(item).trim())
    .filter(Boolean)
    .filter((item) => {
      const normalized = item.toLowerCase();
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
}

function clonePeriods(periods) {
  return periods.map((period) => ({ ...period }));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}
