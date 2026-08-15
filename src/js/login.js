// ==========================================================================
// login.js — Módulo de Autenticación · Intranet Escolar
// Autentica contra los usuarios registrados en Gestión de Usuarios
// (mismo localStorage que usuarios.js). Cumple con login_colegio.md.
// ==========================================================================

// ── Constantes de seguridad ────────────────────────────────────────────────
const MAX_FAILED_ATTEMPTS = 3;
const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 horas en ms
const SESSION_KEY         = 'intranetSession';
const USERS_KEY           = 'intranetUsers';
const ACCESS_LOG_KEY      = 'intranetAccessLogs';

// ── Elementos del DOM ──────────────────────────────────────────────────────
const loginForm      = document.getElementById('loginForm');
const loginMessage   = document.getElementById('loginMessage');
const usernameInput  = document.getElementById('username');
const passwordInput  = document.getElementById('password');
const roleSelect     = document.getElementById('role');
const rememberMeBox  = document.getElementById('rememberMe');
const loginBtn       = document.getElementById('loginBtn');
const btnText        = document.getElementById('btnText');
const btnLoading     = document.getElementById('btnLoading');
const togglePwdBtn   = document.getElementById('togglePassword');
const forgotLink     = document.getElementById('forgot-link');
const recoverSection = document.getElementById('recuperar');
const recoverForm    = document.getElementById('recoverForm');
const recoverMsg     = document.getElementById('recoverMessage');
const cancelRecover  = document.getElementById('cancelRecover');

// ── Si ya hay sesión válida, redirigir directo ─────────────────────────────
(function checkExistingSession() {
  const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
  if (!raw) return;
  try {
    const sess = JSON.parse(raw);
    if (sess && sess.expiresAt && Date.now() < sess.expiresAt) {
      window.location.href = 'dashboard.html';
    } else {
      // Sesión expirada: limpiar
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
    }
  } catch (_) {
    localStorage.removeItem(SESSION_KEY);
  }
})();

// ── Toggle mostrar/ocultar contraseña ──────────────────────────────────────
togglePwdBtn?.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  const icon = togglePwdBtn.querySelector('i');
  icon.className = isPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
  togglePwdBtn.setAttribute('aria-label',
    isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
  );
});

// ── Enlace "¿Olvidó su contraseña?" ───────────────────────────────────────
forgotLink?.addEventListener('click', (e) => {
  e.preventDefault();
  recoverSection.classList.remove('hidden');
  recoverSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.getElementById('recoverEmail').focus();
});

cancelRecover?.addEventListener('click', () => {
  recoverSection.classList.add('hidden');
  forgotLink?.focus();
});

// ── Formulario de recuperación de contraseña ───────────────────────────────
recoverForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const emailInput = document.getElementById('recoverEmail');
  const errEl      = document.getElementById('err-recoverEmail');
  const val        = emailInput.value.trim();

  clearFieldError('recoverEmail', errEl);

  if (!val) {
    setFieldError('recoverEmail', errEl, 'Ingrese su usuario o correo electrónico.');
    return;
  }

  // Simulación: verificar si el usuario existe en el sistema
  const users   = getUsers();
  const matched = users.find(u =>
    u.username.toLowerCase() === val.toLowerCase() ||
    u.email.toLowerCase()    === val.toLowerCase()
  );

  if (matched) {
    setMessage(recoverMsg,
      '✅ Se ha enviado un correo con instrucciones a la dirección asociada a la cuenta.',
      'success'
    );
  } else {
    // Por seguridad no revelamos si la cuenta existe o no
    setMessage(recoverMsg,
      '✅ Si existe una cuenta con ese usuario o correo, recibirás instrucciones en los próximos minutos.',
      'success'
    );
  }
});

// ── Validación en vivo por campo ───────────────────────────────────────────
usernameInput?.addEventListener('blur', () => {
  const errEl = document.getElementById('err-username');
  if (!usernameInput.value.trim()) {
    setFieldError('username', errEl, 'El usuario o correo es obligatorio.');
  } else {
    clearFieldError('username', errEl);
  }
});

passwordInput?.addEventListener('blur', () => {
  const errEl = document.getElementById('err-password');
  if (!passwordInput.value) {
    setFieldError('password', errEl, 'La contraseña es obligatoria.');
  } else {
    clearFieldError('password', errEl);
  }
});

roleSelect?.addEventListener('blur', () => {
  const errEl = document.getElementById('err-role');
  if (!roleSelect.value) {
    setFieldError('role', errEl, 'Seleccione un rol para continuar.');
  } else {
    clearFieldError('role', errEl);
  }
});

// ── Envío del formulario ───────────────────────────────────────────────────
loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  const roleHint = roleSelect.value;

  // Limpiar mensajes previos
  clearAllErrors();
  setMessage(loginMessage, '', '');

  // Validaciones de campos vacíos
  let hasErrors = false;

  if (!username) {
    setFieldError('username', document.getElementById('err-username'), 'Ingrese su usuario o correo.');
    hasErrors = true;
  }
  if (!password) {
    setFieldError('password', document.getElementById('err-password'), 'Ingrese su contraseña.');
    hasErrors = true;
  }
  if (!roleHint) {
    setFieldError('role', document.getElementById('err-role'), 'Seleccione su rol.');
    hasErrors = true;
  }

  if (hasErrors) return;

  // Mostrar estado de carga
  setLoading(true);

  // Simular latencia de red (prototipo)
  await delay(600);

  // Autenticar contra los usuarios del sistema (localStorage compartido)
  const result = authenticate(username, password, roleHint);
  setLoading(false);

  if (result.success) {
    // Crear sesión con expiración
    const session = {
      username:  result.user.username,
      fullName:  result.user.fullName,
      role:      result.user.role,   // rol real del sistema, no el del selector
      expiresAt: Date.now() + SESSION_DURATION_MS
    };

    if (rememberMeBox?.checked) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    // Registro de acceso en Auditoría
    logAccess(result.user.username, 'Exitoso');

    setMessage(loginMessage,
      `Bienvenido, ${result.user.fullName}. Redirigiendo…`,
      'success'
    );

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 800);

  } else {
    // Registro de acceso fallido en Auditoría
    logAccess(username, result.reason);

    setMessage(loginMessage, result.message, 'error');
  }
});

// ==========================================================================
// FUNCIONES DE AUTENTICACIÓN (contra localStorage compartido con usuarios.js)
// ==========================================================================

/**
 * Autentica un usuario contra el registro de usuarios del sistema.
 * La contraseña en prototipo se almacena/verifica en texto plano.
 * En producción, usar hashing (bcrypt) del lado del servidor.
 */
function authenticate(username, password, roleHint) {
  const users = getUsers();

  // Buscar por nombre de usuario O correo
  const user = users.find(u =>
    u.username.toLowerCase() === username.toLowerCase() ||
    u.email.toLowerCase()    === username.toLowerCase()
  );

  if (!user) {
    return {
      success: false,
      reason:  'Credenciales incorrectas',
      message: 'Usuario o contraseña incorrectos. Verifica tus datos e intenta de nuevo.'
    };
  }

  // Verificar si la cuenta está bloqueada por intentos fallidos
  if (user.status === 'bloqueado' || user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    return {
      success: false,
      reason:  'Cuenta bloqueada',
      message: 'Tu cuenta está bloqueada por exceso de intentos fallidos. Contacta a la administración para desbloquearla.'
    };
  }

  // Verificar si la cuenta está desactivada por administrador
  if (user.status === 'inactivo') {
    return {
      success: false,
      reason:  'Cuenta desactivada',
      message: 'Tu cuenta se encuentra desactivada. Comunícate con la administración del centro educativo.'
    };
  }

  // Validar contraseña
  // Prototipo: la contraseña se guarda en user.password (si existe).
  // Por compatibilidad con la semilla inicial (sin password), usamos 'admin123' como default.
  const storedPassword = user.password || 'admin123';

  if (password !== storedPassword) {
    // Incrementar contador de intentos fallidos
    user.failedAttempts = (user.failedAttempts || 0) + 1;

    // Bloquear si supera el límite
    if (user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      user.status = 'bloqueado';
    }

    saveUsers(users);

    const remaining = MAX_FAILED_ATTEMPTS - user.failedAttempts;
    if (remaining <= 0) {
      return {
        success: false,
        reason:  'Cuenta bloqueada por intentos',
        message: 'Tu cuenta ha sido bloqueada por exceso de intentos fallidos. Contacta a la administración.'
      };
    }

    return {
      success: false,
      reason:  'Contraseña incorrecta',
      message: `Contraseña incorrecta. Te quedan ${remaining} intento${remaining !== 1 ? 's' : ''} antes del bloqueo.`
    };
  }

  // Credenciales correctas: resetear intentos fallidos
  user.failedAttempts = 0;
  saveUsers(users);

  return { success: true, user };
}

// ── Helpers de localStorage ────────────────────────────────────────────────

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch (_) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function logAccess(username, status) {
  try {
    const logs = JSON.parse(localStorage.getItem(ACCESS_LOG_KEY)) || [];
    logs.unshift({
      time:   formatDateTime(new Date()),
      user:   username,
      status: status,
      ip:     'cliente local',
      device: navigator.userAgent.slice(0, 60)
    });
    // Mantener máximo 200 registros
    if (logs.length > 200) logs.pop();
    localStorage.setItem(ACCESS_LOG_KEY, JSON.stringify(logs));
  } catch (_) { /* Silencioso si falla */ }
}

// ── Helpers de UI ──────────────────────────────────────────────────────────

function setLoading(isLoading) {
  loginBtn.disabled = isLoading;
  btnText.classList.toggle('hidden', isLoading);
  btnLoading.classList.toggle('hidden', !isLoading);
}

function setMessage(el, text, type) {
  if (!el) return;
  el.textContent = text;
  el.className   = 'form-message';
  if (type) el.classList.add(type);
}

function setFieldError(fieldId, errEl, msg) {
  const field = document.getElementById(`field-${fieldId}`);
  if (field) field.classList.add('has-error');
  if (errEl) errEl.textContent = msg;
}

function clearFieldError(fieldId, errEl) {
  const field = document.getElementById(`field-${fieldId}`);
  if (field) field.classList.remove('has-error');
  if (errEl) errEl.textContent = '';
}

function clearAllErrors() {
  ['username', 'password', 'role'].forEach(id => {
    clearFieldError(id, document.getElementById(`err-${id}`));
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function formatDateTime(date) {
  const d = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const t = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return `${d} ${t}`;
}