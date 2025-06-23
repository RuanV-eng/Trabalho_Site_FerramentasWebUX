function cadastrar(event) {

    event.preventDefault();

      const nome = document.getElementById("nome").value;
      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;
      const confirmarSenha = document.getElementById("confirmarSenha").value;

      if (!nome || !email || !senha || !confirmarSenha) {
        alert("Preencha todos os campos.");
        return;
      }

      if (senha !== confirmarSenha) {
        alert("As senhas não coincidem.");
        return;
      }

      const novoUsuario = { nome, email, senha };

      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

      const existe = usuarios.some(u => u.email === email);
      if (existe) {
        alert("Este email já está cadastrado.");
        return;
      }

      usuarios.push(novoUsuario);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      localStorage.setItem("usuarioLogado", JSON.stringify(novoUsuario));

      window.location.href = "Tela_Inicial.html";
    }

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formCadastro");
  if (form) {
    form.addEventListener("submit", cadastrar);
  }
});