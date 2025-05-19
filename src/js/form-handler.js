// ✅ NUEVA configuración base de la API
const BASE_API_URL = 'http://localhost:3000/api';

// Función para mostrar mensajes
function mostrarMensaje(elemento, mensaje, tipo = 'error') {
    elemento.textContent = mensaje;
    elemento.className = `form-status ${tipo}`;
    elemento.style.display = 'block';

    if (tipo === 'error') {
        setTimeout(() => {
            elemento.style.display = 'none';
        }, 5000);
    }
}

// Función para validar la respuesta del servidor
async function validarRespuesta(response) {
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        throw new Error('El servidor no respondió con JSON válido');
    }
    return response.json();
}

// 🚀 Envío rápido vía botón de WhatsApp
document.getElementById('whatsappButton').addEventListener('click', async function(e) {
    e.preventDefault();

    const nombre = document.getElementById('whatsappNombre').value;
    const telefono = document.getElementById('whatsappTelefono').value;
    const direccion = document.getElementById('whatsappDireccion').value;
    const formStatus = document.getElementById('whatsapp-status');

    if (!nombre || !telefono) {
        mostrarMensaje(formStatus, 'Por favor, complete los campos requeridos (nombre y teléfono)', 'error');
        return;
    }

    try {
        console.log('🚀 Enviando datos de WhatsApp:', { nombre, telefono, direccion });
        console.log('📡 URL:', `${BASE_API_URL}/servicios/`);

        const response = await fetch(`${BASE_API_URL}/servicios/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                telefono,
                direccion,
                tipoContacto: 'whatsapp'
            })
        });

        console.log('📥 Respuesta recibida:', response.status, response.statusText);

        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const data = await response.json();
        console.log('📦 Datos recibidos:', data);

        const mensaje = `Hola, soy ${nombre}. Necesito información sobre sus servicios.`;
        this.href = `https://wa.me/573116381384?text=${encodeURIComponent(mensaje)}`;
        window.open(this.href, '_blank');

        mostrarMensaje(formStatus, '¡Gracias por contactarnos! Te redirigiremos a WhatsApp para continuar con tu solicitud.', 'success');
    } catch (error) {
        console.error('❌ Error en el formulario de WhatsApp:', error);
        mostrarMensaje(formStatus, `Error al procesar su solicitud: ${error.message}. Por favor, intente nuevamente o contacte a soporte.`, 'error');
    }
});

// Validación de datos del formulario principal
function validarDatosFormulario(formData) {
    const errores = [];

    if (!formData.nombre || formData.nombre.length < 3) {
        errores.push('El nombre debe tener al menos 3 caracteres');
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errores.push('El email no es válido');
    }

    if (!formData.telefono || !/^[0-9+\-\s()]{7,}$/.test(formData.telefono)) {
        errores.push('El teléfono no es válido');
    }

    const tiposServicioValidos = [
        'MANTENIMIENTO',
        'INSTALACION',
        'CONSULTORIA',
        'REPARACION',
        'DESARROLLO',
        'SOPORTE_TECNICO',
        'OTRO'
    ];

    if (formData.tipoServicio && !tiposServicioValidos.includes(formData.tipoServicio)) {
        errores.push(`El tipo de servicio debe ser uno de: ${tiposServicioValidos.join(', ')}`);
    }

    return errores;
}

// 🚀 Envío del formulario principal
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formStatus = document.getElementById('form-status');
    formStatus.style.display = 'block';

    const formData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        direccion: document.getElementById('direccion').value,
        tipoServicio: document.getElementById('servicio').value,
        mensaje: document.getElementById('mensaje').value,
        habeasdata: document.getElementById('habeasdata').checked
    };

    try {
        console.log('🚀 Iniciando envío de datos:', formData);
        console.log('📡 URL:', `${BASE_API_URL}/servicios`);

        const response = await fetch(`${BASE_API_URL}/servicios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        console.log('📥 Respuesta recibida:', response.status, response.statusText);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Error del servidor: ${response.status}`);
        }

        const data = await response.json();
        console.log('📦 Datos recibidos:', data);

        if (data.success) {
            mostrarMensaje(formStatus, '¡Gracias por contactarnos! Hemos recibido tu solicitud correctamente.', 'success');
            document.getElementById('contactForm').reset();
        } else {
            throw new Error(data.error || 'Error al procesar la solicitud');
        }
    } catch (error) {
        console.error('❌ Error en el formulario:', error);
        mostrarMensaje(formStatus, `Error al procesar su solicitud: ${error.message}. Por favor, intente nuevamente o contacte a soporte.`, 'error');
    }
});
