async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = {
        nombre: document.getElementById('nombre').value,
        cedula_nit: document.getElementById('cedula').value,
        telefono: document.getElementById('telefono').value,
        direccion: document.getElementById('direccion').value,
        correo: document.getElementById('email').value,
        tipo_servicio: document.getElementById('servicio').value,
        mensaje: document.getElementById('mensaje').value
    };

    try {
        // Primero registramos el cliente
        const clienteResponse = await fetch('http://localhost:8000/api/servicios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cedula_nit: formData.cedula_nit,
                nombre: formData.nombre,
                telefono: formData.telefono,
                direccion: formData.direccion,
                correo: formData.correo,
                habeas_data: true
            })
        });

        if (!clienteResponse.ok) {
            throw new Error('Error al registrar el cliente');
        }

        // Luego creamos la solicitud de servicio
        const solicitudResponse = await fetch('http://localhost:8000/api/servicios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fk_cedula_nit_cliente: formData.cedula_nit,
                fk_id_c_servicio: formData.tipo_servicio,
                mensaje: formData.mensaje,
                estado_solicitud: 'NUEVA'
            })
        });

        if (!solicitudResponse.ok) {
            throw new Error('Error al crear la solicitud de servicio');
        }

        alert('¡Solicitud enviada con éxito!');
        event.target.reset();

    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al procesar su solicitud. Por favor, intente nuevamente.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});