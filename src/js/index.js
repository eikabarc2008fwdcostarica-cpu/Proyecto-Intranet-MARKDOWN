const loginForm = document.querySelector('#loginForm');
const loginMessage = document.querySelector('#loginMessage');

loginForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const username = formData.get('username')?.trim();
  const password = formData.get('password');
  const role = formData.get('role');

  if (!username || !role || !password) {
    loginMessage.textContent = 'Complete los datos requeridos.';
    return;
  }

  // Validación de contraseña solicitada por el usuario
  if (password !== 'admin123') {
    loginMessage.textContent = 'Contraseña incorrecta.';
    return;
  }

  // Prototipo únicamente: guarda sesión simulada
  localStorage.setItem('intranetSession', JSON.stringify({ username, role }));
  window.location.href = 'dashboard.html';
});