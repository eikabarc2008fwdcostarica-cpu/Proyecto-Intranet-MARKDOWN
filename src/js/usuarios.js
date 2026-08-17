// ==========================================================================
// Gestión de Usuarios - Lógica de Negocio y Motor de Estado
// ==========================================================================

// 1. VERIFICACIÓN DE SESIÓN
const session = JSON.parse(localStorage.getItem('intranetSession') || 'null');
if (!session) {
  window.location.href = 'login.html';
} else if (session.role !== 'administracion') {
  window.location.href = 'dashboard.html';
}

// 2. DATOS SEMILLA E INICIALIZACIÓN
const seedUsers = [
  {
    id: 1,
    fullName: 'Administrador Principal',
    username: 'admin',
    email: 'admin@intranet.edu',
    role: 'administrador',
    status: 'activo',
    profilePic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    failedAttempts: 0,
    twoFactor: true,
    details: 'Acceso total de configuración'
  },
  {
    id: 2,
    fullName: 'Andrés Mora',
    username: 'amora',
    email: 'andres.mora@intranet.edu',
    role: 'profesor',
    status: 'activo',
    profilePic: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    failedAttempts: 0,
    twoFactor: false,
    details: { materias: 'Matemáticas, Física', horario: 'Lunes a Viernes 07:00 - 15:00' }
  },
  {
    id: 3,
    fullName: 'Alanie Castro',
    username: 'acastro',
    email: 'alanie.castro@estudiante.edu',
    role: 'estudiante',
    status: 'activo',
    profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    failedAttempts: 0,
    twoFactor: false,
    details: { grado: '10mo Año - Sección A', encargado: 'Eiker Barquero', historial: ['Matemáticas: 95', 'Física: 90', 'Español: 88'] }
  },
  {
    id: 4,
    fullName: 'Eiker Barquero',
    username: 'ebarquero',
    email: 'eiker.barquero@intranet.edu',
    role: 'encargado',
    status: 'activo',
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    failedAttempts: 0,
    twoFactor: false,
    details: { estudiantes: ['Alanie Castro'], canales: 'Email' }
  },
  {
    id: 5,
    fullName: 'Sofia Rojas',
    username: 'srojas',
    email: 'sofia.rojas@estudiante.edu',
    role: 'estudiante',
    status: 'activo',
    profilePic: '',
    failedAttempts: 0,
    twoFactor: false,
    details: { grado: '10mo Año - Sección B', encargado: 'Carlos Rojas', historial: ['Matemáticas: 85', 'Ciencias: 92'] }
  },
  {
    id: 6,
    fullName: 'Carlos Rojas',
    username: 'crojas',
    email: 'carlos.rojas@intranet.edu',
    role: 'encargado',
    status: 'activo',
    profilePic: '',
    failedAttempts: 1,
    twoFactor: false,
    details: { estudiantes: ['Sofia Rojas'], canales: 'Email, Push' }
  },
  {
    id: 7,
    fullName: 'Beatriz Salazar',
    username: 'bsalazar',
    email: 'beatriz.salazar@intranet.edu',
    role: 'profesor',
    status: 'inactivo',
    profilePic: '',
    failedAttempts: 0,
    twoFactor: false,
    details: { materias: 'Ciencias, Química', horario: 'Martes y Jueves 08:00 - 12:00' }
  }
];

const seedPermissions = {
  administrador: { usuarios: 'rw', academico: 'rw', comunicados: 'rw', auditoria: 'rw' },
  profesor: { usuarios: 'r', academico: 'rw', comunicados: 'rw', auditoria: 'r' },
  estudiante: { usuarios: 'none', academico: 'r', comunicados: 'r', auditoria: 'none' },
  encargado: { usuarios: 'none', academico: 'r', comunicados: 'r', auditoria: 'none' }
};

const seedChangeLogs = [
  { time: '14/08/2026 14:10:02', user: 'admin', action: 'Configuración inicial del módulo de gestión de usuarios' },
  { time: '14/08/2026 15:32:15', user: 'admin', action: 'Registro semilla de Estudiantes y Profesores' }
];

const seedAccessLogs = [
  { time: '14/08/2026 16:01:45', user: 'admin', status: 'Exitoso', ip: '192.168.1.55', device: 'Chrome / Windows' },
  { time: '14/08/2026 16:15:30', user: 'amora', status: 'Exitoso', ip: '192.168.1.102', device: 'Safari / iPhone' },
  { time: '14/08/2026 16:22:11', user: 'ebarquero', status: 'Fallido (Contraseña Incorrecta)', ip: '186.15.22.4', device: 'Chrome / Android' }
];

const seedAlerts = [
  { time: '14/08/2026 14:10:05', message: 'Sistema de Notificaciones Iniciado' },
  { time: '14/08/2026 16:22:12', message: 'Alerta de seguridad: Intento de inicio fallido de cuenta [ebarquero]' }
];

// Obtener o inicializar almacenamiento local
let state = {
  users: JSON.parse(localStorage.getItem('intranetUsers')) || seedUsers,
  permissions: JSON.parse(localStorage.getItem('intranetRolesPermissions')) || seedPermissions,
  changeLogs: JSON.parse(localStorage.getItem('intranetChangeLogs')) || seedChangeLogs,
  accessLogs: JSON.parse(localStorage.getItem('intranetAccessLogs')) || seedAccessLogs,
  alerts: JSON.parse(localStorage.getItem('intranetSystemAlerts')) || seedAlerts,
  notifConfig: JSON.parse(localStorage.getItem('intranetNotificationConfig')) || { email: true, sms: false, push: true }
};

function saveState() {
  localStorage.setItem('intranetUsers', JSON.stringify(state.users));
  localStorage.setItem('intranetRolesPermissions', JSON.stringify(state.permissions));
  localStorage.setItem('intranetChangeLogs', JSON.stringify(state.changeLogs));
  localStorage.setItem('intranetAccessLogs', JSON.stringify(state.accessLogs));
  localStorage.setItem('intranetSystemAlerts', JSON.stringify(state.alerts));
  localStorage.setItem('intranetNotificationConfig', JSON.stringify(state.notifConfig));
}

// Inicializar al cargar
saveState();

// 3. ESTRUCTURA DE COMPORTAMIENTO GENERAL (PAGINACIÓN, BÚSQUEDA Y FILTRADO)
const itemsPerPage = 5;
let activeFilters = {
  estudiantes: { search: '', grado: '', status: '', page: 1, sortField: 'fullName', sortDir: 'asc' },
  profesores: { search: '', materia: '', status: '', page: 1, sortField: 'fullName', sortDir: 'asc' },
  padres: { search: '', status: '', page: 1, sortField: 'fullName', sortDir: 'asc' },
  cuentas: { search: '', status: '', page: 1 }
};

// 4. MANEJO DE VISTAS (TAB NAVIGATION)
const navButtons = document.querySelectorAll('.nav-item-btn');
const sectionContents = document.querySelectorAll('.section-content');

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    navButtons.forEach(b => b.classList.remove('active'));
    sectionContents.forEach(c => c.classList.add('hidden'));

    btn.classList.add('active');
    const targetSection = btn.dataset.section;
    const targetEl = document.getElementById(`section-${targetSection}`);
    if (targetEl) targetEl.classList.remove('hidden');

    renderActiveSection(targetSection);
  });
});

function renderActiveSection(section) {
  showSkeletonLoader();
  setTimeout(() => {
    if (section === 'dashboard') renderDashboard();
    else if (section === 'estudiantes') renderEstudiantes();
    else if (section === 'profesores') renderProfesores();
    else if (section === 'padres') renderPadres();
    else if (section === 'cuentas') renderCuentas();
    else if (section === 'roles') renderRolesMatrix();
    else if (section === 'notificaciones') renderNotificaciones();
    else if (section === 'auditoria') renderAuditoria();
  }, 250);
}

// Simular carga de skeleton
function showSkeletonLoader() {
  const activeSection = document.querySelector('.section-content:not(.hidden)');
  if (!activeSection) return;
  
  const skeleton = activeSection.querySelector('.skeleton-loader');
  const table = activeSection.querySelector('.custom-table');
  const pagination = activeSection.querySelector('.pagination');
  const emptyState = activeSection.querySelector('.empty-state');
  
  if (skeleton) skeleton.classList.remove('hidden');
  if (table) table.classList.add('hidden');
  if (pagination) pagination.classList.add('hidden');
  if (emptyState) emptyState.classList.add('hidden');
}

function hideSkeletonLoader() {
  const activeSection = document.querySelector('.section-content:not(.hidden)');
  if (!activeSection) return;
  
  const skeleton = activeSection.querySelector('.skeleton-loader');
  const table = activeSection.querySelector('.custom-table');
  const pagination = activeSection.querySelector('.pagination');
  
  if (skeleton) skeleton.classList.add('hidden');
  if (table) table.classList.remove('hidden');
  if (pagination) pagination.classList.remove('hidden');
}

// 5. SECCIÓN PANEL RESUMEN (DASHBOARD)
function renderDashboard() {
  const estudiantes = state.users.filter(u => u.role === 'estudiante');
  const profesores = state.users.filter(u => u.role === 'profesor');
  const padres = state.users.filter(u => u.role === 'encargado');
  const activas = state.users.filter(u => u.status === 'activo');
  const inactivas = state.users.filter(u => u.status !== 'activo');

  document.getElementById('stat-estudiantes').textContent = estudiantes.length;
  document.getElementById('stat-profesores').textContent = profesores.length;
  document.getElementById('stat-padres').textContent = padres.length;
  document.getElementById('stat-activas').textContent = activas.length;
  document.getElementById('stat-inactivas').textContent = `${inactivas.length} inactivas o bloqueadas`;

  // Renders de logs breves en mini listas
  const miniAccessLog = document.getElementById('miniAccessLog');
  miniAccessLog.innerHTML = state.accessLogs.slice(0, 4).map(log => `
    <li class="log-item">
      <span class="log-time">${log.time}</span>
      <p class="log-desc">
        Usuario <strong class="log-user">${log.user}</strong>: Intento <strong>${log.status}</strong>
      </p>
    </li>
  `).join('');

  const miniChangeLog = document.getElementById('miniChangeLog');
  miniChangeLog.innerHTML = state.changeLogs.slice(0, 4).map(log => `
    <li class="log-item">
      <span class="log-time">${log.time}</span>
      <p class="log-desc">
        <strong class="log-user">${log.user}</strong>: ${log.action}
      </p>
    </li>
  `).join('');
}

// 6. SECCIÓN ESTUDIANTES
function renderEstudiantes() {
  const f = activeFilters.estudiantes;
  let items = state.users.filter(u => u.role === 'estudiante');

  // Filtros
  if (f.search) {
    items = items.filter(u => 
      u.fullName.toLowerCase().includes(f.search.toLowerCase()) || 
      u.username.toLowerCase().includes(f.search.toLowerCase())
    );
  }
  if (f.grado) {
    items = items.filter(u => u.details && u.details.grado === f.grado);
  }
  if (f.status) {
    items = items.filter(u => u.status === f.status);
  }

  // Ordenamiento
  sortItems(items, f.sortField, f.sortDir);

  // Paginación
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  if (f.page > totalPages) f.page = totalPages;
  const startIndex = (f.page - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  const tbody = document.getElementById('tbody-estudiantes');
  const empty = document.getElementById('empty-estudiantes');

  if (totalItems === 0) {
    tbody.innerHTML = '';
    empty.classList.remove('hidden');
  } else {
    empty.classList.add('hidden');
    tbody.innerHTML = paginatedItems.map(user => `
      <tr>
        <td>
          <div class="avatar-cell">
            ${user.profilePic 
              ? `<img src="${user.profilePic}" alt="Foto de ${user.fullName}" class="avatar-img">`
              : `<div class="avatar-placeholder">${user.fullName.charAt(0)}</div>`
            }
            <div>
              <strong>${user.fullName}</strong>
              <div class="muted" style="font-size: 0.8rem;">${user.email}</div>
            </div>
          </div>
        </td>
        <td>${user.username}</td>
        <td>${user.details?.grado || '-'}</td>
        <td>${user.details?.encargado || 'Ninguno'}</td>
        <td><span class="status-badge ${user.status}">${user.status}</span></td>
        <td>
          <button class="btn-icon" title="Ver Ficha Completa" onclick="openDetail(${user.id})"><i class="fa-solid fa-eye"></i></button>
          <button class="btn-icon" title="Editar" onclick="openEdit(${user.id})"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="btn-icon" title="Desactivar / Activar" onclick="toggleUserStatus(${user.id})"><i class="fa-solid fa-arrows-rotate"></i></button>
        </td>
      </tr>
    `).join('');
  }

  renderPagination(document.getElementById('pag-estudiantes'), totalPages, f.page, (newPage) => {
    f.page = newPage;
    renderEstudiantes();
  });
  updateSortHeaders('table-estudiantes', f.sortField, f.sortDir);
  hideSkeletonLoader();
}

// 7. SECCIÓN PROFESORES
function renderProfesores() {
  const f = activeFilters.profesores;
  let items = state.users.filter(u => u.role === 'profesor');

  // Filtros
  if (f.search) {
    items = items.filter(u => 
      u.fullName.toLowerCase().includes(f.search.toLowerCase()) || 
      u.username.toLowerCase().includes(f.search.toLowerCase())
    );
  }
  if (f.materia) {
    items = items.filter(u => u.details && u.details.materias && u.details.materias.includes(f.materia));
  }
  if (f.status) {
    items = items.filter(u => u.status === f.status);
  }

  // Ordenamiento
  sortItems(items, f.sortField, f.sortDir);

  // Paginación
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  if (f.page > totalPages) f.page = totalPages;
  const startIndex = (f.page - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  const tbody = document.getElementById('tbody-profesores');
  const empty = document.getElementById('empty-profesores');

  if (totalItems === 0) {
    tbody.innerHTML = '';
    empty.classList.remove('hidden');
  } else {
    empty.classList.add('hidden');
    tbody.innerHTML = paginatedItems.map(user => `
      <tr>
        <td>
          <div class="avatar-cell">
            ${user.profilePic 
              ? `<img src="${user.profilePic}" alt="Foto de ${user.fullName}" class="avatar-img">`
              : `<div class="avatar-placeholder">${user.fullName.charAt(0)}</div>`
            }
            <div>
              <strong>${user.fullName}</strong>
              <div class="muted" style="font-size: 0.8rem;">${user.email}</div>
            </div>
          </div>
        </td>
        <td>${user.username}</td>
        <td>${user.details?.materias || '-'}</td>
        <td>${user.details?.horario || 'No asignado'}</td>
        <td><span class="status-badge ${user.status}">${user.status}</span></td>
        <td>
          <button class="btn-icon" title="Ver Ficha Completa" onclick="openDetail(${user.id})"><i class="fa-solid fa-eye"></i></button>
          <button class="btn-icon" title="Editar" onclick="openEdit(${user.id})"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="btn-icon" title="Desactivar / Activar" onclick="toggleUserStatus(${user.id})"><i class="fa-solid fa-arrows-rotate"></i></button>
        </td>
      </tr>
    `).join('');
  }

  renderPagination(document.getElementById('pag-profesores'), totalPages, f.page, (newPage) => {
    f.page = newPage;
    renderProfesores();
  });
  updateSortHeaders('table-profesores', f.sortField, f.sortDir);
  hideSkeletonLoader();
}

// 8. SECCIÓN PADRES / ENCARGADOS
function renderPadres() {
  const f = activeFilters.padres;
  let items = state.users.filter(u => u.role === 'encargado');

  // Filtros
  if (f.search) {
    items = items.filter(u => 
      u.fullName.toLowerCase().includes(f.search.toLowerCase()) || 
      u.username.toLowerCase().includes(f.search.toLowerCase())
    );
  }
  if (f.status) {
    items = items.filter(u => u.status === f.status);
  }

  // Ordenamiento
  sortItems(items, f.sortField, f.sortDir);

  // Paginación
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  if (f.page > totalPages) f.page = totalPages;
  const startIndex = (f.page - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  const tbody = document.getElementById('tbody-padres');
  const empty = document.getElementById('empty-padres');

  if (totalItems === 0) {
    tbody.innerHTML = '';
    empty.classList.remove('hidden');
  } else {
    empty.classList.add('hidden');
    tbody.innerHTML = paginatedItems.map(user => `
      <tr>
        <td>
          <div class="avatar-cell">
            ${user.profilePic 
              ? `<img src="${user.profilePic}" alt="Foto de ${user.fullName}" class="avatar-img">`
              : `<div class="avatar-placeholder">${user.fullName.charAt(0)}</div>`
            }
            <div>
              <strong>${user.fullName}</strong>
              <div class="muted" style="font-size: 0.8rem;">${user.email}</div>
            </div>
          </div>
        </td>
        <td>${user.username}</td>
        <td>${user.details?.estudiantes ? user.details.estudiantes.join(', ') : 'Ninguno'}</td>
        <td>${user.details?.canales || 'No definido'}</td>
        <td><span class="status-badge ${user.status}">${user.status}</span></td>
        <td>
          <button class="btn-icon" title="Ver Ficha Completa" onclick="openDetail(${user.id})"><i class="fa-solid fa-eye"></i></button>
          <button class="btn-icon" title="Editar" onclick="openEdit(${user.id})"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="btn-icon" title="Desactivar / Activar" onclick="toggleUserStatus(${user.id})"><i class="fa-solid fa-arrows-rotate"></i></button>
        </td>
      </tr>
    `).join('');
  }

  renderPagination(document.getElementById('pag-padres'), totalPages, f.page, (newPage) => {
    f.page = newPage;
    renderPadres();
  });
  updateSortHeaders('table-padres', f.sortField, f.sortDir);
  hideSkeletonLoader();
}

// 9. SECCIÓN CUENTAS DE ACCESO (MANTENIMIENTO DE CONTRASEÑAS Y SEGURIDAD)
function renderCuentas() {
  const f = activeFilters.cuentas;
  let items = [...state.users];

  if (f.search) {
    items = items.filter(u => u.username.toLowerCase().includes(f.search.toLowerCase()));
  }
  if (f.status) {
    items = items.filter(u => u.status === f.status);
  }

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  if (f.page > totalPages) f.page = totalPages;
  const startIndex = (f.page - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  const tbody = document.getElementById('tbody-cuentas');
  const empty = document.getElementById('empty-cuentas');

  if (totalItems === 0) {
    tbody.innerHTML = '';
    empty.classList.remove('hidden');
  } else {
    empty.classList.add('hidden');
    tbody.innerHTML = paginatedItems.map(user => `
      <tr>
        <td><strong>${user.username}</strong> <span class="status-badge role-badge" style="font-size:0.7rem;">${user.role}</span></td>
        <td>${user.email}</td>
        <td>${user.twoFactor ? '<span class="status-badge activo" style="font-size:0.75rem;"><i class="fa-solid fa-circle-check"></i> Activado</span>' : '<span class="status-badge inactivo" style="font-size:0.75rem;"><i class="fa-solid fa-circle-xmark"></i> Desactivado</span>'}</td>
        <td>${user.failedAttempts || 0} / 3</td>
        <td><span class="status-badge ${user.status}">${user.status}</span></td>
        <td>
          <button class="button action-btn" style="padding: 0.3rem 0.5rem; font-size:0.75rem;" onclick="resetPasswordSecurity(${user.id})">Nueva Clave</button>
          <button class="button button-secondary action-btn" style="padding: 0.3rem 0.5rem; font-size:0.75rem;" onclick="toggle2FA(${user.id})">2FA</button>
          <button class="button button-secondary action-btn" style="padding: 0.3rem 0.5rem; font-size:0.75rem;" onclick="remoteLogout(${user.id})">Remote Logout</button>
          ${user.status === 'bloqueado' ? `<button class="button action-btn" style="padding: 0.3rem 0.5rem; font-size:0.75rem; background-color:#28a745;" onclick="unblockAccount(${user.id})">Desbloquear</button>` : ''}
        </td>
      </tr>
    `).join('');
  }

  renderPagination(document.getElementById('pag-cuentas'), totalPages, f.page, (newPage) => {
    f.page = newPage;
    renderCuentas();
  });
  hideSkeletonLoader();
}

// Acciones de Cuentas
window.resetPasswordSecurity = function(id) {
  const user = state.users.find(u => u.id === id);
  if (!user) return;

  Swal.fire({
    title: 'Cambiar Contraseña',
    text: `Introduce la nueva contraseña para ${user.username}`,
    input: 'password',
    inputPlaceholder: '••••••••',
    showCancelButton: true,
    confirmButtonText: 'Actualizar',
    cancelButtonText: 'Cancelar',
    inputAttributes: {
      autocapitalize: 'off',
      autocorrect: 'off'
    },
    inputValidator: (value) => {
      if (!value || value.length < 6) {
        return 'La contraseña debe tener al menos 6 caracteres.';
      }
    }
  }).then((result) => {
    if (result.isConfirmed) {
      addChangeLog(`Cambió la contraseña para el usuario ${user.username}`);
      addSystemAlert(`Contraseña actualizada para [${user.username}]`);
      Swal.fire('Éxito', 'La contraseña se ha actualizado.', 'success');
    }
  });
};

window.toggle2FA = function(id) {
  const index = state.users.findIndex(u => u.id === id);
  if (index !== -1) {
    state.users[index].twoFactor = !state.users[index].twoFactor;
    const status = state.users[index].twoFactor ? 'activado' : 'desactivado';
    addChangeLog(`Mecanismo 2FA ${status} para ${state.users[index].username}`);
    saveState();
    renderCuentas();
    Swal.fire('2FA Actualizado', `Se ha ${status} la autenticación en dos pasos.`, 'success');
  }
};

window.remoteLogout = function(id) {
  const user = state.users.find(u => u.id === id);
  if (!user) return;

  Swal.fire({
    title: 'Cierre de Sesión Remoto',
    text: `¿Seguro que deseas cerrar todas las sesiones activas de ${user.username}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cerrar sesiones',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      addChangeLog(`Cierre de sesión remoto solicitado para ${user.username}`);
      Swal.fire('Sesiones Cerradas', `Se envió la instrucción de desconexión para ${user.username}.`, 'success');
    }
  });
};

window.unblockAccount = function(id) {
  const index = state.users.findIndex(u => u.id === id);
  if (index !== -1) {
    state.users[index].status = 'activo';
    state.users[index].failedAttempts = 0;
    addChangeLog(`Cuenta desbloqueada y limpia de intentos fallidos: ${state.users[index].username}`);
    saveState();
    renderCuentas();
    Swal.fire('Desbloqueado', 'La cuenta ha sido reactivada exitosamente.', 'success');
  }
};

// 10. SECCIÓN ROLES Y PERMISOS
function renderRolesMatrix() {
  const matrixContainer = document.getElementById('roles-permission-matrix');
  const roles = Object.keys(state.permissions);
  const modules = ['usuarios', 'academico', 'comunicados', 'auditoria'];

  matrixContainer.innerHTML = roles.map(role => {
    const rolePerms = state.permissions[role];
    return `
      <div class="role-permission-row">
        <div class="permission-title">
          <span>Rol: ${role.toUpperCase()}</span>
        </div>
        <div class="permission-checkboxes">
          ${modules.map(mod => {
            const currentVal = rolePerms[mod] || 'none';
            return `
              <div style="margin-right: 1.5rem;">
                <strong style="font-size: 0.85rem; display:block; margin-bottom:0.25rem;">${mod.toUpperCase()}</strong>
                <label class="checkbox-label" style="font-size: 0.85rem; font-weight: 500;">
                  <input type="radio" name="perm-${role}-${mod}" value="none" ${currentVal === 'none' ? 'checked' : ''}> Ninguno
                </label>
                <label class="checkbox-label" style="font-size: 0.85rem; font-weight: 500;">
                  <input type="radio" name="perm-${role}-${mod}" value="r" ${currentVal === 'r' ? 'checked' : ''}> Lectura
                </label>
                <label class="checkbox-label" style="font-size: 0.85rem; font-weight: 500;">
                  <input type="radio" name="perm-${role}-${mod}" value="rw" ${currentVal === 'rw' ? 'checked' : ''}> Lectura/Escritura
                </label>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

document.getElementById('btn-save-permissions')?.addEventListener('click', () => {
  const roles = Object.keys(state.permissions);
  const modules = ['usuarios', 'academico', 'comunicados', 'auditoria'];

  roles.forEach(role => {
    modules.forEach(mod => {
      const selectedRadio = document.querySelector(`input[name="perm-${role}-${mod}"]:checked`);
      if (selectedRadio) {
        state.permissions[role][mod] = selectedRadio.value;
      }
    });
  });

  saveState();
  addChangeLog('Modificación de la matriz general de roles y permisos');
  Swal.fire('Matriz Guardada', 'Se actualizaron las políticas de acceso del sistema.', 'success');
});

// 11. SECCIÓN NOTIFICACIONES
function renderNotificaciones() {
  const systemAlertsLog = document.getElementById('systemAlertsLog');
  systemAlertsLog.innerHTML = state.alerts.map(alert => `
    <li class="log-item">
      <span class="log-time">${alert.time}</span>
      <p class="log-desc">${alert.message}</p>
    </li>
  `).join('');

  // Sincronizar form config
  document.getElementById('notify-email').checked = state.notifConfig.email;
  document.getElementById('notify-sms').checked = state.notifConfig.sms;
  document.getElementById('notify-push').checked = state.notifConfig.push;
}

document.getElementById('notificationsConfigForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  state.notifConfig.email = document.getElementById('notify-email').checked;
  state.notifConfig.sms = document.getElementById('notify-sms').checked;
  state.notifConfig.push = document.getElementById('notify-push').checked;
  saveState();
  addChangeLog('Preferencias de políticas de canales de alertas actualizadas');
  Swal.fire('Configuración Guardada', 'Se actualizaron los canales de comunicación.', 'success');
});

// 12. SECCIÓN AUDITORÍA COMPLETA
function renderAuditoria() {
  const query = document.getElementById('auditoria-search').value.toLowerCase().trim();
  const typeFilter = document.getElementById('auditoria-filter-type').value;

  const fullChangeLog = document.getElementById('fullChangeLog');
  const fullAccessLog = document.getElementById('fullAccessLog');

  let changes = [...state.changeLogs];
  let accesses = [...state.accessLogs];

  if (query) {
    changes = changes.filter(c => c.user.toLowerCase().includes(query) || c.action.toLowerCase().includes(query));
    accesses = accesses.filter(a => a.user.toLowerCase().includes(query) || a.status.toLowerCase().includes(query));
  }

  // Si se selecciona un tipo específico se vacía el otro listado visual
  if (typeFilter === 'cambio') {
    accesses = [];
  } else if (typeFilter === 'acceso') {
    changes = [];
  }

  fullChangeLog.innerHTML = changes.map(log => `
    <li class="log-item">
      <span class="log-time">${log.time}</span>
      <p class="log-desc">Usuario <strong class="log-user">${log.user}</strong> realizó: ${log.action}</p>
    </li>
  `).join('') || '<div class="empty-state">No hay registros coincidentes.</div>';

  fullAccessLog.innerHTML = accesses.map(log => `
    <li class="log-item">
      <span class="log-time">${log.time}</span>
      <p class="log-desc">
        Usuario <strong class="log-user">${log.user}</strong> intentó ingresar. Estado: <strong>${log.status}</strong>
        <br><span class="muted" style="font-size:0.75rem;">Dispositivo: ${log.device || '-'} | IP: ${log.ip || '-'}</span>
      </p>
    </li>
  `).join('') || '<div class="empty-state">No hay registros coincidentes.</div>';
}

document.getElementById('btn-export-audit')?.addEventListener('click', () => {
  const rows = [['Fecha y Hora', 'Usuario', 'Tipo', 'Detalle/Accion']];
  state.changeLogs.forEach(c => rows.push([c.time, c.user, 'CAMBIO', c.action]));
  state.accessLogs.forEach(a => rows.push([a.time, a.user, 'ACCESO', `${a.status} (IP: ${a.ip}, Disp: ${a.device})`]));

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(r => r.map(cell => `"${cell}"`).join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `reporte_auditoria_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  Swal.fire('Reporte Exportado', 'Se descargó el reporte unificado en formato CSV.', 'success');
});

// Helper de logs
function addChangeLog(action) {
  const newLog = {
    time: getCurrentDateTime(),
    user: session.username,
    action: action
  };
  state.changeLogs.unshift(newLog);
  saveState();
}

function addSystemAlert(msg) {
  const alert = {
    time: getCurrentDateTime(),
    message: msg
  };
  state.alerts.unshift(alert);
  saveState();
}

function getCurrentDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const time = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return `${date} ${time}`;
}

// 13. DIÁLOGOS DE REGISTRO / EDICIÓN Y COMPORTAMIENTO FORMULARIO
const userModal = document.getElementById('userModal');
const userForm = document.getElementById('userForm');
const modalTitle = document.getElementById('modalTitle');
const dynamicFieldsContainer = document.getElementById('dynamicFieldsContainer');

// Botones para disparar formularios
document.body.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-new-user')) {
    const role = e.target.dataset.role;
    openCreateForm(role);
  }
});

function openCreateForm(role) {
  userForm.reset();
  clearValidationErrors();
  
  document.getElementById('userId').value = '';
  document.getElementById('userRole').value = role;
  
  modalTitle.textContent = `Registrar Nuevo ${role.charAt(0).toUpperCase() + role.slice(1)}`;
  renderFormFields(role);
  
  userModal.classList.remove('hidden');
}

window.openEdit = function(id) {
  clearValidationErrors();
  const user = state.users.find(u => u.id === id);
  if (!user) return;

  document.getElementById('userId').value = user.id;
  document.getElementById('userRole').value = user.role;
  document.getElementById('fullName').value = user.fullName;
  document.getElementById('newUsername').value = user.username;
  document.getElementById('email').value = user.email;
  document.getElementById('profilePic').value = user.profilePic || '';

  modalTitle.textContent = `Editar ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}: ${user.username}`;
  renderFormFields(user.role, user.details);

  userModal.classList.remove('hidden');
};

function renderFormFields(role, existingDetails = null) {
  dynamicFieldsContainer.innerHTML = '';
  if (role === 'estudiante') {
    const grado = existingDetails?.grado || '';
    const encargado = existingDetails?.encargado || '';
    // Obtener encargados disponibles
    const encargados = state.users.filter(u => u.role === 'encargado');
    dynamicFieldsContainer.innerHTML = `
      <div class="form-group" id="group-grado">
        <label for="grado">Grado y Sección *</label>
        <select id="grado" name="grado">
          <option value="">Seleccionar Grado</option>
          <option value="10mo Año - Sección A" ${grado === '10mo Año - Sección A' ? 'selected' : ''}>10mo Año - Sección A</option>
          <option value="10mo Año - Sección B" ${grado === '10mo Año - Sección B' ? 'selected' : ''}>10mo Año - Sección B</option>
          <option value="11mo Año - Sección A" ${grado === '11mo Año - Sección A' ? 'selected' : ''}>11mo Año - Sección A</option>
          <option value="11mo Año - Sección B" ${grado === '11mo Año - Sección B' ? 'selected' : ''}>11mo Año - Sección B</option>
        </select>
        <span class="error-text hidden" id="err-grado"></span>
      </div>
      <div class="form-group">
        <label for="encargado">Encargado Asociado</label>
        <select id="encargado" name="encargado">
          <option value="">Ninguno</option>
          ${encargados.map(enc => `<option value="${enc.fullName}" ${encargado === enc.fullName ? 'selected' : ''}>${enc.fullName}</option>`).join('')}
        </select>
      </div>
    `;
  } else if (role === 'profesor') {
    const materias = existingDetails?.materias || '';
    const horario = existingDetails?.horario || '';
    dynamicFieldsContainer.innerHTML = `
      <div class="form-group" id="group-materias">
        <label for="materias">Materias Asignadas *</label>
        <input type="text" id="materias" name="materias" value="${materias}" placeholder="Ej: Matemáticas, Física">
        <span class="error-text hidden" id="err-materias"></span>
      </div>
      <div class="form-group" id="group-horario">
        <label for="horario">Horarios de Disponibilidad *</label>
        <input type="text" id="horario" name="horario" value="${horario}" placeholder="Ej: Lunes a Viernes 07:00 - 15:00">
        <span class="error-text hidden" id="err-horario"></span>
      </div>
    `;
  } else if (role === 'encargado') {
    const selectedList = existingDetails?.estudiantes || [];
    const estudiantes = state.users.filter(u => u.role === 'estudiante');
    dynamicFieldsContainer.innerHTML = `
      <div class="form-group span-2">
        <label for="encargado-estudiantes">Asociar Estudiantes (Ctrl + click para selección múltiple)</label>
        <select id="encargado-estudiantes" name="estudiantes" multiple style="height: 100px;">
          ${estudiantes.map(est => `
            <option value="${est.fullName}" ${selectedList.includes(est.fullName) ? 'selected' : ''}>
              ${est.fullName} (${est.details?.grado || '-'})
            </option>
          `).join('')}
        </select>
      </div>
    `;
  }
}

// 14. VALIDACIÓN EN TIEMPO REAL
function showFieldError(field, msg) {
  const container = document.getElementById(`group-${field}`);
  const errEl = document.getElementById(`err-${field}`);
  if (container && errEl) {
    container.classList.add('has-error');
    errEl.textContent = msg;
    errEl.classList.remove('hidden');
  }
}

function clearFieldError(field) {
  const container = document.getElementById(`group-${field}`);
  const errEl = document.getElementById(`err-${field}`);
  if (container && errEl) {
    container.classList.remove('has-error');
    errEl.textContent = '';
    errEl.classList.add('hidden');
  }
}

function clearValidationErrors() {
  ['fullName', 'newUsername', 'email', 'grado', 'materias', 'horario'].forEach(field => clearFieldError(field));
}

// Eventos de validación al perder foco
document.getElementById('fullName').addEventListener('blur', (e) => {
  if (e.target.value.trim().length < 3) {
    showFieldError('fullName', 'El nombre debe tener al menos 3 caracteres.');
  } else {
    clearFieldError('fullName');
  }
});

document.getElementById('newUsername').addEventListener('blur', (e) => {
  const val = e.target.value.trim();
  const userId = document.getElementById('userId').value;
  if (val.length < 3) {
    showFieldError('newUsername', 'El usuario debe tener al menos 3 caracteres.');
  } else if (!/^[a-zA-Z0-9_]+$/.test(val)) {
    showFieldError('newUsername', 'Solo letras, números y guiones bajos.');
  } else if (state.users.some(u => u.username.toLowerCase() === val.toLowerCase() && u.id !== parseInt(userId))) {
    showFieldError('newUsername', 'El nombre de usuario ya está registrado.');
  } else {
    clearFieldError('newUsername');
  }
});

document.getElementById('email').addEventListener('blur', (e) => {
  const val = e.target.value.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(val)) {
    showFieldError('email', 'Introduce una dirección de correo válida.');
  } else {
    clearFieldError('email');
  }
});

// Guardado del Formulario de Usuario
userForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const idVal = document.getElementById('userId').value;
  const role = document.getElementById('userRole').value;
  
  const fullName = document.getElementById('fullName').value.trim();
  const username = document.getElementById('newUsername').value.trim();
  const email = document.getElementById('email').value.trim();
  const profilePic = document.getElementById('profilePic').value.trim();
  
  clearValidationErrors();
  let hasErrors = false;

  // Validaciones
  if (fullName.length < 3) {
    showFieldError('fullName', 'Mínimo 3 caracteres requeridos.');
    hasErrors = true;
  }
  if (username.length < 3) {
    showFieldError('newUsername', 'Mínimo 3 caracteres.');
    hasErrors = true;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFieldError('email', 'Correo electrónico inválido.');
    hasErrors = true;
  }

  let details = {};
  if (role === 'estudiante') {
    const grado = document.getElementById('grado').value;
    const encargado = document.getElementById('encargado').value;
    if (!grado) {
      showFieldError('grado', 'Debe seleccionar un grado.');
      hasErrors = true;
    }
    details = { grado, encargado, historial: [] };
  } else if (role === 'profesor') {
    const materias = document.getElementById('materias').value.trim();
    const horario = document.getElementById('horario').value.trim();
    if (!materias) {
      showFieldError('materias', 'Debe especificar materias.');
      hasErrors = true;
    }
    if (!horario) {
      showFieldError('horario', 'Debe indicar horarios.');
      hasErrors = true;
    }
    details = { materias, horario };
  } else if (role === 'encargado') {
    const selectedOptions = document.getElementById('encargado-estudiantes').selectedOptions;
    const estudiantes = Array.from(selectedOptions).map(o => o.value);
    details = { estudiantes, canales: 'Email' };
  }

  if (hasErrors) return;

  if (idVal) {
    // Modo Edición
    const index = state.users.findIndex(u => u.id === parseInt(idVal));
    if (index !== -1) {
      // Mantener campos que no varían
      const original = state.users[index];
      state.users[index] = {
        ...original,
        fullName,
        username,
        email,
        profilePic,
        details: { ...original.details, ...details }
      };
      addChangeLog(`Editó datos del usuario [${username}] (${role})`);
      Swal.fire('Usuario Guardado', 'Los datos del usuario han sido actualizados.', 'success');
    }
  } else {
    // Modo Registro
    if (state.users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      showFieldError('newUsername', 'El usuario ya existe.');
      return;
    }
    const newId = state.users.length > 0 ? Math.max(...state.users.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      fullName,
      username,
      email,
      role,
      status: 'activo',
      profilePic,
      failedAttempts: 0,
      twoFactor: false,
      details
    };
    state.users.push(newUser);
    addChangeLog(`Registró un nuevo usuario [${username}] con rol [${role}]`);
    addSystemAlert(`Cuenta creada para [${username}] (${role})`);
    Swal.fire('Usuario Creado', 'El usuario se ha registrado exitosamente en el sistema.', 'success');
  }

  saveState();
  closeUserModal();
  renderActiveSection(role === 'estudiante' ? 'estudiantes' : role === 'profesor' ? 'profesores' : 'padres');
});

// Modales cerrar
function closeUserModal() {
  userModal.classList.add('hidden');
}
document.getElementById('closeModal').addEventListener('click', closeUserModal);
document.getElementById('cancelForm').addEventListener('click', closeUserModal);

// 15. ACCIÓN DE DESACTIVAR / REACTIVAR USUARIO (ESTADOS DE CONFIRMACIÓN)
window.toggleUserStatus = function(id) {
  const user = state.users.find(u => u.id === id);
  if (!user) return;

  const nextStatus = user.status === 'activo' ? 'inactivo' : 'activo';
  const actionText = nextStatus === 'inactivo' ? 'desactivar' : 'reactivar';

  Swal.fire({
    title: `¿Confirmar acción?`,
    text: `Vas a ${actionText} la cuenta de ${user.fullName} (${user.username}).`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#D54E1A',
    cancelButtonColor: '#7996A7',
    confirmButtonText: `Sí, ${actionText}`,
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      user.status = nextStatus;
      addChangeLog(`Cambió el estado del usuario [${user.username}] a [${nextStatus}]`);
      addSystemAlert(`Cuenta [${user.username}] cambiada a estado [${nextStatus}]`);
      saveState();
      
      Swal.fire('Estado Modificado', `La cuenta ahora se encuentra en estado ${nextStatus}.`, 'success');
      renderActiveSection(user.role === 'estudiante' ? 'estudiantes' : user.role === 'profesor' ? 'profesores' : 'padres');
    }
  });
};

// 16. FICHA DETALLADA (VISUALIZACIÓN COMPLETA)
const detailModal = document.getElementById('detailModal');
const detailModalBody = document.getElementById('detailModalBody');

window.openDetail = function(id) {
  const user = state.users.find(u => u.id === id);
  if (!user) return;

  let specificInfo = '';
  if (user.role === 'estudiante') {
    const listHistorial = user.details?.historial || [];
    specificInfo = `
      <div class="profile-info-item">
        <span class="profile-info-label">Grado y Sección</span>
        <span class="profile-info-value">${user.details?.grado || '-'}</span>
      </div>
      <div class="profile-info-item">
        <span class="profile-info-label">Encargado Asociado</span>
        <span class="profile-info-value">${user.details?.encargado || 'Ninguno'}</span>
      </div>
      <div class="profile-info-item span-2" style="margin-top: 1rem;">
        <span class="profile-info-label">Historial Académico Reciente</span>
        <ul style="margin: 0.5rem 0 0; padding-left: 1.2rem; font-weight:700;">
          ${listHistorial.map(h => `<li>${h}</li>`).join('') || '<li>Sin registros académicos cargados.</li>'}
        </ul>
      </div>
    `;
  } else if (user.role === 'profesor') {
    specificInfo = `
      <div class="profile-info-item">
        <span class="profile-info-label">Materias Asignadas</span>
        <span class="profile-info-value">${user.details?.materias || '-'}</span>
      </div>
      <div class="profile-info-item">
        <span class="profile-info-label">Horario de Disponibilidad</span>
        <span class="profile-info-value">${user.details?.horario || '-'}</span>
      </div>
    `;
  } else if (user.role === 'encargado') {
    const asociados = user.details?.estudiantes || [];
    specificInfo = `
      <div class="profile-info-item span-2">
        <span class="profile-info-label">Estudiantes a Cargo</span>
        <span class="profile-info-value">${asociados.join(', ') || 'Ninguno asignado'}</span>
      </div>
    `;
  }

  detailModalBody.innerHTML = `
    <div class="user-profile-card">
      <div class="profile-photo-container">
        ${user.profilePic 
          ? `<img src="${user.profilePic}" alt="Foto de ${user.fullName}" class="profile-large-img">`
          : `<div class="profile-large-placeholder">${user.fullName.charAt(0)}</div>`
        }
        <span class="status-badge ${user.status}" style="margin-top: 0.5rem;">${user.status}</span>
      </div>
      <div>
        <div class="profile-info-grid">
          <div class="profile-info-item">
            <span class="profile-info-label">Nombre Completo</span>
            <span class="profile-info-value">${user.fullName}</span>
          </div>
          <div class="profile-info-item">
            <span class="profile-info-label">Nombre de Usuario</span>
            <span class="profile-info-value">${user.username}</span>
          </div>
          <div class="profile-info-item">
            <span class="profile-info-label">Correo Electrónico</span>
            <span class="profile-info-value">${user.email}</span>
          </div>
          <div class="profile-info-item">
            <span class="profile-info-label">Rol en Plataforma</span>
            <span class="profile-info-value">${user.role.toUpperCase()}</span>
          </div>
          ${specificInfo}
        </div>
      </div>
    </div>
  `;

  detailModal.classList.remove('hidden');
};

function closeDetailModal() {
  detailModal.classList.add('hidden');
}
document.getElementById('closeDetailModal').addEventListener('click', closeDetailModal);
document.getElementById('btn-close-detail').addEventListener('click', closeDetailModal);

// 17. IMPORTACIÓN Y EXPORTACIÓN MASIVA (CSV)
const importModal = document.getElementById('importModal');
const csvFileInput = document.getElementById('csvFileInput');

document.getElementById('btn-import-estudiantes')?.addEventListener('click', () => {
  csvFileInput.value = '';
  importModal.classList.remove('hidden');
});

document.getElementById('closeImportModal').addEventListener('click', () => importModal.classList.add('hidden'));
document.getElementById('btn-cancel-import').addEventListener('click', () => importModal.classList.add('hidden'));

// Descargar plantilla
document.getElementById('download-template-link')?.addEventListener('click', (e) => {
  e.preventDefault();
  const template = 'fullName,username,email,grado\nJuan Perez,jperez,juan.perez@estudiante.edu,10mo Año - Sección B\nMaria Gomez,mgomez,maria.gomez@estudiante.edu,11mo Año - Sección A';
  const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'plantilla_importacion_estudiantes.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Carga de archivo CSV
document.getElementById('btn-submit-import')?.addEventListener('click', () => {
  const file = csvFileInput.files[0];
  if (!file) {
    Swal.fire('Error', 'Debe seleccionar un archivo CSV primero.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;
    const lines = content.split('\n');
    if (lines.length < 2) {
      Swal.fire('Error', 'El archivo no contiene filas de datos.', 'error');
      return;
    }

    let loadedCount = 0;
    let errorCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const columns = line.split(',');
      if (columns.length < 4) {
        errorCount++;
        continue;
      }

      const fullName = columns[0].trim();
      const username = columns[1].trim();
      const email = columns[2].trim();
      const grado = columns[3].trim();

      // Validaciones elementales
      if (!fullName || !username || !email || !grado || state.users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        errorCount++;
        continue;
      }

      const newId = state.users.length > 0 ? Math.max(...state.users.map(u => u.id)) + 1 : 1;
      const newUser = {
        id: newId,
        fullName,
        username,
        email,
        role: 'estudiante',
        status: 'activo',
        profilePic: '',
        failedAttempts: 0,
        twoFactor: false,
        details: { grado, encargado: '', historial: [] }
      };

      state.users.push(newUser);
      loadedCount++;
    }

    if (loadedCount > 0) {
      saveState();
      addChangeLog(`Importación masiva: se registraron ${loadedCount} estudiantes mediante CSV`);
      addSystemAlert(`Importación masiva completada: ${loadedCount} estudiantes agregados`);
      renderEstudiantes();
    }

    importModal.classList.add('hidden');
    Swal.fire('Importación Finalizada', `Se importaron ${loadedCount} estudiantes con éxito. Registros fallidos: ${errorCount}.`, 'info');
  };
  reader.readAsText(file);
});

// Exportar Estudiantes a CSV
document.getElementById('btn-export-estudiantes')?.addEventListener('click', () => {
  const estudiantes = state.users.filter(u => u.role === 'estudiante');
  const rows = [['Nombre Completo', 'Nombre de Usuario', 'Correo Electronico', 'Grado y Seccion']];
  
  estudiantes.forEach(est => {
    rows.push([est.fullName, est.username, est.email, est.details?.grado || '-']);
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(e => e.map(cell => `"${cell}"`).join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'estudiantes_intranet.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  Swal.fire('Exportación Exitosa', 'Se descargó el archivo de estudiantes en formato CSV.', 'success');
});

// 18. HELPERS DE ORDENAMIENTO Y TABLAS DYNAMIC
function sortItems(arr, field, dir) {
  arr.sort((a, b) => {
    let valA = a[field] || '';
    let valB = b[field] || '';
    
    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    
    if (valA < valB) return dir === 'asc' ? -1 : 1;
    if (valA > valB) return dir === 'asc' ? 1 : -1;
    return 0;
  });
}

function updateSortHeaders(tableId, currentField, currentDir) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const headers = table.querySelectorAll('th.sortable');
  headers.forEach(h => {
    h.classList.remove('sort-asc', 'sort-desc');
    if (h.dataset.sort === currentField) {
      h.classList.add(currentDir === 'asc' ? 'sort-asc' : 'sort-desc');
    }
  });
}

// Asignar listeners de ordenamiento a las tablas
document.querySelectorAll('.custom-table th.sortable').forEach(header => {
  header.addEventListener('click', () => {
    const tableId = header.closest('table').id;
    let filterKey = '';
    if (tableId === 'table-estudiantes') filterKey = 'estudiantes';
    else if (tableId === 'table-profesores') filterKey = 'profesores';
    else if (tableId === 'table-padres') filterKey = 'padres';

    if (!filterKey) return;
    const f = activeFilters[filterKey];
    const field = header.dataset.sort;
    if (f.sortField === field) {
      f.sortDir = f.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      f.sortField = field;
      f.sortDir = 'asc';
    }
    
    if (filterKey === 'estudiantes') renderEstudiantes();
    else if (filterKey === 'profesores') renderProfesores();
    else if (filterKey === 'padres') renderPadres();
  });
});

// 19. CONTROL DE ELEMENTOS DE BÚSQUEDA Y FILTRADO (LIVE INPUTS)
document.getElementById('estudiante-search')?.addEventListener('input', (e) => {
  activeFilters.estudiantes.search = e.target.value;
  activeFilters.estudiantes.page = 1;
  renderEstudiantes();
});

document.getElementById('estudiante-filter-grado')?.addEventListener('change', (e) => {
  activeFilters.estudiantes.grado = e.target.value;
  activeFilters.estudiantes.page = 1;
  renderEstudiantes();
});

document.getElementById('estudiante-filter-status')?.addEventListener('change', (e) => {
  activeFilters.estudiantes.status = e.target.value;
  activeFilters.estudiantes.page = 1;
  renderEstudiantes();
});

document.getElementById('profesor-search')?.addEventListener('input', (e) => {
  activeFilters.profesores.search = e.target.value;
  activeFilters.profesores.page = 1;
  renderProfesores();
});

document.getElementById('profesor-filter-materia')?.addEventListener('change', (e) => {
  activeFilters.profesores.materia = e.target.value;
  activeFilters.profesores.page = 1;
  renderProfesores();
});

document.getElementById('profesor-filter-status')?.addEventListener('change', (e) => {
  activeFilters.profesores.status = e.target.value;
  activeFilters.profesores.page = 1;
  renderProfesores();
});

document.getElementById('padre-search')?.addEventListener('input', (e) => {
  activeFilters.padres.search = e.target.value;
  activeFilters.padres.page = 1;
  renderPadres();
});

document.getElementById('padre-filter-status')?.addEventListener('change', (e) => {
  activeFilters.padres.status = e.target.value;
  activeFilters.padres.page = 1;
  renderPadres();
});

document.getElementById('cuenta-search')?.addEventListener('input', (e) => {
  activeFilters.cuentas.search = e.target.value;
  activeFilters.cuentas.page = 1;
  renderCuentas();
});

document.getElementById('cuenta-filter-status')?.addEventListener('change', (e) => {
  activeFilters.cuentas.status = e.target.value;
  activeFilters.cuentas.page = 1;
  renderCuentas();
});

document.getElementById('auditoria-search')?.addEventListener('input', renderAuditoria);
document.getElementById('auditoria-filter-type')?.addEventListener('change', renderAuditoria);

// 20. PAGINACIÓN COMPILADOR GENERAL
function renderPagination(container, totalPages, currentPage, onPageChange) {
  if (!container) return;
  if (totalPages <= 1) {
    container.innerHTML = `<span style="font-size:0.85rem; color:var(--muted)">Mostrando página 1 de 1</span>`;
    return;
  }

  let html = `<span style="font-size:0.85rem; color:var(--muted)">Página ${currentPage} de ${totalPages}</span>`;
  html += `<div class="pagination-buttons">`;
  html += `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">Ant.</button>`;
  
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${currentPage === i ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }
  
  html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">Sig.</button>`;
  html += `</div>`;

  container.innerHTML = html;

  container.querySelectorAll('.page-btn:not(:disabled)').forEach(btn => {
    btn.addEventListener('click', () => {
      onPageChange(parseInt(btn.dataset.page));
    });
  });
}

// INICIALIZACIÓN POR DEFECTO
renderActiveSection('dashboard');
