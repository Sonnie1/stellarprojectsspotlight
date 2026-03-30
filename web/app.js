const spotlight = {
  title: "Project Spotlight",
  subtitle:
    "A monthly feature highlighting the most impactful work across Stellar East Africa.",
  categoryLabel: "Project of the Month",
  featuredMeta: "Monthly Spotlight",
  description:
    "This project improves lives by turning ideas into usable solutions for communities.",
  problemText:
    "Many builders struggle to turn promising ideas into sustainable products that reach the right audience.",
  solutionText:
    "A structured approach that helps teams ship, measure impact, and iterate with clarity.",
  liveDemoUrl: "#",
};

const SPLASH_DURATION_MS = 2600;

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
  const title = document.getElementById("projectTitle");
  const subtitle = document.getElementById("projectSubtitle");
  const categoryPill = document.getElementById("projectCategoryPill");
  const liveDemoButton = document.getElementById("liveDemoButton");
  const featuredMeta = document.getElementById("projectFeaturedMeta");
  const titleCard = document.getElementById("projectTitleCard");
  const desc = document.getElementById("projectDescription");
  const problemText = document.getElementById("problemText");
  const solutionText = document.getElementById("solutionText");
  const yearText = document.getElementById("yearText");

  if (title) title.textContent = spotlight.title;
  if (subtitle) subtitle.textContent = spotlight.subtitle;
  if (categoryPill) categoryPill.textContent = spotlight.categoryLabel;
  if (liveDemoButton) liveDemoButton.href = spotlight.liveDemoUrl;
  if (featuredMeta) featuredMeta.textContent = spotlight.featuredMeta;
  if (titleCard) titleCard.textContent = spotlight.title;
  if (desc) desc.textContent = spotlight.description;
  if (problemText) problemText.textContent = spotlight.problemText;
  if (solutionText) solutionText.textContent = spotlight.solutionText;
  if (yearText) yearText.textContent = `© ${new Date().getFullYear()}`;
}

function runSplashScreen() {
  const splash = document.getElementById("splashScreen");
  const siteContent = document.getElementById("siteContent");
  if (!splash || !siteContent) return;

  document.body.style.overflow = "hidden";

  window.setTimeout(() => {
    splash.classList.add("is-hidden");
    siteContent.classList.add("is-ready");
    siteContent.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "auto";
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

