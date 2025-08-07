document.addEventListener('DOMContentLoaded', async () => {
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const userPlan = document.getElementById('user-plan');

    if (!userName || !userEmail || !userPlan) {
        console.error('No se encontraron todos los elementos de la cuenta en el DOM.');
        return;
    }

    try {
        const { data: user } = await axios.get('/api/users/me', { withCredentials: true });

        if (user) {
            userName.textContent = user.name;
            userEmail.textContent = user.email;
            userPlan.textContent = user.plan || 'Ninguno'; // Muestra el plan o 'Ninguno' si no está definido
        }
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        if (error.response && error.response.status === 401) {
            window.location.href = '../login/index.html';
        }
    }
});