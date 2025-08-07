document.addEventListener('DOMContentLoaded', () => {
    // La ruta debe ser relativa al archivo HTML que la carga.
    fetch('../components/navbar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar la barra de navegación.');
            }
            return response.text();
        })
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);

            // Configurar el menú hamburguesa para móviles
            const navToggle = document.querySelector('.nav-toggle');
            const navMenu = document.querySelector('.navbar ul');

            if (navToggle && navMenu) {
                navToggle.addEventListener('click', () => {
                    navMenu.classList.toggle('open');
                });
            }

            // Actualizar la barra de navegación según el contexto (página y autenticación)
            updateNavbar();
        })
        .catch(error => {
            console.error('Error al cargar el componente de navegación:', error);
        });
});

/**
 * Actualiza la barra de navegación dinámicamente según la página actual
 * y el estado de autenticación del usuario.
 */
async function updateNavbar() {
    const loginLink = document.querySelector('#login-link');
    const registerLink = document.querySelector('#register-link');
    const navMenuList = document.querySelector('.navbar ul');

    if (!loginLink || !registerLink || !navMenuList) {
        console.error('No se encontraron los elementos necesarios en la barra de navegación.');
        return;
    }

    try {
        // 1. VERIFICAR SI EL USUARIO ESTÁ AUTENTICADO
        await axios.get('/api/users/me', { withCredentials: true });

        // --- VISTA PARA USUARIO AUTENTICADO ---
        // Si la petición tiene éxito, el usuario está logueado.
        loginLink.parentElement.remove();
        registerLink.parentElement.remove();

        // Añadir enlace "Mi Cuenta"
        const accountLi = document.createElement('li');
        accountLi.innerHTML = `<a href="/views/cuenta/index.html" class="nav-link">Mi Cuenta</a>`;
        navMenuList.appendChild(accountLi);

        // Añadir botón "Cerrar Sesión"
        const logoutLi = document.createElement('li');
        logoutLi.innerHTML = `<button id="logout-btn" class="nav-button">Cerrar Sesión</button>`;
        navMenuList.appendChild(logoutLi);

        document.querySelector('#logout-btn').addEventListener('click', async () => {
            await axios.get('/api/logout', { withCredentials: true });
            window.location.href = '/';
        });

    } catch (error) {
        // --- VISTA PARA USUARIO NO AUTENTICADO ---
        // Si la petición falla (ej. 401), el usuario no está logueado.
        // Ahora, ajustamos la vista según la página actual.
        const path = window.location.pathname;

        if (path.includes('/login')) {
            // Si está en la página de login, ocultar el botón de login.
            loginLink.style.display = 'none';
        } else if (path.includes('/signup')) {
            // Si está en la página de registro, ocultar el botón de registro.
            registerLink.style.display = 'none';
        }
        // Si está en home u otra página, se muestran ambos por defecto.
    }
}