document.addEventListener("DOMContentLoaded", function () {
  const userInfoDiv = document.getElementById("user-info");
  const userEmailSpan = document.getElementById("user-email");
  const userLink = document.querySelector(".icons .user-btn");

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (usuarioLogado && usuarioLogado.nome) {
    const primeiroNome = usuarioLogado.nome.split(" ")[0];
    userEmailSpan.textContent = primeiroNome;
    userInfoDiv.style.display = "inline-block";

    userInfoDiv.addEventListener("click", function () {
      userLink.click();
    });
  } else {
    userInfoDiv.style.display = "none";
  }
});