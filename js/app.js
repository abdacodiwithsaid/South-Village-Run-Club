const menuButton = document.querySelector(".hamburger");
const navMenu = document.querySelector(".navbar-links");
const yearElement = document.querySelector("#current-year");
const backgroundVideo = document.querySelector(".background-video");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (menuButton && navMenu) {
  const navLinks = navMenu.querySelectorAll("a");

  function setMenuOpen(isOpen) {
    menuButton.classList.toggle("active", isOpen);
    navMenu.classList.toggle("active", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation",
    );
  }

  menuButton.addEventListener("click", () => {
    setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  });
}

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

if (backgroundVideo && reduceMotion.matches) {
  backgroundVideo.pause();
  backgroundVideo.removeAttribute("autoplay");
}

const revealTargets = document.querySelectorAll(
  ".welcome, .blurb, .cards .card, .events-section .intro-content, " +
    ".events-section .run, .table-wrapper, .partnering .card, " +
    ".gallery-container > li, .contact-form",
);

if (
  revealTargets.length > 0 &&
  "IntersectionObserver" in window &&
  !reduceMotion.matches
) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  document.documentElement.classList.add("motion-ready");
  revealTargets.forEach((target) => {
    target.classList.add("reveal");
    revealObserver.observe(target);
  });
}
