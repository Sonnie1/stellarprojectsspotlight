const spotlight = {
  name: "Ardena",
  tagline: "car rental marketplace",
  categoryLabel: "Project of the Month",
  monthLabel: "March 2026",
  details: [
    { key: "Category", value: "Mobility" },
    { key: "Region", value: "East Africa" },
    { key: "Focus", value: "Access and trust" },
  ],
};

const SPLASH_DURATION_MS = 2600;
const INTRO_STEP_1_MS = 1700;
const INTRO_STEP_2_MS = 1900;
const INTRO_STEP_3_MS = 2200;
const INTRO_TOTAL_MS = INTRO_STEP_1_MS + INTRO_STEP_2_MS + INTRO_STEP_3_MS;

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
  const projectTaglineSplash = document.getElementById("projectTaglineSplash");
  const projectNameHome = document.getElementById("projectNameHome");
  const projectTaglineHome = document.getElementById("projectTaglineHome");

  const detailCategoryValue = document.getElementById("detailCategoryValue");
  const detailRegionValue = document.getElementById("detailRegionValue");
  const detailFocusValue = document.getElementById("detailFocusValue");

  const yearText = document.getElementById("yearText");

  if (monthLabel) monthLabel.textContent = spotlight.monthLabel;
  if (projectNameSplash) projectNameSplash.textContent = spotlight.name;
  if (projectTaglineSplash) projectTaglineSplash.textContent = spotlight.tagline;
  if (projectNameHome) projectNameHome.textContent = spotlight.name;
  if (projectTaglineHome) projectTaglineHome.textContent = spotlight.tagline;

  if (detailCategoryValue) detailCategoryValue.textContent = spotlight.details[0]?.value ?? "";
  if (detailRegionValue) detailRegionValue.textContent = spotlight.details[1]?.value ?? "";
  if (detailFocusValue) detailFocusValue.textContent = spotlight.details[2]?.value ?? "";

  if (yearText) yearText.textContent = `© ${new Date().getFullYear()}`;
}

function showProjectSplashStep(stepIndex) {
  const projectSplash = document.getElementById("projectSplash");
  if (!projectSplash) return;

  const screens = Array.from(projectSplash.querySelectorAll(".intro-screen"));
  screens.forEach((screen, i) => {
    screen.classList.toggle("is-active", i === stepIndex);
  });
}

function runProjectSplashSequence() {
  const projectSplash = document.getElementById("projectSplash");
  const siteContent = document.getElementById("siteContent");
  if (!projectSplash || !siteContent) return;

  projectSplash.classList.add("is-active");
  projectSplash.setAttribute("aria-hidden", "false");

  showProjectSplashStep(0);
  window.setTimeout(() => showProjectSplashStep(1), INTRO_STEP_1_MS);
  window.setTimeout(
    () => showProjectSplashStep(2),
    INTRO_STEP_1_MS + INTRO_STEP_2_MS
  );

  window.setTimeout(() => {
    projectSplash.classList.remove("is-active");
    projectSplash.setAttribute("aria-hidden", "true");

    siteContent.classList.add("is-ready");
    siteContent.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "auto";
  }, INTRO_TOTAL_MS);
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
  const menu = document.getElementById("mobileMenu");
  const backdrop = document.getElementById("menuBackdrop");
  if (!toggle || !menu || !backdrop) return;

  const links = menu.querySelectorAll(".mobile-menu-link");

  function openMenu() {
    toggle.classList.add("is-open");
    menu.classList.add("is-open");
    backdrop.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  }

  function closeMenu() {
    toggle.classList.remove("is-open");
    menu.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  toggle.addEventListener("click", () => {
    if (menu.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  backdrop.addEventListener("click", closeMenu);
  links.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

function init() {
  runSplashScreen();
  wireMobileMenu();
  wireSpotlightContent();
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Load after DOM is ready.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

