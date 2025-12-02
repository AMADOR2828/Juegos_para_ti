// --- Variables de Estado del Juego ---
const NUM_PARES = 6; // Seis pares = 12 cartas
let cartasSeleccionadas = [];
let bloquearTablero = false;
let paresEncontrados = 0;

// --- Función para mezclar (Shuffling) el Array ---
function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- Generar y Posicionar las Cartas (12 cartas) ---
function posicionarCartas() {
    const gridJuego = $('.gridJuego');
    gridJuego.empty(); 

    let tiposCartas = [];
    for (let i = 0; i < NUM_PARES; i++) {
        tiposCartas.push(i, i);
    }

    mezclarArray(tiposCartas);

    tiposCartas.forEach((tipo, indice) => {
        const cartaHTML = `
            <div class="caja caja${indice}" data-index="${indice}">
                <div class="a carta-giratoria clickable-card" data-tipo="${tipo}">
                    <div class="cF"></div>
                    <div class="cA c${tipo}"></div>
                </div>
            </div>
        `;
        gridJuego.append(cartaHTML);
    });
}

// --- Inicialización de Eventos de Clic (Delegación) ---
function inicializarEventos() {
    $('.gridJuego').on('click', '.clickable-card', function() {
        const elemento = this;
        const tipo = $(elemento).data('tipo');
        const indice = $(elemento).closest('.caja').data('index');

        juego(elemento, tipo, indice);
    });
}

// --- Lógica de la Comprobación de Pares ---
function comprobarPar() {
    bloquearTablero = true;
    const [carta1, carta2] = cartasSeleccionadas;
    const tipo1 = parseInt(carta1.data('tipo')); 
    const tipo2 = parseInt(carta2.data('tipo'));

    if (tipo1 === tipo2) {
        paresEncontrados++;

        setTimeout(() => {
            carta1.closest('.caja').animate({ opacity: '0' }, 300);
            carta2.closest('.caja').animate({ opacity: '0' }, 300);

            cartasSeleccionadas = [];
            bloquearTablero = false;

            if (paresEncontrados === NUM_PARES) {
                setTimeout(terminarJuego, 400);
            }
        }, 800);

    } else {
        setTimeout(() => {
            carta1.removeClass('rotar');
            carta2.removeClass('rotar');
            cartasSeleccionadas = [];
            bloquearTablero = false;
        }, 1000); 
    }
}


// --- Mecanismo de Juego al hacer click en una carta ---
function juego(elemento) {
    const cartaClickeada = $(elemento);

    if (bloquearTablero || cartaClickeada.hasClass('rotar') || cartasSeleccionadas.length === 2) {
        return;
    }

    cartaClickeada.addClass('rotar');
    cartasSeleccionadas.push(cartaClickeada);

    if (cartasSeleccionadas.length === 2) {
        comprobarPar();
    }
}

// --- Funciones de Transición de Pantallas ---

function comenzarJuego() {
    $('.presentacion').animate({ opacity: '0', top: '10%' }, 400);
    setTimeout(() => {
        $('.presentacion').css('display', 'none');
        $('.gridJuego').css('display', 'grid');
        $('.gridJuego').animate({ opacity: '1', top: '50%' }, 400);
    }, 450);
}

function terminarJuego() {
    $('.gridJuego').animate({ opacity: '0' }, 400);
    setTimeout(() => {
        $('.gridJuego').css('display', 'none');
        
        $('body').addClass('no-scroll'); 
        
        $('.finJuego').css('display', 'flex').css('opacity', '0'); 
        
        $('.finJuego').animate({ opacity: '1' }, 400);
        $('.finJuego .popup').css('transform', 'scale(1)');
        
    }, 450);
}

// FUNCIÓN MODIFICADA: Regresa de la victoria a la presentación
function reiniciarJuegoTotal() {
    $('.finJuego').animate({ opacity: '0' }, 400);
    $('.finJuego .popup').css('transform', 'scale(0.9)'); 
    
    // Reiniciar variables
    cartasSeleccionadas = [];
    paresEncontrados = 0;
    bloquearTablero = false;

    // Restaurar el scroll
    $('body').removeClass('no-scroll');
    
    // Volver a crear y posicionar las cartas (juego nuevo listo)
    posicionarCartas();

    setTimeout(() => {
        $('.caja').css('opacity','1'); 
        $('.finJuego').css('display', 'none');
        
        // MOSTRAR LA PANTALLA DE PRESENTACIÓN
        $('.presentacion').css('display', 'flex').css('opacity', '0').css('top', '10%');
        $('.presentacion').animate({ opacity: '1', top: '0%' }, 400);
    }, 450);
}

// --- Inicialización ---
$(document).ready(() => {
    posicionarCartas();
    inicializarEventos();

    // Inicialmente, mostrar solo la presentación
    $('.gridJuego').css('display', 'none').css('opacity', '0');
    $('.finJuego').css('display', 'none').css('opacity', '0');
    // Esconder el pop-up al inicio
    $('.finJuego .popup').css('transform', 'scale(0.9)');
    
    $('.presentacion').css('display', 'flex').css('opacity', '1').css('top', '0');
    $('body').removeClass('no-scroll'); 
});