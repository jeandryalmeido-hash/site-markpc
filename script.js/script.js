const produtosGrid = document.getElementById("produtos-grid");

function formatarPreco(valor) {
  if (valor === null || valor === undefined || valor === "") return "";
  const numero = Number(valor);
  if (Number.isNaN(numero)) return "";
  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function criarCardProduto(produto) {
  const card = document.createElement("article");
  card.className = "product-card";

  const badges = [];
  if (produto.destaque) badges.push(`<span class="badge badge-primary">Destaque</span>`);
  if (produto.emEstoque) {
    badges.push(`<span class="badge badge-success">Em estoque</span>`);
  } else {
    badges.push(`<span class="badge badge-danger">Sem estoque</span>`);
  }

  const precoNormal = produto.preco ? `<span class="price-normal">${formatarPreco(produto.preco)}</span>` : "";
  const precoPromo = produto.precoPromocional
    ? `<span class="price-promo">${formatarPreco(produto.precoPromocional)}</span>`
    : produto.preco
      ? `<span class="price-promo">${formatarPreco(produto.preco)}</span>`
      : "";

  const linkBotao = produto.linkCompra && produto.linkCompra.trim() !== ""
    ? produto.linkCompra
    : "https://wa.me/5500000000000?text=Olá%20tenho%20interesse%20neste%20produto";

  card.innerHTML = `
    <div class="product-image-wrap">
      <img
        class="product-image"
        src="${produto.imagem || "https://via.placeholder.com/600x400?text=Produto"}"
        alt="${produto.nome}"
      />
      <div class="product-badges">${badges.join("")}</div>
    </div>

    <div class="product-content">
      <span class="product-category">${produto.categoria || "Categoria"}</span>
      <h3 class="product-title">${produto.nome || "Produto sem nome"}</h3>
      <div class="product-description">${produto.descricao || "Sem descrição cadastrada."}</div>

      <div class="price-row">
        ${precoNormal}
        ${precoPromo}
      </div>

      <div class="stock-text ${produto.emEstoque ? "" : "out"}">
        ${produto.emEstoque ? "Disponível para compra" : "Produto indisponível no momento"}
      </div>

      <a class="btn btn-primary" href="${linkBotao}" target="_blank" rel="noopener noreferrer">
        Comprar / chamar
      </a>
    </div>
  `;

  return card;
}

async function carregarProdutos() {
  if (!produtosGrid) return;

  produtosGrid.innerHTML = `<div class="empty-card">Carregando produtos...</div>`;

  try {
    const resposta = await fetch("/api/listar");
    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.erro || "Erro ao listar produtos");
    }

    const produtos = Array.isArray(dados.produtos) ? dados.produtos : [];
    const visiveis = produtos.filter((produto) => !produto.oculto);

    if (visiveis.length === 0) {
      produtosGrid.innerHTML = `<div class="empty-card">Nenhum produto cadastrado ainda.</div>`;
      return;
    }

    produtosGrid.innerHTML = "";
    visiveis.forEach((produto) => {
      produtosGrid.appendChild(criarCardProduto(produto));
    });
  } catch (error) {
    console.error(error);
    produtosGrid.innerHTML = `<div class="empty-card">Erro ao carregar produtos.</div>`;
  }
}

document.addEventListener("DOMContentLoaded", carregarProdutos);