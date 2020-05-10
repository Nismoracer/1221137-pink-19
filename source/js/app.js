var Menu = document.querySelector(".page-header__menu");
var MenuToggle = document.querySelector(".page-header__toggle");

Menu.classList.remove("page-header--nojs");
Menu.classList.add("page-header__menu--closed");
Menu.classList.remove("page-header__menu--opened");

MenuToggle.addEventListener('click', function() {
  if (Menu.classList.contains("page-header__menu--closed")) {
    Menu.classList.remove("page-header__menu--closed");
    Menu.classList.add("page-header__menu--opened");
  } else {
    Menu.classList.add("page-header__menu--closed");
    Menu.classList.remove("page-header__menu--opened");
  }
});
