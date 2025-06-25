// Sistema de armazenamento adaptável
const storage = {
  getItem: function(key) {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    } else {
      if (!window.memoryStorage) window.memoryStorage = {};
      return window.memoryStorage[key] || null;
    }
  },
  
  setItem: function(key, value) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    } else {
      if (!window.memoryStorage) window.memoryStorage = {};
      window.memoryStorage[key] = value;
    }
  }
};

function recuperar(event) {
  event.preventDefault();

  const emailDigitado = document.getElementById("email").value.trim();

  // Validação básica
  if (!emailDigitado) {
    alert("Por favor, digite seu email.");
    return;
  }

  // Validação de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailDigitado)) {
    alert("Por favor, digite um email válido.");
    return;
  }

  const listaUsuarios = JSON.parse(storage.getItem("usuarios")) || [];
  const usuarioEncontrado = listaUsuarios.find(u => u.email.toLowerCase() === emailDigitado.toLowerCase());

  if (usuarioEncontrado) {
    // Salvar email para a tela de confirmação
    storage.setItem("emailRecuperacao", emailDigitado);
    
    // Mostrar carregamento
    showLoadingScreen();
    
    setTimeout(() => {
      window.location.href = "../main/recuperarOk.html";
    }, 1500);
  } else {
    alert("Email não encontrado em nossa base de dados.");
    
    // Efeito visual de erro
    const form = document.getElementById("formRecuperar");
    form.style.animation = "shake 0.5s";
    setTimeout(() => {
      form.style.animation = "";
    }, 500);
  }
}

function showLoadingScreen() {
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    loadingScreen.style.display = 'flex';
    loadingScreen.style.opacity = '1';
  }
}

// CSS para animação de erro
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);

document.addEventListener("DOMContentLoaded", function () {
  // Ocultar tela de carregamento
  setTimeout(() => {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 300);
    }
  }, 1000);

  const form = document.getElementById("formRecuperar");
  if (form) {
    form.addEventListener("submit", recuperar);
  }

  // Adicionar funcionalidade de Enter
  const emailInput = document.getElementById("email");
  if (emailInput) {
    emailInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        recuperar(e);
      }
    });
    
    // Focar no campo de email
    emailInput.focus();
  }
});