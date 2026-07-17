/*-----------------------------------------------------------
* Template Name    : RectCV - Personal Bootstrap 4 HTML Template
* Author           : Narek Sukiasyan
* Version          : 1.0.0
* Created          : April 2020
* File Description : Custom functions file for theme
*--
*/

"use strict";

jQuery.event.special.touchstart = {
    setup: function( _, ns, handle ){
        this.addEventListener("touchstart", handle, { passive: true });
    }
};

//Scroll Bar Width Check Function

function getScrollBarWidth() {
    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";
  
    var outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild (inner);
  
    document.body.appendChild (outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;
  
    document.body.removeChild (outer);
  
    return (w1 - w2);
};


//Init Template for Prelaoder

$('body').css({'margin-right': getScrollBarWidth() + "px"});
$('body').addClass('overflow-hidden');
$('header.navigation').css({'padding-right': getScrollBarWidth() + "px"});
$('.backgound-section').addClass('preload');

$(window).on("load", function(){
    
    
    setTimeout(function(){
        $("body").removeClass('overflow-hidden');
        $("body").removeAttr('style');
        $("header.navigation").removeAttr('style');
        $('.backgound-section').removeClass('preload');
    },400);

    //AOS

    AOS.init({
        once: true
    });

     //Input on Focus

    $('.form-control').on('focusin', function(){
        $(this).parent('.form-group').addClass('form-focused');
    });

    $('.form-control').on('focusout', function(){
        if($(this).val().length === 0){
            $(this).parent('.form-group').removeClass('form-focused');
        }
    });

    //Typed JS

    if ($('.welcome-text-type').length) {
        var typed = new Typed('.welcome-text-type', {
            strings: $('.welcome-text-type').data('options').split(","),
            typeSpeed: 90,
            backDelay: 2000,
            backSpeed: 40,
            loop: true
        });
    }

    //Counter

    $('.tmcounter').each(function(){
        $(this).appear(function(){
            $(this).countTo();
        })
    });

    //Progress Bar

    $('.progress-bar').each(function(){
        $(this).appear(function(){

            $(this).css({
                width: $(this).data('percent') + "%"
            })

        });
    });

    //Parallax

    if ($('#parallaxbackground').length && typeof Parallax !== 'undefined') {
        var backgroundp = document.getElementById('parallaxbackground');
        new Parallax(backgroundp);
    }

    //Particle

    if($('#particlebackground').length != 0)
    {
        var config = $('#particlebackground').data('config');
        particlesJS.load('particlebackground', config);

    }

    // Legacy vertical header toggler
    $(".button-toggler").on("click", function(){
        var vertical_header = $('.navigation').hasClass('vertical_header') ? true : false;
        if (!vertical_header || window.innerWidth >= 992) return;

        var pressed = !$(this).hasClass('pressed');
        if(pressed)
        {
            $('.vertical_header').addClass('pressed');
            $('main').addClass('pressed');
            $('.mobile-header').addClass('pressed');
        }
        else
        {
            $('.vertical_header').removeClass('pressed');
            $('main').removeClass('pressed');
            $('.mobile-header').removeClass('pressed');
        }
    });

    $('.vertical_header ul li a').on('click', function(){
        $('.vertical_header').removeClass('pressed');
        $('main').removeClass('pressed');
        $('.mobile-header').removeClass('pressed'); 
        $(".button-toggler").removeClass('pressed');
    });

    // Popup Portfolio Section

    $(".portfolio-image").magnificPopup({
        type:"image",
        closeOnContentClick: true,
        gallery:{
            enabled: true,
            navigateByImgClick:true,
            preload:[0,1]
        }
    });

    $(".iframe_popup").magnificPopup({
        type: "iframe",
        closeBtnInside: false,
        iframe: {
            markup: '<div class="mfp-iframe-scaler">'+
                      '<div class="mfp-close"></div>'+
                      '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                    '</div>',
            patterns: {
                youtube: {
                    index: 'youtube.com/',
          
                    id: 'v=',
          
                    src: 'https://www.youtube.com/embed/%id%?autoplay=1'
                },
                vimeo: {
                    index: 'vimeo.com/',
                    id: '/',
                    src: '//player.vimeo.com/video/%id%?autoplay=1'
                },
                gmaps: {
                     index: '//maps.google.',
                    src: '%id%&output=embed'
                }
                },
          
            srcAction: 'iframe_src',
        }
        
    });

    // OWL Carousel

    if ($('#client_slider').length) {
        $('#client_slider').owlCarousel({
            items: 1,
            loop: true,
            autoplay: true,
            autoplayTimeout: 4000,
            dots: true,
            autoplayHoverPause: true,
            autoplaySpeed: 1000,
            navSpeed: 500,
            dotsSpeed: 500,
            dragEndSpeed: 500
        });
    }

    

    

});

// Return to top button

function toggleReturnToTop() {
    if ($(window).scrollTop() >= 350) {
        $('#return-to-top').fadeIn(200);
    } else {
        $('#return-to-top').fadeOut(200);
    }
}

$(window).on('scroll resize', toggleReturnToTop);
toggleReturnToTop();

$('#return-to-top').on('click', function(e) {
    e.preventDefault();
    $('body,html').animate({
        scrollTop : 0
    }, 1500, 'easeInOutQuad');
});

// Mobile Menu — toggle custom (sans Bootstrap collapse)
$(function initMobileNav() {
    var $nav = $('#navigation');
    var $toggler = $('.button-toggler');
    var $headerIns = $('header.horizontal_header .header-ins');

    if (!$('.navigation').hasClass('horizontal_header') || !$nav.length) return;

    if (!$('.mobile-nav-backdrop').length) {
        $('<div class="mobile-nav-backdrop" aria-hidden="true"></div>').appendTo('body');
    }

    var $backdrop = $('.mobile-nav-backdrop');
    var togglerDataToggle = $toggler.attr('data-toggle');
    var togglerDataTarget = $toggler.attr('data-target');

    function isMobileNav() {
        return window.innerWidth < 992;
    }

    function setMenuOpen(isOpen) {
        if (!isMobileNav()) {
            closeMenu();
            return;
        }

        $nav.toggleClass('is-open', isOpen);
        $('body').toggleClass('mobile-nav-open', isOpen);
        $toggler
            .toggleClass('pressed', isOpen)
            .toggleClass('collapsed', !isOpen)
            .attr('aria-expanded', isOpen ? 'true' : 'false');

        if (isOpen) {
            $headerIns.removeClass('transparent_header');
        } else if ($('header.horizontal_header').hasClass('transparentOnScroll') && $(window).scrollTop() < 350) {
            $headerIns.addClass('transparent_header');
        }
    }

    function closeMenu() {
        setMenuOpen(false);
        $nav.removeClass('show collapsing').css('height', '');
    }

    function toggleMenu() {
        setMenuOpen(!$nav.hasClass('is-open'));
    }

    function enableMobileMode() {
        $toggler.removeAttr('data-toggle').removeAttr('data-target');
        closeMenu();
    }

    function enableDesktopMode() {
        closeMenu();
        if (togglerDataToggle) {
            $toggler.attr('data-toggle', togglerDataToggle);
        }
        if (togglerDataTarget) {
            $toggler.attr('data-target', togglerDataTarget);
        }
    }

    function syncNavMode() {
        if (isMobileNav()) {
            enableMobileMode();
        } else {
            enableDesktopMode();
        }
    }

    $toggler.on('click.mobileNav', function(e) {
        if (!isMobileNav()) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        toggleMenu();
    });

    $backdrop.on('click.mobileNav', function() {
        if ($nav.hasClass('is-open')) {
            closeMenu();
        }
    });

    $(document).on('keydown.mobileNav', function(e) {
        if (e.key === 'Escape' && $nav.hasClass('is-open') && isMobileNav()) {
            closeMenu();
        }
    });

    $nav.find('> li > a').on('click.mobileNav', function() {
        if (!isMobileNav()) return;
        closeMenu();
    });

    $(window).on('resize.mobileNav', syncNavMode);

    syncNavMode();
});
