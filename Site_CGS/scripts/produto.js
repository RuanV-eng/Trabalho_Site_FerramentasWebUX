function inicializarUsuario() {
  const userInfoDiv = document.getElementById("user-info");
  const userEmailSpan = document.getElementById("user-email");

  const usuarioLogado = JSON.parse(storage.getItem("usuarioLogado"));

  if (usuarioLogado && usuarioLogado.nome) {
    const primeiroNome = usuarioLogado.nome.split(" ")[0];
    userEmailSpan.textContent = primeiroNome;
    userInfoDiv.style.display = "inline-block";

    userInfoDiv.addEventListener("click", function () {
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
  dropdown.style = `
    position: absolute;
    top: 60px;
    right: 100px;
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    padding: 10px;
    z-index: 1000;
    min-width: 180px;
  `;
  dropdown.innerHTML = `
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
  `;
  document.body.appendChild(dropdown);

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
  window.location.reload();
}

function irParaPerfil() {
  alert("Funcionalidade de perfil será implementada em breve!");
}

function irParaPedidos() {
  alert("Funcionalidade de pedidos será implementada em breve!");
}

document.addEventListener("DOMContentLoaded", function() {
  inicializarUsuario();
});

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

// Dados do produto atual
const produtoAtual = {
  id: 'notebook-acer-001',
  nome: 'Notebook Acer Nitro V15 ANV15-51-58AZ',
  preco: 4500,
  precoAntigo: 5500,
  descricao: 'Notebook Acer Nitro V15 ANV15-51-58AZ Core I5-13420h 8gb 512gb Rtx 3050 Cor Preto',
  codigo: '123456789',
  avaliacoes: 45,
  nota: 4.5,
  imagens: [
    '../img/produto.webp',
    '../img/produto.webp',
    '../img/produto.webp'
  ],
  opcoes: {
    memoria: [
      { valor: '256GB', texto: '256GB SSD', preco: 0 },
      { valor: '512GB', texto: '512GB SSD', preco: 200 },
      { valor: '1TB', texto: '1TB SSD', preco: 500 }
    ],
    cor: [
      { valor: 'preto', texto: 'Preto', preco: 0 },
      { valor: 'prata', texto: 'Prata', preco: 0 },
      { valor: 'azul', texto: 'Azul', preco: 50 }
    ]
  },
  especificacoes: {
    processador: 'Intel Core i5-13420H',
    memoria: '8GB DDR4',
    armazenamento: '512GB SSD',
    placaVideo: 'NVIDIA RTX 3050',
    tela: '15.6" Full HD',
    sistema: 'Windows 11',
    peso: '2.1kg',
    bateria: '57Wh'
  }
};

// Estado do produto
let estadoProduto = {
  opcoesSelecionadas: {
    memoria: '256GB',
    cor: 'preto'
  },
  quantidade: 1,
  imagemAtual: 0
};

// Sistema de imagens da galeria
function inicializarGaleria() {
  const imagemPrincipal = document.querySelector('.product-gallery img');
  const thumbnails = document.querySelectorAll('.gallery-thumbnails img');
  
  if (imagemPrincipal && thumbnails.length > 0) {
    // Definir primeira imagem como ativa
    thumbnails[0].classList.add('active');
    
    // Adicionar eventos aos thumbnails
    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        // Remover classe ativa de todos
        thumbnails.forEach(t => t.classList.remove('active'));
        
        // Adicionar classe ativa ao clicado
        thumb.classList.add('active');
        
        // Trocar imagem principal
        imagemPrincipal.src = produtoAtual.imagens[index];
        estadoProduto.imagemAtual = index;
      });
    });
    
    // Zoom na imagem principal
    imagemPrincipal.addEventListener('click', () => {
      abrirModalZoom(produtoAtual.imagens[estadoProduto.imagemAtual]);
    });
  }
}

// Modal de zoom da imagem
function abrirModalZoom(imagemSrc) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3000;
    cursor: pointer;
  `;
  
  const img = document.createElement('img');
  img.src = imagemSrc;
  img.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
  `;
  
  modal.appendChild(img);
  document.body.appendChild(modal);
  
  modal.addEventListener('click', () => {
    modal.remove();
  });
}

// Sistema de opções do produto
function inicializarOpcoes() {
  const selectMemoria = document.getElementById('memoria');
  
  if (selectMemoria) {
    // Limpar opções existentes
    selectMemoria.innerHTML = '';
    
    // Adicionar opções de memória
    produtoAtual.opcoes.memoria.forEach(opcao => {
      const option = document.createElement('option');
      option.value = opcao.valor;
      option.textContent = opcao.preco > 0 ? 
        `${opcao.texto} (+R$ ${opcao.preco})` : opcao.texto;
      selectMemoria.appendChild(option);
    });
    
    // Event listener para mudanças
    selectMemoria.addEventListener('change', (e) => {
      estadoProduto.opcoesSelecionadas.memoria = e.target.value;
      atualizarPreco();
    });
  }
  
  // Criar seletor de cor se não existir
  criarSeletorCor();
}

// Criar seletor de cor
function criarSeletorCor() {
  const opcoesProduto = document.querySelector('.product-options');
  if (!opcoesProduto) return;
  
  // Verificar se já existe
  if (document.getElementById('cor-options')) return;
  
  const corContainer = document.createElement('div');
  corContainer.id = 'cor-options';
  corContainer.style.marginTop = '15px';
  
  const label = document.createElement('label');
  label.textContent = 'Cor:';
  label.style.display = 'block';
  label.style.marginBottom = '8px';
  
  const coresDiv = document.createElement('div');
  coresDiv.style.cssText = `
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  `;
  
  produtoAtual.opcoes.cor.forEach(opcao => {
    const botaoCor = document.createElement('button');
    botaoCor.textContent = opcao.texto;
    botaoCor.style.cssText = `
      padding: 8px 16px;
      border: 2px solid #ddd;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s;
    `;
    
    // Marcar primeira opção como selecionada
    if (opcao.valor === estadoProduto.opcoesSelecionadas.cor) {
      botaoCor.style.borderColor = '#007bff';
      botaoCor.style.background = '#007bff';
      botaoCor.style.color = 'white';
    }
    
    botaoCor.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remover seleção de outros botões
      coresDiv.querySelectorAll('button').forEach(btn => {
        btn.style.borderColor = '#ddd';
        btn.style.background = 'white';
        btn.style.color = 'black';
      });
      
      // Selecionar este botão
      botaoCor.style.borderColor = '#007bff';
      botaoCor.style.background = '#007bff';
      botaoCor.style.color = 'white';
      
      estadoProduto.opcoesSelecionadas.cor = opcao.valor;
      atualizarPreco();
    });
    
    coresDiv.appendChild(botaoCor);
  });
  
  corContainer.appendChild(label);
  corContainer.appendChild(coresDiv);
  
  // Inserir após o select de memória
  const selectMemoria = document.getElementById('memoria');
  if (selectMemoria) {
    selectMemoria.parentNode.insertBefore(corContainer, selectMemoria.nextSibling);
  }
}

// Atualizar preço baseado nas opções selecionadas
function atualizarPreco() {
  let precoFinal = produtoAtual.preco;
  
  // Adicionar preço das opções
  const opcaoMemoria = produtoAtual.opcoes.memoria.find(
    opt => opt.valor === estadoProduto.opcoesSelecionadas.memoria
  );
  const opcaoCor = produtoAtual.opcoes.cor.find(
    opt => opt.valor === estadoProduto.opcoesSelecionadas.cor
  );
  
  if (opcaoMemoria) precoFinal += opcaoMemoria.preco;
  if (opcaoCor) precoFinal += opcaoCor.preco;
  
  // Atualizar display do preço
  const precoElement = document.querySelector('.price');
  if (precoElement) {
    precoElement.textContent = `R$ ${precoFinal.toFixed(2).replace('.', ',')}`;
  }
}

// Sistema de quantidade
function inicializarQuantidade() {
  const quantityInput = document.getElementById('quantity');
  
  if (quantityInput) {
    // Criar controles de + e -
    const container = quantityInput.parentNode;
    
    // Botão de diminuir
    const btnMenos = document.createElement('button');
    btnMenos.textContent = '-';
    btnMenos.style.cssText = `
      width: 30px;
      height: 30px;
      border: 1px solid #ddd;
      background: #f8f9fa;
      cursor: pointer;
      border-radius: 4px 0 0 4px;
    `;
    
    // Botão de aumentar
    const btnMais = document.createElement('button');
    btnMais.textContent = '+';
    btnMais.style.cssText = `
      width: 30px;
      height: 30px;
      border: 1px solid #ddd;
      background: #f8f9fa;
      cursor: pointer;
      border-radius: 0 4px 4px 0;
    `;
    
    // Estilizar input
    quantityInput.style.cssText = `
      width: 60px;
      height: 30px;
      text-align: center;
      border: 1px solid #ddd;
      border-left: none;
      border-right: none;
    `;
    
    // Eventos
    btnMenos.addEventListener('click', (e) => {
      e.preventDefault();
      if (estadoProduto.quantidade > 1) {
        estadoProduto.quantidade--;
        quantityInput.value = estadoProduto.quantidade;
      }
    });
    
    btnMais.addEventListener('click', (e) => {
      e.preventDefault();
      estadoProduto.quantidade++;
      quantityInput.value = estadoProduto.quantidade;
    });
    
    quantityInput.addEventListener('change', (e) => {
      const valor = parseInt(e.target.value);
      if (valor > 0) {
        estadoProduto.quantidade = valor;
      } else {
        estadoProduto.quantidade = 1;
        quantityInput.value = 1;
      }
    });
    
    // Inserir botões
    container.insertBefore(btnMenos, quantityInput);
    container.appendChild(btnMais);
  }
}

// Sistema de carrinho
function inicializarBotoesCarrinho() {
  const btnAdicionarCarrinho = document.querySelector('.add-to-cart');
  const btnListaDesejos = document.querySelector('.add-to-wishlist');
  
  if (btnAdicionarCarrinho) {
    btnAdicionarCarrinho.addEventListener('click', () => {
      adicionarAoCarrinho();
    });
  }
  
  if (btnListaDesejos) {
    btnListaDesejos.addEventListener('click', () => {
      adicionarAListaDesejos();
    });
  }
}

function adicionarAoCarrinho() {
  // Calcular preço final
  let precoFinal = produtoAtual.preco;
  const opcaoMemoria = produtoAtual.opcoes.memoria.find(
    opt => opt.valor === estadoProduto.opcoesSelecionadas.memoria
  );
  const opcaoCor = produtoAtual.opcoes.cor.find(
    opt => opt.valor === estadoProduto.opcoesSelecionadas.cor
  );
  
  if (opcaoMemoria) precoFinal += opcaoMemoria.preco;
  if (opcaoCor) precoFinal += opcaoCor.preco;
  
  // Criar item do carrinho
  const itemCarrinho = {
    id: `${produtoAtual.id}-${estadoProduto.opcoesSelecionadas.memoria}-${estadoProduto.opcoesSelecionadas.cor}`,
    nome: produtoAtual.nome,
    preco: precoFinal,
    quantidade: estadoProduto.quantidade,
    opcoes: {
      memoria: estadoProduto.opcoesSelecionadas.memoria,
      cor: estadoProduto.opcoesSelecionadas.cor
    },
    imagem: produtoAtual.imagens[0]
  };
  
  // Obter carrinho atual
  let carrinho = JSON.parse(storage.getItem('carrinho')) || [];
  
  // Verificar se item já existe
  const itemExistente = carrinho.find(item => item.id === itemCarrinho.id);
  
  if (itemExistente) {
    itemExistente.quantidade += itemCarrinho.quantidade;
  } else {
    carrinho.push(itemCarrinho);
  }
  
  // Salvar carrinho
  storage.setItem('carrinho', JSON.stringify(carrinho));
  
  // Mostrar notificação
  mostrarNotificacao('Produto adicionado ao carrinho!', 'success');
  
  // Atualizar display do carrinho se existir
  atualizarDisplayCarrinho();
}

function adicionarAListaDesejos() {
  let listaDesejos = JSON.parse(storage.getItem('listaDesejos')) || [];
  
  const itemLista = {
    id: produtoAtual.id,
    nome: produtoAtual.nome,
    preco: produtoAtual.preco,
    imagem: produtoAtual.imagens[0]
  };
  
  // Verificar se já existe
  const jaExiste = listaDesejos.find(item => item.id === produtoAtual.id);
  
  if (jaExiste) {
    mostrarNotificacao('Produto já está na lista de desejos!', 'info');
  } else {
    listaDesejos.push(itemLista);
    storage.setItem('listaDesejos', JSON.stringify(listaDesejos));
    mostrarNotificacao('Produto adicionado à lista de desejos!', 'success');
  }
}

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
        <h3 style="color: black;">Menu</h3>
        <button onclick="document.getElementById('mobile-menu').remove()" style="
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        ">×</button>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="color: black;">Categorias <img src="../img/icon-carrinho.png" alt="carrinho de compras" style="width: 18px; height: auto;"/></h4>
        <div onclick="irParaCategoria('eletronicos')" style="padding: 10px 0; border-bottom: 1px solid #eee; cursor: pointer; color: black;"><img src="../img/cat_4_button.png" alt="Cat4" style="width: 20px; height: auto;"> Eletrônicos</div>
        <div onclick="irParaCategoria('roupas')" style="padding: 10px 0; border-bottom: 1px solid #eee; cursor: pointer; color: black;"><img src="../img/cat_3_button.png" alt="Cat3" style="width: 20px; height: auto;"> Roupas</div>
        <div onclick="irParaCategoria('casa')" style="padding: 10px 0; border-bottom: 1px solid #eee; cursor: pointer; color: black;"><img src="../img/cat_5_button.png" alt="Cat5" style="width: 20px; height: auto;"> Casa</div>
        <div onclick="irParaCategoria('livros')" style="padding: 10px 0; border-bottom: 1px solid #eee; cursor: pointer; color: black;"><img src="../img/cat_8_button.png" alt="Cat5" style="width: 20px; height: auto;"> Livros</div>
      </div>
      
      <div>
        <h4 style="color: black;">Conta <img src="../img/user-icon.png" alt="Usuário" style="width: 18px; height: auto;" /></h4>
        <div onclick="irParaLogin()" style="padding: 10px 0; border-bottom: 1px solid #eee; cursor: pointer; color: black;"> Login</div>
        <div onclick="irParaCadastro()" style="padding: 10px 0; border-bottom: 1px solid #eee; cursor: pointer; color: black;"> Cadastrar</div>
      </div>
    </div>
    <div style="flex: 1;" onclick="document.getElementById('mobile-menu').remove()"></div>
  </div>
`;

document.body.appendChild(menu);
}

function irParaCategoria(categoria) {
  storage.setItem("categoriaSelecionada", categoria);
  window.location.href = "../main/tela_produto.html";
}

function irParaLogin() {
  window.location.href = "../main/login.html";
}

function irParaCadastro() {
  window.location.href = "../main/cadastro.html";
}

// Atualizar display do carrinho
function atualizarDisplayCarrinho() {
  const cartContent = document.querySelector('.cart-slide-content');
  if (!cartContent) return;
  
  const carrinho = JSON.parse(storage.getItem('carrinho')) || [];
  const header = cartContent.querySelector('.cart-slide-header');
  
  // Limpar conteúdo mantendo header
  cartContent.innerHTML = '';
  if (header) {
    cartContent.appendChild(header);
  }
  
  if (carrinho.length === 0) {
    cartContent.innerHTML += '<div class="cart-item">Carrinho vazio</div>';
    return;
  }
  
  let total = 0;
  carrinho.forEach(item => {
    total += item.preco * item.quantidade;
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
        <div>
          <div style="font-weight: bold; font-size: 14px;">${item.nome}</div>
          <div style="font-size: 12px; color: #666;">
            ${item.opcoes ? `${item.opcoes.memoria} - ${item.opcoes.cor}` : ''}
          </div>
          <div style="font-size: 12px;">Qtd: ${item.quantidade}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: bold;">R$ ${(item.preco * item.quantidade).toFixed(2)}</div>
          <button onclick="removerDoCarrinho('${item.id}')" style="
            background: #ff4444; 
            color: white; 
            border: none; 
            padding: 2px 6px; 
            border-radius: 3px; 
            cursor: pointer;
            font-size: 12px;
            margin-top: 5px;
          ">Remover</button>
        </div>
      </div>
    `;
    
    cartContent.appendChild(itemDiv);
  });
  
  // Total
  const totalDiv = document.createElement('div');
  totalDiv.innerHTML = `
    <div style="border-top: 2px solid #ddd; padding-top: 15px; margin-top: 10px;">
      <div style="font-size: 18px; font-weight: bold; text-align: center;">
        Total: R$ ${total.toFixed(2)}
      </div>
      <button onclick="finalizarCompra()" style="
        width: 100%; 
        background: #4CAF50; 
        color: white; 
        border: none; 
        padding: 12px; 
        border-radius: 5px; 
        cursor: pointer; 
        margin-top: 15px;
        font-size: 16px;
        font-weight: bold;
      ">
        Finalizar Compra
      </button>
    </div>
  `;
  
  cartContent.appendChild(totalDiv);
}

function removerDoCarrinho(itemId) {
  let carrinho = JSON.parse(storage.getItem('carrinho')) || [];
  carrinho = carrinho.filter(item => item.id !== itemId);
  storage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarDisplayCarrinho();
  mostrarNotificacao('Item removido do carrinho!', 'info');
}

function finalizarCompra() {
  const carrinho = JSON.parse(storage.getItem('carrinho')) || [];
  
  if (carrinho.length === 0) {
    mostrarNotificacao('Carrinho vazio!', 'error');
    return;
  }
  
  // Verificar se usuário está logado (se tiver sistema de login)
  const usuarioLogado = storage.getItem('usuarioLogado');
  if (!usuarioLogado) {
    mostrarNotificacao('Faça login para finalizar a compra!', 'error');
    // Redirecionar para login se necessário
    // window.location.href = '../main/login.html';
    return;
  }
  
  // Simular finalização da compra
  mostrarNotificacao('Compra finalizada com sucesso!', 'success');
  
  // Limpar carrinho
  storage.setItem('carrinho', JSON.stringify([]));
  atualizarDisplayCarrinho();
  
  // Fechar carrinho
  const cartToggle = document.getElementById('cart-toggle');
  if (cartToggle) {
    cartToggle.checked = false;
  }
}

// Sistema de notificações
function mostrarNotificacao(mensagem, tipo = 'success') {
  const cores = {
    success: '#4CAF50',
    error: '#f44336',
    info: '#2196F3',
    warning: '#ff9800'
  };
  
  const notificacao = document.createElement('div');
  notificacao.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${cores[tipo]};
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 3000;
    font-weight: bold;
    transform: translateX(400px);
    transition: transform 0.3s ease;
  `;
  
  notificacao.textContent = mensagem;
  document.body.appendChild(notificacao);
  
  // Animar entrada
  setTimeout(() => {
    notificacao.style.transform = 'translateX(0)';
  }, 100);
  
  // Remover após 3 segundos
  setTimeout(() => {
    notificacao.style.transform = 'translateX(400px)';
    setTimeout(() => {
      notificacao.remove();
    }, 300);
  }, 3000);
}

// Registrar produto como visto
function registrarProdutoVisto() {
  let produtosVistos = JSON.parse(storage.getItem('produtosVistos')) || [];
  
  // Remover se já existe
  produtosVistos = produtosVistos.filter(p => p.id !== produtoAtual.id);
  
  // Adicionar no início
  produtosVistos.unshift({
    id: produtoAtual.id,
    nome: produtoAtual.nome,
    preco: produtoAtual.preco,
    imagem: produtoAtual.imagens[0]
  });
  
  // Manter apenas os últimos 10
  if (produtosVistos.length > 10) {
    produtosVistos = produtosVistos.slice(0, 10);
  }
  
  storage.setItem('produtosVistos', JSON.stringify(produtosVistos));
}

// Inicialização principal
document.addEventListener('DOMContentLoaded', function() {
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
  inicializarGaleria();
  inicializarOpcoes();
  inicializarQuantidade();
  inicializarBotoesCarrinho();
  registrarProdutoVisto();
  atualizarDisplayCarrinho();
  inicializarMenuMobile();
  
  console.log('Sistema de produto inicializado com sucesso!');
});