/* =========================================================
   COMUNICADOS · CENTRO EDUCATIVO
   Los emojis fueron reemplazados por iconos SVG.
========================================================= */


/* =========================================================
   DATOS INICIALES
========================================================= */

const defaultCommunications = [

    {
        id: 1,

        title: "Reunión general de padres de familia",

        category: "evento",

        author: "Dirección Académica",

        date: "2026-08-12",

        content:
            "La institución informa que el próximo viernes se realizará una reunión general de padres de familia. La actividad iniciará a las 6:00 p.m. en el auditorio principal.",

        reactions: {
            like: 12,
            heart: 5,
            important: 3
        },

        comments: [
            {
                id: 1,
                author: "María González",
                text: "Muchas gracias por la información."
            },
            {
                id: 2,
                author: "Carlos Rodríguez",
                text: "¿La reunión será presencial?"
            }
        ]
    },


    {
        id: 2,

        title: "Entrega de calificaciones del segundo periodo",

        category: "academico",

        author: "Coordinación Académica",

        date: "2026-08-10",

        content:
            "Se informa a estudiantes y familias que las calificaciones correspondientes al segundo periodo estarán disponibles en la plataforma institucional a partir del próximo lunes.",

        reactions: {
            like: 18,
            heart: 7,
            important: 6
        },

        comments: [
            {
                id: 3,
                author: "Ana Martínez",
                text: "Excelente, estaremos pendientes."
            }
        ]
    },


    {
        id: 3,

        title: "Suspensión temporal del servicio de biblioteca",

        category: "administrativo",

        author: "Administración",

        date: "2026-08-08",

        content:
            "La biblioteca permanecerá cerrada durante los días miércoles y jueves debido a trabajos de mantenimiento. El servicio se reanudará normalmente el viernes.",

        reactions: {
            like: 9,
            heart: 2,
            important: 8
        },

        comments: []
    }

];


/* =========================================================
   LOCAL STORAGE
========================================================= */

let communications =
    JSON.parse(
        localStorage.getItem("communications")
    ) || defaultCommunications;


function saveCommunications() {

    localStorage.setItem(
        "communications",
        JSON.stringify(communications)
    );
}


/* =========================================================
   ELEMENTOS DEL DOM
========================================================= */

const roleSelect =
    document.getElementById("roleSelect");

const userView =
    document.getElementById("userView");

const adminView =
    document.getElementById("adminView");

const communicationsContainer =
    document.getElementById(
        "communicationsContainer"
    );

const adminTableBody =
    document.getElementById(
        "adminTableBody"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const categoryFilter =
    document.getElementById(
        "categoryFilter"
    );

const communicationModal =
    document.getElementById(
        "communicationModal"
    );

const communicationForm =
    document.getElementById(
        "communicationForm"
    );

const modalTitle =
    document.getElementById(
        "modalTitle"
    );

const communicationId =
    document.getElementById(
        "communicationId"
    );

const titleInput =
    document.getElementById("title");

const categoryInput =
    document.getElementById("category");

const authorInput =
    document.getElementById("author");

const contentInput =
    document.getElementById("content");


/* =========================================================
   CAMBIO DE ROL
========================================================= */

roleSelect.addEventListener(
    "change",
    () => {

        const role =
            roleSelect.value;


        if (role === "admin") {

            userView.classList.add(
                "hidden"
            );

            adminView.classList.remove(
                "hidden"
            );

            renderAdmin();

        } else {

            adminView.classList.add(
                "hidden"
            );

            userView.classList.remove(
                "hidden"
            );

            renderCommunications();

        }

    }
);


/* =========================================================
   FORMATEAR FECHA
========================================================= */

function formatDate(date) {

    const options = {

        year: "numeric",

        month: "long",

        day: "numeric"

    };


    return new Date(
        date + "T00:00:00"
    ).toLocaleDateString(
        "es-CR",
        options
    );
}


/* =========================================================
   CATEGORÍAS
========================================================= */

function categoryName(category) {

    const categories = {

        academico: "Académico",

        evento: "Evento",

        administrativo:
            "Administrativo",

        urgente: "Urgente"

    };


    return categories[category]
        || category;
}


/* =========================================================
   RENDERIZAR COMUNICADOS
========================================================= */

function renderCommunications() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const category =
        categoryFilter.value;


    const filtered =
        communications.filter(
            item => {

                const matchesSearch =
                    item.title
                        .toLowerCase()
                        .includes(search)
                    ||
                    item.content
                        .toLowerCase()
                        .includes(search);


                const matchesCategory =
                    category === "todos"
                    ||
                    item.category === category;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    document.getElementById(
        "userCounter"
    ).textContent =
        filtered.length;


    if (filtered.length === 0) {

        communicationsContainer.innerHTML = `

            <div class="communication-card">

                <h4>
                    No se encontraron comunicados
                </h4>

                <p class="content">
                    Intenta modificar los filtros
                    o realizar otra búsqueda.
                </p>

            </div>

        `;

        return;
    }


    communicationsContainer.innerHTML =
        filtered
            .map(
                createCommunicationCard
            )
            .join("");
}


/* =========================================================
   CARD DE COMUNICADO
========================================================= */

function createCommunicationCard(item) {

    const comments =
        item.comments || [];


    const reactions =
        item.reactions || {

            like: 0,

            heart: 0,

            important: 0

        };


    return `

        <article
            class="communication-card"
            data-id="${item.id}"
        >

            <div class="card-top">

                <span class="category">

                    ${categoryName(
                        item.category
                    )}

                </span>


                <span class="date">

                    ${formatDate(
                        item.date
                    )}

                </span>

            </div>


            <h4>
                ${escapeHTML(
                    item.title
                )}
            </h4>


            <p class="content">

                ${escapeHTML(
                    item.content
                )}

            </p>


            <div class="author">

                <div class="author-avatar">

                    ${getInitials(
                        item.author
                    )}

                </div>


                <div>

                    <strong>
                        ${escapeHTML(
                            item.author
                        )}
                    </strong>

                    <span>
                        Publicación oficial
                    </span>

                </div>

            </div>


            <div class="interactions">


                <div class="reactions">


                    <!-- ==============================
                         REACCIÓN: ME GUSTA
                    =============================== -->

                    <button
                        class="reaction-btn"
                        onclick="react(${item.id}, 'like')"
                        title="Me gusta"
                    >

                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >

                            <path
                                d="M7 10V21H4C3.45 21 3 20.55 3 20V11C3 10.45 3.45 10 4 10H7Z"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linejoin="round"
                            />

                            <path
                                d="M7 21H17.5C18.4 21 19.18 20.4 19.41 19.53L21.08 13.2C21.42 11.91 20.45 10.65 19.12 10.65H15V6C15 4.34 13.66 3 12 3L7 10V21Z"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />

                        </svg>


                        <span>
                            ${reactions.like}
                        </span>

                    </button>


                    <!-- ==============================
                         REACCIÓN: CORAZÓN
                    =============================== -->

                    <button
                        class="reaction-btn"
                        onclick="react(${item.id}, 'heart')"
                        title="Me encanta"
                    >

                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >

                            <path
                                d="M20.84 4.61C19.73 3.5 18.21 3 16.75 3C15.29 3 13.77 3.5 12.66 4.61L12 5.27L11.34 4.61C9.11 2.39 5.5 2.39 3.27 4.61C1.04 6.84 1.04 10.45 3.27 12.68L12 21L20.73 12.68C22.96 10.45 22.96 6.84 20.84 4.61Z"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />

                        </svg>


                        <span>
                            ${reactions.heart}
                        </span>

                    </button>


                    <!-- ==============================
                         REACCIÓN: IMPORTANTE
                    =============================== -->

                    <button
                        class="reaction-btn"
                        onclick="react(${item.id}, 'important')"
                        title="Importante"
                    >

                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >

                            <path
                                d="M6 4C6 3.45 6.45 3 7 3H17C17.55 3 18 3.45 18 4V21L12 17.5L6 21V4Z"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />

                        </svg>


                        <span>
                            ${reactions.important}
                        </span>

                    </button>


                    <!-- ==============================
                         COMENTARIOS
                    =============================== -->

                    <span
                        class="comments-count"
                        title="Comentarios"
                    >

                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >

                            <path
                                d="M20 11.5C20 15.64 16.42 19 12 19C10.72 19 9.51 18.72 8.45 18.23L4 20L5.43 16.35C4.53 15.05 4 13.38 4 11.5C4 7.36 7.58 4 12 4C16.42 4 20 7.36 20 11.5Z"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />

                            <path
                                d="M8 11.5H8.01M12 11.5H12.01M16 11.5H16.01"
                                stroke="currentColor"
                                stroke-width="2.5"
                                stroke-linecap="round"
                            />

                        </svg>


                        ${comments.length}

                    </span>

                </div>


                <!-- COMENTARIOS -->

                <div class="comments">

                    ${comments
                        .map(
                            createComment
                        )
                        .join("")}


                    <form
                        class="comment-form"
                        onsubmit="addComment(event, ${item.id})"
                    >

                        <input
                            type="text"
                            placeholder="Escribe un comentario..."
                            required
                        >


                        <button
                            type="submit"
                            title="Enviar comentario"
                        >

                            <!-- ICONO ENVIAR -->

                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >

                                <path
                                    d="M22 2L11 13"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />

                                <path
                                    d="M22 2L15 22L11 13L2 9L22 2Z"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />

                            </svg>

                        </button>

                    </form>

                </div>

            </div>

        </article>

    `;
}


/* =========================================================
   CREAR COMENTARIO
========================================================= */

function createComment(comment) {

    return `

        <div class="comment">

            <div class="comment-avatar">

                ${getInitials(
                    comment.author
                )}

            </div>


            <div class="comment-body">

                <strong>
                    ${escapeHTML(
                        comment.author
                    )}
                </strong>


                <p>
                    ${escapeHTML(
                        comment.text
                    )}
                </p>

            </div>

        </div>

    `;
}


/* =========================================================
   REACCIONES
========================================================= */

function react(id, type) {

    const communication =
        communications.find(
            item =>
                item.id === id
        );


    if (!communication) {
        return;
    }


    if (!communication.reactions) {

        communication.reactions = {

            like: 0,

            heart: 0,

            important: 0

        };

    }


    communication.reactions[type]++;


    saveCommunications();

    renderCommunications();

    renderAdmin();

}


/* =========================================================
   AGREGAR COMENTARIO
========================================================= */

function addComment(event, id) {

    event.preventDefault();


    const form =
        event.target;


    const input =
        form.querySelector(
            "input"
        );


    const text =
        input.value.trim();


    if (!text) {
        return;
    }


    const communication =
        communications.find(
            item =>
                item.id === id
        );


    if (!communication) {
        return;
    }


    if (!communication.comments) {

        communication.comments = [];

    }


    communication.comments.push({

        id: Date.now(),

        author: "Usuario",

        text: text

    });


    saveCommunications();

    renderCommunications();

    renderAdmin();

}


/* =========================================================
   ADMINISTRACIÓN
========================================================= */

function renderAdmin() {

    adminTableBody.innerHTML =
        communications
            .map(item => {


                const totalReactions =
                    Object.values(
                        item.reactions || {}
                    )
                    .reduce(
                        (sum, value) =>
                            sum + value,
                        0
                    );


                return `

                    <tr>


                        <td>

                            <strong>

                                ${escapeHTML(
                                    item.title
                                )}

                            </strong>


                            <small>

                                ${escapeHTML(
                                    item.content
                                        .substring(
                                            0,
                                            65
                                        )
                                )}...

                            </small>

                        </td>


                        <td>

                            <span class="category">

                                ${categoryName(
                                    item.category
                                )}

                            </span>

                        </td>


                        <td>

                            ${escapeHTML(
                                item.author
                            )}

                        </td>


                        <td>

                            ${formatDate(
                                item.date
                            )}

                        </td>


                        <!-- =================================
                             INTERACCIONES CON ICONOS
                        ================================== -->

                        <td>

                            <div
                                class="admin-interactions"
                            >


                                <!-- ICONO REACCIONES -->

                                <span
                                    class="interaction-item"
                                    title="Reacciones"
                                >

                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >

                                        <path
                                            d="M7 10V21H4C3.45 21 3 20.55 3 20V11C3 10.45 3.45 10 4 10H7Z"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linejoin="round"
                                        />

                                        <path
                                            d="M7 21H17.5C18.4 21 19.18 20.4 19.41 19.53L21.08 13.2C21.42 11.91 20.45 10.65 19.12 10.65H15V6C15 4.34 13.66 3 12 3L7 10V21Z"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />

                                    </svg>


                                    <span>
                                        ${totalReactions}
                                    </span>

                                </span>


                                <!-- ICONO COMENTARIOS -->

                                <span
                                    class="interaction-item"
                                    title="Comentarios"
                                >

                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >

                                        <path
                                            d="M20 11.5C20 15.64 16.42 19 12 19C10.72 19 9.51 18.72 8.45 18.23L4 20L5.43 16.35C4.53 15.05 4 13.38 4 11.5C4 7.36 7.58 4 12 4C16.42 4 20 7.36 20 11.5Z"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />

                                        <path
                                            d="M8 11.5H8.01M12 11.5H12.01M16 11.5H16.01"
                                            stroke="currentColor"
                                            stroke-width="2.5"
                                            stroke-linecap="round"
                                        />

                                    </svg>


                                    <span>
                                        ${(item.comments || []).length}
                                    </span>

                                </span>

                            </div>

                        </td>


                        <!-- ACCIONES -->

                        <td>

                            <div
                                class="table-actions"
                            >


                                <!-- EDITAR -->

                                <button
                                    class="action-btn edit"
                                    onclick="editCommunication(${item.id})"
                                    title="Editar comunicado"
                                >

                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >

                                        <path
                                            d="M12 20H21"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                        />

                                        <path
                                            d="M16.5 3.5C17.3284 2.67157 18.6716 2.67157 19.5 3.5C20.3284 4.32843 20.3284 5.67157 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />

                                    </svg>

                                    Editar

                                </button>


                                <!-- ELIMINAR -->

                                <button
                                    class="action-btn delete"
                                    onclick="deleteCommunication(${item.id})"
                                    title="Eliminar comunicado"
                                >

                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >

                                        <path
                                            d="M3 6H21"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                        />

                                        <path
                                            d="M8 6V4C8 3.45 8.45 3 9 3H15C15.55 3 16 3.45 16 4V6"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                        />

                                        <path
                                            d="M19 6L18 21H6L5 6"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linejoin="round"
                                        />

                                        <path
                                            d="M10 10V17"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                        />

                                        <path
                                            d="M14 10V17"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                        />

                                    </svg>

                                    Eliminar

                                </button>

                            </div>

                        </td>

                    </tr>

                `;

            })
            .join("");


    updateStatistics();

}


/* =========================================================
   ESTADÍSTICAS
========================================================= */

function updateStatistics() {

    let comments = 0;

    let reactions = 0;


    communications.forEach(
        item => {

            comments +=
                (
                    item.comments || []
                ).length;


            reactions +=
                Object.values(
                    item.reactions || {}
                )
                .reduce(
                    (sum, value) =>
                        sum + value,
                    0
                );

        }
    );


    document.getElementById(
        "totalCommunications"
    ).textContent =
        communications.length;


    document.getElementById(
        "totalComments"
    ).textContent =
        comments;


    document.getElementById(
        "totalReactions"
    ).textContent =
        reactions;

}


/* =========================================================
   NUEVO COMUNICADO
========================================================= */

document
    .getElementById(
        "newCommunicationBtn"
    )
    .addEventListener(
        "click",
        () => {

            communicationForm.reset();

            communicationId.value =
                "";

            authorInput.value =
                "Administración";

            modalTitle.textContent =
                "Nuevo comunicado";

            communicationModal
                .classList
                .remove("hidden");

        }
    );


/* =========================================================
   EDITAR COMUNICADO
========================================================= */

function editCommunication(id) {

    const communication =
        communications.find(
            item =>
                item.id === id
        );


    if (!communication) {
        return;
    }


    communicationId.value =
        communication.id;


    titleInput.value =
        communication.title;


    categoryInput.value =
        communication.category;


    authorInput.value =
        communication.author;


    contentInput.value =
        communication.content;


    modalTitle.textContent =
        "Editar comunicado";


    communicationModal
        .classList
        .remove("hidden");

}


/* =========================================================
   ELIMINAR COMUNICADO
========================================================= */

function deleteCommunication(id) {

    const communication =
        communications.find(
            item =>
                item.id === id
        );


    if (!communication) {
        return;
    }


    const confirmed =
        confirm(
            `¿Deseas eliminar el comunicado "${communication.title}"?`
        );


    if (!confirmed) {
        return;
    }


    communications =
        communications.filter(
            item =>
                item.id !== id
        );


    saveCommunications();

    renderAdmin();

    renderCommunications();

}


/* =========================================================
   GUARDAR / ACTUALIZAR
========================================================= */

communicationForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const id =
            communicationId.value;


        const title =
            titleInput.value.trim();


        const category =
            categoryInput.value;


        const author =
            authorInput.value.trim();


        const content =
            contentInput.value.trim();


        if (
            !title ||
            !category ||
            !author ||
            !content
        ) {

            return;

        }


        if (id) {

            const communication =
                communications.find(
                    item =>
                        item.id ===
                        Number(id)
                );


            if (communication) {

                communication.title =
                    title;

                communication.category =
                    category;

                communication.author =
                    author;

                communication.content =
                    content;

            }

        } else {

            communications.unshift({

                id: Date.now(),

                title,

                category,

                author,

                date:
                    new Date()
                        .toISOString()
                        .split("T")[0],

                content,

                reactions: {

                    like: 0,

                    heart: 0,

                    important: 0

                },

                comments: []

            });

        }


        saveCommunications();

        closeModal();

        renderAdmin();

        renderCommunications();

    }
);


/* =========================================================
   CERRAR MODAL
========================================================= */

function closeModal() {

    communicationModal
        .classList
        .add("hidden");


    communicationForm.reset();


    communicationId.value =
        "";

}


document
    .getElementById(
        "closeModalBtn"
    )
    .addEventListener(
        "click",
        closeModal
    );


document
    .getElementById(
        "cancelBtn"
    )
    .addEventListener(
        "click",
        closeModal
    );


communicationModal
    .addEventListener(
        "click",
        event => {

            if (
                event.target ===
                communicationModal
            ) {

                closeModal();

            }

        }
    );


/* =========================================================
   BÚSQUEDA Y FILTROS
========================================================= */

searchInput.addEventListener(
    "input",
    renderCommunications
);


categoryFilter.addEventListener(
    "change",
    renderCommunications
);


/* =========================================================
   UTILIDADES
========================================================= */

function getInitials(name) {

    return name
        .split(" ")
        .slice(0, 2)
        .map(
            word =>
                word.charAt(0)
        )
        .join("")
        .toUpperCase();

}


function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================================================
   INICIALIZACIÓN
========================================================= */

saveCommunications();

renderCommunications();

renderAdmin();