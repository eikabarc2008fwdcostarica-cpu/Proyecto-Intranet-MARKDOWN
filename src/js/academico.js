const session = JSON.parse(localStorage.getItem('intranetSession') || 'null');

if (!session) {
  window.location.href = 'index.html';
}

const roleLabels = {
  administracion: 'Administración',
  docente: 'Docente',
  estudiante: 'Estudiante / Familia'
};

const STORAGE_KEY = 'intranetAcademicGrades';
const canManageGrades = session && ['administracion', 'docente'].includes(session.role);
let editingGradeId = null;

const gradeForm = document.querySelector('#gradeForm');
const gradeManagement = document.querySelector('#gradeManagement');
const gradeMessage = document.querySelector('#gradeMessage');
const gradesTableBody = document.querySelector('#gradesTableBody');
const emptyGradesMessage = document.querySelector('#emptyGradesMessage');
const subjectFilter = document.querySelector('#subjectFilter');
const actionsHeader = document.querySelector('#actionsHeader');
const cancelEditButton = document.querySelector('#cancelEditButton');

function getGrades() {
  try {
    const storedGrades = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(storedGrades) ? storedGrades : [];
  } catch {
    return [];
  }
}

function saveGrades(grades) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(grades));
}

function normalizeText(value) {
  return value.trim().replace(/\s+/g, ' ');
}

function getVisibleGrades() {
  const grades = getGrades();

  // Prototipo sin backend: para Estudiante/Familia se usa el nombre de usuario
  // como referencia temporal del estudiante. En una versión real, la relación
  // debe venir de la identidad autenticada y validarse en el servidor.
  if (session?.role === 'estudiante') {
    return grades.filter(
      (item) => item.studentName.toLowerCase() === session.username.toLowerCase()
    );
  }

  return grades;
}

function updateSummary(grades) {
  const subjects = new Set(grades.map((item) => item.subject));
  const average = grades.length
    ? grades.reduce((sum, item) => sum + Number(item.grade), 0) / grades.length
    : null;

  document.querySelector('#totalGrades').textContent = grades.length;
  document.querySelector('#totalSubjects').textContent = subjects.size;
  document.querySelector('#averageGrade').textContent = average === null ? '—' : average.toFixed(2);
}

function updateSubjectFilter(grades) {
  const currentValue = subjectFilter.value;
  const subjects = [...new Set(grades.map((item) => item.subject))].sort((a, b) =>
    a.localeCompare(b, 'es')
  );

  subjectFilter.innerHTML = '<option value="">Todas las materias</option>';

  subjects.forEach((subject) => {
    const option = document.createElement('option');
    option.value = subject;
    option.textContent = subject;
    subjectFilter.appendChild(option);
  });

  if (subjects.includes(currentValue)) {
    subjectFilter.value = currentValue;
  }
}

function createCell(text) {
  const cell = document.createElement('td');
  cell.textContent = text;
  return cell;
}

function renderGrades() {
  const visibleGrades = getVisibleGrades();
  const selectedSubject = subjectFilter.value;
  const filteredGrades = selectedSubject
    ? visibleGrades.filter((item) => item.subject === selectedSubject)
    : visibleGrades;

  gradesTableBody.innerHTML = '';

  filteredGrades.forEach((item) => {
    const row = document.createElement('tr');
    row.appendChild(createCell(item.studentName));
    row.appendChild(createCell(item.subject));
    row.appendChild(createCell(item.evaluation));
    row.appendChild(createCell(Number(item.grade).toFixed(2)));
    row.appendChild(createCell(item.observations || '—'));

    if (canManageGrades) {
      const actionsCell = document.createElement('td');
      const actions = document.createElement('div');
      actions.className = 'table-actions';

      const editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.className = 'button button-small button-secondary';
      editButton.textContent = 'Editar';
      editButton.addEventListener('click', () => startEdit(item.id));

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'button button-small button-danger';
      deleteButton.textContent = 'Eliminar';
      deleteButton.addEventListener('click', () => deleteGrade(item.id));

      actions.append(editButton, deleteButton);
      actionsCell.appendChild(actions);
      row.appendChild(actionsCell);
    }

    gradesTableBody.appendChild(row);
  });

  emptyGradesMessage.classList.toggle('hidden', filteredGrades.length !== 0);
  updateSummary(visibleGrades);
  updateSubjectFilter(visibleGrades);
}

function resetForm() {
  editingGradeId = null;
  gradeForm.reset();
  document.querySelector('#gradeFormTitle').textContent = 'Registrar calificación';
  gradeForm.querySelector('button[type="submit"]').textContent = 'Guardar calificación';
  cancelEditButton.classList.add('hidden');
  gradeMessage.textContent = '';
}

function startEdit(id) {
  const item = getGrades().find((grade) => grade.id === id);
  if (!item || !canManageGrades) return;

  editingGradeId = id;
  gradeForm.elements.studentName.value = item.studentName;
  gradeForm.elements.subject.value = item.subject;
  gradeForm.elements.evaluation.value = item.evaluation;
  gradeForm.elements.grade.value = item.grade;
  gradeForm.elements.observations.value = item.observations;

  document.querySelector('#gradeFormTitle').textContent = 'Editar calificación';
  gradeForm.querySelector('button[type="submit"]').textContent = 'Guardar cambios';
  cancelEditButton.classList.remove('hidden');
  gradeManagement.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deleteGrade(id) {
  if (!canManageGrades) return;

  const grades = getGrades();
  const item = grades.find((grade) => grade.id === id);
  if (!item) return;

  const confirmed = window.confirm(
    `¿Eliminar la calificación de ${item.studentName} en ${item.subject}?`
  );

  if (!confirmed) return;

  saveGrades(grades.filter((grade) => grade.id !== id));
  if (editingGradeId === id) resetForm();
  renderGrades();
}

if (session) {
  document.querySelector('#academicWelcome').textContent = `Área académica de ${session.username}`;
  document.querySelector('#academicRole').textContent = `Rol actual: ${roleLabels[session.role] || session.role}`;

  if (canManageGrades) {
    gradeManagement.classList.remove('hidden');
  } else {
    actionsHeader.classList.add('hidden');
    document.querySelector('#gradesDescription').textContent =
      'Se muestran únicamente las calificaciones asociadas temporalmente a tu nombre de usuario.';
  }
}

gradeForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!canManageGrades) return;

  const formData = new FormData(gradeForm);
  const studentName = normalizeText(String(formData.get('studentName') || ''));
  const subject = normalizeText(String(formData.get('subject') || ''));
  const evaluation = normalizeText(String(formData.get('evaluation') || ''));
  const grade = Number(formData.get('grade'));
  const observations = normalizeText(String(formData.get('observations') || ''));

  if (!studentName || !subject || !evaluation || Number.isNaN(grade)) {
    gradeMessage.textContent = 'Complete los campos requeridos.';
    return;
  }

  if (grade < 0 || grade > 100) {
    gradeMessage.textContent = 'La calificación debe estar entre 0 y 100.';
    return;
  }

  const grades = getGrades();

  if (editingGradeId) {
    const index = grades.findIndex((item) => item.id === editingGradeId);
    if (index !== -1) {
      grades[index] = {
        ...grades[index],
        studentName,
        subject,
        evaluation,
        grade,
        observations,
        updatedAt: new Date().toISOString()
      };
    }
  } else {
    grades.push({
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      studentName,
      subject,
      evaluation,
      grade,
      observations,
      createdBy: session.username,
      createdAt: new Date().toISOString()
    });
  }

  saveGrades(grades);
  const message = editingGradeId ? 'Calificación actualizada correctamente.' : 'Calificación registrada correctamente.';
  resetForm();
  gradeMessage.textContent = message;
  renderGrades();
});

cancelEditButton?.addEventListener('click', resetForm);
subjectFilter?.addEventListener('change', renderGrades);

document.querySelector('#logoutButton')?.addEventListener('click', () => {
  localStorage.removeItem('intranetSession');
  window.location.href = 'index.html';
});

renderGrades();
