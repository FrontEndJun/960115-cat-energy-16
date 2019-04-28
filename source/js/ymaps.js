var clientWidth=document.body.clientWidth;
var iconWidth = 113,
    iconHeight = 106;
ymaps.ready(init);
var address = [59.938631, 30.323055],
    mCenter = [59.938575, 30.321539];

function init () {

  var myMap = new ymaps.Map('map-canvas', {
      center: clientWidth > 1300 ? mCenter : address,
      zoom: 18,
      controls: [],
  });


  var placemark1 = new ymaps.Placemark(address, {
    hintContent: 'г. Санкт-Петербург ул. Большая Конюшенная, д. 19/8',
  }, {
    iconLayout: 'default#image',
    iconImageHref: '/img/map-pin.png',
    // iconImageSize: clientWidth > 320 ? [113, 106] : [55, 53],
    iconImageSize: [iconWidth, iconHeight],
    // iconImageOffset: clientWidth > 320 ? [-56, -106] : [-27, -53],
    iconImageOffset: [-iconWidth / 2, -iconHeight],
  });

  myMap.geoObjects.add(placemark1);


  window.onresize = function (e) {
    clientWidth=window.innerWidth;
    if (clientWidth > 1299) myMap.setCenter(mCenter);
    else myMap.setCenter(address);
  }
}



