'use strict';

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");

    var aboutUsBtn = document.querySelectorAll('.js-about-us-btn')[0];
    var mapLink = document.querySelectorAll('.js-map-link')[0];

    if (aboutUsBtn) {
      aboutUsBtn.addEventListener('click', modalForm);
      mapLink.addEventListener('click', modalMap);
    };

    //show modalForm
    function modalForm(event){
      event.preventDefault();

      var modalForm = document.querySelectorAll('.js-modal-write-us')[0];
      var modalClose = modalForm.querySelectorAll('.js-modal-close')[0];

      var positionY = document.documentElement.clientHeight / 2 + window.pageYOffset;
      modalForm.style.top = positionY + 'px';

      modalForm.classList.add('m-show');
      modalClose.addEventListener('click', function(){
        modalForm.classList.remove('m-show');
      });
    };

    //show modalMap
    function modalMap(event) {
      event.preventDefault();

      var modalMap = document.querySelectorAll('.js-modal-map')[0];
      var modalClose = modalMap.querySelectorAll('.js-modal-close')[0];

      modalMap.classList.add('m-show');
      modalClose.addEventListener('click', function(){
        modalMap.classList.remove('m-show');
      });
    }

  });
