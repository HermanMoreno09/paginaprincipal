document.addEventListener('DOMContentLoaded', function() {
    // Script para el menú de navegación móvil (hamburguesa)
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            navToggle.classList.toggle('active'); // Para cambiar el ícono de hamburguesa si es necesario
        });
    }

    // Script para el formulario de contacto
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Evitar el envío real del formulario por ahora

            // Aquí podrías añadir lógica para enviar el formulario vía AJAX (Fetch API)
            // Por ahora, solo simularemos el envío y limpiaremos el formulario.

            console.log("Intentando enviar datos del formulario...");
            // Simulación de envío (puedes reemplazar esto con una llamada fetch real)
            setTimeout(() => {
                if (formStatus) {
                    formStatus.textContent = "¡Gracias! Tu solicitud ha sido enviada.";
                    formStatus.className = 'success'; // Para estilizar el mensaje de éxito
                }
                contactForm.reset(); // Limpiar los campos del formulario

                // Opcional: quitar el mensaje después de unos segundos
                setTimeout(() => {
                    if (formStatus) formStatus.textContent = '';
                }, 5000);

            }, 1000);
        });
    }

    // Script para el año actual en el footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Smooth scroll para anclas (opcional, pero mejora la UX)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefAttribute = this.getAttribute('href');
            // Asegurarse de que no es solo un "#" sin nada más
            if (hrefAttribute.length > 1) {
                const targetElement = document.querySelector(hrefAttribute);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- FUNCIONALIDAD DE SEGUIMIENTO DE SERVICIO (LOGIN) ---
    const navSeguimientoServicio = document.getElementById('navSeguimientoServicio');
    const loginModal = document.getElementById('loginModal');
    const closeLoginModalButton = document.getElementById('closeLoginModal');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const clientInterfaceSection = document.getElementById('clientInterfaceSection');
    const welcomeClientMessage = document.getElementById('welcomeClientMessage');
    const clientServiceInfo = document.getElementById('clientServiceInfo');
    const logoutButton = document.getElementById('logoutButton');

    // Simulación de backend y JWT
    const FAKE_BACKEND_URL = '/api/login'; // URL de ejemplo
    let currentUserToken = localStorage.getItem('jwtToken');
    let currentUserName = localStorage.getItem('userName');

    function showLoginModal() {
        if (loginModal) loginModal.style.display = 'flex';
    }

    function hideLoginModal() {
        if (loginModal) loginModal.style.display = 'none';
        if (loginError) loginError.style.display = 'none';
        if (loginForm) loginForm.reset();
    }

    function showClientInterface(userName) {
        if (clientInterfaceSection) clientInterfaceSection.style.display = 'block';
        if (welcomeClientMessage) welcomeClientMessage.textContent = `Bienvenido/a, ${userName}. Aquí podrá visualizar la información de sus servicios.`;
        // Aquí se haría la llamada a la API para cargar datos del servicio del cliente
        if (clientServiceInfo) clientServiceInfo.innerHTML = `<p>Cargando información de sus servicios...</p>`;
        // Simulación de carga de datos
        setTimeout(() => {
            if (clientServiceInfo) clientServiceInfo.innerHTML = `<p>Su servicio de "Instalación Eléctrica" (Ref: #S12345) está actualmente <strong>En Progreso</strong>.</p><p>Última actualización: Hace 2 horas.</p>`;
        }, 1500);

        // Desplazarse a la sección
        clientInterfaceSection.scrollIntoView({ behavior: 'smooth' });
    }

    function hideClientInterface() {
        if (clientInterfaceSection) clientInterfaceSection.style.display = 'none';
    }

    function handleLogout() {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userName');
        currentUserToken = null;
        currentUserName = null;
        hideClientInterface();
        // Opcional: redirigir o mostrar mensaje de logout
        alert('Sesión cerrada exitosamente.');
    }

    // Verificar si ya hay un token al cargar la página
    if (currentUserToken && currentUserName) {
        showClientInterface(currentUserName);
    }


    if (navSeguimientoServicio) {
        navSeguimientoServicio.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentUserToken && currentUserName) { // Si ya está logueado, llevarlo a la sección
                showClientInterface(currentUserName);
            } else {
                showLoginModal();
            }
        });
    }

    if (closeLoginModalButton) {
        closeLoginModalButton.addEventListener('click', hideLoginModal);
    }

    // Cerrar modal si se hace clic fuera del contenido
    if (loginModal) {
        loginModal.addEventListener('click', (event) => {
            if (event.target === loginModal) {
                hideLoginModal();
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = loginForm.username.value;
            const password = loginForm.password.value; // En una app real, NUNCA enviar passwords así directamente sin HTTPS.

            if (loginError) loginError.style.display = 'none';

            // --- SIMULACIÓN DE LLAMADA AL BACKEND ---
            console.log(`Simulando login para usuario: ${username}`);
            try {
                // Simular una demora de red
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Lógica de simulación de backend
                if (username === "cliente@serviya.com" && password === "password123") {
                    const fakeJwtToken = "fake_jwt_token_" + Math.random().toString(36).substring(7);
                    const userNameForDisplay = "Cliente Serviya"; // Podría venir del backend
                    
                    localStorage.setItem('jwtToken', fakeJwtToken);
                    localStorage.setItem('userName', userNameForDisplay);
                    currentUserToken = fakeJwtToken;
                    currentUserName = userNameForDisplay;

                    console.log("Login simulado exitoso. Token:", fakeJwtToken);
                    hideLoginModal();
                    showClientInterface(userNameForDisplay);
                } else {
                    throw new Error("Usuario o contraseña incorrectos.");
                }
            } catch (error) {
                console.error("Error en login simulado:", error.message);
                if (loginError) {
                    loginError.textContent = error.message;
                    loginError.style.display = 'block';
                }
            }
            // --- FIN SIMULACIÓN ---
        });
    }
    
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }


    // --- FUNCIONALIDAD PARA BOTÓN DE WHATSAPP CON PREREQUISITOS ---
    const whatsappButton = document.getElementById('whatsappButton');
    const whatsappNombre = document.getElementById('whatsappNombre');
    const whatsappTelefono = document.getElementById('whatsappTelefono');
    // const whatsappDireccion = document.getElementById('whatsappDireccion'); // Dirección es opcional

    function validateWhatsAppInputs() {
        let isValid = true;
        if (!whatsappNombre || whatsappNombre.value.trim() === '') {
            isValid = false;
            // Opcional: marcar error en el campo whatsappNombre
        }
        if (!whatsappTelefono || whatsappTelefono.value.trim() === '') {
            isValid = false;
            // Opcional: marcar error en el campo whatsappTelefono
        }
        // Aquí podrías añadir validaciones más específicas (ej. formato de teléfono)

        return isValid;
    }

    function updateWhatsAppButtonState() {
        if (!whatsappButton) return;
        if (validateWhatsAppInputs()) {
            whatsappButton.classList.remove('disabled');
            whatsappButton.setAttribute('aria-disabled', 'false');
            // Podrías construir aquí el enlace wa.me con mensaje prellenado si quieres
            // let message = `Hola, soy ${whatsappNombre.value}. Mi teléfono es ${whatsappTelefono.value}. Necesito asistencia.`;
            // if (whatsappDireccion.value.trim() !== '') {
            //    message += ` Mi dirección es ${whatsappDireccion.value.trim()}.`;
            // }
            // whatsappButton.href = `https://wa.me/573116381384?text=${encodeURIComponent(message)}`;
        } else {
            whatsappButton.classList.add('disabled');
            whatsappButton.setAttribute('aria-disabled', 'true');
        }
    }

    if (whatsappButton) {
        // Inicializar estado del botón
        updateWhatsAppButtonState();

        // Prevenir clic si está deshabilitado
        whatsappButton.addEventListener('click', function(event) {
            if (this.classList.contains('disabled')) {
                event.preventDefault();
                alert('Por favor, complete su nombre y teléfono para activar el chat de WhatsApp.');
            }
        });
    }
    
    // Añadir listeners a los campos de WhatsApp
    [whatsappNombre, whatsappTelefono].forEach(input => {
        if (input) {
            input.addEventListener('input', updateWhatsAppButtonState);
        }
    });

});


