const loginForm = document.querySelector('#loginForm');
const loginMessage = document.querySelector('#loginMessage');

loginForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const username = formData.get('username')?.trim();
  const role = formData.get('role');

  if (!username || !role) {
    loginMessage.textContent = 'Complete los datos requeridos.';
    return;
  }

  // Prototipo únicamente: NO valida credenciales reales.
  // El compañero encargado de autenticación debe reemplazar este flujo
  // por una validación segura en backend y nunca almacenar contraseñas en texto plano.
  localStorage.setItem('intranetSession', JSON.stringify({ username, role }));
  window.location.href = 'dashboard.html';
});