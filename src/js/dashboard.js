const session = JSON.parse(localStorage.getItem('intranetSession') || 'null');

if (!session) {
  window.location.href = 'index.html';
} else {
  const labels = {
    administracion: 'Administración',
    docente: 'Docente',
    estudiante: 'Estudiante / Familia'
  };

  document.querySelector('#welcomeTitle').textContent = `Bienvenido, ${session.username}`;
  document.querySelector('#roleDescription').textContent = `Rol actual: ${labels[session.role] || session.role}`;

  document.querySelectorAll('.module-card').forEach((card) => {
    const roles = card.dataset.roles.split(',');
    card.classList.toggle('hidden', !roles.includes(session.role));
  });
}

document.querySelector('#logoutButton')?.addEventListener('click', () => {
  localStorage.removeItem('intranetSession');
  window.location.href = 'index.html';
});
