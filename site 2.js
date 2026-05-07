document.addEventListener("DOMContentLoaded", () => {
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
});
