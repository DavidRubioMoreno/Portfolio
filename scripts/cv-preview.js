const cvPreviewButton = document.querySelector("#open-cv-preview");
const cvPath = "assets/information/cv/David_Rubio_cv.pdf";

if (cvPreviewButton) {
  const cvModal = document.createElement("div");
  cvModal.className = "project-modal";
  cvModal.setAttribute("aria-hidden", "true");
  cvModal.innerHTML = `
    <div class="project-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="cv-modal-title">
      <div class="project-modal-header">
        <h2 id="cv-modal-title">CV · David Rubio Moreno</h2>
        <button class="project-modal-close" type="button" data-i18n-aria-label="modal.close" aria-label="${t('modal.close')}">×</button>
      </div>
      <div class="cv-preview-content"></div>
      <div class="cv-preview-fallback">
        <p data-i18n="cv.fallback">${t('cv.fallback')}</p>
        <a class="button secondary" href="${cvPath}" target="_blank" rel="noopener noreferrer" data-i18n="cv.open">${t('cv.open')}</a>
      </div>
    </div>
  `;
  document.body.appendChild(cvModal);
  const content = cvModal.querySelector('.cv-preview-content');
  const cvDialog = setupPortfolioDialog(cvModal, () => { content.innerHTML = ''; });
  cvPreviewButton.setAttribute('aria-haspopup', 'dialog');
  cvPreviewButton.addEventListener('click', () => {
    const embed = document.createElement('embed');
    embed.className = 'cv-preview-frame';
    embed.src = cvPath;
    embed.type = 'application/pdf';
    embed.title = 'CV · David Rubio Moreno';
    content.replaceChildren(embed);
    cvDialog.open();
  });
}
