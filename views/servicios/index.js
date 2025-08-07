document.addEventListener('DOMContentLoaded', function() {

    // Seleccionar todos loselenentos necesarios del DOM
    const botonesVerMas = document.querySelectorAll('.btn-ver-mas');
    const modal = document.getElementById('modal-servicio');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalDescripcion = document.getElementById('modal-descripcion');
    const btnAgregarPlan = document.getElementById('btn-agregar-plan');
    
    const botonCerrar = document.querySelector('.cerrar-modal');

    // Función para abrir el modal y poblarlo con datos
    function abrirModal(evento) {
        // Encontrar la tarjeta padre del botón que fue presionado
        const tarjeta = evento.target.closest('.card-2');
        
        // Obtener los datos de los atributos data-* de la tarjeta
        const titulo = tarjeta.dataset.titulo;
        const descripcionLarga = tarjeta.dataset.descripcionLarga;
        

        // Poblar el modal con la información de la tarjeta
        modalTitulo.textContent = titulo;
        modalDescripcion.textContent = descripcionLarga;
        

        // Mostrar el modal añadiendo la clase 'visible'
        modal.classList.add('visible');
    }

    // Función para cerrar el modal
    function cerrarModal() {
        modal.classList.remove('visible');
    }

    // Añadir un event listener a cada botón "Ver más"
    botonesVerMas.forEach(boton => {
        boton.addEventListener('click', abrirModal);
    });

    // Añadir event listener al botón de cerrar del modal
    botonCerrar.addEventListener('click', cerrarModal);

    // Añadir event listener para cerrar el modal si se hace clic fuera del contenido
    window.addEventListener('click', function(evento) {
        if (evento.target == modal) {
            cerrarModal();
        }
    });

    // Opcional: Cerrar el modal con la tecla Escape
    window.addEventListener('keydown', function(evento) {
        if (evento.key === 'Escape' && modal.classList.contains('visible')) {
            cerrarModal();
        }
    });

    // --- Lógica para el botón "Agregar Plan" ---
    btnAgregarPlan.addEventListener('click', async function() {
        // 1. Obtiene el nombre del plan que se muestra en el título del modal.
        const planSeleccionado = modalTitulo.textContent;
        
        try {
            // 2. Envía la petición PATCH al backend para actualizar el plan.
            // `withCredentials: true` es crucial para enviar la cookie de sesión y autenticar al usuario.
            await axios.patch('/api/users/plan', { plan: planSeleccionado }, { withCredentials: true });
            
            // 3. Si la actualización es exitosa, redirige al usuario a su página de cuenta.
            alert(`¡Has actualizado tu plan a ${planSeleccionado}! Serás redirigido a tu cuenta.`);
            window.location.href = '../cuenta/index.html';
        } catch (error) {
            console.error('Error al actualizar el plan:', error);
            // 4. Manejo de errores.
            if (error.response && error.response.status === 401) {
                // Si el error es 401, el usuario no ha iniciado sesión.
                alert('Debes iniciar sesión para poder seleccionar un plan.');
                window.location.href = '../login/index.html';
            } else {
                alert('Ocurrió un error al seleccionar el plan. Por favor, inténtalo de nuevo.');
            }
        }
    });
    
});