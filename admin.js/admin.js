const produtoForm = document.getElementById("produto-form");
const statusBox = document.getElementById("status");
const listaAdmin = document.getElementById("admin-produtos-lista");
const btnAtualizarLista = document.getElementById("btn-atualizar-lista");
const btnTestarConexao = document.getElementById("btn-testar-conexao");

function setStatus(texto, tipo = "normal") {
  if (!statusBox) return;

  statusBox.textContent = texto;

  if (tipo === "erro") {
    statusBox.style.borderColor = "rgba(239,68,68,0.5)";
    statusBox.style.color = "#fecaca";
  } else if (tipo === "sucesso") {
    statusBox.style.borderColor = "rgba(34,197,94,0.5)";
    statusBox.style.color = "#bbf7d0";
  } else {
    statusBox.style.borderColor = "rgba(255,255,255,0.08)";
    statusBox.style.color = "#aab4c5";
  }
}

function formatarPreco(valor) {
  if (valor === null || valor === undefined || valor === "") return "—";
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

async function listarProdutosAdmin() {
  if (!listaAdmin) return;

  listaAdmin.innerHTML = `<div class="empty-card">Carregando lista...</div>`;

  try {
    const resposta = await fetch("/api/listar");
    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.erro || "Erro ao carregar lista");
    }

    const produtos = Array.isArray(dados.produtos) ? dados.produtos : [];

    if (produtos.length === 0) {
      listaAdmin.innerHTML = `<div class="empty-card">Nenhum produto cadastrado.</div>`;
      return;
    }

    listaAdmin.innerHTML = "";

    produtos.forEach((produto) => {
      const item = document.createElement("div");
      item.className = "admin-product-item";

      item.innerHTML = `
        <img
          class="admin-product-thumb"
          src="${produto.imagem || "https://via.placeholder.com/300x300?text=Produto"}"
          alt="${produto.nome || "Produto"}"
        />

        <div class="admin-product-info">
          <h3>${produto.nome || "Sem nome"}</h3>
          <p><strong>Categoria:</strong> ${produto.categoria || "—"}</p>
          <p><strong>Preço:</strong> ${formatarPreco(produto.preco)}</p>
          <p><strong>Promoção:</strong> ${formatarPreco(produto.precoPromocional)}</p>
          <p><strong>Estoque:</strong> ${produto.emEstoque ? "Sim" : "Não"}</p>
          <p><strong>Oculto:</strong> ${produto.oculto ? "Sim" : "Não"}</p>
          <p><strong>Destaque:</strong> ${produto.destaque ? "Sim" : "Não"}</p>
        </div>

        <div class="admin-product-actions">
          <button class="btn delete-btn" data-id="${produto._id}">Excluir</button>
        </div>
      `;
      listaAdmin.appendChild(item);
    });

    listaAdmin.querySelectorAll(".delete-btn").forEach((botao) => {
      botao.addEventListener("click", async () => {
        const id = botao.dataset.id;
        const confirmar = window.confirm("Deseja excluir este produto?");
        if (!confirmar) return;

        try {
          setStatus("Excluindo produto...");
          const resposta = await fetch("/api/deletar", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ id })
          });

          const dados = await resposta.json();

          if (!resposta.ok) {
            throw new Error(dados.erro || "Erro ao excluir produto");
          }

          setStatus("Produto excluído com sucesso.", "sucesso");
          listarProdutosAdmin();
        } catch (error) {
          console.error(error);
          setStatus(error.message || "Erro ao excluir.", "erro");
        }
      });
    });
  } catch (error) {
    console.error(error);
    listaAdmin.innerHTML = `<div class="empty-card">Erro ao carregar a lista.</div>`;
    setStatus(error.message || "Erro ao carregar produtos.", "erro");
  }
}

if (produtoForm) {
  produtoForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const produto = {
      nome: document.getElementById("nome").value.trim(),
      categoria: document.getElementById("categoria").value.trim(),
      imagem: document.getElementById("imagem").value.trim(),
      descricao: document.getElementById("descricao").value.trim(),
      preco: document.getElementById("preco").value,
      precoPromocional: document.getElementById("precoPromocional").value,
      linkCompra: document.getElementById("linkCompra").value.trim(),
      destaque: document.getElementById("destaque").checked,
      oculto: document.getElementById("oculto").checked,
      emEstoque: document.getElementById("emEstoque").checked
    };

    try {
      setStatus("Salvando produto...");

      const resposta = await fetch("/api/salvar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || "Erro ao salvar produto");
      }

      setStatus("Produto salvo com sucesso.", "sucesso");
      produtoForm.reset();
      document.getElementById("emEstoque").checked = true;
      listarProdutosAdmin();
    } catch (error) {
      console.error(error);
      setStatus(error.message || "Erro ao salvar produto.", "erro");
    }
  });
}

if (btnAtualizarLista) {
  btnAtualizarLista.addEventListener("click", listarProdutosAdmin);
}

if (btnTestarConexao) {
  btnTestarConexao.addEventListener("click", async () => {
    try {
      setStatus("Testando conexão com MongoDB...");
      const resposta = await fetch("/api/testar-conexao");
      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || "Falha no teste");
      }

      setStatus(dados.mensagem || "Conexão OK.", "sucesso");
    } catch (error) {
      console.error(error);
      setStatus(error.message || "Erro no teste de conexão.", "erro");
    }
  });
}

document.addEventListener("DOMContentLoaded", listarProdutosAdmin);