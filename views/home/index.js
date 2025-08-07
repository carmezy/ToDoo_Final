document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    const modal = document.getElementById('modal-servicio');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalDescripcion = document.getElementById('modal-descripcion');
    const botonCerrar = document.querySelector('.cerrar-modal');

    function abrirModal(evento) {
        const tarjeta = evento.currentTarget;
        const titulo = tarjeta.dataset.titulo;
        const descripcionLarga = tarjeta.dataset.descripcionLarga;

        modalTitulo.textContent = titulo;
        modalDescripcion.textContent = descripcionLarga;

        modal.classList.add('visible');
    }

    function cerrarModal() {
        modal.classList.remove('visible');
    }

    cards.forEach(card => {
        card.addEventListener('click', abrirModal);
    });

    botonCerrar.addEventListener('click', cerrarModal);

    window.addEventListener('click', function(evento) {
        if (evento.target == modal) {
            cerrarModal();
        }
    });

    window.addEventListener('keydown', function(evento) {
        if (evento.key === 'Escape' && modal.classList.contains('visible')) {
            cerrarModal();
        }
    });
});
