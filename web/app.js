const spotlight = {
  name: "Ardena",
  tagline: "car rental marketplace",
  categoryLabel: "Project of the Month",
  monthLabel: "March 2026",
  description:
    "Ardena connects car owners and renters in one trusted marketplace with clear pricing and fast booking.",
};

const feedProjects = [
  {
    name: "Ardena",
    tagline: "car rental marketplace",
    badge: "Project Spotlight",
    description:
      "Ardena connects car owners and renters in one trusted marketplace with clear pricing and fast booking.",
    images: [
      "./asstes/ardena.jpg",
      "./asstes/ardena1.jpg",
      "./asstes/ardena2.jpg",
    ],
  },
  {
    name: "PayOrbit",
    tagline: "borderless business payments",
    badge: "Community Pick",
    description:
      "PayOrbit helps small teams receive and send payments faster across East Africa with transparent fees.",
    images: Array(4).fill("./asstes/logo.png"),
  },
];

const SPLASH_DURATION_MS = 2600;
const INTRO_STEP_1_MS = 1700;
const INTRO_STEP_2_MS = 800;
const INTRO_STEP_3_MS = 2200;

function pad2(n) {
  return String(n).padStart(2, "0");
}

// Next spotlight = first day of next month at 00:00 local time.
function getNextSpotlightDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
}

function updateCountdown() {
  const next = getNextSpotlightDate();
  const now = new Date();
  const diffMs = next.getTime() - now.getTime();

  const note = document.getElementById("nextSpotlightNote");
  if (!note) return;

  if (diffMs <= 0) {
    note.textContent = "Starting now.";
    document.getElementById("cdDays").textContent = "00";
    document.getElementById("cdHours").textContent = "00";
    document.getElementById("cdMinutes").textContent = "00";
    document.getElementById("cdSeconds").textContent = "00";
    return;
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  document.getElementById("cdDays").textContent = pad2(days);
  document.getElementById("cdHours").textContent = pad2(hours);
  document.getElementById("cdMinutes").textContent = pad2(minutes);
  document.getElementById("cdSeconds").textContent = pad2(seconds);

  note.textContent = `Next spotlight: ${next.toLocaleDateString()}.`;
}

function wireSpotlightContent() {
  const monthLabel = document.getElementById("introMonthLabel");
  const projectNameSplash = document.getElementById("projectNameSplash");

  if (monthLabel) monthLabel.textContent = spotlight.monthLabel;
  if (projectNameSplash) projectNameSplash.textContent = spotlight.name;
}

function renderProjectFeed() {
  const feed = document.getElementById("projectFeed");
  if (!feed) return;

  feed.innerHTML = feedProjects
    .map((project) => {
      const slides = project.images
        .slice(0, 5)
        .map(
          (image, index) =>
            `<div class="project-slide-frame" style="--slide-bg: url('${image}')">
              <img class="project-slide" src="${image}" alt="${project.name} image ${index + 1}" loading="lazy" />
            </div>`
        )
        .join("");
      const dots = project.images
        .slice(0, 5)
        .map(
          (_, index) =>
            `<button class="carousel-dot ${index === 0 ? "is-active" : ""}" data-dot-index="${index}" type="button" aria-label="Go to image ${index + 1}"></button>`
        )
        .join("");

      return `
        <article class="feed-project" aria-label="${project.name}">
          <header class="feed-header">
            <div>
              <h2 class="feed-title">${project.name}</h2>
              <p class="feed-subtitle">${project.tagline}</p>
            </div>
            <span class="feed-badge">${project.badge}</span>
          </header>

          <div class="feed-body">
            <div class="project-carousel" data-carousel aria-label="${project.name} image carousel">
              ${slides}
            </div>
            <aside class="project-actions" aria-label="${project.name} actions">
              <button class="project-action-btn" type="button" aria-label="Like">
                <i class="fa-regular fa-heart" aria-hidden="true"></i>
              </button>
              <button class="project-action-btn" type="button" aria-label="Upvote">
                <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
              </button>
              <button class="project-action-btn" type="button" aria-label="Share">
                <i class="fa-solid fa-share-nodes" aria-hidden="true"></i>
              </button>
              <button class="project-action-btn action-donate" type="button" aria-label="Donate">
                <i class="fa-solid fa-hand-holding-heart" aria-hidden="true"></i>
              </button>
            </aside>
          </div>
          <div class="carousel-dots" data-dots>${dots}</div>

          <p class="feed-description">${project.description}</p>
        </article>
      `;
    })
    .join("");
}

function setupCarouselDots() {
  const feed = document.getElementById("projectFeed");
  if (!feed) return;

  const cards = feed.querySelectorAll(".feed-project");
  cards.forEach((card) => {
    const carousel = card.querySelector("[data-carousel]");
    const dots = Array.from(card.querySelectorAll(".carousel-dot"));
    if (!carousel || dots.length === 0) return;

    function setActiveDot(index) {
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    }

    carousel.addEventListener("scroll", () => {
      const slideWidth = carousel.clientWidth || 1;
      const idx = Math.round(carousel.scrollLeft / slideWidth);
      setActiveDot(Math.max(0, Math.min(idx, dots.length - 1)));
    });

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        carousel.scrollTo({ left: carousel.clientWidth * i, behavior: "smooth" });
      });
    });
  });
}

function showProjectSplashStep(stepIndex) {
  const projectSplash = document.getElementById("projectSplash");
  if (!projectSplash) return;

  const screens = Array.from(projectSplash.querySelectorAll(".intro-screen"));
  screens.forEach((screen, i) => {
    screen.classList.toggle("is-active", i === stepIndex);
  });

  const confettiOverlay = document.getElementById("confettiOverlay");
  if (confettiOverlay) {
    confettiOverlay.classList.toggle("is-active", stepIndex === 4);
    if (stepIndex !== 4) confettiOverlay.classList.remove("is-burst");
  }
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function typeText(target, text, speedMs = 40) {
  if (!target) return Promise.resolve();
  target.textContent = "";

  return new Promise((resolve) => {
    let i = 0;
    const timer = window.setInterval(() => {
      target.textContent += text.charAt(i);
      i += 1;
      if (i >= text.length) {
        window.clearInterval(timer);
        resolve();
      }
    }, speedMs);
  });
}

function accentWord(target, word) {
  if (!target || !word || !target.textContent) return;
  const text = target.textContent;
  const idx = text.toLowerCase().indexOf(word.toLowerCase());
  if (idx < 0) return;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + word.length);
  const after = text.slice(idx + word.length);
  target.innerHTML = `${before}<span class="intro-accent">${match}</span>${after}`;
}

function playCountVideo(videoElement) {
  if (!videoElement) return Promise.resolve();

  return new Promise((resolve) => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      videoElement.removeEventListener("ended", finish);
      videoElement.removeEventListener("error", finish);
      resolve();
    };

    videoElement.currentTime = 0;
    videoElement.addEventListener("ended", finish);
    videoElement.addEventListener("error", finish);

    const playPromise = videoElement.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => finish());
    }

    // Fallback so intro does not hang if metadata is missing.
    const fallbackMs = Number.isFinite(videoElement.duration) && videoElement.duration > 0
      ? Math.ceil(videoElement.duration * 1000) + 400
      : 2800;
    window.setTimeout(finish, fallbackMs);
  });
}

async function runProjectSplashSequence() {
  const projectSplash = document.getElementById("projectSplash");
  const siteContent = document.getElementById("siteContent");
  if (!projectSplash || !siteContent) return;

  projectSplash.classList.add("is-active");
  projectSplash.setAttribute("aria-hidden", "false");

  const buildersLine1 = document.getElementById("buildersLine1");
  const buildersLine2 = document.getElementById("buildersLine2");
  const leadinLine1 = document.getElementById("leadinLine1");
  const projectCountVideoWrap = document.getElementById("projectCountVideoWrap");
  const projectCountVideo = document.getElementById("projectCountVideo");
  const projectNameSplash = document.getElementById("projectNameSplash");
  const confettiOverlay = document.getElementById("confettiOverlay");

  showProjectSplashStep(0);
  await wait(INTRO_STEP_1_MS);

  showProjectSplashStep(1);

  // Typed statement: one line at a time.
  const line1Text = "A team of dedicated builders";
  const line2Text = "have been working hard.";
  const line3Text = "Now meet this month's spotlight project.";

  if (buildersLine1) buildersLine1.classList.add("is-typing");
  if (buildersLine2) buildersLine2.classList.remove("is-typing");
  if (leadinLine1) leadinLine1.classList.remove("is-typing");

  await typeText(buildersLine1, line1Text, 42);
  if (buildersLine1) buildersLine1.classList.remove("is-typing");
  accentWord(buildersLine1, "dedicated");
  await wait(INTRO_STEP_2_MS);

  showProjectSplashStep(2);
  if (buildersLine2) buildersLine2.classList.add("is-typing");
  await typeText(buildersLine2, line2Text, 42);
  if (buildersLine2) buildersLine2.classList.remove("is-typing");
  accentWord(buildersLine2, "working hard");
  await wait(INTRO_STEP_2_MS);

  showProjectSplashStep(3);
  if (leadinLine1) leadinLine1.classList.add("is-typing");
  await typeText(leadinLine1, line3Text, 36);
  if (leadinLine1) leadinLine1.classList.remove("is-typing");
  accentWord(leadinLine1, "spotlight project");
  await wait(500);

  showProjectSplashStep(4);

  if (projectNameSplash) projectNameSplash.classList.remove("is-visible");
  if (projectCountVideoWrap) projectCountVideoWrap.classList.add("is-active");
  await playCountVideo(projectCountVideo);
  if (projectCountVideoWrap) projectCountVideoWrap.classList.remove("is-active");
  if (projectNameSplash) projectNameSplash.classList.add("is-visible");
  if (confettiOverlay) confettiOverlay.classList.add("is-burst");

  await wait(INTRO_STEP_3_MS);

    projectSplash.classList.remove("is-active");
    projectSplash.setAttribute("aria-hidden", "true");

    siteContent.classList.add("is-ready");
    siteContent.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "auto";

}

function runSplashScreen() {
  const splash = document.getElementById("splashScreen");
  const siteContent = document.getElementById("siteContent");
  const projectSplash = document.getElementById("projectSplash");
  if (!splash || !siteContent || !projectSplash) return;

  document.body.style.overflow = "hidden";

  window.setTimeout(() => {
    splash.classList.add("is-hidden");
    runProjectSplashSequence();
  }, SPLASH_DURATION_MS);
}

function wireMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const closeBtn = document.getElementById("menuCloseBtn");
  const menu = document.getElementById("mobileMenu");
  const backdrop = document.getElementById("menuBackdrop");
  if (!toggle || !menu || !backdrop) return;

  const links = menu.querySelectorAll("a");

  function openMenu() {
    toggle.classList.add("is-open");
    menu.classList.add("is-open");
    backdrop.classList.add("is-open");
    document.body.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  }

  function closeMenu() {
    toggle.classList.remove("is-open");
    menu.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  // Ensure menu is always hidden on first paint.
  closeMenu();

  toggle.addEventListener("click", () => {
    if (menu.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  backdrop.addEventListener("click", closeMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  links.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

function init() {
  runSplashScreen();
  wireMobileMenu();
  wireSpotlightContent();
  renderProjectFeed();
  setupCarouselDots();
  const hasCountdown = Boolean(document.getElementById("cdDays"));
  if (hasCountdown) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
}

// Load after DOM is ready.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

