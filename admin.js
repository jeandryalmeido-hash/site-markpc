const formProduto = document.getElementById("form-produto");
const listaAdminProdutos = document.getElementById("lista-admin-produtos");
const mensagemAdmin = document.getElementById("mensagem-admin");
const btnTestarConexao = document.getElementById("btn-testar-conexao");
const statusConexao = document.getElementById("status-conexao");
const btnRecarregar = document.getElementById("btn-recarregar");

const API_SALVAR = "/api/salvar";
const API_LISTAR = "/api/listar";
const API_DELETAR = "/api/deletar";
const API_TESTAR = "/api/testar-conexao";

function setMensagem(texto, tipo = "neutro") {
  mensagemAdmin.className = `status-box ${tipo}`;
  mensagemAdmin.textContent = texto;
}

function setStatusConexao(texto, tipo = "neutro") {
  statusConexao.className = `status-box ${tipo}`;
  statusConexao.textContent = texto;
}

function formatarPreco(valor) {
  if (valor === null || valor === undefined || valor === "") return "Não informado";
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function criarCardAdmin(produto) {
  return `
    <div class="item-admin-produto">
      <div class="item-admin-produto-topo">
        <div>
          <h3>${produto.nome || "Sem nome"}</h3>
          <p>${produto.descricao || "Sem descrição"}</p>
        </div>

        <button
          class="btn-excluir"
          type="button"
          onclick="deletarProduto('${produto._id}')"
        >
          Excluir
        </button>
      </div>

      <div class="item-admin-meta">
        ${produto.categoria ? `<span class="badge">${produto.categoria}</span>` : ""}
        ${produto.destaque ? `<span class="badge destaque">Destaque</span>` : ""}
        ${produto.emEstoque ? `<span class="badge estoque">Em estoque</span>` : ""}
        ${produto.oculto ? `<span class="badge">Oculto</span>` : ""}
      </div>

      <div class="item-admin-meta">
        <span class="badge">Preço: ${formatarPreco(produto.preco)}</span>
        <span class="badge">Promo: ${formatarPreco(produto.precoPromocional)}</span>
      </div>

      ${
        produto.linkCompra
          ? `<div class="item-admin-meta">
               <a class="btn btn-secundario" href="${produto.linkCompra}" target="_blank">Abrir link</a>
             </div>`
          : ""
      }
    </div>
  `;
}

async function carregarProdutosAdmin() {
  listaAdminProdutos.innerHTML = `<div class="produto-admin-vazio">Carregando produtos...</div>`;

  try {
    const resposta = await fetch(API_LISTAR);
    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.erro || "Erro ao listar produtos");
    }

    if (!Array.isArray(dados) || dados.length === 0) {
      listaAdminProdutos.innerHTML = `<div class="produto-admin-vazio">Nenhum produto cadastrado ainda.</div>`;
      return;
    }

    listaAdminProdutos.innerHTML = dados.map(criarCardAdmin).join("");
  } catch (erro) {
    console.error(erro);
    listaAdminProdutos.innerHTML = `
      <div class="produto-admin-vazio">
        Não foi possível carregar os produtos.
      </div>
    `;
  }
}

async function salvarProduto(evento) {
  evento.preventDefault();

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

  if (!produto.nome || !produto.descricao) {
    setMensagem("Preencha pelo menos nome e descrição.", "erro");
    return;
  }

  try {
    setMensagem("Salvando produto...", "neutro");

    const resposta = await fetch(API_SALVAR, {
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

    setMensagem("Produto salvo com sucesso.", "sucesso");
    formProduto.reset();
    document.getElementById("emEstoque").checked = true;

    await carregarProdutosAdmin();
  } catch (erro) {
    console.error(erro);
    setMensagem(`Erro ao salvar: ${erro.message}`, "erro");
  }
}

async function deletarProduto(id) {
  const confirmar = window.confirm("Tem certeza que deseja excluir este produto?");
  if (!confirmar) return;

  try {
    const resposta = await fetch(`${API_DELETAR}?id=${id}`, {
      method: "DELETE"
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.erro || "Erro ao deletar produto");
    }

    setMensagem("Produto excluído com sucesso.", "sucesso");
    await carregarProdutosAdmin();
  } catch (erro) {
    console.error(erro);
    setMensagem(`Erro ao excluir: ${erro.message}`, "erro");
  }
}

async function testarConexao() {
  try {
    setStatusConexao("Testando conexão com MongoDB...", "neutro");

    const resposta = await fetch(API_TESTAR);
    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.erro || "Falha na conexão");
    }

    setStatusConexao("Conexão com MongoDB funcionando.", "sucesso");
  } catch (erro) {
    console.error(erro);
    setStatusConexao(`Erro na conexão: ${erro.message}`, "erro");
  }
}

formProduto.addEventListener("submit", salvarProduto);
btnTestarConexao.addEventListener("click", testarConexao);
btnRecarregar.addEventListener("click", carregarProdutosAdmin);

carregarProdutosAdmin();const formServico = document.getElementById("form-servico");
const mensagemServico = document.getElementById("mensagem-servico");
const listaAdminServicos = document.getElementById("lista-admin-servicos");
const btnRecarregarServicos = document.getElementById("btn-recarregar-servicos");

const API_SALVAR_SERVICO = "/api/salvar-servico";
const API_LISTAR_SERVICO = "/api/listar-servico";
const API_DELETAR_SERVICO = "/api/deletar-servico";

function setMensagemServico(texto, tipo = "neutro") {
  if (!mensagemServico) return;
  mensagemServico.className = `status-box ${tipo}`;
  mensagemServico.textContent = texto;
}

function criarCardServicoAdmin(servico) {
  return `
    <div class="item-admin-produto">
      <div class="item-admin-produto-topo">
        <div>
          <h3>${servico.nome || "Sem nome"}</h3>
          <p>${servico.descricao || "Sem descrição"}</p>
        </div>

        <button
          class="btn-excluir"
          type="button"
          onclick="deletarServico('${servico._id}')"
        >
          Excluir
        </button>
      </div>

      <div class="item-admin-meta">
        ${servico.destaque ? `<span class="badge destaque">Destaque</span>` : ""}
        ${servico.valor ? `<span class="badge estoque">R$ ${servico.valor}</span>` : ""}
      </div>

      ${
        servico.link
          ? `<div class="item-admin-meta">
               <a class="btn btn-secundario" href="${servico.link}" target="_blank">Abrir link</a>
             </div>`
          : ""
      }
    </div>
  `;
}

async function carregarServicosAdmin() {
  if (!listaAdminServicos) return;

  listaAdminServicos.innerHTML = `<div class="produto-admin-vazio">Carregando serviços...</div>`;

  try {
    const resposta = await fetch(API_LISTAR_SERVICO);
    const dados = await resposta.json();

    if (!Array.isArray(dados) || dados.length === 0) {
      listaAdminServicos.innerHTML = `<div class="produto-admin-vazio">Nenhum serviço cadastrado ainda.</div>`;
      return;
    }

    listaAdminServicos.innerHTML = dados.map(criarCardServicoAdmin).join("");
  } catch (erro) {
    listaAdminServicos.innerHTML = `<div class="produto-admin-vazio">Não foi possível carregar os serviços.</div>`;
  }
}

async function salvarServico(evento) {
  evento.preventDefault();

  const servico = {
    nome: document.getElementById("servicoNome").value.trim(),
    descricao: document.getElementById("servicoDescricao").value.trim(),
    imagem: document.getElementById("servicoImagem").value.trim(),
    valor: document.getElementById("servicoValor").value,
    link: document.getElementById("servicoLink").value.trim(),
    destaque: document.getElementById("servicoDestaque").checked
  };

  if (!servico.nome || !servico.descricao) {
    setMensagemServico("Preencha nome e descrição do serviço.", "erro");
    return;
  }

  try {
    const resposta = await fetch(API_SALVAR_SERVICO, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(servico)
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.erro || "Erro ao salvar serviço");
    }

    setMensagemServico("Serviço salvo com sucesso.", "sucesso");
    formServico.reset();
    await carregarServicosAdmin();
  } catch (erro) {
    setMensagemServico(`Erro ao salvar serviço: ${erro.message}`, "erro");
  }
}

async function deletarServico(id) {
  const confirmar = window.confirm("Tem certeza que deseja excluir este serviço?");
  if (!confirmar) return;

  try {
    const resposta = await fetch(`${API_DELETAR_SERVICO}?id=${id}`, {
      method: "DELETE"
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.erro || "Erro ao deletar serviço");
    }

    setMensagemServico("Serviço excluído com sucesso.", "sucesso");
    await carregarServicosAdmin();
  } catch (erro) {
    setMensagemServico(`Erro ao excluir serviço: ${erro.message}`, "erro");
  }
}

if (formServico) {
  formServico.addEventListener("submit", salvarServico);
}

if (btnRecarregarServicos) {
  btnRecarregarServicos.addEventListener("click", carregarServicosAdmin);
}

carregarServicosAdmin();
window.deletarServico = deletarServico;