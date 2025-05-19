const form = document.getElementById('contactForm');
const statusDiv = document.getElementById('form-status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusDiv.textContent = '';
  statusDiv.className = 'form-status';

  const formData = {
    nombre: form.nombre.value.trim(),
    correo: form.email.value.trim(),
    telefono: form.telefono.value.trim(),
    direccion: form.direccion.value.trim(),
    tipo_servicio: form.servicio.value,
    mensaje: form.mensaje.value.trim(),
  };

  console.log('Datos a enviar:', formData);

  try {
    const response = await fetch('', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }

    const result = await response.json();
    console.log('Respuesta backend:', result);

    statusDiv.textContent = 'Solicitud enviada correctamente.';
    statusDiv.classList.add('success');

    form.reset();
  } catch (error) {
    console.error('Error enviando solicitud:', error);
    statusDiv.textContent = 'Error al enviar la solicitud. Intenta de nuevo.';
    statusDiv.classList.add('error');
  }
});
