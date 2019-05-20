var burger = document.querySelector(".page-header__nav-toggle");
var navList = document.querySelector(".page-header__nav");
var imgBefore = document.querySelector(".example__cat--before");
var imgAfter = document.querySelector(".example__cat--after");
var btnBefore = document.querySelector(".example__slider-label--before");
var btnAfter = document.querySelector(".example__slider-label--after");
var sliderElem = document.querySelector('.example__slider-bar');
var thumbElem = document.querySelector('.example__slider-thumb');
var remapVal;
var isMobile = window.innerWidth >= 678 ? false : true;






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

});

function slider(value) {
  imgBefore.style.clip = `rect(0, ${690 - value}px, auto, 0`;
  imgAfter.style.clip = `rect(0, auto, auto, ${690 - value}px)`
}

function remap(n, start1, stop1, start2, stop2) {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
}


if (!isMobile) {
  var rightEdge = sliderElem.offsetWidth - thumbElem.offsetWidth;

  btnBefore.addEventListener('click', function (e) {
    e.preventDefault();
    thumbElem.style.left = 0 + 'px';
    remapVal = remap(0, 0, rightEdge, 0, 690);
    slider(remapVal);
  })

  btnAfter.addEventListener('click', function (e) {
    e.preventDefault();
    thumbElem.style.left = 394 + 'px';
    remapVal = remap(rightEdge, 0, rightEdge, 0, 676);
    slider(remapVal);
  })

  thumbElem.onmousedown = function(e) {
    var thumbCoords = getCoords(thumbElem);
    var shiftX = e.pageX - thumbCoords.left;
    var sliderCoords = getCoords(sliderElem);

    document.onmousemove = function(e) {
      var newLeft = e.pageX - shiftX - sliderCoords.left;
      if (newLeft < 0) {
        newLeft = 0;
      }

      if (newLeft > rightEdge) {
        newLeft = rightEdge;
      }
      remapVal = remap(newLeft, 0, rightEdge, 0, 676);
      slider(remapVal);
      thumbElem.style.left = newLeft + 'px';
    };

    document.onmouseup = function() {
      document.onmousemove = document.onmouseup = null;
    };

    return false; // disable selection start (cursor change)
  };

  thumbElem.ondragstart = function() {
    return false;
  };

}

function getCoords(elem) { // кроме IE8-
  var box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}





