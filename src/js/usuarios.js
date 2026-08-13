// Verificación de sesión
const session = JSON.parse(localStorage.getItem('intranetSession') || 'null');
if (!session) {
  window.location.href = 'index.html';
} else if (session.role !== 'administracion') {
  // Solo administradores pueden acceder a este panel
  window.location.href = 'dashboard.html';
}

// Datos semilla de usuarios si no existen
const defaultUsers = [
  {
    id: 1,
    fullName: 'Administrador Principal',
    username: 'admin',
    email: 'admin@intranet.edu',
    role: 'administrador',
    status: 'activo',
    details: 'Acceso total al sistema'
  },
  {
    id: 2,
    fullName: 'Andrés Mora',
    username: 'amora',
    email: 'andres.mora@intranet.edu',
    role: 'profesor',
    status: 'activo',
    details: 'Materias: Matemáticas, Física'
  },
  {
    id: 3,
    fullName: 'Alanie Castro',
    username: 'acastro',
    email: 'alanie.castro@estudiante.edu',
    role: 'estudiante',
    status: 'activo',
    details: 'Grado: 10mo Año - Sección A'
  },
  {
    id: 4,
    fullName: 'Eiker Barquero',
    username: 'ebarquero',
    email: 'eiker.barquero@intranet.edu',
    role: 'encargado',
    status: 'activo',
    details: 'Estudiante asociado: Alanie Castro'
  }
];

// Datos semilla de logs de auditoría si no existen
const defaultChangeLogs = [
  { time: '13/08/2026 08:30:15', user: 'admin', action: 'Creación de estructura base del proyecto' },
  { time: '13/08/2026 09:12:44', user: 'admin', action: 'Fusión de la rama feature/andres al repositorio' }
];

const defaultAccessLogs = [
  { time: '13/08/2026 08:01:22', user: 'amora', status: 'Exitoso' },
  { time: '13/08/2026 08:15:40', user: 'acastro', status: 'Exitoso' },
  { time: '13/08/2026 09:20:10', user: 'admin', status: 'Exitoso' }
];

// Inicializar localStorage
let users = JSON.parse(localStorage.getItem('intranetUsers') || 'null');
if (!users) {
  users = defaultUsers;
  localStorage.setItem('intranetUsers', JSON.stringify(users));
}

let changeLogs = JSON.parse(localStorage.getItem('intranetChangeLogs') || 'null');
if (!changeLogs) {
  changeLogs = defaultChangeLogs;
  localStorage.setItem('intranetChangeLogs', JSON.stringify(changeLogs));
}

let accessLogs = JSON.parse(localStorage.getItem('intranetAccessLogs') || 'null');
if (!accessLogs) {
  accessLogs = defaultAccessLogs;
  localStorage.setItem('intranetAccessLogs', JSON.stringify(accessLogs));
}

// Elementos del DOM
const userTableBody = document.getElementById('userTableBody');
const searchQuery = document.getElementById('searchQuery');
const filterRole = document.getElementById('filterRole');
const filterStatus = document.getElementById('filterStatus');
const btnNewUser = document.getElementById('btnNewUser');

// Modales
const userModal = document.getElementById('userModal');
const passwordModal = document.getElementById('passwordModal');
const closeModal = document.getElementById('closeModal');
const closePasswordModal = document.getElementById('closePasswordModal');
const userForm = document.getElementById('userForm');
const passwordForm = document.getElementById('passwordForm');
const cancelForm = document.getElementById('cancelForm');
const cancelPasswordForm = document.getElementById('cancelPasswordForm');

// Campos Dinámicos
const userRoleSelect = document.getElementById('userRole');
const dynamicFields = document.getElementById('dynamicFields');

// Pestañas
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const changeLogList = document.getElementById('changeLog');
const accessLogList = document.getElementById('accessLog');

// Navegación entre pestañas
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.add('hidden'));

    btn.classList.add('active');
    const tabId = btn.dataset.tab;
    document.getElementById(tabId).classList.remove('hidden');

    if (tabId === 'auditoria-tab') {
      renderLogs();
    }
  });
});

// Helper para obtener fecha y hora actual formateada
function getCurrentDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const time = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return `${date} ${time}`;
}

// Guardar e ingresar un log de cambio
function addChangeLog(action) {
  const newLog = {
    time: getCurrentDateTime(),
    user: session.username,
    action: action
  };
  changeLogs.unshift(newLog);
  localStorage.setItem('intranetChangeLogs', JSON.stringify(changeLogs));
}

// Renderizar Logs
function renderLogs() {
  changeLogList.innerHTML = changeLogs.map(log => `
    <li class="log-item">
      <span class="log-time">${log.time}</span>
      <p class="log-desc">El usuario <span class="log-user">${log.user}</span> realizó: ${log.action}</p>
    </li>
  `).join('');

  accessLogList.innerHTML = accessLogs.map(log => `
    <li class="log-item">
      <span class="log-time">${log.time}</span>
      <p class="log-desc">Intento de acceso de <span class="log-user">${log.user}</span>: <strong>${log.status}</strong></p>
    </li>
  `).join('');
}

// Renderizar Tabla de Usuarios
function renderUsers() {
  const query = searchQuery.value.toLowerCase().trim();
  const roleVal = filterRole.value;
  const statusVal = filterStatus.value;

  const filtered = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(query) || user.username.toLowerCase().includes(query);
    const matchesRole = roleVal ? user.role === roleVal : true;
    const matchesStatus = statusVal ? user.status === statusVal : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  userTableBody.innerHTML = filtered.map(user => `
    <tr>
      <td>
        <strong>${user.fullName}</strong>
        <div class="user-meta-info muted">${user.email}</div>
      </td>
      <td>${user.username}</td>
      <td><span class="badge badge-role">${user.role}</span></td>
      <td>${user.details || '-'}</td>
      <td>
        <span class="badge ${user.status === 'activo' ? 'badge-active' : 'badge-inactive'}">
          ${user.status}
        </span>
      </td>
      <td>
        <div class="action-buttons">
          <button class="button action-btn" onclick="editUser(${user.id})">Editar</button>
          <button class="button button-secondary action-btn" onclick="openChangePassword(${user.id})">Contraseña</button>
          <button class="button ${user.status === 'activo' ? 'button-secondary' : ''} action-btn" 
                  onclick="toggleUserStatus(${user.id})">
            ${user.status === 'activo' ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Renderizar campos adicionales en base al Rol
function renderDynamicFields(role, existingData = null) {
  dynamicFields.innerHTML = '';
  if (role === 'profesor') {
    const value = existingData && existingData.role === 'profesor' ? existingData.details.replace('Materias: ', '') : '';
    dynamicFields.innerHTML = `
      <label for="materias">Materias a Asignar (Separadas por comas)</label>
      <input type="text" id="materias" name="materias" required placeholder="Ej: Matemáticas, Ciencias, Química" value="${value}">
    `;
  } else if (role === 'estudiante') {
    const value = existingData && existingData.role === 'estudiante' ? existingData.details.replace('Grado: ', '') : '';
    dynamicFields.innerHTML = `
      <label for="grado">Grado y Sección</label>
      <input type="text" id="grado" name="grado" required placeholder="Ej: 10mo Año - Sección B" value="${value}">
    `;
  } else if (role === 'encargado') {
    // Generar dropdown con los estudiantes disponibles
    const estudiantes = users.filter(u => u.role === 'estudiante');
    const selectedText = existingData && existingData.role === 'encargado' ? existingData.details.replace('Estudiante asociado: ', '') : '';
    
    let options = estudiantes.map(e => {
      const selected = e.fullName === selectedText ? 'selected' : '';
      return `<option value="${e.fullName}" ${selected}>${e.fullName} (${e.username})</option>`;
    }).join('');

    dynamicFields.innerHTML = `
      <label for="estudianteAsociado">Asociar Estudiante</label>
      <select id="estudianteAsociado" name="estudianteAsociado" required>
        <option value="">Seleccione un estudiante</option>
        ${options}
      </select>
    `;
  }
}

// Detectar cambio de rol en formulario
userRoleSelect.addEventListener('change', (e) => {
  renderDynamicFields(e.target.value);
});

// Modales abrir y cerrar
btnNewUser.addEventListener('click', () => {
  document.getElementById('userId').value = '';
  userForm.reset();
  document.getElementById('modalTitle').textContent = 'Registrar Usuario';
  userRoleSelect.value = 'estudiante';
  userRoleSelect.disabled = false;
  renderDynamicFields('estudiante');
  userModal.classList.remove('hidden');
});

function closeUserModal() {
  userModal.classList.add('hidden');
}

closeModal.addEventListener('click', closeUserModal);
cancelForm.addEventListener('click', closeUserModal);

// Editar Usuario
window.editUser = function(id) {
  const user = users.find(u => u.id === id);
  if (!user) return;

  document.getElementById('userId').value = user.id;
  document.getElementById('fullName').value = user.fullName;
  document.getElementById('newUsername').value = user.username;
  document.getElementById('email').value = user.email;
  userRoleSelect.value = user.role;
  userRoleSelect.disabled = true; // No permite cambiar el rol a uno existente para evitar inconsistencias

  document.getElementById('modalTitle').textContent = 'Editar Usuario';
  renderDynamicFields(user.role, user);
  userModal.classList.remove('hidden');
};

// Enviar Formulario de Usuario (Registrar / Editar)
userForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = document.getElementById('userId').value;
  const fullName = document.getElementById('fullName').value.trim();
  const username = document.getElementById('newUsername').value.trim();
  const email = document.getElementById('email').value.trim();
  const role = userRoleSelect.value;

  let details = '';
  if (role === 'profesor') {
    details = `Materias: ${document.getElementById('materias').value.trim()}`;
  } else if (role === 'estudiante') {
    details = `Grado: ${document.getElementById('grado').value.trim()}`;
  } else if (role === 'encargado') {
    details = `Estudiante asociado: ${document.getElementById('estudianteAsociado').value}`;
  } else {
    details = 'Acceso total al sistema';
  }

  if (id) {
    // Editar existente
    const index = users.findIndex(u => u.id === parseInt(id));
    if (index !== -1) {
      users[index].fullName = fullName;
      users[index].username = username;
      users[index].email = email;
      users[index].details = details;
      addChangeLog(`Edición de datos del usuario: ${username} (${role})`);
    }
  } else {
    // Validar nombre de usuario duplicado
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      alert('El nombre de usuario ya existe en el sistema.');
      return;
    }
    // Registrar nuevo
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      fullName,
      username,
      email,
      role,
      status: 'activo',
      details
    };
    users.push(newUser);
    addChangeLog(`Registro de nuevo usuario: ${username} como ${role}`);
  }

  localStorage.setItem('intranetUsers', JSON.stringify(users));
  closeUserModal();
  renderUsers();
});

// Activar / Desactivar Estado
window.toggleUserStatus = function(id) {
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    const user = users[index];
    user.status = user.status === 'activo' ? 'inactivo' : 'activo';
    addChangeLog(`Cambio de estado del usuario ${user.username} a ${user.status}`);
    localStorage.setItem('intranetUsers', JSON.stringify(users));
    renderUsers();
  }
};

// Cambiar Contraseña
window.openChangePassword = function(id) {
  const user = users.find(u => u.id === id);
  if (!user) return;
  document.getElementById('passwordUserId').value = id;
  document.getElementById('passwordError').textContent = '';
  passwordForm.reset();
  passwordModal.classList.remove('hidden');
};

function closePasswordModalFn() {
  passwordModal.classList.add('hidden');
}

closePasswordModal.addEventListener('click', closePasswordModalFn);
cancelPasswordForm.addEventListener('click', closePasswordModalFn);

passwordForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = parseInt(document.getElementById('passwordUserId').value);
  const newPass = document.getElementById('newPassword').value;
  const confPass = document.getElementById('confirmPassword').value;
  const errorElem = document.getElementById('passwordError');

  if (newPass !== confPass) {
    errorElem.textContent = 'Las contraseñas no coinciden.';
    return;
  }

  const user = users.find(u => u.id === id);
  if (user) {
    addChangeLog(`Cambio de contraseña para el usuario: ${user.username}`);
    alert(`Contraseña actualizada con éxito para el usuario ${user.username}.`);
    closePasswordModalFn();
  }
});

// Listeners de búsqueda y filtrado
searchQuery.addEventListener('input', renderUsers);
filterRole.addEventListener('change', renderUsers);
filterStatus.addEventListener('change', renderUsers);

// Inicializar render
renderUsers();
