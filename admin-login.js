const formLoginAdmin = document.getElementById("form-login-admin");
const mensagemLoginAdmin = document.getElementById("mensagem-login-admin");

const USUARIO_ADMIN = "admin";
const SENHA_ADMIN = "1290";

function setMensagemLogin(texto, tipo = "neutro") {
  mensagemLoginAdmin.className = `status-box ${tipo}`;
  mensagemLoginAdmin.textContent = texto;
}

formLoginAdmin.addEventListener("submit", (event) => {
  event.preventDefault();

  const usuario = document.getElementById("loginUsuario").value.trim();
  const senha = document.getElementById("loginSenha").value.trim();

  if (usuario === USUARIO_ADMIN && senha === SENHA_ADMIN) {
    localStorage.setItem("markpc_admin_logado", "true");
    setMensagemLogin("Login realizado com sucesso.", "sucesso");
    window.location.href = "admin.html";
    return;
  }

  setMensagemLogin("Usuário ou senha incorretos.", "erro");
});