var menu = document.querySelector(".page-header__menu");
var menuToggle = document.querySelector(".page-header__toggle");

menu.classList.remove("page-header--nojs");
menu.classList.add("page-header__menu--closed");
menu.classList.remove("page-header__menu--opened");

menuToggle.addEventListener("click", function() {
  if (menu.classList.contains("page-header__menu--closed")) {
    menu.classList.remove("page-header__menu--closed");
    menu.classList.add("page-header__menu--opened");
  } else {
    menu.classList.add("page-header__menu--closed");
    menu.classList.remove("page-header__menu--opened");
  }
});
