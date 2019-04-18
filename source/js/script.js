var burger = document.querySelector(".page-header__nav-toggle");
var navList = document.querySelector(".page-header__nav");
navList.classList.remove('page-header__nav--nojs');
burger.addEventListener('click', function (e) {
  e.preventDefault();
  if (navList.classList.contains('page-header__nav--closed')){
    navList.classList.add('page-header__nav--opened');
    navList.classList.remove('page-header__nav--closed');
  }
  else {
    navList.classList.remove('page-header__nav--opened');
    navList.classList.add('page-header__nav--closed');
  }

})
