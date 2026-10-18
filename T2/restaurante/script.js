document.addEventListener('DOMContentLoaded', () => {

    // Comprobación na consola para asegurar que o script carga
    console.log("Script cargado correctamente");

    // --- 1. CONTROL DO VÍDEO ---
    const colector = document.getElementById('colectorVideo');
    const video = document.getElementById('videoMenu');

    if (colector && video) {
        colector.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                colector.classList.add('reproducindo');
            } else {
                video.pause();
                colector.classList.remove('reproducindo');
            }
        });

        video.addEventListener('ended', () => {
            colector.classList.remove('reproducindo');
        });
    }

    // --- 2. DESPRAZAMENTO SUAVE MANUAL (FUNCIONA SEMPRE) ---
    function desprazamentoSuave(obxectivoY, duracion = 700) {
        const inicioY = window.pageYOffset;
        const distancia = obxectivoY - inicioY;
        let tempoInicio = null;

        // Función matemática de aceleración/freado suave (ease-in-out)
        function animacion(tempoActual) {
            if (!tempoInicio) tempoInicio = tempoActual;
            const tempoTranscorrido = tempoActual - tempoInicio;
            const progreso = Math.min(tempoTranscorrido / duracion, 1);

            // Easing cúbico
            const factorSuave = progreso < 0.5
                ? 4 * progreso * progreso * progreso
                : 1 - Math.pow(-2 * progreso + 2, 3) / 2;

            window.scrollTo(0, inicioY + (distancia * factorSuave));

            if (progreso < 1) {
                requestAnimationFrame(animacion);
            }
        }

        requestAnimationFrame(animacion);
    }

    // Engadir o evento a todas as ligazóns do menú
    const ligazons = document.querySelectorAll('header nav a[href^="#"]');

    ligazons.forEach(enlace => {
        enlace.addEventListener('click', function (e) {
            const destinoId = this.getAttribute('href');
            const elementoDestino = document.querySelector(destinoId);

            if (elementoDestino) {
                e.preventDefault(); // Evita o salto brusco inmediato

                const header = document.getElementById('header');
                const alturaHeader = header ? header.offsetHeight : 100;
                const posicionDestino = elementoDestino.getBoundingClientRect().top + window.pageYOffset - alturaHeader;

                desprazamentoSuave(posicionDestino, 600); // 600ms de animación fluída
                history.pushState(null, null, destinoId);
            }
        });
    });

    // --- 3. ACTUALIZACIÓN DO MENÚ ACTIVO AO FACER SCROLL ---
    const seccions = document.querySelectorAll('main section');
    const ligazonsNav = document.querySelectorAll('header nav a:not(.boton)');

    window.addEventListener('scroll', () => {
        let seccionActual = '';
        const scrollPos = window.pageYOffset + 140;

        seccions.forEach(seccion => {
            const top = seccion.offsetTop;
            const height = seccion.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                seccionActual = seccion.getAttribute('id');
            }
        });

        ligazonsNav.forEach(enlace => {
            enlace.classList.remove('activo');
            if (enlace.getAttribute('href') === `#${seccionActual}`) {
                enlace.classList.add('activo');
            }
        });
    });

    // --- 4. FORMULARIO DE CONTACTO ---
    const form = document.getElementById('formularioContacto');
    const vistaExito = document.getElementById('vistaExito');
    const banner = document.getElementById('bannerErro');
    const bannerTitulo = document.getElementById('bannerTitulo');
    const bannerDetalle = document.getElementById('bannerDetalle');

    const campoNome = document.getElementById('campoNome');
    const campoEmail = document.getElementById('campoEmail');
    const campoMensaxe = document.getElementById('campoMensaxe');
    const campoAceptacion = document.getElementById('campoAceptacion');

    const grupoNome = document.getElementById('grupoNome');
    const grupoEmail = document.getElementById('grupoEmail');
    const grupoMensaxe = document.getElementById('grupoMensaxe');
    const grupoAceptacion = document.getElementById('grupoAceptacion');

    const botonEnviar = document.getElementById('botonEnviar');
    const textoBoton = document.getElementById('textoBoton');
    const spinner = document.getElementById('spinnerEnvio');
    const parrafoConfirmacion = document.getElementById('parrafoConfirmacion');
    const botonReiniciar = document.getElementById('botonReiniciar');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let errores = [];

            if (!campoNome.value.trim()) {
                grupoNome.classList.add('con-erro');
                errores.push('Nome');
            } else {
                grupoNome.classList.remove('con-erro');
            }

            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(campoEmail.value.trim())) {
                grupoEmail.classList.add('con-erro');
                errores.push('correo electrónico');
            } else {
                grupoEmail.classList.remove('con-erro');
            }

            if (!campoMensaxe.value.trim()) {
                grupoMensaxe.classList.add('con-erro');
                errores.push('mensaxe');
            } else {
                grupoMensaxe.classList.remove('con-erro');
            }

            if (!campoAceptacion.checked) {
                grupoAceptacion.classList.add('con-erro');
                errores.push('aceptación dos datos');
            } else {
                grupoAceptacion.classList.remove('con-erro');
            }

            if (errores.length > 0) {
                bannerTitulo.textContent = `Non se puido enviar: revisa ${errores.length} puntos.`;
                bannerDetalle.textContent = errores.join(', ') + '.';
                banner.style.display = 'flex';
                return;
            }

            banner.style.display = 'none';

            grupoNome.classList.add('enviando');
            grupoEmail.classList.add('enviando');
            grupoMensaxe.classList.add('enviando');

            textoBoton.textContent = 'Enviando...';
            if (spinner) spinner.style.display = 'inline-block';
            botonEnviar.disabled = true;

            const emailEnviado = campoEmail.value.trim();

            setTimeout(() => {
                form.style.display = 'none';
                parrafoConfirmacion.textContent = `Responderémosche a ${emailEnviado} en canto poidamos. Se precisas unha resposta máis rápida, chámanos ao 981 880 740.`;
                vistaExito.style.display = 'flex';
            }, 2000);
        });

        botonReiniciar.addEventListener('click', () => {
            form.reset();

            [grupoNome, grupoEmail, grupoMensaxe].forEach(g => {
                g.classList.remove('con-erro', 'enviando');
            });
            grupoAceptacion.classList.remove('con-erro');

            textoBoton.textContent = 'Enviar mensaxe →';
            if (spinner) spinner.style.display = 'none';
            botonEnviar.disabled = false;

            vistaExito.style.display = 'none';
            form.style.display = 'block';
        });
    }
    // --- BOTÓN VOLVER ARRIBA ---
    const btnArriba = document.getElementById('btnVolverArriba');

    window.addEventListener('scroll', () => {
        // Aparece cando o usuario baixa máis de 350px
        if (window.pageYOffset > 350) {
            btnArriba.classList.add('visible');
        } else {
            btnArriba.classList.remove('visible');
        }
    });

    btnArriba.addEventListener('click', () => {
        desprazamentoSuave(0, 600); // Emprega a túa función de desprazamento suave existente
    });

    // --- BARRA DE PROGRESO DE NAVEGACIÓN ---
    const barraProgreso = document.getElementById('barraProgreso');

    window.addEventListener('scroll', () => {
        const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
        if (alturaTotal > 0 && barraProgreso) {
            const progreso = (window.pageYOffset / alturaTotal) * 100;
            barraProgreso.style.width = `${progreso}%`;
        }
    });
});