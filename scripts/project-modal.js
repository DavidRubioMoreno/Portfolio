const projectDetails = {
  "Endless Redemption": {
    youtube: "https://www.youtube.com/embed/7dzWf-mmL_Q",
    links: [{ label: "Ver Trailer", href: "https://www.youtube.com/watch?v=7dzWf-mmL_Q" }],
  },
  "Cosmic Architect": {
    youtube: "https://www.youtube.com/embed/V4cdZshBp44",
    links: [{ label: "Ver Trailer", href: "https://www.youtube.com/watch?v=V4cdZshBp44" }],
  },
  "String Typing": {
    youtube: "https://www.youtube.com/embed/ZQGxKZZEphE",
    links: [{ label: "Ver Trailer", href: "https://www.youtube.com/watch?v=ZQGxKZZEphE" }],
  },
};

const modal = document.createElement("div");
modal.className = "project-modal";
modal.setAttribute("aria-hidden", "true");
modal.innerHTML = `
  <div class="project-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
    <div class="project-modal-header">
      <h2 id="project-modal-title"></h2>
      <button class="project-modal-close" type="button" data-i18n-aria-label="modal.close" aria-label="${t('modal.close')}">×</button>
    </div>
    <div class="project-modal-content">
      <div class="project-modal-visual">
        <div class="project-modal-media"></div>
        <button class="project-action project-video-alternative" type="button" hidden data-i18n="modal.localVideo">${t('modal.localVideo')}</button>
      </div>
      <div class="project-modal-info">
        <p class="project-modal-description"></p>
        <div class="project-modal-contributions">
          <h4 data-i18n="modal.contributions">${t('modal.contributions')}</h4>
          <p class="project-modal-contributions-text"></p>
        </div>
        <div class="project-modal-links"></div>
      </div>
    </div>
  </div>
`;
document.body.appendChild(modal);

const modalTitle = modal.querySelector("#project-modal-title");
const modalMedia = modal.querySelector(".project-modal-media");
const modalDescription = modal.querySelector(".project-modal-description");
const modalContributions = modal.querySelector(".project-modal-contributions-text");
const modalLinks = modal.querySelector(".project-modal-links");
const localVideoButton = modal.querySelector(".project-video-alternative");
const projectDialog = setupPortfolioDialog(modal, () => {
  modalMedia.innerHTML = "";
  localVideoButton.hidden = true;
  localVideoButton.onclick = null;
});

function createLink(label, href) {
  const link = document.createElement("a");
  link.href = href;
  link.textContent = label;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
}

function getProjectLinks(card, title) {
  const links = Array.from(card.querySelectorAll(".project-link")).map((link) => ({
    label: link.textContent,
    href: link.href,
  }));

  const extraLinks = projectDetails[title] ? projectDetails[title].links : [];
  return links.concat(extraLinks.map(link => ({ ...link, label: t("modal.trailer") })).filter((extra) => !links.some((link) => link.href === extra.href)));
}

function renderProjectMedia(card, title) {
  modalMedia.innerHTML = "";
  localVideoButton.hidden = true;
  localVideoButton.onclick = null;
  const details = projectDetails[title];
  const localSource = card.querySelector(".project-video source");
  const placeholder = card.querySelector(".project-media-placeholder");

  function renderLocalVideo() {
    const video = document.createElement("video");
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.poster = card.querySelector(".project-video").poster;
    video.setAttribute("aria-label", title);
    video.tabIndex = 0;
    video.appendChild(localSource.cloneNode(true));
    modalMedia.replaceChildren(video);
    localVideoButton.hidden = true;
    return video;
  }

  // file:// pages cannot send an HTTP Referer: use the supplied demo there.
  const hasWebOrigin = location.protocol === "http:" || location.protocol === "https:";
  if (details && details.youtube && hasWebOrigin) {
    const iframe = document.createElement("iframe");
    const embedUrl = new URL(details.youtube);
    embedUrl.searchParams.set("rel", "0");
    embedUrl.searchParams.set("playsinline", "1");
    embedUrl.searchParams.set("origin", location.origin);
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.src = embedUrl.href;
    iframe.title = `${t("modal.trailer")}: ${title}`;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    modalMedia.appendChild(iframe);
    if (localSource) {
      // Privacy extensions can still block embeds; keep a working alternative.
      localVideoButton.hidden = false;
      localVideoButton.onclick = () => renderLocalVideo().focus();
    }
    return;
  }

  if (localSource) {
    renderLocalVideo();
    return;
  }

  if (placeholder) {
    const clone = placeholder.cloneNode(true);
    modalMedia.appendChild(clone);
  }
}

function openProjectModal(card) {
  const title = card.querySelector("h3").textContent;
  const description = card.dataset.description || card.querySelector("p").textContent;
  const contributions = card.dataset.contributions || "";

  modalTitle.textContent = title;
  modalDescription.textContent = description;
  modalContributions.textContent = contributions;
  modalLinks.innerHTML = "";
  getProjectLinks(card, title).forEach((link) => modalLinks.appendChild(createLink(link.label, link.href)));
  renderProjectMedia(card, title);

  projectDialog.open();
}

document.querySelectorAll(".project-card").forEach((card) => {
  const linksRow = card.querySelector(".project-links-row");
  if (!linksRow) return;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "project-action";
  button.dataset.i18n = "project.viewDetails";
  button.textContent = t("project.viewDetails");
  button.setAttribute("aria-haspopup", "dialog");
  button.addEventListener("click", () => openProjectModal(card));
  linksRow.appendChild(button);
});
