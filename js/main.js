/* =========================================================
   MIAUFEST · Cálculo del precio de las entradas
   JavaScript nativo y sencillo (ES5): var, function,
   querySelector/querySelectorAll y bucles for.
   ========================================================= */



// NAV BAR 

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

/* ---------- 1. DATOS Y ELEMENTOS ---------- */

var GASTOS_POR_ENTRADA = 1.5;   // gastos de gestión por cada entrada
var MAXIMO_POR_TIPO = 10;       // máximo de entradas de cada tipo

var formulario = document.querySelector('#formulario-compra');
var entradas = document.querySelectorAll('.entrada');

var resumenLista = document.querySelector('#resumen-lista');
var totalEntradasTexto = document.querySelector('#total-entradas');
var subtotalTexto = document.querySelector('#subtotal');
var gastosTexto = document.querySelector('#gastos');
var totalTexto = document.querySelector('#total');

var botonComprar = document.querySelector('#boton-comprar');
var mensaje = document.querySelector('#mensaje');
var campoNombre = document.querySelector('#nombre');
var campoEmail = document.querySelector('#email');


/* ---------- 2. FUNCIONES DE AYUDA ---------- */

// Convierte un número en precio con formato español: 12.5 → "12,50 €"
function formatearPrecio(numero) {
    return numero.toFixed(2).replace('.', ',') + ' €';
}

// Lee la cantidad que muestra el contador de una entrada
function leerCantidad(entrada) {
    var cantidad = entrada.querySelector('.contador__cantidad');
    return parseInt(cantidad.textContent, 10);
}

// Escribe una cantidad nueva en el contador de una entrada
function escribirCantidad(entrada, numero) {
    var cantidad = entrada.querySelector('.contador__cantidad');
    cantidad.textContent = numero;
}

function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = 'mensaje mensaje--' + tipo;   // "mensaje--error" o "mensaje--ok"
}

function borrarMensaje() {
    mensaje.textContent = '';
    mensaje.className = 'mensaje';
}


/* ---------- 3. CÁLCULO DEL TOTAL ---------- */
// Recorre todas las entradas, calcula subtotales y actualiza el resumen.

function actualizarTotal() {
    var totalEntradas = 0;
    var subtotal = 0;
    var lineasResumen = '';

    for (var i = 0; i < entradas.length; i++) {
        var entrada = entradas[i];

        var precio = parseFloat(entrada.getAttribute('data-precio'));
        var nombre = entrada.getAttribute('data-nombre');
        var cantidad = leerCantidad(entrada);
        var subtotalEntrada = precio * cantidad;

        // Subtotal dentro de la propia tarjeta
        entrada.querySelector('.entrada__subtotal strong').textContent = formatearPrecio(subtotalEntrada);

        // Botones: no bajar de 0 ni pasar del máximo
        entrada.querySelector('.contador__boton--menos').disabled = (cantidad === 0);
        entrada.querySelector('.contador__boton--mas').disabled = (cantidad === MAXIMO_POR_TIPO);

        if (cantidad > 0) {
            entrada.classList.add('is-seleccionada');
            lineasResumen = lineasResumen +
                '<li><span>' + cantidad + ' × ' + nombre + '</span>' +
                '<strong>' + formatearPrecio(subtotalEntrada) + '</strong></li>';
        } else {
            entrada.classList.remove('is-seleccionada');
        }

        totalEntradas = totalEntradas + cantidad;
        subtotal = subtotal + subtotalEntrada;
    }

    var gastos = totalEntradas * GASTOS_POR_ENTRADA;
    var total = subtotal + gastos;

    // Lista del resumen (o el mensaje de "vacío")
    if (lineasResumen === '') {
        resumenLista.innerHTML = '<li class="resumen__vacio">Todavía no has elegido ninguna entrada.</li>';
    } else {
        resumenLista.innerHTML = lineasResumen;
    }

    totalEntradasTexto.textContent = totalEntradas;
    subtotalTexto.textContent = formatearPrecio(subtotal);
    gastosTexto.textContent = formatearPrecio(gastos);
    totalTexto.textContent = formatearPrecio(total);

    // Solo se puede comprar si hay al menos una entrada
    botonComprar.disabled = (totalEntradas === 0);
}


/* ---------- 4. BOTONES + Y − DE CADA ENTRADA ---------- */
// La función recibe UNA entrada y conecta sus dos botones.
// (Así cada botón sabe a qué entrada pertenece.)

function conectarContador(entrada) {
    var botonMenos = entrada.querySelector('.contador__boton--menos');
    var botonMas = entrada.querySelector('.contador__boton--mas');

    botonMas.addEventListener('click', function () {
        var cantidad = leerCantidad(entrada);
        if (cantidad < MAXIMO_POR_TIPO) {
            escribirCantidad(entrada, cantidad + 1);
            borrarMensaje();
            actualizarTotal();
        }
    });

    botonMenos.addEventListener('click', function () {
        var cantidad = leerCantidad(entrada);
        if (cantidad > 0) {
            escribirCantidad(entrada, cantidad - 1);
            borrarMensaje();
            actualizarTotal();
        }
    });
}

for (var i = 0; i < entradas.length; i++) {
    conectarContador(entradas[i]);
}


/* ---------- 5. ENVÍO DEL FORMULARIO ---------- */

// Al escribir en un campo se quita el borde rojo de error
campoNombre.addEventListener('input', function () {
    campoNombre.classList.remove('is-error');
});

campoEmail.addEventListener('input', function () {
    campoEmail.classList.remove('is-error');
});

formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();   // no recargar la página

    var nombre = campoNombre.value.trim();
    var email = campoEmail.value.trim();
    var hayErrores = false;

    if (nombre === '') {
        campoNombre.classList.add('is-error');
        hayErrores = true;
    }

    // Comprobación sencilla del email: que tenga @ y un punto
    if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
        campoEmail.classList.add('is-error');
        hayErrores = true;
    }

    if (hayErrores) {
        mostrarMensaje('Revisa tu nombre y tu email antes de comprar.', 'error');
        return;
    }

    // Todo correcto: mensaje de confirmación y formulario a cero
    mostrarMensaje('¡Genial! Compra realizada, ' + nombre + '. Total pagado: ' + totalTexto.textContent + '.', 'ok');

    for (var j = 0; j < entradas.length; j++) {
        escribirCantidad(entradas[j], 0);
    }
    campoNombre.value = '';
    campoEmail.value = '';
    actualizarTotal();
});


/* ---------- 6. ESTADO INICIAL ---------- */
actualizarTotal();
