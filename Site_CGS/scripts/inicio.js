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

// Função para navegar para produto.html com categoria específica
function irParaCategoria(categoria) {
  // Salvar a categoria selecionada para uso na página de produtos
  storage.setItem("categoriaSelecionada", categoria);
  
  // Redirecionar para produto.html
  window.location.href = "../main/tela_produto.html";
}

// Sistema de Usuário
function inicializarUsuario() {
  const userInfoDiv = document.getElementById("user-info");
  const userEmailSpan = document.getElementById("user-email");
  const userLink = document.querySelector(".icons .user-btn");

  const usuarioLogado = JSON.parse(storage.getItem("usuarioLogado"));

  if (usuarioLogado && usuarioLogado.nome) {
    const primeiroNome = usuarioLogado.nome.split(" ")[0];
    userEmailSpan.textContent = primeiroNome;
    userInfoDiv.style.display = "inline-block";

    userInfoDiv.addEventListener("click", function () {
      // Criar menu dropdown do usuário
      mostrarMenuUsuario();
    });
  } else {
    userInfoDiv.style.display = "none";
  }
}

function mostrarMenuUsuario() {
  const existingMenu = document.getElementById('user-dropdown');
  if (existingMenu) {
    existingMenu.remove();
    return;
  }

  const dropdown = document.createElement('div');
  dropdown.id = 'user-dropdown';
  dropdown.innerHTML = `
    <div style="
      position: absolute;
      top: 60px;
      right: 100px;
      background: #f9f9f9 ;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      padding: 10px;
      z-index: 1000;
      min-width: 180px;
    ">
      <div style="padding: 8px 12px; border-bottom: 1px solid #eee; font-weight: bold;">
        Minha Conta
      </div>
      <div onclick="irParaPerfil()" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #eee;">
         Meu Perfil
      </div>
      <div onclick="irParaPedidos()" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #eee;">
         Meus Pedidos
      </div>
      <div onclick="logout()" style="padding: 8px 12px; cursor: pointer; color: #d32f2f;">
         Sair
      </div>
    </div>
  `;
  
  document.body.appendChild(dropdown);
  
  // Fechar ao clicar fora
  setTimeout(() => {
    document.addEventListener('click', function closeMenu(e) {
      if (!dropdown.contains(e.target)) {
        dropdown.remove();
        document.removeEventListener('click', closeMenu);
      }
    });
  }, 100);
}

function logout() {
  storage.setItem("usuarioLogado", "");
  alert("Logout realizado com sucesso!");
  location.reload();
}

function irParaPerfil() {
  alert("Funcionalidade de perfil será implementada em breve!");
}

function irParaPedidos() {
  alert("Funcionalidade de pedidos será implementada em breve!");
}

// Sistema de Busca
function inicializarBusca() {
  const searchInput = document.querySelector('.search-bar input');
  const suggestions = document.querySelector('.suggestions');
  
  if (searchInput && suggestions) {
    searchInput.addEventListener('focus', () => {
      suggestions.style.display = 'block';
    });
    
    searchInput.addEventListener('blur', () => {
      setTimeout(() => {
        suggestions.style.display = 'none';
      }, 200);
    });
    
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const suggestionItems = suggestions.querySelectorAll('.suggestion-item');
      
      suggestionItems.forEach(item => {
        if (item.textContent.toLowerCase().includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
    
    // Adicionar clique nas sugestões
    suggestions.addEventListener('click', (e) => {
      if (e.target.classList.contains('suggestion-item')) {
        searchInput.value = e.target.textContent;
        suggestions.style.display = 'none';
        realizarBusca(e.target.textContent);
      }
    });
  }
}

function realizarBusca(termo) {
  alert(`Buscando por: ${termo}`);
  // Aqui você implementaria a lógica de busca real
}

// Sistema de Carrinho
let carrinho = [];

function inicializarCarrinho() {
  const carrinhoSalvo = storage.getItem("carrinho");
  if (carrinhoSalvo) {
    carrinho = JSON.parse(carrinhoSalvo);
  }
  atualizarCarrinho();
}

function adicionarAoCarrinho(produto) {
  const itemExistente = carrinho.find(item => item.id === produto.id);
  
  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({...produto, quantidade: 1});
  }
  
  storage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarCarrinho();
  mostrarNotificacao("Produto adicionado ao carrinho!");
}

function atualizarCarrinho() {
  const carrinhoContent = document.querySelector('.cart-slide-content');
  if (!carrinhoContent) return;
  
  const header = carrinhoContent.querySelector('.cart-slide-header');
  carrinhoContent.innerHTML = '';
  carrinhoContent.appendChild(header);
  
  if (carrinho.length === 0) {
    carrinhoContent.innerHTML += '<div class="cart-item">Carrinho vazio</div>';
    return;
  }
  
  let total = 0;
  carrinho.forEach(item => {
    total += item.preco * item.quantidade;
    carrinhoContent.innerHTML += `
      <div class="cart-item">
        <div>${item.nome}</div>
        <div>Qtd: ${item.quantidade}</div>
        <div>R$ ${(item.preco * item.quantidade).toFixed(2)}</div>
        <button onclick="removerDoCarrinho('${item.id}')" style="background: #ff4444; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer;">X</button>
      </div>
    `;
  });
  
  carrinhoContent.innerHTML += `
    <div style="border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px;">
      <strong>Total: R$ ${total.toFixed(2)}</strong>
    </div>
    <button onclick="finalizarCompra()" style="width: 100%; background: #4CAF50; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
      Finalizar Compra
    </button>
  `;
}

function removerDoCarrinho(id) {
  carrinho = carrinho.filter(item => item.id !== id);
  storage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarCarrinho();
}

function finalizarCompra() {
  if (carrinho.length === 0) {
    alert("Carrinho vazio!");
    return;
  }
  
  const usuarioLogado = JSON.parse(storage.getItem("usuarioLogado"));
  if (!usuarioLogado) {
    alert("Faça login para finalizar a compra!");
    window.location.href = "../main/login.html";
    return;
  }
  
  alert("Compra finalizada com sucesso!");
  carrinho = [];
  storage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarCarrinho();
}

// Sistema de Produtos Vistos
function adicionarProdutoVisto(produto) {
  let produtosVistos = JSON.parse(storage.getItem("produtosVistos")) || [];
  
  // Remove se já existe para adicionar no início
  produtosVistos = produtosVistos.filter(p => p.id !== produto.id);
  produtosVistos.unshift(produto);
  
  // Manter apenas os últimos 10
  if (produtosVistos.length > 10) {
    produtosVistos = produtosVistos.slice(0, 10);
  }
  
  storage.setItem("produtosVistos", JSON.stringify(produtosVistos));
}

function carregarProdutosVistos() {
  const produtosVistos = JSON.parse(storage.getItem("produtosVistos")) || [];
  const seenSection = document.querySelector('.seen');
  
  if (produtosVistos.length === 0) {
    seenSection.style.display = 'none';
    return;
  }
  
  seenSection.style.display = 'block';
  // Aqui você atualizaria os produtos mostrados na seção
}

// Sistema de Menu Mobile
function inicializarMenuMobile() {
  const menuBtn = document.querySelector('.menu-btn');
  
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      mostrarMenuMobile();
    });
  }
}

function mostrarMenuMobile() {
  const existingMenu = document.getElementById('mobile-menu');
  if (existingMenu) {
    existingMenu.remove();
    return;
  }

  const menu = document.createElement('div');
  menu.id = 'mobile-menu';
  menu.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 2000;
      display: flex;
    ">
      <div style="
        width: 280px;
        height: 100%;
        background: #f9f9f9;
        padding: 20px;
        overflow-y: auto;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3>Menu</h3>
          <button onclick="document.getElementById('mobile-menu').remove()" style="
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
          ">×</button>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h4>Categorias <img src="../img/icon-carrinho.png" alt="carrinho de compras" style="width: 18px; height: auto;"/></h4>
          <div onclick="irParaCategoria('eletronicos')" style="padding: 10px 0; border-bottom: 1px solid #eee; cursor: pointer;"><img src="../img/cat_4_button.png" alt="Cat4" style="width: 20px; height: auto;"> Eletrônicos</div>
          <div onclick="irParaCategoria('roupas')" style="padding: 10px 0; border-bottom: 1px solid #eee; cursor: pointer;"><img src="../img/cat_3_button.png" alt="Cat3" style="width: 20px; height: auto;"> Roupas</div>
          <div onclick="irParaCategoria('casa')" style="padding: 10px 0; border-bottom: 1px solid #eee; cursor: pointer;"><img src="../img/cat_5_button.png" alt="Cat5" style="width: 20px; height: auto;"> Casa</div>
          <div onclick="irParaCategoria('livros')" style="padding: 10px 0; border-bottom: 1px solid #eee; cursor: pointer;"><img src="../img/cat_8_button.png" alt="Cat5" style="width: 20px; height: auto;"> Livros</div>
        </div>
        
        <div>
          <h4>Conta <img src="../img/user-icon.png" alt="Usuário" style="width: 18px; height: auto;" /></h4>
          <div onclick="irParaLogin()" style="padding: 10px 0; border-bottom: 1px solid #eee; cursor: pointer;"> Login</div>
          <div onclick="irParaCadastro()" style="padding: 10px 0; border-bottom: 1px solid #eee; cursor: pointer;"> Cadastrar</div>
        </div>
      </div>
      <div style="flex: 1;" onclick="document.getElementById('mobile-menu').remove()"></div>
    </div>
  `;
  
  document.body.appendChild(menu);
}

function irParaLogin() {
  window.location.href = "../main/login.html";
}

function irParaCadastro() {
  window.location.href = "../main/cadastro.html";
}

// Sistema de Notificações
function mostrarNotificacao(mensagem, tipo = 'success') {
  const notificacao = document.createElement('div');
  notificacao.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${tipo === 'success' ? '#4CAF50' : '#f44336'};
    color: #f9f9f9;
    padding: 15px 20px;
    border-radius: 5px;
    z-index: 3000;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  notificacao.textContent = mensagem;
  
  document.body.appendChild(notificacao);
  
  setTimeout(() => {
    notificacao.remove();
  }, 3000);
}

// Função para inicializar eventos de categoria nas páginas
function inicializarEventosCategorias() {
  // Selecionar todos os elementos de categoria (botões, links, etc.)
  const categoriaElements = document.querySelectorAll('[data-categoria]');
  
  categoriaElements.forEach(element => {
    element.addEventListener('click', (e) => {
      e.preventDefault();
      const categoria = element.getAttribute('data-categoria');
      irParaCategoria(categoria);
    });
  });
  
  // Também adicionar eventos para elementos com classes específicas
  document.querySelectorAll('.categoria-eletronicos').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      irParaCategoria('eletronicos');
    });
  });
  
  document.querySelectorAll('.categoria-roupas').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      irParaCategoria('roupas');
    });
  });
  
  document.querySelectorAll('.categoria-casa').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      irParaCategoria('casa');
    });
  });
  
  document.querySelectorAll('.categoria-livros').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      irParaCategoria('livros');
    });
  });
}

// Inicialização
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

  
  // Inicializar todos os sistemas
  inicializarUsuario();
  inicializarBusca();
  inicializarCarrinho();
  carregarProdutosVistos();
  inicializarMenuMobile();
  inicializarEventosCategorias(); // Nova função para inicializar eventos de categoria
  
  // Adicionar eventos aos produtos
  document.querySelectorAll('.btn-produto').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const produto = {
        id: Math.random().toString(36).substr(2, 9),
        nome: "Notebook Gamer Acer",
        preco: 4999,
        imagem: "../img/produto.webp"
      };
      adicionarProdutoVisto(produto);
    });
  });
});


