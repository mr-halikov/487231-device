'use strict';

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");

    // modals
    var aboutUsBtn = document.querySelector('.js-about-us-btn');
    var mapLink = document.querySelector('.js-map-link');

    if (aboutUsBtn) {
      aboutUsBtn.addEventListener('click', modalForm);
      mapLink.addEventListener('click', modalMap);
    };


    // slider
    var sliderDots = Array.prototype.slice.call( document.querySelectorAll('.js-slider-button') );

    if (sliderDots) {
      sliderDots.forEach(function(dot) {
        dot.addEventListener('click', switchSlide);
      })
    }

    // services tabs
    var servicesBtns = Array.prototype.slice.call( document.querySelectorAll('.js-services-button') );

    if (servicesBtns) {
      servicesBtns.forEach(function(button) {
        button.addEventListener('click', switchServicesTab);
      })
    }

    //show modalForm
    function modalForm(event){
      event.preventDefault();

      var modalForm = document.querySelector('.js-modal-write-us');
      var modalClose = modalForm.querySelector('.js-modal-close');

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

      var modalMap = document.querySelector('.js-modal-map');
      var modalClose = modalMap.querySelector('.js-modal-close');

      modalMap.classList.add('m-show');
      modalClose.addEventListener('click', function(){
        modalMap.classList.remove('m-show');
      });
    }

    //switch slides
    function switchSlide(event) {

      var index = event.currentTarget.getAttribute( 'data-control' );
      var slides = Array.prototype.slice.call( document.querySelectorAll('.js-slide') );

      // Set active dot
      sliderDots.forEach(function(dot) {
        dot.classList.remove('slider__button_active');
      })

      event.currentTarget.classList.add('slider__button_active');

      // Set active slide
      slides.forEach(function(slide) {
        var attribute = slide.getAttribute('data-slide');
        if (attribute === index) {
          slide.classList.add('m-show-flex');
        } else {
          slide.classList.remove('m-show-flex');
        }
      })
    }

    function switchServicesTab(event) {

      var targetSlide = event.currentTarget.getAttribute( 'data-btn-for' );
      var tabs = Array.prototype.slice.call( document.querySelectorAll('.js-services-tab') );

      // Set active button
      servicesBtns.forEach(function(button) {
        button.classList.remove('services__button_active');
      })

      event.currentTarget.classList.add('services__button_active');

      // Switch slide
      tabs.forEach(function(tab) {
        var tabName = tab.getAttribute('data-tab-name');
        if (targetSlide === tabName) {
          tab.classList.add('m-show');
        } else {
          tab.classList.remove('m-show');
        }
      })


    }

  });
