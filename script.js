const API_URL = "/api/listar";

// Função principal
async function carregarProdutos() {
  const container = document.getElementById("lista-produtos");

  try {
    const res = await fetch(API_URL);

    // Se ainda não existir API, entra no fallback
    if (!res.ok) throw new Error("API não disponível");

    const produtos = await res.json();

    if (!produtos.length) {
      container.innerHTML = `<p>Produtos em breve...</p>`;
      return;
    }

    container.innerHTML = produtos.map(criarCardProduto).join("");

  } catch (erro) {
    console.log("Sem API ainda, usando modo local");

    // PRODUTOS DE TESTE (enquanto não conecta Mongo)
    const produtosFake = [
      {
        nome: "SSD 480GB",
        descricao: "Deixe seu PC muito mais rápido",
        preco: 300,
        precoPromo: 199,
        imagem: "",
        link: "https://wa.me/5534999046747",
        destaque: true,
        estoque: true
      },
      {
        nome: "Memória RAM 8GB",
        descricao: "Mais desempenho nos jogos e programas",
        preco: 250,
        precoPromo: 180,
        imagem: "",
        link: "https://wa.me/5534999046747",
        destaque: false,
        estoque: true
      }
    ];

    container.innerHTML = produtosFake.map(criarCardProduto).join("");
  }
}

// Criar card do produto
function criarCardProduto(p) {
  return `
    <div class="card-produto">

      <div class="produto-img ${!p.imagem ? "sem-imagem" : ""}">
        ${p.imagem ? `<img src="${p.imagem}" />` : "Sem imagem"}
      </div>

      <div class="produto-info">

        <div class="badges-produto">
          ${p.destaque ? `<span class="badge destaque">Destaque</span>` : ""}
          ${p.estoque ? `<span class="badge estoque">Em estoque</span>` : ""}
        </div>

        <h3>${p.nome}</h3>
        <p>${p.descricao}</p>

        <div class="produto-precos">
          ${
            p.preco
              ? `<span class="preco-antigo">R$ ${p.preco}</span>`
              : ""
          }
          <span class="preco-promocional">R$ ${p.precoPromo || p.preco}</span>
        </div>

        <div class="produto-acoes">
          <a href="${p.link || "#"}" target="_blank" class="btn-comprar">
            Comprar
          </a>
        </div>

      </div>
    </div>
  `;
}

// Inicializar
carregarProdutos();