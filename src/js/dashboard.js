// dashboard.js — Panel principal · Intranet Escolar
// Lee la sesión guardada por login.js (localStorage o sessionStorage).
// Verifica expiración, muestra datos del usuario y aplica visibilidad por rol.

const SESSION_KEY = 'intranetSession';

// ── Obtener sesión (localStorage primero, luego sessionStorage) ────────────
function getSession() {
  try {
    const fromLocal   = localStorage.getItem(SESSION_KEY);
    const fromSession = sessionStorage.getItem(SESSION_KEY);
    return JSON.parse(fromLocal || fromSession || 'null');
  } catch (_) {
    return null;
  }
}

const session = getSession();

// ── Redirigir si no hay sesión o está expirada ─────────────────────────────
if (!session || (session.expiresAt && Date.now() > session.expiresAt)) {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = 'login.html';
} else {
  // ── Mostrar datos del usuario ──────────────────────────────────────────
  const labels = {
    administracion: 'Administración',
    docente:        'Docente',
    estudiante:     'Estudiante / Familia'
  };

  const displayName = session.fullName || session.username;
  const roleLabel   = labels[session.role] || session.role;

  const welcomeEl = document.getElementById('welcomeTitle');
  const roleEl    = document.getElementById('roleDescription');

  if (welcomeEl) welcomeEl.textContent = `Bienvenido, ${displayName}`;
  if (roleEl)    roleEl.textContent    = `Rol actual: ${roleLabel}`;

  // ── Aplicar visibilidad de módulos según rol ───────────────────────────
  document.querySelectorAll('.module-card').forEach((card) => {
    const roles = (card.dataset.roles || '').split(',');
    card.classList.toggle('hidden', !roles.includes(session.role));
  });

  // ── Expiración automática por inactividad ──────────────────────────────
  let inactivityTimer;

  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      alert('Tu sesión ha expirado por inactividad. Vuelve a iniciar sesión.');
      logout();
    }, session.expiresAt - Date.now());
  }

  ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, resetInactivityTimer, { passive: true });
  });

  resetInactivityTimer();
}

// ── Cierre de sesión ───────────────────────────────────────────────────────
function logout() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = 'login.html';
}

document.getElementById('logoutButton')?.addEventListener('click', logout);
