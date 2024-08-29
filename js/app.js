const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".navbar-links");

hamburger.addEventListener("click", mobileMenu);

// The `mobileMenu` function toggles the "active" class on both the hamburger element and the navigation menu element.
function mobileMenu() {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
}

const navLink = document.querySelectorAll(".navbar-links li");

navLink.forEach((n) => n.addEventListener("click", closeMenu));

// The function `closeMenu` removes the "active" class from both the hamburger and navMenu elements.
function closeMenu() {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
}
