let comments = JSON.parse(localStorage.getItem("comments")) || []; // Cargar comentarios del localStorage

document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevenir el envío del formulario

    login();
  });

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "alumno" && password === "alumno") {
    window.location.href = "alumno.html"; // Redirige a la página de comentarios
  } else if (username === "docente" && password === "docente") {
    window.location.href = "docente.html"; // Redirige a la página de docentes
  } else {
    alert("Usuario o contraseña incorrectos");
  }
}

function submitComment() {
  const commentText = document.getElementById("comment").value;
  if (commentText) {
    analyzeSentiment(commentText);
    document.getElementById("comment").value = ""; // Limpiar el campo de entrada
  }
}

function analyzeSentiment(text) {
  fetch("http://localhost:5000/analyze", {
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
    .catch((error) => console.error("Error:", error));
}

function displayComments() {
  const commentsList = document.getElementById("comments-list");
  commentsList.innerHTML = ""; // Limpiar la lista antes de mostrar

  comments.forEach((commentResult) => {
    const li = document.createElement("li");
    li.textContent = `${commentResult.text} - Resultado del análisis: ${
      commentResult.sentiment
    } (Score: ${commentResult.score.toFixed(2)})`;
    commentsList.appendChild(li);
  });
}

// Para cargar los comentarios al abrir la página docente
if (document.getElementById("comments-list")) {
  displayComments();
}
