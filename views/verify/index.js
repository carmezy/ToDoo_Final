const textInfo = document.getElementById('textInfo');


(async () => {
    try {
        const id = window.location.pathname.split('/')[2];
        const token = window.location.pathname.split('/')[3];
        
        // FIX: Usar método GET y la URL correcta del backend
        const { data } = await axios.get(`/api/users/verify/${id}/${token}`);
        
        // UX Improvement: Mostrar mensaje de éxito y redirigir después de un momento
        textInfo.textContent = `${data.message} Serás redirigido en 3 segundos...`;
        textInfo.classList.remove('text-lg');
        textInfo.classList.add('text-green-600', 'font-semibold');
        
        setTimeout(() => {
            window.location.pathname = '/login/';
        }, 3000);
    } catch (error) {
        // Mostrar el mensaje de error que envía el backend (ej. link expirado)
        textInfo.textContent = error.response.data.error;
        textInfo.classList.remove('text-lg');
        textInfo.classList.add('text-red-600', 'font-semibold');
    }
})();