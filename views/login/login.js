console.log('validamos el formulario de login');

const form = document.querySelector('#form');
const emailInput = document.querySelector('#email-input');
const passwordInput = document.querySelector('#password-input');
const formBtn = document.querySelector('#form-btn');
const errorText = document.querySelector('#error-text');

// Regex validations
const EMAIL_VALIDATION = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_VALIDATION = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

// Función para validar si todos los campos son válidos
const validateForm = () => {
  const isEmailValid = EMAIL_VALIDATION.test(emailInput.value);
  const isPasswordValid = PASSWORD_VALIDATION.test(passwordInput.value);
  
  formBtn.disabled = !(isEmailValid && isPasswordValid);
};

// Eventos de validación
emailInput.addEventListener('input', e => {
  const emailValidation = EMAIL_VALIDATION.test(e.target.value);
  
  if (e.target.value === '') {
    e.target.classList.remove('outline-red-700', 'outline-green-700');
    e.target.classList.add('focus:outline-indigo-700');
    errorText.textContent = '';
  } else if (emailValidation) {
    e.target.classList.remove('focus:outline-indigo-700', 'outline-red-700');
    e.target.classList.add('outline-green-700');
    errorText.textContent = '';
  } else {
    e.target.classList.remove('focus:outline-indigo-700', 'outline-green-700');
    e.target.classList.add('outline-red-700');
    errorText.textContent = 'Por favor ingresa un email válido';
  }
  
  validateForm();
});

passwordInput.addEventListener('input', e => {
  const passwordValidation = PASSWORD_VALIDATION.test(e.target.value);
  
  if (e.target.value === '') {
    e.target.classList.remove('outline-red-700', 'outline-green-700');
    e.target.classList.add('focus:outline-indigo-700');
    errorText.textContent = '';
  } else if (passwordValidation) {
    e.target.classList.remove('focus:outline-indigo-700', 'outline-red-700');
    e.target.classList.add('outline-green-700');
    errorText.textContent = '';
  } else {
    e.target.classList.remove('focus:outline-indigo-700', 'outline-green-700');
    e.target.classList.add('outline-red-700');
    errorText.textContent = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número';
  }
  
  validateForm();
});

// Evento para enviar el formulario
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (!formBtn.disabled) {
    try {
      formBtn.disabled = true;
      formBtn.textContent = 'Iniciando sesión...';
      
      // Aquí iría la llamada a tu API de login
      // const response = await axios.post('/api/login', {
      //   email: emailInput.value,
      //   password: passwordInput.value
      // });
      
      // Simulamos una respuesta exitosa después de 1.5 segundos
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mostrar mensaje de éxito
      errorText.textContent = '';
      errorText.classList.remove('text-red-600');
      errorText.classList.add('text-green-600');
      errorText.textContent = '¡Inicio de sesión exitoso! Redirigiendo...';
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        window.location.href = '../todos/index.html'; // Cambia esta URL por tu ruta de dashboard
      }, 2000);
      
    } catch (error) {
      // Manejo de errores
      errorText.textContent = 'Credenciales incorrectas. Por favor intenta nuevamente.';
      formBtn.disabled = false;
      formBtn.textContent = 'Iniciar sesión';
      
      // Resaltar campos en rojo
      emailInput.classList.remove('outline-green-700');
      emailInput.classList.add('outline-red-700');
      passwordInput.classList.remove('outline-green-700');
      passwordInput.classList.add('outline-red-700');
    }
  }
});