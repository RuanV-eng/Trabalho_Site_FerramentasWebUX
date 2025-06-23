function recuperar(event) {
  event.preventDefault();

  const emailDigitado = document.getElementById("email").value.toLowerCase();
  const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuarioEncontrado = listaUsuarios.find(u => u.email.toLowerCase() === emailDigitado);

  if (usuarioEncontrado) {
    window.location.href = "../main/recuperarOk.html"; // Tela de confirmação (requer backend futuramente)
  } else {
    alert("Email inválido.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formRecuperar");
  if (form) {
    form.addEventListener("submit", recuperar);
  }
});
