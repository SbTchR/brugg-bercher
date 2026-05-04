const STORAGE_KEYS = {
  teachers: "bruggBercherTeachers",
  news: "bruggBercherNews"
};

document.addEventListener("DOMContentLoaded", () => {
  initPartnerLists();
  initTeacherPage();
  initNewsPage();
  initHomeNews();
});

function initPartnerLists() {
  const selectClass = document.getElementById("select-class");
  const listesContainer = document.getElementById("listes-container");
  const btnExportPdf = document.getElementById("btn-export-pdf");
  const btnCopyList = document.getElementById("btn-copy-list");
  const listStatus = document.getElementById("list-status");

  if (!selectClass || !listesContainer) {
    return;
  }

  const state = {
    sections: []
  };

  fetch("listes.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Chargement impossible (${response.status})`);
      }
      return response.text();
    })
    .then((html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const sections = Array.from(doc.querySelectorAll(".class-section"));

      if (sections.length === 0) {
        throw new Error("Aucune classe trouvée dans listes.html");
      }

      listesContainer.innerHTML = "";
      sections.forEach((section) => {
        const className = getClassName(section);
        state.sections.push({ className, element: section });

        const option = document.createElement("option");
        option.value = className;
        option.textContent = className;
        selectClass.appendChild(option);

        listesContainer.appendChild(section);
      });

      updateStatus();
      updateTable("all");
    })
    .catch((error) => {
      listesContainer.innerHTML = `<div class="info-card"><h2>Listes indisponibles</h2><p>Le fichier listes.html n'a pas pu être chargé. Vous pouvez essayer de l'ouvrir directement avec le lien ci-dessous.</p></div>`;
      if (listStatus) {
        listStatus.textContent = error.message;
      }
    });

  selectClass.addEventListener("change", () => {
    updateTable(selectClass.value);
    updateStatus();
  });

  if (btnExportPdf) {
    btnExportPdf.addEventListener("click", exportVisibleTables);
  }

  if (btnCopyList) {
    btnCopyList.addEventListener("click", copyVisibleTables);
  }

  function getClassName(section) {
    const header = section.querySelector(".class-header");
    return (header ? header.textContent : "Classe sans nom")
      .replace("Classe/Groupe :", "")
      .trim();
  }

  function getVisibleSections() {
    return state.sections.filter(({ element }) => !element.classList.contains("is-hidden"));
  }

  function updateTable(selectedClass) {
    state.sections.forEach(({ className, element }) => {
      element.classList.toggle("is-hidden", selectedClass !== "all" && selectedClass !== className);
    });
  }

  function updateStatus() {
    if (!listStatus) {
      return;
    }

    const visibleSections = getVisibleSections();
    const totalRows = visibleSections.reduce((sum, { element }) => {
      return sum + element.querySelectorAll("tbody tr").length;
    }, 0);

    if (state.sections.length === 0) {
      listStatus.textContent = "Chargement des listes...";
      return;
    }

    listStatus.textContent = `${visibleSections.length} classe(s) affichée(s), ${totalRows} ligne(s) de partenaires.`;
  }

  function exportVisibleTables() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert("L'export PDF n'est pas encore disponible. Vérifiez la connexion internet et réessayez.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.text("Liste des partenaires", 14, 14);

    getVisibleSections().forEach(({ className, element }, index) => {
      const table = element.querySelector("table");
      if (!table) {
        return;
      }

      const startY = index === 0 ? 26 : pdf.lastAutoTable.finalY + 14;
      pdf.setFontSize(12);
      pdf.text(`Classe/Groupe : ${className}`, 14, startY);
      pdf.autoTable({
        html: table,
        startY: startY + 6,
        theme: "grid",
        headStyles: { fillColor: [15, 111, 120] }
      });
    });

    pdf.save("liste-partenaires.pdf");
  }

  function copyVisibleTables() {
    const textToCopy = getVisibleSections().map(({ className, element }) => {
      const rows = Array.from(element.querySelectorAll("tr")).map((row) => {
        return Array.from(row.querySelectorAll("th, td"))
          .map((cell) => cell.textContent.trim())
          .join("\t");
      });

      return [`Classe/Groupe : ${className}`, ...rows].join("\n");
    }).join("\n\n");

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        if (listStatus) {
          listStatus.textContent = "Liste copiée dans le presse-papiers.";
        }
      })
      .catch(() => {
        alert("La copie automatique n'a pas fonctionné dans ce navigateur.");
      });
  }
}

async function initTeacherPage() {
  const grid = document.getElementById("teacher-grid");
  const form = document.getElementById("teacher-form");

  if (!grid || !form) {
    return;
  }

  const publishedTeachers = await loadJson("data/enseignants.json", []);
  let teachers = cloneData(getStoredData(STORAGE_KEYS.teachers) || publishedTeachers);
  let selectedTeacherId = "";
  let photoRemoved = false;

  const fields = {
    editor: document.getElementById("teacher-editor"),
    id: document.getElementById("teacher-id"),
    select: document.getElementById("teacher-select"),
    school: document.getElementById("teacher-school"),
    name: document.getElementById("teacher-name"),
    email: document.getElementById("teacher-email"),
    description: document.getElementById("teacher-description"),
    photo: document.getElementById("teacher-photo"),
    status: document.getElementById("teacher-status"),
    editButton: document.getElementById("teacher-edit"),
    newEntryButton: document.getElementById("teacher-new-entry"),
    deleteButton: document.getElementById("teacher-delete"),
    cancelButton: document.getElementById("teacher-cancel"),
    clearPhoto: document.getElementById("teacher-clear-photo"),
    exportButton: document.getElementById("teacher-export"),
    resetButton: document.getElementById("teacher-reset")
  };

  renderTeacherOptions();
  renderTeachers();
  setEmptyTeacherForm();

  fields.select.addEventListener("change", () => {
    if (fields.select.value) {
      fillTeacherForm(fields.select.value);
    } else {
      setEmptyTeacherForm();
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let teacher = teachers.find((item) => item.id === selectedTeacherId);
    const isNewTeacher = !teacher;
    const nextId = selectedTeacherId || getUniqueId(makeSlug(fields.name.value), teachers);

    const nextPhoto = await getNextPhotoValue(fields.photo.files[0], teacher ? teacher.photo : "", photoRemoved);
    const nextTeacher = {
      id: nextId,
      name: fields.name.value.trim(),
      school: fields.school.value,
      email: fields.email.value.trim(),
      description: fields.description.value.trim(),
      photo: nextPhoto
    };

    if (isNewTeacher) {
      teachers.push(nextTeacher);
      teacher = nextTeacher;
    } else {
      Object.assign(teacher, nextTeacher);
    }

    saveStoredData(STORAGE_KEYS.teachers, teachers);
    fields.photo.value = "";
    photoRemoved = false;
    renderTeacherOptions();
    renderTeachers();
    fillTeacherForm(teacher.id);
    setStatus(fields.status, "Fiche enregistrée dans ce navigateur. La photo sera incluse dans l'export JSON.");
  });

  fields.editButton.addEventListener("click", () => {
    showPanel(fields.editor);
    fields.editor.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  fields.newEntryButton.addEventListener("click", () => {
    setEmptyTeacherForm();
    fields.name.focus();
  });

  fields.cancelButton.addEventListener("click", () => {
    hidePanel(fields.editor);
  });

  fields.clearPhoto.addEventListener("click", () => {
    photoRemoved = true;
    fields.photo.value = "";
    setStatus(fields.status, "La photo sera retirée lors de l'enregistrement.");
  });

  fields.deleteButton.addEventListener("click", () => {
    const teacher = teachers.find((item) => item.id === selectedTeacherId);
    if (!teacher) {
      setStatus(fields.status, "Choisissez d'abord une fiche existante à supprimer.");
      return;
    }
    if (!confirm(`Supprimer la fiche de ${teacher.name} ?`)) {
      return;
    }
    teachers = teachers.filter((item) => item.id !== teacher.id);
    saveStoredData(STORAGE_KEYS.teachers, teachers);
    renderTeacherOptions();
    renderTeachers();
    setEmptyTeacherForm();
    setStatus(fields.status, "Fiche supprimée dans ce navigateur. Exportez le JSON pour publier la suppression.");
  });

  fields.exportButton.addEventListener("click", () => {
    downloadJson("enseignants.json", teachers);
    setStatus(fields.status, "Fichier enseignants.json exporté.");
  });

  fields.resetButton.addEventListener("click", () => {
    if (!confirm("Revenir aux fiches publiées et oublier les modifications locales ?")) {
      return;
    }
    localStorage.removeItem(STORAGE_KEYS.teachers);
    teachers = cloneData(publishedTeachers);
    photoRemoved = false;
    renderTeacherOptions();
    renderTeachers();
    setEmptyTeacherForm();
    hidePanel(fields.editor);
    setStatus(fields.status, "Données publiées restaurées.");
  });

  function renderTeacherOptions() {
    fields.select.innerHTML = `<option value="">Choisir une fiche</option>`;
    teachers.forEach((teacher) => {
      const option = document.createElement("option");
      option.value = teacher.id;
      option.textContent = teacher.name;
      fields.select.appendChild(option);
    });
  }

  function renderTeachers() {
    grid.innerHTML = "";
    teachers.forEach((teacher) => {
      const article = document.createElement("article");
      article.className = "teacher-card";
      article.innerHTML = `
        <div class="teacher-photo" aria-hidden="true">${renderTeacherPhoto(teacher)}</div>
        <div>
          <p class="teacher-school">${escapeHtml(teacher.school)}</p>
          <h2>${escapeHtml(teacher.name)}</h2>
          <p>${escapeHtml(teacher.description || "Texte personnel à compléter.")}</p>
          <a href="mailto:${escapeAttribute(teacher.email)}">${escapeHtml(teacher.email)}</a>
        </div>
      `;
      grid.appendChild(article);
    });
  }

  function fillTeacherForm(id) {
    const teacher = teachers.find((item) => item.id === id);
    if (!teacher) {
      return;
    }

    selectedTeacherId = teacher.id;
    photoRemoved = false;
    fields.id.value = teacher.id;
    fields.select.value = teacher.id;
    fields.school.value = teacher.school;
    fields.name.value = teacher.name;
    fields.email.value = teacher.email;
    fields.description.value = teacher.description || "";
    fields.photo.value = "";
    fields.deleteButton.classList.remove("is-hidden");
    setStatus(fields.status, "");
  }

  function setEmptyTeacherForm() {
    selectedTeacherId = "";
    photoRemoved = false;
    fields.id.value = "";
    fields.select.value = "";
    fields.school.value = "Bercher";
    fields.name.value = "";
    fields.email.value = "";
    fields.description.value = "";
    fields.photo.value = "";
    fields.deleteButton.classList.add("is-hidden");
    setStatus(fields.status, "");
  }
}

async function initNewsPage() {
  const list = document.getElementById("news-list");
  const form = document.getElementById("news-form");

  if (!list || !form) {
    return;
  }

  const publishedNews = await loadJson("data/actualites.json", []);
  let newsItems = cloneData(getStoredData(STORAGE_KEYS.news) || publishedNews);

  const fields = {
    editor: document.getElementById("news-editor"),
    id: document.getElementById("news-id"),
    select: document.getElementById("news-select"),
    date: document.getElementById("news-date"),
    title: document.getElementById("news-title"),
    body: document.getElementById("news-body"),
    audience: document.getElementById("news-audience"),
    color: document.getElementById("news-color"),
    status: document.getElementById("news-status"),
    editButton: document.getElementById("news-edit"),
    newEntryButton: document.getElementById("news-new-entry"),
    deleteButton: document.getElementById("news-delete"),
    cancelButton: document.getElementById("news-cancel"),
    exportButton: document.getElementById("news-export"),
    resetButton: document.getElementById("news-reset")
  };

  setEmptyNewsForm();
  renderNewsOptions();
  renderNewsList();

  fields.select.addEventListener("change", () => {
    if (fields.select.value) {
      fillNewsForm(fields.select.value);
    } else {
      setEmptyNewsForm();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const id = fields.id.value || makeSlug(`${fields.title.value}-${fields.date.value}-${Date.now()}`);
    const existing = newsItems.find((item) => item.id === id);
    const body = sanitizeRichHtml(fields.body.innerHTML);
    if (!fields.body.textContent.trim()) {
      setStatus(fields.status, "Ajoutez un message avant d'enregistrer l'actualité.");
      return;
    }

    const nextItem = {
      id,
      date: fields.date.value,
      title: fields.title.value.trim(),
      body,
      audience: fields.audience.value.trim()
    };

    if (existing) {
      Object.assign(existing, nextItem);
    } else {
      newsItems.push(nextItem);
    }

    saveStoredData(STORAGE_KEYS.news, sortNews(newsItems));
    newsItems = sortNews(newsItems);
    fields.id.value = id;
    renderNewsOptions();
    renderNewsList();
    fillNewsForm(id);
    setStatus(fields.status, "Actualité enregistrée dans ce navigateur.");
  });

  fields.editButton.addEventListener("click", () => {
    showPanel(fields.editor);
    fields.editor.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  fields.newEntryButton.addEventListener("click", () => {
    setEmptyNewsForm();
    fields.title.focus();
  });

  fields.cancelButton.addEventListener("click", () => {
    hidePanel(fields.editor);
  });

  fields.deleteButton.addEventListener("click", () => {
    const item = newsItems.find((newsItem) => newsItem.id === fields.id.value);
    if (!item) {
      setStatus(fields.status, "Choisissez d'abord une actualité existante à modifier.");
      return;
    }
    if (!confirm(`Supprimer l'actualité "${item.title}" ?`)) {
      return;
    }
    newsItems = newsItems.filter((newsItem) => newsItem.id !== item.id);
    saveStoredData(STORAGE_KEYS.news, newsItems);
    setEmptyNewsForm();
    renderNewsOptions();
    renderNewsList();
    setStatus(fields.status, "Actualité supprimée dans ce navigateur. Exportez le JSON pour publier la suppression.");
  });

  document.querySelectorAll("[data-format]").forEach((button) => {
    button.addEventListener("click", () => {
      fields.body.focus();
      document.execCommand(button.dataset.format, false, null);
    });
  });

  fields.color.addEventListener("input", () => {
    fields.body.focus();
    document.execCommand("foreColor", false, fields.color.value);
  });

  fields.exportButton.addEventListener("click", () => {
    downloadJson("actualites.json", sortNews(newsItems));
    setStatus(fields.status, "Fichier actualites.json exporté.");
  });

  fields.resetButton.addEventListener("click", () => {
    if (!confirm("Revenir aux actualités publiées et oublier les modifications locales ?")) {
      return;
    }
    localStorage.removeItem(STORAGE_KEYS.news);
    newsItems = cloneData(publishedNews);
    setEmptyNewsForm();
    hidePanel(fields.editor);
    renderNewsOptions();
    renderNewsList();
    setStatus(fields.status, "Données publiées restaurées.");
  });

  function renderNewsOptions() {
    fields.select.innerHTML = `<option value="">Nouvelle actualité</option>`;
    sortNews(newsItems).forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${formatLongDate(item.date)} - ${item.title}`;
      fields.select.appendChild(option);
    });
  }

  function renderNewsList() {
    list.innerHTML = "";
    sortNews(newsItems).forEach((item) => {
      const article = document.createElement("article");
      article.className = "news-entry";
      article.innerHTML = `
        <div class="news-date">
          <span>${escapeHtml(formatDay(item.date))}</span>
          <small>${escapeHtml(formatMonthYear(item.date))}</small>
        </div>
        <div>
          <h2>${escapeHtml(item.title)}</h2>
          <p class="news-meta">Public cible: ${escapeHtml(item.audience || "Tous les collègues concernés")}</p>
          <div class="news-body">${sanitizeRichHtml(item.body)}</div>
        </div>
      `;
      list.appendChild(article);
    });
  }

  function fillNewsForm(id) {
    const item = newsItems.find((newsItem) => newsItem.id === id);
    if (!item) {
      return;
    }
    fields.id.value = item.id;
    fields.select.value = item.id;
    fields.date.value = item.date;
    fields.title.value = item.title;
    fields.body.innerHTML = sanitizeRichHtml(item.body);
    fields.audience.value = item.audience || "";
    fields.deleteButton.classList.remove("is-hidden");
    setStatus(fields.status, "");
  }

  function setEmptyNewsForm() {
    fields.id.value = "";
    fields.select.value = "";
    fields.date.value = new Date().toISOString().slice(0, 10);
    fields.title.value = "";
    fields.body.innerHTML = "";
    fields.audience.value = "Tous les collègues concernés";
    fields.deleteButton.classList.add("is-hidden");
    setStatus(fields.status, "");
  }
}

async function initHomeNews() {
  const container = document.getElementById("home-news-list");
  if (!container) {
    return;
  }

  const publishedNews = await loadJson("data/actualites.json", []);
  const newsItems = sortNews(getStoredData(STORAGE_KEYS.news) || publishedNews).slice(0, 2);
  container.innerHTML = "";

  newsItems.forEach((item) => {
    const article = document.createElement("article");
    article.className = "news-item";
    article.innerHTML = `
      <time datetime="${escapeAttribute(item.date)}">${escapeHtml(formatLongDate(item.date))}</time>
      <h3>${escapeHtml(item.title)}</h3>
      <div class="news-body">${sanitizeRichHtml(item.body)}</div>
    `;
    container.appendChild(article);
  });
}

async function loadJson(url, fallbackValue) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Impossible de charger ${url}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return fallbackValue;
  }
}

function getStoredData(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function saveStoredData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function getNextPhotoValue(file, currentPhoto, photoRemoved) {
  if (photoRemoved) {
    return "";
  }
  if (!file) {
    return currentPhoto || "";
  }
  return resizeImage(file, 720, 0.82);
}

function resizeImage(file, maxSize, quality) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      image.onerror = reject;
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function showPanel(panel) {
  if (panel) {
    panel.classList.remove("is-hidden");
  }
}

function hidePanel(panel) {
  if (panel) {
    panel.classList.add("is-hidden");
  }
}

function getUniqueId(baseId, items) {
  const fallback = baseId || `enseignant-${Date.now()}`;
  let id = fallback;
  let index = 2;
  while (items.some((item) => item.id === id)) {
    id = `${fallback}-${index}`;
    index += 1;
  }
  return id;
}

function sanitizeRichHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html || "";

  const allowedTags = new Set(["B","STRONG","I","EM","U","BR","P","DIV","SPAN","UL","OL","LI","A","IMG"]);
  const allowedAttrs = {
    "*": ["class","style"],
    "A": ["href","target","rel","class","style"],
    "IMG": ["src","alt","class","style"]
  };
  const allowedStyles = new Set(["color","background-color","font-weight","font-style","text-decoration","text-align","font-size"]);

  const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_ELEMENT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    if (!allowedTags.has(node.tagName)) {
      node.replaceWith(document.createTextNode(node.textContent || ""));
      return;
    }

    Array.from(node.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      const allowedForTag = (allowedAttrs[node.tagName] || []).map(s => s.toLowerCase()).concat((allowedAttrs["*"]||[]).map(s => s.toLowerCase()));
      if (!allowedForTag.includes(name)) {
        node.removeAttribute(attr.name);
        return;
      }

      if ((name === "href" || name === "src") && attr.value) {
        const v = attr.value.trim();
        if (!/^(https?:|mailto:|\/|data:)/i.test(v)) {
          node.removeAttribute(attr.name);
        }
      }

      if (name === "style") {
        const style = node.style;
        const kept = [];
        allowedStyles.forEach((prop) => {
          const val = style.getPropertyValue(prop);
          if (val) kept.push(`${prop}:${val}`);
        });
        if (kept.length) {
          node.setAttribute("style", kept.join(";"));
        } else {
          node.removeAttribute("style");
        }
      }
    });
  });

  return template.innerHTML.trim();
}

function renderTeacherPhoto(teacher) {
  if (teacher.photo) {
    return `<img src="${escapeAttribute(teacher.photo)}" alt="">`;
  }
  return escapeHtml(getInitials(teacher.name));
}

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function sortNews(items) {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

function makeSlug(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatLongDate(dateValue) {
  return new Intl.DateTimeFormat("fr-CH", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(parseDate(dateValue));
}

function formatDay(dateValue) {
  return new Intl.DateTimeFormat("fr-CH", { day: "2-digit" }).format(parseDate(dateValue));
}

function formatMonthYear(dateValue) {
  return new Intl.DateTimeFormat("fr-CH", {
    month: "long",
    year: "numeric"
  }).format(parseDate(dateValue));
}

function parseDate(dateValue) {
  return new Date(`${dateValue}T00:00:00`);
}

function setStatus(element, message) {
  if (element) {
    element.textContent = message;
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
