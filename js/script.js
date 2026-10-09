
// alert("online");

// FAQ (FUNCIONA) -> 
const faqs = document.querySelectorAll(".faq");

faqs.forEach(faq => {
    faq.addEventListener("click", () => {
        faq.classList.toggle("active");
    });
});


// NAV BAR ->

(function () {
    'use strict';

    var nav = document.querySelector('.nav');
    var menuButton = document.querySelector('.menu-toggle');
    var menu = document.getElementById('menu');

    var mobileQuery = window.matchMedia ? window.matchMedia('(max-width: 768px)') : null; 

   function isMobile() {
        return mobileQuery ? mobileQuery.matches : window.innerWidth <= 768;
    }

    function openMenu() {
        menu.classList.add('is-open');
        document.body.classList.add('menu-open');
        nav.classList.remove('nav--hidden');
        menuButton.setAttribute('aria-label', 'Cerrar menú');
    }

    function closeMenu() {
        menu.classList.remove('is-open');
        document.body.classList.remove('menu-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Abrir menú');
    }

    function toggleMenu() {
        if (menu.classList.contains('is-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    if (nav && menuButton && menu) {
        menuButton.addEventListener('click', toggleMenu);
        
        var links = menu.querySelectorAll('a');
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', closeMenu);
        }

        document.addEventListener('keydown', function (event) {
            if ((event.key === 'Escape' || event.keyCode === 27) && menu.classList.contains('is-open')) {
                closeMenu();
                menuButton.focus();
            }
        });
    }

    var lastScrollY = window.pageYOffset;
    var ticking = false;
    var DELTA = 8;

    function updateNav() {
        var currentY = window.pageYOffset;
        if (currentY > 20) {
            nav.classList.add('is-scrolled');
        } else {
            nav.classList.remove('is-scrolled');
        }

        if (!isMobile() || menu.classList.contains('is-open') || currentY <= 0) {
            nav.classList.remove('nav--hidden');
            lastScrollY = currentY;
            ticking = false;
            return;
        }

        var diff = currentY - lastScrollY;

        if (Math.abs(diff) > DELTA) {
            if (diff > 0 && currentY > nav.offsetHeight) {
                nav.classList.add('nav-hidden');
            } else if (diff < 0) {
                nav.classList.remove('nav-hidden');
            }
            lastScrollY = currentY
        }

        ticking = false; 
    }

    if (nav && menu) {
        window.addEventListener('scroll', function () {
            if (!ticking) {
                this.window.requestAnimationFrame(updateNav);
                ticking = true;
            }
        });

        nav.addEventListener('focusin', function () {
            nav.classList.remove('nav--hidden');
        });

        window.addEventListener('resize', function () {
            if (!isMobile()) {
                closeMenu();
                nav.classList.remove('nav-hidden');
            }
        });

        updateNav();
    }

    var year = document.getElementById('year');
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    if (window.AOS) {
        AOS.init({
            duration: 700, 
            easing: 'ease-out-back',
            offset: 80,
            once: true
        });
    }
})();