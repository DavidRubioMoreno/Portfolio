const cvPreviewButton = document.querySelector("#open-cv-preview");
const cvPath = "assets/information/cv/David_Rubio_cv.pdf";

if (cvPreviewButton) {
  const cvModal = document.createElement("div");
  cvModal.className = "project-modal";
  cvModal.setAttribute("aria-hidden", "true");
  cvModal.innerHTML = `
    <div class="project-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="cv-modal-title">
      <div class="project-modal-header">
        <h2 id="cv-modal-title">CV - David Rubio</h2>
        <button class="project-modal-close" type="button" aria-label="Cerrar CV">x</button>
      </div>
      <embed class="cv-preview-frame" src="${cvPath}" type="application/pdf" title="CV de David Rubio">
    </div>
  `;
  document.body.appendChild(cvModal);

  const cvCloseButton = cvModal.querySelector(".project-modal-close");
  const cvFrame = cvModal.querySelector(".cv-preview-frame");

  function openCvPreview() {
    cvFrame.src = cvPath;
    cvModal.classList.add("open");
    cvModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    cvCloseButton.focus();
  }

  function closeCvPreview() {
    cvModal.classList.remove("open");
    cvModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  cvPreviewButton.addEventListener("click", openCvPreview);
  cvCloseButton.addEventListener("click", closeCvPreview);
  cvModal.addEventListener("click", (event) => {
    if (event.target === cvModal) closeCvPreview();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && cvModal.classList.contains("open")) {
      closeCvPreview();
    }
  });
}
