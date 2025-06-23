function login (event) {

event.preventDefault();

const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuarioLogado = usuarios.find(u => u.email === email && u.senha === senha);

  if (usuarioLogado) {
    
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
    alert("Login bem-sucedido!");
    window.location.href = "../main/Tela_Inicial.html";
  } else {
    alert("Email ou senha incorretos.");
  }

}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formLogin");
  if (form) {
    form.addEventListener("submit", login);
  }
});