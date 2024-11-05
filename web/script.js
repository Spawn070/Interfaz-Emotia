let comments = JSON.parse(localStorage.getItem("comments")) || []; // Cargar comentarios del localStorage

document.getElementById("login-form");
document.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevenir el envío del formulario

  login();
});

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "alumno" && password === "alumno") {
    window.location.href = "/web/alumno.html"; // Redirige a la página de comentarios
  } else if (username === "docente" && password === "docente") {
    window.location.href = "/web/docente.html"; // Redirige a la página de docentes
  } else {
    alert("Usuario o contraseña incorrectos");
  }
}

function submitComment() {
  const commentText = document.getElementById("comment").value;
  if (commentText) {
    analyzeSentiment(commentText)
      .then(() => {
        console.log("No se pudo enviar el comentario");
        document.getElementById("comment").value = "";
        showAlert("No se pudo enviar el mensaje.");
        // Limpiar el campo de entrada
      })
      .catch(() => {
        console.log("Comentario enviado con éxito");
        document.getElementById("comment").value = "";
        showAlert("¡Mensaje enviado con éxito!");
      });
  } else {
    console.log("El campo de comentario está vacío");
  }
}

function analyzeSentiment(text) {
  return fetch("http://localhost:5000/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  })
    .then((response) => response.json())
    .then((data) => {
      const commentResult = {
        text: text,
        sentiment: data.label,
        score: data.score,
      };
      comments.push(commentResult);
      localStorage.setItem("comments", JSON.stringify(comments)); // Guardar comentarios en localStorage
      displayComments();
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error; // Lanza el error para capturarlo en submitComment
    });
}

function showAlert(message) {
  const modal = document.getElementById("alertModal");
  const modalMessage = document.getElementById("modal-message");
  modalMessage.textContent = message;
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("alertModal");
  modal.style.display = "none";
}

// Para cerrar el modal cuando el usuario hace clic fuera del contenido
window.onclick = function (event) {
  const modal = document.getElementById("alertModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function updateSentimentStats() {
  const totalComments = comments.length;
  const positiveComments = comments.filter(
    (comment) => comment.sentiment === "positivo"
  ).length;
  const negativeComments = comments.filter(
    (comment) => comment.sentiment === "negativo"
  ).length;
  const neutralComments = comments.filter(
    (comment) => comment.sentiment === "neutro"
  ).length;

  const positivePercentage = ((positiveComments / totalComments) * 100).toFixed(
    2
  );
  const negativePercentage = ((negativeComments / totalComments) * 100).toFixed(
    2
  );
  const neutralPercentage = ((neutralComments / totalComments) * 100).toFixed(
    2
  );

  document.getElementById("positive-percentage").textContent =
    positivePercentage + "%";
  document.getElementById("negative-percentage").textContent =
    negativePercentage + "%";
  document.getElementById("neutral-percentage").textContent =
    neutralPercentage + "%";
}

function displayComments() {
  const commentsList = document.getElementById("comments-list");
  commentsList.innerHTML = ""; // Limpiar la lista antes de mostrar

  comments.forEach((commentResult) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${commentResult.text}</span> - <span class="sentiment">Resultado del análisis: ${commentResult.sentiment}</span>`;
    commentsList.appendChild(li);
  });

  updateSentimentStats();
}

// Para cargar los comentarios al abrir la página docente
if (document.getElementById("comments-list")) {
  displayComments();
}

function logout() {
  window.location.href = "/web/index.html"; // Redirige a la página de inicio de sesión
}

function clearComments() {
  localStorage.removeItem("comments"); // Elimina la clave "comments" del localStorage
  comments = []; // Resetea el array de comentarios
  displayComments(); // Actualiza la interfaz
}

// Para cargar los comentarios al abrir la página docente
if (document.getElementById("comments-list")) {
  displayComments();
}
