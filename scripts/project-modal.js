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
      <button class="project-modal-close" type="button" aria-label="Cerrar detalles">x</button>
    </div>
    <div class="project-modal-content">
      <div class="project-modal-media"></div>
      <div class="project-modal-info">
        <p class="project-modal-description"></p>
        <div class="project-modal-contributions">
          <h4>Contribuciones</h4>
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
const modalClose = modal.querySelector(".project-modal-close");

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
  return links.concat(extraLinks.filter((extra) => !links.some((link) => link.href === extra.href)));
}

function renderProjectMedia(card, title) {
  modalMedia.innerHTML = "";
  const details = projectDetails[title];
  const localSource = card.querySelector(".project-video source");
  const placeholder = card.querySelector(".project-media-placeholder");

  if (details && details.youtube) {
    const iframe = document.createElement("iframe");
    iframe.src = `${details.youtube}?rel=0`;
    iframe.title = `Trailer de ${title}`;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    modalMedia.appendChild(iframe);
    return;
  }

  if (localSource) {
    const video = document.createElement("video");
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.innerHTML = `<source src="${localSource.getAttribute("src")}" type="${localSource.getAttribute("type") || "video/mp4"}">`;
    modalMedia.appendChild(video);
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

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modalClose.focus();
}

function closeProjectModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  modalMedia.innerHTML = "";
}

document.querySelectorAll(".project-card").forEach((card) => {
  const linksRow = card.querySelector(".project-links-row");
  if (!linksRow) return;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "project-action";
  button.textContent = typeof t !== "undefined" ? t("project.viewDetails") : "Ver detalles";
  button.addEventListener("click", () => openProjectModal(card));
  linksRow.appendChild(button);
});

const animatedProjectCards = document.querySelectorAll(".project-card");

if ("IntersectionObserver" in window) {
  const projectCardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
  );

  animatedProjectCards.forEach((card) => projectCardObserver.observe(card));
} else {
  animatedProjectCards.forEach((card) => card.classList.add("is-visible"));
}

modalClose.addEventListener("click", closeProjectModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeProjectModal();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) {
    closeProjectModal();
  }
});
